// Sistema de base de datos multi-cliente
export interface ClientData {
  id: string;
  clientName: string;
  subdomain: string;
  weddingDate: Date;
  groomName: string;
  brideName: string;
  weddingLocation: string;
  weddingTime: string;
  bibleVerse: string;
  invitationText: string;
  isActive: boolean;
  createdAt: Date;
  accessUntil: Date;
}

// Función para obtener datos del cliente actual desde el contexto de autenticación
// Esta función debe ser llamada desde componentes que tengan acceso al contexto
export function getCurrentClientData(): ClientData | null {
  // Intentar obtener del sessionStorage (usado por ClientAuthContext)
  try {
    const savedClient = sessionStorage.getItem('clientAuth');
    if (savedClient) {
      const clientToken = JSON.parse(savedClient);
      
      // Convertir ClientToken a ClientData
      return {
        id: clientToken.id,
        clientName: clientToken.clientName,
        subdomain: clientToken.subdomain,
        weddingDate: new Date(clientToken.weddingDate),
        groomName: clientToken.groomName || 'Novio',
        brideName: clientToken.brideName || 'Novia',
        weddingLocation: clientToken.weddingLocation || 'Iglesia San José',
        weddingTime: clientToken.weddingTime || '6:00 PM',
        bibleVerse: clientToken.bibleVerse || 'El amor es paciente, es bondadoso… el amor nunca deja de ser.',
        invitationText: clientToken.invitationText || 'Están cordialmente invitados a celebrar con nosotros este día tan especial.',
        isActive: clientToken.isActive,
        createdAt: new Date(clientToken.createdAt),
        accessUntil: new Date(clientToken.accessUntil)
      };
    }
  } catch (error) {
    console.error('Error getting client data from session:', error);
  }
  
  return null;
}

// Función para personalizar datos del sitio según el cliente
export function customizeSiteData(clientData: ClientData) {
  return {
    // Datos para el Hero
    hero: {
      groomName: clientData.groomName,
      brideName: clientData.brideName,
      weddingDate: clientData.weddingDate,
      weddingTime: clientData.weddingTime,
      bibleVerse: clientData.bibleVerse,
      invitationText: clientData.invitationText
    },
    
    // Datos para la galería (se filtrarán por cliente)
    gallery: {
      bucketName: `gallery-${clientData.subdomain}`,
      clientId: clientData.id
    },
    
    // Datos para RSVP (se filtrarán por cliente)
    rsvp: {
      clientId: clientData.id,
      maxGuests: 100 // Según el plan
    },
    
    // Datos para mensajes (se filtrarán por cliente)
    messages: {
      clientId: clientData.id
    }
  };
}

// Función para crear bucket de galería específico para cada cliente
export async function createClientGalleryBucket(supabase: any, clientId: string) {
  const bucketName = `gallery-${clientId}`;
  
  try {
    // Crear bucket si no existe
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
    
    if (error && error.message !== 'Bucket already exists') {
      console.error('Error creating bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating gallery bucket:', error);
    return false;
  }
}

// Función para obtener imágenes de la galería del cliente
export async function getClientGalleryImages(supabase: any, clientId: string) {
  const bucketName = `gallery-${clientId}`;
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

// Función para subir imagen a la galería del cliente
export async function uploadClientGalleryImage(supabase: any, clientId: string, file: File) {
  const bucketName = `gallery-${clientId}`;
  const fileName = `${Date.now()}-${file.name}`;
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Función para eliminar imagen de la galería del cliente
export async function deleteClientGalleryImage(supabase: any, clientId: string, fileName: string) {
  const bucketName = `gallery-${clientId}`;
  
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// Función para obtener RSVPs del cliente
export async function getClientRSVPs(supabase: any, clientId: string) {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching RSVPs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }
}

// Función para obtener mensajes del cliente
export async function getClientMessages(supabase: any, clientId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Función para crear RSVP del cliente
export async function createClientRSVP(supabase: any, clientId: string, rsvpData: any) {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .insert([{
        ...rsvpData,
        client_id: clientId
      }]);
    
    if (error) {
      console.error('Error creating RSVP:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return null;
  }
}

// Función para crear mensaje del cliente
export async function createClientMessage(supabase: any, clientId: string, messageData: any) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...messageData,
        client_id: clientId
      }]);
    
    if (error) {
      console.error('Error creating message:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
}
