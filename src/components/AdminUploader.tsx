import { useRef, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCurrentClientData } from '../lib/client-data'

interface ImageFile {
  name: string
  id: string
  created_at: string
  size?: number
}

export default function AdminUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [images, setImages] = useState<ImageFile[]>([])
  const clientData = getCurrentClientData()
  const bucketName = clientData ? `gallery-${clientData.id}` : 'gallery'

  // Cargar imágenes al montar el componente
  useEffect(() => {
    if (clientData?.id) {
      loadImages()
    } else {
      setLoading(false)
      setMessage('No se pudo identificar el cliente. Por favor, inicia sesión.')
    }
  }, [clientData?.id])

  async function loadImages() {
    if (!clientData?.id) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
      
      if (error) throw error
      setImages(data || [])
    } catch (err: any) {
      setMessage('Error cargando imágenes: ' + (err?.message || ''))
    } finally {
      setLoading(false)
    }
  }

  async function onPick() {
    inputRef.current?.click()
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setMessage(null)
    try {
      if (!clientData?.id) {
        setMessage('Error: No se pudo identificar el cliente.')
        return
      }

      for (const file of files) {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from(bucketName).upload(fileName, file, { 
          cacheControl: '3600', 
          upsert: false 
        })
        if (error) throw error
      }
      setMessage('Imágenes subidas correctamente.')
      await loadImages() // Recargar la lista
    } catch (err: any) {
      setMessage('Error subiendo imágenes: ' + (err?.message || ''))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function deleteImage(imageName: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return
    if (!clientData?.id) {
      setMessage('Error: No se pudo identificar el cliente.')
      return
    }
    
    try {
      const { error } = await supabase.storage.from(bucketName).remove([imageName])
      if (error) throw error
      
      setMessage('Imagen eliminada correctamente.')
      await loadImages() // Recargar la lista
    } catch (err: any) {
      setMessage('Error eliminando imagen: ' + (err?.message || ''))
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES')
  }

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-white/20">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-light tracking-wide text-slate-800">Galería de Imágenes</h3>
            <p className="text-slate-600">Administra las imágenes de tu galería</p>
          </div>
          <div className="flex items-center gap-4">
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFilesSelected} />
            <button 
              onClick={onPick} 
              disabled={uploading} 
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center gap-2">
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Subir imágenes
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </div>
        </div>
        {message && (
          <div className={`p-4 rounded-2xl ${
            message.includes('Error') 
              ? 'bg-red-50 border border-red-200 text-red-800' 
              : 'bg-green-50 border border-green-200 text-green-800'
          }`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </div>

      {/* Lista de imágenes elegante */}
      <div className="border-t border-slate-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-serif text-2xl font-light tracking-wide text-slate-800">
            Imágenes en la galería
          </h4>
          <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
            {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-slate-600">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando imágenes...
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4 text-slate-500">
              <svg className="h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No hay imágenes en la galería</p>
              <p className="text-sm">Sube tu primera imagen para comenzar</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="aspect-square bg-slate-100 rounded-t-2xl overflow-hidden">
                  <img
                    src={`${supabase.storage.from(bucketName).getPublicUrl(image.name).data.publicUrl}`}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-900 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{image.size ? formatFileSize(image.size) : 'Tamaño desconocido'}</span>
                    <span>{formatDate(image.created_at)}</span>
                  </div>
                  <button
                    onClick={() => deleteImage(image.name)}
                    className="w-full group/btn relative overflow-hidden rounded-xl bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </span>
                    <div className="absolute inset-0 bg-red-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


