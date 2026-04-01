/* ============================================
   NIGERIAN EXAM PORTAL - AUTH SYSTEM
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

    if (users.some(u => u.email === email)) {
        return { success: false, message: "Email already registered." };
    }

    const newUser = {
        id: generateUserId(),
        fullName,
        username,
        email,
        password, // In a real app, this would be hashed
        level,
        isAdmin: false,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
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
        (u.username === username.toLowerCase() || u.email === username.toLowerCase()) && u.password === password
    );

    if (user) {
        // Update last login
        user.lastActive = new Date().toISOString();
        saveUsers(users);

        const safeUser = sanitizeUser(user);
        // Keep admin info
        safeUser.isAdmin = user.isAdmin || false;
        safeUser.role = user.role || 'user';
        
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

// ============================================
// ADMIN ROLE MANAGEMENT
// ============================================
function isAdmin() {
    const user = getCurrentUser();
    if (!user) return false;
    return user.isAdmin === true || user.role === 'admin';
}

function checkAdminAccess() {
    if (!isAdmin()) {
        showToast('Admin access required', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return false;
    }
    return true;
}

function makeUserAdmin(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return { success: false, message: "User not found" };
    }
    
    user.isAdmin = true;
    user.role = 'admin';
    saveUsers(users);
    return { success: true, message: "User promoted to admin" };
}

function removeAdminRole(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return { success: false, message: "User not found" };
    }
    
    user.isAdmin = false;
    user.role = 'user';
    saveUsers(users);
    return { success: true, message: "Admin role removed" };
}

function updateUserProfile(userId, updates) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return { success: false, message: "User not found" };
    }
    
    // Don't allow changing password or ID
    const { password, id, ...allowedUpdates } = updates;
    Object.assign(user, allowedUpdates);
    
    saveUsers(users);
    
    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        saveToStorage(CURRENT_USER_KEY, sanitizeUser(user));
    }
    
    return { success: true, message: "Profile updated successfully" };
}

function deleteUser(userId) {
    let users = getAllUsers();
    users = users.filter(u => u.id !== userId);
    saveUsers(users);
    return { success: true, message: "User deleted" };
}