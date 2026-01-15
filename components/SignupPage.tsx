import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const SignupPage: React.FunctionComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile
            await updateProfile(user, { displayName: name });

            // Create user document (Default to starter plan)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                name: name || 'Noble User',
                plan: 'starter',
                createdAt: new Date().toISOString(),
                role: 'owner',
                billingCycle: 'monthly'
            });

            navigate('/verify-email');
        } catch (err: any) {
            console.error("Signup Error:", err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
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
        }
            // Even Google users might need verification depending on provider settings,
            // but usually they are verified by Google. However, to match the flow request:
            // "ensure it's real people", we might want to force our own OTP or trust Google.
            // Typically Google Sign-In emails are pre-verified.
            // But if we want consistent OTP for everyone, we'd redirect to verify-email.
            // Let's stick to standard practice: Google = Verified.
            // So we go to pricing/dashboard.
            navigate('/pricing?onboarding=true');
    } catch (err: any) {
        console.error("Google Sign-In Error:", err);
        setError(err.message || "Failed to sign in with Google.");
    } finally {
        setLoading(false);
    }
};

return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-[#111827] overflow-hidden font-body antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, #1e293b, #111827)' }}></div>

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('https://mini-cal.vercel.app/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

        <main className="relative z-10 w-full max-w-md space-y-8 rounded-xl p-8 shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div className="flex flex-col items-center space-y-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="h-10 w-10 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-[#1392ec]">diamond</span>
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-white">Noble Clarity Engine</h1>
            </div>

            <div className="text-center">
                <p className="font-display text-2xl font-bold text-white">Create your Account</p>
                <p className="mt-2 text-sm text-gray-400">Unlock predictive financial intelligence.</p>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSignup}>
                <div>
                    <label className="block pb-2 text-sm font-medium leading-normal text-gray-300" htmlFor="full-name">Full Name</label>
                    <div className="bg-white/5 border border-white/10 rounded-lg focus-within:border-[#1392ec] focus-within:ring-1 focus-within:ring-[#1392ec] transition-all">
                        <input
                            className="w-full bg-transparent border-none p-3 text-base text-white placeholder:text-gray-500 focus:ring-0"
                            id="full-name"
                            name="full-name"
                            placeholder="Enter your full name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block pb-2 text-sm font-medium leading-normal text-gray-300" htmlFor="email">Work Email</label>
                    <div className="bg-white/5 border border-white/10 rounded-lg focus-within:border-[#1392ec] focus-within:ring-1 focus-within:ring-[#1392ec] transition-all">
                        <input
                            className="w-full bg-transparent border-none p-3 text-base text-white placeholder:text-gray-500 focus:ring-0"
                            id="email"
                            name="email"
                            placeholder="Enter your work email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block pb-2 text-sm font-medium leading-normal text-gray-300" htmlFor="password">Password</label>
                    <div className="flex w-full items-center bg-white/5 border border-white/10 rounded-lg focus-within:border-[#1392ec] focus-within:ring-1 focus-within:ring-[#1392ec] transition-all">
                        <input
                            className="w-full bg-transparent border-none p-3 text-base text-white placeholder:text-gray-500 focus:ring-0"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            className="pr-3 text-gray-400 hover:text-white"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                        </button>
                    </div>
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-[#1392ec] text-base font-bold text-white shadow-[0_0_15px_2px_rgba(19,146,236,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_5px_rgba(19,146,236,0.5)] hover:bg-[#1392ec]/90 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="truncate">{loading ? 'Creating Account...' : 'Create Account'}</span>
                    </button>
                </div>
            </form>

            <div className="relative flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 flex-shrink text-xs text-gray-400">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div>
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-70"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    <span>Sign up with Google</span>
                </button>
            </div>

            <div className="text-center text-xs text-gray-500">
                <p>
                    By creating an account, you agree to our <br className="sm:hidden" />
                    <a className="font-medium text-gray-400 underline-offset-2 hover:text-[#1392ec] hover:underline" href="#" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a> and{' '}
                    <a className="font-medium text-gray-400 underline-offset-2 hover:text-[#1392ec] hover:underline" href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>.
                </p>
                <p className="mt-4">
                    Already have an account?{' '}
                    <button className="font-medium text-[#1392ec] underline-offset-2 hover:underline" onClick={() => navigate('/login')}>Sign In</button>
                </p>
            </div>
        </main>
    </div>
);
};

export default SignupPage;
