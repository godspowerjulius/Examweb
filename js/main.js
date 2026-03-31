/* ============================================
   NIGERIAN EXAM PORTAL - MAIN UTILITIES
   ============================================ */

// ============================================
// STORAGE HELPERS (ONLY ONE DEFINITION)
// ============================================
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Storage error:', e);
        return false;
    }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Storage error:', e);
        return defaultValue;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Storage remove error:', e);
        return false;
    }
}

function clearStorageKey(key) {
    return removeFromStorage(key);
}

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toastContainer');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed top-20 right-3 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const icons = {
        success: 'fa-check-circle text-green-500',
        error: 'fa-times-circle text-red-500',
        warning: 'fa-exclamation-triangle text-yellow-500',
        info: 'fa-info-circle text-blue-500'
    };

    toast.className = `flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-lg border-l-4 transform translate-x-full transition-transform duration-300`;
    toast.style.borderLeftColor =
        type === 'success' ? '#10b981' :
        type === 'error' ? '#ef4444' :
        type === 'warning' ? '#f59e0b' : '#3b82f6';

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info} text-lg"></i>
        <span class="text-sm text-gray-700">${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });

    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================
// FORM UTILITIES
// ============================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ============================================
// FORMATTING UTILITIES
// ============================================
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getInitials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// ============================================
// EXAM CATEGORY DATA
// ============================================
const examCategories = {
    ijmb: {
        name: 'IJMB',
        fullName: 'Interim Joint Matriculation Board',
        description: 'Advanced level program for university admission',
        color: 'from-blue-500 to-blue-700',
        icon: 'fa-university',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government'],
        duration: '1 Year Program'
    },
    waec: {
        name: 'WAEC',
        fullName: 'West African Examinations Council',
        description: 'Senior Secondary Certificate Examination',
        color: 'from-green-500 to-green-700',
        icon: 'fa-certificate',
        subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics'],
        duration: 'May/June & Nov/Dec'
    },
    jamb: {
        name: 'JAMB',
        fullName: 'Joint Admissions and Matriculation Board',
        description: 'Unified Tertiary Matriculation Examination (UTME)',
        color: 'from-purple-500 to-purple-700',
        icon: 'fa-laptop',
        subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'],
        duration: 'Computer-Based Test'
    },
    neco: {
        name: 'NECO',
        fullName: 'National Examinations Council',
        description: 'Senior School Certificate Examination',
        color: 'from-orange-500 to-orange-700',
        icon: 'fa-award',
        subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Government'],
        duration: 'June/July & Nov/Dec'
    },
    'post-utme': {
        name: 'Post-UTME',
        fullName: 'Post Unified Tertiary Matriculation Examination',
        description: 'University screening examination',
        color: 'from-red-500 to-red-700',
        icon: 'fa-school',
        subjects: ['English', 'Mathematics', 'General Knowledge'],
        duration: 'Varies by Institution'
    },
    'other-exams': {
        name: 'Other Exams',
        fullName: 'Additional Nigerian Examinations',
        description: 'NABTEB, JUPEB, Scholarship & Entrance Exams',
        color: 'from-teal-500 to-teal-700',
        icon: 'fa-ellipsis-h',
        subjects: ['Various Subjects'],
        duration: 'Varies'
    }
};

function getExamCategory(key) {
    return examCategories[key] || examCategories['other-exams'];
}

// ============================================
// LEVEL NAME MAPPING
// ============================================
const levelNames = {
    'jss1': 'JSS 1',
    'jss2': 'JSS 2',
    'jss3': 'JSS 3',
    'sss1': 'SSS 1',
    'sss2': 'SSS 2',
    'sss3': 'SSS 3',
    'jamb': 'JAMB Candidate',
    'waec': 'WAEC Candidate',
    'neco': 'NECO Candidate',
    'ijmb': 'IJMB Student',
    'other': 'Other'
};

function getLevelName(level) {
    return levelNames[level] || level || 'Not specified';
}

// ============================================
// SHUFFLE ARRAY (Fisher-Yates)
// ============================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// SCROLL TO TOP
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function observeElements(selector, callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) callback(entry.target);
        });
    }, { ...defaultOptions, ...options });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    return observer;
}

// ============================================
// DEBOUNCE & THROTTLE
// ============================================
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// MOBILE DETECTION
// ============================================
function isMobile() {
    return window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ============================================
// LOADER HELPERS
// ============================================
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
}

// ============================================
// SMOOTH SCROLL TO SECTION
// ============================================
function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// APP INITIALIZATION
// ============================================
function initializeApp() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});