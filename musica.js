// =====================================================
// 🔊 LISTA DE CANCIONES
// =====================================================
// 👇 EDITABLE: Añade más canciones aquí:
//
// EMOJIS DISPONIBLES:
// 🎵 🎶 🎸 🎹 🎤 🎧 🎺 🎻 🥁 🎷 🎤 💜 💕 💖 💗 💓 💔 ❤️ 🧡 💛 💚 💙 💜 🤍 🤎 🖤 💟 🔥 ✨ ⭐ 🌟 💫 🌙 ☀️ 🌈 🌸 🌺 🌹 🥀 💐 🎼 🎵 🎶
//
// {
//     title: "Nombre de la canción",
//     artist: "Artista",
//     album: "Álbum",
//     src: "ruta/del/archivo.mp3",
//     cover: "🎵"
// }
const songs = [
    {
        title: "La Lotería",
        artist: "Lasso",
        album: "Sanlly's Love",
        src: "assets/Lasso - La Lotería.mp3",
        cover: "🎵"
    },
    {
        title: "Si Hay Algo",
        artist: "Jósean Log",
        album: "Sanlly's Love",
        src: "assets/Jósean Log - Si Hay Algo.mp3",
        cover: "🎶"
    },
    {
        title: "The Reason",
        artist: "Hoobastank",
        album: "Sanlly's Love",
        src: "assets/Hoobastank - The Reason.mp3",
        cover: "💜"
    },
    {
        title: "Wonderwall",
        artist: "Oasis",
        album: "Sanlly's Love",
        src: "assets/Oasis - Wonderwall.mp3",
        cover: "🎸"
    },
    {
        title: "Confieso",
        artist: "Humbe",
        album: "Sanlly's Love",
        src: "assets/Confieso - Humbe.mp3",
        cover: "💕"
    },
    {
        title: "Se Te Olvidó",
        artist: "Kalimba",
        album: "Sanlly's Love",
        src: "assets/Kalimba - Se Te Olvidó.mp3",
        cover: "💔"
    },
    {
        title: "Sabes",
        artist: "Alex Ubago",
        album: "Sanlly's Love",
        src: "assets/Alex Ubago - Sabes.mp3",
        cover: "🎹"
    },
    {
        title: "Ibuprofeno",
        artist: "Lasso",
        album: "Sanlly's Love",
        src: "assets/Lasso - Ibuprofeno.mp3",
        cover: "❤️"
    },
    {
        title: "Wildflower",
        artist: "Billie Eilish",
        album: "Sanlly's Love",
        src: "assets/Billie Eilish - Wildflower.mp3",
        cover: "🌸"
    }
    ,
    {
        title: "Fantasmas",
        artist: "Humbe",
        album: "Sanlly's Love",
        src: "assets/Humbe - Fantasmas.mp3",
        cover: "🌸"
    }
    // 👆 EDITABLE: Añade más canciones aquí
];

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// DOM Elements
const songsList = document.getElementById('songsList');
const songCount = document.getElementById('songCount');
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const volumeBar = document.getElementById('volumeBar');
const volume = document.getElementById('volume');
const volumeBtn = document.getElementById('volumeBtn');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerCover = document.getElementById('playerCover');
const likeBtn = document.getElementById('likeBtn');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Navbar
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    renderSongs();
    setupEventListeners();
});

function renderSongs() {
    songCount.textContent = songs.length;
    songsList.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.dataset.index = index;
        songItem.innerHTML = `
            <div class="song-cover">${song.cover}</div>
            <div class="song-info">
                <span class="song-title">${song.title}</span>
                <span class="song-artist">${song.artist}</span>
            </div>
            <span class="song-album">${song.album}</span>
            <span class="song-duration" data-duration>--:--</span>
        `;
        
        songItem.addEventListener('click', () => playSong(index));
        songsList.appendChild(songItem);
    });
}

function setupEventListeners() {
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    likeBtn.addEventListener('click', toggleLike);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', handleSongEnd);
    
    progressBar.addEventListener('click', seek);
    volumeBar.addEventListener('click', setVolume);
    volumeBtn.addEventListener('click', toggleMute);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'ArrowRight') {
            nextSong();
        } else if (e.code === 'ArrowLeft') {
            prevSong();
        }
    });
}

function playSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    audioPlayer.src = song.src;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerCover.textContent = song.cover;
    
    updateActiveSong();
    
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayButton();
    }).catch(err => console.log('Error playing:', err));
}

function togglePlay() {
    if (audioPlayer.src) {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    } else if (songs.length > 0) {
        playSong(0);
    }
}

function updatePlayButton() {
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function updateActiveSong() {
    document.querySelectorAll('.song-item').forEach((item, index) => {
        item.classList.toggle('playing', index === currentSongIndex);
    });
}

function prevSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    playSong(currentSongIndex);
}

function nextSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    playSong(currentSongIndex);
}

function handleSongEnd() {
    if (isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        nextSong();
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? 'var(--primary-color)' : '';
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? 'var(--primary-color)' : '';
}

function toggleLike() {
    likeBtn.classList.toggle('liked');
    likeBtn.innerHTML = likeBtn.classList.contains('liked') 
        ? '<i class="fas fa-heart"></i>' 
        : '<i class="far fa-heart"></i>';
}

function toggleMute() {
    audioPlayer.muted = !audioPlayer.muted;
    volumeBtn.innerHTML = audioPlayer.muted 
        ? '<i class="fas fa-volume-mute"></i>' 
        : '<i class="fas fa-volume-up"></i>';
    volume.style.width = audioPlayer.muted ? '0%' : (audioPlayer.volume * 100) + '%';
}

function updateProgress() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = percent + '%';
    timeCurrent.textContent = formatTime(audioPlayer.currentTime);
}

function updateDuration() {
    timeTotal.textContent = formatTime(audioPlayer.duration);
    
    // Update duration in list
    const durationElements = document.querySelectorAll('[data-duration]');
    if (durationElements[currentSongIndex]) {
        durationElements[currentSongIndex].textContent = formatTime(audioPlayer.duration);
    }
}

function seek(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

function setVolume(e) {
    const width = volumeBar.clientWidth;
    const clickX = e.offsetX;
    audioPlayer.volume = clickX / width;
    volume.style.width = (audioPlayer.volume * 100) + '%';
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
