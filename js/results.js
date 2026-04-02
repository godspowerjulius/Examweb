// js/results.js

// Import the Firebase library
import firebase from 'firebase/app';
import 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    databaseURL: 'YOUR_DATABASE_URL',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Save exam results to Firebase
export const saveExamResult = (studentId, subject, score) => {
    const resultsRef = firebase.database().ref('results');
    const result = {
        studentId,
        subject,
        score,
        timestamp: new Date().toISOString()
    };
    resultsRef.push(result);
};

// Retrieve exam results from Firebase
export const getExamResults = async () => {
    const resultsRef = firebase.database().ref('results');
    const snapshot = await resultsRef.once('value');
    const results = snapshot.val() || {};
    return Object.values(results);
};
