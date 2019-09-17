import {getUidFromUsername, checkIfFollower} from './authActions';

/**
 * Create new post for current user
 * @param {Object} post - Post object with fields: type, title, desc, author, time, content
 * @param {File[]} files - Array of files to include, can be null
 */
export const createUserPost = (post, files) => {
    return(dispatch, getStore, {getFirestore}) => {
        const db = getFirestore();
        const uid = getStore().firebase.auth.uid;

        // add post to user's post collection
        var userPostCollection = db.collection("users").doc(uid).collection("posts");
        userPostCollection.add(post)
            .then((callback) => {
                var path = callback.path;
                var postId = callback.id;
                
                // Tag post with id
                post.id = postId;
                post.likeCount = 0;
                post.commentCount = 0;

                userPostCollection.doc(postId).update(post);

                /** Create post snapshots */
                dispatch(createPostSnap(uid, postId, path));
                dispatch(createTopicSnap(uid, postId, path, post.topic))

                // upload images to storage if necessary
                if(post.type === "image" || post.type === "album") {
                    dispatch(uploadPostImages(postId, files));
                }

                dispatch({type: 'USER_POST_SUCCESS'});
            })
            .catch(err => dispatch({type: 'USER_POST_ERR', err}));
    }
}

/**
 * Uploads images for post at given postId parameter
 * @param {string} postId - Post ID to associate with images
 * @param {File[]} files - Files to attach to post 
 */
const uploadPostImages = (postId, files) => {
    return(dispatch, getStore, {getFirebase}) => {
        const firebase = getFirebase();
        // get reference for post image storage folder
        var postStorageRef = firebase.storage().ref().child("posts/" + postId + "/");
        // loop through files and upload
        for(var i = 0; i < files.length; i++) {
            postStorageRef.child(i.toString()).put(files[i])
            // catch errors from uploading file
            .catch(err => console.log(err));
        }
    }
}

/**
 * Gets download url of single file of post
 * @param {string} postId - Post id to retrieve file download url from
 */
export const getSingleFileURLFromPostId = (postId) => {
    return(dispatch, getStore, {getFirebase}) => {
        return new Promise((resolve, reject) => {
            const firebase = getFirebase();

            firebase.storage().ref().child("posts/" + postId + "/0").getDownloadURL()
                .then(url => {
                    return resolve(url);
                })
                // catch downlaodURL errors
                .catch(err => {
                    return reject(err);
                });
        });
        
    }
}

/**
 * Create snap of post at given path
 * @param {string} uid - User's user id
 * @param {string} postId - Id of post to add
 */
const createPostSnap = (uid, postId, path) => {
    return(dispatch, getStore, {getFirestore}) => {
        const db = getFirestore();

        // get post data for snapshot
        db.doc(path).get()
            // create and update snap in database
            .then(post => {
                if(post.exists) {
                    post = post.data();

                    // create post snap object with given info
                    var postSnap = {
                        postId,
                        uid,
                        path,
                        time: post.time,
                        topic: post.topic
                    }

                    // add postSnap to database under new id
                    db.collection("posts").add(postSnap)
                        .then(callback => {
                            console.log(callback);
                        })
                        // created snap, dispatch successful
                        .then(dispatch({type: 'POST_SNAP_SUCCESS'}))
                        // catch errors assoc. with adding new postSnap document
                        .catch(err => dispatch({type: 'POST_SNAP_ERR', err}));
                } else {
                    dispatch({type: 'POST_SNAP_ERR', err: {message: 'Path does not exist.'}});
                }
                
            })
            // catch errors associated with getting doc from path
            .catch(err => dispatch({type: 'POST_SNAP_ERR', err}));
    }
}

/**
 * Creates snapshot for this topic, referencing the post of a user
 * @param {string} uid - user's user id
 * @param {string} postId - post's id
 * @param {string} path - path of post in db
 * @param {string} topic - string name of topic 
 */
