
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Wallet,
  Megaphone,
  Bot,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  UserCheck,
  ShieldCheck,
  Zap,
  MousePointer,
  ChevronRight,
  Maximize2,
  Sliders,
  PieChart,
  MessageSquare,
  FileText,
  ChevronDown,
  Globe // Added Globe
} from 'lucide-react';
import Navbar from './Navbar';

// --- UI Mockup Components (Realistic "Screenshots") ---

interface BrowserFrameProps {
  children?: React.ReactNode;
  title: string;
}

const BrowserFrame = ({ children, title }: BrowserFrameProps) => (
  <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] hover:shadow-noble-blue/20">
    <div className="bg-slate-800 p-3 flex items-center gap-3 border-b border-slate-700">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
      </div>
      <div className="flex-1 bg-slate-900/50 h-6 rounded text-[10px] text-slate-500 flex items-center px-3 font-mono">
        nobleclarity.app/{title.toLowerCase().replace(/\s/g, '-')}
      </div>
    </div>
    <div className="p-1 bg-slate-900 h-full relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_2px,3px_100%] opacity-20"></div>
      {children}
    </div>
  </div>
);

const DashboardMockup = () => (
  <div className="p-4 grid grid-cols-12 gap-3 h-64 bg-[#0b0e14]">
    {/* Sidebar */}
    <div className="col-span-2 bg-slate-800/30 rounded-lg h-full flex flex-col gap-2 p-2">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-6 bg-slate-700/50 rounded w-full"></div>)}
    </div>
    {/* Main */}
    <div className="col-span-10 flex flex-col gap-3">
      {/* Header */}
      <div className="h-8 bg-slate-800/30 rounded w-1/3"></div>
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-slate-800/50 rounded-lg p-2 flex flex-col justify-between border border-slate-700/50">
            <div className="h-3 w-1/2 bg-slate-600/50 rounded"></div>
            <div className="h-6 w-3/4 bg-noble-blue/20 rounded"></div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-700/50 p-3 relative flex items-end gap-2">
        <div className="absolute top-3 left-3 h-3 w-1/4 bg-slate-600/50 rounded"></div>
        {[40, 60, 45, 70, 65, 85, 80, 95].map((h, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-noble-blue/50 to-noble-blue rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    </div>
  </div>
);

const ScenarioMockup = () => (
  <div className="p-4 grid grid-cols-12 gap-4 h-64 bg-[#0b0e14]">
    <div className="col-span-4 flex flex-col gap-4 bg-slate-900 border-r border-slate-800 pr-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between"><div className="h-2 w-1/3 bg-slate-600 rounded"></div><div className="h-2 w-8 bg-slate-600 rounded"></div></div>
          <div className="h-1 bg-slate-700 rounded-full relative"><div className="absolute left-1/2 w-3 h-3 -top-1 bg-noble-blue rounded-full shadow-lg shadow-noble-blue/50"></div></div>
        </div>
      ))}
      <div className="mt-auto h-8 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[8px] text-slate-400">Run Simulation</div>
    </div>
    <div className="col-span-8 relative flex items-center justify-center">
      {/* Diverging Chart Lines */}
      <svg className="w-full h-full p-2 overflow-visible">
        <path d="M0,100 Q50,90 100,50 T200,20" fill="none" stroke="#00AEEF" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(0,174,239,0.5)]" />
        <path d="M0,100 Q50,100 100,110 T200,130" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
        <circle cx="200" cy="20" r="4" fill="#00AEEF" />
      </svg>
      <div className="absolute top-2 right-2 bg-slate-800 p-2 rounded border border-slate-700">
        <div className="h-2 w-16 bg-emerald-500/50 rounded mb-1"></div>
        <div className="h-4 w-12 bg-white/20 rounded"></div>
      </div>
    </div>
  </div>
);

const CashFlowMockup = () => (
  <div className="p-4 h-64 bg-[#0b0e14] flex flex-col gap-4">
    <div className="flex gap-4">
      <div className="flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700">
        <div className="h-2 w-12 bg-slate-500 rounded mb-2"></div>
        <div className="h-6 w-20 bg-emerald-400/20 rounded"></div>
      </div>
      <div className="flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700">
        <div className="h-2 w-12 bg-slate-500 rounded mb-2"></div>
        <div className="h-6 w-20 bg-rose-400/20 rounded"></div>
      </div>
      <div className="flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-500/10"></div>
        <div className="h-2 w-12 bg-amber-500/50 rounded mb-2 relative z-10"></div>
        <div className="h-6 w-10 bg-amber-500 rounded relative z-10 flex items-center justify-center text-[10px] font-bold text-black">4.2</div>
      </div>
    </div>
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 flex gap-1 items-end">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex-1 flex flex-col gap-1 justify-end h-full">
          <div className="w-full bg-emerald-500/80 rounded-sm" style={{ height: `${Math.random() * 40 + 20}%` }}></div>
          <div className="w-full bg-rose-500/80 rounded-sm" style={{ height: `${Math.random() * 30 + 10}%` }}></div>
        </div>
      ))}
    </div>
  </div>
);

