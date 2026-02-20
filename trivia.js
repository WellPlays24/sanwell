/* trivia.js – Lógica de la trivia romántica 💜 */

/* ============================================================
   PREGUNTAS  (personaliza a tu gusto)
   ============================================================ */
const QUESTIONS = [
    {
        emoji: '🎶',
        text: '¿En qué mes nos conocimos?',
        options: ['Enero', 'Febrero', 'Diciembre', 'Noviembre'],
        correct: 0  // índice 0-based → "Marzo"  ← cambia según la realidad
    },
    {
        emoji: '🌙',
        text: '¿Cuál fue el primer lugar donde salimos juntos?',
        options: ['Un café', 'Un parque', 'Un restaurante', 'Una finca con cascada'],
        correct: 3   // ← ajusta al lugar real
    },
    {
        emoji: '💜',
        text: '¿En que fecha exacta nos vimos por primera vez?',
        options: ['14 de Diciembre', '23 de Enero', 
            '16 de Enero', '14 de Febrero'],
        correct: 1   // Morado ← ajusta si hace falta
    },
    {
        emoji: '🎵',
        text: '¿Que peluche tenemos en común?',
        options: ['Un Pou', 'Un perrito', 'Un osito', 'Un gatito negro'],
        correct: 0   // ← ajusta al real
    },
    {
        emoji: '🌸',
        text: '¿Cuántas veces al día piensa Wellington en ti?',
        options: ['Una vez', 'Pocas veces', 'Muchísimas veces', 'Solo cuando estamos juntos'],
        correct: 2   // siempre "Muchísimas veces" 💜
    }
];

/* ============================================================
   ESTADO
   ============================================================ */
let currentIndex = 0;
let lives = 3;           // corazones / intentos disponibles
let answeredCorrect = 0;

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
    void el.offsetWidth; // reflow para disparar animación
    el.classList.add('active');
}

/* ============================================================
   RENDERIZAR PREGUNTA
   ============================================================ */
function renderQuestion() {
    const q = QUESTIONS[currentIndex];

    document.getElementById('currentQ').textContent = currentIndex + 1;
    document.getElementById('totalQ').textContent = QUESTIONS.length;
    document.getElementById('questionEmoji').textContent = q.emoji;
    document.getElementById('questionText').textContent = q.text;

    // Barra de progreso
    const pct = (currentIndex / QUESTIONS.length) * 100;
    document.getElementById('quizProgressFill').style.width = pct + '%';

    // Corazones (vidas)
    document.getElementById('heartsDisplay').textContent =
        '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);

    // Opciones
    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = opt;
        btn.addEventListener('click', () => selectAnswer(i, btn));
        grid.appendChild(btn);
    });

    // Limpiar feedback
    document.getElementById('feedbackMsg').textContent = '';
    document.getElementById('feedbackMsg').className = 'feedback-msg';

    // Animar la card
    const card = document.getElementById('questionCard');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'cardBounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
}

/* ============================================================
   SELECCIONAR RESPUESTA
   ============================================================ */
function selectAnswer(index, btnEl) {
    const q = QUESTIONS[currentIndex];
    const allBtns = document.querySelectorAll('.option-btn');

    // Bloquear todos los botones
    allBtns.forEach(b => b.disabled = true);

    if (index === q.correct) {
        // ✅ Correcta
        btnEl.classList.add('correct');
        answeredCorrect++;

        const feedback = document.getElementById('feedbackMsg');
        feedback.textContent = getCorrectPhrase();
        feedback.classList.add('feedback-correct');

        // Siguiente pregunta o recompensa
        setTimeout(() => {
            currentIndex++;
            if (currentIndex < QUESTIONS.length) {
                renderQuestion();
            } else {
                showReward();
            }
        }, 1200);

    } else {
        // ❌ Incorrecta
        btnEl.classList.add('wrong');
        // Mostrar la correcta
        allBtns[q.correct].classList.add('correct');

        lives = Math.max(0, lives - 1);

        const feedback = document.getElementById('feedbackMsg');
        feedback.textContent = getWrongPhrase();
        feedback.classList.add('feedback-wrong');

        if (lives === 0) {
            // Sin intentos → pantalla de error
            setTimeout(() => showScreen('wrongScreen'), 1500);
        } else {
            // Todavía hay intentos → deshabilitar la incorrecta y continuar
            setTimeout(() => {
                allBtns.forEach(b => { b.disabled = false; b.classList.remove('wrong', 'correct'); });
                document.getElementById('heartsDisplay').textContent =
                    '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
                document.getElementById('feedbackMsg').textContent = '';
                document.getElementById('feedbackMsg').className = 'feedback-msg';
            }, 1300);
        }
    }
}

/* ============================================================
   FRASES DINÁMICAS
   ============================================================ */
function getCorrectPhrase() {
    const phrases = [
        '¡Exacto! Sabía que lo recordabas 💜',
        '¡Correcto! Eres la mejor 🌸',
        '¡Sí! Así me enamoraste más 💕',
        '¡Perfecto! Eres increíble ✨',
        '¡Bien! Eso me hace muy feliz 🩷'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function getWrongPhrase() {
    const phrases = [
        'Mmm… no exactamente 🙈 intenta de nuevo',
        'Casi… recuerda bien ese momento 💜',
        '¡Paciencia! Todavía tienes corazones ❤️',
        'No pasa nada, vuelve a pensar un poquito 🌸'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

/* ============================================================
   RECOMPENSA
   ============================================================ */
function showReward() {
    showScreen('rewardScreen');
    launchConfetti();
    buildSparkles('sparklesTop');
    buildSparkles('sparklesBottom');
    autoPlayMusic();
}

/* ============================================================
   CONFETTI
   ============================================================ */
function launchConfetti() {
    const emojis = ['💜', '💗', '💖', '🌸', '✨', '💫', '🩷', '💕', '🤗'];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.classList.add('confetti-piece');
        c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const tx = (Math.random() - 0.5) * 500;
        const delay = Math.random() * 1.8;
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
   SPARKLES
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

    audio.volume = 0.8;
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
   REINTENTAR (pantalla wrong)
   ============================================================ */
function resetQuiz() {
    currentIndex = 0;
    lives = 3;
    answeredCorrect = 0;
    renderQuestion();
    showScreen('quizScreen');
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    showScreen('introScreen');

    document.getElementById('startBtn').addEventListener('click', () => {
        resetQuiz();
        showScreen('quizScreen');
    });

    document.getElementById('retryBtn').addEventListener('click', resetQuiz);
});
