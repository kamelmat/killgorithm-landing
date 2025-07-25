# Background Images

Place your background images in this directory.

## File Requirements:
- Format: JPG, PNG, or WebP
- Resolution: 1920x1080 or higher
- File Size: Optimize for web (under 2MB recommended)
- Aspect Ratio: 16:9 or similar

## Example Files:
- `cyber-void.jpg`
- `neural-grid.jpg`
- `wasteland.jpg`
- `cyber-city.jpg`
- `void-space.jpg`

## Configuration:
After adding files, update the song metadata in `js/config.js`:

```javascript
{
    id: "your-song-id",
    title: "Your Song Title",
    background: "backgrounds/your-bg.jpg",
    // ... other properties
}
```

## Usage:
- Backgrounds are used as base textures for Three.js scenes
- Images are automatically loaded and cached
- Multiple visual effects are applied over backgrounds
- Parallax movement is applied for dynamic effect

## Visual Effects Applied:
- Glitch effects
- Scanlines
- Color overlays
- Particle systems
- Dynamic lighting

## Notes:
- Backgrounds are optional - default effects will be used
- Images are automatically resized and optimized
- WebP format recommended for better performance 