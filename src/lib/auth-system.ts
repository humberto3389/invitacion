// Sistema de autenticación para alquiler de sitios de bodas
import { supabase } from './supabase';

export interface ClientToken {
  id: string;
  clientName: string;
  subdomain: string; // subdominio único para cada cliente
  token: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  weddingDate: Date;
  accessUntil: Date; // Fecha de expiración del acceso
  planType: 'basic' | 'premium' | 'deluxe'; // Tipo de plan contratado
  maxGuests: number; // Límite de invitados según el plan
  features: string[]; // Características incluidas en el plan
  // Campos adicionales para personalización
  groomName?: string;
  brideName?: string;
  weddingLocation?: string;
  weddingTime?: string;
  bibleVerse?: string;
  invitationText?: string;
}

// Planes disponibles
export const PLANS = {
  basic: {
    name: 'Básico',
    duration: 30, // días
    maxGuests: 50,
    features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes']
  },
  premium: {
    name: 'Premium', 
    duration: 60, // días
    maxGuests: 100,
    features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes', 'Countdown', 'Música de fondo']
  },
  deluxe: {
    name: 'Deluxe',
    duration: 90, // días
    maxGuests: 200,
    features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes', 'Countdown', 'Música de fondo', 'Video de fondo', 'Animaciones avanzadas']
  }
};

// Clientes por defecto
const DEFAULT_CLIENTS: ClientToken[] = [
  {
    id: 'client-001',
    clientName: 'Boda de María y Juan',
    subdomain: 'maria-juan',
    token: 'boda-maria-juan-2024-xyz123',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    weddingDate: new Date('2025-02-15'), // Fecha futura para prueba
    accessUntil: new Date('2025-03-15'), // 30 días después de la boda
    planType: 'basic',
    maxGuests: 50,
    features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes']
  },
  {
    id: 'client-002',
    clientName: 'Boda de Ana y Carlos',
    subdomain: 'ana-carlos',
    token: 'boda-ana-carlos-2024-abc456',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    weddingDate: new Date('2025-03-20'), // Fecha futura para prueba
    accessUntil: new Date('2025-05-20'), // 60 días después de la boda
    planType: 'premium',
    maxGuests: 100,
    features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes', 'Countdown', 'Música de fondo']
  },
  {
    id: 'client-demo',
    clientName: 'Sitio de Demostración',
    subdomain: 'demo',
    token: 'demo-token-2024',
    isActive: true,
    createdAt: new Date(),
    weddingDate: new Date('2025-06-15'),
    accessUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
    planType: 'basic',
    maxGuests: 50,
    features: ['Sitio web personalizado', 'Galería de fotos', 'RSVP', 'Mensajes']
  }
];

// Función para cargar clientes desde localStorage
function loadClientsFromStorage(): ClientToken[] {
  try {
    const stored = localStorage.getItem('wedding-clients');
    if (stored) {
      const clients = JSON.parse(stored);
      // Convertir fechas de string a Date
      return clients.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt),
        weddingDate: new Date(client.weddingDate),
        accessUntil: new Date(client.accessUntil),
        lastUsed: client.lastUsed ? new Date(client.lastUsed) : undefined
      }));
    }
  } catch (error) {
    console.error('Error loading clients from storage:', error);
  }
  return DEFAULT_CLIENTS;
}

