
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Note: Some icons might be replaced by material symbols if not available in lucide-react, 
// but sticking to the request's Material Symbols usage via class names is safer for the "copy-paste" fidelity.
// However, the previous file used Lucide. I will use the HTML's Material Symbols logic but might need to ensure the font is loaded. 
// The HTML had <link href="...Material Symbols..." />. 
// I will assume index.html already has this or I should add it. 
// Checking index.html... it usually has it.
// I'll use the className="material-symbols-outlined" approach as per the request's HTML.

// Simple fade-in animation component using Intersection Observer
const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setVisible] = React.useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });

    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
    >
      {children}
    </div>
  );
};

const StoryPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming we have this context

  // Handlers for navigation
  const handleNav = (path: string) => navigate(path);

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101522] text-[#111318] dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b-0 bg-[#1c1e2740] backdrop-blur-md border border-white/10">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => handleNav('/')}>
            <div className="size-8 text-[#0f3bbd] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">diamond</span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Noble Clarity Engine</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <div className="flex items-center gap-9">
              <button onClick={() => handleNav('/features')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Platform</button>
              <button onClick={() => handleNav('/story')} className="text-white text-sm font-medium">Our Story</button>
              <button onClick={() => handleNav('/pricing')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Pricing</button>
              <button onClick={() => handleNav('/api-docs')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Resources</button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => user ? handleNav('/dashboard') : handleNav('/login')} className="flex h-9 px-4 items-center justify-center rounded-lg bg-[#1c1e27] border border-gray-700 text-white text-sm font-bold hover:bg-gray-800 transition-all">
                {user ? "Dashboard" : "Log In"}
              </button>
              <button onClick={() => handleNav('/pricing')} className="flex h-9 px-4 items-center justify-center rounded-lg bg-[#0f3bbd] text-white text-sm font-bold hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </div>
          </div>
          {/* Mobile Menu Icon */}
          <div className="md:hidden text-white">
            <span className="material-symbols-outlined">menu</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(16, 21, 34, 0.7) 0%, rgba(16, 21, 34, 1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCV1ypnuH8jIy4T3SdVHCbJNiynmM8sBnOs53Hb07GbxdswMpouieT5-0GNNgXa-y1v5s7AjUqtcEoOOfE12GyQcnVg7KsoTg0OQWzL-6cpR09yWKsrRaiahIIWIUVk2yg1glaJtr-Bbz4tjMUPgfFqbyZ6G0531uFCcGxuBc2Qvw9DiVUyUNc_YwvTmEuplV-FyBa8uJHGAhb9kkhFUl1eb2hLeLm-CWwpRJXuKQ1O4aIphD5G7Kcpz9G8MRGBNfAqP7h3YmNBza8")' }}
          >
          </div>
          {/* Parallax content container */}
          <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center gap-8 max-w-4xl pt-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#38bdf8] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
              Introducing Noble Clarity Engine 2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              From Financial Noise to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">Absolute Clarity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
              Experience the transition from operational chaos to predictive financial intelligence. We turn the cluttered desk of the traditional CFO into a dashboard of pure signal.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 w-full">
              {/* Visual representation of transition */}
              <div className="relative w-full max-w-3xl aspect-[16/9] rounded-xl border border-gray-800 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/40 transition-all duration-700">
                  <span className="material-symbols-outlined text-6xl text-white/20 group-hover:text-white/80 transition-all duration-500 scale-95 group-hover:scale-110">play_circle</span>
                </div>
                <img alt="Futuristic clean financial data visualization interface" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVy3uGuPCL56cvRDwZFw_tE_pjsV_-lBBBPXQ0Ag4banaUR9mRyZQ25-9auC1NNvsz6l2hoGaB1FTvuRPG4j4mOyZe2aodZe7YlicnqjUe3JKthpiylvwdMiy36Bl_hX3R-RjGn9Yl_qQFJWa9L8rX_o39ZiHvW-nAUYrbhGudJOFSYB5lZElCKDTobGla85TQm0C_uPlpEnUfzT3revjmq74Fv0y_XJ1c0HKbaBYewwBP_vZc9TyftuMeub4vggdLD8hKVo27-Cw" />
              </div>
              <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Watch the transformation</p>
            </div>
          </div>
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-24 bg-[#101522] relative">
          {/* Background ambient glow */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0f3bbd]/10 rounded-full blur-[100px]"></div>
          </div>
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              {/* Left: Header */}
              <div className="md:w-1/3 sticky top-32">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white mb-6">
                  Democratizing <br />
                  <span className="text-[#0f3bbd]">CFO-Level</span> Intelligence
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Our mission is built on three unshakeable pillars designed to empower your financial future, moving beyond simple accounting into the realm of strategic foresight.
                </p>
              </div>
              {/* Right: Pillars */}
              <div className="md:w-2/3 grid grid-cols-1 gap-6">
                {/* Truth */}
                <div className="group p-8 rounded-xl bg-[#1c1e27] border border-gray-800 hover:border-[#0f3bbd]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(15,59,189,0.1)]">
                  <div className="w-12 h-12 rounded-lg bg-[#0f3bbd]/10 flex items-center justify-center text-[#0f3bbd] mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Truth</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Unwavering data accuracy you can trust. We eliminate the guesswork ensuring your baseline is always solid bedrock.</p>
                </div>
                {/* Strategy */}
                <div className="group p-8 rounded-xl bg-[#1c1e27] border border-gray-800 hover:border-[#a855f7]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                  <div className="w-12 h-12 rounded-lg bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">lightbulb</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Strategy</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Predictive modeling for forward-thinking decisions. Move from reactive reporting to proactive wealth creation.</p>
                </div>
                {/* Freedom */}
                <div className="group p-8 rounded-xl bg-[#1c1e27] border border-gray-800 hover:border-[#38bdf8]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                  <div className="w-12 h-12 rounded-lg bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Freedom</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Time-saving automation that liberates your schedule. Focus on the vision, while we handle the arithmetic.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Noble Difference (Transparency Card) */}
        <section className="w-full py-24 bg-[#0d101b] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,59,189,0.15)_0%,transparent_50%),radial-gradient(circle_at_100%_0%,rgba(56,189,248,0.1)_0%,transparent_30%)] opacity-20"></div>
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">The Noble Difference</h2>
              <p className="text-gray-400">A transparent marriage of Human Financial Logic and Gemini 1.5 Flash AI.</p>
            </div>
            <div className="glass-panel flex flex-col md:flex-row items-center gap-8 bg-[#111318]/80 rounded-xl p-8 border border-white/5 relative">
              {/* Glow effect behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#0f3bbd]/20 blur-[80px] -z-10 rounded-full"></div>

              {/* Diagram Visual */}
              <div className="w-full md:w-1/2 relative h-64 md:h-80 bg-[#1c1e27] rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
                <img alt="Abstract data flow diagram glowing blue" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLV7IbliAABM5CC_gIFCGT-2iHDOSkqlhlngruFhEHphbhlcU3QLB46m0N9WuyuZkrX5fmmYS6QCYu3LYKFq7NCDtFOTHnGR2gqXZGIZz8E36tLa2FR_AYKqydOVEo7ivf6OCMbmUzKgRF-oJQdbpRNCpjrTEfzSihRAur5hTW3YFU27oUFXnQKKl6vjKqGMW7mOXzd9j-KFhny5E_DuzafzsQ8Jk4GwudVriEoAJlugl-nh-2fC4Zhirnf7siPK_Y7kSmUxeSbNs" />
                {/* Simplified Overlay Diagram using Tailwind & Icons */}
                <div className="relative z-10 flex items-center gap-4 text-white">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                      <span className="material-symbols-outlined text-gray-400">dataset</span>
                    </div>
                    <span className="text-xs text-gray-500 font-bold uppercase">Raw Data</span>
                  </div>
                  <div className="h-[1px] w-8 bg-gradient-to-r from-gray-600 to-[#0f3bbd]"></div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-[#0f3bbd]/20 flex items-center justify-center border border-[#0f3bbd]/50 shadow-[0_0_15px_rgba(15,59,189,0.5)] animate-pulse">
                      <span className="material-symbols-outlined text-[#0f3bbd] text-2xl">psychology</span>
                    </div>
                    <span className="text-xs text-[#0f3bbd] font-bold uppercase">Noble AI</span>
                  </div>
                  <div className="h-[1px] w-8 bg-gradient-to-r from-[#0f3bbd] to-white"></div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center border border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      <span className="material-symbols-outlined">diamond</span>
                    </div>
                    <span className="text-xs text-white font-bold uppercase">Clarity</span>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">White-Box Intelligence</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    We believe in "No Black Boxes". Unlike standard AI wrappers, Noble Clarity Engine exposes the logic layer. You see exactly how your financial data is processed, enriched, and modeled.
                  </p>
                </div>
                <div className="h-px w-full bg-gray-800"></div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Google Gemini 3.0 Flash</h3>
                  <p className="text-gray-400 text-sm">
                    We've integrated Google's most efficient multimodal model to power our "AI Business Coach".
                    It understands your P&L, balance sheets, and market trends to provide strategy, not just data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Noble Manifesto (Values) */}
        <section className="w-full py-24 bg-[#0b0d13] border-t border-gray-900">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-16 uppercase tracking-widest text-center text-gray-500 text-xs">The Noble Manifesto</h2>

            <div className="space-y-24">
              {/* Chapter I */}
              <FadeInSection>
                <div className="relative group">
                  {/* Fog Effect Layer */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-900/50 to-[#0f3bbd]/20 blur-xl opacity-100 transition-all duration-1000 group-hover:opacity-0 pointer-events-none z-0"></div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                    <div className="text-[#0f3bbd] font-serif text-5xl font-bold opacity-50">I.</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">The End of Financial "Fog"</h3>
                      <p className="text-gray-400 leading-relaxed text-lg">
                        Most businesses don’t fail because they lack a great product; they fail because they lose sight of the horizon. We believe that data without direction is noise. The "Noble" standard is to replace the anxiety of the unknown with the confidence of absolute clarity. We don't just show you where you are; we show you where you are going.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInSection>

              {/* Chapter II */}
              <FadeInSection>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                  <div className="text-[#0f3bbd] font-serif text-5xl font-bold opacity-50">II.</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Complexity is the Enemy</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      If a dashboard requires a manual, it has failed. We are committed to "Dead Simple" UX. We believe that the most sophisticated technology in the world—our AI Engine—should feel invisible. Financial intelligence should be as intuitive as a conversation and as clear as a mirror.
                    </p>
                  </div>
                </div>
              </FadeInSection>

              {/* Chapter III */}
              <FadeInSection>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                  <div className="text-[#0f3bbd] font-serif text-5xl font-bold opacity-50">III.</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Data Sovereignty & The "Noble" Trust</h3>
                    <p className="text-gray-400 leading-relaxed text-lg mb-6">
                      Your financial data is the DNA of your life’s work. We treat it with a level of reverence that is rare in the SaaS world.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#1c1e27] p-6 rounded-lg border border-gray-800">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-[#0f3bbd]">visibility</span> No Black Boxes</h4>
                        <p className="text-sm text-gray-500">Our AI explains its logic. If the Engine suggests a move, it shows you the "Why."</p>
                      </div>
                      <div className="bg-[#1c1e27] p-6 rounded-lg border border-gray-800">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-[#0f3bbd]">lock</span> Privacy by Design</h4>
                        <p className="text-sm text-gray-500">Your data is your property. We use enterprise-grade encryption to ensure that your insights remain yours alone.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>

              {/* Chapter IV */}
              <FadeInSection>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                  <div className="text-[#0f3bbd] font-serif text-5xl font-bold opacity-50">IV.</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Proactive, Not Reactive</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      The era of looking at last month’s profit and loss statement to make today’s decisions is over. Noble Clarity Engine is built on the principle of The Forward Glance. We leverage Google Gemini’s predictive power to move you from a state of "reaction" to a state of "strategic command."
                    </p>
                  </div>
                </div>
              </FadeInSection>

              {/* Chapter V */}
              <FadeInSection>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                  <div className="text-[#0f3bbd] font-serif text-5xl font-bold opacity-50">V.</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Democratizing the "CFO Mindset"</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      World-class financial strategy shouldn't be reserved for the Fortune 500. Every entrepreneur deserves a co-pilot who understands their cash flow, identifies their ROI leaks, and celebrates their milestones. Noble is that co-pilot—an elite financial mind available 24/7.
                    </p>
                  </div>
                </div>
              </FadeInSection>

              {/* Chapter VI */}
              <FadeInSection>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                  <div className="text-[#0f3bbd] font-serif text-5xl font-bold opacity-50">VI.</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Built for the Builders</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      We didn’t build this for accountants. We built this for the dreamers, the risk-takers, and the builders. We believe that when a founder gains financial clarity, they gain the freedom to innovate, the power to scale, and the peace of mind to sleep.
                    </p>
                  </div>
                </div>
              </FadeInSection>
            </div>


          </div>
        </section>

        {/* Meet the Architects */}
        <section className="w-full py-24 bg-[#101522]">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center tracking-tight">Meet the Architects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Architect 1 */}
              <div className="group relative h-[400px] rounded-xl overflow-hidden bg-[#1c1e27] border border-gray-800 cursor-pointer">
                <img alt="Professional headshot of a man in a suit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvWN7yQesqFYCLjrg3xRGntnxoyr5dUfiRRK8rA4OFr3n3CkWInl8HrGxUaV9BKRA5SnOyA9Dgu_BLkgwsyEOKY2cc5uMA6BQ9-Kapisv8i_qkB1Lm-Xiezdve5vofQQBOk3WtAuKVhGW6LYOtxHTFj6ixmJ4fgifEioOjClKjh0Qcf66SqVdAaG_1D4U-Qkk-xvHHKyKb0tzEuD87idv4MNjFsaghcqfsv4WuAu1hB3xOypm1CFGsgCcuLO1HrAOZ8M25pXEi-14" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white">James Sterling</h3>
                  <p className="text-[#0f3bbd] font-medium text-sm mb-3">Chief Strategy Officer</p>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 line-clamp-3">
                    Former Wall Street analyst turned fintech visionary. James ensures every algorithm is rooted in sound economic theory.
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <a className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white hover:bg-blue-500" href="#">
                      <span className="text-xs font-bold">in</span>
                    </a>
                  </div>
                </div>
              </div>
              {/* Architect 2 */}
              <div className="group relative h-[400px] rounded-xl overflow-hidden bg-[#1c1e27] border border-gray-800 cursor-pointer">
                <img alt="Professional headshot of a woman executive" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPr2A8D8sTnU-712WyALFTnphZyyHDgpU-KvXuSlxQnagBdxVxal_3XmJU2wpQggFjZ9c8KMjny2fwSBNctxKDCB1EnFwTZfrOfkrOBYPUblsbVxGruVoB18ZNRHJpv8_CB320Ui4nxS2cRtuwAIXcddgW82TyE2A5T7K_i2Aua_0jNbX9f2TDrqBBokciG4y1RwQs63pI1x_LQovWT6dmAO3aXql48qjqXbflQvMpSjmI0JKKy7LEFw4n-nadlAi6rpEXKJiNOWo" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white">Elena Corves</h3>
                  <p className="text-[#a855f7] font-medium text-sm mb-3">Head of AI Engineering</p>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 line-clamp-3">
                    PhD in Computational Finance. Elena bridges the gap between raw machine learning capabilities and actionable business insights.
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <a className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white hover:bg-blue-500" href="#">
                      <span className="text-xs font-bold">in</span>
                    </a>
                  </div>
                </div>
              </div>
              {/* Architect 3 */}
              <div className="group relative h-[400px] rounded-xl overflow-hidden bg-[#1c1e27] border border-gray-800 cursor-pointer">
                <img alt="Professional headshot of a man in casual business attire" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCluzCGGom9EeVtbp390-BcoiwDvYbtbLRSkE7tbdAqPXkRrBf0XD15u6lSHdmu5dVlj68YXHEc1HtXjFmOeXROkzPlDD6M_dxsP4VZAXJj44OzhTXhZrWNNdQ1psmjydNzQq03ikZve-Wm0Ixa-33tz8BSU6hrWjBofkCIXZq7BetTynyQuAyHbSPeEvKp8WysA0Tsn0pCeqf3E_UsoVLdIOCYZph8YKYWPWyTyICIP4bDi-ulOPLpqQ4dgygi7aH0oTkCR26kJh0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white">David Chen</h3>
                  <p className="text-[#38bdf8] font-medium text-sm mb-3">VP of Product</p>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 line-clamp-3">
                    Product design obsessed. David believes enterprise tools should feel as intuitive as consumer apps, without sacrificing power.
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <a className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white hover:bg-blue-500" href="#">
                      <span className="text-xs font-bold">in</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Ticker */}
        <section className="w-full py-12 bg-black border-y border-gray-900">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-6">Built with Transparency on Industry Standards</p>
            <div className="flex flex-wrap justify-center gap-12 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* Logos simulated with text/icons for simplicity */}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                <span className="font-bold text-lg text-white">Firebase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                <span className="font-bold text-lg text-white">Gemini 1.5</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">hexagon</span>
                <span className="font-bold text-lg text-white">Node.js</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">shield</span>
                <span className="font-bold text-lg text-white">SOC 2 Type II</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="w-full py-32 bg-[#101522] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready for Clarity?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl">Join the forward-thinking CFOs who have traded noise for signal.</p>
          <button
            onClick={() => handleNav('/pricing')}
            className="pulse-shadow flex min-w-[200px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-[#0f3bbd] text-white text-base font-bold tracking-wide hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
            <span className="material-symbols-outlined ml-2">arrow_forward</span>
          </button>
          <div className="mt-20 pt-10 border-t border-gray-800 w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-6 text-gray-400">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                </svg>
              </div>
              <span>© {new Date().getFullYear()} Noble Clarity Engine. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <button onClick={() => handleNav('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => handleNav('/terms')} className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StoryPage;
