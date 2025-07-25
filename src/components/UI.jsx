import React from 'react'
import './UI.css'

function UI({ currentSong, isPlaying, onPlayPause }) {
  return (
    <div className="ui-overlay">
      {/* Title */}
      <div className="title">
        <h1 className="main-title">KILLGORITHM</h1>
        <p className="subtitle">THRASH METAL IMMERSION</p>
      </div>
      
      {/* Controls - only show when a song is selected */}
      {currentSong && (
        <div className="controls">
          <button 
            className="control-btn play-pause"
            onClick={onPlayPause}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <div className="song-display">
            <h2>{currentSong}</h2>
            <p>KILLGORITHM</p>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="instructions">
        <p>CLICK THE AVATARS TO START SONGS</p>
      </div>
    </div>
  )
}

export default UI 