// Audio Manager for Killgorithm
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.audioPlayer = document.getElementById('audio-player');
        this.currentSong = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.volume = CONFIG.system.defaultVolume;
        this.fadeInterval = null;
        
        this.initializeAudio();
        this.setupEventListeners();
    }

    async initializeAudio() {
        try {
            // Initialize Web Audio API
            if (window.AudioContext || window.webkitAudioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Set initial volume
            this.audioPlayer.volume = this.volume;
            
            // Load playlist from config
            this.playlist = CONFIG.songs;
            
            console.log('Audio Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    setupEventListeners() {
        // Audio player events
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateProgress();
        });

        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.playNext();
        });

        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
        });

        // Progress bar interaction
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                this.seekTo(percentage);
            });
        }
    }

    async loadSong(songId) {
        const song = this.playlist.find(s => s.id === songId);
        if (!song) {
            console.error('Song not found:', songId);
            return false;
        }

        try {
            this.currentSong = song;
            this.audioPlayer.src = song.audioFile;
            
            // Preload the audio
            await this.audioPlayer.load();
            
            // Update UI
            this.updateSongInfo();
            
            console.log('Song loaded:', song.title);
            return true;
        } catch (error) {
            console.error('Failed to load song:', error);
            return false;
        }
    }

    async play(songId = null) {
        try {
            // Resume audio context if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            if (songId && songId !== this.currentSong?.id) {
                await this.loadSong(songId);
            }

            if (this.audioPlayer.src) {
                await this.audioPlayer.play();
                this.isPlaying = true;
                this.updatePlayButton();
                
                // Trigger visual effects
                this.triggerVisualEffects();
                
                console.log('Playing:', this.currentSong?.title);
            }
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updatePlayButton();
        console.log('Audio paused');
    }

    stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayButton();
        console.log('Audio stopped');
    }

    playNext() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        const nextSong = this.playlist[this.currentIndex];
        this.play(nextSong.id);
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = this.currentIndex === 0 ? 
            this.playlist.length - 1 : this.currentIndex - 1;
        const prevSong = this.playlist[this.currentIndex];
        this.play(prevSong.id);
    }

    playAll() {
        this.currentIndex = 0;
        const firstSong = this.playlist[0];
        if (firstSong) {
            this.play(firstSong.id);
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audioPlayer.volume = this.volume;
        
        // Update volume display if exists
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = Math.round(this.volume * 100) + '%';
        }
    }

    fadeIn(duration = CONFIG.system.fadeInDuration) {
        return new Promise((resolve) => {
            const startVolume = 0;
            const endVolume = this.volume;
            const steps = 50;
            const stepDuration = duration / steps;
            const volumeStep = (endVolume - startVolume) / steps;
            
            this.audioPlayer.volume = startVolume;
            
            let currentStep = 0;
            this.fadeInterval = setInterval(() => {
                currentStep++;
                this.audioPlayer.volume = startVolume + (volumeStep * currentStep);
                
                if (currentStep >= steps) {
                    clearInterval(this.fadeInterval);
                    this.audioPlayer.volume = endVolume;
                    resolve();
                }
            }, stepDuration);
        });
    }

    fadeOut(duration = CONFIG.system.fadeOutDuration) {
        return new Promise((resolve) => {
            const startVolume = this.audioPlayer.volume;
            const endVolume = 0;
            const steps = 50;
            const stepDuration = duration / steps;
            const volumeStep = (startVolume - endVolume) / steps;
            
            let currentStep = 0;
            this.fadeInterval = setInterval(() => {
                currentStep++;
                this.audioPlayer.volume = startVolume - (volumeStep * currentStep);
                
                if (currentStep >= steps) {
                    clearInterval(this.fadeInterval);
                    this.audioPlayer.volume = endVolume;
                    resolve();
                }
            }, stepDuration);
        });
    }

    seekTo(percentage) {
        if (this.audioPlayer.duration) {
            const newTime = this.audioPlayer.duration * percentage;
            this.audioPlayer.currentTime = newTime;
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const currentTimeDisplay = document.getElementById('current-time');
        const totalTimeDisplay = document.getElementById('total-time');
        
        if (this.audioPlayer.duration) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
        }
        
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
        
        if (totalTimeDisplay) {
            totalTimeDisplay.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }

    updateSongInfo() {
        const titleElement = document.getElementById('current-song-title');
        const artistElement = document.getElementById('current-song-artist');
        
        if (titleElement && this.currentSong) {
            titleElement.textContent = this.currentSong.title;
        }
        
        if (artistElement && this.currentSong) {
            artistElement.textContent = this.currentSong.artist;
        }
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    triggerVisualEffects() {
        // Trigger glitch effect
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay) {
            glitchOverlay.classList.add('active');
            setTimeout(() => {
                glitchOverlay.classList.remove('active');
            }, 200);
        }

        // Trigger particle burst
        this.createParticleBurst();
    }

    createParticleBurst() {
        const particleCount = 20;
        const colors = ['#00ff00', '#00ffff', '#ff0080'];
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }

    createParticle(color) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = color;
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    // Audio effects and filters
    applyAudioEffect(effectType, intensity = 0.5) {
        if (!this.audioContext) return;

        try {
            const source = this.audioContext.createMediaElementSource(this.audioPlayer);
            
            switch (effectType) {
                case 'reverb':
                    this.applyReverb(source, intensity);
                    break;
                case 'distortion':
                    this.applyDistortion(source, intensity);
                    break;
                case 'filter':
                    this.applyFilter(source, intensity);
                    break;
                default:
                    console.warn('Unknown audio effect:', effectType);
            }
        } catch (error) {
            console.error('Failed to apply audio effect:', error);
        }
    }

    applyReverb(source, intensity) {
        const convolver = this.audioContext.createConvolver();
        const gainNode = this.audioContext.createGain();
        
        // Create impulse response for reverb
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * intensity;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        gainNode.gain.value = intensity;
        
        source.connect(convolver);
        convolver.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
    }

    applyDistortion(source, intensity) {
        const distortion = this.audioContext.createWaveShaper();
        const gainNode = this.audioContext.createGain();
        
        // Create distortion curve
        const curve = new Float32Array(44100);
        for (let i = 0; i < 44100; i++) {
            const x = (i * 2) / 44100 - 1;
            curve[i] = (Math.PI + x) * intensity / (Math.PI + intensity * Math.abs(x));
        }
        
        distortion.curve = curve;
        gainNode.gain.value = 1 - intensity * 0.5;
        
        source.connect(distortion);
        distortion.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
    }

    applyFilter(source, intensity) {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000 - (intensity * 1500);
        filter.Q.value = intensity * 10;
        
        source.connect(filter);
        filter.connect(this.audioContext.destination);
    }

    // Get current song info
    getCurrentSong() {
        return this.currentSong;
    }

    getPlaylist() {
        return this.playlist;
    }

    isAudioPlaying() {
        return this.isPlaying;
    }

    getCurrentTime() {
        return this.audioPlayer.currentTime;
    }

    getDuration() {
        return this.audioPlayer.duration;
    }

    getVolume() {
        return this.volume;
    }
}

// Create global audio manager instance
window.audioManager = new AudioManager(); 