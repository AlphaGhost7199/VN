// audio.js
class AudioManager {
    constructor() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.sfxEnabled = true;
        this.bgmEnabled = true;
        this.sfxVolume = 0.5;
        this.bgmVolume = 0.5;
        this.typingSoundEffect = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_5c4c2c5c14.mp3?filename=keyboard-typing-144829.mp3');
        this.typingSoundEffect.volume = this.sfxVolume;
        this.typingSoundEffect.loop = true;
    }

    playBackgroundMusic(src) {
        if (!this.bgmEnabled) return;
        
        this.backgroundMusic.src = src;
        this.backgroundMusic.volume = this.bgmVolume;
        this.backgroundMusic.loop = true;
        this.backgroundMusic.play().catch(error => console.error('Audio playback failed:', error));
    }

    stopBackgroundMusic() {
        this.backgroundMusic.pause();
    }

    playTypingSound() {
        if (!this.sfxEnabled) return;
        
        if (this.typingSoundEffect.paused) {
            this.typingSoundEffect.play().catch(error => console.error('Typing sound playback failed:', error));
        } else {
            this.typingSoundEffect.currentTime = 0;
        }
    }

    stopTypingSound() {
        this.typingSoundEffect.pause();
    }

    setBgmVolume(volume) {
        this.bgmVolume = volume;
        this.backgroundMusic.volume = volume;
    }

    setSfxVolume(volume) {
        this.sfxVolume = volume;
        this.typingSoundEffect.volume = volume;
    }

    toggleBgm() {
        this.bgmEnabled = !this.bgmEnabled;
        this.backgroundMusic.muted = !this.bgmEnabled;
        return this.bgmEnabled;
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        this.typingSoundEffect.muted = !this.sfxEnabled;
        return this.sfxEnabled;
    }
}

// Initialize audio manager
const audioManager = new AudioManager();