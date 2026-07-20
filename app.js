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
            e.preventDefault();
            
            const submitBtn = preorderForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Set loading visual
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering reservation...';
            
            // Prepare ConvertKit form payload
            const formData = new FormData();
            formData.append('first_name', preorderForm.querySelector('#first-name').value);
            formData.append('email_address', preorderForm.querySelector('#email').value);
            formData.append('fields[last_name]', preorderForm.querySelector('#last-name').value);
            formData.append('fields[current_role]', preorderForm.querySelector('#current-status').value);
            
            // Post to ConvertKit form submission endpoint (mode: no-cors prevents cross-origin blocks)
            fetch('https://app.convertkit.com/html_forms/9702700/subscriptions', {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            })
            .then(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Show success status
                if (formMessage) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Thank you! Your spot on the waiting list has been reserved. Your download of Chapter 1: "Two Clinicians, One Client" has started! A backup copy has also been sent to your email.';
                    formMessage.style.display = 'block';
                    
                    // Programmatically trigger direct browser download
                    const downloadLink = document.createElement('a');
                    downloadLink.href = 'The_BCBA_Residency_Chapter_1_Preview.pdf';
                    downloadLink.download = 'The_BCBA_Residency_Chapter_1_Preview.pdf';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    preorderForm.reset();
                    
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                    // Hide status after 10 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 10000);
                }
            })
            .catch((error) => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                
                if (formMessage) {
                    formMessage.className = 'form-message error';
                    formMessage.textContent = 'There was an issue submitting your email. Please try again or contact support.';
                    formMessage.style.display = 'block';
                }
                console.error('ConvertKit submission error:', error);
            });
        });
    }
});
