'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Search } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

export default function CountryPage() {
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch country list
  useEffect(() => {
    fetch(`${API_URL}/api/countries`)
      .then(res => res.json())
      .then(d => setCountries(d))
      .catch(e => console.error("Failed to load country list", e));
  }, []);

  // Fetch specific country data
  useEffect(() => {
    if (!selectedCountry) return;
    setLoading(true);
    fetch(`${API_URL}/api/country/${encodeURIComponent(selectedCountry)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch country data');
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
  }, [selectedCountry]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Country Deep-Dive</h1>
          <p className="text-slate-400">Time-series analysis of macroeconomic and geopolitical factors.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none min-w-[250px]"
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center text-red-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold">Analysis Failed</h3>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-400">
          <p>No data available for {selectedCountry}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          
          {/* Main Risk vs GDP Chart */}
          <div className="glass-panel p-6 border-t-2 border-indigo-500">
            <h2 className="text-lg font-bold mb-6 text-slate-200">Composite Risk Index vs GDP Growth</h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8'}} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#475569" tick={{fill: '#94a3b8'}} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{fill: '#94a3b8'}} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="risk_score" name="Risk Score" stroke="#dc2626" strokeWidth={3} dot={{r:3}} />
                  <Line yAxisId="right" type="monotone" dataKey="gdp_growth" name="GDP Growth (%)" stroke="#10b981" strokeWidth={3} dot={{r:3}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inflation */}
            <div className="glass-panel p-6 border-t-2 border-emerald-500">
              <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-wider">Inflation Rate</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" hide />
                    <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12}} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="inflation" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Govt Debt */}
            <div className="glass-panel p-6 border-t-2 border-blue-500">
              <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-wider">Government Debt (% GDP)</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" hide />
                    <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12}} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="government_debt" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conflict Events */}
            <div className="glass-panel p-6 border-t-2 border-orange-500">
              <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-wider">Conflict Events</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" hide />
                    <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12}} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="conflict_events" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Interest Rates */}
            <div className="glass-panel p-6 border-t-2 border-purple-500">
              <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-wider">Interest Rate</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" hide />
                    <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12}} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="interest_rate" stroke="#a855f7" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
