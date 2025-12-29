/**
 * Core financial metrics for a specific period.
 */
export interface FinancialData {
  period?: string; // e.g., "Q1 2025"
  industry?: string; // e.g., "Technology", "Retail"
  revenue: number;
  netCreditSales: number;
  cogs: number;
  operatingExpenses: number;
  interestExpense: number;
  taxExpense: number;
  currentAssets: number;
  inventory: number;
  accountsReceivable: number;
  currentLiabilities: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  cashInflow: number;
  cashOutflow: number;
  marketingSpend: number;
  leadsGenerated: number;
  conversions: number;
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

export interface ScenarioAssumptions {
  revenueGrowth: number;
  costReduction: number;
  taxRate: number;
  marketingEfficiency: number;
}

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

export type GoalMetric = 'revenue' | 'netProfit' | 'netMargin' | 'currentAssets' | 'leadsGenerated';

/**
 * Supported AI Providers.
 */
export type AIProvider = 'gemini' | 'openai';

export interface FinancialGoal {
  id: string;
  name: string;
  metric: GoalMetric;
  targetValue: number;
  deadline: string;
  achieved?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  currency: string;
  plan: 'starter' | 'growth' | 'enterprise';
  preferredProvider: AIProvider;
  notifications?: {
    marketAlerts: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
  };
}

export interface Notification {
  id: number;
  title: string;
  msg: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  date: string;
}
