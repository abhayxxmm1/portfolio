// Dennis Snellenberg-inspired Modern Portfolio JavaScript

console.log('ðŸš€ Modern Portfolio Loading...');

class ModernPortfolio {
    constructor() {
        this.isLoading = true;
        this.mobileMenuOpen = false;
        this.scrollY = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initCursor();
        this.initScrollAnimations();
        this.initLoadingScreen();
        this.initNavigation();
        this.initMobileMenu();
        this.initContactForm();
        this.initParallax();
        console.log('âœ… Modern Portfolio Initialized');
    }

    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

        // Navigation events
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Smooth scroll for CTA buttons
        document.querySelectorAll('.cta-button, .scroll-indicator').forEach(button => {
            button.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Work item interactions
        document.querySelectorAll('.work-item').forEach(item => {
            item.addEventListener('mouseenter', this.handleWorkItemHover.bind(this));
            item.addEventListener('mouseleave', this.handleWorkItemLeave.bind(this));
        });

        console.log('ðŸ”— Events bound successfully');
    }

    // Custom Cursor
    initCursor() {
        const cursor = document.getElementById('cursor');
        if (!cursor) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.1;
            cursorY += dy * 0.1;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(updateCursor);
        };

        updateCursor();

        // Cursor interactions
        document.querySelectorAll('a, button, .work-item, .skill-tag').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });

        console.log('ðŸŽ¯ Custom cursor initialized');
    }

    // Loading Screen
    initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            this.isLoading = false;

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.startEntranceAnimations();
            }, 800);

            console.log('âœ… Loading complete');
        }, 2500);
    }

    startEntranceAnimations() {
        // Animate hero elements
        this.animateOnLoad('.hero-label', 0);
        this.animateOnLoad('.hero-title-line', 100, true);
        this.animateOnLoad('.hero-description', 600);
        this.animateOnLoad('.hero-cta', 800);
        this.animateOnLoad('.hero-scroll', 1000);

        // Animate navbar
        this.animateOnLoad('.navbar', 200);

        console.log('ðŸŽ¬ Entrance animations started');
    }

    animateOnLoad(selector, delay = 0, stagger = false) {
        const elements = document.querySelectorAll(selector);

        elements.forEach((el, index) => {
            const staggerDelay = stagger ? index * 200 : 0;

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, delay + staggerDelay);
        });
    }

    // Navigation
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = 0;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });

        this.updateActiveNavLink();
        console.log('ðŸ§­ Navigation initialized');
    }

    handleNavClick(e) {
        const href = e.target.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();
            this.smoothScrollTo(href);
            this.updateActiveNavLink(href);

            // Close mobile menu if open
            if (this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        }
    }

    updateActiveNavLink(activeHref = null) {
        const navLinks = document.querySelectorAll('.nav-link');

        if (activeHref) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === activeHref);
            });
            return;
        }

        // Update based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === sectionId);
                });
            }
        });
    }

    // Mobile Menu
    initMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMobileMenu = document.getElementById('closeMobileMenu');

        if (navToggle && mobileMenu) {
            navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
            closeMobileMenu?.addEventListener('click', this.closeMobileMenu.bind(this));

            // Close on overlay click
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }

        console.log('ðŸ“± Mobile menu initialized');
    }

    toggleMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        this.mobileMenuOpen = !this.mobileMenuOpen;

        navToggle.classList.toggle('active', this.mobileMenuOpen);
        mobileMenu.classList.toggle('active', this.mobileMenuOpen);
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';

        console.log(`ðŸ“± Mobile menu ${this.mobileMenuOpen ? 'opened' : 'closed'}`);
    }

    closeMobileMenu() {
        if (!this.mobileMenuOpen) return;

        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        this.mobileMenuOpen = false;
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';

        console.log('ðŸ“± Mobile menu closed');
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // Special handling for staggered animations
                    if (entry.target.classList.contains('work-grid')) {
                        this.animateWorkGrid(entry.target);
                    }

                    if (entry.target.classList.contains('skills-grid')) {
                        this.animateSkillsGrid(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.section-header, .work-item, .about-content, .contact-content, .skills-section').forEach(el => {
            el.classList.add('fade-up');
            observer.observe(el);
        });

        console.log('ðŸ“œ Scroll animations initialized');
    }

    animateWorkGrid(grid) {
        const items = grid.querySelectorAll('.work-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateSkillsGrid(grid) {
        const categories = grid.querySelectorAll('.skill-category');
        categories.forEach((category, index) => {
            setTimeout(() => {
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';

                // Animate skill tags
                const tags = category.querySelectorAll('.skill-tag');
                tags.forEach((tag, tagIndex) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0)';
                    }, tagIndex * 50);
                });
            }, index * 200);
        });
    }

    // Work Item Interactions
    handleWorkItemHover(e) {
        const item = e.currentTarget;
        const image = item.querySelector('.work-image img, .work-placeholder');

        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    }

    handleWorkItemLeave(e) {
        const item = e.currentTarget;
        const image = item.querySelector('.work-image img, .work-placeholder');

        if (image) {
            image.style.transform = 'scale(1)';
        }
    }

    // Parallax Effects
    initParallax() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;

            // Hero background parallax
            const heroBg = document.querySelector('.hero-bg');
            if (heroBg) {
                const rate = scrolled * -0.5;
                heroBg.style.transform = `translate3d(0, ${rate}px, 0)`;
            }

            // Hero content parallax
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const rate = scrolled * -0.2;
                heroContent.style.transform = `translate3d(0, ${rate}px, 0)`;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        console.log('ðŸŒŠ Parallax effects initialized');
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', this.handleFormSubmit.bind(this));

        // Add floating label effect
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');

            if (input && label) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });

                // Check if input has value on load
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });

        console.log('ðŸ“§ Contact form initialized');
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Basic validation
        const requiredFields = ['name', 'email', 'subject', 'message'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            this.showNotification(`Please fill in: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        const submitButton = e.target.querySelector('.submit-button');
        const originalText = submitButton.querySelector('span').textContent;

        submitButton.disabled = true;
        submitButton.querySelector('span').textContent = 'Sending...';
        submitButton.style.opacity = '0.7';

        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            e.target.reset();

            submitButton.disabled = false;
            submitButton.querySelector('span').textContent = originalText;
            submitButton.style.opacity = '1';

            // Remove focused classes
            document.querySelectorAll('.form-group.focused').forEach(group => {
                group.classList.remove('focused');
            });
        }, 1500);

        console.log('ðŸ“§ Form submitted:', data);
    }

    // Utility Functions
    smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const targetPosition = target.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuart(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    handleSmoothScroll(e) {
        const href = e.target.closest('a').getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            this.smoothScrollTo(href);
        }
    }

    easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    }

    handleScroll() {
        this.scrollY = window.pageYOffset;
        this.updateActiveNavLink();
    }

    handleResize() {
        // Handle responsive changes
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? 'âœ…' : type === 'error' ? 'âŒ' : 'â„¹ï¸'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };

        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            font-weight: 500;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, 4000);

        console.log(`ðŸ“¢ Notification: ${message}`);
    }

    // Performance utilities
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('ðŸš€ DOM Ready - Initializing Modern Portfolio');

    try {
        window.modernPortfolio = new ModernPortfolio();
        console.log('âœ… Modern Portfolio initialized successfully');
    } catch (error) {
        console.error('âŒ Error initializing portfolio:', error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('ðŸ“´ Page hidden - pausing animations');
    } else {
        console.log('ðŸ‘ï¸ Page visible - resuming animations');
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`âš¡ Portfolio fully loaded in ${Math.round(loadTime)}ms`);
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-icon {
        font-size: 1.2rem;
    }

    .notification-message {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    @media (max-width: 768px) {
        .notification {
            right: 1rem !important;
            left: 1rem !important;
            max-width: none !important;
            transform: translateY(-100px) !important;
        }

        .notification.show {
            transform: translateY(0) !important;
        }
    }
`;
document.head.appendChild(notificationStyles);

console.log('ðŸŽ¬ Modern Portfolio Script Loaded Successfully');