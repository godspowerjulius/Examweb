/* ============================================
   NIGERIAN EXAM PORTAL - NAVIGATION SYSTEM
   ============================================ */

console.log("navigation.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and navigation.js initializing");
    initializeNavigation();
    updateNavigationForUser();
});

function initializeNavigation() {
    setupMobileMenu();
    setupActiveNavLinks();
    setupLogoutButtons();
    setupProtectedNavLinks();
}

// ============================================
// MOBILE MENU
// ============================================
function setupMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!menuBtn || !mobileMenu) {
        console.log("Mobile menu elements not found");
        return;
    }

    console.log("Setting up mobile menu");

    menuBtn.addEventListener("click", () => {
        console.log("Mobile menu button clicked");
        mobileMenu.classList.toggle("hidden");
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll("a, button").forEach(link => {
        link.addEventListener("click", () => {
            console.log("Menu item clicked, closing mobile menu");
            mobileMenu.classList.add("hidden");
        });
    });

    // Close on resize above mobile
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            mobileMenu.classList.add("hidden");
        }
    });
}

// ============================================
// ACTIVE PAGE HIGHLIGHT
// ============================================
function setupActiveNavLinks() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    console.log("Current page:", currentPage);
    
    const navLinks = document.querySelectorAll("a[data-nav-link]");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (href === currentPage) {
            link.classList.add("text-indigo-600", "font-semibold");
            link.classList.remove("text-gray-700");
        } else {
            link.classList.remove("text-indigo-600", "font-semibold");
            link.classList.add("text-gray-700");
        }
    });
}

// ============================================
// LOGOUT BUTTONS
// ============================================
function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll("[data-logout]");
    console.log("Found", logoutButtons.length, "logout buttons");

    logoutButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Logout clicked");

            const confirmed = confirm("Are you sure you want to logout?");
            if (!confirmed) return;

            // Try different logout methods
            if (typeof logoutUser === "function") {
                logoutUser();
            } else if (typeof logout === "function") {
                logout();
            } else {
                // Manual logout
                removeFromStorage("examPortalCurrentUser");
                showToast("Logged out successfully", "info");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            }
        });
    });
}

// ============================================
// PROTECTED NAVIGATION LINKS
// ============================================
function setupProtectedNavLinks() {
    const protectedLinks = document.querySelectorAll("[data-protected-link]");
    console.log("Found", protectedLinks.length, "protected links");

    protectedLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const user = getNavUser();
            console.log("Protected link clicked, user:", user);

            if (!user) {
                e.preventDefault();
                showToast("Please login to access this page", "warning");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 500);
            }
        });
    });
}

// ============================================
// USER NAV UI UPDATE
// ============================================
function updateNavigationForUser() {
    const user = getNavUser();
    console.log("Updating nav for user:", user);

    const guestOnly = document.querySelectorAll("[data-guest-only]");
    const userOnly = document.querySelectorAll("[data-user-only]");
    const usernameEls = document.querySelectorAll("[data-username]");
    const initialsEls = document.querySelectorAll("[data-user-initials]");

    console.log("Guest elements:", guestOnly.length, "User elements:", userOnly.length);

    if (user) {
        // User is logged in
        guestOnly.forEach(el => {
            el.classList.add("hidden");
            el.style.display = "none";
        });
        userOnly.forEach(el => {
            el.classList.remove("hidden");
            el.style.display = "";
        });

        usernameEls.forEach(el => {
            el.textContent = user.fullName || user.username || "Student";
        });

        initialsEls.forEach(el => {
            el.textContent = getInitials(user.fullName || user.username || "S");
        });

        console.log("User logged in - guest hidden, user shown");
    } else {
        // User is NOT logged in
        guestOnly.forEach(el => {
            el.classList.remove("hidden");
            el.style.display = "";
        });
        userOnly.forEach(el => {
            el.classList.add("hidden");
            el.style.display = "none";
        });

        console.log("User not logged in - guest shown, user hidden");
    }
}

// ============================================
// SAFE USER GETTER
// ============================================
function getNavUser() {
    try {
        if (typeof getCurrentUser === "function") {
            return getCurrentUser();
        }

        if (typeof getFromStorage === "function") {
            return getFromStorage("examPortalCurrentUser");
        }

        return null;
    } catch (e) {
        console.error("Error getting user:", e);
        return null;
    }
}