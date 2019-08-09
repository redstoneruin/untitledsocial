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
        db.collection("users").doc(uid).collection("posts").add(post)
            .then((callback) => {
                var path = callback.path;
                var postId = callback.id;
                // create new postSnap with post info
                dispatch(createPostSnap(uid, postId, path));

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
const createPostSnap = (uid, postId) => {
    return(dispatch, getStore, {getFirestore}) => {
        const db = getFirestore();

        // create path to document from params
        var path = 'users/' + uid +  '/posts/' + postId;

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
 * Updates feed for user at given id
 * @param {string} uid - User's user id 
 */
export const updateFeed = () => {
    return(dispatch, getStore, {getFirestore}) => {
        const db = getFirestore();
        // get postSnap collection
        db.collection("posts").orderBy("time").get()
            .then(snapshot => {
                // create feed array to return
                var feed = [];
                var snapIndex = 0;

                // loop through post snapshots to build post array
                // using forEach to avoid functions in loops
                snapshot.forEach((postSnap) => {
                    postSnap = postSnap.data();

                    // get post represented by postSnap
                    dispatch(getPost(postSnap.path))
                        .then(post => {
                            // set id field for post
                            post.id = postSnap.postId;
                            // append post to feed
                            feed = [post, ...feed];

                            // if last post in array, dispatch success
                            snapIndex++;
                            if(snapIndex === snapshot.docs.length) {
                                // feed built, add to store
                                dispatch({type: 'FEED_UPDATE', feed});
                            }
                        })
                        // catch errors from getPost function
                        .catch(err => dispatch({type: 'FEED_UPDATE_ERR', err}));
                });
            })
            // catch errors assoc. with getting postSnap collection data
            .catch(err => dispatch({type: 'FEED_UPDATE_ERR', err}));
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
 * Update posts of currently logged in user
 */
export const updateUserFeed = () => {
    return(dispatch, getStore, {getFirestore}) => {
        const db = getFirestore();
        const uid = getStore().firebase.auth.uid;
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
    }
}