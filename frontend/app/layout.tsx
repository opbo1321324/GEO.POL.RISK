import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { NewsTicker } from "@/components/NewsTicker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "EWS Dashboard",
  description: "Geopolitical & Economic Crisis Early Warning System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col h-screen bg-[#020817] text-slate-200 overflow-hidden font-sans antialiased">
        <NewsTicker />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020817] to-[#020817] flex flex-col relative">
            <Header />
            <div className="max-w-7xl mx-auto w-full p-8 flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
