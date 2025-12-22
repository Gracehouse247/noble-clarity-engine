
import * as React from 'react';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Wallet,
  ArrowUpRight,
  PieChart as PieIcon,
  Activity,
  Layers
} from 'lucide-react';
import { useBusiness, useUser } from '../contexts/NobleContext';
import { calculateKPIs, CURRENCY_SYMBOLS } from '../constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const ConsolidationView: React.FunctionComponent = () => {
  const { profiles, activeProfileId, switchProfile } = useBusiness();
  const [aggregatedData, setAggregatedData] = React.useState<any>(null);
  const { userProfile } = useUser();
  const [baseCurrency, setBaseCurrency] = React.useState(userProfile.currency || 'USD');

  // Mock Exchange Rates (In a real app, these would come from an API)
  const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1.0,
    'EUR': 1.08,
    'GBP': 1.25,
    'JPY': 0.0067,
    'CAD': 0.74,
    'AUD': 0.66,
    'NGN': 0.00065
  };

  const convert = (amount: number, from: string, to: string) => {
    const fromRate = EXCHANGE_RATES[from] || 1.0;
    const toRate = EXCHANGE_RATES[to] || 1.0;
    return (amount * fromRate) / toRate;
  };

  React.useEffect(() => {
    try {
      const allDataStr = localStorage.getItem('nobleClarityProfilesData');
      if (allDataStr) {
        const allData = JSON.parse(allDataStr);

        let totalRevenue = 0;
        let totalNetIncome = 0;
        let totalCash = 0;
        let totalLiabilities = 0;
        const entityPerformance = [];
        let hasMixedCurrencies = false;

        profiles.forEach(p => {
          const pData = allData[p.id]?.current;
          if (p.currency !== baseCurrency) hasMixedCurrencies = true;

          if (pData) {
            const kpis = calculateKPIs(pData);
            const pCurrency = p.currency || 'USD';

            // Convert everything to baseCurrency
            totalRevenue += convert(pData.revenue, pCurrency, baseCurrency);
            totalNetIncome += convert(kpis.netIncome, pCurrency, baseCurrency);
            totalCash += convert(pData.currentAssets, pCurrency, baseCurrency);
            totalLiabilities += convert(pData.totalLiabilities, pCurrency, baseCurrency);

            entityPerformance.push({
              id: p.id,
              name: p.name,
              currency: pCurrency,
              revenue: convert(pData.revenue, pCurrency, baseCurrency),
              profit: convert(kpis.netIncome, pCurrency, baseCurrency),
              margin: kpis.netProfitMargin,
              cash: convert(pData.currentAssets, pCurrency, baseCurrency)
            });
          }
        });

        setAggregatedData({
          totalRevenue,
          totalNetIncome,
          totalCash,
          totalLiabilities,
          hasMixedCurrencies,
          entityPerformance: entityPerformance.sort((a, b) => b.revenue - a.revenue)
        });
      }
    } catch (e) {
      console.error("Consolidation Error", e);
    }
  }, [profiles, baseCurrency]);

  if (!aggregatedData) return <div className="p-8 text-slate-400">Loading Consolidated View...</div>;

  const symbol = CURRENCY_SYMBOLS[baseCurrency] || '$';

  const COLORS = ['#00AEEF', '#293D9B', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Layers className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold font-['Montserrat'] text-white">Multi-Entity Consolidation</h2>
          </div>
          <p className="text-slate-400 text-sm ml-12">Aggregate performance across {profiles.length} business entities.</p>
        </div>
        <div className="flex items-center gap-4 no-print">
          {aggregatedData.hasMixedCurrencies && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-bold text-amber-500 uppercase">
              <Activity className="w-3 h-3" /> Mixed Currencies Detected
            </div>
          )}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Base:</span>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="bg-transparent border-none text-white text-xs font-bold outline-none cursor-pointer"
            >
              {Object.keys(CURRENCY_SYMBOLS).map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
          </div>
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-400 uppercase tracking-wider">
            Enterprise Mode
          </div>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-16 h-16 text-noble-blue" /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-3xl font-extrabold text-white font-['Montserrat']">{symbol}{aggregatedData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-16 h-16 text-emerald-500" /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Net Profit</p>
          <p className={`text-3xl font-extrabold font-['Montserrat'] ${aggregatedData.totalNetIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {symbol}{aggregatedData.totalNetIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-16 h-16 text-amber-500" /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Global Liquidity</p>
          <p className="text-3xl font-extrabold text-white font-['Montserrat']">{symbol}{aggregatedData.totalCash.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16 text-rose-500" /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Exposure</p>
          <p className="text-3xl font-extrabold text-white font-['Montserrat']">{symbol}{aggregatedData.totalLiabilities.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Contribution */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Revenue Contribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aggregatedData.entityPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {aggregatedData.entityPerformance.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: number) => `${symbol}${value.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entity Performance Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Entity Performance Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Entity Name</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Net Profit</th>
                  <th className="px-4 py-3">Margin</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {aggregatedData.entityPerformance.map((entity: any) => (
                  <tr key={entity.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" /> {entity.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{symbol}{entity.revenue.toLocaleString()}</td>
                    <td className={`px-4 py-3 font-medium ${entity.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {symbol}{entity.profit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${entity.margin > 15 ? 'bg-emerald-500/10 text-emerald-400' : entity.margin > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {entity.margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => switchProfile(entity.id)}
                        className="text-xs font-bold text-noble-blue hover:text-white flex items-center justify-end gap-1 ml-auto"
                      >
                        View Dashboard <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidationView;
