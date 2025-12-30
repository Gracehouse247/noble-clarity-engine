
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
            <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-4">Privacy Policy: Noble Clarity Engine</h1>
            <p className="text-slate-400">Last Updated: December 30, 2025</p>
          </header>

          <section className="space-y-4">
            <p className="text-slate-400 leading-relaxed">
              Welcome to Noble World, also known as the Noble Clarity Engine ("the Platform"). We provide a premium AI-powered financial intelligence dashboard designed to empower SMEs with real-time business health insights.
            </p>
            <p className="text-slate-400 leading-relaxed">
              In this Privacy Policy, "we," "us," and "our" refer to the Noble Clarity Engine. This document outlines how we collect, process, and protect your Business Financial Data and Personal Identifiable Information (PII).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Data Collection and Categories</h2>
            <p className="text-slate-400 leading-relaxed">We distinguish between the information required to manage your account and the information required to provide financial intelligence.</p>

            <h3 className="text-xl font-semibold text-white mt-4">A. Personal Identifiable Information (PII)</h3>
            <p className="text-slate-400">To manage access and personalize your experience via our React-based dashboard, we collect:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>Identity Data:</strong> Name, Business Role, and Avatar URL.</li>
              <li><strong>Contact Data:</strong> Email address.</li>
              <li><strong>Authentication Data:</strong> Handled securely via Google Firebase Authentication.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">B. Business Financial Data</h3>
            <p className="text-slate-400">To generate your financial health insights, we process sensitive data provided via manual entry or CSV upload, including:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Revenue & COGS (Cost of Goods Sold).</li>
              <li>Balance Sheet Items: Assets and Liabilities.</li>
              <li>Operations Data: Inventory levels and Marketing Spend.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. Legal Basis for Processing</h2>
            <p className="text-slate-400 leading-relaxed">We process your data under the following legal frameworks:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>Contractual Necessity:</strong> To provide the core functionality of the Noble Clarity Engine (e.g., calculating Net Profit Margin or ROE).</li>
              <li><strong>Legitimate Interest:</strong> To improve our "AI Coaching" insights and ensure the security of the platform.</li>
              <li><strong>Consent:</strong> For non-essential communications and specific AI-driven features where required by local law.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. The "Hybrid Intelligence Layer" & AI Transparency</h2>
            <p className="text-slate-400 leading-relaxed">Noble World utilizes a sophisticated Hybrid Intelligence Layer powered by Google Gemini 3.0 Flash and OpenAI.</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>Processing Purpose:</strong> Your financial metrics are sent to these LLMs to generate real-time "AI Coaching" responses and Text-to-Speech (TTS) insights.</li>
              <li><strong>Data Integrity:</strong> We utilize enterprise-grade API tiers. Under our current configuration, sensitive financial data sent to these providers is governed by "Zero-Retention" and "No-Training" policies. Your proprietary business data is never used to train the base models of Google or OpenAI.</li>
              <li><strong>Anonymization:</strong> Where feasible, data is obfuscated before being processed by the AI layer to ensure maximum privacy.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Third-Party Sub-processors</h2>
            <p className="text-slate-400 leading-relaxed">We partner with industry-leading infrastructure providers to ensure a seamless and secure experience.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-slate-400 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-2 font-semibold text-white">Provider</th>
                    <th className="py-2 font-semibold text-white">Purpose</th>
                    <th className="py-2 font-semibold text-white">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="py-2">Google Firebase</td>
                    <td className="py-2">Database (Firestore) & Authentication</td>
                    <td className="py-2">SOC 2, ISO 27001</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2">Paystack / Flutterwave</td>
                    <td className="py-2">Subscription Billing & Payments</td>
                    <td className="py-2">PCI-DSS Level 1</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2">OpenAI / Google Gemini</td>
                    <td className="py-2">AI Logic & NLP Insights</td>
                    <td className="py-2">SOC 2 / Enterprise Privacy</td>
                  </tr>
                  <tr>
                    <td className="py-2">Nodemailer / SMTP</td>
                    <td className="py-2">System Alerts & Communications</td>
                    <td className="py-2">TLS/SSL Encrypted</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Data Security Standards</h2>
            <p className="text-slate-400 leading-relaxed">We implement a "Security by Design" architecture to protect your SME’s financial integrity:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>Backend Proxying:</strong> All API requests to AI providers are routed through our secure Noble Clarity Engine Server. This ensures your API keys and raw data are never exposed on the client-side (React) environment.</li>
              <li><strong>Encryption:</strong> Data is encrypted at rest (AES-256) and in transit (TLS 1.2+).</li>
              <li><strong>SOC 2 Protocols:</strong> Our internal data handling aligns with SOC 2 standards to ensure the confidentiality and availability of your financial dashboards.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Your Rights & Data Control</h2>
            <p className="text-slate-400 leading-relaxed">We believe in absolute user autonomy over sensitive business data.</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>The "Wipe All Data" Feature:</strong> Within your settings, you may trigger a "Wipe All Data" command. This action permanently deletes all local profiles, financial history, and settings from our production databases (Firestore) and your browser's local storage. This action is irreversible.</li>
              <li><strong>Access & Rectification:</strong> You may download or edit your financial data at any time via the dashboard.</li>
              <li><strong>International Transfers:</strong> By using the platform, you acknowledge that your data may be processed in regions where our sub-processors maintain nodes (primarily the US and EU). We utilize Standard Contractual Clauses (SCCs) to ensure data remains protected across borders.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Cookies and Local Storage</h2>
            <p className="text-slate-400 leading-relaxed">The Noble World dashboard uses localStorage rather than traditional tracking cookies to enhance performance:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li><strong>Session Persistence:</strong> To keep you logged in.</li>
              <li><strong>UI Preferences:</strong> To remember your currency symbols, theme settings, and notification toggles.</li>
              <li><strong>Analytics:</strong> We do not use third-party tracking cookies for advertising.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-bold">8. Contact Us</h2>
            <p className="text-slate-400">If you have questions regarding this policy or our data handling practices, please contact our Data Protection Officer (DPO):</p>
            <div className="flex flex-col gap-2">
              <p className="text-slate-300 font-semibold">Noble Clarity Engine Legal Team</p>
              <div className="flex items-center gap-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 w-fit">
                <Mail className="text-noble-blue" />
                <a href="mailto:clarity@noblesworld.com.ng" className="text-white font-bold hover:text-noble-blue transition-colors">clarity@noblesworld.com.ng</a>
              </div>
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
