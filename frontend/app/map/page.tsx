// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from 'react-simple-maps';
import { AlertCircle } from 'lucide-react';
import { scaleLinear } from 'd3-scale';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tooltipContent, setTooltipContent] = useState('');

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

  const colorScale = scaleLinear<string>()
    .domain([0, 100])
    .range(["#10b981", "#ef4444"]); // Emerald to Red

  const getCountryData = (geoName: string) => {
    const nameMap: any = {
      "United States of America": "United States",
      "Russian Federation": "Russia",
    };
    const searchName = nameMap[geoName] || geoName;
    return data.find(d => d.country === searchName);
  };

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
          <p className="text-slate-400">Interactive orthographic projection of the Composite Risk Index.</p>
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

      <div className="glass-panel flex-1 relative overflow-hidden flex items-center justify-center">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Calibrating Projection...</p>
          </div>
        ) : (
          <div className="w-full h-full relative cursor-move">
            <ComposableMap
              projection="geoOrthographic"
              projectionConfig={{
                rotate: [-20, -20, 0],
                scale: 250
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup zoom={1}>
                <Sphere stroke="rgba(99,102,241,0.2)" strokeWidth={2} fill="#060b19" id="sphere" />
                <Graticule stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const d = getCountryData(geo.properties.name);
                      const color = d ? colorScale(d.risk_score) : "#1e293b";
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={color}
                          stroke="#0f172a"
                          strokeWidth={0.5}
                          onMouseEnter={() => {
                            if (d) {
                              setTooltipContent(
                                `${geo.properties.name} — Risk: ${d.risk_score.toFixed(1)} | GDP: ${d.gdp_growth > 0 ? '+' : ''}${d.gdp_growth.toFixed(1)}% | Fatalities: ${d.fatalities}`
                              );
                            } else {
                              setTooltipContent(`${geo.properties.name} — No Data`);
                            }
                          }}
                          onMouseLeave={() => setTooltipContent("")}
                          style={{
                            default: { outline: "none", transition: "all 250ms" },
                            hover: { fill: "#6366f1", outline: "none", cursor: "pointer", transition: "all 250ms" },
                            pressed: { fill: "#4f46e5", outline: "none" }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {tooltipContent && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#0f172a]/90 backdrop-blur border border-indigo-500/50 px-6 py-3 rounded-full text-white font-mono text-sm tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.3)] z-50 whitespace-nowrap pointer-events-none">
                {tooltipContent}
              </div>
            )}
          </div>
        )}
        
        {/* HUD Overlay */}
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <div className="bg-[#0f172a]/80 backdrop-blur border border-indigo-500/30 p-4 rounded-lg text-right">
            <div className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-1">System Status</div>
            <div className="text-sm text-indigo-400 font-mono">ORTHOGRAPHIC PROJECTION ACTIVE</div>
            <div className="text-xs text-slate-500 font-mono mt-1">DATA: IMF/ACLED 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
