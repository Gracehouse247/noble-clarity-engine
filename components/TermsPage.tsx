
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gavel, Mail, Globe } from 'lucide-react';

const TermsPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-noble-blue/30">
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center">
             <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight uppercase">Terms of Service</span>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <div className="prose prose-invert max-w-none space-y-10">
          <header className="border-b border-slate-800 pb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-4">Terms of Service</h1>
            <p className="text-slate-400">Last Revised: May 2025</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            <p className="text-slate-400 leading-relaxed">
              By accessing or using Noble World, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. No Financial Advice</h2>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
              <Gavel className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-200">
                <strong>Disclaimer:</strong> Noble World is a technology tool. The insights provided by the AI Coach and the platform are for informational purposes only and do not constitute professional financial, tax, or legal advice. Always consult with a certified professional before making significant business decisions.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. Use of Service</h2>
            <p className="text-slate-400 leading-relaxed">
              You are granted a non-exclusive, non-transferable, revocable license to access the platform. You agree not to:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Reverse engineer or attempt to extract source code.</li>
                <li>Use the service for any illegal or unauthorized purpose.</li>
                <li>Input fraudulent financial data to skew industry benchmarks.</li>
              </ul>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Subscriptions and Payments</h2>
            <p className="text-slate-400 leading-relaxed">
              Subscription fees are billed in advance on a monthly or yearly basis and are non-refundable. We reserve the right to modify pricing with 30 days' notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
            <p className="text-slate-400 leading-relaxed">
              Noble World and its affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service, including business losses, lost profits, or data corruption.
            </p>
          </section>

          <section className="space-y-4 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-bold">Contact Support</h2>
            <p className="text-slate-400">For any legal inquiries regarding these terms, please reach out to:</p>
            <div className="flex items-center gap-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 w-fit">
              <Mail className="text-noble-blue" />
              <a href="mailto:info@noblesworld.com.ng" className="text-white font-bold hover:text-noble-blue transition-colors">info@noblesworld.com.ng</a>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 bg-[#0b0e14] text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Noble World | Strategic Compliance
      </footer>
    </div>
  );
};

export default TermsPage;
