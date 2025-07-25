// Killgorithm Configuration
const CONFIG = {
    // System Settings
    system: {
        name: "KILLGORITHM",
        version: "1.0.0",
        theme: "cyberpunk",
        defaultVolume: 0.7,
        fadeInDuration: 1000,
        fadeOutDuration: 500
    },

    // Audio Settings
    audio: {
        crossfade: true,
        crossfadeDuration: 2000,
        preloadNext: true,
        backgroundPlayback: true,
        cleanMode: true, // Ensures pristine audio quality
        disableEffects: true // Disables all audio effects for clean sound
    },

    // Visual Settings
    visual: {
        particleCount: 100,
        glitchIntensity: 0.3,
        backgroundParallax: true,
        cursorTrails: true,
        maxTrails: 10
    },

    // Songs Configuration
    songs: [
        {
            id: "nemos-tears",
            title: "Nemo's Tears",
            artist: "KILLGORITHM",
            duration: "6:57",
            audioFile: "audio/nemos-tears.mp3",
            videoFile: "",
            background: "backgrounds/killgorithm.png",
            visualStyle: "cyberpunk",
            animationType: "particle-system",
            colorScheme: {
                primary: "#00ff00",
                secondary: "#00ffff",
                accent: "#ff0080"
            },
            effects: ["glitch", "scanlines"],
            bpm: 140,
            intensity: 0.8
        },
        {
            id: "courage-mix",
            title: "Courage Mix",
            artist: "KILLGORITHM",
            duration: "4:30",
            audioFile: "audio/COURAGE MIX AUG 24.mp3",
            videoFile: "",
            background: "backgrounds/killgorithm.png",
            visualStyle: "matrix",
            animationType: "matrix-rain",
            colorScheme: {
                primary: "#00ff00",
                secondary: "#ffffff",
                accent: "#ff0000"
            },
            effects: ["matrix", "data-stream"],
            bpm: 160,
            intensity: 0.9
        },
        {
            id: "ave-de-presa",
            title: "Ave De Presa",
            artist: "KILLGORITHM",
            duration: "5:45",
            audioFile: "audio/AVE DE PRESA v10.mp3",
            videoFile: "",
            background: "backgrounds/killgorithm.png",
            visualStyle: "apocalyptic",
            animationType: "fire-particles",
            colorScheme: {
                primary: "#ff6600",
                secondary: "#ff0000",
                accent: "#ffff00"
            },
            effects: ["fire", "smoke"],
            bpm: 180,
            intensity: 1.0
        },
        {
            id: "to-hell-and-back",
            title: "To Hell & Back To Hell",
            artist: "KILLGORITHM",
            duration: "7:20",
            audioFile: "audio/To Hell & Back To Hel v8.mp3",
            videoFile: "",
            background: "backgrounds/killgorithm.png",
            visualStyle: "cosmic",
            animationType: "space-particles",
            colorScheme: {
                primary: "#0000ff",
                secondary: "#ffffff",
                accent: "#ff00ff"
            },
            effects: ["nebula", "stars"],
            bpm: 150,
            intensity: 0.85
        }
    ],

    // Visual Themes
    themes: {
        cyberpunk: {
            name: "Cyberpunk",
            colors: {
                primary: "#00ff00",
                secondary: "#00ffff",
                accent: "#ff0080",
                background: "#000000",
                text: "#00ff00"
            },
            effects: ["neon", "glitch", "scanlines"]
        },
        apocalyptic: {
            name: "Apocalyptic",
            colors: {
                primary: "#ff6600",
                secondary: "#ff0000",
                accent: "#ffff00",
                background: "#1a0f00",
                text: "#ff6600"
            },
            effects: ["fire", "smoke", "dust"]
        },
        matrix: {
            name: "Matrix",
            colors: {
                primary: "#00ff00",
                secondary: "#ffffff",
                accent: "#ff0000",
                background: "#000000",
                text: "#00ff00"
            },
            effects: ["matrix-rain", "data-stream", "glitch"]
        },
        cosmic: {
            name: "Cosmic",
            colors: {
                primary: "#0000ff",
                secondary: "#ffffff",
                accent: "#ff00ff",
                background: "#000011",
                text: "#ffffff"
            },
            effects: ["nebula", "stars", "wormhole"]
        }
    },

    // Animation Presets
    animations: {
        particleSystem: {
            count: 100,
            speed: 2,
            size: { min: 1, max: 5 },
            opacity: { min: 0.3, max: 1.0 },
            colors: ["#00ff00", "#00ffff", "#ff0080"]
        },
        matrixRain: {
            characters: "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
            speed: 1.5,
            fontSize: 14,
            color: "#00ff00"
        },
        fireParticles: {
            count: 50,
            speed: 3,
            size: { min: 2, max: 8 },
            colors: ["#ff6600", "#ff0000", "#ffff00"]
        },
        spaceParticles: {
            count: 200,
            speed: 1,
            size: { min: 1, max: 3 },
            colors: ["#ffffff", "#0000ff", "#ff00ff"]
        }
    },

    // UI Elements
    ui: {
        buttons: {
            hoverEffect: "glow",
            clickEffect: "ripple",
            transitionDuration: 0.3
        },
        cursor: {
            enabled: true,
            trail: true,
            maxTrails: 10,
            trailFade: 0.8
        },
        loading: {
            duration: 3000,
            steps: ["INITIALIZING", "LOADING ASSETS", "SYNCING AUDIO", "READY"]
        }
    },

    // Performance Settings
    performance: {
        maxParticles: 500,
        maxAudioSources: 5,
        enableWebGL: true,
        enableAudioContext: true,
        lazyLoading: true,
        compression: true
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 