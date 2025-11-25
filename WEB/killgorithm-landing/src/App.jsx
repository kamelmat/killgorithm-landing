import { useState, useEffect, useLayoutEffect } from 'react'
import CyberGuyBackground from './components/CyberGuyBackground'
import KillgorithmTitle from './components/KillgorithmTitle'
import AvatarShowcase from './components/AvatarShowcase'
import LightningEffects from './components/LightningEffects'
import LoadingScreen from './components/LoadingScreen'
import MusicPlayer from './components/MusicPlayer'
import YouTubePlayer from './components/YouTubePlayer'
import KillgorithmLegend from './components/KillgorithmLegend'
import { useAudioManager } from './hooks/useYouTubeAudioManager' // Switched to YouTube streaming
import './App.css'
import './styles/youtube-player.css'

function App() {
  console.log('🎸🆕 NEW App.jsx - Version 2.0 - RENDERING!')
  
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSong, setSelectedSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoTriggered, setVideoTriggered] = useState(false) // Track if video was clicked
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false)
  
  // YouTube player visibility: show when playing, hide when video showing or minimized
  const showYouTubePlayer = isPlaying && !showVideo && !isPlayerMinimized
  
  const { audioManager, currentTime, duration, updatePlayerVisibility } = useAudioManager()
  
  // Use useLayoutEffect to update visibility synchronously before paint
  useLayoutEffect(() => {
    console.log('⚡ useLayoutEffect triggered - showYouTubePlayer:', showYouTubePlayer, 'isPlaying:', isPlaying)
    if (updatePlayerVisibility) {
      updatePlayerVisibility(showYouTubePlayer)
      console.log('⚡ Called updatePlayerVisibility with:', showYouTubePlayer)
    }
  }, [showYouTubePlayer, updatePlayerVisibility])

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // AudioManager ready - YouTube manager self-initializes
  }, [audioManager])

  // Handle avatar clicks - show video for Nemo's Tears, audio for others
  const handleAvatarClick = (songId) => {
    console.log(`🎬 Avatar clicked: ${songId}`)
    
    // Special handling for Nemo's Tears - show video
    if (songId === 'nemos-tears') {
      console.log('🎬 Opening video for Nemo\'s Tears')
      
      // BUGFIX: Pause music player if it's playing
      if (audioManager && isPlaying) {
        console.log('🎬 Pausing music player to prevent overlap')
        audioManager.pause()
        setIsPlaying(false)
      }
      
      setShowVideo(true)
      setVideoTriggered(true)
      setSelectedSong(songId)
      // Don't auto-play audio when video is shown
      return
    }
    
    // For other songs, play audio normally
    handleSongSelect(songId, false) // false = not from music player
  }

  // Handle song selection from music player or direct audio play
  const handleSongSelect = (songId, fromMusicPlayer = true) => {
    
    // If triggered from music player, don't show video
    if (fromMusicPlayer) {
      setVideoTriggered(false)
      setShowVideo(false)
    }
    
    // If the same song is playing, pause it
    if (selectedSong === songId && isPlaying) {
      audioManager.pause()
      setIsPlaying(false)
      return
    }
    
    // If the same song is paused, resume it
    if (selectedSong === songId && !isPlaying) {
      audioManager.play()
      setIsPlaying(true)
      return
    }
    
    // Play new song - Now using YouTube streaming
    if (audioManager) {
      setSelectedSong(songId)
      setIsPlaying(true)
      console.log('✅ setIsPlaying(true) called - isPlaying should now be true')
      // Call playSong AFTER setting state to avoid race conditions
      setTimeout(() => audioManager.playSong(songId), 0)
    } else {
      console.warn('🎵 Cannot play - audioManager not ready')
    }
  }

  // Handle video player controls
  const handleCloseVideo = () => {
    console.log('🎬 Closing video player')
    setShowVideo(false)
    setVideoTriggered(false)
  }

  const handleVideoAudioMode = (audioOnly) => {
    console.log('🎬 Video audio mode:', audioOnly ? 'Audio Only' : 'Video Mode')
    // When switching to audio-only, ensure the audio is playing
    if (audioOnly && selectedSong === 'nemos-tears') {
      handleSongSelect('nemos-tears', false)
    }
  }

  const handleNext = () => {
    if (audioManager) {
      const nextSongId = audioManager.playNext()
      if (nextSongId) {
        setSelectedSong(nextSongId)
        setIsPlaying(true)
        // Close video when navigating through music player
        setShowVideo(false)
        setVideoTriggered(false)
      }
    }
  }

  const handlePrevious = () => {
    if (audioManager) {
      const prevSongId = audioManager.playPrevious()
      if (prevSongId) {
        setSelectedSong(prevSongId)
        setIsPlaying(true)
        // Close video when navigating through music player
        setShowVideo(false)
        setVideoTriggered(false)
      }
    }
  }

  const handleSeek = (time) => {
    if (audioManager) {
      audioManager.seek(time)
    }
  }

  const handlePlay = () => {
    console.log('🎵▶️ App handlePlay called')
    if (audioManager) {
      audioManager.play()
      setIsPlaying(true)
      console.log('🎵▶️ App setIsPlaying(true)')
    }
  }

  const handlePause = () => {
    console.log('🎵⏸️ App handlePause called')
    if (audioManager) {
      audioManager.pause()
      setIsPlaying(false)
      console.log('🎵⏸️ App setIsPlaying(false)')
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="app">
      {/* THE GUY - Animated Background */}
      <CyberGuyBackground />
      
      {/* Lightning Effects Layer */}
      <LightningEffects />
      
      {/* Main Content */}
      <div className="main-content">
        {/* KILLGORITHM Animated Title */}
        <KillgorithmTitle />
        
        {/* Avatar Selection */}
        <AvatarShowcase 
          onSongSelect={handleAvatarClick} 
          selectedSong={selectedSong}
          isPlaying={isPlaying}
        />
      </div>
      
      {/* Music Player - Hovers above avatars */}
      <MusicPlayer
        selectedSong={selectedSong}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        currentTime={currentTime}
        duration={duration}
        isVisible={!!selectedSong}
        onMinimizedChange={setIsPlayerMinimized}
      />

      {/* YouTube Video Player - Shows for Nemo's Tears */}
      <YouTubePlayer
        videoId="XdClrwJJ60g"
        isVisible={showVideo && selectedSong === 'nemos-tears'}
        onClose={handleCloseVideo}
        songTitle="Nemo's Tears"
        onAudioOnlyMode={handleVideoAudioMode}
      />

      {/* Killgorithm Legend - Info Icon & About Modal */}
      <KillgorithmLegend />
      
      {/* Custom Cursor - Disabled for now */}
      {/* <div className="custom-cursor" /> */}
    </div>
  )
}

export default App