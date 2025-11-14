import { useState, useEffect } from 'react'
import './CyberGuyBackground.css'

function CyberGuyBackground() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [animationDirection, setAnimationDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const frames = ['guy9.jpg', 'guy7.jpg', 'guy8.jpg', 'guy6.jpg']

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentFrame(prev => {
          const nextFrame = prev + animationDirection
          
          // Bounce animation
          if (nextFrame >= frames.length - 1) {
            setAnimationDirection(-1)
            setIsPaused(true)
            setTimeout(() => setIsPaused(false), 2000) // Pause at fully lit
            return frames.length - 1
          } else if (nextFrame <= 0) {
            setAnimationDirection(1)
            return 0
          }
          
          return nextFrame
        })
      }
    }, 800) // Slower, more dramatic timing

    return () => clearInterval(interval)
  }, [animationDirection, isPaused, frames.length])

  const getFrameClass = () => {
    if (currentFrame === 0) return 'dormant'
    if (currentFrame === 1) return 'awakening'
    if (currentFrame === 2) return 'active'
    if (currentFrame === 3) return 'fully-lit'
    return 'dormant'
  }

  return (
    <div 
      className={`cyber-guy-background ${getFrameClass()}`}
      style={{
        backgroundImage: `url(/guy${currentFrame === 0 ? '9' : currentFrame === 1 ? '7' : currentFrame === 2 ? '8' : '6'}.jpg)`
      }}
    />
  )
}

export default CyberGuyBackground
