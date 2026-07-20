document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate mobile toggle lines
            const spans = mobileToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link, .btn-nav');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));



    // ==========================================
    // 5. CHAPTER BROWSER TAB SWITCHER
    // ==========================================
    const partTabs = document.querySelectorAll('.part-tab');
    const partPanels = document.querySelectorAll('.part-panel');

    partTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            partTabs.forEach(t => t.classList.remove('active'));
            partPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding panel
            const partId = tab.getAttribute('data-part');
            const targetPanel = document.getElementById(`part-panel-${partId}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });



    // ==========================================
    // 7. PRE-ORDER interest form submission
    // ==========================================
    const preorderForm = document.getElementById('residency-form');
    const formMessage = document.getElementById('form-message');

    if (preorderForm) {
        preorderForm.addEventListener('submit', (e) => {
            // Let the browser submit the form naturally to the hidden iframe
            // (we do not call e.preventDefault() to avoid blocking the submission)
            
            const submitBtn = preorderForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Set loading visual
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering reservation...';
            
            // Wait 600ms to allow the browser submission to complete before resetting the inputs
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Show success status
                if (formMessage) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Thank you! Your spot on the waiting list has been reserved. Please check your email inbox to confirm your subscription and download Chapter 1: "Two Clinicians, One Client".';
                    formMessage.style.display = 'block';
                    
                    preorderForm.reset();
                    
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                    // Hide status after 10 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 10000);
                }
            }, 600);
        });
    }
});
