// =====================================================
// 🔢 PROBLEMAS MATEMÁTICOS
// =====================================================

// =====================================================
// 🔐 CONTRASEÑA DEL JUEGO
// =====================================================
// 👈 EDITABLE: Cambia 'true' a 'false' para quitar la contraseña
const REQUIERE_PASSWORD = true;

// 👈 EDITABLE: Cambia la contraseña aquí
const PASSWORD_MATEMATICAS = 'wellsan';
// 👆 EDITABLE: Cambia la contraseña aquí

// Verificar autenticación
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// Ejecutar verificación inmediatamente
checkAuth();

// Control de contraseña
const passwordScreen = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');
const passwordError = document.getElementById('passwordError');

// Verificar si la contraseña ya fue validada
const passwordValidated = sessionStorage.getItem('matematicasPasswordOk');

if (!REQUIERE_PASSWORD || passwordValidated === 'true') {
    // Mostrar directamente el juego
    showIntro();
} else {
    // Configurar eventos de contraseña
    if (passwordBtn && passwordInput) {
        passwordBtn.addEventListener('click', verifyPassword);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyPassword();
        });
    }
}

function verifyPassword() {
    const input = passwordInput.value.toLowerCase().trim();
    if (input === PASSWORD_MATEMATICAS.toLowerCase()) {
        // Contraseña correcta
        sessionStorage.setItem('matematicasPasswordOk', 'true');
        showIntro();
    } else {
        // Contraseña incorrecta
        passwordError.classList.add('show');
        passwordInput.value = '';
        passwordInput.focus();
        setTimeout(() => {
            passwordError.classList.remove('show');
        }, 2000);
    }
}

function showIntro() {
    passwordScreen.classList.remove('active');
    introScreen.classList.add('active');
}

// 👈 EDITABLE: Añade más problemas aquí
const problems = [
    { q: "5 × 6", a: 30, emoji: "🔢" },
    { q: "7 × 8", a: 56, emoji: "🔢" },
    { q: "3²", a: 9, emoji: "📐" },
    { q: "4²", a: 16, emoji: "📐" },
    { q: "2⁴", a: 16, emoji: "📐" },
    { q: "4 x11", a: 44, emoji: "🔢" },
    { q: "5 × 5", a: 25, emoji: "🔢" },
    { q: "10 × 12", a: 120, emoji: "🔢" },
    { q: "2³", a: 8, emoji: "📐" },
    { q: "5³", a: 125, emoji: "🔢" },
    { q: "15 × 4", a: 60, emoji: "🔢" },
    { q: "6²", a: 36, emoji: "📐" },
    { q: "4³", a: 64, emoji: "🔢" },
    { q: "11 × 5", a: 55, emoji: "🔢" },
    { q: "5³", a: 125, emoji: "📐" },
    { q: "20 × 3", a: 60, emoji: "🔢" },
    { q: "8²", a: 64, emoji: "📐" },
    { q: "0.5 × 10", a: 5, emoji: "🔢" },
    { q: "13 × 2", a: 26, emoji: "🔢" },
    { q: "3⁴", a: 81, emoji: "📐" }
];

let gameState = {
    currentIndex: 0,
    score: 0,
    timeLeft: 30,
    timer: null,
    selectedProblems: [],
    isPlaying: false
};

// DOM Elements
const introScreen = document.getElementById('introScreen');
const gameScreen = document.getElementById('gameScreen');
const failScreen = document.getElementById('failScreen');
const rewardScreen = document.getElementById('rewardScreen');
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const problemText = document.getElementById('problemText');
const problemEmoji = document.getElementById('problemEmoji');
const feedbackMsg = document.getElementById('feedbackMsg');
const currentQ = document.getElementById('currentQ');
const totalQ = document.getElementById('totalQ');
const progressFill = document.getElementById('progressFill');
const timerDisplay = document.getElementById('timerDisplay');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const playPauseBtn = document.getElementById('playPauseBtn');
const rewardMusic = document.getElementById('rewardMusic');

// Shuffle array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Start game
startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);

