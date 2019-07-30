import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyBLzwxiK_ExZrx6tRu1gfOkCFlxac66z8w",
    authDomain: "untitled-social.firebaseapp.com",
    databaseURL: "https://untitled-social.firebaseio.com",
    projectId: "untitled-social",
    storageBucket: "untitled-social.appspot.com"
};

firebase.initializeApp(firebaseConfig);

export default firebase;