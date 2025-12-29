
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OnboardingFlow: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);

    // Step 1: Welcome Screen
    const WelcomeStep = () => (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-8 bg-[#0A0F1E] font-body text-[#9da4b9]">
            <style>{`
                :root {
                    --deep-blue: #0A0F1E;
                    --sky-blue: #63C5F7;
                    --soft-purple: #9277FF;
                }
            `}</style>
            <div className="absolute top-[-20%] left-[-15%] h-[500px] w-[500px] rounded-full bg-[#63C5F7]/20 blur-[150px] filter"></div>
            <div className="absolute bottom-[-20%] right-[-15%] h-[500px] w-[500px] rounded-full bg-[#9277FF]/20 blur-[150px] filter"></div>
            <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-12 text-center shadow-[0px_2px_8px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                    <div className="relative h-40 w-40">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#63C5F7] to-[#9277FF] opacity-30 blur-2xl"></div>
                        <svg className="absolute inset-0 h-full w-full text-white" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 0 C77.6142 0 100 22.3858 100 50 C100 77.6142 77.6142 100 50 100 C22.3858 100 0 77.6142 0 50 C0 22.3858 22.3858 0 50 0 Z" stroke="url(#gradient)" strokeWidth="2"></path>
                            <path d="M50 20 C66.5685 20 80 33.4315 80 50 C80 66.5685 66.5685 80 50 80 C33.4315 80 20 66.5685 20 50 C20 33.4315 33.4315 20 50 20 Z" stroke="url(#gradient)" strokeOpacity="0.5" strokeWidth="1.5"></path>
                            <path d="M50 35 C58.2843 35 65 41.7157 65 50 C65 58.2843 58.2843 65 50 65 C41.7157 65 35 58.2843 35 50 C35 41.7157 41.7157 35 50 35 Z" stroke="url(#gradient)" strokeOpacity="0.25" strokeWidth="1"></path>
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#63C5F7"></stop>
                                    <stop offset="100%" stopColor="#9277FF"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
                <div className="mt-16">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-white font-['Montserrat']">Welcome to Clarity, {user?.displayName?.split(' ')[0] || 'User'}!</h1>
                    <p className="mt-4 text-lg leading-relaxed text-gray-300 font-['Roboto']">You're about to unlock predictive financial intelligence. Noble Clarity Engine is designed to bring unprecedented insight and foresight to your financial data.</p>
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setStep(2)}
                            className="rounded-lg bg-[#63C5F7] px-8 py-3 font-body text-base font-medium text-[#0A0F1E] shadow-lg shadow-[#63C5F7]/20 transition-all duration-300 hover:bg-opacity-90 hover:shadow-xl hover:shadow-[#63C5F7]/30 focus:outline-none focus:ring-4 focus:ring-[#63C5F7]/50"
                        >
                            Let's Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 2: Set Financial Goals
    const GoalsStep = () => (
        <div className="bg-[#101522] font-['Roboto'] text-[#9DA4B9] flex items-center justify-center min-h-screen">
            <div className="w-full max-w-4xl mx-auto p-8">
                <header className="text-center mb-12">
                    <p className="font-['Montserrat'] font-semibold text-[#63B3ED] mb-2">Step 1 of 3</p>
                    <h1 className="font-['Montserrat'] text-4xl font-bold text-[#E2E8F0] mb-3">Set Your Financial Goals</h1>
                    <p className="text-lg max-w-2xl mx-auto">Select your primary objectives. Noble Clarity Engine will tailor its predictions and insights to help you achieve them.</p>
                </header>
                <main className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#161D32]/50 backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-[#63B3ED]/50">
                            <div className="flex items-center justify-between mb-4">
                                <label className="font-['Montserrat'] text-lg font-semibold text-[#E2E8F0] cursor-pointer" htmlFor="increase-profit-toggle">Increase Profit</label>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input defaultChecked className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-[#63B3ED] right-5" id="increase-profit-toggle" name="toggle" type="checkbox" />
                                    <label className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-600 cursor-pointer" htmlFor="increase-profit-toggle"></label>
                                </div>
                            </div>
                            <p className="text-sm mb-4">Set a target for profit margin improvement over a specific period.</p>
                            <div className="relative">
                                <input className="w-full bg-black/20 border border-[rgba(255,255,255,0.1)] rounded-lg py-3 pl-4 pr-12 text-[#E2E8F0] placeholder:text-[#9DA4B9] focus:ring-2 focus:ring-[#63B3ED] focus:border-[#63B3ED] transition-colors font-['Roboto']" type="number" defaultValue="15" />
                                <span className="absolute inset-y-0 right-4 flex items-center text-[#9DA4B9] font-semibold">%</span>
                            </div>
                        </div>
                        <div className="bg-[#161D32]/50 backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-[#9F7AEA]/50">
                            <div className="flex items-center justify-between mb-4">
                                <label className="font-['Montserrat'] text-lg font-semibold text-[#E2E8F0] cursor-pointer" htmlFor="cash-flow-toggle">Improve Cash Flow</label>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input defaultChecked className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-[#9F7AEA] right-0" id="cash-flow-toggle" name="toggle" type="checkbox" />
                                    <label className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-600 cursor-pointer" htmlFor="cash-flow-toggle"></label>
                                </div>
                            </div>
                            <p className="text-sm mb-4">Optimize your cash conversion cycle and increase available capital.</p>
                            <div className="relative">
                                <input className="w-full bg-black/20 border border-[rgba(255,255,255,0.1)] rounded-lg py-3 pl-4 text-[#E2E8F0] placeholder:text-[#9DA4B9] focus:ring-2 focus:ring-[#9F7AEA] focus:border-[#9F7AEA] transition-colors font-['Roboto']" type="text" defaultValue="Optimize Days Sales Outstanding" />
                            </div>
                        </div>
                        <div className="bg-[#161D32]/50 backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-gray-500/50">
                            <div className="flex items-center justify-between mb-4">
                                <label className="font-['Montserrat'] text-lg font-semibold text-[#E2E8F0] cursor-pointer" htmlFor="reduce-expenses-toggle">Reduce Expenses</label>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5" id="reduce-expenses-toggle" name="toggle" type="checkbox" />
                                    <label className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-600 cursor-pointer" htmlFor="reduce-expenses-toggle"></label>
                                </div>
                            </div>
                            <p className="text-sm mb-4">Identify and cut operational costs without impacting growth.</p>
                            <div className="relative">
                                <input className="w-full bg-black/20 border border-[rgba(255,255,255,0.1)] rounded-lg py-3 pl-4 pr-12 text-[#E2E8F0] placeholder:text-[#9DA4B9] focus:ring-2 focus:ring-[#63B3ED] focus:border-[#63B3ED] transition-colors font-['Roboto'] opacity-50" disabled placeholder="Set target %" type="number" />
                                <span className="absolute inset-y-0 right-4 flex items-center text-[#9DA4B9] font-semibold opacity-50">%</span>
                            </div>
                        </div>
                        <div className="bg-[#161D32]/50 backdrop-blur-md border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-white/50 hover:bg-[#161D32]/70">
                            <div className="flex items-center justify-between mb-4 w-full">
                                <label className="font-['Montserrat'] text-lg font-semibold text-[#E2E8F0] cursor-pointer" htmlFor="custom-goal-toggle">Define a Custom Goal</label>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5" id="custom-goal-toggle" name="toggle" type="checkbox" />
                                    <label className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-600 cursor-pointer" htmlFor="custom-goal-toggle"></label>
                                </div>
                            </div>
                            <p className="text-sm mb-4">Set a unique objective tailored to your specific business needs.</p>
                            <div className="relative w-full">
                                <input className="w-full bg-black/20 border border-[rgba(255,255,255,0.1)] rounded-lg py-3 pl-4 text-[#E2E8F0] placeholder:text-[#9DA4B9] focus:ring-2 focus:ring-[#63B3ED] focus:border-[#63B3ED] transition-colors font-['Roboto'] opacity-50" disabled placeholder="e.g., Increase market share" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-8">
                        <button onClick={() => setStep(3)} className="font-['Roboto'] font-medium text-[#9DA4B9] hover:text-[#E2E8F0] transition-colors">Skip for now</button>
                        <button onClick={() => setStep(3)} className="bg-[#63B3ED] text-[#101522] font-['Roboto'] font-bold py-3 px-8 rounded-lg shadow-lg shadow-[#63B3ED]/20 hover:bg-[#63B3ED]/90 transition-all duration-300 transform hover:scale-105">Continue</button>
                    </div>
                </main>
            </div>
            <style>{`
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #fff;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: transparent;
                }
                #increase-profit-toggle:checked {
                    background-color: #63B3ED;
                }
                #increase-profit-toggle:checked + .toggle-label {
                    background-color: #63B3ED;
                }
                #cash-flow-toggle:checked {
                    background-color: #9F7AEA;
                }
                #cash-flow-toggle:checked + .toggle-label {
                    background-color: #9F7AEA;
                }
            `}</style>
        </div>
    );

    // Step 3: Connect Data
    const ConnectStep = () => (
        <div className="bg-[#0A0F1E] text-slate-300 font-['Roboto'] antialiased min-h-screen">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl mx-auto">
                    <header className="text-center mb-10">
                        <h1 className="font-['Montserrat'] text-3xl sm:text-4xl font-bold text-white mb-3">Connect Your Financial Data</h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">Choose a data source to begin building your predictive financial intelligence model. Your data is always encrypted and secure.</p>
                    </header>
                    <main>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="group relative bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-8 text-center backdrop-blur-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mx-auto mb-6 group-hover:bg-[#8B5CF6]/30 transition-colors">
                                    <span className="material-symbols-outlined text-[#8B5CF6] text-3xl">account_balance</span>
                                </div>
                                <h2 className="font-['Montserrat'] text-xl font-semibold text-white mb-2">Connect Bank Account</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">Securely link your bank accounts in seconds using our trusted Plaid integration.</p>
                            </div>
                            <div className="group relative bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-8 text-center backdrop-blur-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/30 mx-auto mb-6 group-hover:bg-[#38BDF8]/30 transition-colors">
                                    <span className="material-symbols-outlined text-[#38BDF8] text-3xl">receipt_long</span>
                                </div>
                                <h2 className="font-['Montserrat'] text-xl font-semibold text-white mb-2">Accounting Software</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">Connect QuickBooks, Xero, and other platforms to sync your financial records automatically.</p>
                            </div>
                            <div className="group relative bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-8 text-center backdrop-blur-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-500/20 border border-slate-500/30 mx-auto mb-6 group-hover:bg-slate-500/30 transition-colors">
                                    <span className="material-symbols-outlined text-slate-300 text-3xl">upload_file</span>
                                </div>
                                <h2 className="font-['Montserrat'] text-xl font-semibold text-white mb-2">Upload CSV Data</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">Have your data in a spreadsheet? Upload a CSV file to import it directly.</p>
                            </div>
                        </div>
                        <div className="mt-12 text-center">
                            <button onClick={() => setStep(4)} className="bg-[#38BDF8] text-[#0A0F1E] font-['Montserrat'] font-semibold py-3 px-10 rounded-lg shadow-[0_0_20px_0_rgba(56,189,248,0.3)] hover:bg-[#38BDF8]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                                Connect My Data
                            </button>
                            <div className="mt-6">
                                <button onClick={() => setStep(4)} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Skip for now</button>
                            </div>
                        </div>
                    </main>
                    <footer className="mt-12 text-center text-slate-500">
                        <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>lock</span>
                            <p className="text-xs">Your data is protected with bank-level security and end-to-end encryption.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );

    // Step 4: Setup Complete
    const CompleteStep = () => (
        <div className="bg-[#0B0E1B] font-['Roboto'] text-[#9da4b9] min-h-screen">
            <div className="flex items-center justify-center min-h-screen p-4 bg-grid-pattern" style={{ backgroundImage: "radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0, transparent 60%), linear-gradient(rgba(11, 14, 27, 0.95), rgba(11, 14, 27, 0.95)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDP689o8oUOPZiRTPB1VGR409UxKpV7mBk4TlJGFXVYwS-VcOQFlNLQmnWQ6rk7Oxo6bmsUHGSBVNVzW4hQFPPIcbdBtuojV_l8DIpRJ2tSHiTcUSyHwItXtDCLy-uxeRr0IV3G1pgxsR7rPvU3Et5qSpOTnwluBWFASDNX0Tn01-Tt7XaatbSAXzRqS4Tq_qVy73LYQ2v9m7CoEydHFo6EhsD9r_c8xb1WQbnFGAvWBy3IPdCU-2QsSK_tfL3WGZ08G6iic6B3OVM')" }}>
                <div className="w-full max-w-xl mx-auto text-center">
                    <div className="relative bg-[rgba(30,41,59,0.5)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.1),0px_4px_10px_rgba(0,0,0,0.1)] p-8 sm:p-12">
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 size-28 bg-[#38BDF8]/10 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.1)] shadow-[0px_2px_4px_rgba(0,0,0,0.1),0px_4px_10px_rgba(0,0,0,0.1)]">
                            <div className="size-20 bg-[#38BDF8]/20 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#38BDF8]" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}>
                                    verified
                                </span>
                            </div>
                        </div>
                        <div className="mt-10">
                            <h1 className="font-['Montserrat'] text-4xl font-bold text-white tracking-tight">Setup Complete!</h1>
                            <p className="font-['Montserrat'] text-lg text-slate-300 mt-2">Welcome to Noble Clarity Engine</p>
                        </div>
                        <div className="my-8">
                            <p className="text-slate-400 text-base leading-relaxed max-w-md mx-auto">
                                Your data is now being analyzed to personalize your experience. Your Command Center is ready for you to explore.
                            </p>
                        </div>
                        <div className="mt-10">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full sm:w-auto bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0B0E1B] font-['Roboto'] font-medium py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.3),0_0_25px_rgba(56,189,248,0.2)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#38BDF8]/50 flex items-center justify-center gap-2 mx-auto"
                            >
                                Go to Dashboard
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#1E293B]/50 border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-full text-xs">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A78BFA] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#A78BFA]"></span>
                            </div>
                            <span className="text-slate-300 font-medium">AI Coach is ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    switch (step) {
        case 1: return <WelcomeStep />;
        case 2: return <GoalsStep />;
        case 3: return <ConnectStep />;
        case 4: return <CompleteStep />;
        default: return <WelcomeStep />;
    }
};

export default OnboardingFlow;
