import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type ClientToken, validateClientToken, getClientBySubdomain } from '../lib/auth-system';

interface ClientAuthContextType {
  client: ClientToken | null;
  isAuthenticated: boolean;
  login: (client: ClientToken) => void;
  logout: () => void;
  checkSubdomainAccess: () => ClientToken | null;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

interface ClientAuthProviderProps {
  children: ReactNode;
}

export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const [client, setClient] = useState<ClientToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un cliente autenticado en sessionStorage
  useEffect(() => {
    const savedClient = sessionStorage.getItem('clientAuth');
    if (savedClient) {
      try {
        const clientData = JSON.parse(savedClient);
        const validatedClient = validateClientToken(clientData.token);
        if (validatedClient) {
          setClient(validatedClient);
          setIsAuthenticated(true);
        } else {
          // Token expirado o inválido
          sessionStorage.removeItem('clientAuth');
        }
      } catch (error) {
        sessionStorage.removeItem('clientAuth');
      }
    }
  }, []);

  const login = (clientData: ClientToken) => {
    setClient(clientData);
    setIsAuthenticated(true);
    sessionStorage.setItem('clientAuth', JSON.stringify(clientData));
  };

  const logout = () => {
    setClient(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('clientAuth');
  };

  const checkSubdomainAccess = (): ClientToken | null => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    if (parts.length <= 2) {
      // Estamos en el dominio principal
      return null;
    }
    
    const subdomain = parts[0];
    return getClientBySubdomain(subdomain);
  };

  return (
    <ClientAuthContext.Provider value={{
      client,
      isAuthenticated,
      login,
      logout,
      checkSubdomainAccess
    }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}
