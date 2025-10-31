import { useState, useEffect, useRef } from 'react'

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
        console.log('🎵🔧 AudioManager initializing...')
        this.audio = new Audio()
        this.audio.volume = this.volume
        this.audio.preload = 'auto'
        this.audio.crossOrigin = 'anonymous'
        
        console.log('🎵🔧 Audio object created:', this.audio)
        
        // Set up event listeners
        this.audio.addEventListener('ended', () => {
          console.log('🎵🔚 Audio ended')
          this.isPlaying = false
        })
        
        this.audio.addEventListener('error', (e) => {
          console.error('🎵❌ Audio error:', e)
        })
        
        this.audio.addEventListener('loadstart', () => {
          console.log('🎵📥 Audio load started')
        })
        
        this.audio.addEventListener('canplay', () => {
          console.log('🎵✅ Audio can play')
        })
        
        console.log('🎵🔧 AudioManager initialized successfully')
      },

      async playSong(songId, audioFile) {
        try {
          console.log('🎵🔊 AudioManager.playSong called - songId:', songId, 'audioFile:', audioFile)
          console.log('🎵🔊 Audio object exists:', !!this.audio)
          
          this.currentSong = songId
          this.audio.src = audioFile
          
          console.log('🎵🔊 Audio src set, attempting to play...')
          await this.audio.play()
          this.isPlaying = true
          
          console.log('🎵🔊 SUCCESS! Audio is now playing. isPlaying:', this.isPlaying)
        } catch (error) {
          console.error('🎵❌ Error playing song:', error)
          console.error('🎵❌ Error details:', {
            name: error.name,
            message: error.message,
            code: error.code
          })
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
        this.volume = volume
        if (this.audio) {
          this.audio.volume = volume
        }
      },

      getIsPlaying() {
        return this.isPlaying && this.audio && !this.audio.paused
      },

      getCurrentTime() {
        return this.audio ? this.audio.currentTime : 0
      },

      getDuration() {
        return this.audio ? this.audio.duration : 0
      }
    }

    manager.initialize()
    setAudioManager(manager)
    audioRef.current = manager

    return () => {
      if (audioRef.current && audioRef.current.audio) {
        audioRef.current.audio.pause()
        audioRef.current.audio = null
      }
    }
  }, [])

  return { audioManager }
}
