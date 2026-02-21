/* =============================================================================
   LOGIN.JS - Sistema de autenticación romántica
   ============================================================================= */

// Cargar configuración de usuarios
// La configuración está en usuarios.js

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const errorMessage = document.getElementById('errorMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const loginBtn = document.getElementById('loginBtn');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupEventListeners();
});

// Crear partículas flotantes
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.background = Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--accent-color)';
        container.appendChild(particle);
    }
}

// Configurar event listeners
function setupEventListeners() {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' 
            ? '<i class="fas fa-eye"></i>' 
            : '<i class="fas fa-eye-slash"></i>';
    });

    loginForm.addEventListener('submit', handleLogin);

    usernameInput.addEventListener('input', () => clearError());
    passwordInput.addEventListener('input', () => clearError());

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin(e);
    });
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const nombre = usernameInput.value.toLowerCase().trim();
    const clave = passwordInput.value.toLowerCase().trim();

    if (!nombre || !clave) {
        showError('Por favor completa todos los campos');
        return;
    }

    // Validar credenciales usando la función del archivo de config
    const usuarioValido = USUARIOS.find(u => 
        u.nombre.toLowerCase() === nombre && 
        u.clave === clave
    );

    if (usuarioValido) {
        // Login exitoso - reiniciar contador de intentos
        sessionStorage.setItem('loginAttempts', '0');
        performLogin(usuarioValido);
    } else {
        // Login fallido - contar intentos
        let attempts = parseInt(sessionStorage.getItem('loginAttempts') || '0');
        attempts++;
        sessionStorage.setItem('loginAttempts', attempts.toString());
        
        // Si reach 3 intentos, redirigir a página troll
        if (attempts >= 3) {
            window.location.href = 'troll.html';
            return;
        }
        
        const restantes = 3 - attempts;
        showError(`Ups! Credenciales incorrectas 💔 (${restantes} intentos restantes)`);
        shakeInputs();
    }
}

// Realizar login
function performLogin(usuario) {
    // Guardar sesión
    sessionStorage.setItem('usuario', usuario.nombre);
    sessionStorage.setItem('nombreMostrar', usuario.nombreMostrar);
    sessionStorage.setItem('rol', usuario.rol);
    sessionStorage.setItem('loggedIn', 'true');

    // Mensaje de bienvenida según el usuario
    let mensajeBienvenida;
    if (usuario.rol === 'admin') {
        if (usuario.nombre === 'sanlly') {
            mensajeBienvenida = '¡Hola, mi Sanlly! 💜';
        } else if (usuario.nombre === 'wellington') {
            mensajeBienvenida = '¡Hola, mi Wellington! 💙';
        } else {
            mensajeBienvenida = `¡Hola, ${usuario.nombreMostrar}! ❤️`;
        }
    } else if (usuario.rol === 'invitado') {
        mensajeBienvenida = '¡Bienvenido! 💚';
    }

    // Mostrar animación de carga con mensaje de bienvenida
    const loadingName = document.getElementById('loadingName');
    if (loadingName) {
        loadingName.textContent = mensajeBienvenida;
    }
    
    loadingOverlay.classList.add('show');
    loginBtn.classList.add('loading');

    // Redireccionar después de 2 segundos
    setTimeout(() => {
        window.location.href = 'inicio.html';
    }, 2000);
}

// Mostrar error
function showError(mensaje) {
    const span = errorMessage.querySelector('span');
    span.textContent = mensaje;
    errorMessage.classList.add('show');
}

// Limpiar error
function clearError() {
    errorMessage.classList.remove('show');
    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
}

// Animación de error
function shakeInputs() {
    usernameInput.classList.add('error');
    passwordInput.classList.add('error');

    setTimeout(() => {
        usernameInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }, 500);
}

// Verificar si ya está logueado
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'inicio.html';
    }
}

checkAuth();
