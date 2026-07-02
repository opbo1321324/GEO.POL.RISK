'use client';

import React from 'react';

const HEADLINES = [
  "GLOBAL MARKETS: EQUITIES RALLY AS INFLATION COOLS",
  "IMF REVISES GLOBAL GROWTH FORECAST TO 3.1% FOR 2024",
  "U.S. FED HOLDS INTEREST RATES STEADY, SIGNALS POSSIBLE CUTS LATER THIS YEAR",
  "EUROZONE AVOIDS RECESSION; ECB REMAINS CAUTIOUS ON INFLATION",
  "EMERGING MARKETS SEE CAPITAL INFLOWS AS DOLLAR WEAKENS",
  "OIL PRICES SURGE AMIDST RED SEA DISRUPTIONS",
  "CHINA ANNOUNCES NEW STIMULUS MEASURES TO BOOST REAL ESTATE SECTOR",
  "TECH STOCKS DRIVE S&P 500 TO RECORD HIGHS",
  "GLOBAL SUPPLY CHAINS RECOVERING DESPITE GEOPOLITICAL TENSIONS",
];

export function NewsTicker() {
  return (
    <div className="w-full bg-[#0b1121] border-b border-slate-800 flex items-center overflow-hidden h-10 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20">
      <div className="bg-red-600 h-full flex items-center px-4 font-bold text-xs uppercase tracking-widest text-white whitespace-nowrap z-10 shrink-0">
        <span className="animate-pulse mr-2">●</span> LIVE
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute whitespace-nowrap flex items-center h-full animate-[ticker_60s_linear_infinite]">
          {/* Duplicate headlines for seamless loop */}
          {[...HEADLINES, ...HEADLINES].map((headline, i) => (
            <React.Fragment key={i}>
              <span className="text-slate-300 font-mono text-xs uppercase px-8">
                {headline}
              </span>
              <span className="text-slate-600">|</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* CSS for the ticker animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
