import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useClientAuth } from '../contexts/ClientAuthContext'

type Photo = { name: string; publicUrl: string }

export default function Gallery({ clientData }: { clientData?: any }) {
  const { client } = useClientAuth()
  const currentClient = client || clientData
  const [images, setImages] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!currentClient?.id) {
      setLoading(false)
      return
    }

    let ignore = false
    const bucketName = `gallery-${currentClient.id}`
    
    async function listFolder(prefix: string) {
      const { data, error } = await supabase.storage.from(bucketName).list(prefix, { 
        limit: 100, 
        sortBy: { column: 'created_at', order: 'desc' } 
      })
      if (error) { 
        console.error('list error', error); 
        return [] as string[] 
      }
      const files = (data || []) as Array<{ name: string }>
      return files
        .map((f) => (prefix ? `${prefix}/${f.name}` : f.name))
        .filter((p) => p && !p.endsWith('/'))
    }

    async function getSignedUrls(paths: string[]) {
      // Procesar en lotes de 5 para no sobrecargar
      const results: Photo[] = []
      const batchSize = 5
      for (let i = 0; i < paths.length; i += batchSize) {
        const batch = paths.slice(i, i + batchSize)
        const promises = batch.map(p => 
          supabase.storage.from(bucketName).createSignedUrl(p, 60 * 60 * 12)
            .then(({data, error}) => {
              if (error) {
                console.error('signed url error', error)
                return null
              }
              return { name: p, publicUrl: data.signedUrl }
            })
        )
        const batchResults = await Promise.all(promises)
        results.push(...batchResults.filter((r): r is Photo => r !== null))
        
        // Pequeña pausa entre lotes para no sobrecargar
        if (i + batchSize < paths.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      return results
    }

    async function load() {
      setLoading(true)
      try {
        // Intentar listar tanto la raíz como la carpeta uploads
        console.log('Intentando cargar imágenes...')
        
        // Primero intentar la raíz del bucket
        const rootPaths = await listFolder('')
        console.log('Archivos en raíz:', rootPaths)
        
        // Luego intentar la carpeta uploads
        const uploadPaths = await listFolder('uploads')
        console.log('Archivos en uploads:', uploadPaths)
        
        // Combinar ambas listas y eliminar duplicados
        const allPaths = [...new Set([...rootPaths, ...uploadPaths])]
        console.log('Todos los archivos encontrados:', allPaths)
        
        // Filtrar solo archivos de imagen válidos
        const validImagePaths = allPaths.filter(path => {
          const ext = path.toLowerCase().split('.').pop()
          const isValid = ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
          console.log(`Archivo: ${path}, Extensión: ${ext}, Válido: ${isValid}`)
          return isValid
        })
        
        console.log('Archivos de imagen válidos:', validImagePaths)
        
        if (validImagePaths.length === 0) {
          console.log('No se encontraron archivos de imagen válidos')
          if (!ignore) setImages([])
          return
        }
        
        const photos = await getSignedUrls(validImagePaths)
        console.log('URLs firmadas obtenidas:', photos)
        
        // Filtrar fotos válidas con URLs
        const validPhotos = photos.filter(photo => photo && photo.publicUrl)
        console.log('Fotos válidas finales:', validPhotos)
        
        if (!ignore) setImages(validPhotos)
      } catch (error) {
        console.error('Error loading images:', error)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [currentClient?.id])

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000) // Cambiar cada 4 segundos
    
    return () => clearInterval(interval)
  }, [images.length, isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-500 font-serif">Cargando galería...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!images.length) {
    return (
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="font-brush text-3xl text-neutral-600 mb-2">Galería vacía</h3>
          <p className="text-neutral-500 font-serif text-sm">Sube tus fotos desde el panel de administración</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full aspect-[16/9] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Imagen principal */}
      <div className="relative w-full h-full">
        <img
          src={images[currentIndex]?.publicUrl}
          alt={`Foto ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          loading="lazy"
          decoding="async"
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>


      {/* Indicadores de posición */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Control de auto-play */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
        title={isAutoPlaying ? 'Pausar auto-play' : 'Reanudar auto-play'}
      >
        {isAutoPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      {/* Contador en la esquina superior izquierda */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full border border-white/20 font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}