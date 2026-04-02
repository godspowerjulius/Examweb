/* ============================================
   AUTHENTICATION MODULE - FIREBASE
   ============================================ */

import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from './firebase-config.js';

// ============================================
// REGISTER USER
// ============================================
export async function registerUser(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: displayName || user.email,
            createdAt: new Date().toISOString()
        }));
        
        console.log('✅ User registered:', user.email);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Registration error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// LOGIN USER
// ============================================
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email,
            lastLogin: new Date().toISOString()
        }));
        
        console.log('✅ User logged in:', user.email);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Login error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// LOGOUT USER
// ============================================
export async function logoutUser() {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
        console.log('✅ User logged out');
        return { success: true };
    } catch (error) {
        console.error('❌ Logout error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// GET CURRENT USER
// ============================================
export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// ============================================
// MONITOR AUTH STATE
// ============================================
export function onAuthChange(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            callback(null);
        }
    });
}
