
import * as React from 'react';
import { getFinancialInsights } from '../services/ai';
import { FinancialData, AIProvider } from '../types';
import { Sparkles, Send, Bot, User, Loader2, RefreshCw, AlertTriangle, Cpu, X, Settings } from 'lucide-react';

interface AICoachProps {
  data: FinancialData;
  keys?: { google: string; openai: string };
  provider?: AIProvider;
  onClose?: () => void;
  onSettingsClick?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const engagingLoadingMessages = [
  "Consulting financial models...", "Scanning market data...", "Synthesizing insights...",
  "Cross-referencing benchmarks...", "Finalizing analysis...", "Almost there..."
];

const AICoach: React.FunctionComponent<AICoachProps> = ({ data, keys, provider = 'gemini', onClose, onSettingsClick }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState(engagingLoadingMessages[0]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let interval: number | undefined;
    if (loading) {
      let i = 0;
      interval = window.setInterval(() => {
        i = (i + 1) % engagingLoadingMessages.length;
        setLoadingMessage(engagingLoadingMessages[i]);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  React.useEffect(() => {
    const runInitialAnalysis = async () => {
      setLoading(true);
      const res = await getFinancialInsights(data, undefined, keys, provider as AIProvider, []);
      setMessages([{ role: 'assistant', content: res }]);
      setLoading(false);
    };

    if (messages.length === 0) runInitialAnalysis();
  }, [data, keys, provider]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    const history = [...messages];
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);
    const res = await getFinancialInsights(data, userMsg, keys, provider as AIProvider, history);
    setMessages(prev => [...prev, { role: 'assistant', content: res }]);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 rounded-2xl flex flex-col h-full overflow-hidden border border-slate-800 shadow-xl relative mt-4">
      {/* Floating Robot Icon - Stays visible even if container shifts */}
      <div className="absolute -top-6 -left-2 z-50">
        <div className="w-12 h-12 bg-noble-blue border-2 border-slate-900 rounded-full flex items-center justify-center shadow-xl shadow-noble-blue/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="p-4 pl-12 border-b border-slate-800 flex items-center justify-between bg-slate-900 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-white font-display text-sm">AI Financial Coach</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mode: {provider.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMessages([])} className="p-2 text-slate-500 hover:text-white transition-colors" title="Clear Chat">
            <RefreshCw className="w-4 h-4" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-rose-400 transition-colors" title="Close Coach">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0b0e14]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-2 max-w-[90%]`}>
              <div className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-700' : 'bg-noble-deep border border-noble-blue'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-noble-blue text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
              {/* Action Button for Settings/API errors */}
              {m.role === 'assistant' && (m.content.includes('Settings') || m.content.includes('API key')) && onSettingsClick && (
                <button
                  onClick={onSettingsClick}
                  className="ml-11 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-noble-blue flex items-center gap-2 transition-all mt-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Open AI Settings
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-noble-blue" />
              </div>
              <div className="p-3 bg-slate-800 text-slate-400 text-xs italic rounded-xl">{loadingMessage}</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            placeholder="Ask about your financial health..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-noble-blue text-sm"
          />
          <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-noble-blue hover:text-white transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
