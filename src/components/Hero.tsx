export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center" aria-label="Hero">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/boda.jpg"
          className="h-full w-full object-cover scale-105"
          alt="Imagen de boda"
          loading="eager"
        />
        {/* Overlay mejorado */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/10 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
      </div>

      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Contenido principal - CENTRADO */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-2xl mx-auto w-full">
          
          {/* Etiqueta superior */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-xs sm:text-sm font-light tracking-[0.2em] uppercase text-white/90">
                Nos Casamos
              </span>
            </div>
          </div>
          
          {/* Nombres de los novios - TAMAÑOS MÁS PEQUEÑOS */}
          <div className="mb-6 sm:mb-8">
            <h1 className="relative">
              <span className="block font-brush text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-2 drop-shadow-lg">
                Humberto
              </span>
              
              {/* Símbolo & */}
              <div className="relative flex items-center justify-center my-3 sm:my-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
                </div>
                <span className="relative bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-gold text-2xl sm:text-3xl md:text-4xl font-brush">
                  &
                </span>
              </div>
              
              <span className="block font-brush text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mt-2 drop-shadow-lg">
                Nelida
              </span>
            </h1>
          </div>
          
          {/* Información de la boda */}
          <div className="mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm font-light tracking-[0.15em] uppercase text-white/80 mb-3">
              Boda Cristiana ✝
            </p>
            
            {/* Línea decorativa */}
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-1.5 h-1.5 bg-gold/60 rounded-full"></div>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-gold/60 via-gold to-gold/60"></div>
              <div className="w-1.5 h-1.5 bg-gold/60 rounded-full"></div>
            </div>
            
            <p className="text-sm sm:text-base md:text-lg font-light text-white/95">
              Sábado, 24 de Enero 2026
            </p>
            <p className="text-sm text-gold font-light mt-1">
              6:00 PM
            </p>
          </div>
          
          {/* Cita bíblica */}
          <div className="mb-6 sm:mb-8 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute -top-2 -left-2 text-gold/30 text-lg">"</div>
              <p className="text-xs sm:text-sm font-light italic text-white/85 leading-relaxed px-4">
                El amor es paciente, es bondadoso… el amor nunca deja de ser.
              </p>
              <div className="absolute -bottom-2 -right-2 text-gold/30 text-lg">"</div>
            </div>
            <p className="text-xs text-gold/80 font-light mt-2">
              — 1 Corintios 13
            </p>
          </div>
          
          {/* Invitación */}
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base font-light text-white/90 max-w-md mx-auto leading-relaxed">
              Están cordialmente invitados a celebrar con nosotros este día tan especial.
            </p>
          </div>
          
          {/* Botones */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a 
              href="#rsvp" 
              className="group relative inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-gold to-amber-500 text-black font-medium text-sm shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Confirmar Asistencia</span>
            </a>
            
            <a 
              href="#galeria" 
              className="group inline-flex items-center px-6 py-3 rounded-full border border-white/30 text-white font-medium text-sm backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <span>Ver Galería</span>
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center text-white/60 animate-bounce">
          <span className="text-xs font-light mb-2">Desliza</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

    </section>
  )
}