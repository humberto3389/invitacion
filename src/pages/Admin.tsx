import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getCurrentClientData } from '../lib/client-data'
import { validateClientToken, type ClientToken } from '../lib/auth-system'
import AdminUploader from '../components/AdminUploader'

type RSVP = { name: string; email: string; phone?: string; guests: number; created_at?: string }
type Message = { name: string; message: string; created_at?: string }

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('adminAuthed') === 'true' || !!sessionStorage.getItem('clientAuth'))
  // Login por token para admin de cliente (solo cliente)
  const [tokenInput, setTokenInput] = useState('')
  const [clientSession, setClientSession] = useState<ClientToken | null>(() => {
    try {
      const s = sessionStorage.getItem('clientAuth')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const totalGuests = useMemo(() => rsvps.reduce((a, r) => a + (Number(r.guests) || 0), 0), [rsvps])

  // Determinar si estamos dentro del contexto de un cliente (subdominio) o en sesión por token
  const detectedClient = getCurrentClientData()
  const clientData = detectedClient || clientSession
  const clientId = clientData ? clientData.id : null

  useEffect(() => {
    if (!authed) return
    (async () => {
      try {
        // Si estamos en el subdominio de un cliente, filtrar por client_id para aislar datos
        if (clientId) {
          const { data: rData } = await supabase
            .from('rsvps')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
          setRsvps((rData || []) as RSVP[])

          const { data: mData } = await supabase
            .from('messages')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
          setMessages((mData || []) as Message[])
        } else {
          // Master admin: ver todo
          const { data: rData } = await supabase.from('rsvps').select('*').order('created_at', { ascending: false })
          setRsvps((rData || []) as RSVP[])
          const { data: mData } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
          setMessages((mData || []) as Message[])
        }
      } catch (err) {
        console.error('Error fetching admin data:', err)
      }
    })()
  }, [authed, clientId])

  // No-op: sin credenciales master en esta vista

  function downloadCSV(filename: string, rows: Array<Record<string, unknown>>) {
    const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => JSON.stringify(((r as Record<string, unknown>)[h] ?? '') as string)).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <h1 className="font-display text-2xl mb-4 text-center">Acceso cliente</h1>
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Token del cliente"
              className="w-full rounded-xl border-neutral-300 focus:border-neutral-400 focus:ring-0"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget.nextSibling as HTMLButtonElement)?.click() }}
            />
            <button
              className="rounded-xl bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
              onClick={() => {
                if (!tokenInput.trim()) { alert('Ingresa un token'); return }
                const validated = validateClientToken(tokenInput.trim())
                if (!validated) { alert('Token inválido o expirado'); return }
                // Guardar sesión de cliente
                sessionStorage.setItem('clientAuth', JSON.stringify(validated))
                setClientSession(validated)
                setAuthed(true)
              }}
            >
              Ingresar con token
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header elegante */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="font-serif text-5xl font-light tracking-wide text-slate-800">
                Panel de Administración
              </h1>
              <p className="text-lg text-slate-600 font-light">
                Gestiona tu galería de imágenes y datos de invitados
              </p>
            </div>
            <button
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              onClick={() => { sessionStorage.removeItem('adminAuthed'); setAuthed(false) }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <AdminUploader />
        </div>

        {/* Estadísticas elegantes */}
        <div className="grid gap-8 sm:grid-cols-3 mb-12">
          <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-600">RSVPs recibidos</div>
                  <div className="text-4xl font-bold text-slate-800">{rsvps.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-300">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-600">Total invitados</div>
                  <div className="text-4xl font-bold text-slate-800">{totalGuests}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-600">Mensajes</div>
                  <div className="text-4xl font-bold text-slate-800">{messages.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección RSVPs elegante */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-4xl font-light tracking-wide text-slate-800">Confirmaciones RSVP</h2>
              <p className="text-slate-600 mt-2">Lista de invitados que han confirmado asistencia</p>
            </div>
            <button 
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              onClick={() => downloadCSV('rsvps.csv', rsvps.map(r => ({ name: r.name, email: r.email, phone: r.phone ?? '', guests: r.guests, created_at: r.created_at })) as Array<Record<string, unknown>>)}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/20">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Teléfono</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Acompañantes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rsvps.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{r.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{r.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{r.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{r.guests}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sección Mensajes elegante */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-4xl font-light tracking-wide text-slate-800">Mensajes de Invitados</h2>
              <p className="text-slate-600 mt-2">Mensajes y comentarios de los invitados</p>
            </div>
            <button 
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              onClick={() => downloadCSV('messages.csv', messages.map(m => ({ name: m.name, message: m.message, created_at: m.created_at })) as Array<Record<string, unknown>>)}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/20">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Mensaje</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {messages.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{m.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-[600px]">{m.message}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{m.created_at ? new Date(m.created_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


