
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/NobleContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const LandingPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');

  // Scenario Planner State
  const [adSpend, setAdSpend] = React.useState(65);
  const [salesTeam, setSalesTeam] = React.useState(4);

  // Simple calculation for the demo
  const projectedProfit = React.useMemo(() => {
    const base = 250000;
    const adReturn = adSpend * 2000; // arbitrary multiplier
    const salesReturn = salesTeam * 15000;
    return base + adReturn + salesReturn;
  }, [adSpend, salesTeam]);

  const handleAuth = (mode: 'login' | 'signup') => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode(mode);
      setIsAuthModalOpen(true);
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="bg-background-dark text-slate-200 font-display overflow-x-hidden selection:bg-primary/30 selection:text-white min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b-0 border-b-[#283339]/50 transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[20px]">diamond</span>
              </div>
              <span className="text-white text-lg font-bold tracking-tight">Noble Clarity</span>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('/features')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Product</button>
              <button onClick={() => navigate('/story')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Solutions</button>
              <button onClick={() => navigate('/api-docs')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Resources</button>
              <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</button>
            </nav>
            {/* Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">
                  <span>Dashboard</span>
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="hidden sm:flex text-slate-300 hover:text-white text-sm font-medium px-3 py-2 transition-colors">Log In</button>
                  <button onClick={() => navigate('/pricing')} className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">
                    <span>Get Started Now</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col w-full relative flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-hero-glow pointer-events-none"></div>
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="flex flex-col gap-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">EMPOWERING NEXT-GEN FOUNDERS</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight animate-fade-in-up delay-100">
                  Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Intelligence</span>,<br /> Refined.
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed max-w-lg animate-fade-in-up delay-200">
                  Predictive clarity for the modern enterprise. Unlock the power of AI-driven financial analysis with crystalline precision.
                </p>
                <div className="flex flex-wrap gap-4 pt-4 animate-fade-in-up delay-300">
                  <button onClick={() => user ? navigate('/dashboard') : navigate('/pricing')} className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary-dark text-white text-base font-bold transition-all shadow-lg shadow-primary/25 hover:scale-105 hover:shadow-primary/40">
                    <span>Get Started Now</span>
                    <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                  </button>
                  <button onClick={() => navigate('/features')} className="flex items-center justify-center rounded-lg h-12 px-6 bg-transparent border border-white/20 hover:bg-white/5 text-white text-base font-bold transition-all hover:scale-105">
                    <span className="material-symbols-outlined mr-2 text-[20px] text-primary">visibility</span>
                    <span>View Features</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-gray-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrLKMqARhpdtRfcncw3DCTLw0IpH7mQI6Pzkui58wHhovDQKy4d0xV6UGkR3iF5vwykBxA8wMNKDUX-ocwkvAGepP3cB-tNqOtLRT8QsYjZmDWbl5HVGOp3UJJfTW3UVaWp65Vz1OzAWDOjW7-hkmBwLlNB0S9DjMAXyyWrH_ABW4pdxLW4Y-x_69DUgFzlC1GGylOTDvGKg3KKRjEysPt_B3iuYs9iKYajzeB235AJ4-dRpqdQps-ilANk0xtfRKVtNY18hCi1ZQ')" }}></div>
                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-gray-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2TpbkXB1vybRTuX2_VRlO7LtiYyEIEmdBoYIKzbaoprmYP_0h99w7YfuiDmGFOCOJM6zgIOVWxZGWrthdISw0BCtJs1BRclHFIIvbImGj-gYinld9GJfwok3cf3DqBXoWAmaWt9OyJ3Er2rPB8D2ljylmSX-PzkD6rCzo2wO5IEQ_mfeKAsnnyOYlIP8zqBOg-GMPX0YNZQ-4_uMhc0INzqi_8SD4slLUCHb2cB243HZEonBwJLIrMaJuEsM5bKBAA5-rC91Z_sc')" }}></div>
                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-gray-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtG1DiFedMlUSAvLYBvYdmGYR7Mu1j5HXrDKwDYwu__tq0S27Z0KJKERFgjViKJgCmqjjnDxtjvYjON7r5ooZrsaHKvKX9wLZxiQlgx-l_e8xzmY7SwX9ijWjfvy58EIrGnnNqblwivg5CjfIf5e-MxtMPGZh1drrHvvMrkYtvRHe1yJuqU9AHkSd65C1gcvUkJKHQrliX0D_8EdDXTqMayTAB4pjgzzMyomieqg8Hiel6uuc_vAHtt8UNqMkhCbi99RFFCrruez8')" }}></div>
                  </div>
                  <p>Trusted by 500+ CFOs</p>
                </div>
              </div>

              {/* Hero Visual (Glassmorphic Dashboard) */}
              <div className="relative lg:h-[500px] flex items-center justify-center perspective-[1000px]">
                {/* Abstract Background Blobs */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-full blur-[60px]"></div>

                {/* Main Dashboard Card */}
                <div className="relative w-full max-w-md glass-card rounded-xl p-6 transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-500 animate-float">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-sm">analytics</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Q3 Projection</div>
                        <div className="text-xs text-slate-400">Updated 2m ago</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">+24.5%</span>
                  </div>

                  {/* Chart Area (Simulated) */}
                  <div className="relative h-48 w-full mb-6">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                      {/* Grid lines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="#283339" strokeWidth="0.5" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#283339" strokeWidth="0.5" />
                      <line x1="0" y1="40" x2="100" y2="40" stroke="#283339" strokeWidth="0.5" />

                      {/* Area Path */}
                      <path d="M0 45 C 20 40, 40 45, 60 25 S 80 10, 100 5 L 100 50 L 0 50 Z" fill="url(#gradientHero)" fillOpacity="0.3" />

                      {/* Line Path */}
                      <path d="M0 45 C 20 40, 40 45, 60 25 S 80 10, 100 5" fill="none" stroke="#0da6f2" strokeWidth="1.5" strokeLinecap="round" />

                      <defs>
                        <linearGradient id="gradientHero" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#0da6f2" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Floating Tooltip */}
                    <div className="absolute top-[10%] right-[10%] bg-slate-800 border border-white/10 p-3 rounded-lg shadow-xl max-w-[140px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-xs">auto_awesome</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">AI Insight</span>
                      </div>
                      <p className="text-xs text-white leading-snug">Recurring revenue velocity indicates a breakout month.</p>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Net MRR</p>
                      <p className="text-lg font-bold text-white">$482.5k</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Burn Rate</p>
                      <p className="text-lg font-bold text-white">0.8x</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Logos */}
        <section className="border-y border-white/5 bg-[#0e1214] py-8">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500 mb-6 font-medium">TRUSTED BY FORWARD-THINKING FINANCE TEAMS</p>

            <div className="carousel-container space-y-4">
              {/* Row 1: Forward Scroll */}
              <div className="carousel-track">
                {[
                  'HeyLisa_logo.png', 'aiden.png', 'alaba.png', 'ameerah.png', 'bodyfit.png',
                  'ceejees.png', 'ducex.png', 'evnnews.png', 'fabekeries.png', 'happsel.png',
                  'jolabride.png', 'mystaff.png', 'naal.png', 'noblehair.png', 'noblemart.png',
                  'opuforty.png'
                ].map((logo, index) => (
                  <div key={index} className="carousel-item">
                    <img
                      src={`/trusted/${logo}`}
                      alt={`Partner Logo ${index + 1}`}
                    />
                  </div>
                ))}
                {/* Duplicate Row 1 */}
                {[
                  'HeyLisa_logo.png', 'aiden.png', 'alaba.png', 'ameerah.png', 'bodyfit.png',
                  'ceejees.png', 'ducex.png', 'evnnews.png', 'fabekeries.png', 'happsel.png',
                  'jolabride.png', 'mystaff.png', 'naal.png', 'noblehair.png', 'noblemart.png',
                  'opuforty.png'
                ].map((logo, index) => (
                  <div key={`dup1-${index}`} className="carousel-item">
                    <img
                      src={`/trusted/${logo}`}
                      alt={`Partner Logo ${index + 1}-dup`}
                    />
                  </div>
                ))}
              </div>

              {/* Row 2: Reverse Scroll */}
              <div className="carousel-track reverse">
                {[
                  'pandon.png', 'perculairradio.png', 'praisemix.png', 'ptlnews.png', 'pureinsights.png',
                  'rapidbox.png', 'sijams.png', 'surebricks.png', 'thinkbeauty.png', 'tomfab.png',
                  'tradoconnect.png', 'wavecrest.png', 'wecas.png', 'wheels.png', 'yohako.png',
                  'zidanuel.png'
                ].map((logo, index) => (
                  <div key={index} className="carousel-item">
                    <img
                      src={`/trusted/${logo}`}
                      alt={`Partner Logo ${index + 17}`}
                    />
                  </div>
                ))}
                {/* Duplicate Row 2 */}
                {[
                  'pandon.png', 'perculairradio.png', 'praisemix.png', 'ptlnews.png', 'pureinsights.png',
                  'rapidbox.png', 'sijams.png', 'surebricks.png', 'thinkbeauty.png', 'tomfab.png',
                  'tradoconnect.png', 'wavecrest.png', 'wecas.png', 'wheels.png', 'yohako.png',
                  'zidanuel.png'
                ].map((logo, index) => (
                  <div key={`dup2-${index}`} className="carousel-item">
                    <img
                      src={`/trusted/${logo}`}
                      alt={`Partner Logo ${index + 17}-dup`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Growth Engine Features (Bento Grid) */}
        <section className="py-24 bg-background-dark relative">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Growth Engine</h2>
              <p className="text-slate-400 max-w-2xl text-lg">Powerful tools designed to accelerate decision making. From AI-driven coaching to intricate scenario planning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
              {/* Card 1: AI Coach */}
              <div className="group glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
                <div>
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Financial Coach</h3>
                  <p className="text-sm text-slate-400">Real-time chat interface for instant financial queries and audit trails.</p>
                </div>
                {/* Chat UI Mockup */}
                <div className="mt-6 flex flex-col gap-3">
                  <div className="self-end bg-primary/20 text-primary-dark rounded-l-xl rounded-tr-xl p-3 text-xs max-w-[85%] border border-primary/10">
                    How does increasing ad spend by 15% affect Q4 runway?
                  </div>
                  <div className="self-start bg-slate-800 text-slate-300 rounded-r-xl rounded-tl-xl p-3 text-xs max-w-[85%] border border-white/5 relative">
                    <div className="absolute -left-1 top-3 w-1 h-3 bg-purple-500 rounded-full"></div>
                    Based on current burn, a 15% increase reduces runway by 18 days but potentially increases MRR by 8% based on historical ROAS.
                    <div className="flex gap-1 mt-2">
                      <span className="block w-8 h-1 bg-purple-500/50 rounded-full animate-pulse"></span>
                      <span className="block w-4 h-1 bg-purple-500/30 rounded-full animate-pulse delay-75"></span>
                      <span className="block w-2 h-1 bg-purple-500/10 rounded-full animate-pulse delay-150"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Scenario Planner */}
              <div className="group glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-primary mb-4">
                      <span className="material-symbols-outlined">tune</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Scenario Planning</h3>
                    <p className="text-sm text-slate-400">Interactive slider to project profit based on ad spend scaling.</p>
                  </div>
                  <button className="text-xs font-bold text-primary border border-primary/20 px-3 py-1 rounded hover:bg-primary/10 transition-colors">
                    Export Model
                  </button>
                </div>

                {/* Interactive UI */}
                <div className="flex flex-col md:flex-row gap-8 items-center h-full justify-center">
                  <div className="w-full md:w-1/2 flex flex-col gap-6">
                    <div>
                      <label className="flex justify-between text-sm text-slate-300 mb-2 font-medium">
                        <span>Ad Spend Allocation</span>
                        <span className="text-primary font-bold">${Math.round(adSpend * (200000 / 100) / 1000)}k</span>
                      </label>
                      <input
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        type="range"
                        min="0"
                        max="100"
                        value={adSpend}
                        onChange={(e) => setAdSpend(parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="flex justify-between text-sm text-slate-300 mb-2 font-medium">
                        <span>Sales Team Expansion</span>
                        <span className="text-primary font-bold">{salesTeam} Heads</span>
                      </label>
                      <input
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        type="range"
                        min="0"
                        max="10"
                        value={salesTeam}
                        onChange={(e) => setSalesTeam(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 bg-background-dark rounded-xl p-5 border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Projected Profit</span>
                    <span className="text-4xl lg:text-5xl font-extrabold text-white mb-2">${projectedProfit.toLocaleString()}</span>
                    <span className="inline-flex items-center text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-sm mr-1">trending_up</span> +12.4% vs Baseline
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Unified Data */}
              <div className="group glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
                <div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Unified Data</h3>
                  <p className="text-sm text-slate-400">Consolidate multiple streams into a single source of truth.</p>
                </div>
                {/* Visual Representation */}
                <div className="relative h-48 w-full mt-4 flex items-center justify-center">
                  {/* Center Hub */}
                  <div className="relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-white text-3xl">database</span>
                  </div>
                  {/* Satellites */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center animate-bounce duration-[2000ms]">
                    <span className="material-symbols-outlined text-slate-400 text-sm">payments</span>
                  </div>
                  <div className="absolute bottom-4 right-8 w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center animate-bounce duration-[2500ms]">
                    <span className="material-symbols-outlined text-slate-400 text-sm">group</span>
                  </div>
                  <div className="absolute bottom-12 left-8 w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center animate-bounce duration-[3000ms]">
                    <span className="material-symbols-outlined text-slate-400 text-sm">ads_click</span>
                  </div>
                  {/* Connectors (SVG) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="25%" y1="20%" x2="50%" y2="50%" stroke="#283339" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="75%" y1="80%" x2="50%" y2="50%" stroke="#283339" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="25%" y1="70%" x2="50%" y2="50%" stroke="#283339" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>

              {/* Card 4: Security (Small) */}
              <div className="group glass-card rounded-2xl p-6 lg:col-span-2 flex items-center gap-6 hover:border-primary/30 transition-all duration-300">
                <div className="h-12 w-12 shrink-0 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Bank-Grade Security</h3>
                  <p className="text-sm text-slate-400">SOC2 Type II Certified. End-to-end encryption for all financial data.</p>
                </div>
                <div className="ml-auto hidden sm:block">
                  <span className="px-3 py-1 rounded border border-green-500/30 text-green-400 text-xs font-bold bg-green-500/5">SECURE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Visualization Suite */}
        <section className="py-24 bg-[#0e1214] border-t border-white/5">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Real-time Visibility</h2>
                <p className="text-slate-400">Monitor key performance indicators with vector precision.</p>
              </div>
              <button onClick={() => navigate('/dashboard')} className="text-primary text-sm font-bold flex items-center hover:text-white transition-colors">
                View Full Dashboard <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Chart 1: Revenue (Area) */}
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-white font-bold text-sm">Revenue Flow</h4>
                  <span className="text-slate-500 text-xs">Last 30 days</span>
                </div>
                <div className="h-40 w-full relative">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 100">
                    <defs>
                      <linearGradient id="chart1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#0da6f2" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0da6f2" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 80 C 40 70, 60 90, 100 50 S 160 30, 200 10 L 200 100 L 0 100 Z" fill="url(#chart1)" />
                    <path d="M0 80 C 40 70, 60 90, 100 50 S 160 30, 200 10" fill="none" stroke="#0da6f2" strokeWidth="2" />
                  </svg>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-2xl font-bold text-white">$2.4M</span>
                  <span className="text-xs text-green-400 font-medium">+12%</span>
                </div>
              </div>

              {/* Chart 2: Ad ROI (Radial Bar) */}
              <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-white font-bold text-sm">Ad Spend ROI</h4>
                  <span className="text-slate-500 text-xs">Campaign A</span>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="#1a2328" strokeWidth="12" />
                    <circle cx="64" cy="64" r="56" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="351" strokeDashoffset="80" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-white">4.2x</span>
                    <span className="text-[10px] text-slate-400 uppercase">ROAS</span>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-400">
                  <span>Target: 3.0x</span>
                  <span className="text-purple-400">Exceeding</span>
                </div>
              </div>

              {/* Chart 3: Financial Goals (Progress Ring/Bars) */}
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-white font-bold text-sm">Q4 Goals</h4>
                  <span className="text-slate-500 text-xs">82% Complete</span>
                </div>
                <div className="flex flex-col gap-6 justify-center h-full pb-4">
                  {/* Goal 1 */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300">ARR Growth</span>
                      <span className="text-white font-bold">88%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[88%] rounded-full"></div>
                    </div>
                  </div>
                  {/* Goal 2 */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300">Churn Reduction</span>
                      <span className="text-white font-bold">65%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 w-[65%] rounded-full"></div>
                    </div>
                  </div>
                  {/* Goal 3 */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300">Cash Flow Positive</span>
                      <span className="text-white font-bold">92%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 w-[92%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-background-dark relative overflow-hidden">
          {/* Decorate */}
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Growth Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="glass-card p-8 rounded-2xl flex flex-col gap-6 relative">
                <div className="absolute top-8 right-8 text-primary opacity-20">
                  <span className="material-symbols-outlined text-6xl">format_quote</span>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed italic z-10 relative">"Noble Clarity Engine gave us the confidence to scale our ad spend by 400%. The predictive models were accurate within a 2% margin of error."</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary/50" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqUH46wT5oOXwv1HncED8rYFJJ3Jqj871BycfLUW7C5GxoV8b9VBPJQfREdEzeSgyt_OS2H1nh9TxvbBQzO0Ky1UHhP1m0f19Cm5xR3z8MafT10XJ2a87N31F5w1YuZd_zhwEi7J03rOUAB1vpSiyhEj2T8akZ1BuxPp8MnSXBo3_jBnDf__BxFNwUtu7AmEBRELXKZp4My2nLPNYBtw5q47srWlwE5pDU9bXnvdQsZ4jc6ZmCIEFmM3K4UsGmhImt-S0eDDfRV4c')" }}></div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Elena Rodriguez</h5>
                    <p className="text-xs text-slate-500">CFO, TechFlow Inc.</p>
                  </div>
                  <div className="ml-auto bg-green-500/10 border border-green-500/20 px-3 py-1 rounded">
                    <span className="text-green-400 text-xs font-bold">+30% Efficiency</span>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="glass-card p-8 rounded-2xl flex flex-col gap-6 relative">
                <div className="absolute top-8 right-8 text-primary opacity-20">
                  <span className="material-symbols-outlined text-6xl">format_quote</span>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed italic z-10 relative">"The unified dashboard replaced five different tools we were using. It's not just about data visualization; it's about actual financial intelligence."</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary/50" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6wMtZWK51bmsIEhCDvt83t9XYERNsqYsXUENNgsZNWw5eOHMX74sHjL5exqxHssXQDxtokaQgU8GZuV-4k41LwtkN58KeYA9urtTL2bQd3bhtFXSj6ieX5dmSaPvJXtHFminnh0YKEIo1OjWLbWPD3H-1WNHMlZ5CJs-Y2yOjoFW8EklKit1nMKYOncMst_71irtD76O4dGZMwXsbUw7p5LwEoFkFLO-74NqbBMQnIEuXOXlzs6XfYIcQwaOu5tV1NFyln0LF2Vo')" }}></div>
                  <div>
                    <h5 className="text-white font-bold text-sm">David Chen</h5>
                    <p className="text-xs text-slate-500">Founder, ScaleUp</p>
                  </div>
                  <div className="ml-auto bg-green-500/10 border border-green-500/20 px-3 py-1 rounded">
                    <span className="text-green-400 text-xs font-bold">3x Revenue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer & Developer API */}
        <footer className="bg-[#05080a] border-t border-white/5 pt-16 pb-8">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 mb-16">
              {/* Brand & Links */}
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl">diamond</span>
                    <span className="text-white text-xl font-bold">Noble Clarity</span>
                  </div>
                  <p className="text-slate-500 max-w-sm">The financial operating system for the next generation of enterprise.</p>
                </div>
                <div className="grid grid-cols-3 gap-8 text-sm">
                  <div className="flex flex-col gap-3">
                    <span className="text-white font-bold">Product</span>
                    <button onClick={() => navigate('/features')} className="text-slate-500 hover:text-primary transition-colors text-left">Features</button>
                    <button onClick={() => navigate('/pricing')} className="text-slate-500 hover:text-primary transition-colors text-left">Pricing</button>
                    <button onClick={() => navigate('/changelog')} className="text-slate-500 hover:text-primary transition-colors text-left">Changelog</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-white font-bold">Company</span>
                    <a className="text-slate-500 hover:text-primary transition-colors" href="https://noblesworld.com.ng/about-us/" target="_blank" rel="noopener noreferrer">About</a>
                    <a className="text-slate-500 hover:text-primary transition-colors" href="https://noblesworld.com.ng/book-consultation/" target="_blank" rel="noopener noreferrer">Consult Us</a>
                    <a className="text-slate-500 hover:text-primary transition-colors" href="https://noblesworld.com.ng/contact-us/" target="_blank" rel="noopener noreferrer">Contact</a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-white font-bold">Legal</span>
                    <button onClick={() => navigate('/privacy')} className="text-slate-500 hover:text-primary transition-colors text-left">Privacy</button>
                    <button onClick={() => navigate('/terms')} className="text-slate-500 hover:text-primary transition-colors text-left">Terms</button>
                    <button onClick={() => navigate('/security')} className="text-slate-500 hover:text-primary transition-colors text-left">Security</button>
                  </div>
                </div>
              </div>
              {/* Developer API Preview */}
              <div className="bg-[#0f1519] rounded-xl border border-white/5 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">API Access</span>
                    <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 overflow-x-auto custom-scrollbar">
                  <pre className="text-xs font-mono leading-relaxed">
                    <span className="text-purple-400">const</span>{' '}<span className="text-blue-400">noble</span>{' '}<span className="text-slate-300">=</span>{' '}<span className="text-purple-400">require</span>(<span className="text-green-400">'noble-clarity-sdk'</span>);{'\n'}
                    {'\n'}
                    <span className="text-slate-500">// Initialize with Gemini 3.0 Flash Proxy</span>{'\n'}
                    <span className="text-purple-400">const</span>{' '}<span className="text-blue-400">client</span>{' '}<span className="text-slate-300">=</span>{' '}<span className="text-purple-400">new</span>{' '}<span className="text-yellow-200">NobleClient</span>({'{'}{'\n'}
                    {'  '}apiKey:{' '}<span className="text-green-400">process.env.NOBLE_API_KEY</span>,{'\n'}
                    {'  '}model:{' '}<span className="text-green-400">'gemini-3.0-flash'</span>{'\n'}
                    {'}'});{'\n'}
                    {'\n'}
                    <span className="text-slate-500">// Fetch Predictive Model</span>{'\n'}
                    <span className="text-purple-400">async function</span>{' '}<span className="text-blue-400">getForecast</span>(){' {'}{'\n'}
                    {'  '}<span className="text-purple-400">const</span>{' '}<span className="text-blue-400">report</span>{' '}<span className="text-slate-300">=</span>{' '}<span className="text-purple-400">await</span>{' '}<span className="text-blue-400">client</span>.<span className="text-yellow-200">predict</span>({'{'}{'\n'}
                    {'    '}metric:{' '}<span className="text-green-400">'MRR'</span>,{'\n'}
                    {'    '}horizon:{' '}<span className="text-green-400">'Q4'</span>,{'\n'}
                    {'    '}confidence:{' '}<span className="text-orange-400">0.95</span>{'\n'}
                    {'  }'});{'\n'}
                    {'  '}{'\n'}
                    {'  '}<span className="text-slate-300">console</span>.<span className="text-yellow-200">log</span>(<span className="text-blue-400">report</span>.json());{'\n'}
                    {'}'}
                  </pre>
                </div>
              </div>
            </div>
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-600 text-sm">© 2024 Noble Clarity Inc. All rights reserved.</p>
              <div className="flex gap-4">
                <a className="text-slate-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-xl">share</span></a>
                <a className="text-slate-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-xl">mail</span></a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
};

export default LandingPage;