const createTopicSnap = (uid, postId, path, topic) => {
    return(dispatch, getStore, {getFirestore}) => {

        /** no topic if not filled */
        if(!topic || topic === "") {
            return;
        }

        const db = getFirestore();

        /** get post at path for data */
        db.doc(path).get()
            .then(post => {
                if(post.exists) {
                    post = post.data();

                    /** Create postsnap in regular format */
                    var postSnap = {
                        postId,
                        uid,
                        path,
                        time: post.time,
                        topic: post.topic
                    }

                    /** sanity check: ensure lower case before searching / adding to snapshot */
                    topic = topic.toLowerCase();

                    /** find matching topic string in db */
                    db.collection("topics").where("name", "==", topic).get()
                        .then(matchingTopics => {
                            /** Check for new topic case */
                            if(matchingTopics.empty) {
                                /** creat new topic */
                                dispatch(createTopic(topic))
                                    .then(id => {
                                        /** Add snapshot to newly created topic */
                                        db.doc("topics/" + id).collection("posts").add(postSnap);
                                    });
                            } else {
                                /** at least one matching topic in docs, always take first */
                                db.doc("topics/" + matchingTopics.docs[0].id)
                                /** add new post snapshot to posts collection under topic */
                                .collection("posts").add(postSnap);
                            }
                        });
                }
            });
    }
}

/**
 * Updates feed for user at given id
 * @param {string} uid - User's user id 
 */
export const updateFeed = () => {
    return(dispatch, getStore, {getFirestore}) => {
        dispatch({type: 'CLEAR_FEED'});

        const db = getFirestore();
        // get postSnap collection
        db.collection("posts").orderBy("time", "desc").get()
            .then(async (snapshot) => {
                // loop through post snapshots to build post array
                // using forEach to avoid functions in loops
                for(var i = 0; i < snapshot.docs.length; i++) {
                    var postSnap = snapshot.docs[i].data();

                    /** check if current user has permission to acces post */
                    await addPostSnapToFeedWithPerms(dispatch, postSnap);
                    
                }
            })
            // catch errors assoc. with getting postSnap collection data
            .catch(err => dispatch({type: 'FEED_UPDATE_ERR', err}));
    }
}

/**
 * Take postSnap and add to end of user's content feed
 * @param {function} dispatch - dispatch function for calling independently
 * @param {Object} postSnap - Post snap object linking to post to add 
 */
const addPostSnapToFeedWithPerms = async(dispatch, postSnap) => {
    await dispatch(currentUserHasPermissions(postSnap))
        .then((userHasPerms) => {
            if (userHasPerms) {
                // get post represented by postSnap
                dispatch(getPost(postSnap.path))
                    .then(post => {
                        // set id field for post
                        post.id = postSnap.postId;
                        // update feed
                        dispatch({ type: 'ADD_POST_TO_FEED', post });
                    })
                    // catch errors from getPost function
                    .catch(err => dispatch({ type: 'FEED_UPDATE_ERR', err }));
            }

        });
}

/**
 * Resolves with boolean of whether user has access to this post
 * @param {Object} postSnap - postSnap object of post to access
 */
const currentUserHasPermissions = (postSnap) => {
    return(dispatch, getStore, {getFirestore}) => {
        return new Promise((resolve, reject) => {

            const auth = getStore().firebase.auth;

            /** If author of post, has permission to view */
            if(auth.uid === postSnap.uid) {
                return resolve(true);
            }

            /** If following user, has access to post */
            dispatch(checkIfFollower(postSnap.uid))
                .then(isFollowing => {

                    /** Can determine permissions states here */
                    if(isFollowing) {
                        return resolve(true);
                    }

                    return resolve(false);
                });
        });
    }
}

/**
 * Resolves post at given path
 * @param {string} path - String path to post
 */
const getPost = (path) => {
    return(dispatch, getStore, {getFirestore}) => {
        return new Promise((resolve, reject) => {
            const db = getFirestore();

            // get post at given path
            db.doc(path).get()
                .then(post => {
                    // if post at path exists, resolve with post value
                    if(post.exists) {
                        return resolve(post.data());
                    } else {
                        // post dne, reject
                        return reject({message: "Post does not exist."});
                    }
                    
                })
                // catch errors assoc. with getting post reference from database
                .catch(err => {
                    return reject(err);
                });
        });

    }
}

/**
 * Update posts of user for profile
 */
