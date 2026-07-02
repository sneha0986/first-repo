document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileDrawer.classList.toggle('active');
            
            // Prevent body scroll when drawer is open
            if (mobileDrawer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close drawer when link clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileDrawer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================================================
    // DYNAMIC PROJECTS FILTERING
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================================================
    // CONTACT FORM VALIDATION & HANDLING
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const successFeedback = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Fields validation
            const nameField = document.getElementById('form-name');
            const emailField = document.getElementById('form-email');
            const subjectField = document.getElementById('form-subject');
            const messageField = document.getElementById('form-message');
            
            // Clear prior states
            [nameField, emailField, subjectField, messageField].forEach(field => {
                if (field) {
                    field.parentElement.classList.remove('invalid');
                }
            });

            // Name
            if (nameField && nameField.value.trim() === '') {
                nameField.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Email (regex check)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField && !emailRegex.test(emailField.value.trim())) {
                emailField.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Subject
            if (subjectField && subjectField.value.trim() === '') {
                subjectField.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Message
            if (messageField && messageField.value.trim() === '') {
                messageField.parentElement.classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                // Submit button feedback
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalBtnHTML = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending...';

                // Simulate AJAX transmission
                setTimeout(() => {
                    successFeedback.classList.remove('hidden');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                    
                    // Auto-hide feedback after 5 seconds
                    setTimeout(() => {
                        successFeedback.classList.add('hidden');
                    }, 5000);
                }, 1200);
            }
        });

        // Interactive validation clearing on type
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('invalid');
            });
        });
    }

    // ==========================================================================
    // INTERACTIVE DATA SCIENCE NETWORK GRAPH (CANVAS)
    // ==========================================================================
    const canvas = document.getElementById('canvas-network');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };

        // Determine particle density based on screen width (performance optimization)
        function getParticleCount() {
            const width = window.innerWidth;
            if (width < 480) return 20;   // Low count for small phones
            if (width < 768) return 40;   // Medium count for tablets
            return 75;                    // High count for desktops
        }

        // Adjust Canvas Size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        // Particle Blueprint
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4; // Soft float speed
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2.5 + 1.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(13, 148, 136, 0.25)'; // Accent teal color
                ctx.fill();
            }

            update() {
                // Bounce boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Move particles
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (soft attraction)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        // Gently nudge towards the mouse
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x += (dx / distance) * force * 0.5;
                        this.y += (dy / distance) * force * 0.5;
                    }
                }
            }
        }

        // Initialize particles array
        function initParticles() {
            particles = [];
            const count = getParticleCount();
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        // Draw connections between close nodes
        function connectNodes() {
            const maxDistance = 110;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Opacity fades with distance
                        const opacity = (1 - (distance / maxDistance)) * 0.15;
                        ctx.strokeStyle = `rgba(13, 148, 136, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Canvas animation frame loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectNodes();
            requestAnimationFrame(animate);
        }

        // Mouse & Touch Tracking
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Touch support for mobile interaction
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Dynamic Resize listener
        window.addEventListener('resize', resizeCanvas);

        // Bootstrap network graph
        resizeCanvas();
        animate();
    }
});
