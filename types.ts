
export type AIProvider = 'gemini' | 'openai' | 'claude';

export enum TabType {
  OVERVIEW = 'Overview',
  GOALS = 'Financial Goals',
  SCENARIO = 'Scenario Planner',
  CASHFLOW = 'Cash Flow',
  MARKETING = 'Marketing ROI',
  SOCIAL = 'Social ROI',
  EMAIL = 'Email ROI',
  CONSOLIDATION = 'Consolidation'
}

export type GoalMetric =
  | 'revenue'
  | 'netProfit'
  | 'grossMargin'
  | 'currentRatio'
  | 'quickRatio'
  | 'debtToEquity'
  | 'cac'
  | 'marketingSpend'
  | 'cashRunway'
  | 'currentAssets'
  | 'leadsGenerated'
  | 'netMargin';

export interface FinancialData {
  revenue: number;
  netCreditSales: number;
  cogs: number;
  operatingExpenses: number;
  interestExpense: number;
  taxExpense: number;
  currentAssets: number;
  currentLiabilities: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  inventory: number;
  accountsReceivable: number;
  cashInflow: number;
  cashOutflow: number;
  marketingSpend: number;
  leadsGenerated: number;
  conversions: number;
  period: string; // "YYYY-MM"
  industry: string;
  targetRev?: number; // Target revenue for KPI
}

export interface FinancialGoal {
  id: string;
  name: string;
  metric: GoalMetric;
  currentValue?: number;
  targetValue: number;
  deadline: string;
  achieved: boolean;
  status?: 'on-track' | 'at-risk' | 'completed';
}

export interface KPIResult {
  label: string;
  value: string;
  status: 'positive' | 'negative' | 'neutral';
  trend: string;
  desc: string;
  formula: string;
}

export interface AnalysisSection {
  title: string;
  summary: string;
  score: number; // 0-100
  insights: string[];
  recommendations: {
    action: string;
    impact: 'high' | 'medium' | 'low';
    feasibility: 'hard' | 'moderate' | 'easy';
  }[];
}

export interface FullAnalysis {
  overallScore: number;
  sections: {
    profitability: AnalysisSection;
    liquidity: AnalysisSection;
    efficiency: AnalysisSection;
    solvency: AnalysisSection;
    growth: AnalysisSection;
  };
  executiveSummary: string;
  projectedRunway: number; // Months
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  currency: string;
  plan: 'starter' | 'growth' | 'enterprise';
  preferredProvider: AIProvider;
  role: string; // Business role (e.g., "Founder", "CFO")
  systemRole: 'user' | 'admin' | 'super-admin' | 'finance-manager' | 'operations' | 'support';
  country?: string;
  registrationDate?: string;
  twoFactorEnabled?: boolean;
  integrations?: any[];
  notifications?: {
    marketAlerts: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
  };
}

export interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  currency: string;
  businessSize?: string;
  foundingDate?: string;
}

export interface ProfileData {
  current: FinancialData;
  history: FinancialData[];
  goals: FinancialGoal[];
}

export interface Notification {
  id: number;
  time: string;
  read: boolean;
  title: string;
  msg: string;
  type: 'info' | 'success' | 'alert';
  link?: string;
  actionLabel?: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending';
  sentiment: 'positive' | 'neutral' | 'negative';
  reply?: string;
  replyDate?: string;
}

export type FeedbackStatus = 'published' | 'pending';
export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}
