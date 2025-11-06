import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'

export default function BackgroundAudio({ src }: { src: string }) {
  const soundRef = useRef<Howl | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [needsUnlock, setNeedsUnlock] = useState(false)
  const soundIdRef = useRef<number | null>(null) // Referencia para el ID del sonido

  useEffect(() => {
    // Crear instancia: empezar silenciado e intentar autoplay
    soundRef.current = new Howl({ 
      src: [src], 
      loop: true, 
      volume: 0, 
      html5: true, 
      preload: false, // Cambiar a false para cargar solo cuando sea necesario
      onplay: (id) => {
        soundIdRef.current = id // Guardar el ID del sonido
        setIsPlaying(true)
        setNeedsUnlock(false)
        // Aplicar fade-in al ID específico del sonido
        if (soundRef.current && soundIdRef.current !== null) {
          // Desmutear antes del fade-in para navegadores que permiten unmute tras autoplay
          soundRef.current.mute(false)
          soundRef.current.fade(0, 0.5, 1500, soundIdRef.current)
        }
      }
    })

    // Forzar mute inicial para cumplir políticas de autoplay
    try {
      soundRef.current.mute(true)
    } catch {}

    const tryAutoPlay = async () => {
      try {
        if (!soundRef.current) return
        if (!soundRef.current.playing()) {
          soundRef.current.play()
        }
        // Comprobar tras un breve tiempo si realmente está reproduciendo
        setTimeout(() => {
          if (!soundRef.current) return
          const actuallyPlaying = soundRef.current.playing()
          if (!actuallyPlaying) {
            setNeedsUnlock(true)
          }
        }, 500)
        // Si logra reproducir, el onplay hará unmute + fade automáticamente
      } catch {
        // Bloqueado por política de autoplay
        setNeedsUnlock(true)
      }
    }

    // Intento inmediato
    void tryAutoPlay()

    // Desbloquear en primera interacción
    const unlock = () => { 
      // En el primer gesto del usuario, desmutear y hacer fade-in inmediatamente
      try {
        if (soundRef.current) {
          if (!soundRef.current.playing()) {
            soundRef.current.play()
          }
          soundRef.current.mute(false)
          if (soundIdRef.current !== null) {
            soundRef.current.fade(0, 0.5, 1000, soundIdRef.current)
          }
        }
      } catch {}
      removeListeners() 
    }
    
    const addListeners = () => {
      const opts: AddEventListenerOptions = { once: true }
      window.addEventListener('pointerdown', unlock, opts)
      window.addEventListener('click', unlock, opts)
      window.addEventListener('keydown', unlock, opts)
      window.addEventListener('scroll', unlock, opts)
      window.addEventListener('wheel', unlock, opts)
      window.addEventListener('mousemove', unlock, opts)
      window.addEventListener('touchstart', unlock, opts)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') unlock()
      }, { once: true })
    }
    
    const removeListeners = () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('scroll', unlock)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('mousemove', unlock)
      window.removeEventListener('touchstart', unlock)
      // visibilitychange listener fue once: true, no es necesario remover manualmente
    }
    
    addListeners()

    return () => {
      removeListeners()
      soundRef.current?.unload()
    }
  }, [src])

  const toggle = () => {
    if (!soundRef.current) return
    
    if (soundRef.current.playing()) {
      // Aplicar fade-out antes de pausar
      if (soundIdRef.current !== null) {
        soundRef.current.fade(soundRef.current.volume(), 0, 1000, soundIdRef.current)
        setTimeout(() => {
          soundRef.current?.pause()
          setIsPlaying(false)
        }, 1000)
      } else {
        soundRef.current.pause()
        setIsPlaying(false)
      }
    } else {
      // No mostrar opción de reproducir manualmente si no fue bloqueado
      // Solo se dará en el caso de desbloqueo manual
      soundRef.current.mute(false)
      soundRef.current.play()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {needsUnlock && (
        <button
          onClick={toggle}
          className="group relative bg-gold/90 backdrop-blur-md hover:bg-gold text-neutral-900 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gold-light/50"
          title="Activar música de fondo"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          
          {/* Ondas de sonido animadas */}
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
            <div className="w-1 h-1 bg-gold-dark rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="w-1 h-2 bg-gold-dark rounded-full animate-ping absolute top-0" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-1 bg-gold-dark rounded-full animate-ping absolute top-2" style={{animationDelay: '0.4s'}}></div>
          </div>
        </button>
      )}
      {isPlaying && (
        <button
          onClick={toggle}
          className="group relative bg-neutral-900/90 backdrop-blur-md hover:bg-neutral-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20"
          title="Pausar música"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          
          {/* Indicador de reproducción */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
        </button>
      )}
    </div>
  )
}