// Three.js Background Engine for Killgorithm
class BackgroundEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.uniforms = {};
        this.materials = {};
        this.geometries = {};
        this.meshes = {};
        this.particles = [];
        this.animationId = null;
        this.currentStyle = 'cyberpunk';
        
        this.initialize();
    }

    initialize() {
        if (!this.canvas) {
            console.error('Canvas element not found:', this.canvas);
            return;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupShaders();
        this.setupEventListeners();
        
        console.log('Background Engine initialized');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 5;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Point lights for cyberpunk effect
        const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
        pointLight1.position.set(-10, 0, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff0080, 1, 100);
        pointLight2.position.set(10, 0, 10);
        this.scene.add(pointLight2);
    }

    setupShaders() {
        // Vertex shader for animated backgrounds
        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vUv = uv;
                vPosition = position;
                
                vec3 pos = position;
                pos.z += sin(time * 0.5 + position.x * 2.0) * 0.1;
                pos.z += cos(time * 0.3 + position.y * 2.0) * 0.1;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

        // Fragment shader for cyberpunk effects
        const fragmentShader = `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vec2 uv = vUv;
                
                // Create animated pattern
                float pattern = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time * 0.5);
                pattern += sin(uv.x * 20.0 + time * 2.0) * 0.5;
                pattern += sin(uv.y * 20.0 + time * 1.5) * 0.5;
                
                // Create scanlines
                float scanlines = sin(uv.y * 100.0 + time * 5.0) * 0.5 + 0.5;
                scanlines = smoothstep(0.4, 0.6, scanlines);
                
                // Create glitch effect
                float glitch = step(0.98, sin(time * 10.0 + uv.x * 100.0));
                
                // Mix colors based on pattern
                vec3 color = mix(color1, color2, pattern * 0.5 + 0.5);
                color = mix(color, color3, scanlines);
                
                // Apply glitch
                if (glitch > 0.5) {
                    color = mix(color, vec3(1.0, 0.0, 0.0), 0.3);
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Create shader material
        this.uniforms = {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x00ff00) },
            color2: { value: new THREE.Color(0x00ffff) },
            color3: { value: new THREE.Color(0xff0080) }
        };

        this.materials.cyberpunk = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.uniforms,
            side: THREE.DoubleSide
        });
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        // Handle mouse movement for parallax
        if (CONFIG.visual.backgroundParallax) {
            document.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e);
            });
        }
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    handleMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Parallax effect
        this.camera.position.x = mouseX * 0.5;
        this.camera.position.y = mouseY * 0.5;
        this.camera.lookAt(0, 0, 0);
    }

    // Create different background styles
    createBackground(style = 'cyberpunk') {
        this.currentStyle = style;
        this.clearScene();

        switch (style) {
            case 'cyberpunk':
                this.createCyberpunkBackground();
                break;
            case 'matrix':
                this.createMatrixBackground();
                break;
            case 'apocalyptic':
                this.createApocalypticBackground();
                break;
            case 'cosmic':
                this.createCosmicBackground();
                break;
            default:
                this.createCyberpunkBackground();
        }

        this.animate();
    }

    createCyberpunkBackground() {
        // Create animated plane
        const geometry = new THREE.PlaneGeometry(20, 20, 50, 50);
        const material = this.materials.cyberpunk;
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.meshes.background = mesh;

        // Create particle system
        this.createParticleSystem(100, 0x00ff00, 0x00ffff, 0xff0080);
    }

    createMatrixBackground() {
        // Create matrix rain effect
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        // Create falling characters
        this.createMatrixRain();
    }

    createApocalypticBackground() {
        // Create fire-like background
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.3
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        // Create fire particles
        this.createFireParticles();
    }

    createCosmicBackground() {
        // Create space background
        const geometry = new THREE.SphereGeometry(50, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000011,
            side: THREE.BackSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        // Create stars
        this.createStarField();
    }

    createParticleSystem(count, color1, color2, color3) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            const color = new THREE.Color();
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                color.setHex(color1);
            } else if (colorChoice < 0.66) {
                color.setHex(color2);
            } else {
                color.setHex(color3);
            }

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    createMatrixRain() {
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columns = 50;
        const drops = new Array(columns).fill(0);

        for (let i = 0; i < columns; i++) {
            const geometry = new THREE.TextGeometry(characters[Math.floor(Math.random() * characters.length)], {
                size: 0.1,
                height: 0.01
            });
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.8
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (i - columns / 2) * 0.3;
            mesh.position.y = 10;
            this.scene.add(mesh);
            this.meshes[`matrix_${i}`] = mesh;
        }
    }

    createFireParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(50 * 3);
        const colors = new Float32Array(50 * 3);

        for (let i = 0; i < 50; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            const color = new THREE.Color();
            const intensity = Math.random();
            color.setRGB(1, intensity * 0.5, 0);

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    createStarField() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(200 * 3);
        const colors = new Float32Array(200 * 3);

        for (let i = 0; i < 200; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            const color = new THREE.Color();
            color.setRGB(1, 1, 1);

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
        this.particles.push(stars);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Update uniforms
        if (this.uniforms.time) {
            this.uniforms.time.value = time;
        }

        // Animate particles
        this.particles.forEach(particles => {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] -= 0.01; // Move particles down
                if (positions[i] < -10) {
                    positions[i] = 10; // Reset to top
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
        });

        // Animate matrix rain
        Object.keys(this.meshes).forEach(key => {
            if (key.startsWith('matrix_')) {
                const mesh = this.meshes[key];
                mesh.position.y -= 0.05;
                if (mesh.position.y < -10) {
                    mesh.position.y = 10;
                }
            }
        });

        // Animate background mesh
        if (this.meshes.background) {
            this.meshes.background.rotation.z = Math.sin(time * 0.1) * 0.1;
        }

        this.renderer.render(this.scene, this.camera);
    }

    clearScene() {
        // Remove all meshes
        Object.values(this.meshes).forEach(mesh => {
            this.scene.remove(mesh);
        });
        this.meshes = {};

        // Remove all particles
        this.particles.forEach(particles => {
            this.scene.remove(particles);
        });
        this.particles = [];

        // Clear scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Re-add lights
        this.setupLights();
    }

    // Change background style
    changeStyle(style) {
        this.createBackground(style);
    }

    // Trigger visual effect
    triggerEffect(effectType, intensity = 1.0) {
        switch (effectType) {
            case 'glitch':
                this.triggerGlitchEffect(intensity);
                break;
            case 'shake':
                this.triggerShakeEffect(intensity);
                break;
            case 'pulse':
                this.triggerPulseEffect(intensity);
                break;
            default:
                console.warn('Unknown effect type:', effectType);
        }
    }

    triggerGlitchEffect(intensity) {
        // Temporarily modify shader uniforms for glitch effect
        const originalColor1 = this.uniforms.color1.value.clone();
        const originalColor2 = this.uniforms.color2.value.clone();
        
        this.uniforms.color1.value.setHex(0xff0000);
        this.uniforms.color2.value.setHex(0x0000ff);
        
        setTimeout(() => {
            this.uniforms.color1.value.copy(originalColor1);
            this.uniforms.color2.value.copy(originalColor2);
        }, 200);
    }

    triggerShakeEffect(intensity) {
        const originalPosition = this.camera.position.clone();
        const shake = () => {
            this.camera.position.x = originalPosition.x + (Math.random() - 0.5) * intensity;
            this.camera.position.y = originalPosition.y + (Math.random() - 0.5) * intensity;
        };
        
        const shakeInterval = setInterval(shake, 50);
        setTimeout(() => {
            clearInterval(shakeInterval);
            this.camera.position.copy(originalPosition);
        }, 300);
    }

    triggerPulseEffect(intensity) {
        const originalFov = this.camera.fov;
        this.camera.fov = originalFov + intensity * 10;
        this.camera.updateProjectionMatrix();
        
        setTimeout(() => {
            this.camera.fov = originalFov;
            this.camera.updateProjectionMatrix();
        }, 200);
    }

    // Cleanup
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.clearScene();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Create background engines for different canvases
window.backgroundEngines = {};

document.addEventListener('DOMContentLoaded', () => {
    const canvases = ['background-canvas', 'hub-canvas', 'playback-canvas'];
    canvases.forEach(canvasId => {
        if (document.getElementById(canvasId)) {
            window.backgroundEngines[canvasId] = new BackgroundEngine(canvasId);
        }
    });
}); 