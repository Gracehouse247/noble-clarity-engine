
import * as React from 'react';
import { X, Save, AlertCircle, Calculator, FileText, Upload, RefreshCw, Sparkles, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { FinancialData } from '../types';
import { calculateKPIs, INITIAL_DATA, CURRENCY_SYMBOLS } from '../constants';
import { useUser, useNotifications } from '../contexts/NobleContext';
import { parseFinancialCsv } from '../services/csvService';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: FinancialData;
  onImportCsv: () => void;
  businessName: string;
  activeCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

interface InputGroupProps {
  label: string;
  name?: keyof FinancialData;
  value: number | string;
  type?: 'text' | 'number';
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  readOnly?: boolean;
  currencySymbol?: string;
}

const InputGroup = ({ label, name, value, type = 'number', onChange, readOnly = false, currencySymbol = '$' }: InputGroupProps) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex justify-between">
      {label}
      {readOnly && <span className="text-[10px] text-slate-500 italic">Auto-calculated</span>}
    </label>
    <div className="relative">
      {type === 'number' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{currencySymbol}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 ${type === 'number' ? 'pl-7' : 'pl-3'} pr-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue transition-all ${readOnly ? 'opacity-70 cursor-not-allowed bg-slate-900' : ''}`}
      />
    </div>
  </div>
);

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
    <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const MetricPreview = ({ label, value, unit = '', color = 'text-white' }: { label: string, value: string | number, unit?: string, color?: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
    <span className="text-sm text-slate-400">{label}</span>
    <span className={`font-mono font-bold ${color}`}>{value}{unit}</span>
  </div>
);

const DataEntryModal: React.FunctionComponent<DataEntryModalProps> = ({
  isOpen, onClose, currentData, onSave, onImportCsv, businessName, activeCurrency, onCurrencyChange
}) => {
  const [formData, setFormData] = React.useState<FinancialData>(currentData);
  const [isMobileKpiOpen, setIsMobileKpiOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { userProfile } = useUser();
  const { addNotification } = useNotifications();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  React.useEffect(() => {
    setFormData(currentData);
  }, [currentData, isOpen]);

  React.useEffect(() => {
    // Auto-calculate Total Equity
    setFormData(prev => ({
      ...prev,
      totalEquity: prev.totalAssets - prev.totalLiabilities
    }));
  }, [formData.totalAssets, formData.totalLiabilities]);

  const previewKPIs = React.useMemo(() => calculateKPIs(formData), [formData]);

  // Check if form is essentially empty to show tip
  const isFormEmpty = formData.revenue === 0 && formData.cogs === 0 && formData.currentAssets === 0;

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value
    }));
  };

  const handleClear = () => setFormData({ ...currentData, revenue: 0, cogs: 0, operatingExpenses: 0 }); // Soft reset

  const handleGenerateDemo = () => {
    const baseRev = Math.floor(Math.random() * 500000) + 200000;
    const leads = Math.floor(baseRev / (Math.random() * 300 + 100));
    const conversions = Math.floor(leads * (Math.random() * 0.1 + 0.02));
    const cogs = Math.floor(baseRev * (Math.random() * 0.2 + 0.3));
    const opEx = Math.floor(baseRev * (Math.random() * 0.2 + 0.35));
    const mktg = Math.floor(opEx * (Math.random() * 0.2 + 0.1));
    const interestExpense = Math.floor(opEx * 0.05);

    const ebt = baseRev - cogs - opEx - interestExpense;
    const taxExpense = Math.floor(Math.max(0, ebt * (Math.random() * 0.1 + 0.15)));

    const currentAssets = Math.floor(baseRev * (Math.random() * 0.3 + 0.2));
    const fixedAssets = Math.floor(baseRev * (Math.random() * 0.4 + 0.5));
    const totalAssets = currentAssets + fixedAssets;

    const currentLiabilities = Math.floor(currentAssets * (Math.random() * 0.4 + 0.3));
    const longTermLiabilities = Math.floor(fixedAssets * (Math.random() * 0.3 + 0.2));
    const totalLiabilities = currentLiabilities + longTermLiabilities;

    setFormData({
      ...INITIAL_DATA,
      industry: currentData.industry,
      period: `Q${Math.floor(Math.random() * 4) + 1} ${new Date().getFullYear() + 1}`,
      revenue: baseRev,
      netCreditSales: Math.floor(baseRev * 0.7),
      cogs: cogs,
      operatingExpenses: opEx,
      interestExpense: interestExpense,
      taxExpense: taxExpense,
      currentAssets: currentAssets,
      inventory: Math.floor(currentAssets * 0.2),
      accountsReceivable: Math.floor(currentAssets * 0.3),
      currentLiabilities: currentLiabilities,
      totalAssets: totalAssets,
      totalLiabilities: totalLiabilities,
      totalEquity: 0, // This will be auto-recalculated
      cashInflow: Math.floor(baseRev * (Math.random() * 0.15 + 0.8)),
      cashOutflow: Math.floor((cogs + opEx) * (Math.random() * 0.1 + 0.85)),
      marketingSpend: mktg,
      leadsGenerated: leads,
      conversions: conversions,
    });
  };

  const handleCsvClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const parsedData = await parseFinancialCsv(file);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
        addNotification({
          title: 'Import Successful',
          msg: `Successfully mapped data from ${file.name}.`,
          type: 'success'
        });
      } catch (err) {
        addNotification({
          title: 'Import Failed',
          msg: 'The CSV format was not recognized.',
          type: 'alert'
        });
        console.error("CSV Import Error:", err);
      }
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 md:rounded-2xl w-full max-w-6xl h-full md:max-h-[90vh] flex flex-col lg:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-900 z-10 gap-4">
            <div>
              <h2 className="text-xl font-bold font-['Montserrat'] text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-noble-blue" />
                <span className="truncate">Data Entry: <span className="text-noble-blue">{businessName}</span></span>
              </h2>
              <p className="text-sm text-slate-400 hidden md:block">Update period metrics manually or import from CSV.</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button onClick={handleGenerateDemo} className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs md:text-sm font-medium rounded-lg transition-all">
                <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Demo Data</span><span className="sm:hidden">Demo</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
              <button onClick={handleCsvClick} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium rounded-lg transition-all">
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Import CSV</span><span className="sm:hidden">Import</span>
              </button>
              <button onClick={onClose} aria-label="Close modal" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0b0e14]">
            {isFormEmpty && (
              <div className="mb-6 bg-noble-blue/10 border border-noble-blue/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <Lightbulb className="w-5 h-5 text-noble-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Quick Start Tip</h4>
                  <p className="text-xs text-slate-300">
                    Just exploring? Click the <strong className="text-purple-300">Demo Data</strong> button above to instantly populate all fields with realistic example figures. It's the fastest way to see what the Noble Clarity Engine can do.
                  </p>
                </div>
              </div>
            )}

            <form id="data-form" onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="Reporting Period" name="period" value={formData.period || ''} type="text" onChange={handleChange} />
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Industry Sector</label>
                  <select
                    name="industry" value={formData.industry || 'Technology'} disabled
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-white transition-all opacity-70 cursor-not-allowed"
                  >
                    <option value={formData.industry}>{formData.industry}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Currency</label>
                  <select
                    value={activeCurrency}
                    onChange={(e) => onCurrencyChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue transition-all"
                  >
                    {Object.keys(CURRENCY_SYMBOLS).map(curr => (
                      <option key={curr} value={curr}>{curr} ({CURRENCY_SYMBOLS[curr]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <Section title="Income Statement">
                <InputGroup currencySymbol={symbol} label="Total Revenue" name="revenue" value={formData.revenue} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Cost of Goods Sold (COGS)" name="cogs" value={formData.cogs} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Operating Expenses" name="operatingExpenses" value={formData.operatingExpenses} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Interest Expense" name="interestExpense" value={formData.interestExpense} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Tax Expense" name="taxExpense" value={formData.taxExpense} onChange={handleChange} />
              </Section>

              <Section title="Balance Sheet">
                <InputGroup currencySymbol={symbol} label="Total Current Assets" name="currentAssets" value={formData.currentAssets} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Total Current Liabilities" name="currentLiabilities" value={formData.currentLiabilities} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Total Assets" name="totalAssets" value={formData.totalAssets} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Total Liabilities" name="totalLiabilities" value={formData.totalLiabilities} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Total Equity" name="totalEquity" value={formData.totalEquity} readOnly />
                <InputGroup currencySymbol={symbol} label="Inventory" name="inventory" value={formData.inventory} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Accounts Receivable" name="accountsReceivable" value={formData.accountsReceivable} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Net Credit Sales" name="netCreditSales" value={formData.netCreditSales} onChange={handleChange} />
              </Section>

              <Section title="Cash Flow">
                <InputGroup currencySymbol={symbol} label="Cash Inflow" name="cashInflow" value={formData.cashInflow} onChange={handleChange} />
                <InputGroup currencySymbol={symbol} label="Cash Outflow" name="cashOutflow" value={formData.cashOutflow} onChange={handleChange} />
              </Section>

              <Section title="Marketing & Sales">
                <InputGroup currencySymbol={symbol} label="Marketing Spend" name="marketingSpend" value={formData.marketingSpend} onChange={handleChange} />
                <InputGroup label="Leads Generated" name="leadsGenerated" value={formData.leadsGenerated} onChange={handleChange} />
                <InputGroup label="Conversions / New Customers" name="conversions" value={formData.conversions} onChange={handleChange} />
              </Section>
            </form>
          </div>
          <div className="p-4 md:p-6 border-t border-slate-800 flex justify-between items-center bg-slate-900 z-10 shrink-0">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-2 md:px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Reset Form</span><span className="sm:hidden">Reset</span>
            </button>
            <button
              type="submit"
              form="data-form"
              className="px-4 py-2 md:px-6 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-noble-blue/20 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        {/* Sidebar Column (KPI Preview) */}
        <div className={`lg:w-80 w-full bg-slate-950/50 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800 transition-all duration-300 ${isMobileKpiOpen ? 'h-[50vh]' : 'h-12'} lg:h-auto`}>
          <div
            className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center cursor-pointer lg:cursor-default bg-slate-900 lg:bg-transparent"
            onClick={() => setIsMobileKpiOpen(!isMobileKpiOpen)}
            aria-label={isMobileKpiOpen ? "Collapse KPI preview" : "Expand KPI preview"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsMobileKpiOpen(!isMobileKpiOpen)}
          >
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Calculator className="w-4 h-4 text-noble-blue" />KPI Preview</h3>
              <p className="text-xs text-slate-400 hidden lg:block">Metrics update in real-time.</p>
            </div>
            <div className="lg:hidden text-slate-400">
              {isMobileKpiOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-slate-950/30">
            <MetricPreview label="Gross Profit" value={`${symbol}${previewKPIs.grossProfit.toLocaleString()}`} />
            <MetricPreview label="Net Income" value={`${symbol}${previewKPIs.netIncome.toLocaleString()}`} color={previewKPIs.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'} />
            <MetricPreview label="Net Profit Margin" value={previewKPIs.netProfitMargin.toFixed(1)} unit="%" color={previewKPIs.netProfitMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'} />
            <MetricPreview label="Current Ratio" value={previewKPIs.currentRatio.toFixed(2)} />
            <MetricPreview label="Debt-to-Equity" value={previewKPIs.debtToEquity.toFixed(2)} />
            <MetricPreview label="ROE" value={previewKPIs.roe.toFixed(1)} unit="%" />
            <MetricPreview label="ROA" value={previewKPIs.roa.toFixed(1)} unit="%" />
            <MetricPreview label="Cash Runway" value={previewKPIs.cashRunway.toFixed(1)} unit=" Months" />
            <MetricPreview label="CAC" value={`${symbol}${previewKPIs.cac.toLocaleString()}`} />
            <MetricPreview label="Marketing ROI" value={previewKPIs.roi.toFixed(1)} unit="%" />
          </div>
          <div className="p-4 bg-slate-900 border-t border-slate-800 hidden lg:block">
            <div className="bg-noble-blue/10 border border-noble-blue/20 rounded-lg p-3 text-center">
              <p className="text-xs text-noble-blue font-bold">Submit data to see a full analysis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntryModal;
