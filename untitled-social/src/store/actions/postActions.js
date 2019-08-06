/**
 * Create new post for current user
 * @param {Object} post - Post object with fields: type, title, desc, author, time, content
 */
export const createUserPost = (post) => {
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
            dispatch({type: 'USER_POST_SUCCESS'});
        })
        .catch(err => dispatch({type: 'USER_POST_ERR', err}));
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
export const updateFeed = (uid) => {
    return(dispatch, getStore, {getFirestore}) => {
        const db = getFirestore();
        // get postSnap collection
        db.collection("posts").get()
        .then(snapshot => {
            // create feed array to return
            var feed = [];
            var snapIndex = 0;
            // loop through post snapshots to build post array
            snapshot.forEach((postSnap) => {
                postSnap = postSnap.data();

                // get post represented by postSnap
                dispatch(getPost(postSnap.path))
                .then(post => {
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