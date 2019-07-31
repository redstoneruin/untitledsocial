const initState = {
    authError: null
}

const authReducer = (state = initState, action) => {
    var authError;
    switch(action.type) {
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