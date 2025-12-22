
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, Database, Key, CheckCircle, Globe } from 'lucide-react';

const SecurityPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const securityFeatures = [
    {
      title: "Bank-Grade Encryption",
      desc: "All sensitive financial data is encrypted using AES-256-GCM at rest and TLS 1.3 in transit. We ensure that your private information remains private.",
      icon: Lock
    },
    {
      title: "Data Isolation",
      desc: "We utilize multi-tenant isolation architectures. Your business data is never combined or mixed with other organizations.",
      icon: Database
    },
    {
      title: "API Security",
      desc: "Enterprise API access is strictly controlled via scoped Bearer tokens with automated rotation capabilities and rate limiting.",
      icon: Key
    },
    {
      title: "SOC2 Compliance",
      desc: "We adhere to industry-standard audit practices to ensure your data availability, confidentiality, and integrity (In Progress).",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-noble-blue/30">
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center shadow-lg">
             <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight">SECURITY</span>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        <div className="text-center mb-20 space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-display">Your Trust is Our <br/><span className="text-emerald-400">Greatest Asset.</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Noble World employs world-class security protocols to protect your business intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {securityFeatures.map((f, i) => (
            <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500/30 transition-all group">
              <f.icon className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Server className="w-32 h-32" />
          </div>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold font-display mb-8">Infrastructure Stability</h2>
            <div className="space-y-6">
              {[
                "Global High-Availability CDN distribution.",
                "Real-time threat detection and DDoS mitigation.",
                "Daily automated encrypted backups.",
                "Zero-trust administrative access controls."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-400">Found a vulnerability? Report it to our security team.</div>
          <a href="mailto:info@noblesworld.com.ng" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold border border-slate-700 transition-colors">
            Contact Security Office
          </a>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 bg-[#0b0e14] text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Noble World | Secure Intelligence
      </footer>
    </div>
  );
};

export default SecurityPage;
