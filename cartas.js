// =====================================================
// 💌 CARTAS SECRETAS
// =====================================================

// =====================================================
// 🔐 CONTRASEÑA DEL JUEGO
// =====================================================
// 👈 EDITABLE: Cambia 'true' a 'false' para quitar la contraseña
const REQUIERE_PASSWORD = true;

// 👈 EDITABLE: Cambia la contraseña aquí
const PASSWORD_CARTAS = 'wecmsevb';
// 👆 EDITABLE: Cambia la contraseña aquí

// Verificar autenticación (debe estar logueado)
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    const rol = sessionStorage.getItem('rol');
    
    // Si no está logueado, ir al login
    if (isLoggedIn !== 'true') {
        window.location.href = 'index.html';
        return false;
    }
    
    // Si es invitado, no puede entrar a cartas
    if (rol === 'invitado') {
        alert('¡Esta sección es solo para administradores! 💜');
        window.location.href = 'inicio.html';
        return false;
    }
    
    return true;
}

if (!checkAuth()) {
    throw new Error('No autorizado');
}

// Elementos
const passwordScreen = document.getElementById('passwordScreen');
const cartasScreen = document.getElementById('cartasScreen');
const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');
const passwordError = document.getElementById('passwordError');

const envelopes = document.querySelectorAll('.envelope');
const readCountDisplay = document.getElementById('readCount');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');

// Navbar
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
}

// Verificar si la contraseña ya fue validada
const passwordValidated = sessionStorage.getItem('cartasPasswordOk');

if (!REQUIERE_PASSWORD || passwordValidated === 'true') {
    // Mostrar directamente las cartas
    showCartas();
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
    
    if (input === PASSWORD_CARTAS.toLowerCase()) {
        // Contraseña correcta
        sessionStorage.setItem('cartasPasswordOk', 'true');
        showCartas();
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

function showCartas() {
    passwordScreen.classList.remove('active');
    cartasScreen.classList.add('active');
    loadProgress();
}

// Contador de cartas leídas
let readCount = 0;
const openedCards = new Set();

// Agregar eventos a los sobres
envelopes.forEach(envelope => {
    envelope.addEventListener('click', () => {
        const cartaId = envelope.dataset.carta;
        const mensaje = envelope.dataset.mensaje;
        
        // Abrir modal
        openModal(mensaje);
        
        // Marcar como leído
        if (!openedCards.has(cartaId)) {
            openedCards.add(cartaId);
            readCount = openedCards.size;
            readCountDisplay.textContent = readCount;
            envelope.classList.add('opened');
            saveProgress();
        }
    });
});

// Funciones del modal
function openModal(mensaje) {
    modalText.textContent = mensaje;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

// Guardar/Cargar progreso
function saveProgress() {
    const progress = {
        readCount: readCount,
        openedCards: Array.from(openedCards)
    };
    localStorage.setItem('cartasProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('cartasProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        readCount = progress.readCount || 0;
        openedCards.clear();
        
        progress.openedCards.forEach(id => {
            openedCards.add(id);
            const envelope = document.querySelector(`[data-carta="${id}"]`);
            if (envelope) {
                envelope.classList.add('opened');
            }
        });
        
        if (readCountDisplay) {
            readCountDisplay.textContent = readCount;
        }
    }
}
