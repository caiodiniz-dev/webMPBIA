// Language Management
let currentLanguage = 'pt';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    document.getElementById('current-lang').textContent = currentLanguage === 'pt' ? 'EN' : 'PT';
    updateLanguage();
}

function updateLanguage() {
    // Update all elements with data-pt and data-en attributes
    const elements = document.querySelectorAll('[data-pt], [data-en]');
    elements.forEach(el => {
        const text = currentLanguage === 'pt' ? el.getAttribute('data-pt') : el.getAttribute('data-en');
        if (text) {
            el.textContent = text;
        }
    });
    
    // Update placeholders
    const inputs = document.querySelectorAll('[data-placeholder-pt], [data-placeholder-en]');
    inputs.forEach(input => {
        const placeholder = currentLanguage === 'pt' 
            ? input.getAttribute('data-placeholder-pt') 
            : input.getAttribute('data-placeholder-en');
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
    
    // Update map pin tooltips
    updateMapPins();
}

function updateMapPins() {
    const pins = document.querySelectorAll('.map-pin');
    pins.forEach(pin => {
        const namePt = pin.getAttribute('data-name-pt');
        const nameEn = pin.getAttribute('data-name-en');
        const people = pin.getAttribute('data-people');
        const name = currentLanguage === 'pt' ? namePt : nameEn;
        const label = currentLanguage === 'pt' ? 'pessoas ajudadas' : 'people helped';
        
        // Update the CSS content via inline style
        pin.style.setProperty('--tooltip-content', `"${name}\\A+${parseInt(people).toLocaleString()} ${label}"`);
    });
}

// Smooth Scroll
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80; // navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Scroll Animation Observer
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const duration = 2000; // 2 seconds
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Copy to Clipboard
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Change icon temporarily
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-check';
        button.classList.add('copied');
        
        // Show toast
        showToast(currentLanguage === 'pt' ? 'Copiado!' : 'Copied!');
        
        // Reset after 2 seconds
        setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast(currentLanguage === 'pt' ? 'Erro ao copiar' : 'Copy failed', 'error');
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? 'hsl(120, 60%, 40%)' : 'hsl(0, 75%, 55%)';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Form Submission
function handleIdeaFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const idea = document.getElementById('idea').value;
    
    const message = `Olá MPBIA! Tive uma ideia para o próximo projeto.\n\nNome: ${name}\nCidade: ${city}\nIdeia: ${idea}`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5521988793046&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Clear form
    e.target.reset();
}

// Initialize Map Pins
function initMapPins() {
    const pins = document.querySelectorAll('.map-pin');
    
    pins.forEach(pin => {
        // Create ping animation element
        const ping = document.createElement('div');
        ping.className = 'pin-ping';
        pin.appendChild(ping);
    });
    
    updateMapPins();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Language toggle
    document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
    
    // Navbar scroll
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Logo click
    document.querySelector('.logo-container').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Setup animations
    setupScrollAnimations();
    animateCounters();
    
    // Form submission
    const ideaForm = document.getElementById('idea-form');
    if (ideaForm) {
        ideaForm.addEventListener('submit', handleIdeaFormSubmit);
    }
    
    // Initialize map pins
    initMapPins();
    
    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate animations if needed
        setupScrollAnimations();
    }, 250);
});
