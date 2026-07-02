'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, BrainCircuit, Search, Info, Globe2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'World Risk Map', href: '/map', icon: Map },
  { name: 'ML Indicators', href: '/ml', icon: BrainCircuit },
  { name: 'Country Deep-Dive', href: '/country', icon: Search },
  { name: 'Data Explorer', href: '/data', icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r border-slate-800 bg-[#060b19] h-screen sticky top-0 px-4 py-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-indigo-500/20 p-2 rounded-lg">
          <Globe2 className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">EWS</h1>
          <p className="text-[0.65rem] text-slate-400 font-semibold tracking-widest uppercase">Intelligence Platform</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-slate-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-slate-800 px-2 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Status</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Live
          </span>
        </div>
        
        <div className="text-center pb-2">
          <a 
            href="https://www.linkedin.com/in/ailesh-sharma-4616553a3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[0.7rem] text-slate-500 hover:text-indigo-400 font-medium tracking-wide transition-colors uppercase"
          >
            Made By Ailesh Sharma
          </a>
        </div>
      </div>
    </div>
  );
}
