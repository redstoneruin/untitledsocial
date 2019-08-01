import authReducer from './authReducer';
import postReducer from './postReducer';

import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase'

/**
 * Combines reducers to form central redux store
 */
const rootReducer = combineReducers({
    auth: authReducer,
    posts: postReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
})

export default rootReducer;