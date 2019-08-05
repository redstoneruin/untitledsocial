/**
 * Initial state of posts store
 */
const initState = {
    userPosts: null,
    userPostError: null,
    postSnapError: null
}

/**
 * Redux reducer for post functions
 * @param {Object} state - Updated state of the auth store
 * @param {Object} action - Action object with type
 */
const postReducer = (state = initState, action) => {
    switch(action.type) {
        case 'POST_SNAP_SUCCESS':
            return {
                ...state,
                postSnapError: null
            }

        case 'POST_SNAP_ERR':
            console.log(action.err);
            return {
                ...state,
                postSnapError: action.err.message
            }

        case 'USER_POST_SUCCESS':
            return {
                ...state,
                userPostError: null
            }

        case 'USER_POST_ERR':
            return {
                ...state,
                userPostError: action.err.message
            }

        case 'UPDATE_USER_POSTS':
            return {
                ...state,
                userPosts: action.userPosts
            }

        default:
            return state;
    }
}

export default postReducer;