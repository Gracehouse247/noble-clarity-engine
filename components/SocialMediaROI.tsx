
import * as React from 'react';
import { 
  Users, Share2, DollarSign, TrendingUp, Filter, Save, Download, 
  Trash2, Plus, AlertCircle, BarChart as BarChartIcon, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useUser, useNotifications } from '../contexts/NobleContext';
import { CURRENCY_SYMBOLS } from '../constants';
import { AIProvider } from '../types';

interface PlatformData {
  id: string;
  name: string;
  adSpend: number;
  contentCost: number;
  influencerCost: number;
  websiteClicks: number;
  websiteConversionRate: number;
  aov: number;
  leadsGenerated: number;
  leadToCustomerRate: number;
  ltv: number;
}

interface SocialMediaROIProps {
  keys?: { google: string; openai: string };
  provider?: AIProvider;
}

const AVAILABLE_PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X (Twitter)', 'Pinterest', 'YouTube', 'Other'];

const SocialMediaROI: React.FunctionComponent<SocialMediaROIProps> = ({ keys, provider }) => {
  const { userProfile } = useUser();
  const { addNotification } = useNotifications();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  // --- State ---
  const [timeframe, setTimeframe] = React.useState('Monthly');
  const [overheads, setOverheads] = React.useState({
    teamHours: 80,
    hourlyRate: 25,
    toolCosts: 150
  });
  const [brandEquity, setBrandEquity] = React.useState({
    newFollowers: 1200,
    valuePerFollower: 0.25,
    totalEngagements: 5000,
    valuePerEngagement: 0.10
  });
  const [platforms, setPlatforms] = React.useState<PlatformData[]>([
    {
      id: '1', name: 'Facebook', 
      adSpend: 500, contentCost: 200, influencerCost: 0,
      websiteClicks: 1000, websiteConversionRate: 2.5, aov: 50,
      leadsGenerated: 50, leadToCustomerRate: 10, ltv: 300
    }
  ]);
  const [isPdfLoading, setIsPdfLoading] = React.useState(false);

  // --- Persistence ---
  React.useEffect(() => {
    const saved = localStorage.getItem('nobleSocialROI');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTimeframe(data.timeframe || 'Monthly');
        setOverheads(data.overheads || { teamHours: 80, hourlyRate: 25, toolCosts: 150 });
        setBrandEquity(data.brandEquity || { newFollowers: 1200, valuePerFollower: 0.25, totalEngagements: 5000, valuePerEngagement: 0.10 });
        setPlatforms(data.platforms || []);
      } catch (e) {
        console.error("Failed to load saved social data", e);
      }
    }
  }, []);

  const handleSave = () => {
    const data = { timeframe, overheads, brandEquity, platforms };
    localStorage.setItem('nobleSocialROI', JSON.stringify(data));
    addNotification({ title: 'Data Saved', msg: 'Social ROI data saved locally.', type: 'success' });
  };

  // --- Platform Actions ---
  const addPlatform = () => {
    const newPlatform: PlatformData = {
      id: Date.now().toString(),
      name: 'Instagram',
      adSpend: 0, contentCost: 0, influencerCost: 0,
      websiteClicks: 0, websiteConversionRate: 0, aov: 0,
      leadsGenerated: 0, leadToCustomerRate: 0, ltv: 0
    };
    setPlatforms([...platforms, newPlatform]);
  };

  const removePlatform = (id: string) => {
    setPlatforms(platforms.filter(p => p.id !== id));
  };

  const updatePlatform = (id: string, field: keyof PlatformData, value: string | number) => {
    setPlatforms(platforms.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // --- Calculations ---
  const results = React.useMemo(() => {
    const timeCost = overheads.teamHours * overheads.hourlyRate;
    const toolCost = overheads.toolCosts;
    const overheadTotal = timeCost + toolCost;
    
    const brandEquityValue = (brandEquity.newFollowers * brandEquity.valuePerFollower) + (brandEquity.totalEngagements * brandEquity.valuePerEngagement);

    let totalPlatformSpend = 0;
    let totalDirectValue = 0;

    const platformMetrics = platforms.map(p => {
      const totalCost = p.adSpend + p.contentCost + p.influencerCost;
      const valueFromWebsite = p.websiteClicks * (p.websiteConversionRate / 100) * p.aov;
      const valueFromLeads = p.leadsGenerated * (p.leadToCustomerRate / 100) * p.ltv;
      const totalValue = valueFromWebsite + valueFromLeads;
      
      totalPlatformSpend += totalCost;
      totalDirectValue += totalValue;
      
      const netProfit = totalValue - totalCost;
      const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

      return { ...p, totalCost, totalValue, netProfit, roi };
    });

    const totalInvestment = overheadTotal + totalPlatformSpend;
    const totalValueGenerated = totalDirectValue + brandEquityValue;
    const netProfit = totalValueGenerated - totalInvestment;
    const socialROI = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    return {
      timeCost, toolCost, totalPlatformSpend, overheadTotal,
      brandEquityValue, totalDirectValue,
      totalInvestment, totalValueGenerated,
      netProfit, socialROI,
      platformMetrics
    };
  }, [overheads, brandEquity, platforms]);

  // --- Charts Data ---
  const investmentChartData = [
    { name: 'Time', value: results.timeCost },
    { name: 'Tools', value: results.toolCost },
    { name: 'Ad Spend', value: results.totalPlatformSpend },
  ].filter(d => d.value > 0);

  const valueChartData = [
    { name: 'Direct Sales', value: results.totalDirectValue },
    { name: 'Brand Equity', value: results.brandEquityValue },
  ].filter(d => d.value > 0);

  const COLORS = ['#00AEEF', '#293D9B', '#F59E0B', '#10B981'];

  // --- PDF Export ---
  const generatePdf = async () => {
    setIsPdfLoading(true);
    const element = document.getElementById('social-roi-report');
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0b0e14' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`NobleWorld_SocialROI_${new Date().toISOString().split('T')[0]}.pdf`);
        addNotification({ title: 'PDF Downloaded', msg: 'Your report is ready.', type: 'success' });
      } catch (err) {
        console.error(err);
        addNotification({ title: 'Export Failed', msg: 'Could not generate PDF.', type: 'alert' });
      }
    }
    setIsPdfLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="social-roi-report">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-3xl font-bold font-['Montserrat'] text-white">Social Media ROI</h2>
          <p className="text-slate-400 text-sm mt-1">Quantify brand impact, ad spend efficiency, and true social profit.</p>
        </div>
        <div className="flex gap-3 no-print">
          <select 
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-noble-blue"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Annually</option>
          </select>
          <button 
            onClick={handleSave} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all"
          >
            <Save className="w-4 h-4" /> Save
          </button>
          <button 
            onClick={generatePdf} 
            disabled={isPdfLoading}
            className="flex items-center gap-2 px-4 py-2 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-noble-blue/20"
          >
            {isPdfLoading ? 'Exporting...' : <><Download className="w-4 h-4" /> PDF Report</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6 no-print">
          
          {/* Overheads */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-noble-blue" /> Overhead Costs
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hours Spent</label>
                <input type="number" value={overheads.teamHours} onChange={(e) => setOverheads({...overheads, teamHours: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hourly Rate ({symbol})</label>
                <input type="number" value={overheads.hourlyRate} onChange={(e) => setOverheads({...overheads, hourlyRate: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tools & Software ({symbol})</label>
              <input type="number" value={overheads.toolCosts} onChange={(e) => setOverheads({...overheads, toolCosts: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
            </div>
          </div>

          {/* Brand Equity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Brand Equity (Est.)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">New Followers</label>
                <input type="number" value={brandEquity.newFollowers} onChange={(e) => setBrandEquity({...brandEquity, newFollowers: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Value/Follower</label>
                <input type="number" step="0.01" value={brandEquity.valuePerFollower} onChange={(e) => setBrandEquity({...brandEquity, valuePerFollower: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Engagements</label>
                <input type="number" value={brandEquity.totalEngagements} onChange={(e) => setBrandEquity({...brandEquity, totalEngagements: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Value/Engage</label>
                <input type="number" step="0.01" value={brandEquity.valuePerEngagement} onChange={(e) => setBrandEquity({...brandEquity, valuePerEngagement: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm focus:border-noble-blue outline-none" />
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platforms</h3>
              <button onClick={addPlatform} className="text-xs text-noble-blue hover:text-white flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
            </div>
            {platforms.map((p, index) => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative group">
                <button onClick={() => removePlatform(p.id)} className="absolute top-2 right-2 text-slate-600 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3"/></button>
                
                <div className="mb-3">
                  <select 
                    value={p.name} 
                    onChange={(e) => updatePlatform(p.id, 'name', e.target.value)}
                    className="bg-slate-950 text-white font-bold text-sm border-none rounded focus:ring-0 cursor-pointer w-full"
                  >
                    {AVAILABLE_PLATFORMS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block">Ad Spend</label>
                    <input type="number" value={p.adSpend} onChange={(e) => updatePlatform(p.id, 'adSpend', parseFloat(e.target.value))} className="w-full bg-slate-950 rounded p-1 text-xs text-white border border-slate-800" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block">Content Cost</label>
                    <input type="number" value={p.contentCost} onChange={(e) => updatePlatform(p.id, 'contentCost', parseFloat(e.target.value))} className="w-full bg-slate-950 rounded p-1 text-xs text-white border border-slate-800" />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block">Clicks</label>
                    <input type="number" value={p.websiteClicks} onChange={(e) => updatePlatform(p.id, 'websiteClicks', parseFloat(e.target.value))} className="w-full bg-slate-950 rounded p-1 text-xs text-white border border-slate-800" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block">Conv %</label>
                    <input type="number" value={p.websiteConversionRate} onChange={(e) => updatePlatform(p.id, 'websiteConversionRate', parseFloat(e.target.value))} className="w-full bg-slate-950 rounded p-1 text-xs text-white border border-slate-800" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block">AOV</label>
                    <input type="number" value={p.aov} onChange={(e) => updatePlatform(p.id, 'aov', parseFloat(e.target.value))} className="w-full bg-slate-950 rounded p-1 text-xs text-white border border-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Investment</p>
               <p className="text-2xl font-bold text-white">{symbol}{Math.round(results.totalInvestment).toLocaleString()}</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-10 h-10 text-rose-400"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Value</p>
               <p className="text-2xl font-bold text-emerald-400">{symbol}{Math.round(results.totalValueGenerated).toLocaleString()}</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Share2 className="w-10 h-10 text-emerald-400"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Net Profit</p>
               <p className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-white' : 'text-rose-400'}`}>{symbol}{Math.round(results.netProfit).toLocaleString()}</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-10 h-10 text-white"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Social ROI</p>
               <p className={`text-2xl font-bold ${results.socialROI >= 0 ? 'text-noble-blue' : 'text-rose-400'}`}>{results.socialROI.toFixed(1)}%</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-10 h-10 text-noble-blue"/></div>
            </div>
          </div>

          {/* Analysis Text */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-noble-blue" /> Results Analysis
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              For this <strong className="text-white">{timeframe.toLowerCase()}</strong> period, your social media investment of <strong className="text-rose-400">{symbol}{Math.round(results.totalInvestment).toLocaleString()}</strong> generated <strong className="text-emerald-400">{symbol}{Math.round(results.totalValueGenerated).toLocaleString()}</strong> in value.
              {results.netProfit >= 0 
                ? <span> This resulted in a <strong className="text-emerald-400">Net Profit of {symbol}{Math.round(results.netProfit).toLocaleString()}</strong>.</span>
                : <span> This resulted in a <strong className="text-rose-400">Net Loss of {symbol}{Math.abs(Math.round(results.netProfit)).toLocaleString()}</strong>.</span>
              }
              <br/><br/>
              Direct sales and leads contributed <strong className="text-white">{((results.totalDirectValue / (results.totalValueGenerated || 1)) * 100).toFixed(0)}%</strong> of total value, while estimated brand equity contributed <strong className="text-white">{((results.brandEquityValue / (results.totalValueGenerated || 1)) * 100).toFixed(0)}%</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-slate-500" /> Cost Structure
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={investmentChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {investmentChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(val: number) => `${symbol}${val.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Value Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-slate-500" /> Value Sources
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={valueChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {valueChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10B981', '#8B5CF6'][index % 2]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(val: number) => `${symbol}${val.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Platform ROI Comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <BarChartIcon className="w-4 h-4 text-noble-blue" /> Channel Efficiency
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.platformMetrics} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}%`} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                    formatter={(val: number) => [`${val.toFixed(1)}%`, 'ROI']}
                  />
                  <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
                    {results.platformMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.roi >= 0 ? '#10B981' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SocialMediaROI;
