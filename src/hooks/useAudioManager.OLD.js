import { useState, useEffect, useRef } from 'react'

const SONGS = [
  { id: 'nemos-tears', title: 'Nemo\'s Tears', file: '/audio/nemos-tears.mp3' },
  { id: 'ave-de-presa', title: 'Ave de Presa', file: '/audio/AVE DE PRESA v10.mp3' },
  { id: 'to-hell-and-back', title: 'To Hell & Back', file: '/audio/To Hell & Back To Hel v8.mp3' },
  { id: 'courage', title: 'Courage', file: '/audio/COURAGE MIX AUG 24.mp3' }
]

export function useAudioManager() {
  const [audioManager, setAudioManager] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
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
          // Auto-advance to next song
          this.playNext()
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
        
        this.audio.addEventListener('timeupdate', () => {
          setCurrentTime(this.audio.currentTime)
        })
        
        this.audio.addEventListener('durationchange', () => {
          setDuration(this.audio.duration)
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
      },

      seek(time) {
        if (this.audio) {
          this.audio.currentTime = time
        }
      },

      playNext() {
        const currentIndex = SONGS.findIndex(song => song.id === this.currentSong)
        if (currentIndex < SONGS.length - 1) {
          const nextSong = SONGS[currentIndex + 1]
          console.log('🎵⏭ Auto-advancing to next song:', nextSong.title)
          this.playSong(nextSong.id, nextSong.file)
          return nextSong.id
        }
        return null
      },

      playPrevious() {
        const currentIndex = SONGS.findIndex(song => song.id === this.currentSong)
        if (currentIndex > 0) {
          const prevSong = SONGS[currentIndex - 1]
          console.log('🎵⏮ Going to previous song:', prevSong.title)
          this.playSong(prevSong.id, prevSong.file)
          return prevSong.id
        }
        return null
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

  return { audioManager, currentTime, duration }
}
