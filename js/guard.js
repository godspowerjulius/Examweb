// js/guard.js
// Authentication Guard - Prevents unauthorized access to protected pages

function checkAuth() {
    // Pages that don't require authentication
    const publicPages = ['login.html', 'register.html', 'index.html', 'forgot-password.html'];
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Get current user from auth.js
    const user = getCurrentUser();
    
    // If user is NOT logged in and trying to access protected page
    if (!user && !publicPages.includes(currentPage)) {
        console.log('Unauthorized access attempt. Redirecting to login...');
        window.location.href = 'login.html';
        return false;
    }
    
    // If user IS logged in and on a public page (like login), redirect to dashboard
    if (user && publicPages.includes(currentPage)) {
        console.log('User already logged in. Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
        return false;
    }
    
    // All checks passed
    return true;
}

// Run guard immediately (don't throw, just check)
checkAuth();