// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { Maximize2, RotateCcw } from 'lucide-react';
import { CountryPanel } from '@/components/globe/CountryPanel';
import { Particles } from '@/components/Particles';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapPage() {
  const [data, setData] = useState<any[]>([]);
  const [clickedCountry, setClickedCountry] = useState<any>(null);

  useEffect(() => {
    // 100% Standalone Data - ZERO Backend Required
    const nations = [
      "United States", "China", "Russia", "India", "United Kingdom",
      "France", "Germany", "Japan", "Brazil", "Israel",
      "Iran", "Saudi Arabia", "South Africa", "Turkey", "Egypt",
      "South Korea", "North Korea", "Pakistan", "Ukraine", "Taiwan"
    ];
    
    const mockData = nations.map((country, index) => {
      const baseRisk = (index * 7 + 13) % 100; 
      return {
        country: country,
        risk_score: baseRisk,
        gdp_growth: (Math.random() * 6) - 2,
        inflation: Math.random() * 15,
        protests: Math.floor(Math.random() * 50),
        fatalities: Math.floor(Math.random() * 1000)
      };
    });

    setData(mockData);
  }, []);

  const getCountryColor = (geoName: string) => {
    const countryData = data.find((d: any) => d.country === geoName);
    if (!countryData) return '#1E293B'; // Slate 800 for no data
    
    const score = countryData.risk_score;
    if (score <= 25) return '#00E676';
    if (score <= 50) return '#FFC107';
    if (score <= 75) return '#FF7043';
    return '#F44336';
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050816] text-slate-200 overflow-hidden font-sans">
      
      <Particles />

      {/* STABLE, SIMPLE 2D FLAT MAP */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-20">
        <div className="w-full max-w-6xl opacity-90">
          <ComposableMap
            projection="geoEquirectangular"
            projectionConfig={{ scale: 140 }}
          >
            <Graticule stroke="#1E293B" strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(geo.properties.name)}
                    stroke="#050816"
                    strokeWidth={0.5}
                    onClick={() => setClickedCountry({ properties: { NAME: geo.properties.name } })}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#3B82F6", outline: "none", cursor: "pointer", transition: "all 250ms" },
                      pressed: { fill: "#2563EB", outline: "none" },
                    }}
                  />
                ))
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
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00E676] shadow-[0_0_12px_#00E676]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">Low Risk</span>
            <span className="text-[10px] font-mono text-slate-500">1 - 25</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FFC107] shadow-[0_0_12px_#FFC107]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">Medium</span>
            <span className="text-[10px] font-mono text-slate-500">26 - 50</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FF7043] shadow-[0_0_12px_#FF7043]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">High</span>
            <span className="text-[10px] font-mono text-slate-500">51 - 75</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#F44336] shadow-[0_0_12px_#F44336]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase w-24">Very High</span>
            <span className="text-[10px] font-mono text-slate-500">76 - 100</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 flex flex-col gap-4 pointer-events-auto z-10">
        <div className="flex gap-2">
          <button onClick={() => window.location.reload()} className="bg-[#0B1224]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] p-3 rounded-xl hover:bg-slate-800 transition-colors group">
            <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
          <button onClick={() => document.documentElement.requestFullscreen()} className="bg-[#0B1224]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] p-3 rounded-xl hover:bg-slate-800 transition-colors group">
            <Maximize2 className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      <CountryPanel 
        country={clickedCountry?.properties?.NAME} 
        data={data.find(d => d.country === clickedCountry?.properties?.NAME)} 
        onClose={() => setClickedCountry(null)} 
      />
    </div>
  );
}
