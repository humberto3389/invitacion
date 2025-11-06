# 🎉 Sistema de Alquiler de Sitios de Boda

Sistema profesional para crear y gestionar sitios de invitación de boda personalizados con acceso temporal por cliente.

## 🚀 Características Principales

### Para el Administrador Principal (Master Admin)

- ✅ **Gestión completa de clientes**: Crear, activar/desactivar, extender acceso
- ✅ **Planes de servicio**: Básico, Premium, Deluxe con diferentes duraciones
- ✅ **Estadísticas del negocio**: Ingresos, clientes activos, expirados
- ✅ **Generación automática de tokens**: Usuario y contraseña únicos por cliente
- ✅ **Control de acceso temporal**: Fechas de expiración automáticas

### Para los Clientes

- ✅ **Acceso por subdominio**: `cliente.tu-dominio.com`
- ✅ **Autenticación segura**: Usuario (subdominio) + Token (contraseña)
- ✅ **Sitio personalizado**: Datos específicos de su boda
- ✅ **Galería de fotos**: Subida y gestión de imágenes
- ✅ **RSVP**: Confirmación de asistencia de invitados
- ✅ **Mensajes**: Libro de visitas para invitados

## 🛠️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` con:

```env
# Dominio principal
VITE_MAIN_DOMAIN=tu-dominio.com

# Contraseñas de administración
VITE_MASTER_ADMIN_PASS=tu_contraseña_master
VITE_ADMIN_PASS=tu_contraseña_admin

# Supabase (opcional, para persistencia)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_key
```

### 2. Configuración de Subdominios

Para que funcionen los subdominios, configura tu DNS con:

```
*.tu-dominio.com → tu-servidor.com
```

### 3. Despliegue

```bash
npm run build
# Sube la carpeta dist/ a tu servidor
```

## 📋 Cómo Usar el Sistema

### Como Master Admin:

1. **Accede a Master Admin**: `tu-dominio.com/master-admin`
2. **Crea un nuevo cliente**:
   - Nombre: "Boda de María y Juan"
   - Subdominio: "maria-juan"
   - Fecha de boda: Selecciona la fecha
   - Plan: Elige entre Básico, Premium o Deluxe
3. **El sistema genera automáticamente**:
   - URL: `maria-juan.tu-dominio.com`
   - Usuario: `maria-juan`
   - Token: `boda-maria-juan-2024-xyz123`
4. **Comparte las credenciales** con tu cliente

### Como Cliente:

1. **Accede a tu sitio**: `maria-juan.tu-dominio.com`
2. **Inicia sesión** con:
   - Usuario: `maria-juan`
   - Contraseña: `boda-maria-juan-2024-xyz123`
3. **Personaliza tu sitio**:
   - Sube fotos a la galería
   - Configura datos de la boda
   - Ve las confirmaciones RSVP
   - Lee mensajes de invitados

## 💰 Planes de Servicio

| Plan        | Duración | Precio | Características                         |
| ----------- | -------- | ------ | --------------------------------------- |
| **Básico**  | 30 días  | $100   | Sitio web, Galería, RSVP, Mensajes      |
| **Premium** | 60 días  | $200   | + Countdown, Música de fondo            |
| **Deluxe**  | 90 días  | $300   | + Video de fondo, Animaciones avanzadas |

## 🔧 Funcionalidades Técnicas

### Sistema de Autenticación

- **Tokens únicos** por cliente con expiración automática
- **Validación por subdominio** para acceso directo
- **Sesiones persistentes** con sessionStorage
- **Logout automático** al expirar el acceso

### Base de Datos Multi-Cliente

- **Separación por cliente**: Cada cliente tiene sus propios datos
- **Buckets de galería**: Imágenes separadas por cliente
- **RSVPs filtrados**: Solo los del cliente autenticado
- **Mensajes personalizados**: Por cliente específico

### Seguridad

- **Contraseñas maestras** para administradores
- **Tokens únicos** difíciles de adivinar
- **Expiración automática** de accesos
- **Validación de subdominios** para prevenir acceso no autorizado

## 🎯 Flujo de Trabajo Recomendado

1. **Cliente te contacta** para contratar el servicio
2. **Creas el cliente** en Master Admin con sus datos
3. **Compartes URL y credenciales** con el cliente
4. **Cliente personaliza** su sitio durante el período contratado
5. **Acceso expira automáticamente** según el plan contratado
6. **Puedes extender** el acceso si es necesario

## 📞 Soporte

Para dudas o problemas:

- Revisa los logs en la consola del navegador
- Verifica que las variables de entorno estén configuradas
- Asegúrate de que los subdominios estén configurados en DNS

---

**¡Tu sistema de alquiler de sitios de boda está listo para generar ingresos! 🎉**