export const updateUserFeed = (username) => {
    return(dispatch, getStore, {getFirestore}) => {
        const db = getFirestore();
        // get uid
        dispatch(getUidFromUsername(username))
        .then(uid => {
            // Ensure user is logged in
            if(uid) {
                var userFeed = [];
                // get posts of user ordered by date
                db.collection("users").doc(uid).collection("posts").orderBy("time").get()
                    .then(snapshot => {

                        // loop through docs and push to array
                        for(var i = 0; i < snapshot.docs.length; i++) {
                            var post = snapshot.docs[i].data();
                            post.id = snapshot.docs[i].id;
                            userFeed = [post, ...userFeed];
                        }
                        dispatch({type: 'USER_FEED_UPDATE', userFeed});
                    })
                    // catch errors assoc. with getting user's posts collection
                    .catch(err => dispatch({type: 'USER_FEED_UPDATE_ERR', err}));
            } else {
                dispatch({type: 'USER_FEED_UPDATE_ERR', err: {message: "User not logged in."}});
            }
        })
        .catch(err => dispatch({type: 'USER_FEED_UPDATE_ERR', err}));
        
    }
}

/**
 * Return post with matching id, guaranteed resolve, null or non-null
 * @param {string} id 
 */
export const getPostByID = (id) => {
    return(dispatch, getStore, {getFirestore}) => {
        return new Promise((resolve, reject) => {
            const db = getFirestore();
            const postSnapCollection = db.collection("posts");
    
            // query postSnaps for field with matching id
            postSnapCollection.where("postId", "==", id).get()
                .then(postSnaps => {
                    if(postSnaps.empty) {
                        return resolve(null);
                    }
                    
                    var requestedPostSnap = postSnaps.docs[0].data();
                    dispatch(getPost(requestedPostSnap.path))
                        .then(post => {
                            return resolve(post);
                        });

                })
                // if error in finding post, resolve with null value
                .catch(err => {
                    return resolve(null);
                })
        })
    }
}

/**
 * Adds comment from current user to post at given id
 * @param {string} postId - Id of post to attach comment to
 * @param {string} comment - comment to attach to post
 */
export const addUserComment = (postId, comment) => {
 return(dispatch, getStore, {getFirestore}) => {
    return new Promise((resolve, reject) => {
        const uid = getStore().firebase.auth.uid;
        const db = getFirestore();
        
        var commentObject = {
            comment,
            uid,
            likeCount: 0,
            time: new Date()
        }

        dispatch(getPostPathByID(postId))
            .then(path => {
                const commentCollection = db.doc(path).collection("comments");
                
                commentCollection.add(commentObject)
                    .then(callback => {
                        /** attach assigned id to comment */
                        commentObject.id = callback.id

                        commentCollection.doc(callback.id).set(commentObject);
                        return resolve();
                    });
            });
    });
    
    
 }
}

/**
 * Get all comments in array form from
 * @param {returns all comments attached to post} postId 
 */
