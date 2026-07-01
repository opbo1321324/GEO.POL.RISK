'use client';

import { useEffect, useState, useMemo } from 'react';
import { AlertCircle, Download, Database } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

export default function DataPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    fetch(`${API_URL}/api/full-data`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch full dataset');
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

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row => 
      row.country.toLowerCase().includes(searchTerm.toLowerCase()) || 
      row.year.toString().includes(searchTerm)
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const downloadCSV = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] !== null ? row[h] : ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ews_full_dataset.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <Database className="w-12 h-12 text-indigo-500 animate-pulse mb-4" />
          <p className="text-slate-400 font-medium">Fetching 2.5M Data Points...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-lg font-bold">Failed to load dataset</h3>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  // Determine columns dynamically (limit to important ones for UI)
  const columns = ["country", "year", "risk_score", "risk_level", "inflation", "gdp_growth", "government_debt", "conflict_events"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Data Explorer</h1>
          <p className="text-slate-400">Raw dataset access and CSV export.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search country or year..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[250px]"
          />
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel border border-slate-800 flex flex-col flex-1 min-h-0">
        <div className="overflow-auto flex-1 p-4 relative">
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-[#111928] z-10 shadow-md">
              <tr className="border-b border-slate-800 uppercase text-slate-500">
                {columns.map(c => (
                  <th key={c} className="py-3 px-4 font-semibold">{c.replace('_', ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr key={`${row.country}-${row.year}`} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors text-slate-300">
                  {columns.map(c => (
                    <td key={c} className="py-3 px-4">
                      {c === 'risk_score' ? (
                        <span className="font-mono text-indigo-400 font-bold">{(row[c] as number)?.toFixed(1)}</span>
                      ) : c === 'risk_level' ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: `${row.risk_color}20`, color: row.risk_color }}>
                          {row[c]}
                        </span>
                      ) : typeof row[c] === 'number' ? (
                        <span className="font-mono">{(row[c] as number).toFixed(2)}</span>
                      ) : (
                        row[c] || '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-slate-500">No records found matching "{searchTerm}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-[#0f172a]/50">
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-300 font-medium">{Math.min(filteredData.length, (page - 1) * rowsPerPage + 1)}</span> to <span className="text-slate-300 font-medium">{Math.min(filteredData.length, page * rowsPerPage)}</span> of <span className="text-slate-300 font-medium">{filteredData.length}</span> results
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 bg-slate-800 rounded text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              Prev
            </button>
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-slate-800 rounded text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
