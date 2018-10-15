import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import { composeWithDevTools } from "redux-devtools-extension";
import firebaseConfig from "./config/private/firebaseConfig";

// Reducers
// @todo

// react-redux-firebase config
const rrfConfig = {
    userProfile: "users",
    useFirestoreForProfile: true
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);
// Init firestore
const firestore = firebase.firestore();

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig) // firebase instance as first argument
    // reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer // <- needed if using firestore
});

// Create initial state
const initState = {};

// Create store
const store = createStoreWithFirebase(
    rootReducer,
    initState,
    composeWithDevTools(reactReduxFirebase(firebase))
);

export default store;