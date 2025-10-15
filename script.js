// ============================================
// CONFIGURATION & GLOBAL VARIABLES
// ============================================
const CONFIG = {
    typingSpeed: 100,
    deletingSpeed: 50,
    delayBetweenTexts: 2000,
    particleCount: 50,
    cursorTrailLength: 10,
    statsAnimationDuration: 2000,
    skillBarAnimationDelay: 200
};

let isMobile = window.innerWidth <= 768;
let particleCanvas, particleCtx;
let particles = [];
let cursorX = 0, cursorY = 0;

// ============================================
// PRELOADER WITH PROGRESS
// ============================================
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressBar = document.getElementById('progressBar');
        this.loadingText = document.getElementById('loadingText');
        this.loadingPercentage = document.getElementById('loadingPercentage');
        this.progress = 0;
        this.loadingMessages = [
            'Initializing...',
            'Loading Resources...',
            'Preparing Experience...',
            'Almost Ready...',
            'Welcome!'
        ];
    }

    updateProgress(progress) {
        this.progress = progress;
        if (this.progressBar) {
            this.progressBar.style.width = progress + '%';
        }
        if (this.loadingPercentage) {
            this.loadingPercentage.textContent = Math.floor(progress) + '%';
        }

        const messageIndex = Math.floor(progress / 20);
        if (this.loadingText && this.loadingMessages[messageIndex]) {
            this.loadingText.textContent = this.loadingMessages[messageIndex];
        }
    }

    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 500);
            }
            this.updateProgress(progress);
        }, 200);
    }

    hide() {
        if (this.preloader) {
            this.preloader.classList.add('hidden');
            setTimeout(() => {
                this.preloader.style.display = 'none';
            }, 500);
        }
    }

    init() {
        this.simulateLoading();
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
    constructor() {
        this.dot = document.getElementById('cursorDot');
        this.outline = document.getElementById('cursorOutline');
        this.isVisible = !isMobile;
    }

    init() {
        if (!this.isVisible) return;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            if (this.dot) {
                this.dot.style.left = cursorX + 'px';
                this.dot.style.top = cursorY + 'px';
            }

            setTimeout(() => {
                if (this.outline) {
                    this.outline.style.left = cursorX + 'px';
                    this.outline.style.top = cursorY + 'px';
                }
            }, 100);
        });

        document.addEventListener('mousedown', () => {
            if (this.dot) this.dot.classList.add('click');
            if (this.outline) this.outline.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            if (this.dot) this.dot.classList.remove('click');
            if (this.outline) this.outline.classList.remove('click');
        });

        document.addEventListener('mouseleave', () => {
            if (this.dot) this.dot.style.opacity = '0';
            if (this.outline) this.outline.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            if (this.dot) this.dot.style.opacity = '1';
            if (this.outline) this.outline.style.opacity = '0.5';
        });

        const interactiveElements = document.querySelectorAll('a, button, .project-card, .expertise-card, .skill-tab');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.dot) this.dot.style.transform = 'scale(2)';
                if (this.outline) this.outline.style.transform = 'scale(1.5)';
            });

            el.addEventListener('mouseleave', () => {
                if (this.dot) this.dot.style.transform = 'scale(1)';
                if (this.outline) this.outline.style.transform = 'scale(1)';
            });
        });
    }
}

