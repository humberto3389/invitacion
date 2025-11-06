import { useState } from 'react';
import { validateClientToken, type ClientToken } from '../lib/auth-system';

interface ClientLoginProps {
  onLogin: (client: ClientToken) => void;
}

export default function ClientLogin({ onLogin }: ClientLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // En un sistema real, aquí validarías contra la base de datos
      // Por ahora usamos el token como contraseña
      const client = validateClientToken(password);
      
      if (client && client.subdomain === username.toLowerCase()) {
        onLogin(client);
      } else {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-slate-800 mb-2">
            Acceso Cliente
          </h1>
          <p className="text-slate-600">
            Ingresa tus credenciales para acceder a tu sitio de boda
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Usuario (Subdominio)
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="maria-juan"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white/50 text-slate-700 placeholder-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña (Token)
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu token de acceso"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white/50 text-slate-700 placeholder-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-gold to-amber-500 text-black font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Acceder'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              ¿No tienes acceso? Contacta al administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
