
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Compass, Users, Sparkles, Target, Zap } from 'lucide-react';

const StoryPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-noble-blue/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight">OUR STORY</span>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <div className="space-y-12">
          <header className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-noble-blue/10 border border-noble-blue/20 text-noble-blue text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Founded on Clarity
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-['Montserrat'] leading-tight">
              Democratizing <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-noble-blue to-purple-400">Financial Intelligence</span>
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              We believe every business owner deserves the same level of strategic insight as a Fortune 500 CEO.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-t border-slate-800">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                <Compass className="text-noble-blue" /> The Problem
              </h2>
              <p className="text-slate-400 leading-relaxed">
                For decades, professional financial analysis was locked behind expensive CFO salaries or complicated spreadsheets that took weeks to build. Small and medium enterprises were left "flying blind," making critical decisions based on intuition rather than data.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                <Target className="text-purple-400" /> Our Mission
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Noble World was born from a simple mission: to build an "Engine" that instantly translates complex bookkeeping into actionable strategy. By combining GAAP-standard financial principles with cutting-edge AI, we provide the clarity needed to scale with confidence.
              </p>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-noble-blue/5 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-3xl font-bold font-display mb-8">The Noble Standard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-noble-blue/20 rounded-xl flex items-center justify-center text-noble-blue">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-bold">Global Perspective</h3>
                <p className="text-xs text-slate-500">Supporting founders across 50+ countries and multiple currencies.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold">Human Centric</h3>
                <p className="text-xs text-slate-500">Built by entrepreneurs, for entrepreneurs. We value clarity over jargon.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold">AI Native</h3>
                <p className="text-xs text-slate-500">Leveraging Google Gemini to provide 24/7 strategic mentorship.</p>
              </div>
            </div>
          </section>

          <section className="text-center space-y-6 py-12">
            <h2 className="text-3xl font-bold font-display">Join the Movement</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Today, Noble World powers thousands of businesses worldwide, from solo founders to multi-national agencies. We invite you to see your numbers clearly for the first time.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 bg-noble-blue text-white rounded-2xl font-bold shadow-xl shadow-noble-blue/20 hover:scale-105 transition-transform"
            >
              Start Your Journey
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="py-20 px-8 border-t border-slate-800 bg-[#0b0e14]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-sm text-slate-500">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-noble-blue rounded-lg flex items-center justify-center text-white font-bold"><Globe className="w-4 h-4" /></div>
            <span className="font-bold text-white tracking-tight">NOBLE WORLD</span>
          </div>
          <p className="max-w-xs">Premium financial intelligence for the next generation of SME leaders.</p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-widest">Platform</h4>
          <ul className="space-y-4">
            <li><button onClick={() => navigate('/features')} className="hover:text-white">Features</button></li>
            <li><button onClick={() => navigate('/pricing')} className="hover:text-white">Pricing</button></li>
            <li><button onClick={() => navigate('/api-docs')} className="hover:text-white">API Docs</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-widest">Company</h4>
          <ul className="space-y-4">
            <li><button onClick={() => navigate('/story')} className="text-white">Our Story</button></li>
            <li><button onClick={() => navigate('/security')} className="hover:text-white">Security</button></li>
            <li><button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy Policy</button></li>
            <li><button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-[10px]">
        &copy; {new Date().getFullYear()} Noble World. All rights reserved.
      </div>
    </footer>
  );
};

export default StoryPage;
