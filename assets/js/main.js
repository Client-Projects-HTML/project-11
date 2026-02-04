const initApp = () => {
    const html = document.documentElement;

    // Theme Toggle Logic
    const initTheme = () => {
        const themeToggles = document.querySelectorAll('#theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';

        const applyTheme = (theme) => {
            html.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
            localStorage.setItem('theme', theme);

            // Update all toggle icons
            themeToggles.forEach(toggle => {
                const moonIcon = toggle.querySelector('.fa-moon');
                const sunIcon = toggle.querySelector('.fa-sun');
                if (theme === 'dark') {
                    moonIcon?.classList.add('hidden');
                    sunIcon?.classList.remove('hidden');
                    sunIcon?.classList.add('block');
                } else {
                    moonIcon?.classList.remove('hidden');
                    moonIcon?.classList.add('block');
                    sunIcon?.classList.add('hidden');
                }
            });
        };

        applyTheme(savedTheme);

        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                applyTheme(currentTheme === 'light' ? 'dark' : 'light');
            });
        });
    };

    // RTL Toggle Logic
    const initRTL = () => {
        const rtlToggles = document.querySelectorAll('#rtl-toggle');
        const savedDir = localStorage.getItem('dir') || 'ltr';

        const applyDir = (dir) => {
            html.setAttribute('dir', dir);
            localStorage.setItem('dir', dir);
        };

        applyDir(savedDir);

        rtlToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const currentDir = html.getAttribute('dir');
                applyDir(currentDir === 'rtl' ? 'ltr' : 'rtl');
            });
        });
    };

    // Mobile Menu Logic
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuClose = document.getElementById('menu-close');

        menuToggle?.addEventListener('click', () => {
            mobileMenu?.classList.remove('hidden');
            setTimeout(() => mobileMenu?.classList.remove('translate-x-full'), 10);
        });

        menuClose?.addEventListener('click', () => {
            mobileMenu?.classList.add('translate-x-full');
            setTimeout(() => mobileMenu?.classList.add('hidden'), 300);
        });
    };

    // Header Scroll Effects
    const initHeaderScroll = () => {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('glass', 'py-2', 'bg-white/80', 'dark:bg-gray-800/80');
                header.classList.remove('py-4');
            } else {
                header.classList.remove('glass', 'py-2', 'bg-white/80', 'dark:bg-gray-800/80');
                header.classList.add('py-4');
            }
        });
    };

    // Run Initializers
    initTheme();
    initRTL();
    initMobileMenu();
    initHeaderScroll();
};

document.addEventListener('DOMContentLoaded', initApp);
