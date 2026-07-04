'use client';
// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { AlertCircle, Maximize2, RotateCcw, Search } from 'lucide-react';
import { CountryPanel } from '@/components/globe/CountryPanel';
import { Particles } from '@/components/Particles';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clickedCountry, setClickedCountry] = useState<any>(null);
  const [rotation, setRotation] = useState(0);

  // Auto-spin the globe
  useEffect(() => {
    let animationFrameId: number;
    const rotate = () => {
      setRotation((r) => (r + 0.3) % 360);
      animationFrameId = requestAnimationFrame(rotate);
    };
    rotate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/map`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch intelligence data');
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

  const getCountryColor = (geoName: string) => {
    const countryData = data.find((d: any) => d.country === geoName);
    if (!countryData) return '#1E293B'; // Slate 800 for no data
    
    const score = countryData.risk_score;
    if (score <= 25) return '#00E676'; // Green
    if (score <= 50) return '#FFC107'; // Yellow
    if (score <= 75) return '#FF7043'; // Orange
    return '#F44336'; // Red
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#050816]">
        <div className="glass-panel p-8 text-center text-red-400 border border-red-500/30">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold uppercase tracking-widest">Connection Interrupted</h3>
          <p className="text-sm mt-2 opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050816] text-slate-200 overflow-hidden font-sans">
      
      {/* Elegant Dot Particles */}
      <Particles />

      {/* 3D SVG Globe */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-10">
        <div className="w-full max-w-4xl opacity-90 drop-shadow-[0_0_35px_rgba(59,130,246,0.2)]">
          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{
              scale: 300,
              rotate: [rotation, 0, 0],
            }}
          >
            <Sphere stroke="#1E293B" strokeWidth={0.5} fill="#0B1224" />
            <Graticule stroke="#1E293B" strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const color = getCountryColor(geo.properties.name);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={color}
                      stroke="#050816"
                      strokeWidth={0.5}
                      onClick={() => setClickedCountry({ properties: { NAME: geo.properties.name } })}
                      style={{
                        default: { outline: "none", transition: "all 250ms" },
                        hover: { fill: "#3B82F6", outline: "none", cursor: "pointer", transition: "all 250ms" },
                        pressed: { fill: "#2563EB", outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1 uppercase">Global Risk Matrix</h1>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <p className="text-blue-400/80 font-mono text-sm tracking-widest uppercase">Live Intelligence Feed Active</p>
          </div>
        </div>
        
        {/* Animated Legend */}
        <div className="glass-panel px-6 py-4 flex flex-col gap-3 backdrop-blur-md bg-[#0B1224]/80 border border-[rgba(255,255,255,0.08)] rounded-xl pointer-events-auto shadow-2xl">
          <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">Composite Risk Index</div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#00E676] shadow-[0_0_12px_#00E676]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">Low Risk</span>
            <span className="text-[10px] font-mono text-slate-500">1 - 25</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#FFC107] shadow-[0_0_12px_#FFC107]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">Medium</span>
            <span className="text-[10px] font-mono text-slate-500">26 - 50</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#FF7043] shadow-[0_0_12px_#FF7043]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">High</span>
            <span className="text-[10px] font-mono text-slate-500">51 - 75</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#F44336] shadow-[0_0_12px_#F44336]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">Very High</span>
            <span className="text-[10px] font-mono text-slate-500">76 - 100</span>
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-4 pointer-events-auto z-10">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search country..." 
            className="bg-[#0B1224]/80 border border-[rgba(255,255,255,0.08)] backdrop-blur-md text-white px-4 py-3 pl-11 rounded-xl w-64 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        </div>
        <div className="flex gap-2">
          <button className="bg-[#0B1224]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] p-3 rounded-xl hover:bg-slate-800 transition-colors group">
            <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
          <button className="bg-[#0B1224]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] p-3 rounded-xl hover:bg-slate-800 transition-colors group">
            <Maximize2 className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Right Slide-out Panel */}
      <CountryPanel 
        country={clickedCountry?.properties?.NAME} 
        data={data.find(d => d.country === clickedCountry?.properties?.NAME)} 
        onClose={() => setClickedCountry(null)} 
      />
    </div>
  );
}