// ============================================
// PARTICLE CANVAS ANIMATION
// ============================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = isMobile ? 30 : 80;
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(0, 217, 255, 0.5)',
            'rgba(182, 109, 255, 0.5)',
            'rgba(255, 107, 203, 0.5)',
            'rgba(0, 255, 136, 0.5)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }

            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;

                particle.x -= directionX * force * 2;
                particle.y -= directionY * force * 2;
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            this.particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * (1 - distance / 100)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                    }
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// THEME SWITCHER
// ============================================
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'cyan';
        this.themeBtns = document.querySelectorAll('.theme-btn');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);

        this.themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                this.switchTheme(theme);
            });
        });
    }

    switchTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('theme', theme);

        this.themeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            }
        });

        showToast(`Theme changed to ${theme}`, 'success');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        const root = document.documentElement;
        const themes = {
            cyan: { primary: '#00d9ff', secondary: '#b66dff' },
            purple: { primary: '#b66dff', secondary: '#ff6bcb' },
            green: { primary: '#00ff88', secondary: '#00d9ff' },
            orange: { primary: '#ff6b35', secondary: '#f7931e' }
        };

        const colors = themes[theme];
        root.style.setProperty('--accent-primary', colors.primary);
        root.style.setProperty('--accent-secondary', colors.secondary);
    }
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scrollProgress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;

            if (this.progressBar) {
                this.progressBar.style.width = scrolled + '%';
            }
        });
    }
}

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.closeMobileMenu = document.getElementById('closeMobileMenu');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            this.updateActiveLink();
        });

        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenu.classList.add('active');
                this.mobileMenuBtn.classList.add('active');
            });
        }

        if (this.closeMobileMenu) {
            this.closeMobileMenu.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        this.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    closeMenu() {
        this.mobileMenu.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// TYPING ANIMATION
// ============================================
class TypingAnimation {
    constructor(element, texts) {
        this.element = element;
        this.texts = texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        setTimeout(() => this.type(), 1000);
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = CONFIG.delayBetweenTexts;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ============================================
// STATS COUNTER
// ============================================
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateStats();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateStats() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = CONFIG.statsAnimationDuration;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + '+';
                }
            };

            updateCounter();
        });
    }
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-bar');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, CONFIG.skillBarAnimationDelay);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        this.skillBars.forEach(bar => {
            bar.style.width = '0%';
            observer.observe(bar);
        });
    }
}

// ============================================
// SKILLS TABS
// ============================================
class SkillsTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.skill-tab');
        this.panels = document.querySelectorAll('.skill-panel');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanel = tab.getAttribute('data-tab');
                this.switchTab(targetPanel);
                
                setTimeout(() => {
                    const skillBars = document.querySelectorAll('.skill-panel.active .skill-bar');
                    skillBars.forEach(bar => {
                        bar.style.width = '0%';
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 100);
                    });
                }, 100);
            });
        });
    }

    switchTab(targetPanel) {
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.panels.forEach(panel => panel.classList.remove('active'));

        const activeTab = document.querySelector(`.skill-tab[data-tab="${targetPanel}"]`);
        const activePanel = document.querySelector(`.skill-panel[data-panel="${targetPanel}"]`);

        if (activeTab) activeTab.classList.add('active');
        if (activePanel) activePanel.classList.add('active');
    }
}

// ============================================
// PROJECT FILTERING
// ============================================
class ProjectFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterProjects(filter);
                
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
    }
}

