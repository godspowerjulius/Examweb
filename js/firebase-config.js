/* ============================================
   FIREBASE CONFIGURATION
   ============================================ */

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getBytes } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import { getDatabase, ref as dbRef, push, set, get, update, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
  authDomain: "ijmb-portal.firebaseapp.com",
  databaseURL: "https://ijmb-portal-default-rtdb.firebaseio.com",
  projectId: "ijmb-portal",
  storageBucket: "ijmb-portal.firebasestorage.app",
  messagingSenderId: "521270251438",
  appId: "1:521270251438:web:51c6370deb7a16551bc23f",
  measurementId: "G-3W70XRVR0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDb = getDatabase(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

console.log("Firebase initialized successfully!");

export { 
  auth, 
  db, 
  storage,
  realtimeDb,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  ref,
  uploadBytes,
  getBytes,
  dbRef,
  push,
  set,
  get,
  update,
  remove
};