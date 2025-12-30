
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

  const kpis = calculateKPIs(currentData);

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold font-['Montserrat'] text-white">Financial Goals</h3>
          <p className="text-slate-400 text-sm">Track your progress against key performance milestones.</p>
        </div>
        <button
          onClick={() => {
            if (allowAdd) {
              setIsModalOpen(true);
            } else {
              if (confirm("Goal limit reached. Upgrade to Growth for unlimited goals. Upgrade now?")) {
                // Ideally use navigate here, but for simplicity:
                window.location.href = '/pricing';
              }
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${allowAdd
              ? 'bg-noble-blue hover:bg-noble-blue/90 text-white shadow-noble-blue/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          title={!allowAdd ? "Upgrade to add more goals" : "Add New Goal"}
        >
          {!allowAdd && <Target className="w-4 h-4 mr-1" />}
          {allowAdd ? <><Plus className="w-4 h-4" /> New Goal</> : 'Limit Reached'}
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const actual = getActualValue(goal.metric);
          const progress = Math.min((actual / goal.targetValue) * 100, 100);
          const isAchieved = goal.achieved || progress >= 100;
          const Icon = getMetricIcon(goal.metric);

          return (
            <div key={goal.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group hover:border-noble-blue/30 transition-all">
              <button
                onClick={() => onDeleteGoal(goal.id)}
                aria-label={`Delete goal: ${goal.name}`}
                className="absolute top-4 right-4 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${isAchieved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-noble-blue/10 text-noble-blue'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm line-clamp-1">{goal.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{goal.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{getMetricLabel(goal.metric)}</p>
                    <p className="text-2xl font-bold text-white font-['Montserrat']">
                      {formatValue(actual, goal.metric)}
                      <span className="text-slate-500 text-sm font-normal ml-1">/ {formatValue(goal.targetValue, goal.metric)}</span>
                    </p>
                  </div>
                  {isAchieved && (
                    <div className="relative w-6 h-6">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <Sparkles style={{ '--delay': '0s' } as React.CSSProperties} className="absolute top-0 left-0 w-3 h-3 text-yellow-300 animate-sparkle-burst" />
                      <Sparkles style={{ '--delay': '0.2s' } as React.CSSProperties} className="absolute -top-1 right-1 w-2 h-2 text-amber-300 animate-sparkle-burst" />
                      <Sparkles style={{ '--delay': '0.4s' } as React.CSSProperties} className="absolute bottom-1 -left-1 w-2 h-2 text-yellow-400 animate-sparkle-burst" />
                      <Sparkles style={{ '--delay': '0.6s' } as React.CSSProperties} className="absolute -bottom-1 right-0 w-2 h-2 text-amber-400 animate-sparkle-burst" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={isAchieved ? 'text-emerald-400' : 'text-noble-blue'}>{progress.toFixed(0)}% Complete</span>
                    <span className="text-slate-500">{isAchieved ? 'Target Met' : 'In Progress'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out origin-left ${isAchieved ? 'bg-emerald-500' : 'bg-noble-blue'} ${progress > 85 && !isAchieved ? 'animate-pulse-bar' : ''}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 rounded-2xl">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-white">No Goals Set</h3>
            <p className="text-slate-400 max-w-sm mt-2 mb-6">Start setting financial targets to track your business growth effectively.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Create First Goal
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
