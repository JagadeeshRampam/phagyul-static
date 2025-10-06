// DOM Elements
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const navLinks = document.querySelectorAll('.nav__link');
const carouselSlides = document.querySelector('.carousel__slides');
const carouselDots = document.querySelectorAll('.carousel__dot');
const carouselPrev = document.querySelector('.carousel__prev');
const carouselNext = document.querySelector('.carousel__next');
const productColumns = document.querySelectorAll('.product-column');
const techCards = document.querySelectorAll('.tech-card');
const statCards = document.querySelectorAll('.stat-card');
const ctaButtons = document.querySelectorAll('.btn');

// Carousel State
let currentSlide = 0;
const totalSlides = 5;
let autoPlayInterval;
const autoPlayDelay = 5000; // 5 seconds

// Mobile Navigation Toggle
function initMobileNavigation() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.toggle('nav__menu--open');
            navToggle.classList.toggle('nav__toggle--active');
            
            // Animate hamburger lines
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navToggle.classList.contains('nav__toggle--active')) {
                    if (index === 0) {
                        span.style.transform = 'rotate(45deg) translateY(8px)';
                    } else if (index === 1) {
                        span.style.opacity = '0';
                    } else if (index === 2) {
                        span.style.transform = 'rotate(-45deg) translateY(-8px)';
                    }
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
}

// Carousel Functionality
function initCarousel() {
    if (!carouselSlides) return;

    // Update carousel position
    function updateCarousel(slideIndex) {
        const translateValue = -slideIndex * 20; // Each slide is 20% width
        carouselSlides.style.transform = `translateX(${translateValue}%)`;
        
        // Update dots
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('carousel__dot--active', index === slideIndex);
        });
        
        currentSlide = slideIndex;
    }

    // Go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        updateCarousel(next);
    }

    // Go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel(prev);
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        updateCarousel(slideIndex);
    }

    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        console.log('Carousel auto-play started');
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            console.log('Carousel auto-play stopped');
        }
    }

    // Event listeners for navigation
    if (carouselNext) {
        carouselNext.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            stopAutoPlay();
            // Restart auto-play after user interaction
            setTimeout(startAutoPlay, autoPlayDelay);
        });
    }

    if (carouselPrev) {
        carouselPrev.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            stopAutoPlay();
            // Restart auto-play after user interaction
            setTimeout(startAutoPlay, autoPlayDelay);
        });
    }

    // Event listeners for dots
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(index);
            stopAutoPlay();
            // Restart auto-play after user interaction
            setTimeout(startAutoPlay, autoPlayDelay);
        });
    });

    // Pause auto-play on hover
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, autoPlayDelay);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, autoPlayDelay);
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            setTimeout(startAutoPlay, autoPlayDelay);
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    // Initialize first slide and start auto-play
    updateCarousel(0);
    startAutoPlay();
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                let targetElement = null;
                
                // Map navigation links to actual sections
                switch(href) {
                    case '#home':
                        targetElement = document.querySelector('.hero-carousel');
                        break;
                    case '#products':
                        targetElement = document.querySelector('.products');
                        break;
                    case '#solutions':
                        targetElement = document.querySelector('.products');
                        break;
                    case '#technologies':
                        targetElement = document.querySelector('.technologies');
                        break;
                    case '#about':
                        targetElement = document.querySelector('.about');
                        break;
                    case '#contact':
                        targetElement = document.querySelector('.footer');
                        break;
                    default:
                        targetElement = document.querySelector(href);
                        break;
                }
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('nav__menu--open')) {
                        navMenu.classList.remove('nav__menu--open');
                        if (navToggle) {
                            navToggle.classList.remove('nav__toggle--active');
                            
                            const spans = navToggle.querySelectorAll('span');
                            spans.forEach(span => {
                                span.style.transform = 'none';
                                span.style.opacity = '1';
                            });
                        }
                    }
                }
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe product columns
    productColumns.forEach(column => {
        column.style.animationPlayState = 'paused';
        observer.observe(column);
    });

    // Observe tech cards
    techCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });

    // Observe stat cards
    statCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
}

// Counter Animation for Stats
function animateCounters() {
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.stat-card__number');
                if (!numberElement) return;
                
                const finalNumber = numberElement.textContent;
                
                // Set initial value to 0 and animate to final value
                numberElement.setAttribute('data-final', finalNumber);
                numberElement.textContent = '0';
                
                // Extract numeric value and suffix
                const numericMatch = finalNumber.match(/(\d+(?:\.\d+)?)/);
                const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;
                const suffix = finalNumber.replace(/[\d.]/g, '');
                
                if (numericValue > 0) {
                    animateNumber(numberElement, 0, numericValue, suffix, 2000);
                }
                
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statCards.forEach(card => {
        counterObserver.observe(card);
    });
}

// Number Animation Function
function animateNumber(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOutCubic);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Ensure final value is exact
            element.textContent = element.getAttribute('data-final');
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// CTA Button Interactions
function initCTAInteractions() {
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const buttonText = button.textContent.trim();
            
            // Add ripple effect
            addRippleEffect(button, e);
            
            // Handle different CTA actions
            switch(buttonText) {
                case 'Explore Our AI Ecosystem':
                case 'Discover AI Storage':
                case 'Experience Indian AI':
                case 'Watch Productions':
                case 'Learn About Innovation':
                    const productsSection = document.querySelector('.products');
                    if (productsSection) {
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                        const targetPosition = productsSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                    break;
                case 'Start Free Trial':
                    showModal('Parjanya AI Cloud Storage Trial', 'Ready to experience intelligent cloud storage with DepictQA? Get 70% cost reduction through AI optimization and human-like image quality assessment.');
                    break;
                case 'Explore Indian AI':
                    showModal('Smriti - Indian Heritage AI', 'Discover the power of cultural AI trained on Vedas, Upanishads, and Indian scriptures. Access 1000+ cultural texts in 22+ Indian languages.');
                    break;
                case 'Watch Productions':
                    showModal('WilderhoodTV AI Productions', 'Experience OpenCV-powered visual intelligence for wildlife and heritage documentation. Advanced computer vision without video editing.');
                    break;
                default:
                    // Generic action for other buttons
                    console.log(`CTA clicked: ${buttonText}`);
                    break;
            }
        });
    });
}

