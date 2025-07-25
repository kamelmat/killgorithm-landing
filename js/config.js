// Killgorithm Configuration
const CONFIG = {
    // System Settings
    system: {
        name: "KILLGORITHM",
        version: "1.0.0",
        theme: "thrash-metal",
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
        particleCount: 50,
        glitchIntensity: 0.2,
        backgroundParallax: true,
        cursorTrails: true,
        maxTrails: 5
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
            visualStyle: "thrash-aggressive",
            animationType: "skull-particles",
            colorScheme: {
                primary: "#ff0000",
                secondary: "#000000",
                accent: "#ffffff"
            },
            effects: ["skulls", "chains", "blood"],
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
            background: "backgrounds/killgorithm2.png",
            visualStyle: "thrash-dark",
            animationType: "chain-rain",
            colorScheme: {
                primary: "#000000",
                secondary: "#ff0000",
                accent: "#cccccc"
            },
            effects: ["chains", "spikes", "darkness"],
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
            visualStyle: "thrash-brutal",
            animationType: "bone-explosion",
            colorScheme: {
                primary: "#8b0000",
                secondary: "#000000",
                accent: "#ff6600"
            },
            effects: ["bones", "fire", "aggression"],
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
            background: "backgrounds/killgorithm2.png",
            visualStyle: "thrash-infernal",
            animationType: "hell-fire",
            colorScheme: {
                primary: "#ff0000",
                secondary: "#000000",
                accent: "#ff6600"
            },
            effects: ["fire", "demons", "hell"],
            bpm: 150,
            intensity: 0.85
        }
    ],

    // Visual Themes - Authentic Thrash Metal
    themes: {
        "thrash-aggressive": {
            name: "Thrash Aggressive",
            colors: {
                primary: "#ff0000",
                secondary: "#000000",
                accent: "#ffffff",
                background: "#000000",
                text: "#ff0000"
            },
            effects: ["skulls", "chains", "blood", "aggression"]
        },
        "thrash-dark": {
            name: "Thrash Dark",
            colors: {
                primary: "#000000",
                secondary: "#ff0000",
                accent: "#cccccc",
                background: "#000000",
                text: "#ffffff"
            },
            effects: ["chains", "spikes", "darkness", "metal"]
        },
        "thrash-brutal": {
            name: "Thrash Brutal",
            colors: {
                primary: "#8b0000",
                secondary: "#000000",
                accent: "#ff6600",
                background: "#000000",
                text: "#ff0000"
            },
            effects: ["bones", "fire", "aggression", "brutality"]
        },
        "thrash-infernal": {
            name: "Thrash Infernal",
            colors: {
                primary: "#ff0000",
                secondary: "#000000",
                accent: "#ff6600",
                background: "#000000",
                text: "#ff0000"
            },
            effects: ["fire", "demons", "hell", "infernal"]
        }
    },

    // Animation Presets - Thrash Metal Specific
    animations: {
        skullParticles: {
            count: 30,
            speed: 3,
            size: { min: 20, max: 40 },
            opacity: { min: 0.7, max: 1.0 },
            colors: ["#ff0000", "#000000", "#ffffff"],
            symbols: ["💀", "☠️", "⚰️", "🦴"]
        },
        chainRain: {
            count: 20,
            speed: 4,
            size: { min: 15, max: 30 },
            opacity: { min: 0.8, max: 1.0 },
            colors: ["#cccccc", "#888888", "#444444"],
            symbols: ["⛓️", "🔗", "⚡", "🗡️"]
        },
        boneExplosion: {
            count: 25,
            speed: 5,
            size: { min: 25, max: 50 },
            opacity: { min: 0.6, max: 1.0 },
            colors: ["#ffffff", "#cccccc", "#ff6600"],
            symbols: ["🦴", "💀", "⚰️", "🔥"]
        },
        hellFire: {
            count: 40,
            speed: 6,
            size: { min: 30, max: 60 },
            opacity: { min: 0.5, max: 1.0 },
            colors: ["#ff0000", "#ff6600", "#8b0000"],
            symbols: ["🔥", "👹", "😈", "⚡"]
        }
    },

    // UI Elements - Thrash Metal Styling
    ui: {
        buttons: {
            hoverEffect: "blood-drip",
            clickEffect: "skull-burst",
            transitionDuration: 0.2
        },
        cursor: {
            enabled: true,
            trail: true,
            maxTrails: 5,
            trailFade: 0.9,
            style: "skull"
        },
        loading: {
            duration: 3000,
            steps: ["INITIALIZING", "LOADING ASSETS", "SYNCING AUDIO", "READY"]
        }
    },

    // Performance Settings
    performance: {
        maxParticles: 200,
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