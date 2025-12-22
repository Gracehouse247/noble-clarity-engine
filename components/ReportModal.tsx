
import * as React from 'react';
import { X, Printer, Loader2, Sparkles, Building2, BadgeCheck } from 'lucide-react';
import { FinancialData, AIProvider } from '../types';
import { calculateKPIs, calculateHealthScore, INDUSTRY_BENCHMARKS, CURRENCY_SYMBOLS } from '../constants';
import { getFinancialInsights } from '../services/ai';
import { useUser } from '../contexts/NobleContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FinancialData;
  history: FinancialData[];
  keys?: { google: string; openai: string };
  provider?: AIProvider;
  businessName: string;
}

const ReportModal: React.FunctionComponent<ReportModalProps> = ({ isOpen, onClose, data, history, keys, provider, businessName }) => {
  const [aiAnalysis, setAiAnalysis] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const { userProfile } = useUser();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  // White Label Check
  const isEnterprise = userProfile.plan === 'enterprise';

  const kpis = calculateKPIs(data);
  const benchmark = INDUSTRY_BENCHMARKS[data.industry || 'Technology'];
  const healthScore = calculateHealthScore(kpis, benchmark);

  // Constants for charts
  const expenseData = [
    { name: 'COGS', value: data.cogs },
    { name: 'OpEx', value: data.operatingExpenses },
    { name: 'Interest', value: data.interestExpense },
    { name: 'Tax', value: data.taxExpense },
  ].filter(i => i.value > 0);

  const COLORS = ['#00AEEF', '#293D9B', '#F59E0B', '#EF4444'];

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const fetchAnalysis = async () => {
        const prompt = `
          Provide a professional "AI-Powered Insight Analysis" for an executive financial report for the business "${businessName}".
          Structure the response into 3 clear paragraphs:
          1. Overall Financial Health Assessment.
          2. Key Strength & Major Risk Factor.
          3. One Strategic Growth Recommendation.
          Keep the tone formal, direct, and data-driven. Max 200 words.
        `;
        const result = await getFinancialInsights(data, prompt, keys, provider);
        setAiAnalysis(result);
        setLoading(false);
      };
      fetchAnalysis();
    }
  }, [isOpen, data, keys, provider, businessName]);

  if (!isOpen) return null;

  const handleExportPDF = async () => {
    const reportElement = document.getElementById('printable-report-content');
    if (!reportElement) return;

    setLoading(true);
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if the content is longer than one A4 page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${businessName.replace(/\s+/g, '_')}_Financial_Report_${data.period}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const trendData = history.length > 0 ? history.map(h => ({
    name: h.period,
    Revenue: h.revenue,
    Profit: h.revenue - (h.cogs + h.operatingExpenses + h.interestExpense + h.taxExpense)
  })) : [
    { name: 'Current', Revenue: data.revenue, Profit: kpis.netIncome }
  ];

  const getLabelColorForPrint = (label: string) => {
    if (label === 'Strong') return 'text-emerald-600';
    if (label === 'Moderate') return 'text-amber-600';
    return 'text-rose-600';
  };
  const getStrokeColorForPrint = (label: string) => {
    if (label === 'Strong') return 'text-emerald-500';
    if (label === 'Moderate') return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      {/* Print-specific Styles */}
      <style>{`
        @media print {
          @page { margin: 15mm; size: auto; }
          body { visibility: hidden; overflow: visible !important; height: auto !important; background: white !important; }
          #root > *:not(#report-modal-root) { display: none !important; }
          #printable-report-content {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
            overflow: visible !important;
          }
          #printable-report-content * { visibility: visible; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div id="report-modal-root" className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">

        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900 rounded-t-2xl no-print">
          <div>
            <h2 className="text-xl font-bold font-['Montserrat'] text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-noble-blue" />
              Report Preview
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-slate-400">Review your executive summary before export.</p>
              {isEnterprise && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20 uppercase tracking-wide">
                  <BadgeCheck className="w-3 h-3" /> White Label Active
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-noble-blue/20 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              Save as PDF
            </button>
            <button onClick={onClose} aria-label="Close preview" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-800/50 flex justify-center">

          <div
            id="printable-report-content"
            className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-12 shadow-xl relative flex flex-col gap-8"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {/* 1. Report Header - Condition Logic for Enterprise */}
            <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6">
              <div>
                {!isEnterprise ? (
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Generated by Noble World</p>
                ) : (
                  <div className="flex items-center gap-2 mb-2 text-slate-900">
                    <Building2 className="w-6 h-6" />
                    <span className="font-bold uppercase tracking-widest text-xs">Internal Executive Document</span>
                  </div>
                )}
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-['Montserrat'] mb-1">{businessName}</h1>
                <p className="text-xl text-slate-600">Executive Financial Report</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-noble-blue">{data.period || 'Current Period'}</p>
                <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* 2. AI-Powered Insight Analysis */}
            <div className="break-inside-avoid">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-noble-blue" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Strategic Analysis</h3>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
                {loading ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm italic">
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing data points...
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {aiAnalysis}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Financial Health & KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 break-inside-avoid">
              <div className="col-span-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Overall Health Score</h4>
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                    <circle
                      cx="64" cy="64" r="56"
                      stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={351.86}
                      strokeDashoffset={351.86 * (1 - healthScore.total / 100)}
                      strokeLinecap="round"
                      className={getStrokeColorForPrint(healthScore.label)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{healthScore.total}</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className={`text-sm font-bold ${getLabelColorForPrint(healthScore.label)}`}>{healthScore.label}</p>
                  <p className="text-xs text-slate-400">Based on industry benchmarks</p>
                </div>
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Performance Indicators</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-2 font-bold text-slate-600">Metric</th>
                      <th className="py-2 font-bold text-slate-600">Value</th>
                      <th className="py-2 font-bold text-slate-600">Benchmark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 text-slate-500">Net Profit Margin</td>
                      <td className="py-3 font-bold">{kpis.netProfitMargin.toFixed(1)}%</td>
                      <td className="py-3 text-slate-400">~{benchmark.netProfitMargin}%</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">Current Ratio</td>
                      <td className="py-3 font-bold">{kpis.currentRatio.toFixed(2)}</td>
                      <td className="py-3 text-slate-400">{benchmark.currentRatio}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">Debt-to-Equity</td>
                      <td className="py-3 font-bold">{kpis.debtToEquity.toFixed(2)}</td>
                      <td className="py-3 text-slate-400">&lt; {benchmark.debtToEquity}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">Cash Runway</td>
                      <td className="py-3 font-bold">{kpis.cashRunway.toFixed(1)} Months</td>
                      <td className="py-3 text-slate-400">&gt; 6 Months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Charts Section */}
            <div className="grid grid-cols-2 gap-8 break-inside-avoid">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Revenue vs. Profit Trend</h3>
                <div className="h-48 w-full border border-slate-100 rounded-lg p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${symbol}${val / 1000}k`} />
                      <Bar dataKey="Revenue" fill="#0b0e14" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                      <Bar dataKey="Profit" fill="#00AEEF" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Expense Breakdown</h3>
                <div className="h-48 w-full border border-slate-100 rounded-lg p-2 flex">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value" isAnimationActive={false} >
                        {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 5. Cash Flow Summary */}
            <div className="break-inside-avoid">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Cash Flow & Liquidity</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase">Cash Inflow</p>
                  <p className="text-lg font-bold text-emerald-600">{symbol}{data.cashInflow.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase">Cash Outflow</p>
                  <p className="text-lg font-bold text-rose-600">{symbol}{data.cashOutflow.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase">Net Flow</p>
                  <p className={`text-lg font-bold ${(data.cashInflow - data.cashOutflow) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {symbol}{(data.cashInflow - data.cashOutflow).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase">Cash on Hand</p>
                  <p className="text-lg font-bold text-noble-deep">{symbol}{data.currentAssets.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-6 text-center">
              <p className="text-xs text-slate-400">CONFIDENTIAL - INTERNAL USE ONLY</p>
              {!isEnterprise && (
                <p className="text-xs text-slate-300 mt-1">&copy; {new Date().getFullYear()} Noble World. All rights reserved.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
