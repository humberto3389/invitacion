import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  alpha: number
  pulsePhase: number
  pulseSpeed: number
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const particleCount = Math.min(140, Math.floor((width * height) / 18000))
    const particles: Particle[] = new Array(particleCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.18,
      dy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.35 + 0.15,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
    }))

    const linkDistance = 140

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Partículas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.dx
        p.y += p.dy

        // Rebote suave en bordes
        if (p.x <= 0 || p.x >= width) p.dx *= -1
        if (p.y <= 0 || p.y >= height) p.dy *= -1

        // Pulso sutil de opacidad
        p.pulsePhase += p.pulseSpeed
        const pulse = (Math.sin(p.pulsePhase) + 1) * 0.25 // 0..0.5
        const currentAlpha = Math.min(0.6, p.alpha + pulse * 0.35)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        // Tono dorado suave
        ctx.fillStyle = `rgba(200, 170, 80, ${currentAlpha})`
        ctx.fill()

        // Halo sutil para dar brillo
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 170, 80, ${currentAlpha * 0.15})`
        ctx.fill()
      }

      // Líneas sutiles entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < linkDistance) {
            const opacity = (1 - dist / linkDistance) * 0.28
            ctx.strokeStyle = `rgba(200, 170, 80, ${opacity})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}


