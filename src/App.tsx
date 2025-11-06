import './index.css'
import BackgroundAudio from './components/BackgroundAudio'
import Countdown from './components/Countdown'
import Gallery from './components/Gallery'
import RSVPForm from './components/RSVPForm'
import Guestbook from './components/Guestbook'
import Hero from './components/Hero'
import SectionTitle from './components/SectionTitle'
import ClientLogout from './components/ClientLogout'
import { useClientAuth } from './contexts/ClientAuthContext'
import { type ClientToken } from './lib/auth-system'

interface AppProps {
  clientData?: ClientToken;
}

export default function App({ clientData }: AppProps) {
  const { client } = useClientAuth();
  
  // Usar el cliente del contexto o el que se pasa como prop
  const currentClient = client || clientData;

  return (
    <div className="min-h-screen">
      {/* Logout button para clientes autenticados */}
      <ClientLogout />
      
      {/* Backgrounds removidos para optimizar rendimiento */}
      <header className="relative">
        <Hero clientData={currentClient} />
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <section id="cuenta-regresiva" className="py-8 sm:py-12 lg:py-16 border-t border-neutral-100">
          <SectionTitle>Cuenta regresiva</SectionTitle>
          <Countdown date={currentClient?.weddingDate?.toISOString() || "2026-01-24T18:00:00"} />
        </section>

        <section id="galeria" className="py-8 sm:py-12 lg:py-16 border-t border-neutral-100">
          <SectionTitle>Galería</SectionTitle>
          <Gallery clientData={currentClient} />
        </section>

        <section id="mapa" className="py-8 sm:py-16 border-t border-neutral-100">
          <SectionTitle>Ubicación</SectionTitle>
          <div className="min-h-[300px] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-6 sm:p-8 shadow-lg border border-white/50">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 sm:w-16 sm:h-16 mx-auto mb-6 sm:mb-4 bg-gradient-to-br from-gold/30 to-gold/10 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-10 h-10 sm:w-8 sm:h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="font-brush text-2xl sm:text-lg text-neutral-700 mb-3 sm:mb-2">Iglesia San José</h3>
              <p className="text-neutral-600 mb-6 sm:mb-4 text-base sm:text-sm leading-relaxed">Av. Principal 123, Ciudad</p>
              <button 
                onClick={() => window.open('https://maps.google.com/?q=Iglesia+San+Jose', '_blank')}
                className="bg-gold hover:bg-gold-dark text-neutral-900 px-8 py-3 sm:px-6 sm:py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg font-serif text-base sm:text-sm"
              >
                Ver en Google Maps
              </button>
            </div>
          </div>
        </section>

        <section id="rsvp" className="py-16 border-t border-neutral-100">
          <SectionTitle>Confirma tu asistencia</SectionTitle>
          <div className="mx-auto max-w-xl rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-md ring-1 ring-neutral-100">
            <RSVPForm clientData={currentClient} />
          </div>
        </section>

        <section id="muro" className="py-16 border-t border-neutral-100">
          <SectionTitle>Déjanos un mensaje</SectionTitle>
          <div className="mx-auto max-w-4xl">
            <Guestbook clientData={currentClient} />
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-100 py-8 text-center text-neutral-500">
        Con amor, {currentClient?.clientName || 'Humberto & Nelida'}
      </footer>
      <BackgroundAudio src="/audio.mp3" />
      </div>
  )
}
