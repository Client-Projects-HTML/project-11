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

    // Login role dropdown (Client Dashboard, Admin Dashboard)
    const initLoginRoleDropdown = () => {
        const isNestedPage = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/client/');
        const resolvePath = (path) => (isNestedPage ? `../${path}` : path);
        const roleLinks = [
            { label: 'Client Dashboard', href: resolvePath('client/index.html') },
            { label: 'Admin Dashboard', href: resolvePath('admin/index.html') },
        ];

        const createMenuItem = (item, extraClass = '') => {
            const link = document.createElement('a');
            link.href = item.href;
            link.className = `block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-colors ${extraClass}`.trim();
            link.textContent = item.label;
            return link;
        };

        const closeAllDropdowns = () => {
            document.querySelectorAll('[data-login-role-menu]').forEach(menu => menu.classList.add('hidden'));
            document.querySelectorAll('[data-login-role-trigger]').forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
            document.querySelectorAll('[data-login-role-chevron]').forEach(icon => icon.classList.remove('rotate-180'));
        };

        // Desktop/header login buttons
        const desktopLoginLinks = Array.from(document.querySelectorAll('header a[href$="login.html"]'))
            .filter(link => !link.closest('#mobile-menu'))
            .filter(link => {
                const text = link.textContent.trim().toLowerCase();
                return text === 'login' || text === 'sign in';
            });

        desktopLoginLinks.forEach(link => {
            if (link.dataset.loginRoleDropdownApplied === 'true') return;

            const responsiveClass = (link.classList.contains('hidden') && link.classList.contains('sm:inline-flex'))
                ? 'hidden sm:inline-flex'
                : 'inline-flex';

            const wrapper = document.createElement('div');
            wrapper.className = `relative ${responsiveClass} items-stretch rounded-full bg-primary text-white shadow-lg hover:shadow-primary/30`;
            link.parentNode?.insertBefore(wrapper, link);
            wrapper.appendChild(link);

            link.className = 'inline-flex items-center justify-center px-6 py-2.5 rounded-l-full font-semibold text-white';

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'inline-flex items-center justify-center px-3 rounded-r-full border-l border-white/20 text-white';
            trigger.dataset.loginRoleTrigger = 'true';
            trigger.setAttribute('aria-expanded', 'false');
            trigger.innerHTML = `<i data-login-role-chevron="true" class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>`;

            const menu = document.createElement('div');
            menu.className = 'absolute right-0 top-full mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 hidden z-[70]';
            menu.dataset.loginRoleMenu = 'true';
            roleLinks.forEach(item => menu.appendChild(createMenuItem(item)));

            wrapper.appendChild(trigger);
            wrapper.appendChild(menu);

            link.dataset.loginRoleDropdownApplied = 'true';

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const shouldOpen = menu.classList.contains('hidden');
                closeAllDropdowns();
                if (shouldOpen) {
                    menu.classList.remove('hidden');
                    trigger.setAttribute('aria-expanded', 'true');
                    const icon = trigger.querySelector('[data-login-role-chevron]');
                    icon?.classList.add('rotate-180');
                }
            });
        });

        // Mobile menu login button
        const mobileLoginLink = document.querySelector('#mobile-menu a[href$="login.html"]');
        if (mobileLoginLink && mobileLoginLink.dataset.loginRoleDropdownApplied !== 'true') {
            const wrapper = document.createElement('div');
            wrapper.className = 'w-full relative';
            const row = document.createElement('div');
            row.className = 'flex items-stretch rounded-xl bg-primary text-white overflow-hidden';

            mobileLoginLink.parentNode?.insertBefore(wrapper, mobileLoginLink);
            wrapper.appendChild(row);
            row.appendChild(mobileLoginLink);
            mobileLoginLink.className = 'flex-1 inline-flex items-center justify-center px-6 py-4 font-bold text-center text-white';

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'inline-flex items-center justify-center px-4 border-l border-white/20 text-white';
            trigger.dataset.loginRoleTrigger = 'true';
            trigger.setAttribute('aria-expanded', 'false');
            trigger.innerHTML = `<i data-login-role-chevron="true" class="fas fa-chevron-down text-xs transition-transform duration-300"></i>`;

            const menu = document.createElement('div');
            menu.className = 'hidden mt-2 space-y-2';
            menu.dataset.loginRoleMenu = 'true';
            roleLinks.forEach(item => menu.appendChild(createMenuItem(item, 'bg-gray-50 dark:bg-gray-700/50')));

            row.appendChild(trigger);
            wrapper.appendChild(menu);

            mobileLoginLink.dataset.loginRoleDropdownApplied = 'true';

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const shouldOpen = menu.classList.contains('hidden');
                closeAllDropdowns();
                if (shouldOpen) {
                    menu.classList.remove('hidden');
                    trigger.setAttribute('aria-expanded', 'true');
                    const icon = trigger.querySelector('[data-login-role-chevron]');
                    icon?.classList.add('rotate-180');
                }
            });
        }

        document.addEventListener('click', closeAllDropdowns);
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

    // Ensure all top navigation headers stay fixed across pages
    const initFixedNavbar = () => {
        const navbarHeader = document.getElementById('menu-toggle')?.closest('header');
        if (navbarHeader) {
            navbarHeader.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'z-50');
        }

        const dashboardHeader = document.getElementById('sidebar-toggle')?.closest('header');
        if (dashboardHeader) {
            dashboardHeader.classList.add('fixed', 'top-0', 'right-0');
        }
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
    initLoginRoleDropdown();
    initFixedNavbar();
    initSidebarToggle();
    initMobileMenu();
    initHeaderScroll();
    initNotification();
    initFAQ();
    initSidebarContact();
};

document.addEventListener('DOMContentLoaded', initApp);
