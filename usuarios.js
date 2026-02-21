// =====================================================
// 📋 CONFIGURACIÓN DE USUARIOS
// =====================================================

/* =====================================================
// ROLES DISPONIBLES:
// - 'admin': Acceso total a todo
// - 'invitado': Solo puede ver, sin interacción
// ===================================================== */

// 👈 EDITABLE: Añade o modifica usuarios aquí
const USUARIOS = [
    {
        nombre: 'sanlly',
        clave: 'sanwell',
        rol: 'admin',
        nombreMostrar: 'Sanlly'
    },
    {
        nombre: 'wellington',
        clave: 'sanwell',
        rol: 'admin',
        nombreMostrar: 'Wellington'
    },
    {
        nombre: 'invitado',
        clave: 'invitado123',
        rol: 'invitado',
        nombreMostrar: 'Invitado'
    }
];

// 👈 EDITABLE: Cambia la clave del invitado aquí
const CLAVE_INVITADO = 'invitado123';

// 👈 EDITABLE: Configuración del modo invitado
const CONFIG_INVITADO = {
    // Páginas que puede ver el invitado (true = permitido)
    paginasPermitidas: {
        inicio: true,
        musica: true,
        cartas: false,  // Las cartas son privadas
        sorpresa: false,
        trivia: false,
        matematicas: false
    },
    // Funciones desactivadas para invitados
    funcionesDesactivadas: {
        reproductorMusica: true,    // No puede reproducir música
        escribirCarta: true,        // No puede escribir cartas
        jugarJuegos: true,          // No puede jugar
        contadorDias: false         // Sí puede ver el contador
    }
};

// =====================================================
// 👆 EDITABLE: Fin de configuración
// =====================================================

// Función para verificar usuario
function verificarUsuario(nombre, clave) {
    return USUARIOS.find(u => 
        u.nombre.toLowerCase() === nombre.toLowerCase() && 
        u.clave === clave
    );
}

// Función para obtener configuración de invitado
function obtenerConfigInvitado() {
    return CONFIG_INVITADO;
}

// Exportar para usar en otros archivos
if (typeof module !== 'undefined') {
    module.exports = { USUARIOS, verificarUsuario, obtenerConfigInvitado };
}
