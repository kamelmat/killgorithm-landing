// Visual Effects Manager for Killgorithm
class VisualEffectsManager {
    constructor() {
        this.particles = [];
        this.cursorTrails = [];
        this.maxTrails = CONFIG.visual.maxTrails;
        this.glitchIntensity = CONFIG.visual.glitchIntensity;
        this.currentEffect = null;
        this.animationId = null;
        
        this.initializeEffects();
        this.setupCursorEffects();
    }

    initializeEffects() {
        // Create glitch overlay
        this.createGlitchOverlay();
        
        // Initialize particle systems
        this.initializeParticleSystems();
        
        console.log('Visual Effects Manager initialized');
    }

    createGlitchOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'glitch-overlay';
        overlay.id = 'glitch-overlay';
        document.body.appendChild(overlay);
    }

    setupCursorEffects() {
        if (!CONFIG.ui.cursor.enabled) return;

        // Create custom cursor
        this.createCustomCursor();
        
        // Setup cursor trails
        if (CONFIG.ui.cursor.trail) {
            this.setupCursorTrails();
        }
        
        // Hide default cursor
        document.body.style.cursor = 'none';
    }

    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effects
        document.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.2)';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    }

    setupCursorTrails() {
        let lastX = 0, lastY = 0;
        let trailCount = 0;

        document.addEventListener('mousemove', (e) => {
            const currentX = e.clientX;
            const currentY = e.clientY;
            
            // Only create trail if mouse moved significantly
            const distance = Math.sqrt(
                Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
            );
            
            if (distance > 5) {
                this.createCursorTrail(currentX, currentY);
                lastX = currentX;
                lastY = currentY;
            }
        });
    }

    createCursorTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        document.body.appendChild(trail);
        this.cursorTrails.push(trail);

        // Fade out and remove trail
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0.5)';
        }, 50);

        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
                this.cursorTrails = this.cursorTrails.filter(t => t !== trail);
            }
        }, 500);

        // Limit number of trails
        if (this.cursorTrails.length > this.maxTrails) {
            const oldTrail = this.cursorTrails.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
    }

    initializeParticleSystems() {
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.id = 'particle-container';
        particleContainer.style.position = 'fixed';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.pointerEvents = 'none';
        particleContainer.style.zIndex = '1000';
        document.body.appendChild(particleContainer);
    }

    // Particle System Methods
    createParticleSystem(type, options = {}) {
        const config = CONFIG.animations[type] || CONFIG.animations.particleSystem;
        const mergedOptions = { ...config, ...options };
        
        switch (type) {
            case 'particleSystem':
                return this.createBasicParticleSystem(mergedOptions);
            case 'matrixRain':
                return this.createMatrixRain(mergedOptions);
            case 'fireParticles':
                return this.createFireParticles(mergedOptions);
            case 'spaceParticles':
                return this.createSpaceParticles(mergedOptions);
            default:
                return this.createBasicParticleSystem(mergedOptions);
        }
    }

    createBasicParticleSystem(options) {
        const particles = [];
        const container = document.getElementById('particle-container');
        
        for (let i = 0; i < options.count; i++) {
            const particle = this.createParticle(options);
            particles.push(particle);
            container.appendChild(particle);
        }
        
        // Animate particles
        const animate = () => {
            particles.forEach(particle => {
                this.updateParticle(particle, options);
            });
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
        return particles;
    }

    createParticle(options) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = (Math.random() * (options.size.max - options.size.min) + options.size.min) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = options.colors[Math.floor(Math.random() * options.colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * (options.opacity.max - options.opacity.min) + options.opacity.min;
        
        // Initial position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        
        // Velocity
        particle.vx = (Math.random() - 0.5) * options.speed;
        particle.vy = (Math.random() - 0.5) * options.speed;
        
        return particle;
    }

    updateParticle(particle, options) {
        const x = parseFloat(particle.style.left);
        const y = parseFloat(particle.style.top);
        
        // Update position
        particle.style.left = (x + particle.vx) + 'px';
        particle.style.top = (y + particle.vy) + 'px';
        
        // Wrap around screen
        if (x < -10) particle.style.left = window.innerWidth + 'px';
        if (x > window.innerWidth + 10) particle.style.left = '-10px';
        if (y < -10) particle.style.top = window.innerHeight + 'px';
        if (y > window.innerHeight + 10) particle.style.top = '-10px';
    }

    createMatrixRain(options) {
        const container = document.getElementById('particle-container');
        const columns = Math.floor(window.innerWidth / options.fontSize);
        const drops = new Array(columns).fill(0);
        
        const animate = () => {
            // Create new characters
            for (let i = 0; i < drops.length; i++) {
                if (Math.random() > 0.975) {
                    const char = document.createElement('div');
                    char.textContent = options.characters[Math.floor(Math.random() * options.characters.length)];
                    char.style.position = 'absolute';
                    char.style.left = (i * options.fontSize) + 'px';
                    char.style.top = (drops[i] * options.fontSize) + 'px';
                    char.style.color = options.color;
                    char.style.fontSize = options.fontSize + 'px';
                    char.style.fontFamily = 'monospace';
                    char.style.opacity = '0.8';
                    char.style.textShadow = `0 0 5px ${options.color}`;
                    
                    container.appendChild(char);
                    
                    // Remove character after animation
                    setTimeout(() => {
                        if (char.parentNode) {
                            char.parentNode.removeChild(char);
                        }
                    }, 2000);
                    
                    drops[i]++;
                }
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    createFireParticles(options) {
        const particles = [];
        const container = document.getElementById('particle-container');
        
        for (let i = 0; i < options.count; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = (Math.random() * (options.size.max - options.size.min) + options.size.min) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = options.colors[Math.floor(Math.random() * options.colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0.8';
            
            // Start from bottom of screen
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            
            // Fire-like movement
            particle.vx = (Math.random() - 0.5) * 2;
            particle.vy = -Math.random() * options.speed - 1;
            particle.life = 1.0;
            
            particles.push(particle);
            container.appendChild(particle);
        }
        
        const animate = () => {
            particles.forEach((particle, index) => {
                const x = parseFloat(particle.style.left);
                const y = parseFloat(particle.style.top);
                
                // Update position
                particle.style.left = (x + particle.vx) + 'px';
                particle.style.top = (y + particle.vy) + 'px';
                
                // Fade out
                particle.life -= 0.01;
                particle.style.opacity = particle.life;
                
                // Remove dead particles
                if (particle.life <= 0 || y < -10) {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                    particles.splice(index, 1);
                }
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    createSpaceParticles(options) {
        const particles = [];
        const container = document.getElementById('particle-container');
        
        for (let i = 0; i < options.count; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = (Math.random() * (options.size.max - options.size.min) + options.size.min) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = options.colors[Math.floor(Math.random() * options.colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0.6';
            particle.style.boxShadow = `0 0 ${Math.random() * 5 + 2}px ${options.colors[Math.floor(Math.random() * options.colors.length)]}`;
            
            // Random position
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            
            // Slow movement
            particle.vx = (Math.random() - 0.5) * options.speed;
            particle.vy = (Math.random() - 0.5) * options.speed;
            
            particles.push(particle);
            container.appendChild(particle);
        }
        
        const animate = () => {
            particles.forEach(particle => {
                const x = parseFloat(particle.style.left);
                const y = parseFloat(particle.style.top);
                
                // Update position
                particle.style.left = (x + particle.vx) + 'px';
                particle.style.top = (y + particle.vy) + 'px';
                
                // Wrap around screen
                if (x < -10) particle.style.left = window.innerWidth + 'px';
                if (x > window.innerWidth + 10) particle.style.left = '-10px';
                if (y < -10) particle.style.top = window.innerHeight + 'px';
                if (y > window.innerHeight + 10) particle.style.top = '-10px';
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Glitch Effects
    triggerGlitch(intensity = this.glitchIntensity) {
        const overlay = document.getElementById('glitch-overlay');
        if (!overlay) return;
        
        overlay.style.opacity = intensity;
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.opacity = '0';
        }, 200);
    }

    createScreenShake(intensity = 0.5, duration = 500) {
        const body = document.body;
        const originalTransform = body.style.transform;
        
        const shake = () => {
            const x = (Math.random() - 0.5) * intensity * 10;
            const y = (Math.random() - 0.5) * intensity * 10;
            body.style.transform = `translate(${x}px, ${y}px)`;
        };
        
        const shakeInterval = setInterval(shake, 50);
        
        setTimeout(() => {
            clearInterval(shakeInterval);
            body.style.transform = originalTransform;
        }, duration);
    }

    // Color Pulse Effect
    createColorPulse(color, duration = 1000) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = color;
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999';
        overlay.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(overlay);
        
        // Pulse in
        setTimeout(() => {
            overlay.style.opacity = '0.3';
        }, 10);
        
        // Pulse out
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, duration / 2);
        
        // Remove overlay
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, duration);
    }

    // Stop all animations
    stopAnimations() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Clear particles
        const container = document.getElementById('particle-container');
        if (container) {
            container.innerHTML = '';
        }
        
        this.particles = [];
    }

    // Change visual theme
    changeTheme(themeName) {
        const theme = CONFIG.themes[themeName];
        if (!theme) return;
        
        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.colors.accent);
        document.documentElement.style.setProperty('--background-color', theme.colors.background);
        document.documentElement.style.setProperty('--text-color', theme.colors.text);
        
        // Trigger theme change effect
        this.triggerGlitch(0.5);
        this.createColorPulse(theme.colors.primary, 800);
    }

    // Create explosion effect
    createExplosion(x, y, intensity = 1.0) {
        const particleCount = Math.floor(intensity * 30);
        const colors = ['#ff6600', '#ff0000', '#ffff00', '#ffffff'];
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createExplosionParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
            }, i * 20);
        }
        
        // Screen shake
        this.createScreenShake(intensity * 0.3, 300);
    }

    createExplosionParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1001';
        
        document.body.appendChild(particle);
        
        // Animate explosion
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x, posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        };
        
        animate();
    }
}

// Create global visual effects manager instance
window.visualEffects = new VisualEffectsManager(); 