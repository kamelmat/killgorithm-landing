import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './KillgorithmLegend.css'

function KillgorithmLegend() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleLegend = () => {
    setIsOpen(!isOpen)
  }

  const closeLegend = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Info Icon - Always visible */}
      <motion.button
        className="legend-icon"
        onClick={toggleLegend}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="About Killgorithm"
      >
        <motion.div
          className="icon-symbol"
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.2 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          ℹ
        </motion.div>
        
        {/* Pulsing glow effect */}
        <motion.div
          className="icon-glow"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Legend Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="legend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLegend}
          >
            <motion.div
              className="legend-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Header */}
              <div className="legend-header">
                <h2 className="legend-title">KILLGORITHM</h2>
                <button 
                  className="legend-close"
                  onClick={closeLegend}
                  title="Close"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="legend-content">
                <div className="legend-text">
                  <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>KILLGORITHM — Manifesto</h3>
                  
                  <p>Killgorithm is not nostalgia.</p>
                  
                  <p>It's not a brand.</p>
                  
                  <p>It's the rupture point — where distortion becomes philosophy and rhythm becomes revolt.</p>
                  
                  <p>Born from the sharp precision of 90s Thrash and the weight of seven strings tuned to the underworld, Killgorithm carries the spirit of the era when technique mattered, when riffs meant something, when music demanded both brains and blood.</p>
                  
                  <p>But the name… the name comes from somewhere darker.</p>
                  
                  <p>Killgorithm is the sickness of the age we live in —<br/>
                  the algorithmic fog that rewards stupidity over substance,<br/>
                  noise over meaning,<br/>
                  clicks over virtue.</p>
                  
                  <p>A culture where the mediocre thrive not by merit, but by accident of virality.<br/>
                  Where truth dissolves in the shallow pool of manufactured relevance.<br/>
                  Where the wolves feed, not because they're evil, but because the sheep have forgotten what strength looks like.</p>
                  
                  <p>There is no villain here.<br/>
                  Only ignorance, greed, and the slow erosion of everything we once fought to build —<br/>
                  our values, our models of excellence, our sense of what it means to grow, to strive, to become.</p>
                  
                  <p>Killgorithm is the scream against that decay.<br/>
                  A refusal.<br/>
                  A sharpened edge.<br/>
                  A reminder that destruction, like Kali, can also be creation —<br/>
                  a clearing of the dead wood so something true can rise again.</p>
                  
                  <p>This music is anger with roots in compassion.<br/>
                  Violence born from love.<br/>
                  A war cry for clarity in a world drowning in static.</p>
                  
                  <p>Written, composed, and produced by Matt Kamelman,<br/>
                  Killgorithm is technically complete — crafted with intent, precision, and relentless honesty.<br/>
                  But it's also humanly unfinished — a living organism becoming a band, a voice, a force.</p>
                  
                  <p>This is Thrash not as a genre,<br/>
                  but as a philosophy.<br/>
                  A ritual.<br/>
                  A reconstruction of meaning through distortion.</p>
                  
                  <p className="legend-signature">
                    If it resonates with you,<br/>
                    you already know why.
                  </p>
                  
                  <p style={{ marginTop: '3rem', textAlign: 'center', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Feel like reaching out?<br/>
                    <a href="mailto:killgorithm666@gmail.com" style={{ color: '#00ffff', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      killgorithm666@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Cyber glow effect */}
              <div className="legend-glow" />
              
              {/* Animated particles */}
              <div className="legend-particles">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="legend-particle"
                    animate={{
                      y: [-20, -40, -20],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 3 + i * 0.2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                    style={{
                      left: `${10 + i * 11}%`,
                      bottom: '10px'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default KillgorithmLegend