// Ripple Effect Function
function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Modal Function
function showModal(title, message) {
    // Remove any existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.opacity = '0';
    modal.innerHTML = `
        <div class="modal__backdrop">
            <div class="modal__content">
                <div class="modal__header">
                    <h3 class="modal__title">${title}</h3>
                    <button class="modal__close" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal__body">
                    <p>${message}</p>
                    <div style="margin-top: var(--space-16); padding: var(--space-16); background: var(--color-secondary); border-radius: var(--radius-base);">
                        <p style="margin-bottom: var(--space-8);"><strong>📧 Email:</strong> <a href="mailto:ai@phagyulai.com" style="color: var(--color-primary);">ai@phagyulai.com</a></p>
                        <p style="margin-bottom: 0;"><strong>📍 Location:</strong> Virajpet, Karnataka, India</p>
                    </div>
                </div>
                <div class="modal__footer">
                    <button class="btn btn--primary modal__cta">Contact Us</button>
                    <button class="btn btn--secondary modal__close-btn">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
            document.body.style.overflow = 'auto';
        }, 300);
    };
    
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    modal.querySelector('.modal__close-btn').addEventListener('click', closeModal);
    modal.querySelector('.modal__backdrop').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal__backdrop')) {
            closeModal();
        }
    });
    modal.querySelector('.modal__cta').addEventListener('click', () => {
        window.open('mailto:ai@phagyulai.com', '_blank');
    });
    
    // Prevent modal content clicks from closing modal
    modal.querySelector('.modal__content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Focus management and accessibility
    setTimeout(() => {
        modal.querySelector('.modal__close').focus();
    }, 100);
    document.body.style.overflow = 'hidden';
    
    // Escape key handler
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Fade in animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    console.log(`Modal opened: ${title}`);
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 253, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'var(--shadow-sm)';
        }
    });
}

// Product Card Hover Effects
function initProductInteractions() {
    productColumns.forEach(column => {
        column.addEventListener('mouseenter', () => {
            column.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        column.addEventListener('mouseleave', () => {
            column.style.transform = 'translateY(-8px) scale(1)';
        });
    });
}

// Tech Card Link Interactions
function initTechCardInteractions() {
    const techLinks = document.querySelectorAll('.tech-card__link');
    techLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add a subtle animation when clicking external links
            const card = link.closest('.tech-card');
            if (card) {
                card.style.transform = 'translateY(-4px) scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-4px) scale(1)';
                }, 150);
            }
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Phagyul AI Systems Layout A website...');
    
    try {
        initMobileNavigation();
        console.log('✓ Mobile navigation initialized');
        
        initCarousel();
        console.log('✓ Carousel functionality initialized');
        
        initSmoothScrolling();
        console.log('✓ Smooth scrolling initialized');
        
        initScrollAnimations();
        console.log('✓ Scroll animations initialized');
        
        animateCounters();
        console.log('✓ Counter animations initialized');
        
        initCTAInteractions();
        console.log('✓ CTA interactions initialized');
        
        initHeaderScrollEffect();
        console.log('✓ Header scroll effect initialized');
        
        initProductInteractions();
        console.log('✓ Product interactions initialized');
        
        initTechCardInteractions();
        console.log('✓ Tech card interactions initialized');
        
        // Add loading class removal
        document.body.classList.add('loaded');
        
        console.log('🚀 Phagyul AI Systems Layout A website fully initialized!');
    } catch (error) {
        console.error('Error initializing website:', error);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 900 && navMenu && navMenu.classList.contains('nav__menu--open')) {
        navMenu.classList.remove('nav__menu--open');
        if (navToggle) {
            navToggle.classList.remove('nav__toggle--active');
            
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    }
});

// Handle clicks outside mobile menu
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('nav__menu--open')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('nav__menu--open');
            if (navToggle) {
                navToggle.classList.remove('nav__toggle--active');
                
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        }
    }
});

// Handle page visibility change (pause/resume carousel)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause carousel
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            console.log('Carousel paused - page hidden');
        }
    } else {
        // Page is visible, resume carousel
        if (carouselSlides && !autoPlayInterval) {
            autoPlayInterval = setInterval(() => {
                const next = (currentSlide + 1) % totalSlides;
                const translateValue = -next * 20;
                carouselSlides.style.transform = `translateX(${translateValue}%)`;
                
                // Update dots
                carouselDots.forEach((dot, index) => {
                    dot.classList.toggle('carousel__dot--active', index === next);
                });
                
                currentSlide = next;
            }, autoPlayDelay);
            console.log('Carousel resumed - page visible');
        }
    }
});

// Add performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Layout A page loaded in ${Math.round(loadTime)}ms`);
    
    // Log carousel status
    console.log(`Carousel initialized with ${totalSlides} slides, auto-play: ${autoPlayInterval ? 'enabled' : 'disabled'}`);
});

// Add ripple animation keyframes to document
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
@keyframes ripple {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;
document.head.appendChild(rippleStyle);