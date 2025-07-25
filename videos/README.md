# Video Files

Place your MP4 video files in this directory.

## File Requirements:
- Format: MP4 (H.264)
- Resolution: 1080p or lower for performance
- Codec: H.264
- Audio: AAC or MP3
- Duration: Any length supported

## Example Files:
- `digital-void.mp4`
- `neural-overload.mp4`
- `apocalyptic-rise.mp4`
- `cyber-assault.mp4`
- `void-walker.mp4`

## Configuration:
After adding files, update the song metadata in `js/config.js`:

```javascript
{
    id: "your-song-id",
    title: "Your Song Title",
    videoFile: "videos/your-video.mp4",
    // ... other properties
}
```

## Features:
- Full-screen video playback
- Video controls (play, pause, seek)
- Keyboard shortcuts (V to toggle, Esc to close)
- Mobile-friendly video controls
- Automatic video loading and caching

## Notes:
- Videos are optional - songs work without video files
- Videos open in full-screen overlay
- Background music continues during video playback 