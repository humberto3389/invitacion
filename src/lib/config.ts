// Configuración del sistema de alquiler
export const SYSTEM_CONFIG = {
  // Dominio principal donde está desplegado el sistema
  MAIN_DOMAIN: 'vercel.app', // Dominio de Vercel para desarrollo
  
  // Configuración de planes
  PLANS: {
    basic: {
      name: 'Básico',
      duration: 30, // días
      maxGuests: 50,
      price: 100,
      features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes']
    },
    premium: {
      name: 'Premium', 
      duration: 60, // días
      maxGuests: 100,
      price: 200,
      features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes', 'Countdown', 'Música de fondo']
    },
    deluxe: {
      name: 'Deluxe',
      duration: 90, // días
      maxGuests: 200,
      price: 300,
      features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes', 'Countdown', 'Música de fondo', 'Video de fondo', 'Animaciones avanzadas']
    }
  },
  
  // Configuración de autenticación
  AUTH: {
    MASTER_ADMIN_PASSWORD: import.meta.env.VITE_MASTER_ADMIN_PASS || 'admin123',
    ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASS || 'admin456'
  },
  
  // Configuración de la base de datos
  DATABASE: {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
  }
};

// Función para generar URL completa del cliente
export function getClientUrl(subdomain: string): string {
  const mainDomain = import.meta.env.VITE_MAIN_DOMAIN || 'vercel.app';
  return `https://${subdomain}-invitacion.vercel.app`;
}

// Función para verificar si estamos en el dominio principal
export function isMainDomain(): boolean {
  const hostname = window.location.hostname;
  return hostname === SYSTEM_CONFIG.MAIN_DOMAIN || 
         hostname === `www.${SYSTEM_CONFIG.MAIN_DOMAIN}` ||
         hostname === 'invitacion-eight-cyan.vercel.app';
}

// Función para obtener el subdominio actual
export function getCurrentSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // Si es el dominio principal de Vercel
  if (hostname === 'invitacion-eight-cyan.vercel.app') {
    return null;
  }
  
  // Si es un subdominio de Vercel
  if (hostname.endsWith('.vercel.app')) {
    const prefix = hostname.replace('.vercel.app', '');
    return prefix.replace('-invitacion', '');
  }
  
  // Para dominios personalizados
  const parts = hostname.split('.');
  if (parts.length <= 2) {
    return null; // Estamos en el dominio principal
  }
  
  return parts[0];
}
