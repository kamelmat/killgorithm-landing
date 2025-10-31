import { motion } from 'framer-motion'
import './KillgorithmTitle.css'

function KillgorithmTitle() {
  return (
    <motion.div 
      className="killgorithm-title"
      initial={{ 
        opacity: 0, 
        scale: 0.5, 
        rotateY: 90,
        y: -100
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: 0,
        y: 0
      }}
      transition={{ 
        duration: 2, 
        ease: "easeOut",
        delay: 0.5
      }}
    >
      <motion.img
        src="/kill.png"
        alt="KILLGORITHM"
        className="title-image"
        whileHover={{ 
          scale: 1.05,
          filter: "brightness(1.3) drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))"
        }}
        animate={{
          scale: [1, 1.1, 1],
          filter: [
            "brightness(1.2) drop-shadow(0 0 20px rgba(255, 0, 0, 0.5))",
            "brightness(1.6) drop-shadow(0 0 50px rgba(255, 0, 0, 1.0))",
            "brightness(1.2) drop-shadow(0 0 20px rgba(255, 0, 0, 0.5))"
          ]
        }}
        transition={{
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          filter: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
      
      {/* Glow effects */}
      <motion.div
        className="title-glow"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="title-sparks"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  )
}

export default KillgorithmTitle
