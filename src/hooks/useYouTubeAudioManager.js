import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * YouTube Audio Manager
 * Uses YouTube iframe API to stream audio from YouTube videos
 * Provides the same interface as useAudioManager but streams from YouTube
 */

const SONGS = [
  { 
    id: 'nemos-tears', 
    title: 'Nemo\'s Tears', 
    youtubeId: '_VLUMbKa7cw' // Audio-only version
  },
  { 
    id: 'ave-de-presa', 
    title: 'Ave de Presa', 
    youtubeId: 'X3_X_IfIpc4'
  },
  { 
    id: 'to-hell-and-back', 
    title: 'To Hell & Back', 
    youtubeId: '55Jgo4beKOY'
  },
  { 
    id: 'courage', 
    title: 'Courage', 
    youtubeId: 'noSKRn79-18'
  }
]

// Load YouTube iframe API script
const loadYouTubeAPI = () => {
  return new Promise((resolve, reject) => {
    console.log('🎵📦 Checking if YouTube API already loaded...')
    
    if (window.YT && window.YT.Player) {
      console.log('🎵✅ YouTube API already available')
      resolve()
      return
    }

    console.log('🎵📥 YouTube API not loaded, loading script...')
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]')
    if (existingScript) {
      console.log('🎵⏳ Script tag exists, waiting for API...')
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval)
          console.log('🎵✅ YouTube API ready')
          resolve()
        }
      }, 100)
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('YouTube API load timeout'))
      }, 10000)
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    
    tag.onerror = () => {
      console.error('🎵❌ Failed to load YouTube iframe API script')
      reject(new Error('Failed to load YouTube API'))
    }
    
    window.onYouTubeIframeAPIReady = () => {
      console.log('🎵✅ YouTube iframe API ready callback fired!')
      resolve()
    }
    
    console.log('🎵📤 Appending YouTube API script to head...')
    document.head.appendChild(tag)
  })
}

