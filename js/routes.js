// js/routes.js
// Route Protection - Prevents unauthorized access to protected pages

const ROUTES = {
  // Public routes (no authentication required)
  public: [
    'index.html',
    'login.html',
    'register.html',
    'forgot-password.html',
    '/'
  ],
  
  // Protected routes (authentication required)
  protected: [
    'dashboard.html',
    'jamb.html',
    'waec.html',
    'neco.html',
    'ijmb.html',
    'post-utme.html',
    'other-exams.html',
    'profile.html',
    'jamb-cbt.html',
    'waec-study.html',
    'results.html',
    'settings.html'
  ]
};

// Initialize route protection
function initRouteProtection() {
  const currentPage = getCurrentPageName();
  const user = getCurrentUser();
  const isPublicPage = ROUTES.public.includes(currentPage);
  const isProtectedPage = ROUTES.protected.includes(currentPage);

  console.log('Route Protection:', {
    currentPage,
    isAuthenticated: !!user,
    isPublicPage,
    isProtectedPage
  });

  // Scenario 1: User NOT logged in trying to access protected page
  if (!user && isProtectedPage) {
    console.warn(`[Route Protection] Unauthorized access to ${currentPage}. Redirecting to login...`);
    redirectToLogin(`Redirect from: ${currentPage}`);
    return false;
  }

  // Scenario 2: User logged in trying to access login/register pages
  if (user && (currentPage === 'login.html' || currentPage === 'register.html')) {
    console.log(`[Route Protection] Already logged in. Redirecting to dashboard...`);
    redirectToDashboard();
    return false;
  }

  // Scenario 3: Valid access
  console.log(`[Route Protection] Access granted to ${currentPage}`);
  return true;
}

// Get current page filename
function getCurrentPageName() {
  const pathname = window.location.pathname;
  return pathname.split('/').pop() || 'index.html';
}

// Redirect to login with optional message
function redirectToLogin(message = '') {
  // Store where user was trying to go
  if (message) {
    sessionStorage.setItem('redirectMessage', message);
  }
  window.location.href = 'login.html';
}

// Redirect to dashboard
function redirectToDashboard() {
  window.location.href = 'dashboard.html';
}

// Redirect to specific page
function redirectToPage(pageName) {
  window.location.href = pageName;
}

// Check if current user is authenticated
function isUserAuthenticated() {
  return getCurrentUser() !== null;
}

// Get current page name
function isCurrentPage(pageName) {
  return getCurrentPageName() === pageName;
}

// Get all protected routes
function getProtectedRoutes() {
  return ROUTES.protected;
}

// Get all public routes
function getPublicRoutes() {
  return ROUTES.public;
}

// Add new protected route
function addProtectedRoute(routeName) {
  if (!ROUTES.protected.includes(routeName)) {
    ROUTES.protected.push(routeName);
    console.log(`[Route Protection] Added protected route: ${routeName}`);
  }
}

// Remove protected route (make it public)
function removeProtectedRoute(routeName) {
  const index = ROUTES.protected.indexOf(routeName);
  if (index > -1) {
    ROUTES.protected.splice(index, 1);
    console.log(`[Route Protection] Removed protected route: ${routeName}`);
  }
}

// Log all routes
function logRoutes() {
  console.log('=== ROUTE PROTECTION ===');
  console.log('Public Routes:', ROUTES.public);
  console.log('Protected Routes:', ROUTES.protected);
  console.log('========================');
}

// Run protection on page load
document.addEventListener('DOMContentLoaded', () => {
  initRouteProtection();
});