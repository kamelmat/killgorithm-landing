# Audio Files

Place your MP3 audio files in this directory.

## File Requirements:
- Format: MP3 (recommended) or WAV
- Quality: 320kbps or higher
- Sample Rate: 44.1kHz
- Channels: Stereo

## Example Files:
- `digital-void.mp3`
- `neural-overload.mp3`
- `apocalyptic-rise.mp3`
- `cyber-assault.mp3`
- `void-walker.mp3`

## Configuration:
After adding files, update the song metadata in `js/config.js`:

```javascript
{
    id: "your-song-id",
    title: "Your Song Title",
    artist: "KILLGORITHM",
    duration: "4:30",
    audioFile: "audio/your-song.mp3",
    // ... other properties
}
```

## Notes:
- Files are automatically loaded on startup
- Background playback is supported
- Crossfade transitions are applied between songs 