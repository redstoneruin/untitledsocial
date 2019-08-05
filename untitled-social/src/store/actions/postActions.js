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
            dispatch(createPostSnap(uid, postId, path));
            dispatch({type: 'USER_POST_SUCCESS'});
        })
        .catch(err => dispatch({type: 'USER_POST_ERR', err}));
    }
}

/**
 * Create snap of post at given path
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