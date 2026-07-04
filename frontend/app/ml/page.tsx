'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, BrainCircuit } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

export default function MLPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/data/ml.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch ML data');
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.warn("Pipeline data not found.", e);
        setError("Pipeline ML data not found. Please run the backend pipeline.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-indigo-500 animate-pulse mb-4" />
          <p className="text-slate-400 font-medium">Running Machine Learning Models...</p>
          <p className="text-xs text-slate-500 mt-2">Random Forest & Logistic Regression</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel p-8 text-center text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-lg font-bold">ML Analysis Failed</h3>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Machine Learning Analysis</h1>
        <p className="text-slate-400">Predictive power of macroeconomic and geopolitical indicators.</p>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-indigo-500">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Random Forest AUC</p>
          <p className="text-4xl font-black text-indigo-400">{data.rf_auc.toFixed(3)}</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Logistic Regression AUC</p>
          <p className="text-4xl font-black text-emerald-400">{data.lr_auc.toFixed(3)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Chart */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-6 text-slate-200">Top Features (Composite Score)</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ranking.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#475569" tick={{fill: '#94a3b8'}} axisLine={false} />
                <YAxis dataKey="feature" type="category" width={120} stroke="#475569" tick={{fill: '#94a3b8'}} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="composite_score" name="Composite Score" radius={[0, 4, 4, 0]}>
                  {data.ranking.slice(0, 10).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.category === 'Macroeconomic' ? '#3b82f6' : entry.category === 'Financial' ? '#8b5cf6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 justify-center mt-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500"></span> Macroeconomic</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500"></span> Financial</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500"></span> Geopolitical</div>
          </div>
        </div>

        {/* Feature Ranking Table */}
        <div className="glass-panel p-6 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-slate-200">Indicator Predictive Power</h2>
          <div className="overflow-auto flex-1 pr-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase text-slate-500">
                  <th className="py-3 px-2 font-semibold">Rank</th>
                  <th className="py-3 px-2 font-semibold">Indicator</th>
                  <th className="py-3 px-2 font-semibold">RF Score</th>
                  <th className="py-3 px-2 font-semibold">LR Score</th>
                </tr>
              </thead>
              <tbody>
                {data.ranking.map((row: any) => (
                  <tr key={row.feature} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-2 text-slate-400">#{row.rank}</td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-slate-200">{row.feature}</div>
                      <div className="text-xs text-slate-500">{row.category}</div>
                    </td>
                    <td className="py-3 px-2 text-indigo-400 font-mono text-sm">{row.rf_importance}</td>
                    <td className="py-3 px-2 text-emerald-400 font-mono text-sm">{row.lr_importance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
