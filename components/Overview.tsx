
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FinancialData, Notification, AIProvider } from '../types';
import { calculateKPIs, INDUSTRY_BENCHMARKS, calculateHealthScore, CURRENCY_SYMBOLS } from '../constants';
import { getFinancialInsights, getMarketingInsights } from '../services/ai';
import { useUser } from '../contexts/NobleContext';
import EmptyState from './EmptyState';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Zap,
  ShieldCheck,
  History,
  AlertCircle,
  Sparkles,
  Loader2,
  Trash2,
  RotateCcw,
  Info,
  Lightbulb,
  AlertTriangle,
  Activity,
  Layers,
  Archive,
  Calendar,
  MoreHorizontal,
  Lock,
  Crown,
  Bot,
  Percent,
  GlassWater
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from 'recharts';

interface OverviewProps {
  profileName: string;
  data: FinancialData;
  history?: FinancialData[];
  keys?: { google: string; openai: string };
  provider?: AIProvider;
  onClearHistory: () => void;
  onDeleteSnapshot: (period: string) => void;
  onLoadSnapshot: (data: FinancialData) => void;
  onAddNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
}

const getComparison = (value: number, benchmark: number, higherIsBetter = true) => {
  if (higherIsBetter) {
    if (value >= benchmark) return 'good';
    if (value >= benchmark * 0.75) return 'warning';
    return 'bad';
  } else { // Lower is better
    if (value <= benchmark) return 'good';
    if (value <= benchmark * 1.25) return 'warning';
    return 'bad';
  }
};

const KpiCard: React.FunctionComponent<any> = ({ label, value, benchmarkValue, comparison, icon: Icon, tooltip }) => {
  const styles = comparison === 'good' ? 'text-emerald-400' : comparison === 'warning' ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className={`bg-slate-900 border border-slate-800 p-6 rounded-2xl relative group hover:border-noble-blue/30 transition-all h-full`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <div className="p-2 bg-slate-800 rounded-lg"><Icon className="w-5 h-5 text-noble-blue" /></div>
      </div>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <div className={`flex items-center gap-2 text-xs ${styles}`}>
        <span className="font-bold">Bench: {benchmarkValue}</span>
      </div>
    </div>
  );
};

const Overview: React.FunctionComponent<OverviewProps> = ({
  profileName, history = [], keys, provider = 'gemini', data, onClearHistory, onDeleteSnapshot, onLoadSnapshot, onAddNotification
}) => {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [showAllHistory, setShowAllHistory] = React.useState(false);
  const { userProfile } = useUser();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  const kpis = calculateKPIs(data);
  const benchmark = INDUSTRY_BENCHMARKS[data.industry || 'Technology'];
  const healthScore = calculateHealthScore(kpis, benchmark);
  const safeScore = Math.max(0, Math.min(100, healthScore.total));

  const netProfitMarginComparison = getComparison(kpis.netProfitMargin, benchmark.netProfitMargin);
  const currentRatioComparison = getComparison(kpis.currentRatio, benchmark.currentRatio);
  const quickRatioComparison = getComparison(kpis.quickRatio, benchmark.quickRatio);
  const roeComparison = getComparison(kpis.roe, benchmark.roe);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await getFinancialInsights(data, undefined, keys, provider as AIProvider);
    setAnalysisResult(result);
    setIsAnalyzing(false);
    onAddNotification({ type: 'success', title: 'Analysis Complete', msg: `Strategic insights generated using ${provider.toUpperCase()}.` });
  };

  const chartData = history.map(h => ({ name: h.period, Revenue: h.revenue, "Net Profit": calculateKPIs(h).netIncome }));

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-3xl font-black font-display text-white tracking-tight">Performance <span className="text-primary italic">Overview</span></h3>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Targeting {data.industry} Benchmarks | Period: <span className="text-slate-300 font-bold">{data.period}</span></p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Engine: {provider}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Health Index</h4>
          <div className="text-6xl font-black text-white font-display mb-2 drop-shadow-xl">{safeScore}</div>
          <p className={`text-xs font-black uppercase tracking-widest ${healthScore.labelColor}`}>{healthScore.label}</p>
        </div>
        <KpiCard label="Net Profit Margin" value={`${kpis.netProfitMargin.toFixed(1)}%`} benchmarkValue={`${benchmark.netProfitMargin}%`} icon={TrendingUp} comparison={netProfitMarginComparison} />
        <KpiCard label="Current Ratio" value={kpis.currentRatio.toFixed(2)} benchmarkValue={benchmark.currentRatio.toFixed(2)} icon={ShieldCheck} comparison={currentRatioComparison} />
        <KpiCard label="Quick Ratio" value={kpis.quickRatio.toFixed(2)} benchmarkValue={benchmark.quickRatio.toFixed(2)} icon={GlassWater} comparison={quickRatioComparison} />
        <KpiCard label="ROE" value={`${kpis.roe.toFixed(1)}%`} benchmarkValue={`${benchmark.roe}%`} icon={Zap} comparison={roeComparison} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-6">Financial Trends</h3>
          <div className="h-[300px] md:h-[400px]">
            {history.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00AEEF" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `${symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                    }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: 600 }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={30} />
                  <Line type="monotone" dataKey="Net Profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#0b0e14', strokeWidth: 2, stroke: '#10b981' }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No Trend Data Yet" message="Save snapshots over multiple periods to visualize growth." className="bg-transparent border-none" />
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Intelligence</h3>
          </div>
          {!analysisResult ? (
            <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 w-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-primary hover:border-primary transition-all p-8">
              {isAnalyzing ? <Loader2 className="w-10 h-10 animate-spin" /> : <Bot className="w-10 h-10" />}
              <span className="font-bold text-sm tracking-widest uppercase">{isAnalyzing ? 'Processing...' : 'Generate Insights'}</span>
            </button>
          ) : (
            <div className="flex-1 overflow-y-auto text-sm text-slate-400 leading-relaxed whitespace-pre-wrap p-5 bg-black/40 rounded-2xl border border-white/5 scrollbar-thin">
              {analysisResult}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" /> Historical Records
          </h3>
          {history.length > 5 && (
            <button onClick={() => setShowAllHistory(!showAllHistory)} className="text-[10px] font-black text-primary uppercase border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/5 transition-all">
              {showAllHistory ? 'Show Less' : `View All (${history.length})`}
            </button>
          )}
        </div>
        <div className="overflow-x-auto -mx-6 md:mx-0">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-white/5">
              <tr>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Net Profit</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(showAllHistory ? history.slice().reverse() : history.slice(-5).reverse()).map((h, i) => {
                const hKpis = calculateKPIs(h);
                return (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5 font-bold text-white">{h.period}</td>
                    <td className="px-6 py-5 text-slate-300 font-mono italic">{symbol}{h.revenue.toLocaleString()}</td>
                    <td className={`px-6 py-5 font-black ${hKpis.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{symbol}{hKpis.netIncome.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => onDeleteSnapshot(h.period || '')} className="text-slate-600 hover:text-rose-500 p-2 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No snapshots saved yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
