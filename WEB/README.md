# KILLGORITHM - Videogame Landing Page

## 🎮 CONCEPT
A stunning, immersive landing page that feels like entering a videogame. Features:

### 🌌 THE GUY - Animated Background
- **guy9.jpg** → **guy7.jpg** → **guy8.jpg** → **guy6.jpg** (eyes & circuits lighting up)
- Full-screen animated background with breathing effects
- Cosmic atmosphere with glowing overlays

### ⚡ VISUAL EFFECTS
- **Lightning Effects**: Dynamic canvas-based lightning strikes
- **Energy Particles**: Floating cyber particles throughout the scene
- **Glowing Elements**: All UI elements have sci-fi glow effects

### 🎯 AVATAR SHOWCASE
- **Nemo's Tears**: 3D submarine model (floating/rotating)
- **Ave de Presa**: 3D eagle model (floating/rotating)  
- **Future Avatars**: Expandable for more characters
- Hover effects with enhanced lighting

### 🎵 KILLGORITHM TITLE
- Animated title using the band logo image
- Emerging animation with pulse effects
- Red metallic glow matching the thrash metal aesthetic

### 🎮 VIDEOGAME FEATURES
- Custom animated cursor
- Loading screen with progress bar
- Hover animations and click effects
- Responsive design for mobile/desktop

## 🚀 HOW TO RUN

### Simple HTTP Server:
```bash
# Navigate to WEB folder
cd WEB

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have it)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 📁 STRUCTURE
```
WEB/
├── index.html          # Main landing page
├── style.css           # All styling & animations  
├── script.js           # JavaScript interactions & effects
├── guy9.jpg           # Background: Dormant state
├── guy7.jpg           # Background: Awakening  
├── guy8.jpg           # Background: Active
├── guy6.jpg           # Background: Fully lit
├── Killgorithm.jpg    # Band logo/title
└── README.md          # This file
```

## 🛠️ TECH STACK
- **Pure HTML/CSS/JS** - No frameworks, maximum compatibility
- **Three.js** - For 3D avatar models (CDN)
- **Canvas API** - For lightning effects
- **CSS Animations** - For all visual effects
- **Responsive Design** - Works on all devices

## 🎨 DESIGN PHILOSOPHY
- **Dark Cyber Aesthetic**: Black backgrounds with cyan/red accents
- **Thrash Metal Vibes**: Bold, aggressive typography and effects
- **Videogame Feel**: Interactive elements, loading screens, particle effects
- **Immersive Experience**: Full-screen backgrounds, ambient animations

## 🔧 CUSTOMIZATION
- **Add New Avatars**: Update the avatar-showcase section in HTML
- **New Songs**: Add new avatar containers with data-song attributes
- **Effects**: Modify lightning frequency, particle count in script.js
- **Colors**: Change the cyan (#00ffff) and red (#ff0040) theme in CSS

## 🎮 NEXT STEPS
1. **Audio Integration**: Connect play buttons to actual audio files
2. **3D Models**: Add the actual .glb files for avatars
3. **More Effects**: Add more particle systems, shaders
4. **Interactivity**: Add more hover effects, transitions between sections
5. **Mobile Optimization**: Enhance touch interactions

**This is your videogame landing page - simple, stunning, and ready to rock! 🤘💀🔥**
