'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, Globe2, Activity } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium">Loading Intelligence Data...</p>
          <p className="text-xs text-slate-500 mt-2">Connecting to secure API</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel p-8 text-center text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-lg font-bold">Connection Failed</h3>
        <p className="text-sm mt-2">Could not connect to {API_URL}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Global Overview</h1>
        <p className="text-slate-400">Real-time risk metrics across {data.kpis.countries_covered} nations ({data.kpis.latest_year}).</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Average Risk Score</p>
          <p className="text-4xl font-black text-amber-500">{data.kpis.avg_risk.toFixed(1)} <span className="text-lg text-slate-500 font-normal">/ 100</span></p>
        </div>
        
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-red-400" />
          </div>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">High Risk Nations</p>
          <p className="text-4xl font-black text-red-500">{data.kpis.high_risk_count}</p>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Avg Global Inflation</p>
          <p className="text-4xl font-black text-emerald-500">{data.kpis.avg_inflation ? data.kpis.avg_inflation.toFixed(1) + '%' : 'N/A'}</p>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe2 className="w-16 h-16 text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Countries Tracked</p>
          <p className="text-4xl font-black text-blue-400">{data.kpis.countries_covered}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-bold mb-6 text-slate-200">Global Risk Trend (10 Years)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8'}} axisLine={false} />
                <YAxis domain={['auto', 'auto']} stroke="#475569" tick={{fill: '#94a3b8'}} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk_score" 
                  name="Global Avg Risk" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Riskiest */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-6 text-slate-200">Top 10 Riskiest Nations</h2>
          <div className="space-y-4">
            {data.top_riskiest.map((item: any, i: number) => (
              <div key={item.country} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-sm w-4">{i + 1}</span>
                  <span className="font-medium text-slate-200">{item.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: item.risk_level === 'Extreme' ? '#dc2626' : item.risk_level === 'High' ? '#ef4444' : '#f59e0b' }}>
                    {item.risk_score.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
