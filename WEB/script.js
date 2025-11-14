// ============================================================================
// KILLGORITHM - VIDEOGAME LANDING PAGE SCRIPT
// ============================================================================

class KillgorithmLanding {
    constructor() {
        this.currentGuyFrame = 0
        this.guyImages = [
            'guy9.jpg', // Dormant
            'guy7.jpg', // Awakening
            'guy8.jpg', // Active
            'guy6.jpg'  // Fully lit
        ]
        this.guyStates = ['dormant', 'awakening', 'active', 'fully-lit']
        this.isLoaded = false
        this.avatars = new Map()
        
        this.init()
    }
    
    async init() {
        console.log('🎮 KILLGORITHM Landing Page Initializing...')
        
        // Initialize loading screen
        this.initLoadingScreen()
        
        // Preload assets
        await this.preloadAssets()
        
        // Initialize guy background animation
        this.initGuyBackground()
        
        // Initialize lightning effects
        this.initLightningEffects()
        
        // Initialize 3D avatars
        await this.init3DAvatars()
        
        // Initialize interactions
        this.initInteractions()
        
        // Custom cursor
        this.initCustomCursor()
        
        // Hide loading screen
        this.hideLoadingScreen()
        
        console.log('🎮 KILLGORITHM Landing Page Ready!')
    }
    
    initLoadingScreen() {
        // Simulate loading progress
        setTimeout(() => {
            const progress = document.querySelector('.loading-progress')
            progress.style.animationPlayState = 'running'
        }, 500)
    }
    
