import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useClientAuth } from '../contexts/ClientAuthContext'

type RSVP = {
  name: string
  email: string
  phone?: string
  guests: number
}

export default function RSVPForm({ clientData }: { clientData?: any }) {
  const { client } = useClientAuth()
  const currentClient = client || clientData
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RSVP>({
    defaultValues: { guests: 0 },
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function onSubmit(data: RSVP) {
    if (!currentClient?.id) {
      alert('Error: No se pudo identificar el cliente. Por favor, recarga la página.')
      return
    }

    const { error } = await supabase.from('rsvps').insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      guests: data.guests,
      client_id: currentClient.id,
    })
    
    if (error) {
      alert('Error guardando RSVP: ' + error.message)
      return
    }
    
    reset()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 4000)
  }

  return (
    <div className="relative">
      {/* Notificación de éxito */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute -top-20 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-green-500/25 backdrop-blur-sm border border-white/20 mb-6"
          >
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-medium">¡Gracias por confirmar! Nos vemos en la boda</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-white/30 shadow-xl shadow-black/10"
      >
        {/* Header del formulario */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-light text-neutral-700 mb-2">Confirmar Asistencia</h3>
          <p className="text-neutral-500">Ayúdanos a preparar todo para nuestro día especial</p>
          <div className="mx-auto mt-4 h-1 w-16 bg-gradient-to-r from-gold/70 to-rose-400/70 rounded-full"></div>
        </div>

        <div className="grid gap-6">
          {/* Campo Nombre */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Nombre completo *
            </label>
            <input 
              className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-neutral-700 placeholder-neutral-400 
                         focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 shadow-sm hover:shadow-md" 
              placeholder="Tu nombre completo" 
              {...register('name', { 
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              })} 
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-rose-600 mt-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Campos Email y Teléfono */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Email *
              </label>
              <input 
                type="email" 
                className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-neutral-700 placeholder-neutral-400 
                           focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 shadow-sm hover:shadow-md" 
                placeholder="tu@email.com" 
                {...register('email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })} 
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-rose-600 mt-2 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Teléfono
              </label>
              <input 
                className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-neutral-700 placeholder-neutral-400 
                           focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 shadow-sm" 
                placeholder="+58 412 123 4567" 
                {...register('phone')} 
              />
            </div>
          </motion.div>

          {/* Campo Acompañantes */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Número de acompañantes
            </label>
            <div className="relative">
              <input 
                type="number" 
                min={0}
                max={10}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-neutral-700 placeholder-neutral-400 
                           focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 shadow-sm pr-16" 
                {...register('guests', { 
                  valueAsNumber: true, 
                  min: 0,
                  max: {
                    value: 10,
                    message: 'Máximo 10 acompañantes'
                  }
                })} 
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">
                personas
              </div>
            </div>
            <AnimatePresence>
              {errors.guests && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-rose-600 mt-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  {errors.guests.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Botón de enviar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4"
          >
            <motion.button 
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full rounded-2xl bg-gradient-to-r from-gold to-amber-500 px-6 py-4 text-white font-medium shadow-lg shadow-gold/30 
                         hover:shadow-xl hover:shadow-gold/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         hover:from-amber-500 hover:to-gold"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Enviando confirmación...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Confirmar Asistencia
                </div>
              )}
            </motion.button>
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-neutral-500 text-sm mt-6"
        >
          * Campos obligatorios
        </motion.p>
      </motion.form>
    </div>
  )
}