// Export as useAudioManager to keep the same interface
export function useAudioManager() {
  const [audioManager, setAudioManager] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerVisible, setPlayerVisible] = useState(false)
  const playerRef = useRef(null)
  const intervalRef = useRef(null)
  const playerDivRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const initManager = async () => {
      try {
        await loadYouTubeAPI()

        if (!mounted) return

        // Create styled YouTube player with cover art
        const playerDiv = document.createElement('div')
        playerDiv.id = 'youtube-audio-player'
        
        // Style the player - bottom right, styled nicely
        playerDiv.style.position = 'fixed'
        playerDiv.style.bottom = '20px'
        playerDiv.style.right = '20px'
        playerDiv.style.width = '320px'
        playerDiv.style.height = '180px'
        playerDiv.style.zIndex = '9999' // Super high for debugging - change to 60 later
        playerDiv.style.border = '3px solid cyan' // More visible for debugging
        playerDiv.style.borderRadius = '15px'
        playerDiv.style.overflow = 'hidden'
        playerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)' // Background for visibility
        playerDiv.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 255, 255, 0.2)'
        playerDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        
        // Start HIDDEN - will be shown when music plays
        playerDiv.style.opacity = '0'
        playerDiv.style.pointerEvents = 'none'
        playerDiv.style.transform = 'scale(0.95)'
        playerDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        
        document.body.appendChild(playerDiv)
        playerDivRef.current = playerDiv

      const manager = {
        player: null,
        currentSong: null,
        isPlaying: false,
        volume: 0.7,
        isReady: false,
        pendingSong: null,

        initialize() {
          this.player = new window.YT.Player('youtube-audio-player', {
            height: '0',
            width: '0',
            videoId: SONGS[0].youtubeId, // Load first video to initialize
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              enablejsapi: 1
            },
            events: {
              onReady: (event) => {
                console.log('🎵✅ YouTube player ready!')
                this.isReady = true
                this.player.setVolume(this.volume * 100)
                
                // If there was a pending song request, play it now
                if (this.pendingSong) {
                  console.log('🎵🎶 Playing pending song:', this.pendingSong)
                  this.playSong(this.pendingSong)
                  this.pendingSong = null
                }
              },
              onStateChange: (event) => {
                // YT.PlayerState: ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
                const div = playerDivRef.current || document.getElementById('youtube-audio-player')
                
                if (event.data === 1) {
                  // PLAYING - show player
                  this.isPlaying = true
                  if (div) {
                    div.style.opacity = '1'
                    div.style.transform = 'scale(1)'
                    div.style.pointerEvents = 'auto'
                  }
                } else if (event.data === 2) {
                  // PAUSED - hide player
                  this.isPlaying = false
                  if (div) {
                    div.style.opacity = '0'
                    div.style.transform = 'scale(0.95)'
                    div.style.pointerEvents = 'none'
                  }
                } else if (event.data === 0) {
                  // ENDED - hide and play next
                  this.isPlaying = false
                  if (div) {
                    div.style.opacity = '0'
                    div.style.transform = 'scale(0.95)'
                    div.style.pointerEvents = 'none'
                  }
                  this.playNext()
                }
              },
              onError: (event) => {
                console.error('🎵❌ YouTube player error code:', event.data)
                console.error('🎵❌ Error details:', {
                  2: 'Invalid video ID',
                  5: 'HTML5 player error',
                  100: 'Video not found or private',
                  101: 'Video owner does not allow embedding',
                  150: 'Video owner does not allow embedding'
                }[event.data] || 'Unknown error')
              }
            }
          })

          playerRef.current = this.player

          // Start time update interval
          intervalRef.current = setInterval(() => {
            if (this.player && this.player.getCurrentTime) {
              const time = this.player.getCurrentTime()
              const dur = this.player.getDuration()
              
              setCurrentTime(time)
              setDuration(dur)
            }
          }, 100)

          console.log('🎵🔧 YouTube Audio Manager initialized')
        },

        async playSong(songId) {
          try {
            console.log('🎵🔊 playSong called for:', songId)
            
            const song = SONGS.find(s => s.id === songId)
            if (!song) {
              console.error('🎵❌ Song not found:', songId)
              return
            }

            console.log('🎵📀 Found song:', song.title, 'YouTube ID:', song.youtubeId)

            // Check if player is ready
            if (!this.isReady || !this.player || !this.player.loadVideoById) {
              console.warn('🎵⏳ Player not ready yet, queuing song:', songId)
              this.pendingSong = songId
              return
            }

            this.currentSong = songId

            console.log('🎵🎬 Loading YouTube video:', song.youtubeId)
            this.player.loadVideoById({
              videoId: song.youtubeId,
              startSeconds: 0
            })
            
            // Small delay to ensure video is loaded
            setTimeout(() => {
              if (this.player && this.player.playVideo) {
                console.log('🎵▶️ Calling playVideo()')
                this.player.playVideo()
              }
            }, 500)
            
            this.isPlaying = true
            console.log('🎵✅ Song loaded and playing:', song.title)
          } catch (error) {
            console.error('🎵❌ Error in playSong:', error)
          }
        },

        async play() {
          console.log('🎵▶️ play() called, isReady:', this.isReady)
          
          if (!this.isReady) {
            console.warn('🎵⏳ Player not ready yet')
            return
          }
          
          if (this.player && this.player.playVideo) {
            console.log('🎵▶️ Calling YouTube playVideo()')
            try {
              this.player.playVideo()
              this.isPlaying = true
              console.log('🎵✅ playVideo() executed')
            } catch (error) {
              console.error('🎵❌ Error calling playVideo:', error)
            }
          } else {
            console.error('🎵❌ Player or playVideo not available')
          }
        },

        pause() {
          if (this.player && this.player.pauseVideo) {
            this.player.pauseVideo()
            this.isPlaying = false
          }
        },

        stop() {
          if (this.player && this.player.stopVideo) {
            this.player.stopVideo()
            this.isPlaying = false
          }
        },

        setVolume(volume) {
          this.volume = volume
          if (this.player && this.player.setVolume) {
            this.player.setVolume(volume * 100)
          }
        },

        getIsPlaying() {
          return this.isPlaying
        },

        getCurrentTime() {
          return this.player?.getCurrentTime() || 0
        },

        getDuration() {
          return this.player?.getDuration() || 0
        },

        seek(time) {
          if (this.player && this.player.seekTo) {
            this.player.seekTo(time, true)
          }
        },

        playNext() {
          const currentIndex = SONGS.findIndex(song => song.id === this.currentSong)
          if (currentIndex < SONGS.length - 1) {
            const nextSong = SONGS[currentIndex + 1]
            console.log('🎵⏭ Auto-advancing to:', nextSong.title)
            this.playSong(nextSong.id)
            return nextSong.id
          }
          return null
        },

        playPrevious() {
          const currentIndex = SONGS.findIndex(song => song.id === this.currentSong)
          if (currentIndex > 0) {
            const prevSong = SONGS[currentIndex - 1]
            console.log('🎵⏮ Going to:', prevSong.title)
            this.playSong(prevSong.id)
            return prevSong.id
          }
          return null
        },

        destroy() {
          if (this.player && this.player.destroy) {
            this.player.destroy()
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          const playerDiv = document.getElementById('youtube-audio-player')
          if (playerDiv) {
            playerDiv.remove()
          }
        }
      }

      console.log('🎵✅ Calling manager.initialize()...')
      manager.initialize()
      console.log('🎵✅ Setting audio manager in state...')
      setAudioManager(manager)
      console.log('🎵✅ Audio Manager set in state! PlayerDiv ref:', !!playerDivRef.current)
      
      } catch (error) {
        console.error('🎵❌ Error initializing YouTube Audio Manager:', error)
      }
    }

    initManager().catch(err => {
      console.error('🎵❌ Fatal error in initManager:', err)
    })

    return () => {
      mounted = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (playerRef.current && audioManager) {
        audioManager.destroy()
      }
    }
  }, [])

  // Update player visibility based on state
  useEffect(() => {
    console.log('🎯 Hook useEffect: playerVisible changed to:', playerVisible)
    // Wait a tick for div to be available
    const updateVisibility = () => {
      const div = playerDivRef.current || document.getElementById('youtube-audio-player')
      
      if (div) {
        console.log('🎯 Hook: Div found, applying visibility:', playerVisible ? 'SHOW' : 'HIDE')
        if (playerVisible) {
          div.style.opacity = '1'
          div.style.transform = 'scale(1)'
          div.style.pointerEvents = 'auto'
        } else {
          div.style.opacity = '0'
          div.style.transform = 'scale(0.95)'
          div.style.pointerEvents = 'none'
        }
        
        // Update ref if we found it via DOM
        if (!playerDivRef.current) {
          playerDivRef.current = div
        }
      } else {
        console.log('🎯 Hook: Div NOT found, retrying...')
        // Retry in case div is being created
        setTimeout(updateVisibility, 100)
      }
    }
    
    updateVisibility()
  }, [playerVisible])

  // Stable callback to update visibility
  const updatePlayerVisibilityStable = useCallback((visible) => {
    console.log('🎯 Hook: setPlayerVisible called with:', visible)
    setPlayerVisible(visible)
  }, [])

  return { audioManager, currentTime, duration, updatePlayerVisibility: updatePlayerVisibilityStable }
}

