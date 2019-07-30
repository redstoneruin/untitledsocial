/**
 * Sign up new user with email and password
 * @param {*} newUser - Object containing username, email and password string fields
 */
export const signUp = (newUser) => {
    return(dispatch, getStore, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const db = getFirestore();

        // Create new user with authentication
        firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        // Attach displayname to firebase user document
        .then(response => {
            console.log("Auth response:")
            console.log(response);
            db.collection('users').doc(response.user.uid).set({
                username: newUser.username
            })
            // TODO: remove test code
            .then(response => {
                console.log("Firestore response:");
                console.log(response);
            })
            // signup successful
            .then(dispatch({type: 'SIGNUP_SUCCESS'}))
            // catch errors associated with posting data to firestore
            .catch(err => dispatch({type: 'SIGNUP_ERR', err}));
        })
        // catch errors associated with authenticating user
        .catch(err => dispatch({type: 'SIGNUP_ERR', err}));
        
    }
}