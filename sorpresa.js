/* sorpresa.js – Lógica del mini-juego de corazones */

const GOAL = 15;          // cuántos corazones hay que atrapar
const HEART_EMOJIS = ['💜', '💗', '💖', '💝', '🩷', '💕', '💞'];
let caught = 0;
let gameActive = false;
let spawnInterval = null;

/* Verificar autenticación */
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

/* Navbar */
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('open'));
        });
    }
});

/* ============================================================
   ESTRELLAS DE FONDO
   ============================================================ */
function createStars() {
    const bg = document.getElementById('stars-bg');
    for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.classList.add('star');
        const size = Math.random() * 3 + 1;
        s.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            --dur: ${Math.random() * 3 + 2}s;
            animation-delay: ${Math.random() * 4}s;
        `;
        bg.appendChild(s);
    }
}

/* ============================================================
   TRANSICIÓN ENTRE PANTALLAS
   ============================================================ */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    const el = document.getElementById(id);
    el.style.display = 'flex';
    // forzar reflow para disparar animación
    void el.offsetWidth;
    el.classList.add('active');
}

/* ============================================================
   JUEGO: GENERAR CORAZÓN FLOTANTE
   ============================================================ */
function spawnHeart() {
    if (!gameActive) return;

    const playfield = document.getElementById('heartPlayfield');
    const heart = document.createElement('div');
    heart.classList.add('game-heart');

    const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    heart.textContent = emoji;

    // Posición aleatoria en la pantalla (evitando bordes)
    const startX = Math.random() * (window.innerWidth - 80) + 10;
    const startY = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2;
    heart.style.left = startX + 'px';
    heart.style.top = startY + 'px';

    const dur = Math.random() * 2 + 3; // 3s – 5s
    heart.style.setProperty('--dur', dur + 's');

    heart.addEventListener('click', () => catchHeart(heart));
    heart.addEventListener('touchstart', (e) => { e.preventDefault(); catchHeart(heart); }, { passive: false });

    playfield.appendChild(heart);

    // Auto-eliminar si no se atrapa
    setTimeout(() => {
        if (heart.parentNode) heart.remove();
    }, dur * 1000);
}

/* ============================================================
   JUEGO: ATRAPAR UN CORAZÓN
   ============================================================ */
function catchHeart(heart) {
    if (!gameActive || heart.classList.contains('caught')) return;
    heart.classList.add('caught');

    caught++;
    updateProgress();

    // Mini efecto de puntos flotantes
    showFloatingPlus(heart);

    setTimeout(() => {
        if (heart.parentNode) heart.remove();
    }, 450);

    if (caught >= GOAL) {
        endGame();
    }
}

function showFloatingPlus(heart) {
    const plus = document.createElement('div');
    plus.textContent = '+1 💜';
    plus.style.cssText = `
        position: fixed;
        left: ${heart.getBoundingClientRect().left + 20}px;
        top:  ${heart.getBoundingClientRect().top}px;
        font-size: 1rem;
        font-family: 'Nunito', sans-serif;
        font-weight: bold;
        color: #ffd6ff;
        pointer-events: none;
        z-index: 300;
        text-shadow: 0 0 8px rgba(199,125,255,0.8);
        animation: floatPlus 0.8s ease-out forwards;
    `;
    document.body.appendChild(plus);
    setTimeout(() => plus.remove(), 800);

    // Inyectar la keyframe dinámicamente si no existe
    if (!document.getElementById('floatPlusKF')) {
        const style = document.createElement('style');
        style.id = 'floatPlusKF';
        style.textContent = `
            @keyframes floatPlus {
                from { opacity: 1; transform: translateY(0); }
                to   { opacity: 0; transform: translateY(-50px); }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================================
   ACTUALIZAR BARRA DE PROGRESO
   ============================================================ */
function updateProgress() {
    const pct = Math.min((caught / GOAL) * 100, 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('counterDisplay').textContent = `${caught} / ${GOAL}`;
}

/* ============================================================
   INICIAR JUEGO
   ============================================================ */
function startGame() {
    caught = 0;
    gameActive = true;
    updateProgress();
    showScreen('gameScreen');

    // Spawn progresivo: rápido al final
    let interval = 900;
    spawnInterval = setInterval(() => {
        spawnHeart();
        // Acelerar a medida que se acercan al goal
        if (caught > GOAL * 0.7 && interval > 500) {
            clearInterval(spawnInterval);
            interval = 500;
            spawnInterval = setInterval(spawnHeart, interval);
        }
    }, interval);
}

/* ============================================================
   TERMINAR JUEGO → RECOMPENSA
   ============================================================ */
function endGame() {
    gameActive = false;
    clearInterval(spawnInterval);

    // Limpiar corazones restantes
    document.getElementById('heartPlayfield').innerHTML = '';

    setTimeout(() => {
        showScreen('rewardScreen');
        launchConfetti();
        buildSparkles('sparklesTop');
        buildSparkles('sparklesBottom');
        autoPlayMusic();
    }, 600);
}

/* ============================================================
   CONFETTI DE CORAZONES
   ============================================================ */
function launchConfetti() {
    const emojis = ['💜', '💗', '💖', '🌸', '✨', '💫', '🩷', '💕'];
    for (let i = 0; i < 50; i++) {
        const c = document.createElement('div');
        c.classList.add('confetti-piece');
        c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const tx = (Math.random() - 0.5) * 400;
        const delay = Math.random() * 1.5;
        const dur = Math.random() * 1.5 + 1.5;
        c.style.cssText = `
            left: ${Math.random() * 100}%;
            top: -40px;
            --tx: ${tx}px;
            --d: ${dur}s;
            --delay: ${delay}s;
            animation-delay: ${delay}s;
        `;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), (delay + dur + 0.5) * 1000);
    }
}

/* ============================================================
   SPARKLES ALREDEDOR DEL MENSAJE
   ============================================================ */
function buildSparkles(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const symbols = ['✨', '💜', '🌸', '💫', '🩷', '⭐', '💗'];
    for (let i = 0; i < 7; i++) {
        const sp = document.createElement('span');
        sp.classList.add('sparkle');
        sp.textContent = symbols[i % symbols.length];
        sp.style.cssText = `
            left: ${(i / 6) * 90 + 2}%;
            top: 0;
            --sd: ${Math.random() * 1 + 1.5}s;
            --delay: ${i * 0.2}s;
            animation-delay: ${i * 0.2}s;
        `;
        container.appendChild(sp);
    }
}

/* ============================================================
   REPRODUCTOR DE MÚSICA
   ============================================================ */
function autoPlayMusic() {
    const audio = document.getElementById('rewardMusic');
    const btn = document.getElementById('playPauseBtn');

    audio.volume = 0.75;
    audio.play().catch(() => { });

    btn.textContent = '⏸';

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            btn.textContent = '⏸';
        } else {
            audio.pause();
            btn.textContent = '▶';
        }
    });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    showScreen('introScreen');

    document.getElementById('startBtn').addEventListener('click', startGame);
});
