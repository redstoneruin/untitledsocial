/**
 * Initial state of authentication store
 */
const initState = {
    authError: null,
    loadedProfile: null,
    userLoadError: null,
    profileUpdateError: null
}

/**
 * Redux reducer for authentication and profile functions
 * @param {Object} - Updated state of the auth store
 * @param {action} - Action object with type
 */
const authReducer = (state = initState, action) => {
    var authError;
    switch(action.type) {
        case 'PROFILE_UPDATE_SUCCESS':
            return {
                ...state,
                profileUpdateError: null
            }

        case 'PROFILE_UPDATE_ERR':
            return {
                ...state,
                profileUpdateError: action.err.message
            }

        // Loading user in store for viewing profile, expects user field
        case 'USER_LOADED':
            return {
                ...state,
                loadedProfile: action.user,
                userLoadError: null
            }

        case 'USER_LOAD_ERR':
            return {
                ...state,
                loadedProfile: null,
                userLoadError: action.err.message
            }

        case 'CLEAR_USER_LOAD_ERR':
            return {
                ...state,
                userLoadError: null
            }

        case 'SIGNUP_SUCCESS':
            return {
                ...state,
                authError: null
            }
        
        case 'SIGNUP_ERR':
            authError = action.err.message;
            if(action.err.code === 'auth/email-already-in-use') {
                authError = 'Email already in use';
            }
            return {
                ...state,
                authError
            }
        
        case 'SIGNOUT_SUCCESS':
            return {
                ...state,
                authError: null
            }

        case 'SIGNOUT_ERR':
            return {
                ...state,
                authError: action.err.message
            }

        case 'LOGIN_SUCCESS':
            return {
                ...state,
                authError: null
            }

        case 'LOGIN_ERR':
            authError = action.err.message;
            if(action.err.code === 'auth/user-not-found') {
                authError = 'User not found';
            } else if(action.err.code === 'auth/wrong-password') {
                authError = 'Incorrect password';
            }
            return {
                ...state,
                authError
            }

        case 'CLEAR_AUTH_ERR':
            return {
                ...state,
                authError: null
            }

        default:
            return state;
    }
}

export default authReducer;