export const postTestData = (data) => {
    return(dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        firestore.collection("test").add(data)
        .then(dispatch({type: 'TEST_POST_SUCCESS'}))
        .catch(err => {
            dispatch({type: 'TEST_POST_ERR'}, err);
        });
    }
}