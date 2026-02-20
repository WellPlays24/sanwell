


document.addEventListener('DOMContentLoaded', () => {
    // Generar corazones flotantes de fondo
    createFloatingHearts();

    // Efecto de botón
    const btn = document.getElementById('loveBtn');

    const audio = document.getElementById('bgMusic');
    

    btn.addEventListener('click', () => {
        burstHearts();

        audio.volume = 0.7; // opcional
        audio.play().catch(() => {});

        alert('¡You are really amazing! ❤️'); // Puedes cambiar este mensaje
    });
});

function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const heartCount = 30; // Número de corazones en el fondo

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 4 + 's'; // 4s a 7s
            heart.style.fontSize = Math.random() * 1 + 0.5 + 'rem';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            
            // Animación infinita
            heart.style.animationName = 'fall';
            heart.style.animationTimingFunction = 'linear';
            heart.style.animationIterationCount = 'infinite';
            
            container.appendChild(heart);
        }, i * 300);
    }
}

function burstHearts() {
    const total = 30;
    const container = document.body;
    
    for (let i = 0; i < total; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        // Animación de explosión
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 100;
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        }).onfinish = () => heart.remove();
        
        container.appendChild(heart);
    }
}
