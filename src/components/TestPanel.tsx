import { useState } from 'react';
import { getAllClients } from '../lib/auth-system';

export default function TestPanel() {
  const [selectedClient, setSelectedClient] = useState<string>('');

  const handleTestAccess = () => {
    if (!selectedClient) return;
    
    const client = getAllClients().find(c => c.subdomain === selectedClient);
    if (client) {
      // Simular acceso directo al subdominio
      const testUrl = `${window.location.origin}?test-subdomain=${client.subdomain}`;
      window.open(testUrl, '_blank');
    }
  };

  const handleDirectLogin = () => {
    if (!selectedClient) return;
    
    const client = getAllClients().find(c => c.subdomain === selectedClient);
    if (client) {
      // Simular login directo
      sessionStorage.setItem('clientAuth', JSON.stringify(client));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <h1 className="text-3xl font-serif text-slate-800 mb-6 text-center">
            Panel de Pruebas
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Selecciona un cliente para probar:
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-slate-700 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300"
              >
                <option value="">Selecciona un cliente...</option>
                {getAllClients().map((client) => (
                  <option key={client.id} value={client.subdomain}>
                    {client.clientName} ({client.subdomain}) - {client.planType.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {selectedClient && (
              <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-3">
                  Información del Cliente Seleccionado:
                </h3>
                {(() => {
                  const client = getAllClients().find(c => c.subdomain === selectedClient);
                  if (!client) return null;
                  
                  return (
                    <div className="text-xs text-blue-700 space-y-1">
                      <p><strong>Nombre:</strong> {client.clientName}</p>
                      <p><strong>Subdominio:</strong> {client.subdomain}</p>
                      <p><strong>Token:</strong> {client.token}</p>
                      <p><strong>Plan:</strong> {client.planType}</p>
                      <p><strong>Fecha de boda:</strong> {client.weddingDate.toLocaleDateString()}</p>
                      <p><strong>Acceso hasta:</strong> {client.accessUntil.toLocaleDateString()}</p>
                      <p><strong>Estado:</strong> {client.isActive ? 'Activo' : 'Inactivo'}</p>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleTestAccess}
                disabled={!selectedClient}
                className="bg-gradient-to-r from-gold to-amber-500 text-black font-semibold px-6 py-3 rounded-xl hover:from-amber-400 hover:to-gold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Probar Acceso por Subdominio
              </button>
              
              <button
                onClick={handleDirectLogin}
                disabled={!selectedClient}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Login Directo
              </button>
            </div>

            <div className="bg-green-50/50 border border-green-200/50 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-3">
                URLs de Prueba Disponibles:
              </h3>
              <div className="text-xs text-green-700 space-y-2">
                {getAllClients().map((client) => (
                  <div key={client.id} className="flex justify-between items-center">
                    <span>
                      <strong>{client.subdomain}.tu-dominio.com</strong>
                    </span>
                    <div className="text-right">
                      <div>Usuario: {client.subdomain}</div>
                      <div>Token: {client.token}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.location.href = '/master-admin'}
                className="bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold px-6 py-3 rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Ir a Master Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