    async preloadAssets() {
        console.log('📦 Preloading assets...')
        
        // Preload guy images
        const imagePromises = this.guyImages.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = resolve
                img.onerror = reject
                img.src = src
            })
        })
        
        try {
            await Promise.all(imagePromises)
            console.log('✅ Guy images preloaded')
        } catch (error) {
            console.warn('⚠️ Some guy images failed to load:', error)
        }
    }
    
    initGuyBackground() {
        console.log('👤 Initializing guy background animation...')
        
        const background = document.getElementById('cyber-guy-background')
        
        // Set initial state
        background.style.backgroundImage = `url(${this.guyImages[0]})`
        background.className = `cyber-guy-background ${this.guyStates[0]}`
        
        // Start animation cycle
        this.startGuyAnimation()
    }
    
    startGuyAnimation() {
        let direction = 1
        let isPaused = false
        
        setInterval(() => {
            if (isPaused) return
            
            const nextFrame = this.currentGuyFrame + direction
            
            if (direction === 1 && nextFrame >= this.guyImages.length) {
                // Reached fully lit state, pause
                isPaused = true
                setTimeout(() => {
                    isPaused = false
                    direction = -1
                }, 3000) // 3 second pause
                return
            }
            
            if (direction === -1 && nextFrame < 0) {
                // Back to dormant, restart
                direction = 1
                this.currentGuyFrame = 0
            } else {
                this.currentGuyFrame = nextFrame
            }
            
            // Update background
            const background = document.getElementById('cyber-guy-background')
            background.style.backgroundImage = `url(${this.guyImages[this.currentGuyFrame]})`
            background.className = `cyber-guy-background ${this.guyStates[this.currentGuyFrame]}`
            
            console.log(`👤⚡ Guy state: ${this.guyStates[this.currentGuyFrame]}`)
            
        }, 4000) // 4 seconds per frame
    }
    
    initLightningEffects() {
        console.log('⚡ Initializing lightning effects...')
        
        const canvas = document.getElementById('lightning-canvas')
        const ctx = canvas.getContext('2d')
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        
        // Lightning effect
        const drawLightning = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            // Random lightning strikes
            if (Math.random() < 0.02) { // 2% chance per frame
                this.createLightningStrike(ctx, canvas.width, canvas.height)
            }
            
            // Ambient energy particles
            this.drawEnergyParticles(ctx, canvas.width, canvas.height)
        }
        
        // Animation loop
        const animate = () => {
            drawLightning()
            requestAnimationFrame(animate)
        }
        animate()
    }
    
    createLightningStrike(ctx, width, height) {
        const startX = Math.random() * width
        const startY = 0
        const endX = startX + (Math.random() - 0.5) * 200
        const endY = height
        
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + Math.random() * 0.7})`
        ctx.lineWidth = 2 + Math.random() * 3
        ctx.shadowBlur = 10
        ctx.shadowColor = '#00ffff'
        
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        
        // Create jagged lightning path
        let currentX = startX
        let currentY = startY
        const segments = 8 + Math.random() * 12
        
        for (let i = 0; i < segments; i++) {
            currentX += (endX - startX) / segments + (Math.random() - 0.5) * 50
            currentY += (endY - startY) / segments
            ctx.lineTo(currentX, currentY)
        }
        
        ctx.stroke()
        
        // Add glow effect
        ctx.shadowBlur = 20
        ctx.stroke()
    }
    
    drawEnergyParticles(ctx, width, height) {
        // Static method to maintain particle state
        if (!this.particles) {
            this.particles = Array.from({length: 50}, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random()
            }))
        }
        
        this.particles.forEach(particle => {
            // Update particle
            particle.x += particle.vx
            particle.y += particle.vy
            particle.life -= 0.01
            
            // Wrap around screen
            if (particle.x < 0) particle.x = width
            if (particle.x > width) particle.x = 0
            if (particle.y < 0) particle.y = height
            if (particle.y > height) particle.y = 0
            
            // Reset if dead
            if (particle.life <= 0) {
                particle.life = 1
                particle.x = Math.random() * width
                particle.y = Math.random() * height
            }
            
            // Draw particle
            const alpha = particle.life * 0.3
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`
            ctx.shadowBlur = 5
            ctx.shadowColor = '#00ffff'
            
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, 1 + particle.life, 0, Math.PI * 2)
            ctx.fill()
        })
    }
    
    async init3DAvatars() {
        console.log('🎯 Initializing 3D avatars...')
        
        try {
            // Initialize Three.js for each avatar container
            await this.create3DAvatar('nemo-avatar', '../public/blender/nautilus_views/nautilus.glb')
            await this.create3DAvatar('eagle-avatar', '../public/blender/ave_de_presa_views/robot_bird_eagle.glb')
        } catch (error) {
            console.warn('⚠️ 3D avatars failed to load:', error)
            // Fallback to placeholder
            this.createAvatarPlaceholders()
        }
    }
    
    async create3DAvatar(containerId, modelPath) {
        const container = document.getElementById(containerId)
        if (!container) return
        
        // Create Three.js scene
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        
        renderer.setSize(container.offsetWidth, container.offsetHeight)
        renderer.setClearColor(0x000000, 0)
        container.appendChild(renderer.domElement)
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
        scene.add(ambientLight)
        
        const directionalLight = new THREE.DirectionalLight(0x00ffff, 1)
        directionalLight.position.set(1, 1, 1)
        scene.add(directionalLight)
        
        // Load model
        const loader = new THREE.GLTFLoader()
        
        return new Promise((resolve, reject) => {
            loader.load(
                modelPath,
                (gltf) => {
                    const model = gltf.scene
                    
                    // Scale and position model
                    const box = new THREE.Box3().setFromObject(model)
                    const center = box.getCenter(new THREE.Vector3())
                    const size = box.getSize(new THREE.Vector3())
                    
                    const maxDim = Math.max(size.x, size.y, size.z)
                    const scale = 2 / maxDim
                    model.scale.setScalar(scale)
                    
                    model.position.sub(center.multiplyScalar(scale))
                    
                    scene.add(model)
                    
                    // Camera position
                    camera.position.z = 3
                    
                    // Animation loop
                    const animate = () => {
                        requestAnimationFrame(animate)
                        model.rotation.y += 0.005
                        renderer.render(scene, camera)
                    }
                    animate()
                    
                    // Store reference
                    this.avatars.set(containerId, { scene, camera, renderer, model })
                    
                    console.log(`✅ 3D avatar loaded: ${containerId}`)
                    resolve()
                },
                (progress) => {
                    console.log(`📦 Loading ${containerId}:`, (progress.loaded / progress.total * 100) + '%')
                },
                reject
            )
        })
    }
    
    createAvatarPlaceholders() {
        // Create simple CSS animations as fallback
        const containers = ['nemo-avatar', 'eagle-avatar']
        
        containers.forEach(id => {
            const container = document.getElementById(id)
            if (container) {
                container.innerHTML = `
                    <div style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: radial-gradient(circle, rgba(0,255,255,0.1), transparent);
                        animation: pulse 2s ease-in-out infinite;
                    ">
                        <div style="
                            width: 60px;
                            height: 60px;
                            border: 2px solid #00ffff;
                            border-radius: 50%;
                            animation: spin 3s linear infinite;
                        "></div>
                    </div>
                `
            }
        })
    }
    
    initInteractions() {
        console.log('🎮 Initializing interactions...')
        
        // Avatar hover effects
        document.querySelectorAll('.avatar-container').forEach(container => {
            container.addEventListener('mouseenter', () => {
                this.onAvatarHover(container)
            })
            
            container.addEventListener('mouseleave', () => {
                this.onAvatarLeave(container)
            })
            
            container.addEventListener('click', () => {
                this.onAvatarClick(container)
            })
        })
    }
    
    onAvatarHover(container) {
        // Add special effects on hover
        const effects = container.querySelector('.avatar-effects')
        if (effects) {
            effects.style.background = 'radial-gradient(circle, rgba(0,255,255,0.2), transparent)'
        }
        
        // Enhance 3D model if available
        const avatarId = container.querySelector('.avatar-3d')?.id
        const avatar = this.avatars.get(avatarId)
        if (avatar && avatar.model) {
            // Add glow effect to 3D model
            avatar.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive = new THREE.Color(0x004444)
                }
            })
        }
    }
    
    onAvatarLeave(container) {
        // Remove hover effects
        const avatarId = container.querySelector('.avatar-3d')?.id
        const avatar = this.avatars.get(avatarId)
        if (avatar && avatar.model) {
            avatar.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive = new THREE.Color(0x000000)
                }
            })
        }
    }
    
    onAvatarClick(container) {
        const songId = container.dataset.song
        if (!songId) return
        
        console.log(`🎵 Avatar clicked: ${songId}`)
        
        // Add click animation
        container.style.transform = 'scale(0.95)'
        setTimeout(() => {
            container.style.transform = ''
        }, 150)
        
        // Here you would integrate with your audio system
        // For now, just show an effect
        this.showClickEffect(container)
    }
    
    showClickEffect(container) {
        const effect = document.createElement('div')
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 2px solid #00ffff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: click-wave 0.6s ease-out forwards;
        `
        
        container.style.position = 'relative'
        container.appendChild(effect)
        
        setTimeout(() => effect.remove(), 600)
    }
    
    initCustomCursor() {
        let cursor = document.querySelector('body::after')
        
        document.addEventListener('mousemove', (e) => {
            // Update custom cursor position
            document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px')
            document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px')
        })
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen')
            loadingScreen.classList.add('hidden')
            setTimeout(() => {
                loadingScreen.style.display = 'none'
            }, 1000)
        }, 4000) // Show loading for 4 seconds
    }
}

// Add CSS for dynamic cursor positioning
const style = document.createElement('style')
style.textContent = `
    body::after {
        transform: translate(var(--cursor-x, 0), var(--cursor-y, 0));
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes click-wave {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
        }
    }
`
document.head.appendChild(style)

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new KillgorithmLanding()
})

// Handle window resize for 3D avatars
window.addEventListener('resize', () => {
    // This will be handled by each avatar's animation loop
})
