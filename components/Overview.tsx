
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
  const quickRatioComparison = getComparison(kpis.quickRatio, benchmark.quickRatio); // Added comparison
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold font-display text-white">Performance Overview: <span className="text-noble-blue">{profileName}</span></h3>
          <p className="text-slate-500 text-sm">Targeting {data.industry} Industry Benchmarks | Period: {data.period}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-noble-blue animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Core: {provider}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Health Index</h4>
          <div className="text-5xl font-extrabold text-white font-display mb-2">{safeScore}</div>
          <p className={`text-sm font-bold ${healthScore.labelColor}`}>{healthScore.label}</p>
        </div>
        <KpiCard label="Net Profit Margin" value={`${kpis.netProfitMargin.toFixed(1)}%`} benchmarkValue={`${benchmark.netProfitMargin}%`} icon={TrendingUp} comparison={netProfitMarginComparison} />
        <KpiCard label="Current Ratio" value={kpis.currentRatio.toFixed(2)} benchmarkValue={benchmark.currentRatio.toFixed(2)} icon={ShieldCheck} comparison={currentRatioComparison} />
        <KpiCard label="Quick Ratio" value={kpis.quickRatio.toFixed(2)} benchmarkValue={benchmark.quickRatio.toFixed(2)} icon={GlassWater} comparison={quickRatioComparison} />
        <KpiCard label="ROE" value={`${kpis.roe.toFixed(1)}%`} benchmarkValue={`${benchmark.roe}%`} icon={Zap} comparison={roeComparison} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Financial Trends</h3>
          <div className="h-[350px]">
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
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
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
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: 600, padding: '2px 0' }}
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}
                  />
                  <Bar
                    dataKey="Revenue"
                    name="Revenue"
                    fill="url(#colorRevenue)"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                  <Line
                    type="monotone"
                    dataKey="Net Profit"
                    name="Net Profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0b0e14', strokeWidth: 2, stroke: '#10b981' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No Trend Data Yet"
                message="Save snapshots over multiple periods to visualize your business growth and profit trends."
                className="bg-transparent border-none"
              />
            )}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles size={16} className="text-noble-blue" /> Executive Summary</h3>
            {analysisResult && <button onClick={() => setAnalysisResult(null)} className="text-xs text-slate-500 hover:text-white underline">Refresh</button>}
          </div>
          {!analysisResult ? (
            <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 w-full border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-noble-blue hover:border-noble-blue transition-all">
              {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Bot className="w-8 h-8" />}
              <span className="font-bold text-sm">{isAnalyzing ? 'Consulting AI...' : 'Analyze Metrics'}</span>
            </button>
          ) : (
            <div className="flex-1 overflow-y-auto text-sm text-slate-400 leading-relaxed whitespace-pre-wrap p-4 bg-slate-950 rounded-xl border border-slate-800">
              {analysisResult}
            </div>
          )}
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" /> Historical Records
          </h3>
          {history.length > 5 && (
            <button
              onClick={() => setShowAllHistory(!showAllHistory)}
              className="text-xs font-bold text-noble-blue hover:text-white transition-colors border border-noble-blue/30 px-3 py-1.5 rounded-lg hover:bg-noble-blue/10"
            >
              {showAllHistory ? 'Show Less' : `View All (${history.length})`}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Net Profit</th>
                <th className="px-6 py-3">Margin</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(showAllHistory ? history.slice().reverse() : history.slice(-5).reverse()).map((h, i) => {
                const hKpis = calculateKPIs(h);
                return (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{h.period}</td>
                    <td className="px-6 py-4 text-slate-300">{symbol}{h.revenue.toLocaleString()}</td>
                    <td className={`px-6 py-4 font-bold ${hKpis.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {symbol}{hKpis.netIncome.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${hKpis.netProfitMargin > 15 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {hKpis.netProfitMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDeleteSnapshot(h.period || '')}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-2"
                        title="Delete Snapshot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState
                      icon={History}
                      title="No History Found"
                      message="Snapshots allow you to track historical performance and benchmark against previous quarters."
                      className="bg-transparent border-none min-h-[200px]"
                    />
                  </td>
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
