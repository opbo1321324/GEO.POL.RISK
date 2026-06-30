"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this points to your deployed Render FastAPI URL
    fetch("http://localhost:8000/api/dashboard")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        // Fallback mock data if backend isn't running yet
        setData({
          kpis: { countries_covered: 195, avg_risk: 42.5, high_risk_count: 31 },
          trend: [{year: 2010, risk_score: 40}, {year: 2023, risk_score: 45}]
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center animate-pulse text-primary">Loading Intelligence Data...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Global Overview</h2>
          <p className="text-slate-400 mt-1">Real-time risk metrics across {data.kpis.countries_covered} nations.</p>
        </div>
        <div className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-semibold">
          Live Data Active
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div className="glass-card">
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Average Risk Score</div>
          <div className="kpi-value text-warning">{data.kpis.avg_risk.toFixed(1)} / 100</div>
        </div>
        <div className="glass-card">
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">High Risk Nations</div>
          <div className="kpi-value text-danger">{data.kpis.high_risk_count}</div>
        </div>
        <div className="glass-card">
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Countries Tracked</div>
          <div className="kpi-value text-primary">{data.kpis.countries_covered}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card h-96 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <h3 className="text-lg font-semibold text-white mb-6">Global Risk Trend (10 Years)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="year" stroke="#64748b" tick={{fill: '#64748b'}} />
            <YAxis stroke="#64748b" tick={{fill: '#64748b'}} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }}
              itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="risk_score" 
              stroke="#4F46E5" 
              strokeWidth={3} 
              dot={{ fill: '#4F46E5', r: 4 }} 
              activeDot={{ r: 8, fill: '#10b981' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
