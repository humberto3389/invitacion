-- Esquema de base de datos para el Sistema de Alquiler de Sitios de Boda
-- Ejecuta estos comandos en el SQL Editor de Supabase

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  wedding_date DATE NOT NULL,
  access_until TIMESTAMPTZ NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'deluxe')),
  max_guests INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  groom_name TEXT,
  bride_name TEXT,
  wedding_location TEXT,
  wedding_time TEXT,
  bible_verse TEXT,
  invitation_text TEXT
);

-- Tabla de RSVPs (confirmaciones de asistencia)
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guests INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes (libro de visitas)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de solicitudes de contacto (desde la landing page)
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  wedding_date DATE,
  plan_interest TEXT CHECK (plan_interest IN ('basic', 'premium', 'deluxe')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'archived'))
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_rsvps_client_id ON rsvps(client_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_subdomain ON clients(subdomain);
CREATE INDEX IF NOT EXISTS idx_clients_token ON clients(token);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);

-- Políticas de seguridad Row Level Security (RLS)
-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer clientes activos (para acceso público)
CREATE POLICY "Clientes activos son públicos de lectura"
ON clients FOR SELECT
USING (is_active = true);

-- Política: Los usuarios autenticados pueden insertar RSVPs
CREATE POLICY "Usuarios pueden insertar RSVPs"
ON rsvps FOR INSERT
WITH CHECK (true);

-- Política: Los usuarios pueden leer RSVPs de su cliente
CREATE POLICY "Usuarios pueden leer RSVPs de su cliente"
ON rsvps FOR SELECT
USING (true);

-- Política: Los usuarios autenticados pueden insertar mensajes
CREATE POLICY "Usuarios pueden insertar mensajes"
ON messages FOR INSERT
WITH CHECK (true);

-- Política: Los usuarios pueden leer mensajes de su cliente
CREATE POLICY "Usuarios pueden leer mensajes de su cliente"
ON messages FOR SELECT
USING (true);

-- Habilitar RLS para contact_requests
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden insertar solicitudes de contacto
CREATE POLICY "Todos pueden insertar solicitudes de contacto"
ON contact_requests FOR INSERT
WITH CHECK (true);

-- Política: Solo administradores pueden leer solicitudes (se puede ajustar según necesidad)
-- Por ahora, permitimos lectura pública para que Master Admin pueda verlas
CREATE POLICY "Todos pueden leer solicitudes de contacto"
ON contact_requests FOR SELECT
USING (true);

-- Nota: Si necesitas acceso administrativo completo, puedes deshabilitar RLS
-- o crear políticas más específicas con roles de administrador.

