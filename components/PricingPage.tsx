
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import {
  ArrowLeft,
  Check,
  Zap,
  Building2,
  X as XIcon,
  CreditCard,
  CheckCircle2,
  Globe,
  Rocket
} from 'lucide-react';
import { useUser, useNotifications } from '../contexts/NobleContext';
import Navbar from './Navbar';

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


  // Derive onboarding state directly to avoid useEffect delay
  const params = new URLSearchParams(window.location.search);
  const isOnboarding = params.get('onboarding') === 'true';

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
    navigate(isOnboarding ? '/onboarding' : '/dashboard');
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
        // @ts-ignore
        initializePayment(onSuccess, onClose);
      } else {
        upgradePlan(normalizedPlan);
        addNotification({
          title: 'Upgrade Successful',
          msg: `Welcome to ${planName} Plan (USD Simulated).`,
          type: 'success'
        });
        navigate(isOnboarding ? '/onboarding' : '/dashboard');
      }
    } else if (normalizedPlan === 'starter') {
      // If onboarding, allow "Continue with Free Plan" to proceed to onboarding
      if (isOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const isCurrentPlan = (planName: string) => {
    if (isOnboarding) return false; // Allow selecting current plan if onboarding
    return user && userProfile.plan === planName.toLowerCase();
  };

  const getButtonText = (planName: string, baseText: string) => {
    if (isOnboarding) {
      if (planName === 'Starter') return "Continue with Free Plan";
      return "Upgrade to " + planName;
    }
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
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-noble-blue/10 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up">
            <span className="block text-primary text-sm uppercase tracking-[0.2em] font-bold mb-4">Noble Clarity Pricing & Value</span>
            The Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Budgeting Apps</span> <br className="hidden md:block" />
            for Small Business
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto animate-fade-in-up delay-100 mb-10">
            Predictive financial intelligence should be accessible. Explore the <strong>best budgeting apps for small business</strong> and scaling startups, designed to give you crystalline clarity on your runway and ROI.
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

      {/* FAQ Section */}
      <section className="py-20 px-6 border-t border-slate-800 bg-[#0b0e14]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-3">What is the best budgeting app for small business startups?</h3>
              <p className="text-slate-400 leading-relaxed">
                Noble Clarity Engine is widely considered one of the best budgeting apps for small business startups due to its integrated predictive analytics and AI-driven growth engine. Unlike basic trackers, it forecasts your runway and ROI.
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-3">How does predictive analytics help small businesses?</h3>
              <p className="text-slate-400 leading-relaxed">
                Predictive analytics allows small businesses to anticipate cash flow gaps, simulate growth scenarios, and make data-driven decisions that reduce risk and maximize ROI. It turns historical data into future foresight.
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-3">Can I automate my financial health checkup?</h3>
              <p className="text-slate-400 leading-relaxed">
                Yes, Noble Clarity Engine automates your financial health checkup by connecting directly to your data streams and providing real-time KPI tracking. You get an instant diagnosis of your business vitals 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema Markup for Google Feature Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the best budgeting app for small business startups?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Noble Clarity Engine is widely considered one of the best budgeting apps for small business startups due to its integrated predictive analytics and AI-driven growth engine."
              }
            },
            {
              "@type": "Question",
              "name": "How does predictive analytics help small businesses?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Predictive analytics allows small businesses to anticipate cash flow gaps, simulate growth scenarios, and make data-driven decisions that reduce risk and maximize ROI."
              }
            },
            {
              "@type": "Question",
              "name": "Can I automate my financial health checkup?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Noble Clarity Engine automates your financial health checkup by connecting directly to your data streams and providing real-time KPI tracking."
              }
            }
          ]
        })}
      </script>

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
