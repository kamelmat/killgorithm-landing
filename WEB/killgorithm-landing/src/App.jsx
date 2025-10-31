import { useState, useEffect } from 'react'
import CyberGuyBackground from './components/CyberGuyBackground'
import KillgorithmTitle from './components/KillgorithmTitle'
import AvatarShowcase from './components/AvatarShowcase'
import LightningEffects from './components/LightningEffects'
import LoadingScreen from './components/LoadingScreen'
import { useAudioManager } from './hooks/useAudioManager'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSong, setSelectedSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { audioManager } = useAudioManager()

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

  const handleSongSelect = (songId) => {
    console.log(`🎵 Song selected: ${songId}`)
    console.log('🎵 Audio manager available:', !!audioManager)
    console.log('🎵 Current state - selectedSong:', selectedSong, 'isPlaying:', isPlaying)
    
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
          onSongSelect={handleSongSelect} 
          selectedSong={selectedSong}
          isPlaying={isPlaying}
        />
      </div>
      
      {/* Custom Cursor - Disabled for now */}
      {/* <div className="custom-cursor" /> */}
    </div>
  )
}

export default App