// ============================================
// PROJECT MODAL
// ============================================
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalContent = document.getElementById('modalContent');
        this.projectsData = this.getProjectsData();
        this.init();
    }

    init() {
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target.id === 'projectModal') {
                    this.close();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.close();
            }
        });
    }

    getProjectsData() {
        return {
            1: {
                title: 'E-Commerce Platform',
                description: 'A comprehensive enterprise-grade e-commerce solution built with modern technologies and microservices architecture. Handles over 100,000 daily transactions with 99.9% uptime.',
                features: [
                    'Microservices architecture for scalability',
                    'Real-time inventory management system',
                    'Advanced search and filtering capabilities',
                    'Secure payment gateway integration (Stripe, PayPal)',
                    'Order tracking and management system',
                    'Admin dashboard with analytics',
                    'Mobile-responsive design',
                    'Multi-language and multi-currency support'
                ],
                tech: ['React', 'Node.js', 'MySQL', 'Docker', 'AWS', 'Redis', 'Stripe'],
                github: 'https://github.com/yourusername/ecommerce',
                demo: 'https://demo.example.com'
            },
            2: {
                title: 'Analytics Dashboard',
                description: 'Real-time data visualization platform with WebSocket integration processing millions of data points efficiently. Built for enterprise-level data analysis.',
                features: [
                    'Real-time WebSocket data streaming',
                    'Interactive charts and visualizations (Chart.js, D3.js)',
                    'Custom reporting and export features',
                    'Role-based access control',
                    'Performance monitoring and alerts',
                    'Data aggregation pipelines',
                    'Scheduled automated reports',
                    'RESTful and GraphQL API integration'
                ],
                tech: ['Vue.js', 'Python', 'PostgreSQL', 'Redis', 'Chart.js', 'WebSocket'],
                github: 'https://github.com/yourusername/analytics',
                demo: 'https://analytics.example.com'
            },
            3: {
                title: 'Mobile Banking App',
                description: 'Cross-platform mobile banking solution with biometric authentication and real-time transaction processing. Secure, fast, and user-friendly.',
                features: [
                    'Biometric authentication (Face ID, Touch ID)',
                    'Real-time transaction processing',
                    'Push notifications for account activity',
                    'Bill payment integration',
                    'P2P money transfer',
                    'Account management and statements',
                    'QR code payments',
                    'End-to-end encryption'
                ],
                tech: ['React Native', 'Node.js', 'MySQL', 'OAuth2', 'Firebase', 'Plaid'],
                github: 'https://github.com/yourusername/banking',
                demo: 'https://banking.example.com'
            },
            4: {
                title: 'AI Recommendation Engine',
                description: 'Machine learning-powered recommendation system using collaborative filtering algorithms for personalized content delivery. Increases user engagement by 45%.',
                features: [
                    'Collaborative filtering algorithms',
                    'Content-based recommendations',
                    'Real-time prediction engine',
                    'A/B testing framework',
                    'Performance analytics dashboard',
                    'User behavior tracking and analysis',
                    'Scalable microservices architecture',
                    'RESTful API endpoints'
                ],
                tech: ['Python', 'TensorFlow', 'MongoDB', 'Kubernetes', 'Apache Kafka', 'FastAPI'],
                github: 'https://github.com/yourusername/ai-engine',
                demo: 'https://ai.example.com'
            },
            5: {
                title: 'Security Management System',
                description: 'Enterprise security system with AES-256 encryption, JWT authentication, and comprehensive audit logging. Protects sensitive data with military-grade security.',
                features: [
                    'AES-256 data encryption',
                    'JWT token-based authentication',
                    'Role-based access control (RBAC)',
                    'Comprehensive audit logging',
                    'Two-factor authentication (2FA)',
                    'Security threat detection and alerts',
                    'Compliance reporting (GDPR, HIPAA)',
                    'Real-time monitoring dashboard'
                ],
                tech: ['Java', 'Spring Security', 'MongoDB', 'AWS', 'Docker', 'Elasticsearch'],
                github: 'https://github.com/yourusername/security',
                demo: 'https://security.example.com'
            },
            6: {
                title: 'Cloud Storage Platform',
                description: 'Distributed cloud storage system with end-to-end encryption and CDN integration for global content delivery. Fast, secure, and reliable.',
                features: [
                    'End-to-end encryption',
                    'File versioning and history',
                    'CDN integration for fast delivery',
                    'Sharing and collaboration tools',
                    'Mobile and desktop sync',
                    'Advanced search capabilities',
                    'Automated backups and disaster recovery',
                    'Storage analytics and insights'
                ],
                tech: ['Go', 'React', 'PostgreSQL', 'AWS S3', 'CloudFront', 'Docker'],
                github: 'https://github.com/yourusername/cloud-storage',
                demo: 'https://storage.example.com'
            }
        };
    }

    open(projectId) {
        const project = this.projectsData[projectId];
        
        if (!project) return;

        this.modalTitle.textContent = project.title;
        this.modalContent.innerHTML = `
            <p class="text-lg mb-6 font-medium leading-relaxed">${project.description}</p>
            
            <h3 class="text-2xl font-bold gradient-text mb-4 flex items-center gap-3">
                <i class="fas fa-list-check"></i>
                Key Features
            </h3>
            <ul class="list-none mb-8 space-y-3">
                ${project.features.map(f => `
                    <li class="font-medium flex items-start gap-3">
                        <i class="fas fa-check-circle text-lg mt-1" style="color: var(--accent-primary);"></i>
                        <span>${f}</span>
                    </li>
                `).join('')}
            </ul>
            
            <h3 class="text-2xl font-bold gradient-text mb-4 flex items-center gap-3">
                <i class="fas fa-tools"></i>
                Technologies Used
            </h3>
            <div class="flex flex-wrap gap-3 mb-8">
                ${project.tech.map(t => `
                    <span class="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg text-sm font-bold" style="color: var(--accent-primary);">
                        ${t}
                    </span>
                `).join('')}
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
                <button class="futuristic-btn flex-1 ripple-effect" onclick="window.open('${project.demo}', '_blank')">
                    <i class="fas fa-external-link-alt mr-2"></i>Live Demo
                </button>
                <button class="futuristic-btn-outline flex-1 ripple-effect" onclick="window.open('${project.github}', '_blank')">
                    <i class="fab fa-github mr-2"></i>View Source Code
                </button>
            </div>

            <div class="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg">
                <p class="text-sm text-center" style="color: var(--text-secondary);">
                    <i class="fas fa-info-circle mr-2"></i>
                    This is a showcase project. Links are for demonstration purposes.
                </p>
            </div>
        `;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

let projectModal;
function openProjectModal(id) {
    projectModal.open(id);
}

function closeProjectModal() {
    projectModal.close();
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        if (!this.validateForm(data)) {
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('Message sent successfully! I\'ll get back to you soon.', 'success', 4000);
            
            this.form.reset();
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    validateForm(data) {
        if (!data.name || !data.email || !data.subject || !data.message) {
            showToast('Please fill in all fields', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showToast('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }
}

// ============================================
// SCROLL TO TOP
// ============================================
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTop');
        this.init();
    }

    init() {
        if (!this.button) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.style.opacity = '1';
                this.button.style.pointerEvents = 'all';
            } else {
                this.button.style.opacity = '0';
                this.button.style.pointerEvents = 'none';
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToProjects() {
    scrollToSection('projects');
}

function scrollToContact() {
    scrollToSection('contact');
}

function downloadCV() {
    showToast('Preparing CV download...', 'info', 2000);
    
    setTimeout(() => {
        showToast('CV download started!', 'success');
        // Actual download link - Replace with your CV file path
        // window.open('assets/cv/rahul-mahata-cv.pdf', '_blank');
    }, 1000);
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('🚀 Performance Metrics:', {
                'Page Load Time': `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`,
                'DOM Content Loaded': `${(perfData.domContentLoadedEventEnd - perfData.fetchStart).toFixed(2)}ms`,
                'Time to Interactive': `${(perfData.domInteractive - perfData.fetchStart).toFixed(2)}ms`
            });
        });
    }
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
function showConsoleMessage() {
    const styles = [
        'color: #00d9ff; font-size: 24px; font-weight: bold;',
        'color: #b66dff; font-size: 16px;',
        'color: #00ff88; font-size: 14px;'
    ];

    console.log('%c👋 Hey there, fellow developer!', styles[0]);
    console.log('%cLooking for a talented developer?', styles[1]);
    console.log('%c📧 Let\'s connect: rahulmahata3460@gmail.com', styles[2]);
    console.log('%c💼 Check out my projects above!', styles[2]);
    console.log('%c\n🎨 This portfolio is built with:', 'color: #fff; font-size: 12px;');
    console.log('  • Vanilla JavaScript (ES6+)');
    console.log('  • Custom CSS Animations');
    console.log('  • HTML5 Canvas');
    console.log('  • Intersection Observer API');
    console.log('  • And lots of ☕ coffee!');
    console.log('\n%c🔥 Want to work together? Reach out!', 'color: #00d9ff; font-size: 14px; font-weight: bold;');
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initializing...');

    // Initialize all components
    const preloader = new Preloader();
    const customCursor = new CustomCursor();
    const particleSystem = new ParticleSystem();
    const themeSwitcher = new ThemeSwitcher();
    const scrollProgress = new ScrollProgress();
    const navigation = new Navigation();
    const statsCounter = new StatsCounter();
    const skillBars = new SkillBars();
    const skillsTabs = new SkillsTabs();
    const projectFilter = new ProjectFilter();
    projectModal = new ProjectModal();
    const contactForm = new ContactForm();
    const scrollToTop = new ScrollToTop();

    // Initialize typing animation
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        new TypingAnimation(typingElement, [
            'Senior Software Developer',
            'Database Architect',
            'Full-Stack Engineer',
            'Cloud Solutions Expert',
            'Problem Solver'
        ]);
    }

    // Initialize utilities
    initLazyLoading();
    monitorPerformance();
    showConsoleMessage();

    // Start preloader
    preloader.init();

    // Update mobile status on resize
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    });

    console.log('✅ Portfolio loaded successfully!');
});

// ============================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// ============================================
// EXPORT FOR MODULE USE
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        scrollToProjects,
        scrollToContact,
        downloadCV,
        openProjectModal,
        closeProjectModal
    };
}