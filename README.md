# KILLGORITHM - Thrash Metal Immersive Web Experience

An immersive, interactive web experience for the thrash metal band "Killgorithm" featuring stunning 3D animated avatars, dynamic visual effects, and seamless audio playback.

## 🎵 Features

### Audio & Music
- **Background Audio Playback**: Music continues playing when browser is minimized
- **Crossfade Transitions**: Smooth transitions between songs
- **Clean Audio**: Pristine audio quality without unwanted effects
- **Volume Control**: Dynamic volume management
- **Playlist Management**: Full playlist support with next/previous controls

### Visual Experience
- **3D Animated Avatars**: Each song has its own unique 3D entity
- **React Three Fiber**: Modern 3D graphics with WebGL acceleration
- **Interactive Avatars**: Hover effects, animations, and visual feedback
- **Thrash Metal Aesthetics**: Dark, aggressive, cyberpunk-inspired design
- **Dynamic Lighting**: Real-time lighting effects and shadows

### Song Avatars
- **"Nemo's Tears"** → Cyberpunk submarine with thrusters and sonar pings
- **"Courage Mix"** → Cyborg with glowing human heart and breathing effects
- **"Ave De Presa"** → Metallic hawk with laser eyes and wing animations
- **"To Hell & Back To Hell"** → Glitchy demonic bat with fire trails

### Interactive Elements
- **3D Scene Interaction**: Click and hover on avatars
- **Keyboard Shortcuts**: Full keyboard navigation
- **Touch Support**: Mobile-friendly touch controls
- **Responsive Design**: Works on all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Python 3.8+ (for virtual environment)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd KILLGORITHM
   ```

2. **Set up Python virtual environment**
   ```bash
   # Create virtual environment
   python3 -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   # venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your audio files**
   - Place `.mp3` files in the `/public/audio` folder
   - Update `src/config/config.js` with your song metadata

4. **Add background images (optional)**
   - Place images in the `/public/backgrounds` folder
   - Update song configs with background file paths

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
KILLGORITHM/
├── src/
│   ├── components/
│   │   ├── Experience.jsx      # 3D scene management
│   │   └── UI.jsx              # User interface
│   ├── avatars/
│   │   ├── NemoTears.jsx       # Submarine avatar
│   │   ├── Courage.jsx         # Cyborg avatar
│   │   ├── AveDePresa.jsx      # Hawk avatar
│   │   └── ToHellAndBack.jsx   # Bat avatar
│   ├── hooks/
│   │   └── useAudioManager.js  # Audio management
│   ├── config/
│   │   └── config.js           # Song configuration
│   ├── App.jsx                 # Main application
│   ├── main.jsx                # React entry point
│   └── index.css               # Base styles
├── public/
│   ├── audio/                  # Audio files (.mp3)
│   └── backgrounds/            # Background images
├── index.html                  # HTML template
├── package.json                # Dependencies
└── vite.config.js              # Build configuration
```

## 🎛️ Configuration

### Adding New Songs

Edit `src/config/config.js` to add new songs:

```javascript
{
    id: "your-song-id",
    title: "Your Song Title",
    artist: "KILLGORITHM",
    duration: "4:30",
    audioFile: "/audio/your-song.mp3",
    avatar: "YourAvatar", // Must match component name
    visualStyle: "thrash-aggressive",
    colorScheme: {
        primary: "#ff0000",
        secondary: "#000000",
        accent: "#ffffff"
    },
    effects: ["your", "effects"],
    bpm: 140,
    intensity: 0.8
}
```

### Creating New Avatars

1. Create a new component in `src/avatars/`
2. Follow the pattern of existing avatars
3. Use React Three Fiber hooks (`useFrame`, `useRef`)
4. Add to the avatar mapping in `src/components/Experience.jsx`

Example avatar structure:
```jsx
import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

function YourAvatar({ isPlaying, songData }) {
  const avatarRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state, delta) => {
    // Animation logic here
  })
  
  return (
    <group ref={avatarRef}>
      {/* 3D geometry here */}
    </group>
  )
}

export default YourAvatar
```

## 🎮 Controls

### Keyboard Shortcuts
- `Space`: Play/Pause
- `Esc`: Close modals
- `Tab`: Navigate UI elements

### Mouse/Touch
- Click song cards to play
- Hover over avatars for effects
- Click and drag to rotate camera (disabled in current setup)

## 🎨 Customization

### Visual Themes
Available themes in `config.js`:
- **thrash-aggressive**: Red/black with skulls and blood
- **thrash-dark**: Black/red with chains and metal
- **thrash-brutal**: Dark red with bones and aggression
- **thrash-infernal**: Red/orange with fire and demons

### Avatar Animations
Each avatar supports:
- Idle animations (floating, breathing, etc.)
- Hover effects (rotation, glow, etc.)
- Playing state animations (intensified effects)
- Song-specific behaviors

## 🔧 Technical Details

### Technologies Used
- **React 18**: Modern React with hooks
- **React Three Fiber**: React renderer for Three.js
- **Three.js**: 3D graphics library
- **Vite**: Fast build tool and dev server
- **WebGL**: Hardware-accelerated graphics

### Performance Features
- **GPU Acceleration**: WebGL rendering
- **Optimized Avatars**: Low-poly geometry with effects
- **Frame Rate Monitoring**: Automatic effect adjustment
- **Memory Management**: Proper cleanup and disposal

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🐛 Troubleshooting

### Common Issues

**Audio not playing:**
- Ensure user interaction before audio starts
- Check browser autoplay policies
- Verify audio file paths and formats

**3D not rendering:**
- Check WebGL support in browser
- Reduce avatar complexity for better performance
- Disable effects on low-end devices

**Build errors:**
- Ensure Node.js version is 16+
- Clear node_modules and reinstall
- Check for missing dependencies

### Performance Optimization

For better performance on low-end devices:
1. Reduce avatar complexity
2. Disable shadows and effects
3. Lower resolution
4. Use compressed audio files

## 📱 Mobile Support

The experience is fully optimized for mobile devices:
- Touch-friendly controls
- Responsive design
- Optimized performance
- Mobile-optimized effects

## 🎵 Audio File Requirements

- **Format**: MP3 (recommended) or WAV
- **Quality**: 320kbps or higher
- **Sample Rate**: 44.1kHz
- **Channels**: Stereo
- **Duration**: Any length supported

## 🎬 Background Image Requirements

- **Format**: JPG, PNG, or WebP
- **Resolution**: 1920x1080 or higher
- **File Size**: Optimize for web (under 2MB recommended)
- **Aspect Ratio**: 16:9 or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎵 About KILLGORITHM

KILLGORITHM is a thrash metal band pushing the boundaries of digital music and visual art. This web experience represents their fusion of aggressive music with cutting-edge 3D technology.

---

**Experience the future of metal music visualization with 3D avatars.** 🤘💀🔥 