'use client';

import { useEffect, useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import react-globe.gl to prevent SSR issues with WebGL
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Initializing 3D Globe Engine...</p>
      </div>
    </div>
  )
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

export default function MapPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [geoJson, setGeoJson] = useState<any>(null);
  
  // Dimensions for globe
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Adjust size based on container
    const handleResize = () => {
      const container = document.getElementById('globe-container');
      if (container) {
        setGlobeSize({ width: container.clientWidth, height: container.clientHeight });
      }
    };
    
    // Slight delay to allow layout to settle
    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Load GeoJSON for country polygons
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setGeoJson);

    // Load Risk Data
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

  const getCountryColor = (feature: any) => {
    const countryName = feature.properties.ADMIN;
    // Map some common naming differences
    const nameMap: any = {
      "United States of America": "United States",
      "People's Republic of China": "China",
      "Russian Federation": "Russia",
    };
    
    const searchName = nameMap[countryName] || countryName;
    const countryData = data.find(d => d.country === searchName);
    
    if (!countryData) return 'rgba(30, 41, 59, 0.4)'; // Default slate color
    
    // Colors matching our RISK_LEVELS
    if (countryData.risk_level === 'Extreme') return 'rgba(220, 38, 38, 0.8)'; // Red-600
    if (countryData.risk_level === 'High') return 'rgba(239, 68, 68, 0.8)'; // Red-500
    if (countryData.risk_level === 'Medium') return 'rgba(245, 158, 11, 0.8)'; // Amber-500
    return 'rgba(16, 185, 129, 0.8)'; // Emerald-500
  };

  const getCountryAltitude = (feature: any) => {
    const countryName = feature.properties.ADMIN;
    const nameMap: any = {
      "United States of America": "United States",
      "Russian Federation": "Russia",
    };
    const searchName = nameMap[countryName] || countryName;
    const countryData = data.find(d => d.country === searchName);
    
    // Higher risk = slightly raised polygon
    if (!countryData) return 0.01;
    return 0.01 + (countryData.risk_score / 100) * 0.08;
  };

  const getTooltip = (feature: any) => {
    const countryName = feature.properties.ADMIN;
    const nameMap: any = {
      "United States of America": "United States",
      "Russian Federation": "Russia",
    };
    const searchName = nameMap[countryName] || countryName;
    const countryData = data.find(d => d.country === searchName);
    
    if (!countryData) {
      return `
        <div style="background: rgba(15,23,42,0.9); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-weight: bold; color: white; margin-bottom: 4px;">${searchName}</div>
          <div style="color: #94a3b8; font-size: 12px;">No Data Available</div>
        </div>
      `;
    }

    return `
      <div style="background: rgba(15,23,42,0.9); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: monospace; min-width: 200px;">
        <div style="font-weight: bold; color: white; font-size: 14px; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 6px;">
          ${searchName} <span style="float:right; color: ${countryData.risk_color};">${countryData.risk_level}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #94a3b8;">COMPOSITE RISK</span>
          <span style="color: white; font-weight: bold;">${countryData.risk_score.toFixed(1)}/100</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #94a3b8;">GDP GROWTH</span>
          <span style="color: ${countryData.gdp_growth > 0 ? '#10b981' : '#ef4444'};">${countryData.gdp_growth.toFixed(1)}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #94a3b8;">INFLATION</span>
          <span style="color: white;">${countryData.inflation.toFixed(1)}%</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #94a3b8;">FATALITIES</span>
          <span style="color: ${countryData.fatalities > 1000 ? '#ef4444' : 'white'};">${countryData.fatalities.toLocaleString()}</span>
        </div>
      </div>
    `;
  };

  if (error) {
    return (
      <div className="glass-panel p-8 text-center text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-lg font-bold">Globe Failed to Load</h3>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-10rem)] flex flex-col">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Global Risk Interface</h1>
          <p className="text-slate-400">Interactive 3D visualization of the Composite Risk Index and Macroeconomic indicators.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"></div>
            <span className="text-xs font-bold text-slate-300 uppercase">Medium</span>
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

      <div className="glass-panel flex-1 relative overflow-hidden flex" id="globe-container">
        {(!geoJson || loading) ? (
          <div className="flex items-center justify-center w-full h-full">
             <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-400 font-medium">Calibrating Data & Rendering Polygons...</p>
              </div>
          </div>
        ) : (
          <div className="absolute inset-0 cursor-move">
            <Globe
              width={globeSize.width}
              height={globeSize.height}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              polygonsData={geoJson.features}
              polygonAltitude={getCountryAltitude}
              polygonCapColor={getCountryColor}
              polygonSideColor={() => 'rgba(0, 0, 0, 0.5)'}
              polygonStrokeColor={() => '#111'}
              polygonLabel={getTooltip}
              polygonsTransitionDuration={300}
              atmosphereColor="#6366f1"
              atmosphereAltitude={0.15}
            />
          </div>
        )}
        
        {/* HUD Overlay */}
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <div className="bg-[#0f172a]/80 backdrop-blur border border-indigo-500/30 p-4 rounded-lg text-right">
            <div className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-1">System Status</div>
            <div className="text-sm text-indigo-400 font-mono">ORBITAL TRACKING ACTIVE</div>
            <div className="text-xs text-slate-500 font-mono mt-1">DATA: IMF/ACLED 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