export const getComments = (postId) => {
    return(dispatch, getStore, {getFirestore}) => {
        return new Promise((resolve, reject) => {
            const db = getFirestore();

            // get path post, then add comment with reference
            dispatch(getPostPathByID(postId))
                .then(path => {
                    if(!path) {
                        return resolve(null);
                    }

                    /** get collection of comments */
                    db.doc(path).collection("comments").orderBy("time", "desc").get()
                        .then(callback => {
                            if(callback.empty) {
                                return resolve(null);
                            }
                            /** if docs exist, build into array with map */
                            return resolve(callback.docs.map(doc => doc.data()));
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
        });
    }
}

/**
 * Returns string path to post in firestore when given post id
 * @param {string} id - Post's id
 */
const getPostPathByID = (id) => {
    return(dispatch, getStore, {getFirestore}) => {
        return new Promise((resolve, reject) => {
            const db = getFirestore();

            /** find post from querying post snapshots */
            db.collection("posts").where("postId", "==", id).get()
                .then(callback => {
                    if(callback.empty) {
                        return resolve(null);
                    }

                    return resolve(callback.docs[0].data().path);
                });
        });
        
    }
}

/**
 * Deletes post, if current user is owner of post. Returns true if deleted, false if not
 * @param {string} id - id of post to delete 
 */
export const deletePost = (id) => {
    return(dispatch, getStore, {getFirestore}) => {
        return new Promise((resolve, reject) => {
            const db = getFirestore();
            const postSnapCollection = db.collection("posts");

            /** query db for posts */
            postSnapCollection.where("postId", "==", id).get()
                .then(postSnaps => {
                    if(postSnaps.empty) {
                        return resolve(false);
                    }

                    /** get postSnap for this post */
                    var postSnap = postSnaps.docs[0].data();

                    /** Get post to determine type, and whether media needs to be deleted */
                    db.doc(postSnap.path).get()
                        .then(post => {
                            post = post.data();
                            
                            /** decide if image is to be removed, then remove post */
                            dispatch(contentDeleteSwitcher(post.type, id))
                                .then(() => {
                                    /** delete snapshot stored with topic */
                                    dispatch(deleteTopicSnapshot(postSnap));

                                    /** delete doc at postSnap */
                                    db.doc(postSnap.path).delete()
                                    .then(() => {
                                        // delete postSnap doc by reference
                                        db.collection("posts").doc(postSnaps.docs[0].id).delete()
                                            .then(() => {return resolve(true)});
                                    });
                                });
                            });
            });
        });
        
    }
}

/**
 * Deletes the copy of this snapshot stored with the topic
 * @param {Object} postSnap - post snapshot object to search for and delete
 */
const deleteTopicSnapshot = (postSnap) => {
    return(dispatch, getStore, {getFirestore}) => {
        if(!postSnap || postSnap.length === 0) {
            return;
        }

        const db = getFirestore();

        /** query for topics */
        db.collection("topics").where("name", "==", postSnap.topic).get()
            .then(query => {
                /** case could not find  */
                if(query.empty) {
                    console.log("Warning: could not find topic to delete snapshot from");
                    return;
                }

                /** find snapshot within the topic collection */
                var topicRef = db.doc("topics/" + query.docs[0].id);
                topicRef.collection("posts").where("postId", "==", postSnap.postId).get()
                    .then(query => {
                        if(query.empty) {
                            console.log("Warning: could  not find post snapshot to delete within topic")
                            return;
                        }
                        /** delete first snapshot in array */
                        topicRef.collection("posts").doc(query.docs[0].id).delete();
                    })
            })
    }
}

/**
 * Decides which type of content to delete, and calls method to delete
 * given content
 * @param {string} type 
 * @param {string} id 
 */
const contentDeleteSwitcher = (type, id) => {
    return(dispatch, getStore) => {
        return new Promise((resolve, reject) => {

            /** choose method based on type */
            switch(type) {
                case "image" || "video":
                    dispatch(deleteSingleFile(id))
                        .then(() => {return resolve()})
                        .catch(err => {
                            console.log(err);
                            return resolve(null);
                        });
                    break;
                default:
                    return resolve();
            }
        });
    }
}

/**
 * Delete file from post with given id
 * @param {string} id - string of post to delete images
 */
const deleteSingleFile = (id) => {
    return(dispatch, getStore, {getFirebase}) => {
        return new Promise((resolve, reject) => {
            console.log("Deleting file");
            const storageRef = getFirebase().storage().ref();
            dispatch(getPostByID(id))
                .then(post => {
                    if(post === null) {
                        return reject({message: "Post does not exist"});
                    }
                    /** delete first image file attached to post, should always be 1 for this type */
                    storageRef.child("posts/" + id + "/0").delete().then(() => {return resolve()});
                })
            
        });
    }
}

/**
 * Creates new topic schema in database
 * @param {string} name - name to provide for new topic 
 */
const createTopic = (name) => {
    return(dispatch, getStore, {getFirestore}) => {
        return new Promise(resolve => {
            const db = getFirestore();

            var topic = {
                name,
                desc: "No description has been posted."
            }

            /** create new collection  */
            db.collection("topics").add(topic)
                .then(callback => {
                    topic = Object.assign(topic, {id: callback.id});
                    /** add topic id to object */
                    db.doc("topics/" + callback.id).set(topic)
                        /** resolve once id complete */
                        .then(() => {return resolve(callback.id)});
                });
        });
    }
}
