
import * as React from 'react';
import { 
  Users, Mail, DollarSign, TrendingUp, Filter, Save, Download, 
  Trash2, Plus, AlertCircle, BarChart as BarChartIcon, PieChart as PieChartIcon,
  MousePointer, Zap, Split
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

interface EmailMarketingROIProps {
  keys?: { google: string; openai: string };
  provider?: AIProvider;
}

const EmailMarketingROI: React.FunctionComponent<EmailMarketingROIProps> = ({ keys, provider }) => {
  const { userProfile } = useUser();
  const { addNotification } = useNotifications();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  // --- State ---
  const [inputs, setInputs] = React.useState({
    businessModel: 'ecommerce' as 'ecommerce' | 'leadgen',
    espCostType: 'fixed' as 'fixed' | 'cpm',
    espCost: 200,
    softwareCost: 150,
    teamHours: 40,
    hourlyRate: 30,
    agencyFees: 500,
    subscriberAcquisitionCost: 2,
    contentCost: 250,
    listCost: 100,
    
    // Metrics
    emailsSent: 50000,
    openRate: 25,
    ctr: 4,
    conversionRate: 5,
    unsubscribeRate: 0.5,
    
    // Value
    aov: 75,
    valuePerLead: 50,
    ltv: 500,

    // Scenarios
    whatIfOpenRate: 0,
    whatIfConversionRate: 0,
    
    // A/B Test
    abConversionA: 2.0,
    abConversionB: 2.5,
    
    // Deliverability
    bounceRate: 2.0
  });

  const [isPdfLoading, setIsPdfLoading] = React.useState(false);

  // --- Persistence ---
  React.useEffect(() => {
    const saved = localStorage.getItem('nobleEmailROI');
    if (saved) {
      try {
        setInputs({ ...inputs, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to load saved email data", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('nobleEmailROI', JSON.stringify(inputs));
    addNotification({ title: 'Data Saved', msg: 'Email ROI data saved locally.', type: 'success' });
  };

  const handleInputChange = (field: keyof typeof inputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // --- Calculations ---
  const results = React.useMemo(() => {
    const espCostTotal = inputs.espCostType === 'fixed' ? inputs.espCost : (inputs.emailsSent / 1000) * inputs.espCost;
    const laborCost = inputs.teamHours * inputs.hourlyRate;
    const platformCosts = espCostTotal + inputs.softwareCost;
    const hrCosts = laborCost + inputs.agencyFees;
    const otherCosts = inputs.contentCost + inputs.listCost;
    
    const emailsOpened = inputs.emailsSent * (inputs.openRate / 100);
    const clicks = inputs.emailsSent * (inputs.ctr / 100);
    const conversions = clicks * (inputs.conversionRate / 100);
    const unsubscribes = inputs.emailsSent * (inputs.unsubscribeRate / 100);
    const ctor = emailsOpened > 0 ? (clicks / emailsOpened) * 100 : 0;
    
    const valuePerConversion = inputs.businessModel === 'ecommerce' ? inputs.aov : inputs.valuePerLead;
    const immediateRevenue = conversions * valuePerConversion;
    const totalValueLTV = conversions * inputs.ltv;
    const acquisitionCost = conversions * inputs.subscriberAcquisitionCost;
    
    const totalInvestment = platformCosts + hrCosts + otherCosts + acquisitionCost;
    const netProfit = totalValueLTV - totalInvestment;
    const overallROI = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
    const cpa = conversions > 0 ? totalInvestment / conversions : 0;

    // What-If Scenario
    const improvedOpenRate = inputs.openRate + inputs.whatIfOpenRate;
    const improvedConvRate = inputs.conversionRate + inputs.whatIfConversionRate;
    const improvedOpened = inputs.emailsSent * (improvedOpenRate / 100);
    // Assuming CTR stays relative to Sent, but let's assume improved Open Rate improves Clicks proportionally if CTR is constant? 
    // Standard model: Clicks = Sent * CTR. If Open Rate improves, usually CTR (Click-Through-Sent) improves. 
    // Let's model it as: NewClicks = ImprovedOpened * (OriginalClicks / OriginalOpened)
    const originalCTOR = emailsOpened > 0 ? clicks / emailsOpened : 0;
    const scenarioClicks = improvedOpened * originalCTOR;
    const scenarioConversions = scenarioClicks * (improvedConvRate / 100);
    const scenarioRevenue = scenarioConversions * inputs.ltv;
    const scenarioProfit = scenarioRevenue - totalInvestment; // Assuming fixed costs
    const profitUplift = scenarioProfit - netProfit;

    // A/B Test Uplift
    const revenueA = (clicks * (inputs.abConversionA / 100)) * valuePerConversion;
    const revenueB = (clicks * (inputs.abConversionB / 100)) * valuePerConversion;
    const abUplift = revenueB - revenueA;

    // Deliverability Cost
    const deliveredEmails = inputs.emailsSent * (1 - (inputs.bounceRate / 100));
    const valuePerDelivered = deliveredEmails > 0 ? totalValueLTV / deliveredEmails : 0;
    const bouncedEmails = inputs.emailsSent * (inputs.bounceRate / 100);
    const lostRevenue = bouncedEmails * valuePerDelivered;

    return {
      platformCosts, hrCosts, otherCosts, acquisitionCost,
      emailsOpened, clicks, conversions, unsubscribes, ctor,
      immediateRevenue, totalValueLTV,
      totalInvestment, netProfit, overallROI, cpa,
      profitUplift, abUplift, lostRevenue
    };
  }, [inputs]);

  // --- Charts Data ---
  const investmentChartData = [
    { name: 'Platform', value: results.platformCosts },
    { name: 'Labor/Agency', value: results.hrCosts },
    { name: 'Content/List', value: results.otherCosts },
    { name: 'Acquisition', value: results.acquisitionCost },
  ].filter(d => d.value > 0);

  const valueChartData = [
    { name: 'Immediate Rev', value: results.immediateRevenue },
    { name: 'Long-Term Value', value: Math.max(0, results.totalValueLTV - results.immediateRevenue) },
  ].filter(d => d.value > 0);

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];

  // --- PDF Export ---
  const generatePdf = async () => {
    setIsPdfLoading(true);
    const element = document.getElementById('email-roi-report');
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0b0e14' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`NobleWorld_EmailROI_${new Date().toISOString().split('T')[0]}.pdf`);
        addNotification({ title: 'PDF Downloaded', msg: 'Your report is ready.', type: 'success' });
      } catch (err) {
        console.error(err);
        addNotification({ title: 'Export Failed', msg: 'Could not generate PDF.', type: 'alert' });
      }
    }
    setIsPdfLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="email-roi-report">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-3xl font-bold font-['Montserrat'] text-white">Email Marketing ROI</h2>
          <p className="text-slate-400 text-sm mt-1">Analyze campaign profitability, LTV, and list health.</p>
        </div>
        <div className="flex gap-3 no-print">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
             <button onClick={() => handleInputChange('businessModel', 'ecommerce')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${inputs.businessModel === 'ecommerce' ? 'bg-noble-blue text-white' : 'text-slate-500'}`}>E-commerce</button>
             <button onClick={() => handleInputChange('businessModel', 'leadgen')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${inputs.businessModel === 'leadgen' ? 'bg-purple-500 text-white' : 'text-slate-500'}`}>Lead Gen</button>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all"><Save className="w-4 h-4" /> Save</button>
          <button onClick={generatePdf} disabled={isPdfLoading} className="flex items-center gap-2 px-4 py-2 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-noble-blue/20">{isPdfLoading ? 'Exporting...' : <><Download className="w-4 h-4" /> PDF Report</>}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6 no-print">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-noble-blue" /> Investment Inputs
            </h3>
            
            {/* Tech & Platform */}
            <div className="space-y-4 border-b border-slate-800 pb-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ESP Cost Type</label>
                    <select value={inputs.espCostType} onChange={(e) => handleInputChange('espCostType', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"><option value="fixed">Fixed Monthly</option><option value="cpm">CPM (Per 1k)</option></select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{inputs.espCostType === 'fixed' ? 'Cost' : 'Cost / 1k'} ({symbol})</label>
                    <input type="number" value={inputs.espCost} onChange={(e) => handleInputChange('espCost', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Software / Tools ({symbol})</label>
                  <input type="number" value={inputs.softwareCost} onChange={(e) => handleInputChange('softwareCost', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
               </div>
            </div>

            {/* Human Resources */}
            <div className="space-y-4 border-b border-slate-800 pb-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Team Hours</label>
                    <input type="number" value={inputs.teamHours} onChange={(e) => handleInputChange('teamHours', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hourly Rate ({symbol})</label>
                    <input type="number" value={inputs.hourlyRate} onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Agency Fees ({symbol})</label>
                  <input type="number" value={inputs.agencyFees} onChange={(e) => handleInputChange('agencyFees', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
               </div>
            </div>

            {/* Other Costs */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Content Cost ({symbol})</label>
                  <input type="number" value={inputs.contentCost} onChange={(e) => handleInputChange('contentCost', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">List Cost ({symbol})</label>
                  <input type="number" value={inputs.listCost} onChange={(e) => handleInputChange('listCost', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
               </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" /> Campaign Metrics
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Emails Sent</label>
                  <input type="number" value={inputs.emailsSent} onChange={(e) => handleInputChange('emailsSent', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
               </div>
               <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Open %</label>
                    <input type="number" step="0.1" value={inputs.openRate} onChange={(e) => handleInputChange('openRate', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">CTR %</label>
                    <input type="number" step="0.1" value={inputs.ctr} onChange={(e) => handleInputChange('ctr', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Conv %</label>
                    <input type="number" step="0.1" value={inputs.conversionRate} onChange={(e) => handleInputChange('conversionRate', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{inputs.businessModel === 'ecommerce' ? 'AOV' : 'Value/Lead'} ({symbol})</label>
                    <input type="number" value={inputs.businessModel === 'ecommerce' ? inputs.aov : inputs.valuePerLead} onChange={(e) => handleInputChange(inputs.businessModel === 'ecommerce' ? 'aov' : 'valuePerLead', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cust LTV ({symbol})</label>
                    <input type="number" value={inputs.ltv} onChange={(e) => handleInputChange('ltv', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm" />
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Investment</p>
               <p className="text-2xl font-bold text-white">{symbol}{Math.round(results.totalInvestment).toLocaleString()}</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-10 h-10 text-rose-400"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Value (LTV)</p>
               <p className="text-2xl font-bold text-emerald-400">{symbol}{Math.round(results.totalValueLTV).toLocaleString()}</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-10 h-10 text-emerald-400"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Net Profit</p>
               <p className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-white' : 'text-rose-400'}`}>{symbol}{Math.round(results.netProfit).toLocaleString()}</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-10 h-10 text-white"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email ROI</p>
               <p className={`text-2xl font-bold ${results.overallROI >= 0 ? 'text-noble-blue' : 'text-rose-400'}`}>{results.overallROI.toFixed(1)}%</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-10 h-10 text-noble-blue"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">CPA</p>
               <p className="text-2xl font-bold text-purple-400">{symbol}{results.cpa.toFixed(2)}</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-10 h-10 text-purple-400"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">CTOR</p>
               <p className="text-2xl font-bold text-amber-400">{results.ctor.toFixed(1)}%</p>
               <p className="text-[10px] text-slate-500 mt-1">Click-to-Open Rate</p>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><MousePointer className="w-10 h-10 text-amber-400"/></div>
            </div>
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
                <PieChartIcon className="w-4 h-4 text-slate-500" /> Value Breakdown
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

          {/* Scenario Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* What-If */}
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                   <Zap className="w-4 h-4 text-noble-blue" /> "What-If" Planner
                </h3>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-xs mb-2">
                         <span className="text-slate-400">Improve Open Rate</span>
                         <span className="text-noble-blue font-bold">+{inputs.whatIfOpenRate}%</span>
                      </div>
                      <input type="range" min="0" max="10" step="0.5" value={inputs.whatIfOpenRate} onChange={(e) => handleInputChange('whatIfOpenRate', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-noble-blue"/>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs mb-2">
                         <span className="text-slate-400">Improve Conversion Rate</span>
                         <span className="text-noble-blue font-bold">+{inputs.whatIfConversionRate}%</span>
                      </div>
                      <input type="range" min="0" max="5" step="0.1" value={inputs.whatIfConversionRate} onChange={(e) => handleInputChange('whatIfConversionRate', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-noble-blue"/>
                   </div>
                   <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 uppercase">Potential Additional Profit</p>
                      <p className="text-xl font-bold text-emerald-400">+{symbol}{results.profitUplift.toLocaleString()}</p>
                   </div>
                </div>
             </div>

             {/* A/B Testing & Deliverability */}
             <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Split className="w-4 h-4 text-purple-400" /> A/B Test Uplift
                   </h3>
                   <div className="flex gap-4 mb-4">
                      <input type="number" placeholder="Conv A %" value={inputs.abConversionA} onChange={(e) => handleInputChange('abConversionA', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                      <input type="number" placeholder="Conv B %" value={inputs.abConversionB} onChange={(e) => handleInputChange('abConversionB', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">Projected Revenue Gain</p>
                      <p className="text-lg font-bold text-purple-400">+{symbol}{results.abUplift.toLocaleString()}</p>
                   </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400" /> Deliverability Loss
                   </h3>
                   <div className="flex gap-4 items-center mb-2">
                      <span className="text-xs text-slate-400">Bounce Rate:</span>
                      <input type="number" value={inputs.bounceRate} onChange={(e) => handleInputChange('bounceRate', parseFloat(e.target.value))} className="w-20 bg-slate-950 border border-slate-800 rounded p-1 text-xs text-white" />
                      <span className="text-xs text-slate-400">%</span>
                   </div>
                   <p className="text-xs text-rose-400">Estimated Lost Revenue: <strong>{symbol}{results.lostRevenue.toLocaleString()}</strong></p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmailMarketingROI;
