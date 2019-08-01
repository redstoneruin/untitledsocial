/**
 * Create new post for current user
 */
export const createUserPost = (post) => {
    return(dispatch, getStore, {getFirebase, getFirestore}) => {
        const db = getFirestore();

        // add post to user's post collection
        db.collection("users").doc(getStore().firebase.auth.uid).collection("posts").add(post)
        .then((callback) => {
            console.log(callback);
            dispatch({type: 'USER_POST_SUCCESS'});
        })
        .catch(err => dispatch({type: 'USER_POST_ERR', err}));
    }
}