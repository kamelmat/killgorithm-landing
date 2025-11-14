import { motion } from 'framer-motion'
import './CyberGuyBackground.css'

function CyberGuyBackground() {

  return (
    <>
      {/* Single 40-second video background */}
      <div className="cyber-guy-video-container">
        <video
          className="cyber-guy-video"
          src="/GUY.mov"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      
      {/* Cosmic overlay for space atmosphere */}
      <div className="cosmic-overlay" />
      
      {/* Breathing effect overlay */}
      <motion.div
        className="breathing-overlay"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.01, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  )
}

export default CyberGuyBackground
