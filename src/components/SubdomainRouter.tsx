import { useEffect, useState } from 'react';
import { getClientBySubdomain, type ClientToken } from '../lib/auth-system';
import App from '../App';
import ClientNotFound from './ClientNotFound';
import ClientLogin from './ClientLogin';
import { useClientAuth } from '../contexts/ClientAuthContext';
import LandingPage from '../pages/LandingPage';

export default function SubdomainRouter() {
  const [client, setClient] = useState<ClientToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubdomain, setIsSubdomain] = useState(false);
  const { isAuthenticated, login } = useClientAuth();

  useEffect(() => {
    const hostname = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    const testSubdomain = urlParams.get('test-subdomain');
    
    // Verificar si estamos en el dominio principal de Vercel
    const isMainVercelDomain = hostname === 'invitacion-eight-cyan.vercel.app';
    
    // Verificar si estamos en un subdominio de Vercel
    const isVercelSubdomain = hostname.endsWith('.vercel.app') && !isMainVercelDomain;
    
    // Obtener el subdominio de la URL de Vercel
    let subdomain = testSubdomain;
    if (isVercelSubdomain) {
      subdomain = hostname.replace('.vercel.app', '').replace('-invitacion', '');
    }
    
    setIsSubdomain(isVercelSubdomain || !!testSubdomain);
    
    if (subdomain) {
      // Buscar el cliente por subdominio
      const clientData = getClientBySubdomain(subdomain);
      
      if (clientData) {
        setClient(clientData);
        // Si encontramos un cliente válido por subdominio, autenticarlo automáticamente
        if (!isAuthenticated) {
          login(clientData);
        }
      }
    }
    
    setLoading(false);
  }, [isAuthenticated, login]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando sitio de boda...</p>
        </div>
      </div>
    );
  }

  // Si estamos en el dominio principal, mostrar la landing page (página de marketing)
  if (!isSubdomain) {
    return <LandingPage />;
  }

  // Si estamos en un subdominio pero no encontramos el cliente
  if (!client) {
    return <ClientNotFound />;
  }

  // Si estamos en un subdominio pero el cliente no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <ClientLogin onLogin={login} />;
  }

  // Si encontramos el cliente y está autenticado, mostrar su sitio personalizado
  return <App clientData={client} />;
}
