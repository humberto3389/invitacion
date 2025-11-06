import { useEffect, useRef } from 'react'

type Snowflake = {
  x: number
  y: number
  r: number
  speedY: number
  driftX: number
  driftPhase: number
  driftSpeed: number
  opacity: number
}

export default function SnowBackground() {
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
      // Recalcular cantidad de copos en función del área
      const desired = Math.min(180, Math.floor((width * height) / 18000))
      if (flakes.length < desired) {
        const toAdd = desired - flakes.length
        for (let i = 0; i < toAdd; i++) flakes.push(createFlake())
      } else if (flakes.length > desired) {
        flakes.length = desired
      }
    }
    window.addEventListener('resize', handleResize)

    const createFlake = (): Snowflake => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.6,
      speedY: 0.3 + Math.random() * 0.9,
      driftX: (Math.random() - 0.5) * 0.3,
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.003 + Math.random() * 0.006,
      opacity: 0.35 + Math.random() * 0.4,
    })

    const desiredCount = Math.min(180, Math.floor((width * height) / 18000))
    const flakes: Snowflake[] = new Array(desiredCount).fill(0).map(createFlake)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i]
        f.driftPhase += f.driftSpeed
        const sway = Math.sin(f.driftPhase) * 0.6
        f.x += f.driftX + sway * 0.05
        f.y += f.speedY

        // Reaparecer por arriba al salir
        if (f.y - f.r > height) {
          f.y = -f.r
          f.x = Math.random() * width
        }
        if (f.x < -10) f.x = width + 10
        if (f.x > width + 10) f.x = -10

        // Copo con pequeño blur y opacidad
        ctx.globalAlpha = f.opacity
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()

        // Halo suave para efecto de brillo nieve
        ctx.globalAlpha = Math.min(0.15, f.opacity * 0.2)
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r * 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

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


