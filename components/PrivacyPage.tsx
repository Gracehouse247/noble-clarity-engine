
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Globe } from 'lucide-react';

const PrivacyPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-noble-blue/30">
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center">
             <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight">PRIVACY POLICY</span>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <div className="prose prose-invert max-w-none space-y-10">
          <header className="border-b border-slate-800 pb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-4">Privacy Policy</h1>
            <p className="text-slate-400">Last Updated: May 2025</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Introduction</h2>
            <p className="text-slate-400 leading-relaxed">
              At Noble World, we respect your privacy and are committed to protecting it. This Privacy Policy describes the types of information we may collect from you and our practices for collecting, using, maintaining, protecting, and disclosing that information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. Information We Collect</h2>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>Financial Data:</strong> Revenue, expenses, assets, and liabilities you input for analysis.</li>
              <li><strong>Account Information:</strong> Name, email, role, and organization details.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns via cookies.</li>
              <li><strong>AI Logs:</strong> Interactions with the AI Coach to improve your specific business insights.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. How We Use Your Data</h2>
            <p className="text-slate-400 leading-relaxed">
              Your data is used exclusively to power your dashboard, generate forecasts, and provide AI-driven strategic advice. <strong>We do not sell your personal or financial data to third parties.</strong> We use anonymized, aggregated data to calculate industry benchmarks, ensuring no individual business can be identified.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Data Security</h2>
            <p className="text-slate-400 leading-relaxed">
              We implement industry-standard security measures, including end-to-end encryption and secure API architectures. However, no method of transmission over the Internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. AI and Model Training</h2>
            <p className="text-slate-400 leading-relaxed">
              We utilize Google Gemini API for financial analysis. Your specific financial data is sent to the model via enterprise-grade private endpoints. This data is <strong>not</strong> used to train public models.
            </p>
          </section>

          <section className="space-y-4 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <p className="text-slate-400">To ask questions or comment about this privacy policy and our privacy practices, contact us at:</p>
            <div className="flex items-center gap-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 w-fit">
              <Mail className="text-noble-blue" />
              <a href="mailto:info@noblesworld.com.ng" className="text-white font-bold hover:text-noble-blue transition-colors">info@noblesworld.com.ng</a>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 bg-[#0b0e14] text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Noble World | Professional Privacy Standards
      </footer>
    </div>
  );
};

export default PrivacyPage;
