/* ============================================
   ROMANTIC WEBSITE - JAVASCRIPT
   ============================================ */

// ===== Configuration =====
const PARTICLE_EMOJIS = ['💕', '💖', '💗', '💝', '🌸', '🌺', '🌷', '🌹', '✨', '💐', '🦋', '⭐'];
const HEART_EMOJIS = ['💖', '💗', '💕', '💝', '❤️', '💘', '💓'];
const FLOWER_EMOJIS = ['🌸', '🌺', '🌷', '🌹', '💐', '🌻'];
const BURST_EMOJIS = ['💖', '💗', '🌸', '✨', '💕', '🌺', '💝', '🌷', '⭐', '🦋'];

// ===== Particles System =====
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    
    const size = Math.random() * 20 + 14;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 8;
    const delay = Math.random() * 5;
    const sway = (Math.random() - 0.5) * 200;
    
    particle.style.cssText = `
        left: ${left}%;
        font-size: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
    
    // Clean up after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        // Create new particle
        createParticle(container);
    }, (duration + delay) * 1000);
}

function initParticles(containerId, count = 20) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => createParticle(container), i * 300);
    }
}

// ===== Burst Effect =====
function createBurst(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        particle.textContent = BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];
        
        const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.5);
        const velocity = Math.random() * 200 + 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const duration = Math.random() * 1 + 0.8;
        const size = Math.random() * 20 + 16;
        
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            font-size: ${size}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
            animation-duration: ${duration}s;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
}

// ===== Falling Hearts Rain =====
function createFallingHearts(duration = 5000) {
    const interval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        
        const emoji = [...HEART_EMOJIS, ...FLOWER_EMOJIS][Math.floor(Math.random() * (HEART_EMOJIS.length + FLOWER_EMOJIS.length))];
        heart.textContent = emoji;
        
        const left = Math.random() * 100;
        const size = Math.random() * 25 + 18;
        const animDuration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        heart.style.cssText = `
            left: ${left}vw;
            font-size: ${size}px;
            animation-duration: ${animDuration}s;
            animation-delay: ${delay}s;
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, (animDuration + delay) * 1000 + 500);
    }, 80);
    
    setTimeout(() => clearInterval(interval), duration);
}

// ===== Open Surprise / Main Transition =====
function openSurprise() {
    const button = document.getElementById('openBtn');
    const landing = document.getElementById('landing');
    const mainContent = document.getElementById('mainContent');
    
    // Button click effect
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create burst from button
    createBurst(centerX, centerY, 40);
    
    // Start falling hearts
    createFallingHearts(6000);
    
    // Button animation
    button.style.transform = 'scale(1.2)';
    button.style.pointerEvents = 'none';
    
    setTimeout(() => {
        button.style.transform = 'scale(0)';
        button.style.opacity = '0';
    }, 300);
    
    // Fade out landing
    setTimeout(() => {
        landing.classList.add('exit');
    }, 600);
    
    // Show main content
    setTimeout(() => {
        landing.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('showing');
        
        // Initialize main content particles
        initParticles('particles-main', 15);
        
        // Trigger scroll animations
        setTimeout(() => {
            initScrollAnimations();
        }, 300);
        
        // Scroll to top of main content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);
}

// ===== Scroll-based Animations =====
function initScrollAnimations() {
    const cards = document.querySelectorAll('.photo-card');
    const specialCard = document.querySelector('.special-card');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                const delay = index * 150;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.transition = `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms`;
                }, delay);
            }
        });
    }, observerOptions);
    
    cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(card);
    });
    
    if (specialCard) {
        observer.observe(specialCard);
    }
}

// ===== Music Toggle =====
let isPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('musicToggle');
    const musicIcon = toggleBtn.querySelector('.music-icon');
    
    if (isPlaying) {
        audio.pause();
        musicIcon.textContent = '🎵';
        toggleBtn.classList.remove('playing');
    } else {
        audio.play().catch(() => {
            console.log('Audio playback requires user interaction first');
        });
        musicIcon.textContent = '🎶';
        toggleBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
}

// ===== Cursor Trail Effect =====
function initCursorTrail() {
    let lastTime = 0;
    const minInterval = 100; // ms between trails
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < minInterval) return;
        lastTime = now;
        
        const trail = document.createElement('div');
        const emoji = Math.random() > 0.5 ? '💕' : '✨';
        trail.textContent = emoji;
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            pointer-events: none;
            z-index: 9999;
            font-size: ${Math.random() * 12 + 10}px;
            transition: all 1s ease-out;
            opacity: 1;
        `;
        
        document.body.appendChild(trail);
        
        requestAnimationFrame(() => {
            trail.style.transform = `translateY(-30px) scale(0.3)`;
            trail.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    });
}

// ===== Card Tilt Effect =====
function initCardTilt() {
    const cards = document.querySelectorAll('.photo-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

// ===== Footer Date =====
function setFooterDate() {
    const dateEl = document.getElementById('footerDate');
    if (dateEl) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateEl.textContent = now.toLocaleDateString('id-ID', options);
    }
}

// ===== Random Sparkle on Page =====
function randomSparkle() {
    setInterval(() => {
        const sparkle = document.createElement('div');
        const emojis = ['✨', '💖', '🌸', '⭐'];
        sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        sparkle.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            font-size: ${Math.random() * 15 + 10}px;
            pointer-events: none;
            z-index: 3;
            opacity: 0;
            transition: all 1.5s ease-out;
        `;
        
        document.body.appendChild(sparkle);
        
        requestAnimationFrame(() => {
            sparkle.style.opacity = '0.8';
            sparkle.style.transform = 'scale(1.5) translateY(-20px)';
        });
        
        setTimeout(() => {
            sparkle.style.opacity = '0';
            sparkle.style.transform = 'scale(0) translateY(-40px)';
        }, 800);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2500);
    }, 2000);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Start landing particles
    initParticles('particles-landing', 15);
    
    // Set footer date
    setFooterDate();
    
    // Init cursor trail
    initCursorTrail();
    
    // Random sparkles
    randomSparkle();
    
    // Card tilt (will work after cards are visible)
    setTimeout(() => initCardTilt(), 2000);
});

// Reinit card tilt when main content becomes visible
const mainContentObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        const main = document.getElementById('mainContent');
        if (main && !main.classList.contains('hidden')) {
            setTimeout(() => initCardTilt(), 500);
        }
    });
});

const mainTarget = document.getElementById('mainContent');
if (mainTarget) {
    mainContentObserver.observe(mainTarget, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });
}
