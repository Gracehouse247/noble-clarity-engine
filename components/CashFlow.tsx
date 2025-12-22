import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FinancialData } from '../types';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Clock,
  PieChart as PieChartIcon,
  Calculator,
  RefreshCcw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine
} from 'recharts';
import { useUser } from '../contexts/NobleContext';
import { CURRENCY_SYMBOLS } from '../constants';
import EmptyState from './EmptyState';

interface CashFlowProps {
  currentData: FinancialData;
  history: FinancialData[];
}

const COLORS = ['#00AEEF', '#293D9B', '#F59E0B', '#EF4444'];

const CashFlow: React.FunctionComponent<CashFlowProps> = ({ currentData, history }) => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  const netCashFlow = currentData.cashInflow - currentData.cashOutflow;
  const burnRate = Math.max(0, currentData.cashOutflow - currentData.cashInflow);

  // Refined Runway Math: (Current Assets - Inventory) / Monthly Burn
  const liquidAssets = Math.max(0, currentData.currentAssets - (currentData.inventory || 0));
  const runway = burnRate > 0 ? (liquidAssets / burnRate).toFixed(1) : '∞';

  const expenseBreakdown = [
    { name: 'COGS', value: currentData.cogs },
    { name: 'OpEx', value: currentData.operatingExpenses },
    { name: 'Interest', value: currentData.interestExpense },
    { name: 'Tax', value: currentData.taxExpense },
  ].filter(item => item.value > 0);

  const historyData = history.length > 0 ? history.map(h => ({
    period: h.period,
    inflow: h.cashInflow,
    outflow: h.cashOutflow,
    net: h.cashInflow - h.cashOutflow
  })) : [
    { period: 'Current', inflow: currentData.cashInflow, outflow: currentData.cashOutflow, net: netCashFlow }
  ];

  // --- Forecasting Simulator State ---
  const [simCash, setSimCash] = React.useState(currentData.currentAssets);
  const [simInflow, setSimInflow] = React.useState(currentData.cashInflow);
  const [simOutflow, setSimOutflow] = React.useState(currentData.cashOutflow);

  // Sync simulator with real data when it changes
  React.useEffect(() => {
    setSimCash(currentData.currentAssets);
    setSimInflow(currentData.cashInflow);
    setSimOutflow(currentData.cashOutflow);
  }, [currentData]);

  // Forecast Calculations
  const simNetFlow = simInflow - simOutflow;
  const simBurn = Math.max(0, -simNetFlow);
  const simRunway = simNetFlow >= 0 ? "Infinite" : (simCash / simBurn).toFixed(1);

  const forecastData = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const balance = simCash + (simNetFlow * i);
      return {
        month: i === 0 ? 'Now' : `+${i} Mo`,
        balance: balance,
        safe: balance > 0
      };
    });
  }, [simCash, simNetFlow]);

  const handleResetSim = () => {
    setSimCash(currentData.currentAssets);
    setSimInflow(currentData.cashInflow);
    setSimOutflow(currentData.cashOutflow);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold font-['Montserrat'] text-white">Cash Flow Management</h3>
          <p className="text-slate-400 text-sm">Liquidity analysis and runway forecasting.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-noble-blue" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Net Cash Flow</p>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold font-['Montserrat'] ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netCashFlow >= 0 ? '+' : ''}{symbol}{netCashFlow.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Monthly Inflow vs Outflow</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Runway</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold font-['Montserrat'] text-white">{runway}</span>
            <span className="text-sm font-medium text-slate-400">Months</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Based on current burn rate</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Cash Inflow</p>
          <span className="text-3xl font-bold font-['Montserrat'] text-white">{symbol}{currentData.cashInflow.toLocaleString()}</span>
          <p className="text-xs text-slate-500 mt-2">Total collections this period</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownCircle className="w-16 h-16 text-rose-500" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Cash Outflow</p>
          <span className="text-3xl font-bold font-['Montserrat'] text-white">{symbol}{currentData.cashOutflow.toLocaleString()}</span>
          <p className="text-xs text-slate-500 mt-2">Total disbursements this period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Historical Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white font-['Montserrat'] mb-6">Cash Flow Trends</h3>
          <div className="h-[350px] w-full">
            {history.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${symbol}${val / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                  <Bar name="Inflow" dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar name="Outflow" dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No Cash History"
                message="Your cash flow trends will appear here once you have saved multiple snapshots."
                className="bg-transparent border-none"
              />
            )}
          </div>
        </div>

        {/* Expense Breakdown Pie */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white font-['Montserrat'] mb-6">Outflow Breakdown</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PieChartIcon className="w-8 h-8 text-slate-600" />
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {expenseBreakdown.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{symbol}{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Burn Rate Alert */}
      {burnRate > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="text-amber-400 font-bold text-sm">Attention: Negative Cash Flow</h4>
            <p className="text-slate-400 text-xs mt-1 mb-4">
              Your business is currently burning cash at a rate of <span className="text-white font-medium">{symbol}{burnRate.toLocaleString()} / month</span>.
              Based on your current assets, you have approximately <span className="text-white font-medium">{runway} months</span> of runway left.
              Consider reducing OpEx or improving collections to extend this window.
            </p>
            <button
              onClick={() => navigate('/dashboard/scenario')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Calculator className="w-3 h-3" /> Run Survival Scenario
            </button>
          </div>
        </div>
      )}

      {/* Forecasting Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calculator className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-white">Forecast Engine</h3>
              <p className="text-sm text-slate-400">Simulate your cash runway over the next 6 months.</p>
            </div>
          </div>
          <button
            onClick={handleResetSim}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Reset to Actuals
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected Runway</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${parseFloat(simRunway) < 3 && simRunway !== 'Infinite' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {simNetFlow >= 0 ? 'Positive Flow' : 'Burn Mode'}
                </span>
              </div>
              <p className="text-4xl font-extrabold font-['Montserrat'] text-white">
                {simRunway} <span className="text-base font-medium text-slate-400">Months</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-medium">Starting Cash Balance</span>
                  <span className="text-white font-bold">{symbol}{simCash.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={currentData.currentAssets * 2}
                  step="1000"
                  value={simCash}
                  onChange={(e) => setSimCash(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-medium">Projected Monthly Inflow</span>
                  <span className="text-emerald-400 font-bold">{symbol}{simInflow.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={currentData.cashInflow * 3 || 100000}
                  step="500"
                  value={simInflow}
                  onChange={(e) => setSimInflow(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-medium">Projected Monthly Outflow</span>
                  <span className="text-rose-400 font-bold">{symbol}{simOutflow.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={currentData.cashOutflow * 3 || 100000}
                  step="500"
                  value={simOutflow}
                  onChange={(e) => setSimOutflow(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 h-[350px] bg-slate-800/30 rounded-xl p-4 border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${symbol}${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: number) => [`${symbol}${value.toLocaleString()}`, 'Projected Balance']}
                />
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;
