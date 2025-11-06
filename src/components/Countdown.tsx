import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function getTimeParts(target: Date) {
  const now = new Date().getTime()
  const diff = Math.max(0, target.getTime() - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export default function Countdown({ date }: { date: string }) {
  const target = useMemo(() => new Date(date), [date])
  const [time, setTime] = useState(() => getTimeParts(target))
  const [prevTime, setPrevTime] = useState(time)

  useEffect(() => {
    const id = setInterval(() => {
      setPrevTime(time)
      setTime(getTimeParts(target))
    }, 1000)
    return () => clearInterval(id)
  }, [target, time])

  const items = [
    { label: 'Días', value: time.days, prev: prevTime.days },
    { label: 'Horas', value: time.hours, prev: prevTime.hours },
    { label: 'Minutos', value: time.minutes, prev: prevTime.minutes },
    { label: 'Segundos', value: time.seconds, prev: prevTime.seconds },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Título con animación */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-neutral-500 font-brush text-lg">Para nuestro día especial</p>
        <div className="mx-auto mt-4 h-1 w-16 bg-gradient-to-r from-gold/70 to-rose-400/70 rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
        {items.map((it, index) => (
          <motion.div 
            key={it.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            {/* Efecto de brillo al pasar el mouse */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md group-hover:blur-lg"></div>
            
            {/* Tarjeta principal optimizada */}
            <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
              
              {/* Contenedor del número con animación */}
              <div className="h-16 sm:h-20 flex items-center justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={it.value}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-800 tabular-nums font-brush absolute"
                  >
                    {String(it.value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              {/* Etiqueta con animación */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-neutral-600 text-xs sm:text-sm font-medium mt-2 sm:mt-3 tracking-wider uppercase font-brush"
              >
                {it.label}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mensaje inspirador con animación */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center mt-12"
      >
        <p className="text-neutral-500 italic font-light font-brush text-base sm:text-lg">
          "Cada segundo nos acerca a nuestro eterno comienzo"
        </p>
      </motion.div>
    </div>
  )
}