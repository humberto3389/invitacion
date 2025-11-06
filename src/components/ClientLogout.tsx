import { useClientAuth } from '../contexts/ClientAuthContext';

export default function ClientLogout() {
  const { logout, client } = useClientAuth();

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  if (!client) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <p className="font-medium text-slate-700">{client.clientName}</p>
            <p className="text-xs text-slate-500">
              Acceso hasta: {client.accessUntil.toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
