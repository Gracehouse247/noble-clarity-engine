
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import {
  ArrowLeft,
  Check,
  Zap,
  Shield,
  Globe,
  Bot,
  Rocket,
  Building2,
  X as XIcon,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useUser, useNotifications } from '../contexts/NobleContext';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

const PricingPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { userProfile, upgradePlan } = useUser();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [selectedSignupPlan, setSelectedSignupPlan] = React.useState<'starter' | 'growth' | 'enterprise'>('starter');
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = React.useState<'USD' | 'NGN'>('USD');

  // NGN Pricing Constants
  const NGN_GROWTH_MONTHLY = 25000;
  const NGN_GROWTH_YEARLY = 270000; // 25k * 12 * 0.9
  const NGN_ENTERPRISE_MONTHLY = 65000;
  const NGN_ENTERPRISE_YEARLY = 702000; // 65k * 12 * 0.9

  const [paymentPlan, setPaymentPlan] = React.useState<'growth' | 'enterprise'>('growth');
  const [shouldTriggerPayment, setShouldTriggerPayment] = React.useState(false);

  const getAmount = (plan: 'growth' | 'enterprise', cycle: 'monthly' | 'yearly') => {
    if (plan === 'growth') {
      return cycle === 'monthly' ? NGN_GROWTH_MONTHLY : NGN_GROWTH_YEARLY;
    }
    return cycle === 'monthly' ? NGN_ENTERPRISE_MONTHLY : NGN_ENTERPRISE_YEARLY;
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || userProfile.email || "user@nobleworld.app",
    amount: getAmount(paymentPlan, billingCycle) * 100, // Amount in kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: paymentPlan
        },
        {
          display_name: "Billing Cycle",
          variable_name: "billing_cycle",
          value: billingCycle
        }
      ]
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    upgradePlan(paymentPlan);
    addNotification({
      title: 'Upgrade Successful!',
      msg: `Welcome to the ${paymentPlan.charAt(0).toUpperCase() + paymentPlan.slice(1)} Plan. Access unlocked. Ref: ${reference.reference}`,
      type: 'success'
    });
    navigate('/dashboard');
  };

  const onClose = () => {
    setShouldTriggerPayment(false);
  };

  const handlePlanClick = (planName: string) => {
    const normalizedPlan = planName.toLowerCase() as 'starter' | 'growth' | 'enterprise';

    if (!user) {
      setSelectedSignupPlan(normalizedPlan);
      setIsAuthModalOpen(true);
      return;
    }

    if (normalizedPlan === 'growth' || normalizedPlan === 'enterprise') {
      setPaymentPlan(normalizedPlan);

      if (currency === 'NGN') {
        // Direct call to ensure it's a user-initiated event
        // @ts-ignore
        initializePayment(onSuccess, onClose);
      } else {
        upgradePlan(normalizedPlan);
        addNotification({
          title: 'Upgrade Successful',
          msg: `Welcome to ${planName} Plan (USD Simulated).`,
          type: 'success'
        });
        navigate('/dashboard');
      }
    } else if (normalizedPlan === 'starter') {
      navigate('/dashboard');
    }
  };

  const isCurrentPlan = (planName: string) => user && userProfile.plan === planName.toLowerCase();

  const getButtonText = (planName: string, baseText: string) => {
    if (!user) return `Get Started with ${planName}`;
    if (isCurrentPlan(planName)) return "Active Plan";
    return baseText;
  };

  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Essential visibility for early-stage founders and students.",
      icon: Rocket,
      iconColor: "text-slate-400",
      bgColor: "bg-slate-900",
      buttonColor: "bg-slate-800 hover:bg-slate-700 text-white",
      buttonText: getButtonText('Starter', "Downgrade"),
      isFree: true,
      features: [
        "Financial Health Dashboard (Current Month)",
        "Basic KPI Tracking (Margins, ROE)",
        "1 Business Profile",
        "Manual Data Entry",
        "Community Support"
      ],
      disabledFeatures: [
        "Historical Trend Analysis",
        "AI Financial Coach",
        "Scenario Planner",
        "Cash Flow Forecasting",
        "Marketing ROI Calculator",
        "PDF Report Exports"
      ]
    },
    {
      name: "Growth",
      price: currency === 'USD'
        ? (billingCycle === 'monthly' ? "$25" : "$22.50")
        : (billingCycle === 'monthly' ? "₦25,000" : "₦22,500"), // Monthly equivalent
      displayPrice: currency === 'USD'
        ? (billingCycle === 'monthly' ? "$25" : "$22.50")
        : (billingCycle === 'monthly' ? "₦25,000" : "₦22,500"),
      period: "per month",
      description: "Full AI intelligence for scaling businesses and CFOs.",
      popular: true,
      icon: Zap,
      iconColor: "text-noble-blue",
      bgColor: "bg-slate-900 border-noble-blue/50 shadow-noble-blue/10 shadow-2xl",
      buttonColor: "bg-noble-blue hover:bg-noble-blue/90 text-white",
      buttonText: getButtonText('Growth', currency === 'NGN' ? "Pay with Paystack" : "Start Upgrade"),
      isFree: false,
      features: [
        "Everything in Starter",
        "Unlimited Historical Data & Trends",
        "AI Financial Coach (Gemini Powered)",
        "Advanced Scenario Planner",
        "Cash Flow Runway & Burn Rate Forecast",
        "Marketing ROI Command Center",
        "Goal Setting & Tracking",
        "Professional PDF Report Exports",
        "Priority Email Support"
      ],
      disabledFeatures: [
        "Multi-Entity Consolidation",
        "White-Label Reporting",
        "API Access"
      ]
    },
    {
      name: "Enterprise",
      price: currency === 'USD'
        ? (billingCycle === 'monthly' ? "$65" : "$58.50")
        : (billingCycle === 'monthly' ? "₦65,000" : "₦58,500"),
      displayPrice: currency === 'USD'
        ? (billingCycle === 'monthly' ? "$65" : "$58.50")
        : (billingCycle === 'monthly' ? "₦65,000" : "₦58,500"),
      period: "per month",
      description: "For agencies, VC firms, and multi-entity organizations.",
      icon: Building2,
      iconColor: "text-purple-400",
      bgColor: "bg-slate-900",
      buttonColor: "bg-white text-noble-deep hover:bg-slate-200",
      buttonText: getButtonText('Enterprise', currency === 'NGN' ? "Pay with Paystack" : "Contact Sales"),
      isFree: false,
      features: [
        "Everything in Growth",
        "Unlimited Business Profiles",
        "Multi-Entity Consolidation Views",
        "White-Label Client Reports",
        "API Access & Custom Integrations",
        "Dedicated Account Manager",
        "SLA & Enterprise Security",
        "Custom AI Model Tuning"
      ],
      disabledFeatures: []
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center shadow-lg shadow-noble-blue/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight hidden sm:block">NOBLE WORLD</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-noble-blue hover:bg-noble-blue/90 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-noble-blue/20"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-noble-blue/10 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Montserrat'] leading-tight">
            Plans for Every Stage of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-noble-blue to-purple-400">Financial Growth</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Whether you're just starting out or managing a portfolio of companies,
            Noble World gives you the insights to win.
          </p>

          {/* Controls Container */}
          <div className="flex flex-col items-center gap-6 pt-8">
            {/* Currency Toggle */}
            <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 inline-flex">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currency === 'USD' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('NGN')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${currency === 'NGN' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
              >
                NGN (₦) <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30">Local</span>
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center items-center gap-4">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
              <div
                className="w-14 h-7 bg-slate-800 rounded-full p-1 cursor-pointer transition-colors relative"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              >
                <div className={`w-5 h-5 bg-noble-blue rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
              <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                Yearly <span className="text-emerald-400 text-xs ml-1">(Save 10%)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-3xl border border-slate-800 p-8 flex flex-col h-full hover:border-slate-700 transition-all ${plan.bgColor}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-noble-blue to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-4 border border-slate-800`}>
                  <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold font-['Montserrat'] text-white">{plan.name}</h3>
                <p className="text-slate-400 text-sm mt-2 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-['Montserrat']">{plan.displayPrice}</span>
                  {plan.price !== "Custom" && <span className="text-slate-500 text-sm font-medium">/{plan.period === "forever" ? "forever" : billingCycle === 'yearly' ? "mo (billed yearly)" : "mo"}</span>}
                </div>
                {currency === 'NGN' && !plan.isFree && plan.price !== "Custom" && (
                  <p className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Pay in Naira via Paystack
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  if (plan.name === 'Enterprise' && currency === 'USD') {
                    window.location.href = "mailto:sales@nobleworld.app";
                  } else {
                    handlePlanClick(plan.name);
                  }
                }}
                disabled={isCurrentPlan(plan.name)}
                className={`w-full py-4 rounded-xl font-bold text-sm mb-8 transition-transform hover:scale-105 ${plan.buttonColor} shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {plan.buttonText}
              </button>

              <div className="space-y-4 flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">What's included</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                  {plan.disabledFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <XIcon className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode="signup"
          initialPlan={selectedSignupPlan}
          initialBillingCycle={billingCycle}
        />
      )}

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-slate-900 bg-[#0b0e14]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xs">N</div>
            <span>Noble World &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate('/api-docs')} className="hover:text-white transition-colors">API Docs</button>
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigate('/story')} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