const MarketingMockup = () => (
  <div className="p-4 h-64 bg-[#0b0e14] flex flex-col gap-4">
    <div className="flex gap-2 border-b border-slate-800 pb-2">
      <div className="px-3 py-1 bg-noble-blue text-[10px] text-white rounded-full">Paid Ads</div>
      <div className="px-3 py-1 bg-slate-800 text-[10px] text-slate-400 rounded-full">Email</div>
      <div className="px-3 py-1 bg-slate-800 text-[10px] text-slate-400 rounded-full">Social</div>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-4">
      <div className="bg-slate-800/20 rounded-lg p-3 relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-emerald-400 border-r-emerald-400 rotate-45"></div>
        <div className="absolute text-center">
          <div className="text-[8px] text-slate-500">ROI</div>
          <div className="text-sm font-bold text-emerald-400">320%</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-slate-800/30 p-2 rounded flex justify-between items-center">
          <div className="text-[10px] text-slate-400">CAC</div>
          <div className="text-xs font-bold text-white">$45</div>
        </div>
        <div className="bg-slate-800/30 p-2 rounded flex justify-between items-center">
          <div className="text-[10px] text-slate-400">LTV</div>
          <div className="text-xs font-bold text-emerald-400">$850</div>
        </div>
        <div className="bg-slate-800/30 p-2 rounded flex justify-between items-center">
          <div className="text-[10px] text-slate-400">Conv.</div>
          <div className="text-xs font-bold text-white">2.4%</div>
        </div>
      </div>
    </div>
  </div>
);

const AICoachMockup = () => (
  <div className="p-4 h-64 bg-[#0b0e14] flex flex-col">
    <div className="flex-1 space-y-3 overflow-hidden">
      <div className="flex gap-2">
        <div className="w-6 h-6 rounded-full bg-slate-700"></div>
        <div className="bg-slate-800 p-2 rounded-r-lg rounded-bl-lg text-[8px] text-slate-300 w-3/4">
          How can I improve my current ratio?
        </div>
      </div>
      <div className="flex gap-2 flex-row-reverse">
        <div className="w-6 h-6 rounded-full bg-noble-blue flex items-center justify-center"><Bot className="w-3 h-3 text-white" /></div>
        <div className="bg-noble-blue/10 border border-noble-blue/20 p-2 rounded-l-lg rounded-br-lg text-[8px] text-slate-300 w-3/4">
          Your current ratio is 1.2. To reach the industry benchmark of 1.8, consider reducing short-term debt or liquidating slow-moving inventory.
        </div>
      </div>
    </div>
    <div className="mt-3 bg-slate-800 p-2 rounded-full flex items-center justify-between px-3">
      <div className="h-1.5 w-1/2 bg-slate-600 rounded"></div>
      <div className="w-4 h-4 bg-noble-blue rounded-full"></div>
    </div>
  </div>
);

const GoalsMockup = () => (
  <div className="p-4 h-64 bg-[#0b0e14] grid grid-cols-2 gap-4">
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 relative">
      <div className="flex justify-between mb-2">
        <div className="h-2 w-12 bg-slate-500 rounded"></div>
        <div className="h-2 w-4 bg-emerald-500 rounded"></div>
      </div>
      <div className="h-8 w-16 bg-white/10 rounded mb-4"></div>
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full w-[70%] bg-emerald-500"></div>
      </div>
    </div>
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 relative opacity-60">
      <div className="flex justify-between mb-2">
        <div className="h-2 w-12 bg-slate-500 rounded"></div>
        <div className="h-2 w-4 bg-amber-500 rounded"></div>
      </div>
      <div className="h-8 w-16 bg-white/10 rounded mb-4"></div>
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full w-[40%] bg-amber-500"></div>
      </div>
    </div>
    <div className="col-span-2 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-[10px]">
      + Add New Goal
    </div>
  </div>
);

// --- Feature Section Component ---

interface FeatureSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  benefits: string[];
  whyNeed: string;
  howTo: string;
  personas: string[];
  Mockup: React.ElementType;
  reversed?: boolean;
}

