import { useEffect, useState } from 'react';
import { getAllClients } from '../lib/auth-system';

export default function ClientNotFound() {
  const [subdomain, setSubdomain] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Obtener información de debug
    const hostname = window.location.hostname;
    let currentSubdomain = null;
    
    // Verificar si estamos en un subdominio de Vercel
    if (hostname.endsWith('.vercel.app') && hostname !== 'invitacion-eight-cyan.vercel.app') {
      currentSubdomain = hostname.replace('.vercel.app', '').replace('-invitacion', '');
    }
    
    setSubdomain(currentSubdomain || '');
    
    const clients = getAllClients();
    setDebugInfo({
      hostname,
      subdomain: currentSubdomain,
      totalClients: clients.length,
      activeClients: clients.filter(c => c.isActive).length,
      availableSubdomains: clients.map(c => c.subdomain)
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-serif text-slate-800 mb-4">
            Sitio No Encontrado
          </h1>
          
          <p className="text-slate-600 mb-6">
            El sitio de boda que buscas no existe o ha expirado.
          </p>

          {subdomain && (
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Información de Debug:
              </h3>
              <div className="text-xs text-blue-700 text-left space-y-1">
                <p><strong>Subdominio buscado:</strong> {subdomain}</p>
                <p><strong>Clientes disponibles:</strong> {debugInfo?.availableSubdomains.join(', ')}</p>
                <p><strong>Total clientes:</strong> {debugInfo?.totalClients}</p>
                <p><strong>Clientes activos:</strong> {debugInfo?.activeClients}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Posibles causas:
              </h3>
              <ul className="text-xs text-blue-700 space-y-1 text-left">
                <li>• El sitio ha expirado</li>
                <li>• La URL es incorrecta</li>
                <li>• El servicio no está activo</li>
                <li>• El subdominio no existe en el sistema</li>
              </ul>
            </div>
            
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-xs text-amber-700">
                Contacta al administrador para reactivar tu sitio o verificar la URL.
              </p>
            </div>

            <div className="bg-green-50/50 border border-green-200/50 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-2">
                Sitios de Prueba Disponibles:
              </h3>
              <div className="text-xs text-green-700 space-y-1">
                <p><strong>demo-invitacion.vercel.app</strong> - Usuario: demo, Contraseña: demo-token-2024</p>
                <p><strong>maria-juan-invitacion.vercel.app</strong> - Usuario: maria-juan, Contraseña: boda-maria-juan-2024-xyz123</p>
                <p><strong>ana-carlos-invitacion.vercel.app</strong> - Usuario: ana-carlos, Contraseña: boda-ana-carlos-2024-abc456</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => window.location.href = window.location.origin}
              className="w-full bg-gradient-to-r from-gold to-amber-500 text-black font-semibold px-6 py-3 rounded-2xl hover:from-amber-400 hover:to-gold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Ir al Sitio Principal
            </button>
            
            <button
              onClick={() => window.location.href = '/master-admin'}
              className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold px-6 py-3 rounded-2xl hover:from-slate-700 hover:to-slate-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Acceder como Master Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
