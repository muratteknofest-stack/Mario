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
        const { createGame } = await import('./game/main');
        if (destroyed || !containerRef.current) return;
        gameRef.current = createGame(containerRef.current);
        setLoading(false);
      } catch (e: any) {
        if (!destroyed) {
          setError(e.message || 'Oyun başlatılamadı');
          setLoading(false);
        }
      }
    }
    
    initGame();
    
    return () => {
      destroyed = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Oyun Başlatılamadı</h1>
          <p className="mb-4 text-gray-300">{error}</p>
          <p className="text-sm text-gray-400 mb-4">WebGL destekleniyor mu kontrol edin.</p>
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
            <h1 className="text-3xl font-bold text-teal-400 mb-2">KIVILCIM</h1>
            <p className="text-gray-400 mb-4">Gök Yüzü Adaları</p>
            <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Yükleniyor...</p>
          </div>
        </div>
      )}
    </div>
  );
}
