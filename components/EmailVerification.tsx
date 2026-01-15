import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EmailVerification: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        // Send OTP on load
        handleSendOtp();
    }, [currentUser, navigate]);

    const handleSendOtp = async (isResend = false) => {
        setSending(true);
        setMessage(null);
        try {
            const response = await fetch('https://clarity.noblesworld.com.ng/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser?.email })
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: isResend ? 'Code resent successfully!' : 'We sent a verification code to your email.' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to send code.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setSending(false);
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) return;

        setLoading(true);
        setMessage(null);
        try {
            const response = await fetch('https://clarity.noblesworld.com.ng/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser?.email, code })
            });

            const data = await response.json();

            if (data.success) {
                await currentUser?.reload(); // Refresh firebase user to get latest state if strictly relying on that, 
                // but OTP is custom backend logic. 
                // We'll treat this as success and move them to dashboard.
                // NOTE: Ideally, we should also update a "verified" flag in Firestore or Firebase Auth custom claim.
                // For now, based on user request, this frontend gate is the key.
                // Set persistent flag to allow dashboard access
                localStorage.setItem(`verified_${currentUser?.uid}`, 'true');
                navigate('/dashboard');
            } else {
                setMessage({ type: 'error', text: 'Invalid verification code.' });
                // Clear inputs on error
                setOtp(new Array(6).fill(''));
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Verification failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto move focus
        if (element.value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto verify on fill
        if (index === 5 && element.value) {
            // Need to wait for state update or pass directly
            const code = [...newOtp];
            code[index] = element.value;
            if (code.join('').length === 6) {
                // Trigger verify slightly delayed to allow visual update
                setTimeout(() => document.getElementById('verify-btn')?.click(), 100);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-[#111827] overflow-hidden font-body antialiased">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, #1e293b, #111827)' }}></div>
            <div className="absolute inset-0 bg-[url('https://mini-cal.vercel.app/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

            <main className="relative z-10 w-full max-w-md space-y-8 rounded-xl p-8 shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <div className="flex flex-col items-center space-y-3">
                    <div className="h-12 w-12 text-white flex items-center justify-center bg-[#1392ec]/10 rounded-full border border-[#1392ec]/20">
                        <span className="material-symbols-outlined text-[28px] text-[#1392ec]">mark_email_read</span>
                    </div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white">Verify Your Email</h1>
                    <p className="text-sm text-gray-400 text-center">
                        We sent a 6-digit code to <br />
                        <span className="text-white font-medium">{currentUser?.email}</span>
                    </p>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm text-center border ${message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={el => inputRefs.current[index] = el}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onPaste={e => {
                                e.preventDefault();
                                const text = e.clipboardData.getData('text').slice(0, 6);
                                if (!/^\d+$/.test(text)) return;
                                const newOtp = text.split('');
                                while (newOtp.length < 6) newOtp.push('');
                                setOtp(newOtp);
                                if (text.length === 6) setTimeout(() => document.getElementById('verify-btn')?.click(), 100);
                            }}
                            className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg focus:border-[#1392ec] focus:ring-1 focus:ring-[#1392ec] outline-none text-white transition-all"
                        />
                    ))}
                </div>

                <div className="pt-4 space-y-4">
                    <button
                        id="verify-btn"
                        onClick={handleVerify}
                        disabled={loading || otp.join('').length !== 6}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-[#1392ec] text-base font-bold text-white shadow-[0_0_15px_2px_rgba(19,146,236,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_5px_rgba(19,146,236,0.5)] hover:bg-[#1392ec]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>

                    <div className="flex justify-between items-center text-sm">
                        <button
                            onClick={() => handleSendOtp(true)}
                            disabled={sending}
                            className="text-[#1392ec] hover:text-[#1392ec]/80 hover:underline disabled:opacity-50"
                        >
                            {sending ? 'Sending...' : 'Resend Code'}
                        </button>
                        <button
                            onClick={async () => { await logout(); navigate('/login'); }}
                            className="text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmailVerification;
