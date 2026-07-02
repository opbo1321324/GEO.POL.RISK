'use client';

import { Bell, Settings, User } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#060b19]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-end px-8 shrink-0">
      <div className="flex items-center gap-6">
        
        {/* Icons */}
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-indigo-400 transition-colors relative group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#060b19]"></span>
          </button>
          <button className="hover:text-indigo-400 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <a 
            href="https://www.linkedin.com/in/ailesh-sharma-4616553a3"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Ailesh Sharma's LinkedIn Profile"
            className="hover:text-[#0a66c2] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-slate-800"></div>

        {/* Profile Widget */}
        <Link href="/about" className="flex items-center gap-3 group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">Ailesh Sharma</p>
            <p className="text-xs text-slate-500 font-medium">Founder & Developer</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-colors shadow-sm relative">
            <User className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060b19]"></span>
          </div>
        </Link>
        
      </div>
    </header>
  );
}
