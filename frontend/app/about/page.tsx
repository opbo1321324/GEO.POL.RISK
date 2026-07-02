export default function AboutPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">About the Developer</h1>
        <p className="text-slate-400">Creator of the Geopolitical & Economic Crisis Early Warning System.</p>
      </div>

      <div className="glass-panel p-8 md:p-12 border-t-4 border-t-indigo-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
          <div className="w-32 h-32 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl shrink-0 flex items-center justify-center text-indigo-400">
            <span className="text-4xl font-black tracking-tighter">AS</span>
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">Ailesh Sharma</h2>
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-6">Founder & Developer</p>
            
            <div className="prose prose-invert prose-slate max-w-none mb-8">
              <p className="text-slate-300 text-lg leading-relaxed">
                Ailesh Sharma is the creator and developer of the Geopolitical & Economic Crisis Early Warning System. The platform integrates macroeconomic indicators, conflict intelligence, and machine learning models to analyze geopolitical instability and provide data-driven risk assessments.
              </p>
            </div>
            
            <div className="mb-10">
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-b border-slate-800 pb-2">Professional Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['Geopolitics', 'International Relations', 'Economics', 'Artificial Intelligence', 'Machine Learning', 'Data Analytics', 'Financial Markets', 'Risk Modeling'].map((interest) => (
                  <span key={interest} className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-sm shadow-sm hover:border-indigo-500/50 hover:text-indigo-300 transition-colors cursor-default">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://www.linkedin.com/in/ailesh-sharma-4616553a3"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Ailesh Sharma's LinkedIn Profile"
                className="inline-flex justify-center items-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-[0_4px_14px_rgba(10,102,194,0.39)] hover:shadow-[0_6px_20px_rgba(10,102,194,0.23)] hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Connect on LinkedIn
              </a>
              <a 
                href="https://www.linkedin.com/in/ailesh-sharma-4616553a3"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Ailesh Sharma's LinkedIn Profile"
                className="inline-flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-lg font-bold transition-all border border-slate-600 hover:border-slate-500"
              >
                Visit LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
