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

        const updateHeader = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', updateHeader);
        // Run once on load
        updateHeader();
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

    // Toast Utility
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-fade-in flex items-center gap-3 font-bold text-white ${type === 'success' ? 'bg-green-500' : 'bg-primary'
            }`;

        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(message));

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-4');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    // Sidebar Contact Logic
    const initSidebarContact = () => {
        const contactForms = document.querySelectorAll('form');
        contactForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (!submitBtn || !(submitBtn.textContent.toLowerCase().includes('contact') || submitBtn.textContent.toLowerCase().includes('send'))) return;

                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"]');

                if (emailInput && emailInput.value) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                    setTimeout(() => {
                        showToast('Message sent! Our experts will contact you shortly.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        form.reset();
                    }, 1500);
                }
            });
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

    // FAQ Accordion Logic
    const initFAQ = () => {
        const faqs = document.querySelectorAll('.faq-item');
        faqs.forEach(faq => {
            const button = faq.querySelector('button');
            const content = faq.querySelector('.faq-content');
            const icon = faq.querySelector('.fa-plus');

            if (!button || !content) return;

            button.addEventListener('click', () => {
                const isOpen = !content.classList.contains('hidden');

                // Close all others
                document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
                document.querySelectorAll('.faq-item .fa-plus').forEach(i => i.classList.remove('rotate-45'));

                if (!isOpen) {
                    content.classList.remove('hidden');
                    icon?.classList.add('rotate-45');
                }
            });
        });
    };

    // Run Initializers
    initTheme();
    initRTL();
    initSidebarToggle();
    initMobileMenu();
    initHeaderScroll();
    initNotification();
    initFAQ();
    initSidebarContact();
};

document.addEventListener('DOMContentLoaded', initApp);
