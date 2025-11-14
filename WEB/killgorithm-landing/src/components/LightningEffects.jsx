import { useEffect, useRef } from 'react'
import './LightningEffects.css'

function LightningEffects() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        life: Math.random(),
        size: Math.random() * 2 + 0.5
      }))
    }

    initParticles()

    const drawLightning = () => {
      // More regular lightning strikes
      if (Math.random() < 0.025) { // 2.5% chance per frame (more frequent)
        createLightningStrike(ctx, canvas.width, canvas.height)
      }
    }

    const createLightningStrike = (ctx, width, height) => {
      const startX = Math.random() * width
      const startY = 0
      const endX = startX + (Math.random() - 0.5) * 300
      const endY = height * (0.3 + Math.random() * 0.4)

      ctx.strokeStyle = `rgba(0, 255, 255, ${0.4 + Math.random() * 0.6})`
      ctx.lineWidth = 1 + Math.random() * 2
      ctx.shadowBlur = 15
      ctx.shadowColor = '#00ffff'

      ctx.beginPath()
      ctx.moveTo(startX, startY)

      // Create jagged lightning path
      let currentX = startX
      let currentY = startY
      const segments = 6 + Math.random() * 8

      for (let i = 0; i < segments; i++) {
        currentX += (endX - startX) / segments + (Math.random() - 0.5) * 80
        currentY += (endY - startY) / segments + Math.random() * 30
        ctx.lineTo(currentX, currentY)
      }

      ctx.stroke()

      // Add secondary branches
      if (Math.random() < 0.7) {
        ctx.beginPath()
        ctx.moveTo(currentX * 0.7, currentY * 0.7)
        ctx.lineTo(
          currentX + (Math.random() - 0.5) * 150,
          currentY + Math.random() * 100
        )
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 + Math.random() * 0.3})`
        ctx.lineWidth = 0.5 + Math.random()
        ctx.stroke()
      }
    }

    const drawParticles = (ctx) => {
      particlesRef.current.forEach(particle => {
        // Update particle
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.008

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Reset if dead
        if (particle.life <= 0) {
          particle.life = 1
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
        }

        // Draw particle
        const alpha = particle.life * 0.4
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`
        ctx.shadowBlur = 3
        ctx.shadowColor = '#00ffff'

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      drawLightning()
      drawParticles(ctx)
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef}
      className="lightning-canvas"
    />
  )
}

export default LightningEffects
