
import { FinancialData, Review } from './types';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CNY': '¥',
  'INR': '₹',
  'NGN': '₦'
};

export const STORAGE_KEYS = {
  NOTIFICATIONS: 'nobleClarityNotifications',
  USER_PROFILE: 'nobleUserProfile',
  REVIEWS: 'nobleClarityReviews',
  API_KEYS: 'nobleClarityApiKeys',
  PROFILES: 'nobleClarityProfiles',
  ACTIVE_PROFILE_ID: 'nobleClarityActiveId',
  PROFILES_DATA: 'nobleClarityProfilesData',
  MARKETING_SCENARIOS: 'nobleMarketingScenarios'
};

// Benchmarks key: 
// netProfitMargin: (Net Income / Revenue) * 100
// currentRatio: Current Assets / Current Liabilities (Liquidity)
// debtToEquity: Total Liabilities / Total Equity (Leverage)
// roe: (Net Income / Total Equity) * 100 (Return on Equity)

export const INDUSTRY_BENCHMARKS: Record<string, {
  netProfitMargin: number;
  currentRatio: number;
  quickRatio: number; // Added Quick Ratio
  debtToEquity: number;
  roe: number;
}> = {
  'Technology': { netProfitMargin: 15, currentRatio: 1.8, quickRatio: 1.4, debtToEquity: 0.6, roe: 18 },
  'SaaS (Software)': { netProfitMargin: 22, currentRatio: 2.1, quickRatio: 1.8, debtToEquity: 0.4, roe: 25 },
  'Fintech': { netProfitMargin: 20, currentRatio: 1.5, quickRatio: 1.2, debtToEquity: 0.8, roe: 20 },
  'E-commerce': { netProfitMargin: 7, currentRatio: 1.4, quickRatio: 0.9, debtToEquity: 0.9, roe: 16 },
  'Retail': { netProfitMargin: 5, currentRatio: 1.2, quickRatio: 0.7, debtToEquity: 1.2, roe: 12 },
  'Manufacturing': { netProfitMargin: 9, currentRatio: 1.5, quickRatio: 1.1, debtToEquity: 0.9, roe: 11 },
  'Services (Consulting)': { netProfitMargin: 14, currentRatio: 1.6, quickRatio: 1.4, debtToEquity: 0.5, roe: 20 },
  'Healthcare': { netProfitMargin: 12, currentRatio: 1.3, quickRatio: 1.0, debtToEquity: 1.0, roe: 14 },
  'Pharmaceuticals': { netProfitMargin: 18, currentRatio: 1.9, quickRatio: 1.6, debtToEquity: 0.7, roe: 22 },
  'Construction': { netProfitMargin: 5, currentRatio: 1.3, quickRatio: 0.9, debtToEquity: 1.5, roe: 13 },
  'Real Estate': { netProfitMargin: 35, currentRatio: 1.0, quickRatio: 0.8, debtToEquity: 2.5, roe: 10 },
  'Transportation/Logistics': { netProfitMargin: 6, currentRatio: 1.2, quickRatio: 0.8, debtToEquity: 1.1, roe: 15 },
  'Hospitality/Restaurants': { netProfitMargin: 4, currentRatio: 0.9, quickRatio: 0.5, debtToEquity: 1.8, roe: 18 },
  'Energy': { netProfitMargin: 10, currentRatio: 1.1, quickRatio: 0.7, debtToEquity: 1.3, roe: 12 },
  'Media & Entertainment': { netProfitMargin: 13, currentRatio: 1.4, quickRatio: 1.1, debtToEquity: 0.8, roe: 17 },
  'Education': { netProfitMargin: 8, currentRatio: 1.7, quickRatio: 1.3, debtToEquity: 0.6, roe: 9 },
  'Agriculture': { netProfitMargin: 4, currentRatio: 1.5, quickRatio: 1.0, debtToEquity: 0.5, roe: 8 },
};

export const INITIAL_DATA: FinancialData = {
  period: 'Q1 2025',
  industry: 'Technology',
  revenue: 500000,
  netCreditSales: 350000, // Default estimate
  cogs: 200000,
  operatingExpenses: 150000,
  interestExpense: 5000,
  taxExpense: 25000,
  currentAssets: 120000,
  inventory: 25000, // Default estimate
  accountsReceivable: 45000, // Default estimate
  currentLiabilities: 60000,
  totalAssets: 450000,
  totalLiabilities: 150000,
  totalEquity: 300000,
  cashInflow: 45000,
  cashOutflow: 38000,
  marketingSpend: 15000,
  leadsGenerated: 1200,
  conversions: 80,
};