// Función para guardar clientes en localStorage
function saveClientsToStorage(clients: ClientToken[]): void {
  try {
    localStorage.setItem('wedding-clients', JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving clients to storage:', error);
  }
}

// Función para sincronizar cliente con Supabase
async function syncClientToSupabase(client: ClientToken): Promise<void> {
  try {
    const clientData = {
      id: client.id,
      client_name: client.clientName,
      subdomain: client.subdomain,
      token: client.token,
      is_active: client.isActive,
      created_at: client.createdAt.toISOString(),
      last_used: client.lastUsed?.toISOString() || null,
      wedding_date: client.weddingDate.toISOString(),
      access_until: client.accessUntil.toISOString(),
      plan_type: client.planType,
      max_guests: client.maxGuests,
      features: client.features,
      groom_name: client.groomName || null,
      bride_name: client.brideName || null,
      wedding_location: client.weddingLocation || null,
      wedding_time: client.weddingTime || null,
      bible_verse: client.bibleVerse || null,
      invitation_text: client.invitationText || null,
    };

    const { error } = await supabase
      .from('clients')
      .upsert(clientData, { onConflict: 'id' });

    if (error) {
      console.error('Error syncing client to Supabase:', error);
      // No lanzamos error para que funcione en modo degradado
    }
  } catch (error) {
    console.error('Error in syncClientToSupabase:', error);
    // Modo degradado: continuar sin Supabase
  }
}

// Función para cargar clientes desde Supabase (con fallback a localStorage)
async function loadClientsFromSupabase(): Promise<ClientToken[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      // Convertir datos de Supabase a ClientToken
      return data.map((row: any) => ({
        id: row.id,
        clientName: row.client_name,
        subdomain: row.subdomain,
        token: row.token,
        isActive: row.is_active,
        createdAt: new Date(row.created_at),
        lastUsed: row.last_used ? new Date(row.last_used) : undefined,
        weddingDate: new Date(row.wedding_date),
        accessUntil: new Date(row.access_until),
        planType: row.plan_type,
        maxGuests: row.max_guests,
        features: row.features || [],
        groomName: row.groom_name,
        brideName: row.bride_name,
        weddingLocation: row.wedding_location,
        weddingTime: row.wedding_time,
        bibleVerse: row.bible_verse,
        invitationText: row.invitation_text,
      }));
    }
  } catch (error) {
    console.error('Error loading clients from Supabase:', error);
  }
  
  // Fallback a localStorage
  return loadClientsFromStorage();
}

// Cargar clientes iniciales
let CLIENT_TOKENS: ClientToken[] = loadClientsFromStorage();

// Intentar cargar desde Supabase al iniciar (async, no bloquea)
loadClientsFromSupabase().then(clients => {
  if (clients.length > 0) {
    CLIENT_TOKENS = clients;
    saveClientsToStorage(clients);
  }
}).catch(() => {
  // Modo degradado: usar localStorage
});

// Función para obtener todos los clientes
export function getAllClients(): ClientToken[] {
  return CLIENT_TOKENS;
}

// Función para actualizar la lista de clientes
export async function updateClientsList(clients: ClientToken[]): Promise<void> {
  CLIENT_TOKENS = clients;
  saveClientsToStorage(clients);
  
  // Sincronizar todos los clientes con Supabase
  for (const client of clients) {
    await syncClientToSupabase(client);
  }
}

// Función para validar token de cliente
export function validateClientToken(token: string): ClientToken | null {
  const client = CLIENT_TOKENS.find(c => c.token === token && c.isActive);
  
  if (!client) return null;
  
  const now = new Date();
  
  // Verificar si ha pasado la fecha de acceso
  if (now > client.accessUntil) {
    client.isActive = false;
    return null;
  }
  
  // Actualizar último uso
  client.lastUsed = now;
  saveClientsToStorage(CLIENT_TOKENS);
  syncClientToSupabase(client).catch(() => {
    // Modo degradado: continuar sin Supabase
  });
  
  return client;
}

// Función para obtener cliente por subdominio
export function getClientBySubdomain(subdomain: string): ClientToken | null {
  const client = CLIENT_TOKENS.find(c => c.subdomain === subdomain && c.isActive);
  
  if (!client) return null;
  
  const now = new Date();
  
  // Verificar si ha pasado la fecha de acceso
  if (now > client.accessUntil) {
    client.isActive = false;
    return null;
  }
  
  return client;
}

