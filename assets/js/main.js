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
        const menuToggles = document.querySelectorAll('#menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuClose = document.getElementById('menu-close');

        if (!mobileMenu) return;

        menuToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                mobileMenu.classList.remove('hidden');
                // Force reflow
                mobileMenu.offsetHeight;
                mobileMenu.classList.remove('translate-x-full');
            });
        });

        menuClose?.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        });

        // Close menu on link click
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            });
        });
    };

    // Header Scroll Effects
    const initHeaderScroll = () => {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('glass', 'py-2', 'bg-white/90', 'dark:bg-gray-800/90', 'shadow-lg');
                header.classList.remove('py-4');
            } else {
                header.classList.remove('glass', 'py-2', 'bg-white/90', 'dark:bg-gray-800/90', 'shadow-lg');
                header.classList.add('py-4');
            }
        });
    };

    // Sidebar Toggle Logic (for mobile)
    const initSidebarToggle = () => {
        const sidebarToggles = document.querySelectorAll('#sidebar-toggle');
        const sidebar = document.getElementById('client-sidebar') || document.getElementById('admin-sidebar');

        if (!sidebar || sidebarToggles.length === 0) return;

        sidebarToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = sidebar.classList.contains('-translate-x-full');

                if (isHidden) {
                    sidebar.classList.remove('-translate-x-full');
                    sidebar.classList.add('translate-x-0');
                } else {
                    sidebar.classList.remove('translate-x-0');
                    sidebar.classList.add('-translate-x-full');
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024) { // lg breakpoint
                if (!sidebar.contains(e.target) && !sidebar.classList.contains('-translate-x-full')) {
                    sidebar.classList.add('-translate-x-full');
                    sidebar.classList.remove('translate-x-0');
                }
            }
        });
    };

    // Notification Toggle Logic
    const initNotification = () => {
        const notificationBtn = document.getElementById('notification-btn');
        const notificationDropdown = document.getElementById('notification-dropdown');

        if (!notificationBtn || !notificationDropdown) return;

        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.add('hidden');
            }
        });

        // Mark all read logic
        const markReadBtn = Array.from(notificationDropdown.querySelectorAll('button')).find(btn => btn.textContent.trim().toLowerCase() === 'mark all read');

        if (markReadBtn) {
            markReadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Remove badge
                const badge = notificationBtn.querySelector('.bg-primary.rounded-full');
                if (badge) {
                    badge.classList.add('hidden');
                }

                // Show feedback (simulated toast)
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
                toast.textContent = 'All notifications marked as read';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            });
        }
    };

    // Run Initializers
    initTheme();
    initRTL();
    initSidebarToggle();
    initMobileMenu();
    initHeaderScroll();
    initNotification();
};

document.addEventListener('DOMContentLoaded', initApp);
