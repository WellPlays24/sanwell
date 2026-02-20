document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    createFloatingHearts();
    createParticles();
    initMusicPlayer();
    initDaysCounter();
    initNavbar();

    const btn = document.getElementById('loveBtn');
    const audio = document.getElementById('bgMusic');

    btn.addEventListener('click', () => {
        burstHearts();
        audio.volume = 0.5;
        showLoveMessage();
    });
});

// ========== VERIFICAR AUTENTICACIÓN ==========
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// ========== NAVBAR ==========
function initNavbar() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }
}

// ========== CORAZONES FLOTANTES ==========
function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const heartCount = 25;

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = getRandomHeart();
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 4 + 5 + 's';
            heart.style.fontSize = Math.random() * 1.2 + 0.6 + 'rem';
            heart.style.opacity = Math.random() * 0.5 + 0.2;
            heart.style.animationName = 'fall';
            heart.style.animationTimingFunction = 'linear';
            heart.style.animationIterationCount = 'infinite';
            container.appendChild(heart);
        }, i * 400);
    }
}

function getRandomHeart() {
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💞', '💘', '💝'];
    return hearts[Math.floor(Math.random() * hearts.length)];
}

// ========== PARTÍCULAS DE LUZ ==========
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.background = Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--accent-color)';
        container.appendChild(particle);
    }
}

// ========== REPRODUCTOR DE MÚSICA ==========
function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    const musicCard = document.querySelector('.music-player-card');

    if (!musicToggle || !audio) return;

    musicToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicCard.classList.add('playing');
            }).catch(err => console.log('Audio autoplay blocked'));
        } else {
            audio.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
            musicCard.classList.remove('playing');
        }
    });
}

// ========== CONTADOR DE DÍAS JUNTOS ==========
function initDaysCounter() {
    const daysNumber = document.getElementById('daysNumber');
    if (!daysNumber) return;

    // CAMBIA ESTA FECHA A TU FECHA ESPECIAL
    const startDate = new Date('2025-12-03'); // ← Pon la fecha cuando empezaron
    
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const days = Math.max(0, diffDays);
    
    // Animación de conteo
    let current = 0;
    const increment = Math.ceil(days / 30);
    const interval = setInterval(() => {
        current += increment;
        if (current >= days) {
            current = days;
            clearInterval(interval);
        }
        daysNumber.textContent = current;
    }, 50);
}

// ========== EXPLOSIÓN DE CORAZONES ==========
function burstHearts() {
    const total = 50;
    const container = document.body;
    
    for (let i = 0; i < total; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = getRandomHeart();
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = 'translate(-50%, -50%)';
            heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.transition = 'all 1s ease-out';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 300 + 100;
            
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            requestAnimationFrame(() => {
                heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
                heart.style.opacity = '0';
            });
            
            container.appendChild(heart);
            
            setTimeout(() => heart.remove(), 1000);
        }, i * 20);
    }
}

// ========== MENSAJE DE AMOR ==========
function showLoveMessage() {
    const messages = [
        'You are amazing! ❤️',
        'I love you! 💜',
        'You make me happy! 💕',
        'You are my everything! 💖',
        'Forever yours! 💘'
    ];

    const container = document.body;
    const msg = document.createElement('div');
    msg.innerHTML = messages[Math.floor(Math.random() * messages.length)];
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-family: 'Dancing Script', cursive;
        color: var(--primary-color);
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: popIn 0.5s ease-out;
        pointer-events: none;
    `;

    container.appendChild(msg);

    setTimeout(() => {
        msg.style.transition = 'all 0.5s ease-out';
        msg.style.opacity = '0';
        msg.style.transform = 'translate(-50%, -50%) scale(0.5)';
    }, 1500);

    setTimeout(() => msg.remove(), 2000);
}
