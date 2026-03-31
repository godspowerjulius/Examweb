/* ============================================
   NIGERIAN EXAM PORTAL - AUTH SYSTEM (FIXED)
   ============================================ */

// Harmonized keys to match your HTML files
const USERS_KEY = "examPortalUsers";
const CURRENT_USER_KEY = "examPortalCurrentUser"; 

// ============================================
// USER HELPERS
// ============================================
function getAllUsers() {
    return getFromStorage(USERS_KEY, []);
}

function saveUsers(users) {
    saveToStorage(USERS_KEY, users);
}

function getCurrentUser() {
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

function generateUserId() {
    return "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

function sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// REGISTER USER
// ============================================
function registerUser(userData) {
    const users = getAllUsers();

    const fullName = (userData.fullName || "").trim();
    const username = (userData.username || "").trim().toLowerCase();
    const email = (userData.email || "").trim().toLowerCase();
    const password = userData.password || "";
    const level = (userData.level || "").trim();

    if (!fullName || !username || !email || !password) {
        return { success: false, message: "Please fill all required fields." };
    }

    if (!validateEmail(email)) {
        return { success: false, message: "Please enter a valid email address." };
    }

    if (users.some(u => u.username === username)) {
        return { success: false, message: "Username already exists." };
    }

    const newUser = {
        id: generateUserId(),
        fullName,
        username,
        email,
        password, // In a real app, this would be hashed
        level,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, message: "Registration successful!" };
}

// ============================================
// LOGIN USER
// ============================================
function loginUser(username, password) {
    const users = getAllUsers();
    const user = users.find(u => 
        u.username === username.toLowerCase() && u.password === password
    );

    if (user) {
        const safeUser = sanitizeUser(user);
        saveToStorage(CURRENT_USER_KEY, safeUser);
        return { success: true, user: safeUser };
    }

    return { success: false, message: "Invalid username or password." };
}

// ============================================
// LOGOUT
// ============================================
function logoutUser() {
    removeFromStorage(CURRENT_USER_KEY);
    removeFromStorage("activeExamSession");
    window.location.href = "login.html";
}