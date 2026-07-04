'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, Globe2, Activity } from 'lucide-react';
import { Particles } from '@/components/Particles';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/data/dashboard.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        // Fallback for development if json doesn't exist
        console.warn("Pipeline data not found, using fallback.", e);
        setData({
            kpis: { countries_covered: 0, avg_risk: 0, high_risk_count: 0, avg_inflation: 0 },
            top_riskiest: [],
            trend: []
        });
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
    <>
      <Particles />
      <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
        
        {/* Premium Profile Card */}
      <div className="glass-panel p-6 border-l-4 border-l-indigo-500 mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400 overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <span className="text-2xl font-black">AS</span>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#0a1122] flex items-center justify-center" title="Online">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Ailesh Sharma</h2>
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <p className="text-indigo-400 font-bold uppercase tracking-wider text-xs mb-2">Founder & Developer • Geopolitical & Economic Crisis Early Warning System</p>
            <p className="text-slate-400 text-sm max-w-2xl">Building AI-powered solutions for Geopolitical Risk Analysis, Economic Forecasting, and Early Warning Systems.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <a 
              href="https://www.linkedin.com/in/ailesh-sharma-4616553a3"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Ailesh Sharma's LinkedIn Profile"
              className="inline-flex items-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-[0_4px_14px_rgba(10,102,194,0.39)] hover:shadow-[0_6px_20px_rgba(10,102,194,0.23)] hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Global Overview</h1>
          <p className="text-slate-400">Real-time risk metrics across {data.kpis.countries_covered} nations (2026 Projections).</p>
        </div>
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

      {/* Dashboard Home Footer */}
      <div className="mt-12 pt-8 border-t border-slate-800 text-center pb-4">
        <p className="text-slate-500 font-medium text-sm mb-4">
          Designed and Developed by <span className="text-white font-bold tracking-wide">Ailesh Sharma</span>
        </p>
        <div className="flex items-center justify-center gap-6 text-slate-500">
          <a 
            href="https://www.linkedin.com/in/ailesh-sharma-4616553a3"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Ailesh Sharma's LinkedIn Profile"
            className="hover:text-[#0a66c2] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a 
            href="#"
            title="GitHub"
            className="hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a 
            href="#"
            title="Email"
            className="hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
        </div>
      </div>
      </div>
    </>
  );
}
