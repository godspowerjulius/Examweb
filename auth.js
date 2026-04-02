// auth.js
import firebase from 'firebase/app';
import 'firebase/auth';

// Initialize Firebase (replace with your Firebase project configuration)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Email and Password Authentication
export const registerWithEmail = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const loginWithEmail = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const logout = () => {
    return firebase.auth().signOut();
};

// Google Sign-In
export const googleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
};

// Facebook Login
export const facebookSignIn = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
};

// User Profile Management
export const updateUserProfile = (displayName, photoURL) => {
    const user = firebase.auth().currentUser;
    return user.updateProfile({
        displayName: displayName,
        photoURL: photoURL
    });
};

export const getCurrentUser = () => {
    return firebase.auth().currentUser;
};