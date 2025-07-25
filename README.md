# KILLGORITHM - Thrash Metal Immersive Web Experience

An immersive, interactive web experience for the thrash metal band "Killgorithm" featuring stunning animated backgrounds, dynamic visual effects, and seamless audio playback.

## 🎵 Features

### Audio & Music
- **Background Audio Playback**: Music continues playing when browser is minimized
- **Crossfade Transitions**: Smooth transitions between songs
- **Audio Effects**: Reverb, distortion, and filter effects
- **Volume Control**: Dynamic volume management
- **Playlist Management**: Full playlist support with next/previous controls

### Visual Experience
- **Three.js Backgrounds**: Dynamic 3D backgrounds with shaders
- **Particle Systems**: Multiple particle effects (cyberpunk, matrix, fire, space)
- **Glitch Effects**: Authentic glitch art and scanline effects
- **Parallax Movement**: Responsive camera movement
- **Theme Switching**: Different visual themes per song

### Interactive Elements
- **Custom Cursor**: Cyberpunk-styled cursor with trails
- **Hover Effects**: Interactive feedback on all elements
- **Keyboard Shortcuts**: Full keyboard navigation
- **Touch Support**: Mobile-friendly touch controls
- **Video Integration**: Full-screen video playback

### Responsive Design
- **Mobile Optimized**: Works on all screen sizes
- **Performance Monitoring**: Automatic effect adjustment based on FPS
- **Progressive Loading**: Asset preloading with progress indicators

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for audio/video file access)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd KILLGORITHM
   ```

2. **Add your audio files**
   - Place `.mp3` files in the `/audio` folder
   - Update `js/config.js` with your song metadata

3. **Add video files (optional)**
   - Place `.mp4` files in the `/videos` folder
   - Update song configs with video file paths

4. **Add background images (optional)**
   - Place images in the `/backgrounds` folder
   - Update song configs with background file paths

5. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

6. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
KILLGORITHM/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── config.js           # Configuration and song metadata
│   ├── audio-manager.js    # Audio playback management
│   ├── visual-effects.js   # Particle systems and effects
│   ├── background-engine.js # Three.js background engine
│   ├── ui-manager.js       # UI and navigation management
│   └── app.js              # Main application logic
├── audio/                  # Audio files (.mp3)
├── videos/                 # Video files (.mp4)
├── backgrounds/            # Background images
└── config/                 # Additional configuration files
```

## 🎛️ Configuration

### Adding New Songs

Edit `js/config.js` to add new songs:

```javascript
{
    id: "your-song-id",
    title: "Your Song Title",
    artist: "KILLGORITHM",
    duration: "4:30",
    audioFile: "audio/your-song.mp3",
    videoFile: "videos/your-video.mp4", // optional
    background: "backgrounds/your-bg.jpg", // optional
    visualStyle: "cyberpunk", // cyberpunk, matrix, apocalyptic, cosmic
    animationType: "particle-system", // particle-system, matrix-rain, fire-particles, space-particles
    colorScheme: {
        primary: "#00ff00",
        secondary: "#00ffff",
        accent: "#ff0080"
    },
    effects: ["glitch", "scanlines", "distortion"],
    bpm: 140,
    intensity: 0.8
}
```

### Visual Themes

Available themes:
- **Cyberpunk**: Neon green/cyan with glitch effects
- **Matrix**: Green matrix rain with data streams
- **Apocalyptic**: Orange/red fire and smoke effects
- **Cosmic**: Blue/purple space and star effects

### Audio Effects

Available audio effects:
- **Reverb**: Echo and space effects
- **Distortion**: Overdrive and fuzz effects
- **Filter**: Low-pass and high-pass filtering

## 🎮 Controls

### Keyboard Shortcuts
- `Space`: Play/Pause
- `←`: Previous song
- `→`: Next song
- `V`: Toggle video (if available)
- `Esc`: Close video

### Mouse/Touch
- Click song cards to play
- Hover for visual previews
- Swipe left/right on mobile for song navigation

## 🎨 Customization

### Visual Effects
Modify `CONFIG.visual` in `config.js`:
```javascript
visual: {
    particleCount: 100,
    glitchIntensity: 0.3,
    backgroundParallax: true,
    cursorTrails: true,
    maxTrails: 10
}
```

### Performance Settings
Adjust `CONFIG.performance`:
```javascript
performance: {
    maxParticles: 500,
    maxAudioSources: 5,
    enableWebGL: true,
    enableAudioContext: true,
    lazyLoading: true,
    compression: true
}
```

## 🔧 Technical Details

### Technologies Used
- **Three.js**: 3D graphics and shaders
- **Web Audio API**: Advanced audio processing
- **GSAP**: Smooth animations and transitions
- **WebGL**: Hardware-accelerated graphics
- **CSS3**: Modern styling and effects

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance Features
- **GPU Acceleration**: WebGL rendering
- **Lazy Loading**: Assets loaded on demand
- **Frame Rate Monitoring**: Automatic effect adjustment
- **Memory Management**: Proper cleanup and disposal

## 🐛 Troubleshooting

### Common Issues

**Audio not playing:**
- Ensure user interaction before audio starts
- Check browser autoplay policies
- Verify audio file paths and formats

**Visual effects not working:**
- Check WebGL support in browser
- Reduce particle count for better performance
- Disable effects on low-end devices

**Video not loading:**
- Verify video file paths
- Check video format compatibility
- Ensure proper CORS headers

### Performance Optimization

For better performance on low-end devices:
1. Reduce `particleCount` in config
2. Disable `backgroundParallax`
3. Set `glitchIntensity` to 0.1
4. Use compressed audio/video files

## 📱 Mobile Support

The experience is fully optimized for mobile devices:
- Touch-friendly controls
- Responsive design
- Optimized performance
- Swipe gestures
- Mobile-optimized effects

## 🎵 Audio File Requirements

- **Format**: MP3 (recommended) or WAV
- **Quality**: 320kbps or higher
- **Sample Rate**: 44.1kHz
- **Channels**: Stereo
- **Duration**: Any length supported

## 🎬 Video File Requirements

- **Format**: MP4 (H.264)
- **Resolution**: 1080p or lower for performance
- **Codec**: H.264
- **Audio**: AAC or MP3
- **Duration**: Any length supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎵 About KILLGORITHM

KILLGORITHM is a thrash metal band pushing the boundaries of digital music and visual art. This web experience represents their fusion of aggressive music with cutting-edge technology.

---

**Experience the future of metal music visualization.** 