// Función para generar nuevo token (solo para ti como admin principal)
export async function generateClientToken(
  clientName: string, 
  subdomain: string, 
  weddingDate: Date, 
  planType: 'basic' | 'premium' | 'deluxe'
): ClientToken {
  const token = `boda-${subdomain}-${Date.now()}`;
  const plan = PLANS[planType];
  
  // Calcular fecha de acceso (boda + duración del plan)
  const accessUntil = new Date(weddingDate);
  accessUntil.setDate(accessUntil.getDate() + plan.duration);
  
  const newClient: ClientToken = {
    id: `client-${Date.now()}`,
    clientName,
    subdomain,
    token,
    isActive: true,
    createdAt: new Date(),
    weddingDate,
    accessUntil,
    planType,
    maxGuests: plan.maxGuests,
    features: plan.features
  };
  
  // Guardar en localStorage
  CLIENT_TOKENS.push(newClient);
  saveClientsToStorage(CLIENT_TOKENS);
  
  // Sincronizar con Supabase
  await syncClientToSupabase(newClient);
  
  // Crear bucket de galería para el cliente
  try {
    const bucketName = `gallery-${newClient.id}`;
    await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    }).catch(() => {
      // Ignorar errores si el bucket ya existe o no hay Supabase
    });
  } catch (error) {
    // Modo degradado: continuar sin bucket
    console.warn('Could not create gallery bucket:', error);
  }
  
  return newClient;
}

// Función para desactivar token de cliente
export async function deactivateClientToken(token: string): Promise<boolean> {
  const client = CLIENT_TOKENS.find(c => c.token === token);
  if (client) {
    client.isActive = false;
    saveClientsToStorage(CLIENT_TOKENS);
    await syncClientToSupabase(client);
    return true;
  }
  return false;
}

// Función para verificar y desactivar tokens expirados automáticamente
export function checkAndDeactivateExpiredTokens(): ClientToken[] {
  const now = new Date();
  const expiredTokens: ClientToken[] = [];
  
  CLIENT_TOKENS.forEach(client => {
    if (client.isActive && now > client.accessUntil) {
      client.isActive = false;
      expiredTokens.push(client);
    }
  });
  
  return expiredTokens;
}

// Función para obtener días restantes de acceso
export function getDaysUntilExpiration(client: ClientToken): number {
  const now = new Date();
  const diffTime = client.accessUntil.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Función para verificar si el token está próximo a expirar (menos de 7 días)
export function isTokenNearExpiration(client: ClientToken): boolean {
  return getDaysUntilExpiration(client) <= 7;
}

// Función para extender acceso (solo para casos especiales)
export async function extendClientAccess(token: string, additionalDays: number): Promise<boolean> {
  const client = CLIENT_TOKENS.find(c => c.token === token);
  if (client) {
    client.accessUntil.setDate(client.accessUntil.getDate() + additionalDays);
    saveClientsToStorage(CLIENT_TOKENS);
    await syncClientToSupabase(client);
    return true;
  }
  return false;
}

// Función para obtener estadísticas del negocio
export function getBusinessStats() {
  const now = new Date();
  const activeClients = CLIENT_TOKENS.filter(c => c.isActive && c.accessUntil > now);
  const expiredClients = CLIENT_TOKENS.filter(c => !c.isActive || c.accessUntil <= now);
  
  const revenue = CLIENT_TOKENS.reduce((total, client) => {
    const plan = PLANS[client.planType];
    const basePrice = plan.duration === 30 ? 100 : plan.duration === 60 ? 200 : 300;
    return total + basePrice;
  }, 0);
  
  return {
    totalClients: CLIENT_TOKENS.length,
    activeClients: activeClients.length,
    expiredClients: expiredClients.length,
    totalRevenue: revenue,
    clientsByPlan: {
      basic: CLIENT_TOKENS.filter(c => c.planType === 'basic').length,
      premium: CLIENT_TOKENS.filter(c => c.planType === 'premium').length,
      deluxe: CLIENT_TOKENS.filter(c => c.planType === 'deluxe').length
    }
  };
}
