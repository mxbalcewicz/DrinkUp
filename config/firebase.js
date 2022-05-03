// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';

import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

import Constants from 'expo-constants';
// import firestore from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId
};

// let Firebase;

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig); 
}

// firebase.initializeApp(firebaseConfig);
firebase.firestore();
firebase.auth();

export default firebase;