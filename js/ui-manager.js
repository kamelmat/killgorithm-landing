// UI Manager for Killgorithm
class UIManager {
    constructor() {
        this.currentPage = 'homepage';
        this.pages = ['homepage', 'song-hub', 'playback-view'];
        this.songsGrid = null;
        this.videoContainer = null;
        this.currentVideo = null;
        
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.createSongsGrid();
        this.setupVideoContainer();
        console.log('UI Manager initialized');
    }

    setupEventListeners() {
        // Navigation buttons
        const playAllBtn = document.getElementById('play-all-btn');
        const exploreBtn = document.getElementById('explore-btn');
        const backHomeBtn = document.getElementById('back-home');
        const backHubBtn = document.getElementById('back-hub');

        if (playAllBtn) {
            playAllBtn.addEventListener('click', () => {
                this.navigateToPage('playback-view');
                window.audioManager.playAll();
            });
        }

        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.navigateToPage('song-hub');
            });
        }

        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => {
                this.navigateToPage('homepage');
            });
        }

        if (backHubBtn) {
            backHubBtn.addEventListener('click', () => {
                this.navigateToPage('song-hub');
            });
        }

        // Playback controls
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const videoBtn = document.getElementById('video-btn');
        const closeVideoBtn = document.getElementById('close-video');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                window.audioManager.playPrevious();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                window.audioManager.playNext();
            });
        }

        if (videoBtn) {
            videoBtn.addEventListener('click', () => {
                this.toggleVideo();
            });
        }

        if (closeVideoBtn) {
            closeVideoBtn.addEventListener('click', () => {
                this.closeVideo();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Touch events for mobile
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        // Add touch support for mobile devices
        document.addEventListener('touchstart', (e) => {
            // Prevent default touch behavior on interactive elements
            if (e.target.classList.contains('cyber-button') || 
                e.target.classList.contains('song-card') ||
                e.target.classList.contains('control-btn')) {
                e.preventDefault();
            }
        });

        // Add swipe gestures for mobile navigation
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next song
                    if (this.currentPage === 'playback-view') {
                        window.audioManager.playNext();
                    }
                } else {
                    // Swipe right - previous song
                    if (this.currentPage === 'playback-view') {
                        window.audioManager.playPrevious();
                    }
                }
            }
        });
    }

    handleKeyboardShortcuts(e) {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                if (this.currentPage === 'playback-view') {
                    window.audioManager.playPrevious();
                }
                break;
            case 'ArrowRight':
                if (this.currentPage === 'playback-view') {
                    window.audioManager.playNext();
                }
                break;
            case 'KeyV':
                if (this.currentPage === 'playback-view') {
                    this.toggleVideo();
                }
                break;
            case 'Escape':
                if (this.videoContainer && this.videoContainer.classList.contains('active')) {
                    this.closeVideo();
                }
                break;
        }
    }

    navigateToPage(pageName) {
        if (!this.pages.includes(pageName)) {
            console.error('Invalid page:', pageName);
            return;
        }

        // Hide current page
        const currentPageElement = document.getElementById(this.currentPage);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }

        // Show new page
        const newPageElement = document.getElementById(pageName);
        if (newPageElement) {
            newPageElement.classList.add('active');
        }

        this.currentPage = pageName;

        // Initialize background for new page
        this.initializePageBackground(pageName);

        // Trigger page-specific effects
        this.triggerPageTransition(pageName);
    }

    initializePageBackground(pageName) {
        const canvasId = this.getCanvasIdForPage(pageName);
        const engine = window.backgroundEngines[canvasId];
        
        if (engine) {
            switch (pageName) {
                case 'homepage':
                    engine.createBackground('cyberpunk');
                    break;
                case 'song-hub':
                    engine.createBackground('matrix');
                    break;
                case 'playback-view':
                    const currentSong = window.audioManager.getCurrentSong();
                    if (currentSong) {
                        engine.createBackground(currentSong.visualStyle);
                    } else {
                        engine.createBackground('cyberpunk');
                    }
                    break;
            }
        }
    }

    getCanvasIdForPage(pageName) {
        switch (pageName) {
            case 'homepage':
                return 'background-canvas';
            case 'song-hub':
                return 'hub-canvas';
            case 'playback-view':
                return 'playback-canvas';
            default:
                return 'background-canvas';
        }
    }

    triggerPageTransition(pageName) {
        // Trigger visual effects for page transition
        window.visualEffects.triggerGlitch(0.5);
        window.visualEffects.createColorPulse('#00ff00', 500);

        // Update cursor effects
        if (pageName === 'playback-view') {
            // Intensify effects for playback
            window.visualEffects.glitchIntensity = 0.5;
        } else {
            window.visualEffects.glitchIntensity = CONFIG.visual.glitchIntensity;
        }
    }

    createSongsGrid() {
        this.songsGrid = document.getElementById('songs-grid');
        if (!this.songsGrid) return;

        const songs = CONFIG.songs;
        
        songs.forEach((song, index) => {
            const songCard = this.createSongCard(song, index);
            this.songsGrid.appendChild(songCard);
        });
    }

    createSongCard(song, index) {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.dataset.songId = song.id;
        
        card.innerHTML = `
            <div class="song-title">${song.title}</div>
            <div class="song-duration">${song.duration}</div>
        `;

        // Add click event
        card.addEventListener('click', () => {
            this.playSong(song.id);
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            this.onSongCardHover(card, song);
        });

        card.addEventListener('mouseleave', () => {
            this.onSongCardLeave(card);
        });

        return card;
    }

    playSong(songId) {
        // Navigate to playback view
        this.navigateToPage('playback-view');
        
        // Play the song
        window.audioManager.play(songId);
        
        // Trigger visual effects
        window.visualEffects.triggerGlitch(0.8);
        window.visualEffects.createExplosion(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            0.7
        );
    }

    onSongCardHover(card, song) {
        // Add hover effect
        card.style.transform = 'translateY(-5px) scale(1.02)';
        card.style.boxShadow = '0 10px 30px rgba(0,255,0,0.4)';
        
        // Trigger particle effect
        const rect = card.getBoundingClientRect();
        window.visualEffects.createParticleBurst();
        
        // Preview song theme
        const canvasId = this.getCanvasIdForPage('song-hub');
        const engine = window.backgroundEngines[canvasId];
        if (engine) {
            engine.changeStyle(song.visualStyle);
        }
    }

    onSongCardLeave(card) {
        // Remove hover effect
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 5px 15px rgba(0,255,0,0.2)';
        
        // Restore default background
        const canvasId = this.getCanvasIdForPage('song-hub');
        const engine = window.backgroundEngines[canvasId];
        if (engine) {
            engine.changeStyle('matrix');
        }
    }

    setupVideoContainer() {
        this.videoContainer = document.getElementById('video-container');
        this.currentVideo = document.getElementById('current-video');
        
        if (!this.videoContainer || !this.currentVideo) return;

        // Video events
        this.currentVideo.addEventListener('ended', () => {
            this.closeVideo();
        });

        this.currentVideo.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.closeVideo();
        });
    }

    toggleVideo() {
        const currentSong = window.audioManager.getCurrentSong();
        if (!currentSong || !currentSong.videoFile) {
            console.warn('No video available for current song');
            return;
        }

        if (this.videoContainer.classList.contains('active')) {
            this.closeVideo();
        } else {
            this.openVideo();
        }
    }

    openVideo() {
        const currentSong = window.audioManager.getCurrentSong();
        if (!currentSong || !currentSong.videoFile) return;

        this.currentVideo.src = currentSong.videoFile;
        this.currentVideo.load();
        this.currentVideo.play();
        this.videoContainer.classList.add('active');

        // Trigger effects
        window.visualEffects.triggerGlitch(0.3);
    }

    closeVideo() {
        this.videoContainer.classList.remove('active');
        this.currentVideo.pause();
        this.currentVideo.src = '';
    }

    togglePlayPause() {
        if (window.audioManager.isAudioPlaying()) {
            window.audioManager.pause();
        } else {
            window.audioManager.play();
        }
    }

    updatePlaybackInfo() {
        const currentSong = window.audioManager.getCurrentSong();
        if (!currentSong) return;

        // Update song info
        const titleElement = document.getElementById('current-song-title');
        const artistElement = document.getElementById('current-song-artist');
        
        if (titleElement) titleElement.textContent = currentSong.title;
        if (artistElement) artistElement.textContent = currentSong.artist;

        // Update video button state
        const videoBtn = document.getElementById('video-btn');
        if (videoBtn) {
            videoBtn.style.opacity = currentSong.videoFile ? '1' : '0.5';
            videoBtn.disabled = !currentSong.videoFile;
        }
    }

    // Loading screen management
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    updateLoadingProgress(progress) {
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    // Error handling
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255,0,0,0.9);
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: 'Share Tech Mono', monospace;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    // Utility methods
    getCurrentPage() {
        return this.currentPage;
    }

    isVideoOpen() {
        return this.videoContainer && this.videoContainer.classList.contains('active');
    }

    // Cleanup
    dispose() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        document.removeEventListener('touchstart', this.setupTouchEvents);
        document.removeEventListener('touchend', this.setupTouchEvents);
    }
}

// Create global UI manager instance
window.uiManager = new UIManager(); 