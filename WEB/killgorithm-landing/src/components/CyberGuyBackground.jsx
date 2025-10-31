import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './CyberGuyBackground.css'

const GUY_IMAGES = [
  '/guy9.jpg', // Dormant - eyes closed
  '/guy7.jpg', // Awakening - eyes beginning to glow
  '/guy8.jpg', // Active - eyes bright
  '/guy6.jpg'  // Fully lit - blazing eyes
]

const GUY_STATES = ['dormant', 'awakening', 'active', 'fully-lit']

function CyberGuyBackground() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    console.log('👤 Cyber Guy Background initialized')
    
    const interval = setInterval(() => {
      if (isPaused) {
        // End pause and start going backwards
        setTimeout(() => {
          setIsPaused(false)
          setDirection(-1)
        }, 2000)
        return
      }

      setCurrentFrame(prev => {
        const next = prev + direction
        
        // Forward sequence
        if (direction === 1 && next >= GUY_IMAGES.length) {
          setIsPaused(true)
          return prev // Stay at fully lit
        }
        
        // Reverse sequence
        if (direction === -1 && next < 0) {
          setDirection(1)
          return 0 // Back to dormant
        }
        
        console.log(`👤⚡ Guy state: ${GUY_STATES[next]}`)
        return next
      })
    }, 3500) // 3.5 seconds per frame

    return () => clearInterval(interval)
  }, [direction, isPaused])

  return (
    <>
      {/* Main guy background */}
      <motion.div
        className={`cyber-guy-background ${GUY_STATES[currentFrame]}`}
        style={{
          backgroundImage: `url(${GUY_IMAGES[currentFrame]})`
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Cosmic overlay */}
      <div className="cosmic-overlay" />
      
      {/* Breathing effect overlay */}
      <motion.div
        className="breathing-overlay"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  )
}

export default CyberGuyBackground
