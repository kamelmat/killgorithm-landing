import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './YouTubePlayer.css'

function YouTubePlayer({ 
  videoId, 
  isVisible = false, 
  onClose, 
  songTitle = "Video",
  onAudioOnlyMode = null 
}) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Extract video ID from full YouTube URL if needed
  const extractVideoId = (url) => {
    if (!url) return null
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : url
  }

  const cleanVideoId = extractVideoId(videoId) || videoId

  const handleFullscreen = () => {
    const iframe = document.querySelector('.youtube-iframe')
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen()
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen()
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen()
      }
    }
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (!isMinimized && onAudioOnlyMode) {
      onAudioOnlyMode(true) // Switch to audio-only mode
    } else if (isMinimized && onAudioOnlyMode) {
      onAudioOnlyMode(false) // Switch back to video mode
    }
  }

  const handleWatchOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${cleanVideoId}`, '_blank')
  }

  if (!isVisible || !cleanVideoId) return null

  return (
    <AnimatePresence>
      <motion.div
        className={`youtube-player ${isMinimized ? 'minimized' : ''}`}
        initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: '-50%',
          y: isMinimized ? '50%' : '-50%'
        }}
        exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Video Player Header */}
        <div className="video-header">
          <div className="video-title">
            <h3>{songTitle}</h3>
            <span className="video-subtitle">KILLGORITHM</span>
          </div>
          
          <div className="video-controls">
            <button 
              className="video-btn minimize-btn"
              onClick={handleMinimize}
              title={isMinimized ? "Show Video" : "Audio Only"}
            >
              {isMinimized ? '🎬' : '🎵'}
            </button>
            
            <button 
              className="video-btn fullscreen-btn"
              onClick={handleFullscreen}
              title="Fullscreen"
              disabled={isMinimized}
            >
              ⛶
            </button>
            
            <button 
              className="video-btn youtube-btn"
              onClick={handleWatchOnYouTube}
              title="Watch on YouTube"
            >
              📺
            </button>
            
            <button 
              className="video-btn close-btn"
              onClick={onClose}
              title="Close Video"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Container */}
        <motion.div 
          className="video-container"
          animate={{
            height: isMinimized ? 0 : 'auto',
            opacity: isMinimized ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="video-wrapper">
            <iframe
              className="youtube-iframe"
              src={`https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&rel=0&modestbranding=1`}
              title={songTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Minimized State Info */}
        {isMinimized && (
          <motion.div 
            className="minimized-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="audio-indicator">🎵 Audio Only</span>
            <span className="expand-hint">Click 🎬 to show video</span>
          </motion.div>
        )}

        {/* Cyber glow effect */}
        <div className="video-glow" />
      </motion.div>
    </AnimatePresence>
  )
}

export default YouTubePlayer
