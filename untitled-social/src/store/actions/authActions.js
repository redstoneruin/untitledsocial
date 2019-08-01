/**
 * Sign up new user with email and password
 * @param {*} newUser - Object containing username, email and password string fields
 */
export const signUp = (newUser) => {
    return(dispatch, getStore, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const db = getFirestore();

        db.collection("users").where("username", "==", newUser.username).get()
        .then(snapshot => {
            // If user found, cannot create new user
            if(!snapshot.empty) {
                dispatch({type: 'SIGNUP_ERR', err: {message: "Username already exists"}});
            } else {
                // Create new user with authentication
                firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                // Attach displayname to firebase user document
                .then(response => {
                    console.log("Auth response:")
                    console.log(response);
                    db.collection('users').doc(response.user.uid).set({
                        username: newUser.username
                    })
                    // signup successful
                    .then(dispatch({type: 'SIGNUP_SUCCESS'}))
                    // catch errors associated with posting data to firestore
                    .catch(err => dispatch({type: 'SIGNUP_ERR', err}));
                })
                // catch errors associated with authenticating user
                .catch(err => dispatch({type: 'SIGNUP_ERR', err}));
            }
        })
        // Catch errors associated with finding user document
        .catch(err => dispatch({type: 'SIGNUP_ERR', err}));
    }
}

/**
 * Sign in user with email and password
 * @param {*} user - Object containing email and password
 */
export const signIn = (user) => {
    return(dispatch, getStore, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const db = getFirestore();
        // sign in user with email and password given
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        // dispatch success
        .then((response) => {
            db.collection("users").doc(response.user.uid).get().then(user => {
                if(user) {
                    dispatch({type: 'LOGIN_SUCCESS'});
                } else {
                    dispatch({type: 'LOGIN_ERR', err: {message: 'User data does not exist'}})
                }
            })
        })
        // catch errors associated with signing in
        .catch(err => dispatch({type: 'LOGIN_ERR', err}))
    }
}

/**
 * Sign out currently logged in user
 */
export const signOut = () => {
    return(dispatch, getStore, {getFirebase}) => {
        const firebase = getFirebase();

        // sign out with firebase
        firebase.auth().signOut()
        // dispatch successful signout
        .then(dispatch({type: 'SIGNOUT_SUCCESS'}))
        // catch errors associated with signing out
        .catch(err => dispatch({type: 'SIGNOUT_ERR', err}));
    }
}

/**
 * clear authentication errors
 */
export const clearAuthError = () => {
    return(dispatch, getStore) => {
        dispatch({type: 'CLEAR_AUTH_ERR'});
    }
}

/**
 * Load user data into auth reducer by username,
 * without access to uid
 */
export const getProfileByUsername = (username) => {
    return(dispatch, getStore, {getFirestore}) => {

        const db = getFirestore();

        db.collection("users").where("username", "==", username).get()
        // Get profile data after async query
        .then(querySnapshot => {
            if(querySnapshot.empty) {
                dispatch({type: 'USER_LOAD_ERR', err: {message: 'User not found'}});
            } else {
                // Dispatch to load profile into store
                querySnapshot.forEach(doc => {
                    dispatch({type: 'USER_LOADED', user: doc.data()});
                })
            }
        })
        // Catch errors associated with firestore query
        .catch(err => dispatch({type: 'USER_LOAD_ERR', err}));
    }
}