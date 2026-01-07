
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const ApiDocsPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const handleNav = (path: string) => navigate(path);

  // State for interactivity
  const [activeSection, setActiveSection] = React.useState('endpoints');
  const [codeTab, setCodeTab] = React.useState<'nodejs' | 'json'>('nodejs');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#101522] text-[#9da4b9] font-display flex h-screen w-full overflow-hidden">
      {/* SideNavBar */}
      <aside className="flex flex-col w-72 bg-[#101522] border-r border-white/5 p-4 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2.5 px-3 py-2 cursor-pointer mb-6" onClick={() => handleNav('/')}>
          <div className="size-6 text-[#0f3bbd]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
              <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-white text-base font-bold leading-normal">Noble Clarity Engine</h1>
            <p className="text-[#9da4b9] text-sm font-normal leading-normal">API Documentation</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-1 py-3 mb-6">
          <label className="flex flex-col min-w-40 h-10 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#1e2330] hover:bg-[#252b3b] transition-colors border border-white/5">
              <div className="text-[#9da4b9] flex items-center justify-center pl-3">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input className="flex w-full min-w-0 flex-1 bg-transparent text-white focus:outline-none placeholder:text-[#9da4b9] px-3 text-sm" placeholder="Search docs..." />
            </div>
          </label>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem
            icon="bookmark"
            label="Introduction"
            active={activeSection === 'introduction'}
            onClick={() => scrollToSection('introduction')}
          />
          <NavItem
            icon="key"
            label="Authentication"
            active={activeSection === 'authentication'}
            onClick={() => scrollToSection('authentication')}
          />
          <NavItem
            icon="code"
            label="Endpoints"
            active={activeSection === 'endpoints'}
            onClick={() => scrollToSection('endpoints')}
            customIconStyle={{ fontVariationSettings: "'FILL' 1" }}
          />
          <NavItem
            icon="database"
            label="Data Models"
            active={activeSection === 'datamodels'}
            onClick={() => scrollToSection('datamodels')}
          />
          <NavItem
            icon="send"
            label="Webhooks"
            active={activeSection === 'webhooks'}
            onClick={() => scrollToSection('webhooks')}
          />
          <NavItem
            icon="error"
            label="Error Codes"
            active={activeSection === 'errorcodes'}
            onClick={() => scrollToSection('errorcodes')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
        <div className="grid grid-cols-12 gap-8 px-12 py-10 max-w-[1600px] mx-auto">
          {/* Center Content Column */}
          <div className="col-span-12 lg:col-span-7 pb-20">

            {/* SECTION: Introduction (Placeholder height for scroll demo) */}
            <section id="introduction" className="scroll-mt-10 mb-20 border-b border-white/5 pb-10">
              <div className="flex flex-wrap gap-2 pb-4">
                <span className="text-[#9da4b9] text-sm">API</span>
                <span className="text-[#9da4b9] text-sm">/</span>
                <span className="text-white text-sm font-medium">Introduction</span>
              </div>
              <h1 className="text-white text-5xl font-extrabold leading-tight">
                Financial Intelligence <span className="text-primary italic">API</span> <br />
                & SDK Documentation
              </h1>
              <p className="mt-6 text-xl text-[#9da4b9] leading-relaxed font-light">
                Comprehensive developer guides for the <strong>Financial Intelligence API</strong>. Integrate predictive modeling, cash flow forecasting, and AI-driven insights directly into your workflow.
              </p>
            </section>

            {/* SECTION: Authentication */}
            <section id="authentication" className="scroll-mt-10 mb-20 border-b border-white/5 pb-10">
              <h1 className="text-white text-[32px] font-bold leading-tight mb-4">Authentication</h1>
              <p className="text-base leading-relaxed mb-4">
                All API requests require an API key. You can pass your API key in the authorization header or as a query parameter.
              </p>
              <div className="bg-[#1e2330] p-4 rounded-lg border border-white/5">
                <code className="text-white">Authorization: Bearer YOUR_API_KEY</code>
              </div>
            </section>

            {/* SECTION: Endpoints (The main view from screenshot) */}
            <section id="endpoints" className="scroll-mt-10 mb-20">
              <div className="flex flex-wrap gap-2 pb-4">
                <span className="text-[#9da4b9] hover:text-white transition-colors cursor-pointer text-sm">API</span>
                <span className="text-[#9da4b9] text-sm">/</span>
                <span className="text-[#9da4b9] hover:text-white transition-colors cursor-pointer text-sm">Endpoints</span>
                <span className="text-[#9da4b9] text-sm">/</span>
                <span className="text-white text-sm font-medium">Get Prediction</span>
              </div>

              <h1 className="text-white text-[32px] font-bold leading-tight text-left pb-3">Get Prediction</h1>

              <div className="flex items-center gap-3 mt-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold tracking-wide text-green-300 bg-green-900/40 rounded-full uppercase">GET</span>
                <code className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-md font-mono">/v1/predictions/{'{predictionId}'}</code>
              </div>

              <p className="mt-4 text-base leading-relaxed text-[#9da4b9]">
                This endpoint retrieves a specific financial prediction by its unique identifier. The prediction object contains the predicted value, confidence score, and the input parameters used for the prediction.
              </p>

              <h2 className="text-white text-2xl font-bold mt-12 mb-6">Path Parameters</h2>
              <div className="overflow-hidden border border-white/10 rounded-lg bg-[#151a25]">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#9da4b9] uppercase tracking-wider">Parameter</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#9da4b9] uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#9da4b9] uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                        <span className="bg-white/10 px-2 py-1 rounded">predictionId</span>
                        <span className="text-red-400 ml-2 text-xs uppercase font-bold">*required</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9da4b9]">string</td>
                      <td className="px-6 py-4 text-sm text-[#9da4b9] leading-relaxed">The unique identifier for the prediction.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION: Data Models */}
            <section id="datamodels" className="scroll-mt-10 mb-20 border-b border-white/5 pb-10">
              <h1 className="text-white text-[32px] font-bold leading-tight mb-4">Data Models</h1>
              <p className="text-base leading-relaxed mb-4">
                Understanding the core data structures is key to effective integration. This section details the User, Prediction, and Transaction objects.
              </p>
            </section>

            {/* SECTION: Webhooks */}
            <section id="webhooks" className="scroll-mt-10 mb-20 border-b border-white/5 pb-10">
              <h1 className="text-white text-[32px] font-bold leading-tight mb-4">Webhooks</h1>
              <p className="text-base leading-relaxed mb-4">
                Subscribe to real-time events. Webhooks allow your system to receive notifications when a prediction is complete or a threshold is breached.
              </p>
            </section>

            {/* SECTION: Error Codes */}
            <section id="errorcodes" className="scroll-mt-10 mb-20 pb-10">
              <h1 className="text-white text-[32px] font-bold leading-tight mb-4">Error Codes</h1>
              <p className="text-base leading-relaxed mb-4">
                Standard HTTP response codes are used to indicate the success or failure of direct API requests.
              </p>
            </section>

          </div>

          {/* Right Code Column */}
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="sticky top-10 flex flex-col gap-6">

              {/* Request Block */}
              <div className="bg-[#1e2330] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex border-b border-white/10 bg-[#151a25]">
                  <button
                    onClick={() => setCodeTab('nodejs')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${codeTab === 'nodejs' ? 'border-[#0f3bbd] text-white bg-[#0f3bbd]/10' : 'border-transparent text-[#9da4b9] hover:text-white'}`}
                  >
                    Node.js
                  </button>
                  <button
                    onClick={() => setCodeTab('json')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${codeTab === 'json' ? 'border-[#0f3bbd] text-white bg-[#0f3bbd]/10' : 'border-transparent text-[#9da4b9] hover:text-white'}`}
                  >
                    JSON
                  </button>
                </div>
                <div className="p-5 font-mono text-sm relative group bg-[#0d1117]">
                  <button
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      const text = codeTab === 'nodejs'
                        ? `const nobleClarity = require('noble-clarity-engine');\nnobleClarity.authenticate({ apiKey: 'YOUR_API_KEY' });`
                        : `{ "apiKey": "YOUR_API_KEY" }`;
                      navigator.clipboard.writeText(text);
                    }}
                  >
                    <span className="material-symbols-outlined text-white text-[18px]">content_copy</span>
                  </button>

                  {codeTab === 'nodejs' ? (
                    <div className="space-y-1">
                      <div className="text-[#9da4b9]">const nobleClarity = <span className="text-[#7dd3fc]">require</span>(<span className="text-[#fbbf24]">'noble-clarity-engine'</span>);</div>
                      <br />
                      <div className="text-[#9da4b9]">nobleClarity.<span className="text-[#7dd3fc]">authenticate</span>({'{'}</div>
                      <div className="text-[#9da4b9] pl-4">apiKey: <span className="text-[#fbbf24]">'YOUR_API_KEY'</span></div>
                      <div className="text-[#9da4b9]">{'}'});</div>
                      <br />
                      <div className="text-[#9da4b9]">const predictionId = <span className="text-[#fbbf24]">'pred_1a2b3c4d5e'</span>;</div>
                      <br />
                      <div className="text-[#9da4b9]">nobleClarity.predictions.<span className="text-[#7dd3fc]">get</span>(predictionId)</div>
                      <div className="text-[#9da4b9] pl-4">.<span className="text-[#7dd3fc]">then</span>(prediction ={'>'} {'{'}</div>
                      <div className="text-[#9da4b9] pl-8">console.<span className="text-[#7dd3fc]">log</span>(prediction);</div>
                      <div className="text-[#9da4b9] pl-4">{'}'});</div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[#9da4b9]">// Example JSON Payload</div>
                      <div className="text-[#9da4b9]">{'{'}</div>
                      <div className="text-[#9da4b9] pl-4"><span className="text-[#7dd3fc]">"method"</span>: <span className="text-[#fbbf24]">"GET"</span>,</div>
                      <div className="text-[#9da4b9] pl-4"><span className="text-[#7dd3fc]">"url"</span>: <span className="text-[#fbbf24]">"https://api.noble.com/v1/predictions/pred_123"</span>,</div>
                      <div className="text-[#9da4b9] pl-4"><span className="text-[#7dd3fc]">"headers"</span>: {'{'}</div>
                      <div className="text-[#9da4b9] pl-8"><span className="text-[#7dd3fc]">"Authorization"</span>: <span className="text-[#fbbf24]">"Bearer KEY"</span></div>
                      <div className="text-[#9da4b9] pl-4">{'}'}</div>
                      <div className="text-[#9da4b9]">{'}'}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Response Block */}
              <div className="bg-[#1e2330] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#151a25]">
                  <h3 className="text-sm font-semibold text-white">Response</h3>
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400">
                    200 OK
                  </div>
                </div>
                <div className="p-5 font-mono text-sm bg-[#0d1117] text-[#9da4b9]">
                  <div className="space-y-1">
                    <div>{'{'}</div>
                    <div className="pl-4"><span className="text-[#7dd3fc]">"id"</span>: <span className="text-[#fbbf24]">"pred_1a2b3c4d5e"</span>,</div>
                    <div className="pl-4"><span className="text-[#7dd3fc]">"object"</span>: <span className="text-[#fbbf24]">"prediction"</span>,</div>
                    <div className="pl-4"><span className="text-[#7dd3fc]">"created"</span>: <span className="text-[#34d399]">1678886400</span>,</div>
                    <div className="pl-4"><span className="text-[#7dd3fc]">"model"</span>: <span className="text-[#fbbf24]">"nce-finance-v2"</span>,</div>
                    <div className="pl-4"><span className="text-[#7dd3fc]">"value"</span>: <span className="text-[#34d399]">1250.75</span>,</div>
                    <div className="pl-4"><span className="text-[#7dd3fc]">"currency"</span>: <span className="text-[#fbbf24]">"USD"</span>,</div>
                    <div className="pl-4"><span className="text-[#7dd3fc]">"confidence_score"</span>: <span className="text-[#34d399]">0.92</span></div>
                    <div>{'}'}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// NavItem Component Helper
const NavItem = ({ icon, label, active, onClick, customIconStyle }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg w-full text-left group ${active
      ? 'bg-[#0f3bbd] text-white shadow-lg shadow-blue-900/20'
      : 'text-[#9da4b9] hover:text-white hover:bg-white/5'
      }`}
  >
    <span
      className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : 'text-[#9da4b9] group-hover:text-white'}`}
      style={customIconStyle}
    >
      {icon}
    </span>
    <p className="text-sm font-medium leading-normal">{label}</p>
  </button>
);

export default ApiDocsPage;
