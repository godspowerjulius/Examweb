/* ============================================
   AUTHENTICATION SYSTEM - FIREBASE VERSION
   ============================================ */

import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from './firebase-config.js';

const USERS_COLLECTION = "users";
const CURRENT_USER_KEY = "examPortalCurrentUser";

// ============================================
// GLOBAL USER STATE
// ============================================
let currentUser = null;

// Monitor authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User logged in:", user.email);
        try {
            const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
            if (userDoc.exists()) {
                currentUser = { 
                    uid: user.uid, 
                    email: user.email,
                    ...userDoc.data() 
                };
                saveToStorage(CURRENT_USER_KEY, currentUser);
                console.log("Current user:", currentUser);
            } else {
                console.log("User document not found");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    } else {
        console.log("User logged out");
        currentUser = null;
        removeFromStorage(CURRENT_USER_KEY);
    }
});

// ============================================
// GET CURRENT USER
// ============================================
function getCurrentUser() {
    if (currentUser) return currentUser;
    return getFromStorage(CURRENT_USER_KEY);
}

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// ============================================
// REGISTER USER
// ============================================
async function registerUser(userData) {
    try {
        const { fullName, username, email, password, level } = userData;

        // Validate inputs
        if (!fullName || !username || !email || !password) {
            return { success: false, message: "Please fill all required fields." };
        }

        if (!validateEmail(email)) {
            return { success: false, message: "Please enter a valid email address." };
        }

        if (password.length < 6) {
            return { success: false, message: "Password must be at least 6 characters." };
        }

        // Check if username already exists
        const usernameQuery = query(
            collection(db, USERS_COLLECTION), 
            where("username", "==", username.toLowerCase())
        );
        const usernameSnapshot = await getDocs(usernameQuery);
        
        if (!usernameSnapshot.empty) {
            return { success: false, message: "Username already taken." };
        }

        // Create Firebase Auth user
        const authResult = await createUserWithEmailAndPassword(auth, email, password);
        const uid = authResult.user.uid;

        // Create user document in Firestore
        const userDataFull = {
            uid: uid,
            fullName: fullName.trim(),
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            level: level || "SSS 3",
            isAdmin: false,
            role: 'user',
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
            profilePicture: null,
            bio: "",
            phone: "",
            examsTaken: 0,
            totalScore: 0,
            averageScore: 0
        };

        await setDoc(doc(db, USERS_COLLECTION, uid), userDataFull);

        // Update local current user
        currentUser = { uid, ...userDataFull };
        saveToStorage(CURRENT_USER_KEY, currentUser);

        console.log("User registered successfully:", email);
        return { success: true, message: "Registration successful!", user: currentUser };
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: "Email already registered." };
        }
        if (error.code === 'auth/weak-password') {
            return { success: false, message: "Password is too weak. Use at least 6 characters." };
        }
        if (error.code === 'auth/invalid-email') {
            return { success: false, message: "Invalid email address." };
        }
        
        return { success: false, message: error.message };
    }
}

// ============================================
// LOGIN USER
// ============================================
async function loginUser(emailOrUsername, password) {
    try {
        let email = emailOrUsername;

        // If input looks like username, find the email
        if (!emailOrUsername.includes('@')) {
            const usernameQuery = query(
                collection(db, USERS_COLLECTION),
                where("username", "==", emailOrUsername.toLowerCase())
            );
            const snapshot = await getDocs(usernameQuery);
            
            if (snapshot.empty) {
                return { success: false, message: "User not found." };
            }
            
            email = snapshot.docs[0].data().email;
        }

        // Sign in with Firebase
        const authResult = await signInWithEmailAndPassword(auth, email, password);
        const uid = authResult.user.uid;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
        
        if (!userDoc.exists()) {
            return { success: false, message: "User data not found." };
        }

        const userData = { uid: uid, email: authResult.user.email, ...userDoc.data() };
        
        // Update last active time
        await updateDoc(doc(db, USERS_COLLECTION, uid), {
            lastActive: serverTimestamp()
        });

        // Update local current user
        currentUser = userData;
        saveToStorage(CURRENT_USER_KEY, currentUser);

        console.log("User logged in successfully:", email);
        return { success: true, user: userData };
    } catch (error) {
        console.error('Login error:', error);
        
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            return { success: false, message: "Invalid email or password." };
        }
        if (error.code === 'auth/too-many-requests') {
            return { success: false, message: "Too many login attempts. Try again later." };
        }
        if (error.code === 'auth/invalid-email') {
            return { success: false, message: "Invalid email address." };
        }
        
        return { success: false, message: error.message };
    }
}

// ============================================
// LOGOUT USER
// ============================================
async function logoutUser() {
    try {
        await signOut(auth);
        currentUser = null;
        removeFromStorage(CURRENT_USER_KEY);
        removeFromStorage("currentExamSession");
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'error');
    }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================
async function makeUserAdmin(userId) {
    try {
        await updateDoc(doc(db, USERS_COLLECTION, userId), {
            isAdmin: true,
            role: 'admin'
        });
        showToast('User promoted to admin', 'success');
        return { success: true, message: "User promoted to admin" };
    } catch (error) {
        console.error('Error promoting user:', error);
        return { success: false, message: error.message };
    }
}

async function removeAdminRole(userId) {
    try {
        await updateDoc(doc(db, USERS_COLLECTION, userId), {
            isAdmin: false,
            role: 'user'
        });
        showToast('Admin role removed', 'success');
        return { success: true, message: "Admin role removed" };
    } catch (error) {
        console.error('Error removing admin role:', error);
        return { success: false, message: error.message };
    }
}

// ============================================
// UPDATE USER PROFILE
// ============================================
async function updateUserProfile(updates) {
    try {
        const userId = currentUser?.uid;
        if (!userId) {
            return { success: false, message: "User not logged in" };
        }

        // Don't allow changing uid or email
        const { uid, email, ...safeUpdates } = updates;

        await updateDoc(doc(db, USERS_COLLECTION, userId), safeUpdates);

        // Update local current user
        currentUser = { ...currentUser, ...safeUpdates };
        saveToStorage(CURRENT_USER_KEY, currentUser);

        showToast('Profile updated successfully', 'success');
        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
        return { success: false, message: error.message };
    }
}

// ============================================
// GET ALL USERS
// ============================================
async function getAllUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ uid: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isAdmin() {
    const user = getCurrentUser();
    return user?.isAdmin === true || user?.role === 'admin';
}

// Export all functions
export {
    getCurrentUser,
    checkAuth,
    registerUser,
    loginUser,
    logoutUser,
    makeUserAdmin,
    removeAdminRole,
    updateUserProfile,
    getAllUsers,
    isAdmin,
    validateEmail,
    auth
};