import { useState, useEffect } from 'react'
import CyberGuyBackground from './components/CyberGuyBackground'
import KillgorithmTitle from './components/KillgorithmTitle'
import AvatarShowcase from './components/AvatarShowcase'
import LightningEffects from './components/LightningEffects'
import LoadingScreen from './components/LoadingScreen'
import MusicPlayer from './components/MusicPlayer'
import YouTubePlayer from './components/YouTubePlayer'
import KillgorithmLegend from './components/KillgorithmLegend'
import { useAudioManager } from './hooks/useAudioManager'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSong, setSelectedSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoTriggered, setVideoTriggered] = useState(false) // Track if video was clicked
  const { audioManager, currentTime, duration } = useAudioManager()

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    console.log('🎵🏗️ App: audioManager changed:', !!audioManager)
    if (audioManager) {
      console.log('🎵🏗️ App: Calling audioManager.initialize()...')
      audioManager.initialize()
      console.log('🎵🏗️ App: AudioManager initialization complete')
    }
  }, [audioManager])

  // Update isPlaying state when audio manager state changes
  useEffect(() => {
    if (audioManager) {
      const checkPlayingState = () => {
        const playing = audioManager.getIsPlaying()
        if (playing !== isPlaying) {
          setIsPlaying(playing)
        }
      }
      const interval = setInterval(checkPlayingState, 100)
      return () => clearInterval(interval)
    }
  }, [audioManager, isPlaying])

  // Handle avatar clicks - show video for Nemo's Tears, audio for others
  const handleAvatarClick = (songId) => {
    console.log(`🎬 Avatar clicked: ${songId}`)
    
    // Special handling for Nemo's Tears - show video
    if (songId === 'nemos-tears') {
      console.log('🎬 Opening video for Nemo\'s Tears')
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
    console.log(`🎵 Song selected: ${songId}, fromMusicPlayer: ${fromMusicPlayer}`)
    console.log('🎵 Audio manager available:', !!audioManager)
    console.log('🎵 Current state - selectedSong:', selectedSong, 'isPlaying:', isPlaying)
    
    // If triggered from music player, don't show video
    if (fromMusicPlayer) {
      setVideoTriggered(false)
      setShowVideo(false)
    }
    
    // If the same song is playing, pause it
    if (selectedSong === songId && isPlaying) {
      console.log('🎵 ⏸️ Pausing current song...')
      audioManager.pause()
      setIsPlaying(false)
      return
    }
    
    // If the same song is paused, resume it
    if (selectedSong === songId && !isPlaying) {
      console.log('🎵 ▶️ Resuming current song...')
      audioManager.play()
      setIsPlaying(true)
      return
    }
    
    // Play new song
    const songFiles = {
      'nemos-tears': '/audio/nemos-tears.mp3',
      'ave-de-presa': '/audio/AVE DE PRESA v10.mp3',
      'to-hell-and-back': '/audio/To Hell & Back To Hel v8.mp3',
      'courage': '/audio/COURAGE MIX AUG 24.mp3'
    }
    
    const audioFile = songFiles[songId]
    console.log('🎵 Audio file for', songId, ':', audioFile)
    
    if (audioManager && audioFile) {
      console.log('🎵 🎶 Playing new song...')
      audioManager.playSong(songId, audioFile)
      setSelectedSong(songId)
      setIsPlaying(true)
      console.log('🎵 State updated - selectedSong:', songId, 'isPlaying: true')
    } else {
      console.warn('🎵 Cannot play - audioManager:', !!audioManager, 'audioFile:', audioFile)
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
    if (audioManager) {
      audioManager.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (audioManager) {
      audioManager.pause()
      setIsPlaying(false)
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