
import * as React from 'react';
import { FinancialData } from '../types';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';
import { RefreshCcw, Info, Sliders, TrendingUp, TrendingDown, ShieldAlert, Rocket, Leaf } from 'lucide-react';
import { useUser } from '../contexts/NobleContext';
import { CURRENCY_SYMBOLS } from '../constants';

interface ScenarioPlannerProps {
  initialData: FinancialData;
}

const ScenarioPlanner: React.FunctionComponent<ScenarioPlannerProps> = ({ initialData }) => {
  const { userProfile } = useUser();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  // Scenario State
  const [revenueGrowth, setRevenueGrowth] = React.useState(10); // % YoY Growth Target
  const [cogsReduction, setCogsReduction] = React.useState(0); // % Efficiency Gain
  const [opexReduction, setOpexReduction] = React.useState(0); // % Cost Cutting
  const [hiringCount, setHiringCount] = React.useState(0); // Headcount Change
  const [avgSalary, setAvgSalary] = React.useState(6000); // Avg Monthly Cost per Head

  // Track which preset is currently active
  const [activeScenario, setActiveScenario] = React.useState<string | null>(null);

  // Helper to reset
  const handleReset = () => {
    setRevenueGrowth(0);
    setCogsReduction(0);
    setOpexReduction(0);
    setHiringCount(0);
    setAvgSalary(6000);
    setActiveScenario(null);
  };

  // Helper to handle manual slider changes (breaks the preset link)
  const handleManualChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(value);
    setActiveScenario(null);
  };

  // Pre-set Scenarios
  const applyScenario = (type: 'recession' | 'growth' | 'efficiency') => {
    setActiveScenario(type);
    switch (type) {
      case 'recession':
        setRevenueGrowth(-15);
        setCogsReduction(0);
        setOpexReduction(10); // Forced cuts
        setHiringCount(-2); // Layoffs
        break;
      case 'growth':
        setRevenueGrowth(40);
        setCogsReduction(5); // Economies of scale
        setOpexReduction(0);
        setHiringCount(4); // Aggressive hiring
        break;
      case 'efficiency':
        setRevenueGrowth(5);
        setCogsReduction(15); // Process improvement
        setOpexReduction(20); // Lean operations
        setHiringCount(0);
        break;
    }
  };

  // Projection Logic
  const scenarioData = React.useMemo(() => {
    // Calculate effective tax rate from initial data
    const initialEBT = initialData.revenue - initialData.cogs - initialData.operatingExpenses - initialData.interestExpense;
    const effectiveTaxRate = initialEBT > 0
      ? initialData.taxExpense / initialEBT
      : 0.21;

    return Array.from({ length: 13 }, (_, i) => {
      // Monthly compounding growth to reach annual target
      const monthlyGrowthRate = revenueGrowth / 100 / 12;
      const growthFactor = Math.pow(1 + monthlyGrowthRate, i);

      const projectedRevenue = initialData.revenue * growthFactor;

      // COGS scales with revenue (volume), but efficiency slider reduces the ratio
      const baseCOGS = initialData.cogs * (projectedRevenue / initialData.revenue);
      const projectedCOGS = baseCOGS * (1 - cogsReduction / 100);

      // OpEx logic: distinguish between existing base cuts and NEW hiring costs
      const baseOpEx = initialData.operatingExpenses * (1 - opexReduction / 100);
      const newHiringCosts = hiringCount > 0 ? (hiringCount * avgSalary) : 0;
      const salarySavings = hiringCount < 0 ? (Math.abs(hiringCount) * avgSalary) : 0;

      const projectedOpEx = Math.max(1, baseOpEx + newHiringCosts - salarySavings);

      // Calculate Earnings Before Tax (EBT)
      const projectedEBT = projectedRevenue - projectedCOGS - projectedOpEx - initialData.interestExpense;

      // Calculate dynamic tax based on EBT
      const projectedTax = projectedEBT > 0 ? projectedEBT * effectiveTaxRate : 0;

      const projectedNetIncome = projectedEBT - projectedTax;

      return {
        month: i === 0 ? 'Now' : `Month ${i}`,
        revenue: Math.round(projectedRevenue),
        netIncome: Math.round(projectedNetIncome),
        baselineNetIncome: Math.round(initialData.revenue - initialData.cogs - initialData.operatingExpenses - initialData.interestExpense - initialData.taxExpense),
        margin: ((projectedNetIncome / projectedRevenue) * 100).toFixed(1)
      };
    });
  }, [initialData, revenueGrowth, cogsReduction, opexReduction, hiringCount, avgSalary]);

  const finalProjection = scenarioData[scenarioData.length - 1];
  const baselineNetIncome = scenarioData[0].baselineNetIncome;
  const netIncomeChange = finalProjection.netIncome - baselineNetIncome;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        {/* Preset Scenarios Buttons */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-noble-blue" />
            Quick Stress Tests
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => applyScenario('recession')}
              className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all group ${activeScenario === 'recession' ? 'bg-rose-500/20 border-rose-500' : 'bg-slate-950 border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10'}`}
            >
              <ShieldAlert className={`w-6 h-6 mb-1 ${activeScenario === 'recession' ? 'text-rose-400' : 'text-slate-500 group-hover:text-rose-500'}`} />
              <span className={`text-[10px] font-bold ${activeScenario === 'recession' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>Survival</span>
            </button>
            <button
              onClick={() => applyScenario('growth')}
              className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all group ${activeScenario === 'growth' ? 'bg-noble-blue/20 border-noble-blue' : 'bg-slate-950 border-slate-800 hover:border-noble-blue/50 hover:bg-noble-blue/10'}`}
            >
              <Rocket className={`w-6 h-6 mb-1 ${activeScenario === 'growth' ? 'text-noble-blue' : 'text-slate-500 group-hover:text-noble-blue'}`} />
              <span className={`text-[10px] font-bold ${activeScenario === 'growth' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>Hypergrowth</span>
            </button>
            <button
              onClick={() => applyScenario('efficiency')}
              className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all group ${activeScenario === 'efficiency' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10'}`}
            >
              <Leaf className={`w-6 h-6 mb-1 ${activeScenario === 'efficiency' ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-500'}`} />
              <span className={`text-[10px] font-bold ${activeScenario === 'efficiency' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>Efficiency</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-display">Fine-Tune Controls</h3>
            <button
              onClick={handleReset}
              className="text-xs font-medium text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-8 flex-1">
            {/* Revenue Driver */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Target Revenue Growth</label>
                <div className={`px-2 py-1 rounded font-bold text-sm ${revenueGrowth >= 0 ? 'bg-noble-blue/10 text-noble-blue' : 'bg-rose-500/10 text-rose-500'}`}>
                  {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}%
                </div>
              </div>
              <input
                type="range" min="-30" max="100" step="1"
                value={revenueGrowth}
                onChange={(e) => handleManualChange(setRevenueGrowth, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-noble-blue"
              />
              <p className="text-xs text-slate-500">Projected annual growth rate applied monthly.</p>
            </div>

            {/* Cost Drivers */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Reduce COGS</label>
                <div className="px-2 py-1 bg-emerald-500/10 rounded text-emerald-400 font-bold text-sm">
                  {cogsReduction}%
                </div>
              </div>
              <input
                type="range" min="0" max="30" step="1"
                value={cogsReduction}
                onChange={(e) => handleManualChange(setCogsReduction, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Reduce OpEx</label>
                <div className="px-2 py-1 bg-emerald-500/10 rounded text-emerald-400 font-bold text-sm">
                  {opexReduction}%
                </div>
              </div>
              <input
                type="range" min="0" max="50" step="1"
                value={opexReduction}
                onChange={(e) => handleManualChange(setOpexReduction, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Hiring Driver */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Headcount Adjustment</label>
                <div className={`px-2 py-1 rounded font-bold text-sm ${hiringCount >= 0 ? 'bg-slate-800 text-white' : 'bg-rose-500/10 text-rose-500'}`}>
                  {hiringCount > 0 ? '+' : ''}{hiringCount}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleManualChange(setHiringCount, hiringCount - 1)}
                  aria-label="Decrease headcount"
                  className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all text-xl font-bold text-slate-400 hover:text-white"
                >-</button>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-600"></div>
                  <div
                    className={`h-full transition-all ${hiringCount >= 0 ? 'bg-noble-blue' : 'bg-rose-500'}`}
                    style={{
                      width: `${Math.abs(hiringCount) * 5}%`,
                      left: hiringCount >= 0 ? '50%' : 'auto',
                      right: hiringCount < 0 ? '50%' : 'auto'
                    }}
                  ></div>
                </div>
                <button
                  onClick={() => handleManualChange(setHiringCount, hiringCount + 1)}
                  aria-label="Increase headcount"
                  className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all text-xl font-bold text-slate-400 hover:text-white"
                >+</button>
              </div>

              {/* Avg Salary Input */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-500 font-medium uppercase">Avg. Cost / Headcount</label>
                  <span className="text-xs text-white font-bold">{symbol}{avgSalary.toLocaleString()}</span>
                </div>
                <input
                  type="range" min="2000" max="20000" step="500"
                  value={avgSalary}
                  onChange={(e) => handleManualChange(setAvgSalary, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Impact Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Projected Monthly Revenue</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">{symbol}{finalProjection.revenue.toLocaleString()}</span>
              <span className={`text-xs font-bold ${revenueGrowth >= 0 ? 'text-noble-blue' : 'text-rose-500'}`}>{revenueGrowth > 0 ? '+' : ''}{revenueGrowth}%</span>
            </div>
          </div>

          <div className={`bg-slate-900 border border-slate-800 p-5 rounded-xl ${netIncomeChange >= 0 ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Projected Net Income</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-display ${finalProjection.netIncome >= 0 ? 'text-white' : 'text-rose-400'}`}>
                {symbol}{finalProjection.netIncome.toLocaleString()}
              </span>
              <div className={`flex items-center text-xs font-bold ${netIncomeChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netIncomeChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {symbol}{Math.abs(netIncomeChange).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Projected Net Margin</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-display ${parseFloat(finalProjection.margin) > 0 ? 'text-white' : 'text-rose-400'}`}>{finalProjection.margin}%</span>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white font-display">12-Month Projection</h3>
              <p className="text-sm text-slate-400">Comparing Baseline vs. Scenario Net Income</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
                <span className="text-slate-400">Baseline (No Change)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-noble-blue rounded-full"></div>
                <span className="text-white">Projected Scenario</span>
              </div>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={scenarioData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} interval={1} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${symbol}${val / 1000}k`} />
                <Tooltip
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
                <Bar name="Baseline Net Income" dataKey="baselineNetIncome" fill="#334155" radius={[4, 4, 0, 0]} barSize={20} />
                <Line
                  type="monotone"
                  name="Projected Net Income"
                  dataKey="netIncome"
                  stroke="#00AEEF"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0b0e14', strokeWidth: 2, stroke: '#00AEEF' }}
                  activeDot={{ r: 6, fill: '#00AEEF' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Box */}
        <div className="bg-noble-deep/20 border border-noble-blue/20 p-4 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-noble-blue shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Strategic Insight</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on these settings, you are projecting a net income change of <span className={`${netIncomeChange >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>{symbol}{Math.abs(netIncomeChange * 12).toLocaleString()}</span> annually.
              {netIncomeChange < 0 && " Careful planning is required to mitigate potential losses."}
              {revenueGrowth < 0 && " Revenue contraction scenarios typically require aggressive OpEx reduction to maintain solvency."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanner;
