import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { useClientAuth } from '../contexts/ClientAuthContext'

type Message = { 
  id: string; 
  name: string; 
  message: string; 
  created_at: string;
}

export default function Guestbook({ clientData }: { clientData?: any }) {
  const { client } = useClientAuth()
  const currentClient = client || clientData
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!currentClient?.id) return

    let ignore = false
    async function load() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', currentClient.id)
        .order('created_at', { ascending: false })
      
      if (!ignore) setMessages((data as Message[]) || [])
      if (error) console.error(error)
    }
    
    load()
    
    const channel = supabase
      .channel(`messages-${currentClient.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `client_id=eq.${currentClient.id}`
        }, 
        () => load()
      )
      .subscribe()
    
    return () => { 
      ignore = true; 
      supabase.removeChannel(channel) 
    }
  }, [currentClient?.id])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    if (!currentClient?.id) {
      alert('Error: No se pudo identificar el cliente. Por favor, recarga la página.')
      return
    }
    
    setIsSubmitting(true)
    const { error } = await supabase
      .from('messages')
      .insert({ 
        name: name.trim(), 
        message: message.trim(),
        client_id: currentClient.id
      })
    
    if (error) { 
      alert('Error: ' + error.message) 
    } else {
      setMessage('')
      // No limpiamos el nombre para permitir múltiples mensajes
    }
    setIsSubmitting(false)
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header con animación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="text-neutral-500">Deja un mensaje para los novios</p>
        <div className="mx-auto mt-4 h-1 w-16 bg-gradient-to-r from-gold/70 to-rose-400/70 rounded-full"></div>
      </motion.div>

      {/* Formulario con glassmorphism */}
      <motion.form 
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12 p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg shadow-black/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Tu nombre
            </label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full rounded-2xl border border-white/40 bg-white/50 px-5 py-4 text-neutral-700 placeholder-neutral-400 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300 backdrop-blur-sm hover:shadow-md" 
              placeholder="¿Cómo te llamas?" 
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Tu mensaje
            </label>
            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="w-full rounded-2xl border border-white/40 bg-white/50 px-5 py-4 text-neutral-700 placeholder-neutral-400 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300 backdrop-blur-sm hover:shadow-md" 
              placeholder="Escribe tu mensaje..." 
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <motion.button 
          type="submit"
          disabled={isSubmitting || !name.trim() || !message.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-2xl bg-gradient-to-r from-gold to-rose-400 px-6 py-4 text-white font-medium shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Enviando...
            </div>
          ) : (
            'Enviar Mensaje 💌'
          )}
        </motion.button>
      </motion.form>

      {/* Lista de mensajes */}
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              layout
              className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 p-6 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-neutral-800 group-hover:text-gold transition-colors duration-300">
                  {m.name}
                </h4>
                {m.created_at && (
                  <span className="text-xs text-neutral-400">
                    {formatDate(m.created_at)}
                  </span>
                )}
              </div>
              
              <p className="text-neutral-600 leading-relaxed">
                {m.message}
              </p>
              
              {/* Decoración sutil */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-gold/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 rounded-2xl bg-white/50 backdrop-blur-md border border-white/30"
          >
            <div className="w-16 h-16 mx-auto mb-4 text-gold/40">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Sé el primero en dejar un mensaje
            </h3>
            <p className="text-neutral-500">
              Tu mensaje será un lindo recuerdo para los novios
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}