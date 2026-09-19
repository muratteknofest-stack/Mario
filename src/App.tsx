import { useEffect, useRef, useState } from 'react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let destroyed = false;
    
    async function initGame() {
      try {
        // WebGL desteğini kontrol et
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          throw new Error('WebGL desteklenmiyor. Lütfen modern bir tarayıcı kullanın.');
        }

        const { createGame } = await import('./game/main');
        if (destroyed || !containerRef.current) return;
        
        gameRef.current = createGame(containerRef.current);
        
        // Oyunun hazır olmasını bekle
        setTimeout(() => {
          if (!destroyed) setLoading(false);
        }, 1500);
      } catch (e: any) {
        if (!destroyed) {
          console.error('Oyun başlatma hatası:', e);
          setError(e.message || 'Oyun başlatılamadı. WebGL destekleniyor mu kontrol edin.');
          setLoading(false);
        }
      }
    }
    
    initGame();
    
    return () => {
      destroyed = true;
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true);
        } catch (e) {
          console.warn('Oyun kapatma hatası:', e);
        }
        gameRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Oyun Başlatılamadı</h1>
          <p className="mb-4 text-gray-300">{error}</p>
          <p className="text-sm text-gray-400 mb-4">
            Tarayıcınızın WebGL desteğini kontrol edin veya farklı bir tarayıcı deneyin.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="game-container" ref={containerRef} className="w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-teal-400 mb-2">KIVILCIM</h1>
            <p className="text-gray-400 mb-6 text-lg">Gök Yüzü Adaları</p>
            <div className="w-64 h-3 bg-slate-700 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-3">Yükleniyor...</p>
            <p className="text-xs text-gray-600 mt-2">Klikleyin veya bir tuşa basın</p>
          </div>
        </div>
      )}
    </div>
  );
}
