// @ts-nocheck
'use client';

import { useEffect, useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { AlertCircle } from 'lucide-react';

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

  const colorScale = useMemo(() => {
    return scaleLinear()
      .domain([0, 25, 50, 75, 100])
      .range(["#10b981", "#f59e0b", "#ef4444", "#b91c1c", "#7f1d1d"] as any);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium">Rendering Global Map...</p>
        </div>
      </div>
    );
  }

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">World Risk Map</h1>
        <p className="text-slate-400">Interactive visualization of the Composite Risk Index.</p>
      </div>

      <div className="glass-panel p-6 relative">
        {tooltipContent && (
          <div className="absolute top-6 left-6 z-10 bg-[#0f172a]/90 backdrop-blur border border-slate-700 p-4 rounded-lg shadow-xl pointer-events-none min-w-[200px]">
            <p className="font-bold text-slate-200 mb-1">{tooltipContent.split(':')[0]}</p>
            <p className="text-sm text-slate-400">{tooltipContent.split(':')[1]}</p>
          </div>
        )}
        
        <div className="h-[600px] w-full bg-[#020817] rounded-xl overflow-hidden border border-slate-800">
          <ComposableMap
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: 147
            }}
            width={800}
            height={400}
            style={{ width: "100%", height: "100%" }}
          >
            <Sphere stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
            <Graticule stroke="rgba(255,255,255,0.02)" strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = data.find((s) => s.country === geo.properties.name || s.country === geo.properties.admin);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? colorScale(d.risk_score) : "#1e293b"}
                      stroke="#0f172a"
                      strokeWidth={0.5}
                      onMouseEnter={() => {
                        if (d) {
                          setTooltipContent(`${geo.properties.name}: Risk Score ${d.risk_score.toFixed(1)} (${d.risk_level})`);
                        } else {
                          setTooltipContent(`${geo.properties.name}: No data available`);
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      style={{
                        hover: {
                          fill: "#818cf8",
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#6366f1",
                          outline: "none",
                        },
                        default: {
                          outline: "none",
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
            <span className="text-sm text-slate-400">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#f59e0b]"></div>
            <span className="text-sm text-slate-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
            <span className="text-sm text-slate-400">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#7f1d1d]"></div>
            <span className="text-sm text-slate-400">Extreme Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