// Submit answer
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// Navbar
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
}

// Music player
if (playPauseBtn && rewardMusic) {
    playPauseBtn.addEventListener('click', () => {
        if (rewardMusic.paused) {
            rewardMusic.play();
            playPauseBtn.innerHTML = '⏸';
        } else {
            rewardMusic.pause();
            playPauseBtn.innerHTML = '▶';
        }
    });
}

function startGame() {
    gameState.currentIndex = 0;
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.selectedProblems = shuffle(problems).slice(0, 10);
    gameState.isPlaying = true;

    showScreen('game');
    totalQ.textContent = gameState.selectedProblems.length;
    answerInput.value = '';
    answerInput.focus();

    loadProblem();
    startTimer();
}

function showScreen(screenName) {
    [introScreen, gameScreen, failScreen, rewardScreen].forEach(s => s.classList.remove('active'));
    
    switch(screenName) {
        case 'intro': introScreen.classList.add('active'); break;
        case 'game': gameScreen.classList.add('active'); break;
        case 'fail': failScreen.classList.add('active'); break;
        case 'reward': 
            rewardScreen.classList.add('active');
            createConfetti();
            createSparkles();
            break;
    }
}

function loadProblem() {
    const problem = gameState.selectedProblems[gameState.currentIndex];
    problemText.textContent = problem.display || problem.q;
    problemEmoji.textContent = problem.emoji;
    
    currentQ.textContent = gameState.currentIndex + 1;
    progressFill.style.width = ((gameState.currentIndex) / 10 * 100) + '%';
    
    answerInput.value = '';
    answerInput.focus();
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback-msg';
}

function startTimer() {
    clearInterval(gameState.timer);
    gameState.timeLeft = 30;
    timerDisplay.textContent = gameState.timeLeft;

    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            gameState.isPlaying = false;
            showScreen('fail');
        }
    }, 1000);
}

function checkAnswer() {
    if (!gameState.isPlaying) return;

    const problem = gameState.selectedProblems[gameState.currentIndex];
    const userAnswer = parseFloat(answerInput.value.replace(',', '.'));

    if (userAnswer === problem.a) {
        // Correcto
        gameState.score++;
        feedbackMsg.textContent = '¡Correcto! ❤️';
        feedbackMsg.className = 'feedback-msg feedback-correct';

        setTimeout(() => {
            gameState.currentIndex++;
            
            if (gameState.currentIndex >= 10) {
                clearInterval(gameState.timer);
                gameState.isPlaying = false;
                showScreen('reward');
            } else {
                loadProblem();
                startTimer();
            }
        }, 1000);
    } else {
        // Incorrecto
        feedbackMsg.textContent = `¡Ups! La respuesta era ${problem.a} 💜`;
        feedbackMsg.className = 'feedback-msg feedback-wrong';
        
        answerInput.value = '';
        answerInput.focus();
        
        gameState.currentIndex++;
        
        if (gameState.currentIndex >= 10) {
            clearInterval(gameState.timer);
            gameState.isPlaying = false;
            showScreen('reward');
        } else {
            setTimeout(() => {
                loadProblem();
                startTimer();
            }, 1500);
        }
    }
}

function createConfetti() {
    const container = document.body;
    const emojis = ['❤️', '💜', '💕', '💖', '✨', '🎉'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

function createSparkles() {
    const sparklesTop = document.getElementById('sparklesTop');
    const sparklesBottom = document.getElementById('sparklesBottom');
    const sparkleEmojis = ['✨', '💫', '⭐', '🌟'];
    
    [sparklesTop, sparklesBottom].forEach(container => {
        if (!container) return;
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('span');
            sparkle.classList.add('sparkle');
            sparkle.innerHTML = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            sparkle.style.left = (i * 12 + 5) + '%';
            sparkle.style.setProperty('--sd', (Math.random() * 1 + 1.5) + 's');
            sparkle.style.setProperty('--delay', (Math.random() * 1) + 's');
            container.appendChild(sparkle);
        }
    });
}
