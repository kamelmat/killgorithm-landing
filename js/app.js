// Main Application for Killgorithm
class KillgorithmApp {
    constructor() {
        this.isInitialized = false;
        this.loadingProgress = 0;
        this.assetsLoaded = 0;
        this.totalAssets = 0;
        
        this.initialize();
    }

    async initialize() {
        try {
            console.log('Initializing Killgorithm...');
            
            // Show loading screen
            window.uiManager.showLoadingScreen();
            
            // Initialize components
            await this.initializeComponents();
            
            // Load assets
            await this.loadAssets();
            
            // Setup final configurations
            this.setupFinalConfigurations();
            
            // Hide loading screen and start
            this.startApplication();
            
        } catch (error) {
            console.error('Failed to initialize Killgorithm:', error);
            window.uiManager.showError('Initialization failed: ' + error.message);
        }
    }

    async initializeComponents() {
        // Wait for DOM to be ready
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }

        // Initialize background engines
        await this.initializeBackgroundEngines();
        
        // Initialize audio manager
        await this.initializeAudioManager();
        
        // Initialize visual effects
        this.initializeVisualEffects();
        
        console.log('Components initialized');
    }

    async initializeBackgroundEngines() {
        const canvases = ['background-canvas', 'hub-canvas', 'playback-canvas'];
        
        for (const canvasId of canvases) {
            const canvas = document.getElementById(canvasId);
            if (canvas && !window.backgroundEngines[canvasId]) {
                try {
                    window.backgroundEngines[canvasId] = new BackgroundEngine(canvasId);
                    await this.delay(100); // Small delay to prevent overwhelming GPU
                } catch (error) {
                    console.warn(`Failed to initialize background engine for ${canvasId}:`, error);
                }
            }
        }
    }

    async initializeAudioManager() {
        // Wait for audio manager to be ready
        if (!window.audioManager) {
            await new Promise(resolve => {
                const checkAudio = () => {
                    if (window.audioManager) {
                        resolve();
                    } else {
                        setTimeout(checkAudio, 100);
                    }
                };
                checkAudio();
            });
        }

        // Initialize audio context on user interaction
        this.setupAudioContext();
    }

    setupAudioContext() {
        const initAudio = () => {
            if (window.audioManager && window.audioManager.audioContext) {
                window.audioManager.audioContext.resume();
            }
        };

        // Initialize on first user interaction
        const events = ['click', 'touchstart', 'keydown'];
        const initOnce = () => {
            initAudio();
            events.forEach(event => {
                document.removeEventListener(event, initOnce);
            });
        };

        events.forEach(event => {
            document.addEventListener(event, initOnce, { once: true });
        });
    }

    initializeVisualEffects() {
        // Visual effects manager should already be initialized
        if (!window.visualEffects) {
            console.warn('Visual effects manager not found');
        }
    }

    async loadAssets() {
        // Count total assets to load
        this.totalAssets = this.countAssets();
        
        if (this.totalAssets === 0) {
            this.loadingProgress = 100;
            return;
        }

        // Load audio files
        await this.loadAudioAssets();
        
        // Load video files (optional)
        await this.loadVideoAssets();
        
        // Load background images
        await this.loadBackgroundAssets();
        
        console.log('Assets loaded');
    }

    countAssets() {
        let count = 0;
        
        // Count audio files
        count += CONFIG.songs.length;
        
        // Count video files (optional)
        count += CONFIG.songs.filter(song => song.videoFile).length;
        
        // Count background images
        count += CONFIG.songs.filter(song => song.background).length;
        
        return count;
    }

    async loadAudioAssets() {
        const audioPromises = CONFIG.songs.map(async (song) => {
            try {
                const audio = new Audio();
                audio.preload = 'metadata';
                
                await new Promise((resolve, reject) => {
                    audio.addEventListener('loadedmetadata', resolve);
                    audio.addEventListener('error', reject);
                    audio.src = song.audioFile;
                });
                
                this.updateLoadingProgress();
                return true;
            } catch (error) {
                console.warn(`Failed to load audio: ${song.audioFile}`, error);
                return false;
            }
        });
        
        await Promise.allSettled(audioPromises);
    }

    async loadVideoAssets() {
        const videoPromises = CONFIG.songs
            .filter(song => song.videoFile)
            .map(async (song) => {
                try {
                    const video = document.createElement('video');
                    video.preload = 'metadata';
                    
                    await new Promise((resolve, reject) => {
                        video.addEventListener('loadedmetadata', resolve);
                        video.addEventListener('error', reject);
                        video.src = song.videoFile;
                    });
                    
                    this.updateLoadingProgress();
                    return true;
                } catch (error) {
                    console.warn(`Failed to load video: ${song.videoFile}`, error);
                    return false;
                }
            });
        
        await Promise.allSettled(videoPromises);
    }

    async loadBackgroundAssets() {
        const backgroundPromises = CONFIG.songs
            .filter(song => song.background)
            .map(async (song) => {
                try {
                    const img = new Image();
                    
                    await new Promise((resolve, reject) => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', reject);
                        img.src = song.background;
                    });
                    
                    this.updateLoadingProgress();
                    return true;
                } catch (error) {
                    console.warn(`Failed to load background: ${song.background}`, error);
                    return false;
                }
            });
        
        await Promise.allSettled(backgroundPromises);
    }

    updateLoadingProgress() {
        this.assetsLoaded++;
        this.loadingProgress = Math.round((this.assetsLoaded / this.totalAssets) * 100);
        window.uiManager.updateLoadingProgress(this.loadingProgress);
    }

    setupFinalConfigurations() {
        // Setup audio event listeners
        this.setupAudioEventListeners();
        
        // Setup visual effect event listeners
        this.setupVisualEffectListeners();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup error handling
        this.setupErrorHandling();
        
        console.log('Final configurations set');
    }

    setupAudioEventListeners() {
        if (!window.audioManager) return;

        // Listen for song changes
        const audioPlayer = window.audioManager.audioPlayer;
        if (audioPlayer) {
            audioPlayer.addEventListener('play', () => {
                this.onSongPlay();
            });

            audioPlayer.addEventListener('pause', () => {
                this.onSongPause();
            });

            audioPlayer.addEventListener('ended', () => {
                this.onSongEnd();
            });
        }
    }

    setupVisualEffectListeners() {
        // Listen for visual effect triggers
        document.addEventListener('songPlay', () => {
            this.triggerSongVisualEffects();
        });

        document.addEventListener('songPause', () => {
            this.stopSongVisualEffects();
        });
    }

    setupPerformanceMonitoring() {
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Adjust effects based on performance
                if (fps < 30) {
                    this.reduceVisualEffects();
                } else if (fps > 55) {
                    this.increaseVisualEffects();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorPerformance);
        };
        
        monitorPerformance();
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            window.uiManager.showError('An error occurred: ' + event.error.message);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            window.uiManager.showError('An error occurred: ' + event.reason);
        });
    }

    startApplication() {
        this.isInitialized = true;
        
        // Hide loading screen
        window.uiManager.hideLoadingScreen();
        
        // Initialize homepage background
        const homepageEngine = window.backgroundEngines['background-canvas'];
        if (homepageEngine) {
            homepageEngine.createBackground('cyberpunk');
        }
        
        // Trigger startup effects
        this.triggerStartupEffects();
        
        console.log('Killgorithm started successfully');
    }

    triggerStartupEffects() {
        // Create initial particle burst
        window.visualEffects.createParticleBurst();
        
        // Trigger glitch effect
        window.visualEffects.triggerGlitch(0.3);
        
        // Create color pulse
        window.visualEffects.createColorPulse('#00ff00', 1000);
    }

    onSongPlay() {
        const currentSong = window.audioManager.getCurrentSong();
        if (!currentSong) return;

        // Update UI
        window.uiManager.updatePlaybackInfo();
        
        // Change background style
        const playbackEngine = window.backgroundEngines['playback-canvas'];
        if (playbackEngine) {
            playbackEngine.changeStyle(currentSong.visualStyle);
        }
        
        // Trigger visual effects
        this.triggerSongVisualEffects();
        
        // Audio effects disabled for pristine sound quality
        // if (currentSong.effects && currentSong.effects.includes('distortion')) {
        //     window.audioManager.applyAudioEffect('distortion', currentSong.intensity);
        // }
    }

    onSongPause() {
        this.stopSongVisualEffects();
    }

    onSongEnd() {
        // Song ended, next will be auto-played by audio manager
        console.log('Song ended');
    }

    triggerSongVisualEffects() {
        const currentSong = window.audioManager.getCurrentSong();
        if (!currentSong) return;

        // Trigger effects based on song intensity
        const intensity = currentSong.intensity || 0.5;
        
        // Create thrash metal particle system based on song type
        switch (currentSong.animationType) {
            case 'skull-particles':
                window.visualEffects.createParticleSystem('skullParticles', {
                    count: Math.floor(intensity * 30),
                    speed: intensity * 3
                });
                break;
            case 'chain-rain':
                window.visualEffects.createParticleSystem('chainRain');
                break;
            case 'bone-explosion':
                window.visualEffects.createParticleSystem('boneExplosion');
                break;
            case 'hell-fire':
                window.visualEffects.createParticleSystem('hellFire');
                break;
        }
    }

    stopSongVisualEffects() {
        window.visualEffects.stopAnimations();
    }

    reduceVisualEffects() {
        // Reduce particle count
        CONFIG.visual.particleCount = Math.max(20, CONFIG.visual.particleCount - 10);
        
        // Reduce glitch intensity
        CONFIG.visual.glitchIntensity = Math.max(0.1, CONFIG.visual.glitchIntensity - 0.1);
    }

    increaseVisualEffects() {
        // Increase particle count
        CONFIG.visual.particleCount = Math.min(200, CONFIG.visual.particleCount + 10);
        
        // Increase glitch intensity
        CONFIG.visual.glitchIntensity = Math.min(0.8, CONFIG.visual.glitchIntensity + 0.1);
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API
    getStatus() {
        return {
            initialized: this.isInitialized,
            loadingProgress: this.loadingProgress,
            currentPage: window.uiManager.getCurrentPage(),
            isPlaying: window.audioManager ? window.audioManager.isAudioPlaying() : false,
            currentSong: window.audioManager ? window.audioManager.getCurrentSong() : null
        };
    }

    // Cleanup
    dispose() {
        // Stop all animations
        if (window.visualEffects) {
            window.visualEffects.stopAnimations();
        }
        
        // Stop audio
        if (window.audioManager) {
            window.audioManager.stop();
        }
        
        // Dispose background engines
        Object.values(window.backgroundEngines).forEach(engine => {
            if (engine && typeof engine.dispose === 'function') {
                engine.dispose();
            }
        });
        
        // Dispose UI manager
        if (window.uiManager) {
            window.uiManager.dispose();
        }
        
        console.log('Killgorithm disposed');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.killgorithmApp = new KillgorithmApp();
});

// Handle page visibility changes for background playback
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, ensure audio continues
        if (window.audioManager && window.audioManager.isAudioPlaying()) {
            console.log('Page hidden, audio continues in background');
        }
    } else {
        // Page is visible again
        console.log('Page visible again');
    }
});

// Handle beforeunload for cleanup
window.addEventListener('beforeunload', () => {
    if (window.killgorithmApp) {
        window.killgorithmApp.dispose();
    }
}); 