import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, CheckCircle2, AlertCircle, User as UserIcon, CreditCard, Globe, ShieldAlert } from 'lucide-react';
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
    const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'enterprise'>('enterprise');
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
                setSignupStep('account_creation');
            } else {
                setSignupStep('account_creation');
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

    const validatePassword = (pwd: string) => {
        const minLength = 8;
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

        if (pwd.length < minLength) return "Password must be at least 8 characters long.";
        if (!hasUpper) return "Password must contain at least one uppercase letter.";
        if (!hasLower) return "Password must contain at least one lowercase letter.";
        if (!hasNumber) return "Password must contain at least one number.";
        if (!hasSpecial) return "Password must contain at least one special character.";
        return null;
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        finalizeSignup();
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
                        plan: selectedPlan,
                        createdAt: new Date().toISOString(),
                        role: 'owner',
                        billingCycle: billingCycle
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
                    {/* Premium Loading Overlay for Google Auth */}
                    {loading && (
                        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-noble-blue animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldAlert className="w-8 h-8 text-noble-blue animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 font-display">Securing Connection...</h3>
                            <p className="text-slate-400 text-sm max-w-[240px]">We are establishing a private handshake with Google services.</p>

                            <div className="mt-12 flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-noble-blue animate-bounce"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-noble-blue animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-noble-blue animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                        </div>
                    )}

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
                                className="w-full h-14 bg-white border border-slate-200 text-slate-950 rounded-2xl font-bold text-sm flex items-center justify-center gap-4 hover:bg-slate-50 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {mode === 'login' ? 'Continue with Google' : 'Join using Google'}
                            </button>

                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-slate-800"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] uppercase font-bold tracking-widest">Or professional email</span>
                                <div className="flex-grow border-t border-slate-800"></div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'signup' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-noble-blue transition-colors w-5 h-5" />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-noble-blue focus:bg-slate-950 transition-all font-medium"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-noble-blue transition-colors w-5 h-5" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-noble-blue focus:bg-slate-950 transition-all font-medium"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Security Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-noble-blue transition-colors w-5 h-5" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-noble-blue focus:bg-slate-950 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-noble-blue/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (mode === 'login' ? 'Secure Login' : 'Create Secure Account')}
                                </button>

                                {mode === 'signup' && (
                                    <button
                                        type="button"
                                        onClick={() => setSignupStep('plan_selection')}
                                        className="w-full text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Change Plan
                                    </button>
                                )}
                            </form>
                        </div>
                    )}

                    <p className="mt-8 text-center text-xs text-slate-500 font-medium">
                        {mode === 'login' ? "New to Noble Clarity?" : "Already a member?"}{' '}
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'signup' : 'login');
                                setSignupStep('account_creation');
                                setError(null);
                            }}
                            className="text-noble-blue font-bold hover:text-blue-400 transition-colors"
                        >
                            {mode === 'login' ? 'Get Started' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
