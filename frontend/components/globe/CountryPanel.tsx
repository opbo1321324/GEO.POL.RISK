'use client';

import { X, TrendingUp, AlertTriangle, Shield, Activity, DollarSign } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export function CountryPanel({ country, data, onClose }: { country: any, data: any, onClose: () => void }) {
  if (!country || !data) return null;

  const mockTrend = [
    { val: data.risk_score - 5 },
    { val: data.risk_score - 2 },
    { val: data.risk_score + 3 },
    { val: data.risk_score - 1 },
    { val: data.risk_score },
  ];

  const getRiskCategory = (score: number) => {
    if (score <= 25) return { label: 'LOW RISK', color: 'text-[#00E676]' };
    if (score <= 50) return { label: 'MEDIUM RISK', color: 'text-[#FFC107]' };
    if (score <= 75) return { label: 'HIGH RISK', color: 'text-[#FF7043]' };
    return { label: 'VERY HIGH RISK', color: 'text-[#F44336]' };
  };

  const risk = getRiskCategory(data.risk_score);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#050816]/95 backdrop-blur-xl border-l border-[rgba(255,255,255,0.08)] z-50 p-6 overflow-y-auto shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400 hover:text-white" />
        </button>

        <div className="flex items-center gap-4 mb-8 pt-2">
          <div className="w-12 h-8 bg-slate-800 rounded border border-slate-700 flex items-center justify-center overflow-hidden">
             <img src={`https://flagcdn.com/w80/${data.iso_alpha3 ? data.iso_alpha3.substring(0,2).toLowerCase() : 'xx'}.png`} alt={country} className="w-full h-full object-cover opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{country}</h2>
            <div className={`text-xs font-bold tracking-widest mt-1 ${risk.color}`}>{risk.label}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0B1224] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Overall Risk</div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{data.risk_score.toFixed(1)}</span>
              <span className="text-slate-500 mb-1">/ 100</span>
            </div>
          </div>
          
          <div className="bg-[#0B1224] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex flex-col justify-between">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Trend</div>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrend}>
                  <YAxis domain={['auto', 'auto']} hide />
                  <Line type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Decomposition</h3>
          
          {/* Economic */}
          <div className="bg-[#0B1224] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-500" /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-300">Economic</span>
                <span className="text-blue-400 font-mono text-sm">{data.gdp_growth > 0 ? '+' : ''}{data.gdp_growth.toFixed(1)}% GDP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '40%' }}></div></div>
            </div>
          </div>

          {/* Financial */}
          <div className="bg-[#0B1224] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-300">Financial</span>
                <span className="text-emerald-400 font-mono text-sm">{data.inflation.toFixed(1)}% Inf</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, data.inflation * 10)}%` }}></div></div>
            </div>
          </div>

          {/* Political */}
          <div className="bg-[#0B1224] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-300">Political</span>
                <span className="text-amber-400 font-mono text-sm">{data.protests} Events</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, data.protests)}%` }}></div></div>
            </div>
          </div>

          {/* Military */}
          <div className="bg-[#0B1224] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-lg"><Shield className="w-5 h-5 text-red-500" /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-300">Military</span>
                <span className="text-red-400 font-mono text-sm">{data.fatalities} Fatalities</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, data.fatalities / 10)}%` }}></div></div>
            </div>
          </div>

        </div>
        
        <button className="w-full mt-8 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Export Intelligence Brief
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
