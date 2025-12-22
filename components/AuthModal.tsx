import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, CheckCircle2, AlertCircle, User as UserIcon, CreditCard, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import PricingPlanSelector, { PlanType } from './PricingPlanSelector';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'signup';
    initialPlan?: 'starter' | 'growth' | 'enterprise';
    initialBillingCycle?: 'monthly' | 'yearly';
}

const AuthModal: React.FunctionComponent<AuthModalProps> = ({
    isOpen,
    onClose,
    defaultMode = 'login',
    initialPlan,
    initialBillingCycle = 'monthly'
}) => {
    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
    const [signupStep, setSignupStep] = useState<'plan_selection' | 'account_creation' | 'payment'>('plan_selection');
    const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'enterprise'>(initialPlan || 'starter');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialBillingCycle);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [gateway, setGateway] = useState<'paystack' | 'flutterwave'>('paystack');
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    // NGN Pricing Constants (Synced with PricingPage)
    const NGN_GROWTH_MONTHLY = 25000;
    const NGN_GROWTH_YEARLY = 270000;
    const NGN_ENTERPRISE_MONTHLY = 65000;
    const NGN_ENTERPRISE_YEARLY = 702000;

    const getAmount = (plan: string, cycle: 'monthly' | 'yearly') => {
        if (plan === 'growth') {
            return cycle === 'monthly' ? NGN_GROWTH_MONTHLY : NGN_GROWTH_YEARLY;
        }
        if (plan === 'enterprise') {
            return cycle === 'monthly' ? NGN_ENTERPRISE_MONTHLY : NGN_ENTERPRISE_YEARLY;
        }
        return 0;
    };

    useEffect(() => {
        if (isOpen) {
            setMode(defaultMode);
            if (initialPlan) {
                setSelectedPlan(initialPlan);
                setSignupStep(defaultMode === 'signup' ? 'account_creation' : 'plan_selection');
            } else {
                setSignupStep('plan_selection');
            }
            if (initialBillingCycle) {
                setBillingCycle(initialBillingCycle);
            }
        }
    }, [isOpen, defaultMode, initialPlan, initialBillingCycle]);

    const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
    const amountToPay = getAmount(selectedPlan, billingCycle);

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: amountToPay * 100, // Amount in kobo
        publicKey: PAYSTACK_PUBLIC_KEY,
        currency: 'NGN',
        metadata: {
            custom_fields: [
                { display_name: "Plan", variable_name: "plan", value: selectedPlan },
                { display_name: "Billing Cycle", variable_name: "billing_cycle", value: billingCycle }
            ]
        }
    };

    const initializePayment = usePaystackPayment(config);

    if (!isOpen) return null;

    const finalizeSignup = async (paymentRef?: string) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user && name) {
                await updateProfile(user, { displayName: name });
            }

            // Save user record with the chosen plan
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                name: name || 'Noble User',
                plan: selectedPlan,
                createdAt: new Date().toISOString(),
                role: 'owner',
                billingCycle: billingCycle,
                paymentRef: paymentRef || 'simulated'
            });

            onClose();
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Signup finalization failed", err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (reference: any) => {
        console.log("Payment successful", reference);
        finalizeSignup(reference.reference || reference.transaction_id);
    };

    const handleFlutterwavePayment = () => {
        // @ts-ignore
        FlutterwaveCheckout({
            public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
            tx_ref: "noble_" + Date.now(),
            amount: amountToPay,
            currency: "NGN",
            payment_options: "card, account, ussd, qr",
            customer: {
                email: email,
                name: name,
            },
            customizations: {
                title: "Noble World Subscription",
                description: `Payment for ${selectedPlan} plan (${billingCycle})`,
                logo: "https://nobleclarity.app/logo.png",
            },
            callback: (data: any) => {
                handlePaymentSuccess(data);
            },
            onclose: () => {
                setLoading(false);
            }
        });
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (selectedPlan === 'starter') {
            finalizeSignup();
        } else {
            setSignupStep('payment');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === 'signup') {
            handleSignupSubmit(e);
        } else {
            setLoading(true);
            try {
                await signInWithEmailAndPassword(auth, email, password);
                onClose();
                navigate('/dashboard');
            } catch (err: any) {
                setError(err.message.replace('Firebase: ', ''));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            const user = auth.currentUser;

            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!userDoc.exists()) {
                    await setDoc(doc(db, 'users', user.uid), {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || 'Noble User',
                        plan: 'starter',
                        createdAt: new Date().toISOString(),
                        role: 'owner',
                        billingCycle: 'monthly'
                    });
                }
            }

            onClose();
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Google Sign-In Error:", err);
            setError(err.message || "Failed to sign in with Google.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold font-display text-white mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {mode === 'login'
                                ? 'Enter your credentials to access your dashboard'
                                : 'Start your journey to financial clarity'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {mode === 'signup' && signupStep === 'plan_selection' ? (
                        <div className="space-y-6">
                            <div className="text-center mb-2">
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose your plan</h3>
                            </div>
                            <PricingPlanSelector selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
                            <button
                                onClick={() => setSignupStep('account_creation')}
                                className="w-full h-12 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-noble-blue/20 flex items-center justify-center gap-2"
                            >
                                Continue with {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                            </button>
                        </div>
                    ) : (mode === 'signup' && signupStep === 'payment') ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-2">Complete Payment</h3>
                                <p className="text-slate-400 text-sm">Review your selection and choose a gateway.</p>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Plan</span>
                                    <span className="text-white font-bold uppercase">{selectedPlan} ({billingCycle})</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-slate-800 pt-3">
                                    <span className="text-slate-500">Total Amount</span>
                                    <span className="text-emerald-400 font-bold">₦{amountToPay.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Gateway</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setGateway('paystack')}
                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${gateway === 'paystack' ? 'border-noble-blue bg-noble-blue/10' : 'border-slate-800 hover:border-slate-700'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <CreditCard className="w-4 h-4 text-noble-blue" />
                                        </div>
                                        <span className="text-xs font-bold text-white">Paystack</span>
                                    </button>
                                    <button
                                        onClick={() => setGateway('flutterwave')}
                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${gateway === 'flutterwave' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 hover:border-slate-700'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <span className="text-xs font-bold text-white">Flutterwave</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (gateway === 'paystack') {
                                        // @ts-ignore
                                        initializePayment(handlePaymentSuccess, () => console.log("Payment closed"));
                                    } else {
                                        handleFlutterwavePayment();
                                    }
                                }}
                                disabled={loading}
                                className="w-full h-14 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-noble-blue/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? 'Finalizing Account...' : `Pay ₦${amountToPay.toLocaleString()}`}
                                <CheckCircle2 size={20} />
                            </button>

                            <button
                                onClick={() => setSignupStep('account_creation')}
                                className="w-full text-slate-500 text-xs hover:text-white"
                            >
                                Back to Details
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full h-12 bg-white text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                            </button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-slate-800"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-600 text-xs uppercase font-bold">Or continue with</span>
                                <div className="flex-grow border-t border-slate-800"></div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'signup' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue transition-all"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-noble-blue/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : (selectedPlan === 'starter' ? 'Create Account' : 'Proceed to Payment'))}
                                </button>

                                {mode === 'signup' && (
                                    <button
                                        type="button"
                                        onClick={() => setSignupStep('plan_selection')}
                                        className="w-full text-slate-500 text-xs hover:text-white transition-colors"
                                    >
                                        Back to Plan Selection
                                    </button>
                                )}
                            </form>
                        </div>
                    )}

                    <p className="mt-8 text-center text-sm text-slate-500">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'signup' : 'login');
                                setSignupStep('plan_selection');
                                setError(null);
                            }}
                            className="text-noble-blue font-bold hover:underline"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
