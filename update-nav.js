// Run this in browser console to test, or use in build process
const navItems = document.querySelectorAll('a[data-nav-link]');
const navContainer = navItems[navItems.length - 1]?.parentElement;

if (navContainer) {
    const studyLink = document.createElement('a');
    studyLink.href = 'cbt-study.html';
    studyLink.className = 'text-gray-700 hover:text-green-600 transition text-sm font-medium flex items-center gap-1';
    studyLink.innerHTML = '<i class="fas fa-book"></i> Study';
    navContainer.appendChild(studyLink);
}
