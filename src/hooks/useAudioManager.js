import { useState, useEffect, useRef } from 'react'
import { CONFIG } from '../config/config'

export function useAudioManager() {
  const [audioManager, setAudioManager] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    // Create audio manager instance
    const manager = {
      audio: null,
      currentSong: null,
      isPlaying: false,
      volume: 0.7,

      initialize() {
        this.audio = new Audio()
        this.audio.volume = this.volume
        this.audio.preload = 'auto'
        this.audio.crossOrigin = 'anonymous'
        
        // Set up event listeners
        this.audio.addEventListener('ended', () => {
          this.isPlaying = false
        })
        
        this.audio.addEventListener('error', (e) => {
          console.error('Audio error:', e)
        })
      },

      async playSong(songId) {
        const song = CONFIG.songs.find(s => s.id === songId)
        if (!song) return

        try {
          this.currentSong = song
          this.audio.src = song.audioFile
          await this.audio.play()
          this.isPlaying = true
        } catch (error) {
          console.error('Error playing song:', error)
        }
      },

      async play() {
        if (this.audio && this.currentSong) {
          try {
            await this.audio.play()
            this.isPlaying = true
          } catch (error) {
            console.error('Error playing audio:', error)
          }
        }
      },

      pause() {
        if (this.audio) {
          this.audio.pause()
          this.isPlaying = false
        }
      },

      stop() {
        if (this.audio) {
          this.audio.pause()
          this.audio.currentTime = 0
          this.isPlaying = false
        }
      },

      setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume))
        if (this.audio) {
          this.audio.volume = this.volume
        }
      },

      getCurrentSong() {
        return this.currentSong
      },

      getIsPlaying() {
        return this.isPlaying
      },

      getCurrentTime() {
        return this.audio ? this.audio.currentTime : 0
      },

      getDuration() {
        return this.audio ? this.audio.duration : 0
      },

      seek(time) {
        if (this.audio) {
          this.audio.currentTime = time
        }
      }
    }

    setAudioManager(manager)
    manager.initialize()

    return () => {
      if (manager.audio) {
        manager.audio.pause()
        manager.audio.src = ''
      }
    }
  }, [])

  return { audioManager }
} 