const FeatureSection: React.FunctionComponent<FeatureSectionProps> = ({
  id, title, icon: Icon, description, benefits, whyNeed, howTo, personas, Mockup, reversed
}) => {
  return (
    <div id={id} className="min-h-screen flex items-center py-20 relative group">
      {/* Background Glow */}
      <div className={`absolute top-1/2 ${reversed ? 'left-0' : 'right-0'} w-[500px] h-[500px] bg-noble-blue/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none transition-opacity duration-1000 group-hover:bg-noble-blue/10`}></div>

      <div className={`max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>

        {/* Visual Column */}
        <div className={`order-2 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <BrowserFrame title={title}>
            <Mockup />
          </BrowserFrame>
        </div>

        {/* Text Column */}
        <div className={`space-y-8 order-1 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-noble-blue/10 flex items-center justify-center border border-noble-blue/20 shadow-lg shadow-noble-blue/5">
              <Icon className="w-8 h-8 text-noble-blue" />
            </div>
            <h2 className="text-4xl font-bold font-display text-white">{title}</h2>
          </div>

          <p className="text-lg text-slate-300 leading-relaxed border-l-4 border-noble-blue pl-6">
            {description}
          </p>

          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Key Benefits
              </h4>
              <ul className="space-y-3">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-noble-blue mt-1.5 shrink-0"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Why You Need It
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{whyNeed}</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MousePointer className="w-3 h-3" /> How to Use
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{howTo}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase py-1 mr-2">Built for:</span>
              {personas.map((p, i) => (
                <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const FeaturesPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'overview',
      title: 'Financial Health Dashboard',
      icon: LayoutDashboard,
      description: "Your centralized command center. We aggregate messy data into a crystal-clear, real-time snapshot of your business health using GAAP-compliant formulas.",
      benefits: [
        "Instantly visualize Profit vs. Loss without spreadsheets.",
        "Auto-calculated ratios (ROE, Net Margin, Current Ratio) compared to industry benchmarks.",
        "Identify critical liquidity issues before they become crises."
      ],
      whyNeed: "Business owners often drown in numbers but starve for insights. This dashboard cuts through the noise, giving you the 'Pulse' of your company in seconds.",
      howTo: "Simply input your monthly numbers or import a CSV. The dashboard automatically updates all charts, scores, and trend lines.",
      personas: ["CEOs", "Founders", "Investors", "Board Members"],
      Mockup: DashboardMockup
    },
    {
      id: 'scenario',
      title: 'Scenario Planner',
      icon: Sliders,
      description: "A Monte Carlo-style simulation engine. Test unlimited 'What If' scenarios to predict how strategic decisions will impact your bottom line over the next 12 months.",
      benefits: [
        "Simulate Recessions, Hypergrowth, or Hiring Sprees risk-free.",
        "Adjust drivers like Pricing, COGS efficiency, and Headcount with granular sliders.",
        "Visualize the 'Baseline' vs 'Projected' divergence instantly."
      ],
      whyNeed: "Hope is not a strategy. Entrepreneurs need to know exactly how a 10% drop in sales or a new hire will affect cash flow *before* making the decision.",
      howTo: "Navigate to the Planner tab. Select a preset (e.g., 'Survival Mode') or manually adjust growth and cost sliders to see the future.",
      personas: ["CFOs", "Strategists", "Risk Managers", "Startups"],
      Mockup: ScenarioMockup
    },
    {
      id: 'cashflow',
      title: 'Cash Flow & Runway',
      icon: Wallet,
      description: "The ultimate survival tool. We analyze your burn rate and projected collections to tell you exactly how much time you have left.",
      benefits: [
        "Precise Runway calculation in months/days.",
        "Visual breakdown of Inflow vs. Outflow bottlenecks.",
        "Interactive simulator to test how 'cutting costs' extends survival."
      ],
      whyNeed: "Cash is oxygen. Profitable businesses go bankrupt every day due to poor cash management. This tool is your early warning system.",
      howTo: "Review the 'Runway' metric on the Cash Flow tab. Use the Forecast Engine below it to simulate changes in monthly burn.",
      personas: ["Bootstrapped Founders", "Treasurers", "Small Business Owners"],
      Mockup: CashFlowMockup
    },
    {
      id: 'marketing',
      title: 'Marketing ROI Engine',
      icon: Megaphone,
      description: "Stop burning cash on ads that don't convert. Track the true profitability of every channel—Paid, Email, and Social—down to the dollar.",
      benefits: [
        "Calculate true CAC (Customer Acquisition Cost) and LTV (Lifetime Value).",
        "Compare channel efficiency side-by-side.",
        "Factor in 'hidden costs' like agency fees and team hours for true net profit."
      ],
      whyNeed: "Marketers often celebrate 'Likes' while the business loses money. This tool connects marketing activity directly to the P&L statement.",
      howTo: "Select a channel (e.g., Paid Ads). Enter spend and conversion data. The engine calculates ROI, ROAS, and Net Profit instantly.",
      personas: ["CMOs", "Growth Hackers", "Digital Agencies", "E-commerce"],
      Mockup: MarketingMockup
    },
    {
      id: 'aicoach',
      title: 'AI Financial Coach',
      icon: Bot,
      description: "A virtual CFO available 24/7. Powered by Google Gemini, it analyzes your specific data to provide plain-English strategic advice and answers.",
      benefits: [
        "Get explanations for complex financial ratios.",
        "Receive tailored advice on how to improve margins or liquidity.",
        "Draft executive summaries and investor updates automatically."
      ],
      whyNeed: "Not everyone can afford a $200k/year CFO. The AI Coach democratizes high-level financial intelligence for solo founders and students.",
      howTo: "Click the floating 'AI Coach' button. Ask questions like 'Why is my profit down?' or 'How do I improve valuation?'.",
      personas: ["Solo Founders", "Students", "Non-Financial Managers"],
      Mockup: AICoachMockup
    },
    {
      id: 'goals',
      title: 'Strategic Goal Tracker',
      icon: Target,
      description: "Turn ambition into action. Set GAAP-compliant financial targets and track your real-time progress towards revenue, profit, or efficiency milestones.",
      benefits: [
        "Visual progress bars for Revenue, Net Margin, and Asset accumulation.",
        "Deadline tracking to keep teams accountable.",
        "Celebratory animations when targets are hit."
      ],
      whyNeed: "What gets measured gets managed. Setting concrete financial targets aligns the entire team towards a singular 'North Star'.",
      howTo: "Go to 'Financial Goals'. Click 'New Goal', select a metric (e.g., $1M Revenue), set a target value and date. Watch it update live.",
      personas: ["Sales Leaders", "Teams", "Project Managers"],
      Mockup: GoalsMockup
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans overflow-x-hidden selection:bg-noble-blue/30 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-noble-blue/10 rounded-full blur-[120px] animate-float opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-float opacity-30 pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-noble-blue text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Zap className="w-3 h-3 fill-current" /> The Power Suite
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-['Montserrat'] mb-8 leading-tight animate-slide-up">
            <span className="block text-noble-blue text-sm uppercase tracking-widest mb-4">The Premium Business Growth Engine</span>
            Every Tool to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-noble-blue via-cyan-300 to-white">Optimize Your Market ROI</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Noble World is the leading <strong>predictive analytics for small business</strong> and enterprise. A comprehensive financial operating system designed to give you an unfair advantage in clarity, forecasting, and execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all border border-slate-700 flex items-center gap-2">
              Explore Features <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-noble-blue text-white rounded-xl font-bold hover:bg-noble-blue/90 transition-all shadow-lg shadow-noble-blue/25 flex items-center gap-2">
              Get Started Now <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="relative z-10 space-y-12">
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.id}
            {...feature}
            reversed={index % 2 !== 0}
          />
        ))}
      </div>

      {/* Report & Export Section (Mini Feature) */}
      <div className="py-32 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold font-display text-white mb-4">Professional Reporting</h2>
            <p className="text-slate-400 mb-6">
              Impress investors and stakeholders. Export comprehensive PDF reports containing all your charts, KPIs, and AI-generated insights with a single click.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-emerald-500" /> Board-ready formatting</li>
              <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-emerald-500" /> Includes Scenario projections</li>
              <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-emerald-500" /> AI Executive Summary included</li>
            </ul>
            <button onClick={() => navigate('/pricing')} className="text-emerald-400 font-bold flex items-center gap-2 hover:text-emerald-300 transition-colors">
              Try Reporting <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full"></div>
            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-4">
                <div className="text-2xl font-extrabold font-display">Executive Summary</div>
                <div className="text-xs font-mono">CONFIDENTIAL</div>
              </div>
              <div className="space-y-2 opacity-50 mb-6">
                <div className="h-2 w-full bg-slate-400 rounded"></div>
                <div className="h-2 w-full bg-slate-400 rounded"></div>
                <div className="h-2 w-2/3 bg-slate-400 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-slate-100 rounded border border-slate-200"></div>
                <div className="h-20 bg-slate-100 rounded border border-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <section className="py-32 px-6 border-t border-slate-800 bg-gradient-to-b from-[#0b0e14] to-slate-900 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight">
            Ready to See Your Business <br /> With <span className="text-noble-blue">Total Clarity?</span>
          </h2>
          <p className="text-xl text-slate-400">Join the thousands of professionals using Noble World to scale with confidence.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <button
              onClick={() => navigate('/pricing')}
              className="px-10 py-4 bg-white text-noble-deep rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
            >
              Get Started Now
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-10 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-slate-900 bg-[#0b0e14]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xs">N</div>
            <span>Noble World &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate('/api-docs')} className="hover:text-white transition-colors">API Docs</button>
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigate('/story')} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
