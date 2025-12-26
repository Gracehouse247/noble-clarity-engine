
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Code2,
  Terminal,
  Key,
  Globe,
  ShieldCheck,
  Cpu,
  Webhook,
  Copy,
  Check,
  Zap,
  BookOpen,
  Layers,
  Database
} from 'lucide-react';

const CodeBlock = ({ code, language = 'javascript' }: { code: string, language?: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800 my-4 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{language}</span>
        <button onClick={handleCopy} className="text-slate-500 hover:text-white transition-colors">
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const Section = ({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) => (
  <section id={id} className="py-12 border-b border-slate-800/50 last:border-0 scroll-mt-24">
    <h2 className="text-2xl font-bold font-['Montserrat'] text-white mb-6 flex items-center gap-3">
      {title}
    </h2>
    <div className="prose prose-invert max-w-none text-slate-400 text-sm leading-relaxed">
      {children}
    </div>
  </section>
);

const ApiDocsPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-noble-blue/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center shadow-lg shadow-noble-blue/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight uppercase">API DOCUMENTATION</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Platform</span>
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-noble-blue hover:bg-noble-blue/90 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg"
          >
            Launch Console
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:w-64 shrink-0 hidden lg:block sticky top-32 h-fit">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-4 px-3">Introduction</p>
            {[
              { id: 'welcome', label: 'Welcome', icon: BookOpen },
              { id: 'auth', label: 'Authentication', icon: Key },
              { id: 'rate-limits', label: 'Rate Limits', icon: Zap },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all group text-left"
              >
                <item.icon size={18} className="text-slate-500 group-hover:text-noble-blue transition-colors" /> {item.label}
              </button>
            ))}
            <div className="pt-8">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-4 px-3">Endpoints</p>
              {[
                { id: 'profiles', label: 'Business Profiles', icon: Layers },
                { id: 'financials', label: 'Financial Data', icon: Database },
                { id: 'analysis', label: 'AI Analysis', icon: Cpu },
                { id: 'webhooks', label: 'Webhooks', icon: Webhook },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all group text-left"
                >
                  <item.icon size={18} className="text-slate-500 group-hover:text-noble-blue transition-colors" /> {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Section id="welcome" title="Welcome to Noble World API">
            <p className="text-lg text-slate-300 mb-6">
              The Noble World API allows you to programmatically access your financial data, manage business entities, and trigger AI-powered strategic analysis directly from your own applications or internal ERP systems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <Globe className="text-noble-blue mb-3" size={24} />
                <h4 className="font-bold text-white mb-1 text-sm">RESTful Architecture</h4>
                <p className="text-xs">Predictable, resource-oriented URLs using standard HTTP response codes.</p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <ShieldCheck className="text-emerald-400 mb-3" size={24} />
                <h4 className="font-bold text-white mb-1 text-sm">Enterprise Security</h4>
                <p className="text-xs">End-to-end TLS 1.3 encryption and scoped API key permissions.</p>
              </div>
            </div>
            <div className="p-4 bg-noble-blue/10 border border-noble-blue/20 rounded-xl flex gap-4 items-start">
              <div className="p-2 bg-noble-blue/20 rounded-lg"><Terminal size={20} className="text-noble-blue" /></div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Base Endpoint</h4>
                <code className="text-noble-blue font-mono text-sm">https://clarity.noblemart.com.ng/api</code>
              </div>
            </div>
          </Section>

          <Section id="auth" title="Authentication">
            <p>
              Access to the Noble World API is managed via API Keys. These keys must be sent in the <code>Authorization</code> header as a Bearer token.
            </p>
            <CodeBlock language="http" code={`POST /api/gemini HTTP/1.1
Host: clarity.noblemart.com.ng
Authorization: Bearer NOBLE_API_KEY_HERE
Content-Type: application/json`} />
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 mt-6">
              <Key className="text-amber-500 shrink-0" size={20} />
              <p className="text-xs text-amber-200">
                <strong>Warning:</strong> Keep your API keys secret. Do not share them in publicly accessible areas such as GitHub, client-side code, or documentation. Enterprise users can rotate keys via the Developer Dashboard.
              </p>
            </div>
          </Section>

          <Section id="rate-limits" title="Rate Limits">
            <p>
              Our API implements rate limiting to ensure platform stability. Limits are based on your plan:
            </p>
            <div className="overflow-x-auto my-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Limit</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr><td className="py-3 px-4 text-white">Starter</td><td className="py-3 px-4">60 requests</td><td className="py-3 px-4">per minute</td></tr>
                  <tr><td className="py-3 px-4 text-white font-bold">Growth</td><td className="py-3 px-4">300 requests</td><td className="py-3 px-4">per minute</td></tr>
                  <tr><td className="py-3 px-4 text-purple-400 font-bold">Enterprise</td><td className="py-3 px-4">Custom</td><td className="py-3 px-4">Tailored</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="profiles" title="Business Profiles">
            <p>Retrieve a list of all your managed business entities or create new ones.</p>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">Get</span>
                  <code className="text-slate-200 text-xs">/profiles</code>
                </div>
                <CodeBlock language="javascript" code={`const response = await fetch('https://clarity.noblemart.com.ng/api/gemini', {
  headers: { 'Authorization': 'Bearer ' + API_KEY }
});
const data = await response.json();`} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-1 bg-noble-blue/20 text-noble-blue text-[10px] font-bold rounded uppercase">Post</span>
                  <code className="text-slate-200 text-xs">/profiles</code>
                </div>
                <CodeBlock language="json" code={`{
  "name": "Global Ventures Ltd",
  "industry": "Fintech"
}`} />
              </div>
            </div>
          </Section>

          <Section id="financials" title="Financial Data">
            <p>Push financial snapshots into the engine to update dashboards and trigger analysis.</p>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-noble-blue/20 text-noble-blue text-[10px] font-bold rounded uppercase">Post</span>
              <code className="text-slate-200 text-xs">/financials/{'{profile_id}'}</code>
            </div>
            <CodeBlock language="json" code={`{
  "period": "Q1 2025",
  "revenue": 500000,
  "cogs": 200000,
  "operatingExpenses": 150000,
  "currentAssets": 120000,
  "currentLiabilities": 60000,
  "marketingSpend": 15000,
  "leadsGenerated": 1200,
  "conversions": 80
}`} />
          </Section>

          <Section id="analysis" title="AI Analysis">
            <p>Programmatically request strategic insights generated by our Gemini-tuned financial models.</p>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-noble-blue/20 text-noble-blue text-[10px] font-bold rounded uppercase">Post</span>
              <code className="text-slate-200 text-xs">/analysis/generate</code>
            </div>
            <CodeBlock code={`{
  "profile_id": "profile_12345",
  "focus_area": "liquidity",
  "detailed": true
}`} />
            <p className="mt-4 text-xs italic">Response will contain markdown-formatted insights identical to the in-app AI Coach.</p>
          </Section>

          <Section id="webhooks" title="Webhooks">
            <p>Enterprise users can configure webhook endpoints to receive real-time JSON payloads when specific events occur.</p>
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
              <ul className="space-y-4 text-xs">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-noble-blue"></span> <code>snapshot.created</code> — Sent when a new data entry is finalized.</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-noble-blue"></span> <code>goal.achieved</code> — Sent when a financial target is met.</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-noble-blue"></span> <code>health.alert</code> — Sent if health score drops below threshold.</li>
              </ul>
            </div>
          </Section>

          {/* Docs Footer */}
          <div className="mt-20 pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-500">Need direct integration support?</div>
            <a href="mailto:info@noblesworld.com.ng" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all border border-slate-700">
              Contact API Support Team
            </a>
          </div>
        </main>
      </div>

      {/* Main Footer */}
      <footer className="py-20 px-8 border-t border-slate-800 bg-[#0b0e14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-noble-blue rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-xs">N</span>
              </div>
              <span className="font-['Montserrat'] font-bold text-sm tracking-tight">NOBLE WORLD</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Advancing business intelligence through strategic AI and financial transparency.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-[10px] tracking-widest">Developers</h4>
            <ul className="space-y-4 text-xs text-slate-500">
              <li><button onClick={() => scrollToSection('welcome')} className="text-white hover:text-noble-blue">Documentation</button></li>
              <li><a href="#" className="hover:text-white">API Reference</a></li>
              <li><a href="#" className="hover:text-white">System Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-[10px] tracking-widest">Platform</h4>
            <ul className="space-y-4 text-xs text-slate-500">
              <li><button onClick={() => navigate('/features')} className="hover:text-white">Features</button></li>
              <li><button onClick={() => navigate('/pricing')} className="hover:text-white">Pricing</button></li>
              <li><button onClick={() => navigate('/security')} className="hover:text-white">Security</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white uppercase text-[10px] tracking-widest">Company</h4>
            <ul className="space-y-4 text-xs text-slate-500">
              <li><button onClick={() => navigate('/story')} className="hover:text-white">Our Story</button></li>
              <li><button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-slate-600 text-[10px]">
          &copy; {new Date().getFullYear()} Noble World. All rights reserved. Professional Use Only.
        </div>
      </footer>
    </div>
  );
};

export default ApiDocsPage;
