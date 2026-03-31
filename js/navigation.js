/* ============================================
   NIGERIAN EXAM PORTAL - NAVIGATION SYSTEM
   ============================================ */

console.log("navigation.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    initializeNavigation();
    updateNavigationForUser();
});

function initializeNavigation() {
    setupMobileMenu();
    setupActiveNavLinks();
    setupLogoutButtons();
    setupProtectedNavLinks();
    setupExamCategoryNavigation();
}

// ============================================
// MOBILE MENU
// ============================================
function setupMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
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
    const navLinks = document.querySelectorAll("a[data-nav-link]");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (href === currentPage) {
            link.classList.add("text-blue-600", "font-semibold");
            link.classList.remove("text-gray-700");
        } else {
            link.classList.remove("text-blue-600", "font-semibold");
        }
    });
}

// ============================================
// LOGOUT BUTTONS
// ============================================
function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll("[data-logout]");

    logoutButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const confirmed = confirm("Are you sure you want to logout?");
            if (!confirmed) return;

            if (typeof logout === "function") {
                logout();
            } else if (typeof logoutUser === "function") {
                logoutUser();
            } else {
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

    protectedLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const user = getNavUser();

            if (!user) {
                e.preventDefault();
                showToast("Please login to continue", "warning");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            }
        });
    });
}

// ============================================
// EXAM CATEGORY NAVIGATION
// ============================================
function setupExamCategoryNavigation() {
    const examLinks = document.querySelectorAll("[data-exam-link]");

    examLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const examType = link.dataset.examLink;
            if (!examType) return;

            navigateToExamSection(examType);
        });
    });
}

function navigateToExamSection(examType) {
    const validExamTypes = [
        "ijmb",
        "waec",
        "jamb",
        "neco",
        "post-utme",
        "other-exams"
    ];

    if (!validExamTypes.includes(examType)) {
        showToast("Invalid exam category", "error");
        return;
    }

    saveToStorage("selectedExamCategory", examType);
    window.location.href = `exam-category.html?type=${encodeURIComponent(examType)}`;
}

// ============================================
// USER NAV UI UPDATE
// ============================================
function updateNavigationForUser() {
    const user = getNavUser();

    const guestOnly = document.querySelectorAll("[data-guest-only]");
    const userOnly = document.querySelectorAll("[data-user-only]");
    const usernameEls = document.querySelectorAll("[data-username]");
    const initialsEls = document.querySelectorAll("[data-user-initials]");

    if (user) {
        guestOnly.forEach(el => el.classList.add("hidden"));
        userOnly.forEach(el => el.classList.remove("hidden"));

        usernameEls.forEach(el => {
            el.textContent = user.fullName || user.username || "Student";
        });

        initialsEls.forEach(el => {
            el.textContent = getInitials(user.fullName || user.username || "S");
        });
    } else {
        guestOnly.forEach(el => el.classList.remove("hidden"));
        userOnly.forEach(el => el.classList.add("hidden"));
    }
}

// ============================================
// SAFE USER GETTER
// ============================================
function getNavUser() {
    if (typeof getCurrentUser === "function") {
        return getCurrentUser();
    }

    if (typeof getFromStorage === "function") {
        return getFromStorage("examPortalCurrentUser");
    }

    return null;
}