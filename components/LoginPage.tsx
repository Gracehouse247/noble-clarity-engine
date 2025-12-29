import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const LoginPage: React.FunctionComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Login Error:", err);
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
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Google Sign-In Error:", err);
            setError(err.message || "Failed to sign in with Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address to reset your password.");
            document.getElementById('email-input')?.focus();
            return;
        }
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#101a22] overflow-hidden p-4 font-display">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#2b9dee]/20 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col items-center">
                {/* Logo */}
                <div className="mb-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="material-symbols-outlined text-[#2b9dee]" style={{ fontSize: '36px', fontVariationSettings: "'FILL' 1, 'wght' 600" }}>insights</span>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Noble Clarity Engine</h1>
                </div>

                {/* Form Container */}
                <div className="w-full flex flex-col rounded-xl shadow-2xl shadow-black/20" style={{
                    background: 'rgba(28, 34, 39, 0.5)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div className="p-8 md:p-10">
                        {/* Page Heading */}
                        <div className="mb-8 text-center">
                            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Sign In</p>
                            <p className="text-[#9dadb9] text-base font-normal leading-normal mt-2">to access your financial intelligence dashboard</p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                                {successMessage}
                            </div>
                        )}

                        {/* Form */}
                        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                            {/* Email Field */}
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dadb9]">mail</span>
                                    <input
                                        id="email-input"
                                        className="w-full resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2b9dee]/30 focus:border-[#2b9dee] border border-[#3b4954] bg-[#1c2227] h-14 placeholder:text-[#9dadb9] pl-12 pr-4 py-3 text-base font-normal leading-normal transition-all duration-200"
                                        placeholder="Enter your email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </label>

                            {/* Password Field */}
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium leading-normal pb-2">Password</p>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dadb9]">lock</span>
                                    <input
                                        className="w-full resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2b9dee]/30 focus:border-[#2b9dee] border border-[#3b4954] bg-[#1c2227] h-14 placeholder:text-[#9dadb9] pl-12 pr-12 py-3 text-base font-normal leading-normal transition-all duration-200"
                                        placeholder="Enter your password"

                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    {/* Visibility Toggle */}
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9dadb9] hover:text-white"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </label>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-[#2b9dee] text-sm font-normal leading-normal underline hover:text-blue-400 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 w-full bg-[#2b9dee] text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:bg-blue-500 shadow-[0_0_15px_1px_rgba(43,157,238,0.4)] hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="truncate">{loading ? 'Signing In...' : 'Login'}</span>
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-2">
                                <hr className="flex-grow border-t border-[#3b4954]" />
                                <span className="text-[#9dadb9] text-sm">OR</span>
                                <hr className="flex-grow border-t border-[#3b4954]" />
                            </div>

                            {/* Sign In with Google */}
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 w-full bg-[#283239] text-white gap-3 text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200 hover:bg-[#34414a] border border-transparent hover:border-[#4a5c68] disabled:opacity-70"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_3030_106)">
                                        <path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.26H18.04C17.76 15.65 17.02 16.84 15.91 17.62V20.47H19.92C21.67 18.9 22.56 16.69 22.56 13.9V12.25Z" fill="#4285F4"></path>
                                        <path d="M12 23C14.99 23 17.48 22.02 19.24 20.47L15.91 17.62C14.91 18.29 13.59 18.69 12 18.69C9.36 18.69 7.1 16.99 6.2 14.7H2.08V17.62C3.84 20.94 7.61 23 12 23Z" fill="#34A853"></path>
                                        <path d="M6.2 14.7C5.96 14.03 5.82 13.29 5.82 12.5C5.82 11.71 5.96 10.97 6.2 10.3V7.38H2.08C1.36 8.79 1 10.55 1 12.5C1 14.45 1.36 16.21 2.08 17.62L6.2 14.7Z" fill="#FBBC05"></path>
                                        <path d="M12 6.31C13.68 6.31 15.1 6.91 16.23 7.96L19.31 4.88C17.48 3.14 15 2 12 2C7.61 2 3.84 4.06 2.08 7.38L6.2 10.3C7.1 8.01 9.36 6.31 12 6.31Z" fill="#EA4335"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3030_106"><rect fill="white" height="24" width="24"></rect></clipPath>
                                    </defs>
                                </svg>
                                <span className="truncate">Sign In with Google</span>
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-[#9dadb9]">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-[#2b9dee] font-bold hover:underline"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-sm text-[#9dadb9]">© 2024 Noble Clarity Engine. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LoginPage;
