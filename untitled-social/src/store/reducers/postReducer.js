/**
 * Initial state of posts store
 */
const initState = {
    feed: [],
    userFeed: null,
    userPostError: null,
    postSnapError: null,
    feedUpdateError: null,
    userPostsError: null
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

        case 'FEED_UPDATE':
            return {
                ...state,
                feed: action.feed,
                feedUpdateError: null
            }

        case 'FEED_UPDATE_ERR':
            return {
                ...state,
                feedUpdateError: action.err.message
            }

        case 'CLEAR_FEED':
            return {
                ...state,
                feed: [],
                feedUpdateError: null
            }

        case 'USER_FEED_UPDATE':
            return {
                ...state,
                userFeed: action.userFeed,
                userFeedError: null
            }

        case 'USER_FEED_UPDATE_ERR':
            return {
                ...state,
                userFeedError: action.err.message
            }

        case 'ADD_POST_TO_FEED':
            return {
                ...state,
                feed: [...state.feed, action.post],
                feedUpdateError: null
            }

        default:
            return state;
    }
}

export default postReducer;