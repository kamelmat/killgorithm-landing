import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// import SyncedLyrics from './SyncedLyrics' // DISABLED FOR NOW - needs timing work
import './MusicPlayer.css'

const SONGS = [
  { id: 'nemos-tears', title: 'Nemo\'s Tears', file: '/audio/nemos-tears.mp3' },
  { id: 'ave-de-presa', title: 'Ave de Presa', file: '/audio/AVE DE PRESA v10.mp3' },
  { id: 'to-hell-and-back', title: 'To Hell & Back', file: '/audio/To Hell & Back To Hel v8.mp3' },
  { id: 'courage', title: 'Courage', file: '/audio/COURAGE MIX AUG 24.mp3' }
]

function MusicPlayer({ 
  selectedSong, 
  isPlaying, 
  onPlay, 
  onPause, 
  onNext, 
  onPrevious, 
  onSeek,
  currentTime = 0,
  duration = 0,
  isVisible = false,
  onMinimizedChange // New prop to notify parent about minimize state
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [localProgress, setLocalProgress] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  // const [showLyrics, setShowLyrics] = useState(false) // DISABLED FOR NOW

  // Notify parent when minimized state changes
  useEffect(() => {
    if (onMinimizedChange) {
      onMinimizedChange(isMinimized)
    }
  }, [isMinimized, onMinimizedChange])

  const currentSongData = SONGS.find(song => song.id === selectedSong)
  const currentIndex = SONGS.findIndex(song => song.id === selectedSong)

  useEffect(() => {
    if (!isDragging && duration > 0) {
      setLocalProgress((currentTime / duration) * 100)
    }
  }, [currentTime, duration, isDragging])

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = (clickX / rect.width) * 100
    const seekTime = (percentage / 100) * duration
    
    setLocalProgress(percentage)
    onSeek(seekTime)
  }

  const handleProgressDrag = (e) => {
    if (!isDragging) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const dragX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (dragX / rect.width) * 100))
    
    setLocalProgress(percentage)
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    handleProgressClick(e)
  }

  const handleMouseUp = () => {
    if (isDragging) {
      const seekTime = (localProgress / 100) * duration
      onSeek(seekTime)
      setIsDragging(false)
    }
  }

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => handleMouseUp()
      const handleGlobalMouseMove = (e) => handleProgressDrag(e)
      
      document.addEventListener('mouseup', handleGlobalMouseUp)
      document.addEventListener('mousemove', handleGlobalMouseMove)
      
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp)
        document.removeEventListener('mousemove', handleGlobalMouseMove)
      }
    }
  }, [isDragging])

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < SONGS.length - 1

  return (
    <AnimatePresence>
      {isVisible && currentSongData && (
        <motion.div
          className={`music-player ${isMinimized ? 'minimized' : ''}`}
          initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            x: '-50%',
            height: isMinimized ? 'auto' : 'auto'
          }}
          exit={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Cyber glow background */}
          <div className="player-glow" />
          
          {/* Hide/Show Toggle Button */}
          <motion.button
            className="minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              rotate: isMinimized ? 180 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="minimize-icon">⌄</span>
          </motion.button>
          
          {/* Main player content */}
          <motion.div 
            className="player-content"
            animate={{
              opacity: isMinimized ? 0 : 1,
              height: isMinimized ? 0 : 'auto'
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Song info */}
            <div className="song-info">
              <motion.h3 
                className="song-title"
                animate={{ 
                  textShadow: isPlaying 
                    ? "0 0 10px rgba(0, 255, 255, 0.8)" 
                    : "0 0 5px rgba(0, 255, 255, 0.4)" 
                }}
              >
                {currentSongData.title}
              </motion.h3>
              <p className="artist-name">KILLGORITHM</p>
            </div>

            {/* Progress bar */}
            <div className="progress-section">
              <span className="time-display">{formatTime(currentTime)}</span>
              
              <div 
                className="progress-container"
                onMouseDown={handleMouseDown}
                onMouseMove={isDragging ? handleProgressDrag : undefined}
              >
                <div className="progress-track">
                  <motion.div 
                    className="progress-fill"
                    style={{ width: `${localProgress}%` }}
                    animate={{
                      boxShadow: isPlaying 
                        ? "0 0 15px rgba(0, 255, 255, 0.8)" 
                        : "0 0 8px rgba(0, 255, 255, 0.4)"
                    }}
                  />
                  <motion.div 
                    className="progress-handle"
                    style={{ left: `${localProgress}%` }}
                    animate={{
                      scale: isDragging ? 1.3 : 1,
                      boxShadow: isPlaying 
                        ? "0 0 20px rgba(0, 255, 255, 1)" 
                        : "0 0 10px rgba(0, 255, 255, 0.6)"
                    }}
                  />
                </div>
              </div>
              
              <span className="time-display">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="player-controls">
              <motion.button
                className={`control-btn ${!canGoPrevious ? 'disabled' : ''}`}
                onClick={canGoPrevious ? onPrevious : undefined}
                whileHover={canGoPrevious ? { scale: 1.1 } : {}}
                whileTap={canGoPrevious ? { scale: 0.95 } : {}}
                disabled={!canGoPrevious}
              >
                <span className="control-icon">⏮</span>
              </motion.button>

              <motion.button
                className="control-btn play-pause-btn"
                onClick={isPlaying ? onPause : onPlay}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: isPlaying 
                    ? "0 0 25px rgba(0, 255, 255, 0.8)" 
                    : "0 0 15px rgba(0, 255, 255, 0.4)"
                }}
              >
                <span className="control-icon">
                  {isPlaying ? '⏸' : '▶'}
                </span>
              </motion.button>

              <motion.button
                className={`control-btn ${!canGoNext ? 'disabled' : ''}`}
                onClick={canGoNext ? onNext : undefined}
                whileHover={canGoNext ? { scale: 1.1 } : {}}
                whileTap={canGoNext ? { scale: 0.95 } : {}}
                disabled={!canGoNext}
              >
                <span className="control-icon">⏭</span>
              </motion.button>

              {/* Lyrics Button - DISABLED FOR NOW */}
              {/* <motion.button
                className={`control-btn lyrics-btn ${showLyrics ? 'active' : ''}`}
                onClick={() => setShowLyrics(!showLyrics)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Show lyrics"
              >
                <span className="control-icon">♫</span>
              </motion.button> */}
            </div>
          </motion.div>

          {/* Animated particles - always visible */}
          <div className="player-particles">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Synced Lyrics Panel - DISABLED FOR NOW */}
      {/* <SyncedLyrics 
        songId={selectedSong}
        currentTime={currentTime}
        isVisible={showLyrics && isVisible}
        onClose={() => setShowLyrics(false)}
      /> */}
    </AnimatePresence>
  )
}

export default MusicPlayer
