
import * as React from 'react';
import { FinancialData, FinancialGoal, GoalMetric } from '../types';
import { calculateKPIs, CURRENCY_SYMBOLS } from '../constants';
import { useUser } from '../contexts/NobleContext';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Percent,
  Users,
  Wallet,
  X,
  Trophy,
  Sparkles
} from 'lucide-react';

interface FinancialGoalsProps {
  currentData: FinancialData;
  goals: FinancialGoal[];
  onAddGoal: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
  allowAdd?: boolean;
}

const FinancialGoals: React.FunctionComponent<FinancialGoalsProps> = ({
  currentData,
  goals,
  onAddGoal,
  onDeleteGoal,
  allowAdd = true
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { userProfile } = useUser();
  const symbol = CURRENCY_SYMBOLS[userProfile.currency] || '$';

  // New Goal Form State
  const [newGoalName, setNewGoalName] = React.useState('');
  const [newGoalMetric, setNewGoalMetric] = React.useState<GoalMetric>('revenue');
  const [newGoalTarget, setNewGoalTarget] = React.useState<number>(100000);
  const [newGoalDeadline, setNewGoalDeadline] = React.useState('');

  // UI State
  const [activeTab, setActiveTab] = React.useState<'active' | 'completed'>('active');
  const [showAiSuggestion, setShowAiSuggestion] = React.useState(true);

  const kpis = calculateKPIs(currentData);

  // Filter goals based on tab
  const filteredGoals = goals.filter(g => {
    if (activeTab === 'active') return !g.achieved;
    return g.achieved;
  });

  const getActualValue = (metric: GoalMetric) => {
    switch (metric) {
      case 'revenue': return currentData.revenue;
      case 'netProfit': return kpis.netIncome;
      case 'netMargin': return kpis.netProfitMargin;
      case 'currentAssets': return currentData.currentAssets;
      case 'leadsGenerated': return currentData.leadsGenerated;
      default: return 0;
    }
  };

  const getMetricLabel = (metric: GoalMetric) => {
    switch (metric) {
      case 'revenue': return 'Total Revenue';
      case 'netProfit': return 'Net Profit';
      case 'netMargin': return 'Net Profit Margin';
      case 'currentAssets': return 'Cash Assets';
      case 'leadsGenerated': return 'Leads Generated';
      default: return '';
    }
  };

  const getMetricIcon = (metric: GoalMetric) => {
    switch (metric) {
      case 'revenue': return DollarSign;
      case 'netProfit': return TrendingUp;
      case 'netMargin': return Percent;
      case 'currentAssets': return Wallet;
      case 'leadsGenerated': return Users;
      default: return Target;
    }
  };

  const formatValue = (val: number, metric: GoalMetric) => {
    if (metric === 'netMargin') return `${val.toFixed(1)}%`;
    if (metric === 'leadsGenerated') return Math.round(val).toString();
    return `${symbol}${val.toLocaleString()}`;
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: FinancialGoal = {
      id: Date.now().toString(),
      name: newGoalName,
      metric: newGoalMetric,
      targetValue: newGoalTarget,
      deadline: newGoalDeadline || 'Ongoing'
    };
    onAddGoal(newGoal);
    setIsModalOpen(false);
    // Reset form
    setNewGoalName('');
    setNewGoalMetric('revenue');
    setNewGoalTarget(100000);
    setNewGoalDeadline('');
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto flex-1">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 py-8">
        <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em] min-w-72 font-['Montserrat']">
          Financial Goals
        </h1>
        <button
          onClick={() => {
            if (allowAdd) {
              setIsModalOpen(true);
            } else {
              if (confirm("Goal limit reached. Upgrade to Growth for unlimited goals. Upgrade now?")) {
                window.location.href = '/pricing';
              }
            }
          }}
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-noble-blue text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-lg shadow-noble-blue/20 ${!allowAdd ? 'opacity-70 grayscale' : ''}`}
          title={!allowAdd ? "Upgrade to add more goals" : "Set New Goal"}
        >
          {allowAdd ? (
            <>
              <Plus className="mr-2 text-xl" />
              <span className="truncate">Set New Goal</span>
            </>
          ) : (
            <>
              <Target className="mr-2 text-xl" />
              <span className="truncate">Limit Reached</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-0 sm:px-4 py-3">
        <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-white/5 p-1.5 border border-white/5">
          <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${activeTab === 'active' ? 'bg-[#0b0e14] shadow-lg text-white' : 'text-slate-400 hover:text-slate-300'}`}>
            <span className="truncate font-medium text-sm">Active Goals</span>
            <input
              checked={activeTab === 'active'}
              onChange={() => setActiveTab('active')}
              className="invisible w-0"
              name="goal_tabs"
              type="radio"
              value="active"
            />
          </label>
          <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${activeTab === 'completed' ? 'bg-[#0b0e14] shadow-lg text-white' : 'text-slate-400 hover:text-slate-300'}`}>
            <span className="truncate font-medium text-sm">Completed Goals</span>
            <input
              checked={activeTab === 'completed'}
              onChange={() => setActiveTab('completed')}
              className="invisible w-0"
              name="goal_tabs"
              type="radio"
              value="completed"
            />
          </label>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 py-6">
        {filteredGoals.map((goal) => {
          const actual = getActualValue(goal.metric);
          const progress = Math.min((actual / goal.targetValue) * 100, 100);
          const Icon = getMetricIcon(goal.metric);

          return (
            <div key={goal.id} className="p-0.5 rounded-xl bg-white/10 shadow-lg relative group">
              <div className="flex flex-col items-stretch justify-start rounded-lg bg-[#18232e] bg-opacity-80 backdrop-blur-sm p-6 h-full border border-white/5 hover:border-noble-blue/30 transition-all">
                <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4">
                  <div className="flex justify-between items-start">
                    <p className="text-white text-xl font-bold leading-tight tracking-[-0.015em] font-['Montserrat'] line-clamp-1" title={goal.name}>{goal.name}</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      {/* Using Delete as the primary action for now to match old functionality */}
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1 rounded-full hover:bg-white/10 hover:text-rose-400 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-slate-400 font-medium">{getMetricLabel(goal.metric)}</span>
                      <span className="text-white font-bold">{formatValue(actual, goal.metric)} / {formatValue(goal.targetValue, goal.metric)}</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-noble-blue h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-end gap-3 justify-between mt-auto">
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-400 text-sm font-medium leading-normal flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Target: {goal.deadline}
                      </p>
                    </div>
                    {/* Placeholder View Details - could open modal in future */}
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-noble-blue/10 hover:bg-noble-blue/20 text-noble-blue text-sm font-bold leading-normal transition-colors border border-noble-blue/20">
                      <span className="truncate">View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Suggestion Card - Only show in Active tab */}
        {activeTab === 'active' && showAiSuggestion && (
          <div className="p-0.5 rounded-xl bg-gradient-to-br from-purple-500/50 to-noble-blue/50 shadow-lg group animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-stretch justify-start rounded-lg bg-[#18232e] bg-opacity-90 backdrop-blur-sm p-6 h-full">
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-400 fill-purple-400/20 animate-pulse" />
                    <p className="text-white text-xl font-bold leading-tight tracking-[-0.015em] font-['Montserrat']">AI Goal Suggestion</p>
                  </div>
                  <button onClick={() => setShowAiSuggestion(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Based on your current margin of <span className="text-white font-bold">{kpis.netProfitMargin.toFixed(1)}%</span>, considering setting a goal to improve efficiency.
                </p>
                <div className="flex items-center gap-3 justify-end mt-auto pt-2">
                  <button onClick={() => setShowAiSuggestion(false)} className="px-4 h-9 text-slate-400 hover:text-white text-sm font-bold transition-colors">
                    Dismiss
                  </button>
                  <button
                    onClick={() => {
                      if (allowAdd) {
                        setNewGoalName("Optimize Net Margin");
                        setNewGoalMetric('netMargin');
                        setNewGoalTarget(Math.ceil(kpis.netProfitMargin + 5));
                        setIsModalOpen(true);
                      } else {
                        // same upgrade logic
                        if (confirm("Goal limit reached. Upgrade to Growth. Upgrade now?")) {
                          window.location.href = '/pricing';
                        }
                      }
                    }}
                    className="flex items-center justify-center px-4 h-9 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                  >
                    Accept Suggestion
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredGoals.length === 0 && !showAiSuggestion && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No {activeTab} goals found</h3>
            <p className="text-slate-400 max-w-sm mb-6">Create a new goal to start tracking your financial milestones.</p>
            <button
              onClick={() => allowAdd && setIsModalOpen(true)}
              disabled={!allowAdd}
              className="px-6 py-2 bg-noble-blue text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Goal
            </button>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Set New Goal</h3>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close modal" className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Revenue Target"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase">Metric</label>
                <select
                  value={newGoalMetric}
                  onChange={(e) => setNewGoalMetric(e.target.value as GoalMetric)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue"
                >
                  <option value="revenue">Total Revenue</option>
                  <option value="netProfit">Net Profit</option>
                  <option value="netMargin">Net Profit Margin (%)</option>
                  <option value="currentAssets">Cash Assets</option>
                  <option value="leadsGenerated">Leads Generated</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase">Target Value</label>
                  <input
                    type="number"
                    required
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase">Deadline</label>
                  <input
                    type="date"
                    required
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-noble-blue hover:bg-noble-blue/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-noble-blue/20"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialGoals;
