// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, Maximize2, RotateCcw } from 'lucide-react';
import { CountryPanel } from '@/components/globe/CountryPanel';
import { Particles } from '@/components/Particles';
import dynamic from 'next/dynamic';

// Dynamically import the GlobeScene to prevent SSR issues with Three.js
const GlobeScene = dynamic(() => import('@/components/globe/GlobeScene').then(mod => mod.GlobeScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Initializing WebGL Engine...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedCountry, setClickedCountry] = useState<any>(null);

  useEffect(() => {
    // Completely Standalone Frontend Data Generation (No Backend Required)
    const generateIntelligenceData = () => {
      const nations = [
        "United States", "China", "Russia", "India", "United Kingdom",
        "France", "Germany", "Japan", "Brazil", "Israel",
        "Iran", "Saudi Arabia", "South Africa", "Turkey", "Egypt",
        "South Korea", "North Korea", "Pakistan", "Ukraine", "Taiwan"
      ];
      
      return nations.map((country, index) => {
        // Deterministic but varied scores for demo
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
    };

    setTimeout(() => {
      setData(generateIntelligenceData());
      setLoading(false);
    }, 500); // Simulate brief network loading for UI effect
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050816] text-slate-200 overflow-hidden font-sans">
      
      {/* Elegant Dot Particles */}
      <Particles />

      {/* 3D WebGL Globe */}
      <div className="absolute inset-0 z-0">
        {!loading && <GlobeScene data={data} setClickedCountry={setClickedCountry} />}
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

      {/* Floating Controls (Search removed as requested) */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-4 pointer-events-auto z-10">
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#0B1224]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] p-3 rounded-xl hover:bg-slate-800 transition-colors group">
            <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
          <button 
            onClick={() => document.documentElement.requestFullscreen()}
            className="bg-[#0B1224]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] p-3 rounded-xl hover:bg-slate-800 transition-colors group">
            <Maximize2 className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Right Slide-out Panel */}
      <CountryPanel 
        country={clickedCountry?.properties?.ADMIN || clickedCountry?.properties?.NAME} 
        data={data.find(d => d.country === clickedCountry?.properties?.ADMIN || d.country === clickedCountry?.properties?.NAME)} 
        onClose={() => setClickedCountry(null)} 
      />
    </div>
  );
}
