'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

// Mapping ISO alpha-3 to Lat/Long coordinates for the globe markers
const COUNTRY_COORDS: Record<string, [number, number]> = {
  "USA": [37.0902, -95.7129],
  "CHN": [35.8617, 104.1954],
  "JPN": [36.2048, 138.2529],
  "DEU": [51.1657, 10.4515],
  "IND": [20.5937, 78.9629],
  "GBR": [55.3781, -3.4360],
  "FRA": [46.2276, 2.2137],
  "ITA": [41.8719, 12.5674],
  "BRA": [-14.2350, -51.9253],
  "CAN": [56.1304, -106.3468],
  "RUS": [61.5240, 105.3188],
  "KOR": [35.9078, 127.7669],
  "AUS": [-25.2744, 133.7751],
  "MEX": [23.6345, -102.5528],
  "IDN": [-0.7893, 113.9213],
  "SAU": [23.8859, 45.0792],
  "TUR": [38.9637, 35.2433],
  "ARG": [-38.4161, -63.6167],
  "ZAF": [-30.5595, 22.9375],
};

export default function MapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/map`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch map data');
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let globe: any;
    if (canvasRef.current && !loading && !error) {
      let phi = 0;
      
      const markers = data.map(d => {
        const coords = COUNTRY_COORDS[d.iso_alpha3];
        if (!coords) return null;
        // Color scale from emerald to red based on risk_score (0-100)
        const risk = d.risk_score;
        let color = [0.1, 0.8, 0.3]; // Default Emerald
        if (risk > 75) color = [0.9, 0.1, 0.1]; // Red
        else if (risk > 50) color = [0.9, 0.6, 0.1]; // Orange
        else if (risk > 25) color = [0.9, 0.8, 0.1]; // Yellow
        
        return {
          location: coords,
          size: Math.max(0.05, risk / 100 * 0.15),
          color
        };
      }).filter(Boolean);

      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: canvasRef.current.clientWidth * 2,
        height: canvasRef.current.clientWidth * 2,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.05, 0.1, 0.2],
        markerColor: [1, 0.2, 0.2],
        glowColor: [0.1, 0.2, 0.4],
        markers: markers as any,
        onRender: (state) => {
          state.phi = phi;
          phi += 0.003;
        }
      });
    }

    return () => {
      if (globe) globe.destroy();
    };
  }, [loading, data, error]);

  if (error) {
    return (
      <div className="glass-panel p-8 text-center text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-lg font-bold">Map Failed to Load</h3>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-10rem)] flex flex-col">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Global Risk Interface</h1>
          <p className="text-slate-400">3D WebGL projection powered by Cobe.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#dc2626] shadow-[0_0_10px_#dc2626]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase">Extreme</span>
          </div>
        </div>
      </div>

      <div className="glass-panel flex-1 relative overflow-hidden flex items-center justify-center">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Calibrating 3D Projection...</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl aspect-square relative cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', contain: 'layout paint size', opacity: 1, transition: 'opacity 1s ease' }}
            />
          </div>
        )}
        
        {/* HUD Overlay */}
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <div className="bg-[#0f172a]/80 backdrop-blur border border-indigo-500/30 p-4 rounded-lg text-right">
            <div className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-1">System Status</div>
            <div className="text-sm text-indigo-400 font-mono">COBE ENGINE ACTIVE</div>
            <div className="text-xs text-slate-500 font-mono mt-1">DATA: IMF/ACLED 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
