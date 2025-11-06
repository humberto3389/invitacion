import { useEffect, useState } from 'react';

export default function DomainDebug() {
  const [domainInfo, setDomainInfo] = useState<any>(null);

  useEffect(() => {
    const info = {
      // Información completa de la URL
      fullUrl: window.location.href,
      hostname: window.location.hostname,
      origin: window.location.origin,
      pathname: window.location.pathname,
      search: window.location.search,
      
      // Análisis del dominio
      hostnameParts: window.location.hostname.split('.'),
      isSubdomain: window.location.hostname.split('.').length > 2,
      possibleSubdomain: window.location.hostname.split('.').length > 2 ? window.location.hostname.split('.')[0] : null,
      possibleMainDomain: window.location.hostname.split('.').length > 2 
        ? window.location.hostname.split('.').slice(1).join('.')
        : window.location.hostname,
      
      // Variables de entorno
      viteMainDomain: import.meta.env.VITE_MAIN_DOMAIN || 'No configurado',
      
      // Información del navegador
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    };
    
    setDomainInfo(info);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  if (!domainInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <h1 className="text-3xl font-serif text-slate-800 mb-6 text-center">
            🔍 Información del Dominio
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">📍 Información Básica</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-blue-700">URL Completa:</strong>
                  <div className="bg-white/50 p-2 rounded-lg mt-1 font-mono text-xs break-all">
                    {domainInfo.fullUrl}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(domainInfo.fullUrl)}
                    className="mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Copiar
                  </button>
                </div>
                
                <div>
                  <strong className="text-blue-700">Hostname:</strong>
                  <div className="bg-white/50 p-2 rounded-lg mt-1 font-mono text-xs">
                    {domainInfo.hostname}
                  </div>
                </div>
                
                <div>
                  <strong className="text-blue-700">Origen:</strong>
                  <div className="bg-white/50 p-2 rounded-lg mt-1 font-mono text-xs">
                    {domainInfo.origin}
                  </div>
                </div>
              </div>
            </div>

            {/* Análisis del Dominio */}
            <div className="bg-green-50/50 border border-green-200/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4">🎯 Análisis del Dominio</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-green-700">¿Es un subdominio?</strong>
                  <div className={`p-2 rounded-lg mt-1 text-xs font-medium ${
                    domainInfo.isSubdomain ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {domainInfo.isSubdomain ? 'SÍ' : 'NO'}
                  </div>
                </div>
                
                {domainInfo.isSubdomain && (
                  <>
                    <div>
                      <strong className="text-green-700">Subdominio detectado:</strong>
                      <div className="bg-white/50 p-2 rounded-lg mt-1 font-mono text-xs">
                        {domainInfo.possibleSubdomain}
                      </div>
                    </div>
                    
                    <div>
                      <strong className="text-green-700">Dominio principal:</strong>
                      <div className="bg-white/50 p-2 rounded-lg mt-1 font-mono text-xs">
                        {domainInfo.possibleMainDomain}
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <strong className="text-green-700">Partes del hostname:</strong>
                  <div className="bg-white/50 p-2 rounded-lg mt-1">
                    {domainInfo.hostnameParts.map((part: string, index: number) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-amber-800 mb-4">⚙️ Configuración</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-amber-700">VITE_MAIN_DOMAIN:</strong>
                  <div className={`p-2 rounded-lg mt-1 font-mono text-xs ${
                    domainInfo.viteMainDomain === 'No configurado' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {domainInfo.viteMainDomain}
                  </div>
                </div>
                
                <div className="bg-white/50 p-3 rounded-lg">
                  <strong className="text-amber-700">Para configurar tu dominio:</strong>
                  <div className="mt-2 text-xs text-amber-600">
                    <p>1. Crea un archivo <code>.env.local</code></p>
                    <p>2. Agrega: <code>VITE_MAIN_DOMAIN={domainInfo.possibleMainDomain}</code></p>
                    <p>3. Reinicia el servidor de desarrollo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* URLs de Prueba */}
            <div className="bg-purple-50/50 border border-purple-200/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-purple-800 mb-4">🧪 URLs de Prueba</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-700">Para probar subdominios:</strong>
                  <div className="space-y-2 mt-2">
                    <div className="bg-white/50 p-2 rounded-lg font-mono text-xs">
                      demo.{domainInfo.possibleMainDomain}
                    </div>
                    <div className="bg-white/50 p-2 rounded-lg font-mono text-xs">
                      maria-juan.{domainInfo.possibleMainDomain}
                    </div>
                    <div className="bg-white/50 p-2 rounded-lg font-mono text-xs">
                      ana-carlos.{domainInfo.possibleMainDomain}
                    </div>
                  </div>
                </div>
                
                <div>
                  <strong className="text-purple-700">Panel de pruebas:</strong>
                  <div className="bg-white/50 p-2 rounded-lg mt-1 font-mono text-xs">
                    {domainInfo.origin}/test
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-x-4">
            <button
              onClick={() => window.location.href = '/test'}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Ir al Panel de Pruebas
            </button>
            
            <button
              onClick={() => window.location.href = '/master-admin'}
              className="bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold px-6 py-3 rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Master Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
