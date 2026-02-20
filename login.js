/* =============================================================================
   LOGIN.JS - Sistema de autenticación romántica
   ============================================================================= */

/* ================================
   CONFIGURACIÓN DE USUARIOS
   ================================
   Aquí puedes añadir más usuarios si lo deseas.
   Formato: 
   { nombre: 'nombre', clave: 'contraseña' }
   
   IMPORTANTE: Los nombres y claves deben ser en minúsculas
   ================================ */
const USUARIOS_PERMITIDOS = [
    { nombre: 'sanlly', clave: 'sanwell' },  // 👈 EDITABLE: Sanlly
    { nombre: 'wellington', clave: 'sanwell' }  // 👈 EDITABLE: Wellington
];

/* ================================
   No-editar más abajo
   ================================ */

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
    // Toggle mostrar/ocultar contraseña
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' 
            ? '<i class="fas fa-eye"></i>' 
            : '<i class="fas fa-eye-slash"></i>';
    });

    // Enviar formulario
    loginForm.addEventListener('submit', handleLogin);

    // Limpiar error al escribir
    usernameInput.addEventListener('input', () => {
        clearError();
    });
    passwordInput.addEventListener('input', () => {
        clearError();
    });

    // Permitir enter en el input
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
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

    // Validar credenciales
    const usuarioValido = USUARIOS_PERMITIDOS.find(
        u => u.nombre === nombre && u.clave === clave
    );

    if (usuarioValido) {
        // Login exitoso
        performLogin(usuarioValido.nombre);
    } else {
        // Login fallido
        showError('Ups! Credenciales incorrectas 💔');
        shakeInputs();
    }
}

// Realizar login
function performLogin(nombre) {
    // Guardar sesión
    let nombreMostrar;
    let mensajeBienvenida;
    
    if (nombre === 'sanlly') {
        nombreMostrar = 'Sanlly';
        mensajeBienvenida = '¡Hola, mi Sanlly! 💜';
    } else if (nombre === 'wellington') {
        nombreMostrar = 'Wellington';
        mensajeBienvenida = '¡Hola, mi Wellington! 💙';
    } else {
        nombreMostrar = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        mensajeBienvenida = `¡Hola, ${nombreMostrar}! ❤️`;
    }
    
    sessionStorage.setItem('usuario', nombre);
    sessionStorage.setItem('nombreMostrar', nombreMostrar);
    sessionStorage.setItem('loggedIn', 'true');

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
        // Ya está logueado, redirigir
        window.location.href = 'index.html';
    }
}

// Ejecutar verificación al cargar
checkAuth();
