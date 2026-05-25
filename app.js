/**
 * app.js - genissreform Landing Page Demo
 * Frontend logic, micro-interactions, responsive slider and scroll reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Preloader / Splash Screen Controller
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Set body scroll lock
        document.body.classList.add('preloader-active');
        
        // Hide preloader after a premium duration to ensure user sees the complete animation
        const minimumDisplayTime = 2600; // 2.6 seconds
        const startTime = Date.now();
        
        const hidePreloader = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minimumDisplayTime - elapsed);
            
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.classList.remove('preloader-active');
                
                // Completely remove from DOM after transition completes to preserve memory and interaction
                setTimeout(() => {
                    if (preloader.parentNode) {
                        preloader.remove();
                    }
                }, 600);
            }, remaining);
        };

        // Trigger on full window load (including heavy images) or after minimum display time
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
            // Backup timeout in case resource loads take abnormally long
            setTimeout(hidePreloader, 4000);
        }
    }

    // ==========================================
    // 1. Sticky Navbar on Scroll
    // ==========================================
    const header = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load


    // ==========================================
    // 2. Mobile Drawer Navigation
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        mobileDrawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop scrolling behind drawer
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        mobileDrawerOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    // ==========================================
    // 3. Smooth Scroll Anchor Links Offset
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate header offset height dynamically
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 10;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================
    // 4. Interactive Before/After Image Slider & Multiple Examples
    // ==========================================
    const sliderContainer = document.getElementById('before-after-slider');
    const afterLayer = document.getElementById('after-layer');
    const sliderHandle = document.getElementById('slider-handle');
    const beforeImg = document.getElementById('slider-before-img');
    const afterImg = document.getElementById('slider-after-img');

    if (sliderContainer && afterLayer && sliderHandle) {
        let isSliding = false;

        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            // Calculate cursor X relative to slider container
            const x = clientX - rect.left;
            // Convert to percentage
            let percentage = (x / rect.width) * 100;
            
            // Limit percentage within bounds [0, 100]
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            // Apply style updates
            afterLayer.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };

        // Desktop Mouse Events
        sliderHandle.addEventListener('mousedown', () => {
            isSliding = true;
            sliderContainer.classList.add('sliding');
        });

        window.addEventListener('mouseup', () => {
            if (isSliding) {
                isSliding = false;
                sliderContainer.classList.remove('sliding');
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            updateSlider(e.clientX);
        });

        // Touch Mobile Events (responsive focus)
        sliderHandle.addEventListener('touchstart', () => {
            isSliding = true;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isSliding = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            if (e.touches && e.touches[0]) {
                updateSlider(e.touches[0].clientX);
            }
        }, { passive: true });

        // Add optional click-to-move inside container
        sliderContainer.addEventListener('click', (e) => {
            // Prevent trigger if the user was dragging and just released
            if (e.target === sliderHandle || sliderHandle.contains(e.target)) return;
            updateSlider(e.clientX);
        });
    }

    // Tab switcher logic for Multiple Before/After Examples
    const sliderTabs = document.querySelectorAll('.slider-tab');
    const baTitle = document.getElementById('ba-title');
    const baIntro = document.getElementById('ba-intro');
    const baFeat1 = document.getElementById('ba-feat-1');
    const baFeat2 = document.getElementById('ba-feat-2');
    const baFeat3 = document.getElementById('ba-feat-3');
    const baFeat4 = document.getElementById('ba-feat-4');
    const baTime = document.getElementById('ba-time');

    sliderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Toggle active class on tabs
            sliderTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Get source values
            const beforeSrc = tab.getAttribute('data-before');
            const afterSrc = tab.getAttribute('data-after');
            const title = tab.getAttribute('data-title');
            const intro = tab.getAttribute('data-intro');
            const feat1 = tab.getAttribute('data-feat-1');
            const feat2 = tab.getAttribute('data-feat-2');
            const feat3 = tab.getAttribute('data-feat-3');
            const feat4 = tab.getAttribute('data-feat-4');
            const time = tab.getAttribute('data-time');

            // Apply fade out effect
            if (beforeImg && afterImg) {
                beforeImg.style.transition = 'opacity 0.2s ease';
                afterImg.style.transition = 'opacity 0.2s ease';
                beforeImg.style.opacity = '0.3';
                afterImg.style.opacity = '0.3';

                setTimeout(() => {
                    // Swap image paths
                    beforeImg.src = beforeSrc;
                    afterImg.src = afterSrc;

                    // Swap details content
                    if (baTitle) baTitle.textContent = title;
                    if (baIntro) baIntro.textContent = intro;
                    if (baFeat1) baFeat1.innerHTML = feat1;
                    if (baFeat2) baFeat2.innerHTML = feat2;
                    if (baFeat3) baFeat3.innerHTML = feat3;
                    if (baFeat4) baFeat4.innerHTML = feat4;
                    if (baTime) baTime.textContent = time;

                    // Reset slider visual divider to center (50%)
                    if (afterLayer) afterLayer.style.width = '50%';
                    if (sliderHandle) sliderHandle.style.left = '50%';

                    // Fade back in
                    beforeImg.style.opacity = '1';
                    afterImg.style.opacity = '1';
                }, 200);
            }
        });
    });


    // ==========================================
    // 5. Interactive FAQ Accordion
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const panel = item.querySelector('.faq-panel');

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items for a cleaner accordion feel
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-panel').style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                panel.style.maxHeight = null;
            } else {
                item.classList.add('active');
                // Set max-height to its actual scrollHeight for smooth transition
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });


    // ==========================================
    // 6. Scroll Reveal & Construction Themed Animation Controller
    // ==========================================
    // Dynamically assign reveal classes to elements for clean, lightweight HTML
    const elementsToReveal = [
        '.trust-card',
        '.service-card',
        '.space-card',
        '.process-step',
        '.testimonial-card',
        '.faq-item',
        '.section-header',
        '.hero-content',
        '.hero-visual',
        '.before-after-visual-card',
        '.before-after-details',
        '.team-visual',
        '.team-content',
        '.contact-info',
        '.contact-form-wrapper'
    ];

    elementsToReveal.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });

    // References for process timeline growth line
    const timelineGrow = document.querySelector('.timeline-progress-grow');
    const processSteps = Array.from(document.querySelectorAll('.process-step'));

    // Themed Construction IntersectionObserver
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // A. Dynamic Brick-by-Brick Grid Cascade Stagger (100ms interval)
                const parent = el.parentElement;
                if (parent && (
                    parent.classList.contains('services-grid') || 
                    parent.classList.contains('trust-grid') || 
                    parent.classList.contains('spaces-grid') || 
                    parent.classList.contains('testimonials-grid')
                )) {
                    const siblings = Array.from(parent.children).filter(child => child.classList.contains('reveal'));
                    const index = siblings.indexOf(el);
                    if (index !== -1) {
                        el.style.transitionDelay = `${index * 100}ms`;
                    }
                }
                
                // B. Vertical Process Pipeline Growth linkage
                if (el.classList.contains('process-step')) {
                    const index = processSteps.indexOf(el);
                    if (index !== -1 && timelineGrow) {
                        const percentage = (index / (processSteps.length - 1)) * 100;
                        timelineGrow.style.height = `${percentage}%`;
                    }
                }
                
                // Activate element and unobserve
                el.classList.add('active');
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.08, // Snappy entry (triggers when 8% of element is visible)
        rootMargin: '0px 0px -40px 0px' // Refined offset boundary for mobile-first scrolling
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 6.5. Before-After Slider Auto-Swipe Laser Demo Scan
    // ==========================================
    const sliderEl = document.getElementById('before-after-slider');
    if (sliderEl && afterLayer && sliderHandle) {
        let hasDemoed = false;
        
        const sliderObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasDemoed) {
                    hasDemoed = true;
                    observer.unobserve(sliderEl); // Scan only once per session
                    
                    // Trigger automated laser swipe scan after brief focus delay
                    setTimeout(() => {
                        // Scan phase 1: Sweep right to 82% (reveal finished space)
                        afterLayer.style.width = '82%';
                        sliderHandle.style.left = '82%';
                        
                        // Scan phase 2: Sweep left to 18% (reveal original space)
                        setTimeout(() => {
                            afterLayer.style.width = '18%';
                            sliderHandle.style.left = '18%';
                            
                            // Scan phase 3: Settle back in the center (50%)
                            setTimeout(() => {
                                afterLayer.style.width = '50%';
                                sliderHandle.style.left = '50%';
                            }, 700);
                        }, 850);
                    }, 650);
                }
            });
        }, { threshold: 0.25 }); // Activates when a quarter of the slider is visible
        
        sliderObserver.observe(sliderEl);
    }


    // ==========================================
    // 7. Form Submission Handler (Demo / Lead Capture)
    // ==========================================
    const contactForm = document.getElementById('reform-contact-form');
    const successMsg = document.getElementById('form-success-msg');

    if (contactForm && successMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard redirect

            // Retrieve form values
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const city = document.getElementById('form-city').value;
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value;

            // Log demo lead details for review
            console.log('--- NUEVO LEAD RECIBIDO (DEMO WEB genissreform) ---');
            console.log(`Nombre: ${name}`);
            console.log(`Teléfono: ${phone}`);
            console.log(`Población: ${city}`);
            console.log(`Servicio: ${service}`);
            console.log(`Mensaje: ${message}`);
            console.log('----------------------------------------------------');

            // Visual effects for success state
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.style.display = 'none';
                successMsg.style.display = 'flex';
                successMsg.style.opacity = '0';
                
                // Triggers subtle entrance transition
                setTimeout(() => {
                    successMsg.style.transition = 'opacity 0.5s ease';
                    successMsg.style.opacity = '1';
                }, 50);

                // Auto-scroll inside form wrapper to view success message perfectly on mobile
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        });
    }

});