export const BLANK_FINANCIAL_DATA: FinancialData = {
  period: 'New Period',
  industry: 'Technology',
  revenue: 0,
  netCreditSales: 0,
  cogs: 0,
  operatingExpenses: 0,
  interestExpense: 0,
  taxExpense: 0,
  currentAssets: 0,
  inventory: 0,
  accountsReceivable: 0,
  currentLiabilities: 0,
  totalAssets: 0,
  totalLiabilities: 0,
  totalEquity: 0,
  cashInflow: 0,
  cashOutflow: 0,
  marketingSpend: 0,
  leadsGenerated: 0,
  conversions: 0,
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    authorName: 'Sarah Jenkins',
    authorRole: 'CEO, TechFlow Solutions',
    authorAvatar: 'https://picsum.photos/seed/sarah/100/100',
    rating: 5,
    comment: "Noble Clarity Engine completely transformed how we view our runway. The scenario planner saved us from a critical cash flow mistake last quarter.",
    date: '2024-03-15'
  },
  {
    id: '2',
    authorName: 'Marcus Chen',
    authorRole: 'Founder, Apex Retail',
    authorAvatar: 'https://picsum.photos/seed/marcus/100/100',
    rating: 5,
    comment: "The AI Coach is scarily accurate. It identified margin compression in our supply chain weeks before our traditional reports did.",
    date: '2024-02-28'
  },
  {
    id: '3',
    authorName: 'Elena Rodriguez',
    authorRole: 'CFO, GreenLeaf Energy',
    authorAvatar: 'https://picsum.photos/seed/elena/100/100',
    rating: 4,
    comment: "Finally, a tool that makes complex financial data accessible to my entire board. The reporting feature is worth the subscription alone.",
    date: '2024-03-10'
  }
];

export const calculateKPIs = (data: FinancialData) => {
  const grossProfit = data.revenue - data.cogs;
  const ebitda = grossProfit - data.operatingExpenses;
  const netIncome = ebitda - data.interestExpense - data.taxExpense;

  // Safe division function to avoid Infinity
  const safeDiv = (n: number, d: number) => d === 0 ? 0 : n / d;

  return {
    grossProfit,
    netIncome,
    netProfitMargin: safeDiv(netIncome, data.revenue) * 100,
    currentRatio: safeDiv(data.currentAssets, data.currentLiabilities),
    quickRatio: safeDiv(data.currentAssets - data.inventory, data.currentLiabilities),
    debtToEquity: safeDiv(data.totalLiabilities, data.totalEquity),
    roe: safeDiv(netIncome, data.totalEquity) * 100,
    roa: safeDiv(netIncome, data.totalAssets) * 100,
    cashRunway: safeDiv(data.currentAssets, (data.cashOutflow - data.cashInflow > 0 ? data.cashOutflow - data.cashInflow : 1000)),
    cac: safeDiv(data.marketingSpend, data.conversions || 1),
    roi: safeDiv((data.revenue * safeDiv(data.conversions, data.leadsGenerated) - data.marketingSpend), data.marketingSpend) * 100,
    inventoryTurnover: safeDiv(data.cogs, data.inventory || 1),
    receivablesTurnover: safeDiv(data.netCreditSales || data.revenue, data.accountsReceivable || 1)
  };
};

export const calculateHealthScore = (kpis: ReturnType<typeof calculateKPIs>, benchmark: typeof INDUSTRY_BENCHMARKS[string]) => {
  if (!kpis || !benchmark) {
    return {
      total: 0,
      label: 'N/A',
      labelColor: 'text-slate-500',
      components: []
    };
  }

  // Score calculations (0-100 scale)
  const marginScore = Math.max(0, Math.min(100, (kpis.netProfitMargin / (benchmark.netProfitMargin * 1.5)) * 100));
  const currentRatioScore = Math.max(0, Math.min(100, ((kpis.currentRatio - 0.5) / (2.5 - 0.5)) * 100)); // Target healthy range 0.5-2.5
  const debtToEquityScore = Math.max(0, Math.min(100, ((2.0 - kpis.debtToEquity) / (2.0 - 0.5)) * 100)); // Target healthy range 0.5-2.0, lower is better

  // Re-balanced weighting: Profitability (30%), Liquidity (30%), Solvency (40%)
  const total = (marginScore * 0.30) + (currentRatioScore * 0.30) + (debtToEquityScore * 0.40);

  let label = 'Needs Attention';
  let labelColor = 'text-rose-400';
  if (total > 78) { label = 'Strong'; labelColor = 'text-emerald-400'; }
  else if (total > 50) { label = 'Moderate'; labelColor = 'text-amber-400'; }

  return {
    total: Math.round(total),
    label,
    labelColor,
    components: [
      { name: 'Profitability', value: Math.round(marginScore), color: 'text-emerald-400', bgColor: 'bg-emerald-500' },
      { name: 'Liquidity', value: Math.round(currentRatioScore), color: 'text-amber-400', bgColor: 'bg-amber-500' },
      { name: 'Solvency', value: Math.round(debtToEquityScore), color: 'text-sky-400', bgColor: 'bg-sky-500' }
    ]
  };
};
