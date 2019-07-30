const initState = {
    authError: null
}

const authReducer = (state = initState, action) => {
    switch(action.type) {
        case 'SIGNUP_SUCCESS':
            return {
                ...state,
                authError: null
            }
        
        case 'SIGNUP_ERR':
            return {
                ...state,
                authError: action.err.message
            }

        default:
            return state;
    }
}

export default authReducer;