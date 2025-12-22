import React from 'react';
import { Check } from 'lucide-react';

export type PlanType = 'starter' | 'growth' | 'enterprise';

interface PricingPlanSelectorProps {
    selectedPlan: PlanType;
    onSelectPlan: (plan: PlanType) => void;
}

const plans = [
    {
        id: 'starter' as PlanType,
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for small business owners just getting started.',
        features: ['Basic Financial Dashboard', 'Cash Flow Tracking', '3 Financial Goals', 'Standard Support']
    },
    {
        id: 'growth' as PlanType,
        name: 'Growth',
        price: '$49/mo',
        description: 'Advanced features for growing companies.',
        features: ['Everything in Starter', 'AI-Powered Insights', 'Scenario Planner', 'Unlimited Goals', 'Priority Support'],
        popular: true
    },
    {
        id: 'enterprise' as PlanType,
        name: 'Enterprise',
        price: '$199/mo',
        description: 'Complete solution for established organizations.',
        features: ['Everything in Growth', 'Custom Integrations', 'Dedicated Account Manager', 'Advanced Team Controls', 'API Access']
    }
];

const PricingPlanSelector: React.FC<PricingPlanSelectorProps> = ({ selectedPlan, onSelectPlan }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => onSelectPlan(plan.id)}
                        className={`
                            relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${selectedPlan === plan.id
                                ? 'bg-noble-blue/10 border-noble-blue'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                            }
                        `}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                <span className="bg-noble-blue text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                    Popular
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className={`font-bold ${selectedPlan === plan.id ? 'text-noble-blue' : 'text-white'}`}>
                                    {plan.name}
                                </h3>
                                <div className="text-xl font-bold text-white mt-1">{plan.price}</div>
                            </div>
                            <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                ${selectedPlan === plan.id
                                    ? 'bg-noble-blue border-noble-blue'
                                    : 'border-slate-600'
                                }
                            `}>
                                {selectedPlan === plan.id && <Check size={14} className="text-white" />}
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{plan.description}</p>

                        <ul className="space-y-1">
                            {plan.features.slice(0, 2).map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                    <Check size={12} className="text-noble-blue flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                            {plan.features.length > 2 && (
                                <li className="text-[10px] text-slate-500 pl-5">
                                    +{plan.features.length - 2} more features
                                </li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPlanSelector;
