// js/guard.js
// Route Protection Guard - Handles all URL access restrictions

const PUBLIC_ROUTES = ['index.html', 'login.html', 'register.html', 'forgot-password.html'];
const PROTECTED_ROUTES = [
  'dashboard.html',
  'jamb.html',
  'waec.html',
  'neco.html',
  'ijmb.html',
  'post-utme.html',
  'other-exams.html',
  'profile.html',
  'results.html'
];

function getCurrentPageFromURL() {
  const pathname = window.location.pathname;
  return pathname.split('/').pop() || 'index.html';
}

function protectRoute() {
  const currentPage = getCurrentPageFromURL();
  const user = getCurrentUser();

  console.log('🔐 Route Guard Check:', {
    page: currentPage,
    isLoggedIn: !!user,
    isPublic: PUBLIC_ROUTES.includes(currentPage),
    isProtected: PROTECTED_ROUTES.includes(currentPage)
  });

  // ❌ User NOT logged in + trying to access protected page = REDIRECT
  if (PROTECTED_ROUTES.includes(currentPage) && !user) {
    console.warn('🚫 Unauthorized access to protected route:', currentPage);
    window.location.replace('login.html');
    return false;
  }

  // ✅ User logged in + trying to access login/register = REDIRECT to dashboard
  if (['login.html', 'register.html'].includes(currentPage) && user) {
    console.log('✅ Already logged in, redirecting to dashboard');
    window.location.replace('dashboard.html');
    return false;
  }

  // ✅ Access granted
  console.log('✅ Route access allowed');
  return true;
}

// RUN THE PROTECTION IMMEDIATELY
protectRoute();