
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  Shield,
  Target,
  TrendingUp,
  ArrowRight,
  Play,
  Zap,
  CheckCircle2,
  Lock,
  Globe,
  Star,
  Quote,
  BarChart,
  PieChart,
  Bot
} from 'lucide-react';
import { useUser } from '../contexts/NobleContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const LandingPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { reviews } = useUser();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');

  const handleAuth = (mode: 'login' | 'signup') => {
    if (user) {
      navigate('/dashboard');
    } else {
      if (mode === 'signup') {
        navigate('/pricing');
      } else {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
      }
    }
  };
  const [rev, setRev] = React.useState(50000);
  const [costs, setCosts] = React.useState(35000);
  const [growth, setGrowth] = React.useState(10);

  const projectedProfit = Math.round((rev * (1 + growth / 100)) - costs);
  const projectedMargin = ((projectedProfit / (rev * (1 + growth / 100))) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-white/5 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight hidden sm:block uppercase">Noble World</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button>
          <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Pricing</button>
          <button onClick={() => navigate('/story')} className="hover:text-white transition-colors">Company</button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleAuth('login')} className="text-sm font-medium hover:text-white transition-colors">Login</button>
          <button onClick={() => handleAuth('signup')} className="bg-noble-blue hover:bg-noble-blue/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-noble-blue/20">Launch Engine</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-8 overflow-hidden gradient-hero">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-noble-blue text-sm font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-current" /> Empowering Next-Gen Founders
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-['Montserrat'] leading-[1.1] tracking-tight">Master Your Business <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-noble-blue to-cyan-300">Financial Intelligence</span></h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">Join 500+ high-growth companies using Noble World to stop guessing and start scaling with AI-driven certainty.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button onClick={() => handleAuth('signup')} className="w-full sm:w-auto px-10 py-5 bg-noble-blue text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2">Get Started Now <ArrowRight size={20} /></button>
              <button onClick={() => navigate('/features')} className="w-full sm:w-auto px-10 py-5 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all border border-slate-700">View Features</button>
            </div>
          </div>

          {/* Simulator Card */}
          <div className="relative z-10 animate-float hidden lg:block">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-bold font-display mb-10">Profit Simulator</h3>
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Monthly Revenue</span><span className="font-bold">${rev.toLocaleString()}</span></div>
                  <input type="range" min="10000" max="200000" step="5000" value={rev} onChange={(e) => setRev(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-noble-blue" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Monthly Costs</span><span className="font-bold">${costs.toLocaleString()}</span></div>
                  <input type="range" min="5000" max="150000" step="5000" value={costs} onChange={(e) => setCosts(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Projected Profit</p>
                  <p className="text-3xl font-extrabold text-white">${projectedProfit.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Net Margin</p>
                  <p className="text-3xl font-extrabold text-noble-blue">{projectedMargin}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-8 border-t border-slate-900 bg-[#0b0e14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Complete Financial Clarity</h2>
            <p className="text-slate-400 text-lg">Everything you need to understand, plan, and grow your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-noble-blue/30 transition-all group">
              <div className="w-12 h-12 bg-noble-blue/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart className="w-6 h-6 text-noble-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live P&L Dashboard</h3>
              <p className="text-slate-400 leading-relaxed">Visualize your revenue, expenses, and margins in real-time. No more waiting for end-of-month reports.</p>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-noble-blue/30 transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Scenario Planner</h3>
              <p className="text-slate-400 leading-relaxed">Simulate "What If" scenarios. See how hiring, price changes, or a recession impacts your runway instantly.</p>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-noble-blue/30 transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Financial Coach</h3>
              <p className="text-slate-400 leading-relaxed">Get 24/7 strategic advice powered by Google Gemini. Ask complex questions and get plain-English answers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Success Stories Section */}
      <section id="reviews" className="py-32 px-8 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold font-display">Client Success Stories</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Genuine feedback from the entrepreneurs and financial leaders using Noble World.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative flex flex-col hover:border-noble-blue/30 transition-all group">
              <QuoteSVG className="absolute top-8 right-8 w-10 h-10 text-slate-800 group-hover:text-noble-blue/10 transition-colors" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-slate-700'}`}
                  />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed flex-1 italic mb-8">"{review.comment}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
                <img src={review.authorAvatar} alt="" className="w-12 h-12 rounded-full border border-slate-700 object-cover" />
                <div>
                  <p className="font-bold text-white text-sm">{review.authorName}</p>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">{review.authorRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-sm text-slate-500">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-noble-blue rounded-lg flex items-center justify-center text-white font-bold"><Globe className="w-4 h-4" /></div>
              <span className="font-bold text-white tracking-tight uppercase">Noble World</span>
            </div>
            <p className="max-w-xs leading-relaxed">Creating Brand's Visibility through financial intelligence.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><button onClick={() => navigate('/features')} className="hover:text-white">Analysis</button></li>
              <li><button onClick={() => navigate('/pricing')} className="hover:text-white">Pricing</button></li>
              <li><button onClick={() => navigate('/api-docs')} className="hover:text-white">API Docs</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-widest">Company</h4>
            <ul className="space-y-4">
              <li><button onClick={() => navigate('/story')} className="hover:text-white">Our Story</button></li>
              <li><button onClick={() => navigate('/security')} className="hover:text-white">Security</button></li>
              <li><button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-[10px]">
          &copy; {new Date().getFullYear()} The Noble’s Technology Services. All rights reserved.
        </div>
      </footer>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
};

const QuoteSVG = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H14.017C13.4647 8 13.017 8.44772 13.017 9V15C13.017 17.7614 15.2556 20 18.017 20H18.017V21H14.017ZM4.017 21L4.017 18C4.017 16.8954 4.91243 16 6.017 16H9.017C9.56928 16 10.017 15.5523 10.017 15V9C10.017 8.44772 9.56928 8 9.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V15C3.017 17.7614 5.25558 20 8.017 20H8.017V21H4.017Z" />
  </svg>
);

export default LandingPage;
