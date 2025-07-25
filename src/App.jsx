import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Experience from './components/Experience'
import UI from './components/UI'
import { useAudioManager } from './hooks/useAudioManager'
import { CONFIG } from './config/config'

function App() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { audioManager } = useAudioManager()

  useEffect(() => {
    if (audioManager) {
      audioManager.initialize()
    }
  }, [audioManager])

  const handleSongSelect = (songId) => {
    if (audioManager) {
      audioManager.playSong(songId)
      setCurrentSong(songId)
      setIsPlaying(true)
    }
  }

  const handlePlayPause = () => {
    if (audioManager) {
      if (isPlaying) {
        audioManager.pause()
        setIsPlaying(false)
      } else {
        audioManager.play()
        setIsPlaying(true)
      }
    }
  }

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

  return (
    <div className="app">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <color attach="background" args={['#000000']} />
        <Experience 
          currentSong={currentSong} 
          isPlaying={isPlaying} 
          onSongSelect={handleSongSelect}
        />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <Environment preset="night" />
      </Canvas>
      
      {/* Minimal UI - just controls and title */}
      <UI 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
      />
    </div>
  )
}

export default App 