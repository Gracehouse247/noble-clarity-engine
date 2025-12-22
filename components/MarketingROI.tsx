import * as React from 'react';
import { FinancialData, AIProvider } from '../types';
import { useUser, useNotifications } from '../contexts/NobleContext';
import { CURRENCY_SYMBOLS, STORAGE_KEYS } from '../constants';
import { getMarketingInsights } from '../services/ai';
import {
  Users, Target, DollarSign, TrendingUp, Filter, Calculator, ArrowRight,
  Volume2, Square, Loader2, Save, Download, RefreshCw, Mail, Share2, Megaphone,
  Info, AlertTriangle, CheckCircle2, Plus, Trash2, Clock, ThumbsUp, Heart,
  Split, ShieldAlert, MousePointer, ChevronDown, Bot, Video, FileText, Layers, RefreshCcw, Sparkles
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface MarketingROIProps {
  currentData: FinancialData;
  history: FinancialData[];
  keys?: { google: string; openai: string };
  provider?: AIProvider;
}

type CalculationMode = 'aov' | 'ltv';

const MARKETING_BENCHMARKS: Record<string, { roas: number; cvr: number; cpc: number; label: string }> = {
  ecommerce: { roas: 4, cvr: 2.8, cpc: 1.31, label: 'E-commerce' },
  saas: { roas: 3, cvr: 3.5, cpc: 5.45, label: 'SaaS (B2B)' }, // Adapted for generic ROAS/LTV comparison
  real_estate: { roas: 5, cvr: 1.5, cpc: 1.85, label: 'Real Estate' },
  professional_services: { roas: 5, cvr: 4.0, cpc: 4.17, label: 'Services' }
};

const MarketingROI: React.FunctionComponent<MarketingROIProps> = ({ currentData, keys, provider }) => {
  const { userProfile } = useUser();
  const { addNotification } = useNotifications();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  // --- State ---
  const [mode, setMode] = React.useState<CalculationMode>('aov');
  const [industry, setIndustry] = React.useState('ecommerce');
  const [isPdfLoading, setIsPdfLoading] = React.useState(false);
  const [aiInsights, setAiInsights] = React.useState('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  // Inputs
  const [inputs, setInputs] = React.useState({
    adSpend: currentData.marketingSpend || 5000,
    otherCosts: 1000,
    salesCosts: 2000,
    cpc: 2.50,
    visitorToLead: 5.0,
    leadToCustomer: 20.0,
    // AOV Mode
    aov: 150,
    cogsPercent: 40, // %
    // LTV Mode
    arpa: 99,
    grossMargin: 85, // %
    churnRate: 4.0 // %
  });

  const [scenarios, setScenarios] = React.useState<Record<string, typeof inputs>>({});

  // Load scenarios from local storage
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MARKETING_SCENARIOS);
    if (saved) setScenarios(JSON.parse(saved));
  }, []);

  const handleInputChange = (field: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const saveScenario = () => {
    const name = prompt("Name this scenario:", "Campaign A");
    if (name) {
      const updated = { ...scenarios, [name]: inputs };
      setScenarios(updated);
      localStorage.setItem(STORAGE_KEYS.MARKETING_SCENARIOS, JSON.stringify(updated));
      addNotification({ title: 'Scenario Saved', msg: `"${name}" has been saved.`, type: 'success' });
    }
  };

  const loadScenario = (name: string) => {
    if (scenarios[name]) {
      setInputs(scenarios[name]);
      addNotification({ title: 'Scenario Loaded', msg: `"${name}" parameters applied.`, type: 'info' });
    }
  };

  // --- Calculations ---
  const results = React.useMemo(() => {
    const totalMarketing = inputs.adSpend + inputs.otherCosts;
    const totalAcquisitionCost = totalMarketing + inputs.salesCosts;

    const clicks = inputs.cpc > 0 ? inputs.adSpend / inputs.cpc : 0;
    const leads = clicks * (inputs.visitorToLead / 100);
    const customers = leads * (inputs.leadToCustomer / 100);

    let revenue = 0, totalCOGS = 0, ltv = 0;

    if (mode === 'aov') {
      revenue = customers * inputs.aov;
      totalCOGS = revenue * (inputs.cogsPercent / 100);
    } else {
      const months = inputs.churnRate > 0 ? 100 / inputs.churnRate : 24; // Cap at 24 months for safety if 0 churn
      const lifetimeRev = inputs.arpa * months;
      ltv = lifetimeRev * (inputs.grossMargin / 100);
      revenue = customers * lifetimeRev; // Total cohort revenue
      totalCOGS = revenue * (1 - (inputs.grossMargin / 100));
    }

    const grossProfit = revenue - totalCOGS;
    const netProfit = grossProfit - totalAcquisitionCost;
    const roi = totalAcquisitionCost > 0 ? (netProfit / totalAcquisitionCost) * 100 : 0;
    const roas = inputs.adSpend > 0 ? revenue / inputs.adSpend : 0;
    const cac = customers > 0 ? totalAcquisitionCost / customers : 0;
    const ltvCacRatio = (mode === 'ltv' && cac > 0) ? ltv / cac : (mode === 'aov' && cac > 0) ? (inputs.aov * (1 - inputs.cogsPercent / 100)) / cac : 0;

    // Breakeven Point Guards
    const unitRevenue = mode === 'aov' ? inputs.aov : (inputs.arpa * (inputs.churnRate > 0 ? 100 / inputs.churnRate : 24));
    const unitCOGS = mode === 'aov' ? (inputs.aov * (inputs.cogsPercent / 100)) : (unitRevenue * (1 - (inputs.grossMargin / 100)));
    const unitMargin = unitRevenue - unitCOGS;

    const profitPerCust = unitMargin - (customers > 0 ? totalAcquisitionCost / customers : 0);
    const breakevenCusts = unitMargin > 0 ? totalAcquisitionCost / unitMargin : Infinity;
    const breakevenRev = isFinite(breakevenCusts) ? breakevenCusts * (mode === 'aov' ? inputs.aov : unitRevenue) : 0;

    return {
      clicks, leads, customers, revenue, totalCOGS, grossProfit, netProfit, roi, roas, cac, ltv, ltvCacRatio,
      totalAcquisitionCost, breakevenCusts, breakevenRev, profitPerCust
    };
  }, [inputs, mode]);

  // --- Charts Data ---
  const revenueChartData = [
    { name: 'COGS', value: Math.max(0, results.totalCOGS) },
    { name: 'Acquisition', value: Math.max(0, results.totalAcquisitionCost) },
    { name: 'Net Profit', value: Math.max(0, results.netProfit) },
  ];
  const REV_COLORS = ['#F59E0B', '#293D9B', '#10B981'];

  const projectionData = React.useMemo(() => {
    const data = [];
    const step = 500;
    const steps = 10;
    const start = Math.max(0, inputs.adSpend - (step * 5));

    for (let i = 0; i <= steps; i++) {
      const spend = start + (i * step);
      // Simplified projection logic reuse
      const pClicks = inputs.cpc > 0 ? spend / inputs.cpc : 0;
      const pCusts = pClicks * (inputs.visitorToLead / 100) * (inputs.leadToCustomer / 100);

      let pRev = 0, pCOGS = 0;
      if (mode === 'aov') {
        pRev = pCusts * inputs.aov;
        pCOGS = pRev * (inputs.cogsPercent / 100);
      } else {
        const months = inputs.churnRate > 0 ? 100 / inputs.churnRate : 24;
        const lifeRev = inputs.arpa * months;
        pRev = pCusts * lifeRev;
        pCOGS = pRev * (1 - (inputs.grossMargin / 100));
      }

      const pAcq = spend + inputs.otherCosts + inputs.salesCosts;
      const pNet = pRev - pCOGS - pAcq;
      const pROI = pAcq > 0 ? (pNet / pAcq) * 100 : 0;

      data.push({
        spend: spend,
        roi: Math.round(pROI)
      });
    }
    return data;
  }, [inputs, mode]);

  // --- Actions ---
  const generatePdf = async () => {
    setIsPdfLoading(true);
    const element = document.getElementById('marketing-roi-report');
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0b0e14' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`NobleWorld_ROI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        addNotification({ title: 'PDF Downloaded', msg: 'Your report is ready.', type: 'success' });
      } catch (err) {
        console.error(err);
        addNotification({ title: 'Export Failed', msg: 'Could not generate PDF.', type: 'alert' });
      }
    }
    setIsPdfLoading(false);
  };

  const getAiStrategy = async () => {
    setIsAiLoading(true);
    const contextData = { ...currentData, marketingSpend: inputs.adSpend, leadsGenerated: results.leads, conversions: results.customers };
    const res = await getMarketingInsights(contextData, keys, provider);
    setAiInsights(res);
    setIsAiLoading(false);
  };

  const benchmark = MARKETING_BENCHMARKS[industry] || MARKETING_BENCHMARKS.ecommerce;

  return (
    <div className="space-y-8 animate-fade-in" id="marketing-roi-report">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-3xl font-bold font-['Montserrat'] text-white">Advanced ROI Calculator</h2>
          <p className="text-slate-400 text-sm mt-1">Model campaign profitability, LTV, and breakeven points.</p>
        </div>
        <div className="flex gap-3 no-print">
          <select
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-noble-blue"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            {Object.entries(MARKETING_BENCHMARKS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <button
            onClick={generatePdf}
            disabled={isPdfLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all"
          >
            {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6 no-print">

          {/* Mode Toggle */}
          <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 flex">
            <button
              onClick={() => setMode('aov')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'aov' ? 'bg-noble-blue text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              <DollarSign className="w-3 h-3" /> One-Time (AOV)
            </button>
            <button
              onClick={() => setMode('ltv')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'ltv' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              <RefreshCw className="w-3 h-3" /> Subscription (LTV)
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-noble-blue" /> Campaign Inputs
            </h3>

            {/* Financial Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Ad Spend</span>
                  <span className="text-white">{symbol}{inputs.adSpend.toLocaleString()}</span>
                </div>
                <input type="range" min="100" max="50000" step="100" value={inputs.adSpend} onChange={(e) => handleInputChange('adSpend', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-noble-blue" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Other Costs ({symbol})</label>
                  <input type="number" value={inputs.otherCosts} onChange={(e) => handleInputChange('otherCosts', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sales Costs ({symbol})</label>
                  <input type="number" value={inputs.salesCosts} onChange={(e) => handleInputChange('salesCosts', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                </div>
              </div>
            </div>

            {/* Funnel Inputs */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">CPC ({symbol})</label>
                  <input type="number" step="0.1" value={inputs.cpc} onChange={(e) => handleInputChange('cpc', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Visit-Lead %</label>
                  <input type="number" step="0.1" value={inputs.visitorToLead} onChange={(e) => handleInputChange('visitorToLead', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lead-Cust %</label>
                  <input type="number" step="0.1" value={inputs.leadToCustomer} onChange={(e) => handleInputChange('leadToCustomer', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                </div>
              </div>
            </div>

            {/* Business Model Inputs */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{mode === 'aov' ? 'Sales Metrics' : 'Subscription Metrics'}</h4>
              {mode === 'aov' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Avg Order ({symbol})</label>
                    <input type="number" value={inputs.aov} onChange={(e) => handleInputChange('aov', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">COGS %</label>
                    <input type="number" value={inputs.cogsPercent} onChange={(e) => handleInputChange('cogsPercent', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ARPA ({symbol})</label>
                    <input type="number" value={inputs.arpa} onChange={(e) => handleInputChange('arpa', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Margin %</label>
                    <input type="number" value={inputs.grossMargin} onChange={(e) => handleInputChange('grossMargin', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Churn %</label>
                    <input type="number" step="0.1" value={inputs.churnRate} onChange={(e) => handleInputChange('churnRate', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scenario Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-2">
            <button onClick={saveScenario} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">Save Scenario</button>
            <select onChange={(e) => loadScenario(e.target.value)} className="flex-1 bg-slate-800 border-none text-white text-xs font-bold py-2 rounded-lg outline-none">
              <option value="">Load Scenario</option>
              {Object.keys(scenarios).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Right Column: Dashboard & Visualization */}
        <div className="lg:col-span-8 space-y-6">

          {/* Main KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Net Profit</p>
              <p className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {results.netProfit >= 0 ? '+' : ''}{symbol}{Math.round(results.netProfit).toLocaleString()}
              </p>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-10 h-10 text-white" /></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">True ROI</p>
              <p className={`text-2xl font-bold ${results.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {results.roi.toFixed(1)}%
              </p>
              <button
                onClick={getAiStrategy}
                className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-noble-blue hover:text-white transition-colors uppercase tracking-wider bg-noble-blue/10 px-2 py-1 rounded-md border border-noble-blue/30"
              >
                <Sparkles className="w-3 h-3" /> Optimize Ad Spend
              </button>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-10 h-10 text-white" /></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ROAS</p>
              <p className="text-2xl font-bold text-white">{results.roas.toFixed(2)}x</p>
              <p className="text-[10px] text-slate-500 mt-1">Ind. Avg: {benchmark.roas}x</p>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Target className="w-10 h-10 text-white" /></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">CAC</p>
              <p className="text-2xl font-bold text-white">{symbol}{Math.round(results.cac).toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                LTV:CAC
                <span className={`${results.ltvCacRatio >= 3 ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>{results.ltvCacRatio.toFixed(1)}</span>
              </p>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-10 h-10 text-white" /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Unit Economics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {revenueChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={REV_COLORS[index % REV_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(val: number) => `${symbol}${val.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Benchmark Comparison & Breakeven */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Split className="w-4 h-4 text-noble-blue" /> Breakeven Analysis
                </h3>
                {isFinite(results.breakevenCusts) ? (
                  <div className="text-sm text-slate-300 leading-relaxed">
                    To cover all costs, you need <strong className="text-white">{Math.ceil(results.breakevenCusts)} customers</strong> generating <strong className="text-white">{symbol}{Math.round(results.breakevenRev).toLocaleString()}</strong> in revenue.
                    <div className="mt-4 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${Math.min((results.customers / results.breakevenCusts) * 100, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-500 uppercase font-bold">
                      <span>0</span>
                      <span>Breakeven Point</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Breakeven unreachable with current margins.
                  </div>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Industry Benchmarks ({benchmark.label})</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Visitor-to-Lead</span>
                    <span className={`font-bold ${inputs.visitorToLead >= benchmark.cvr ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {inputs.visitorToLead}% <span className="text-slate-600 text-xs ml-1">/ {benchmark.cvr}%</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">CPC</span>
                    <span className={`font-bold ${inputs.cpc <= benchmark.cpc ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {symbol}{inputs.cpc.toFixed(2)} <span className="text-slate-600 text-xs ml-1">/ {symbol}{benchmark.cpc}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projection Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-noble-blue" /> Spend vs. ROI Projection
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="spend" stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}%`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(val: number) => [`${val}%`, 'Proj. ROI']}
                    labelFormatter={(val) => `Ad Spend: ${symbol}${val}`}
                  />
                  <Line type="monotone" dataKey="roi" stroke="#00AEEF" strokeWidth={3} dot={{ r: 4, fill: '#0b0e14', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Advisor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 no-print">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2"><Bot className="w-4 h-4 text-purple-400" /> AI Campaign Strategist</h4>
              {aiInsights && <button onClick={getAiStrategy} className="text-xs text-noble-blue hover:text-white flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> Refresh</button>}
            </div>

            {aiInsights ? (
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed animate-fade-in p-4 bg-slate-950 rounded-xl border border-slate-800">
                {aiInsights}
              </div>
            ) : (
              <button onClick={getAiStrategy} disabled={isAiLoading} className="w-full py-8 border-2 border-dashed border-slate-700 hover:border-noble-blue rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-noble-blue transition-all group">
                {isAiLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                <span className="font-bold text-sm">{isAiLoading ? 'Analyzing Funnel...' : 'Generate Strategic Recommendations'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MarketingROI;