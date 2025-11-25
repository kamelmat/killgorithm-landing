import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SyncedLyrics.css'

// LRC Format: [MM:SS.xx]Lyrics text
// We'll parse this and sync with audio currentTime
const LYRICS_DATA = {
  'ave-de-presa': [
    { time: 0, text: '' },
    { time: 23, text: 'Reina en el abismo y en la oscuridad' },
    { time: 29, text: 'con muy poca luz' },
    { time: 31, text: 'proclama victoria Marduk sobre Tiamat.' },
    { time: 37, text: 'Y heredan los hombres' },
    { time: 40, text: 'su locura su ansia de poder' },
    { time: 43, text: 'y a su imagen y semejanza' },
    { time: 50, text: 'forjan su destino' },
    { time: 52, text: 'sembrando el terror allí donde van.' },
    { time: 55, text: 'y en defensa de la luz, destierran a las diosas, destruyen sus templos y erradican la' },
    { time: 60, text: 'historia de la madre creadora' },
    { time: 70, text: '' },
    { time: 75, text: 'Harta de ver a sus reinas caer, interviene desde el infinito y descarga su poder,' },
    { time: 85, text: 'Para acabar con 5000 años de locura, guerra y hambre, intolerancia y vergüenza' },
    { time: 90, text: '' },
    { time: 95, text: 'Abre sus alas la primer arcangel de violencia de la oscuridad más profunda, única fuente de' },
    { time: 100, text: 'vida y creación Llegó el momento de crear desde la destrucción.' },
    { time: 105, text: '' },
    { time: 107, text: 'Sosteniendo el círculo de vida... abona la tierra con sangre para que las semillas vuelvan a' },
    { time: 109, text: 'brotar.' },
    { time: 110, text: '' },
    { time: 120, text: 'SOY AVE DE PRESA, anima nocturna de la oscuridad.' },
    { time: 125, text: 'Vengo a segar tu alma, y a devolverla a su estado espectral' },
    { time: 130, text: '' },
    { time: 135, text: 'Isis... Atena, Astarté, Shejina, Tiamat,' },
    { time: 140, text: 'Conocida con muchos nombres en la antigüedad... borrada por la infamia vuelve MARIA  en' },
    { time: 145, text: 'forma de Kali,  a restaurar  el orden en el torbellino de almas' },
    { time: 150, text: '' },
    { time: 155, text: 'Invitada a Beber de vuestra sangre para purificar así   vuestro alma' },
    { time: 160, text: 'Ya que Ni siquiera sois dignos de presa, sois carroña terrenal' },
    { time: 165, text: '' },
    { time: 170, text: 'SOY AVE DE PRESA, anima nocturna de la oscuridad.' },
    { time: 180, text: 'Vengo a segar tu alma, y así devolverla a su estado espectral' }
  ]
}

function SyncedLyrics({ songId, currentTime, isVisible, onClose }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const lyricsContainerRef = useRef(null)
  const currentLineRef = useRef(null)

  const lyrics = LYRICS_DATA[songId] || []

  // Update current line based on audio time
  useEffect(() => {
    if (!lyrics.length) return

    // Find the current line based on time
    let lineIndex = 0
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        lineIndex = i
        break
      }
    }

    setCurrentLineIndex(lineIndex)
  }, [currentTime, lyrics])

  // Auto-scroll to current line
  useEffect(() => {
    if (currentLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current
      const line = currentLineRef.current
      
      const containerHeight = container.clientHeight
      const lineTop = line.offsetTop
      const lineHeight = line.clientHeight
      
      // Scroll to keep current line in the middle
      container.scrollTo({
        top: lineTop - (containerHeight / 2) + (lineHeight / 2),
        behavior: 'smooth'
      })
    }
  }, [currentLineIndex])

  if (!lyrics.length) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="synced-lyrics-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="synced-lyrics-panel"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="lyrics-header">
              <h3 className="lyrics-title">Lyrics</h3>
              <button 
                className="lyrics-close"
                onClick={onClose}
                title="Close lyrics"
              >
                ✕
              </button>
            </div>

            {/* Lyrics content */}
            <div className="lyrics-content" ref={lyricsContainerRef}>
              {lyrics.map((line, index) => (
                <motion.div
                  key={index}
                  ref={index === currentLineIndex ? currentLineRef : null}
                  className={`lyrics-line ${index === currentLineIndex ? 'active' : ''} ${index < currentLineIndex ? 'past' : ''}`}
                  animate={{
                    scale: index === currentLineIndex ? 1.05 : 1,
                    opacity: index === currentLineIndex ? 1 : index < currentLineIndex ? 0.4 : 0.6
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {line.text || '\u00A0'}
                </motion.div>
              ))}
            </div>

            {/* Cyber glow effect */}
            <div className="lyrics-glow" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SyncedLyrics

