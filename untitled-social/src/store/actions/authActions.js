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
                        username: newUser.username,
                        joinTime: new Date()
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
 * @param {string} username - User's username
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

/**
 * Update user's profile data with new object
 * @param {Object} profile - Profile object to replace for user (must be logged in)
 * @param {File} avatar - Profile pic file, can be null
 */
export const updateProfile = (profile, avatar) => {
    return(dispatch, getStore, {getFirestore}) => {
        // return promise to perform async functions
        return new Promise((resolve, reject) => {
            const db = getFirestore();
            var uid = getStore().firebase.auth.uid;
            var profileRef = db.collection("users").doc(uid);

            // Check if username already taken
            db.collection("users").where("username", "==", profile.username).get()
                .then(snapshot => {
                    // if username DNE or this user owns this username, allow update
                    // TODO: logic could be better
                    if (snapshot.empty || snapshot.docs[0].data().username === getStore().firebase.profile.username) {
                        // Update firestore at user reference to new object
                        profileRef.update(profile)
                        // Dispatch success after async update
                        .then(dispatch({ type: 'PROFILE_UPDATE_SUCCESS' }))
                        // resolve function
                        .then(() => {return resolve()})
                        // catch errors associated with updating
                        .catch(err => dispatch({ type: 'PROFILE_UPDATE_ERR', err }));

                        // Update profile pic if exists in method args
                        if(avatar) {
                            dispatch(updateAvatar(avatar));
                        }
                    } else {
                        var err = {message: "Username already taken."}
                        dispatch({ type: 'PROFILE_UPDATE_ERR', err });
                    }
                })
                // catch errors associated with querying
                .catch(err => dispatch({ type: 'PROFILE_UPDATE_ERR', err }));
        })
    }
}

/**
 * Updates current user's profile picture to given file
 * @param {File} avatar - Profile picture to update for user in firebase storage 
 */
const updateAvatar = (avatar) => {
    return(dispatch, getStore, {getFirebase}) => {
        const firebase = getFirebase();
        var uid = getStore().firebase.auth.uid;
        // upload file
        firebase.storage().ref().child('profiles/' + uid + '/avatar').put(avatar)
        // dispatch success on good upload
        .then(dispatch({type: 'AVATAR_UPDATE_SUCCESS'}))
        // catch file upload errors
        .catch(err => dispatch({type: 'AVATAR_UPDATE_ERR', err}));
    }
}

/**
 * Get downlaod URL for avatar of user at uid, null if dne
 * @param {string} uid - User's user id 
 */
export const getAvatarURLFromUid = (uid) => {
    return(dispatch, getStore, {getFirebase}) => {
        return new Promise((resolve, reject) => {
            const firebase = getFirebase();

            // get reference to user's avatar file
            var avatarRef = firebase.storage().ref().child('profiles/' + uid + '/avatar')
            if(avatarRef.empty) {
                return resolve(null);
            } else {
                // if image exists, get download url
                avatarRef.getDownloadURL()
                .then(url => {
                    // return url
                    return resolve(url);
                })
                .catch(err => {
                    return reject(err);
                })
            }
        });
    }
}

/**
 * Returns username of user at given uid
 * @param {string} uid - User's user id
 */
export const getUsernameFromUid = (uid) => {
    return(dispatch, getStore, {getFirestore}) => {
        // Return promise that resolves with username
        return new Promise((resolve, reject) => {
            const db = getFirestore();

            // get user document at uid
            db.collection("users").doc(uid).get()
            // resolve with user's username
            .then(user => {
                if(!user.empty) {
                    return resolve(user.data().username);
                } else {
                    return resolve("unknown user");
                }
            })
            // catch errors from getting user document
            .catch(err => {
                return reject(err)
            });
        })
        
        
    }
}

/**
* Clears current profile update error
*/
export const clearProfileUpdateError = () => {
    return (dispatch) => {
        dispatch({ type: 'PROFILE_UPDATE_SUCCESS' });
    }
}
