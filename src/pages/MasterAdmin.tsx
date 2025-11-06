import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SYSTEM_CONFIG } from '../lib/config';
import ContactForm from '../components/ContactForm';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '584121234567';
const WHATSAPP_MESSAGE = 'Hola! Me interesa contratar un sitio web para mi boda. Podrian brindarme mas informacion sobre los planes disponibles?';

// Componente de partículas de nieve
const SnowParticle = ({ index }: { index: number }) => {
  // 40% de probabilidad de ser una partícula grande y brillante
  const isLarge = Math.random() < 0.4;
  // Partículas más grandes en general
  const size = isLarge ? Math.random() * 6 + 4 : Math.random() * 4 + 2;
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  // Movimiento más lento para mejor visibilidad
  const duration = Math.random() * 5 + (isLarge ? 10 : 7);
  const delay = Math.random() * -10;
  const swayAmount = Math.random() * 40 + (isLarge ? 25 : 15);
  // Más brillo y opacidad para todas las partículas
  const opacity = isLarge ? 1 : Math.random() * 0.3 + 0.7;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        boxShadow: isLarge 
          ? '0 0 15px 2px rgba(255, 255, 255, 0.9), 0 0 5px rgba(255, 215, 0, 0.5)'
          : '0 0 10px rgba(255, 255, 255, 0.7), 0 0 3px rgba(255, 215, 0, 0.3)',
        left: `${startX}%`,
        top: `${startY}%`,
        filter: `blur(${isLarge ? 0.3 : 0.7}px)`,
        zIndex: Math.round(size),
      }}
      animate={{
        y: [`${startY}%`, `${startY + 200}%`],
        x: [0, swayAmount, -swayAmount, 0],
        scale: isLarge ? [1, 1.2, 1] : [1, 1.1, 1],
      }}
      transition={{
        y: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: delay,
        },
        x: {
          duration: duration * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        }
      }}
    />
  );
};

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'deluxe' | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Al iniciar la aplicación, asegurarse de que esté en modo claro
    setIsDark(false);
    localStorage.setItem('site-dark', '0');
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('site-dark', next ? '1' : '0');
      return next;
    });
  };

  const getWhatsAppUrl = () => {
    const cleanNumber = WHATSAPP_NUMBER.replace(/[\s\-()]/g, '');
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  };

  // Efectos de partículas flotantes
  const FloatingParticle = ({ index }: { index: number }) => (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${15 + (index * 12)}%`,
        top: `${20 + (index % 4) * 15}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 20 - 10, 0],
        rotate: [0, 180, 360],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 15 + index * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.5
      }}
    >
      <div className={`w-2 h-2 rounded-full ${index % 3 === 0 ? 'bg-gold/40' :
          index % 3 === 1 ? 'bg-rose-300/30' :
            'bg-indigo-300/30'
        }`} />
    </motion.div>
  );

  useEffect(() => {
    // Aplicar el tema al cargar y cuando cambie
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-amber-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Partículas de fondo */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}

      {/* Navbar elegante */}
      <motion.nav
        className="bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-slate-800/30 fixed top-0 left-0 right-0 z-50 overflow-hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Contenedor de partículas de nieve */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Capa única de partículas más brillantes - reducidas en móvil */}
          {Array.from({ length: window.innerWidth < 768 ? 15 : 40 }).map((_, i) => (
            <SnowParticle key={i} index={i} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            <motion.a
              href="/"
              className="text-2xl font-serif text-white tracking-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Suspiro<span className="text-gold">Nupcial</span>
            </motion.a>
            
            {/* Menú Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {['Servicios', 'Planes', 'Contacto'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-slate-200 hover:text-gold transition-colors duration-300 text-sm font-medium relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
              <motion.a
                href="/login"
                className="bg-gradient-to-r from-gold to-amber-500 text-black px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Acceder
              </motion.a>

              {/* Botón Dark Mode Desktop */}
              <button
                onClick={toggleDark}
                className="ml-3 p-2 rounded-md bg-white/6 hover:bg-white/10 text-white"
                title={isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Menú Móvil */}
            <div className="flex items-center space-x-3 md:hidden">
              {/* Botón Dark Mode Móvil */}
              <button
                onClick={toggleDark}
                className="p-2 rounded-md bg-white/6 hover:bg-white/10 text-white"
                title={isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z" />
                  </svg>
                )}
              </button>

              {/* Botón Menú Hamburguesa */}
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="p-2 rounded-md bg-white/6 hover:bg-white/10 text-white"
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menú Móvil Desplegable */}
          <motion.div
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden overflow-hidden ${isMenuOpen ? '' : 'pointer-events-none'}`}
          >
            <div className="px-4 py-3 space-y-3">
              {['Servicios', 'Planes', 'Contacto'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-slate-200 hover:text-gold transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ x: 5 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="/login"
                className="block bg-gradient-to-r from-gold to-amber-500 text-black py-3 px-4 rounded-xl text-center font-semibold shadow-lg"
                onClick={() => setIsMenuOpen(false)}
                whileTap={{ scale: 0.98 }}
              >
                Acceder
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section Mejorada */}
      <header className="relative overflow-hidden pt-20 pb-32">
        {/* Elementos decorativos de fondo */}
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-rose-200/20 to-pink-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-72 h-72 bg-gradient-to-r from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge elegante */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gold/20 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-sm text-slate-600">Tu historia de amor, compartida elegantemente</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-slate-800 dark:text-white mb-6 leading-tight">
              Donde cada{' '}
              <motion.span
                className="bg-gradient-to-r from-gold to-amber-500 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                suspiro
              </motion.span>
              <br />
              se convierte en recuerdo
            </h1>

            <motion.p
              className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Crea un sitio web excepcional para tu boda. Comparte tu amor con elegancia y
              haz que cada momento sea memorable para tus invitados.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="#planes"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-gradient-to-r from-gold to-amber-500 text-black font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">Descubrir Planes</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>

              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white/90 backdrop-blur-sm text-slate-700 font-semibold px-8 py-4 rounded-2xl border border-slate-200 hover:border-green-400 transition-all duration-300 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </motion.div>
                Consultar Disponibilidad
              </motion.a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Sección de Características Mejorada */}
      <section id="servicios" className="py-20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-slate-800 dark:text-white mb-4">
              Diseñado para el amor eterno
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Cada detalle cuidadosamente creado para hacer de tu sitio web el reflejo perfecto de tu historia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '💒',
                title: 'Diseño Exclusivo',
                description: 'Plantillas únicas adaptadas a tu estilo y personalidad'
              },
              {
                icon: '📸',
                title: 'Galería Elegante',
                description: 'Muestra tus mejores momentos con una galería sofisticada'
              },
              {
                icon: '✉️',
                title: 'RSVP Inteligente',
                description: 'Gestión automática de confirmaciones de asistencia'
              },
              {
                icon: '💌',
                title: 'Mensajes Especiales',
                description: 'Libro de visitas para recuerdos de tus seres queridos'
              },
              {
                icon: '⏰',
                title: 'Cuenta Regresiva',
                description: 'Mantén la emoción con un contador elegante'
              },
              {
                icon: '🎵',
                title: 'Ambiente Musical',
                description: 'Tu canción especial ambientando el sitio'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  y: -8,
                  transition: { type: "spring", stiffness: 300 }
                }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl border border-white/50 dark:border-slate-700/50 transition-all duration-500 group cursor-pointer"
              >
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold/5 to-amber-500/5 dark:from-gold/10 dark:to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div
                  className="text-4xl mb-4 relative z-10"
                  animate={{
                    scale: hoveredCard === index ? 1.1 : 1,
                    rotate: hoveredCard === index ? 5 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                  {feature.description}
                </p>

                {/* Línea decorativa */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-gold to-amber-500 group-hover:w-3/4 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Planes Mejorada */}
      <section id="planes" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-slate-800 mb-4">
              El plan perfecto para tu día especial
            </h2>
            <p className="text-xl text-slate-600">
              Desde lo esencial hasta una experiencia completa y personalizada
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(SYSTEM_CONFIG.PLANS).map(([key, plan], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 transition-all duration-500 ${selectedPlan === key
                    ? 'border-gold shadow-2xl scale-105'
                    : 'border-white/50 dark:border-slate-700/50 hover:border-gold/30'
                  } ${key === 'premium' ? 'ring-2 ring-gold/20' : ''}`}
              >
                {key === 'premium' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold to-amber-500 text-black text-sm font-bold px-6 py-1.5 rounded-full shadow-lg">
                    Más Elegido
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-serif text-slate-800 dark:text-white mb-3">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gold">${plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-lg">/una vez</span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                    <p>Duración: {plan.duration} días</p>
                    <p>Hasta {plan.maxGuests} invitados</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 text-slate-600"
                    >
                      <motion.svg
                        className="w-5 h-5 text-gold mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </motion.svg>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => setSelectedPlan(key as 'basic' | 'premium' | 'deluxe')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${selectedPlan === key
                      ? 'bg-gradient-to-r from-gold to-amber-500 text-black shadow-lg'
                      : 'bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600'
                    }`}
                >
                  <span className="relative z-10">
                    {selectedPlan === key ? '✓ Seleccionado' : 'Elegir Plan'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Contacto Mejorada */}
      <section id="contacto" className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif text-slate-800 dark:text-white mb-4">
              Comienza tu historia
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Estamos aquí para hacer realidad el sitio web perfecto para tu boda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-slate-700/50"
          >
            <ContactForm selectedPlan={selectedPlan} />
          </motion.div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-slate-800 text-white py-16 relative overflow-hidden">
        {/* Efecto de partículas en el footer */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${25 + i * 15}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <motion.a
                href="/"
                className="text-2xl font-serif text-white mb-4 inline-block"
                whileHover={{ scale: 1.05 }}
              >
                Suspiro<span className="text-gold">Nupcial</span>
              </motion.a>
              <p className="text-slate-400 mb-6 max-w-md">
                Creamos sitios web excepcionales para bodas, donde cada detalle cuenta
                la historia única de tu amor. Elegante, moderno y memorable.
              </p>
              <div className="flex space-x-4">
                {['Instagram', 'Facebook', 'Pinterest'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-gold transition-colors duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {social[0]}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Enlaces</h4>
              <div className="space-y-2">
                {['Servicios', 'Planes', 'Contacto', 'Login'].map((link) => (
                  <motion.a
                    key={link}
                    href={link === 'Login' ? '/login' : `#${link.toLowerCase()}`}
                    className="block text-slate-400 hover:text-gold transition-colors duration-300 text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Contacto</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <p>📧 hola@suspironupcial.com</p>
                <p>📱 +58 412 123 4567</p>
                <p>💬 WhatsApp disponible</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Suspiro Nupcial.
              <span className="text-gold ml-2">Hecho con 💕 para tu día especial</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}