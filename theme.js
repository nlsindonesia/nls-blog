// Immediate theme initialization to prevent flash
(function() {
    try {
        const savedTheme = localStorage.getItem('nls_theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        console.error('Error initializing theme', e);
    }
})();

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-toggle-dark-icon').forEach(function(icon) {
        if (isDark) {
            icon.classList.add('hidden');
        } else {
            icon.classList.remove('hidden');
        }
    });
    document.querySelectorAll('.theme-toggle-light-icon').forEach(function(icon) {
        if (isDark) {
            icon.classList.remove('hidden');
        } else {
            icon.classList.add('hidden');
        }
    });
    
    // Update tooltips / titles
    document.querySelectorAll('.theme-toggle-btn').forEach(function(btn) {
        btn.setAttribute('title', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
        btn.setAttribute('aria-label', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
    });
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
        localStorage.setItem('nls_theme', isDark ? 'dark' : 'light');
    } catch (e) {}
    updateThemeIcons();
}

// Attach event listeners when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeButtons);
} else {
    initThemeButtons();
}

function initThemeButtons() {
    updateThemeIcons();
    document.querySelectorAll('.theme-toggle-btn').forEach(function(btn) {
        // remove existing listeners if any
        btn.removeEventListener('click', toggleTheme);
        btn.addEventListener('click', toggleTheme);
    });
}
