import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EWS | Crisis Early Warning System",
  description: "Enterprise-grade risk intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-200 antialiased font-sans min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-surface border-r border-slate-800 flex-shrink-0 flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <h1 className="text-2xl font-black text-primary tracking-tight">🌐 EWS</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Intelligence Platform</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <a href="/" className="block px-4 py-3 rounded-lg bg-primary-glow text-primary font-medium border-l-4 border-primary transition-all">
                Dashboard
              </a>
              <a href="#" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
                World Risk Map
              </a>
              <a href="#" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
                Machine Learning
              </a>
            </nav>
            <div className="p-4 text-xs text-slate-600 text-center border-t border-slate-800">
              Vercel + FastAPI Backend
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-background p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
