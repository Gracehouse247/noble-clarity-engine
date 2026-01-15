
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Mail, ShieldAlert } from 'lucide-react';

const DeletionPage: React.FunctionComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-noble-blue/30">
            <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight uppercase">Data Deletion</span>
                </div>
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-40 pb-32">
                <div className="prose prose-invert max-w-none space-y-12">
                    <header className="border-b border-slate-800 pb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-6">
                            <ShieldAlert className="w-3 h-3" />
                            RIGHT TO DATA SOVEREIGNTY
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-4">Account & Data Deletion</h1>
                        <p className="text-slate-400 text-lg">We prioritize your data sovereignty. Learn how to manage or permanently remove your data from the Noble Clarity Engine.</p>
                    </header>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-noble-blue/20 flex items-center justify-center text-noble-blue text-sm">01</div>
                            The Right to Erasure
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            At Noble Clarity Engine, we believe that users should have absolute control over their business and personal data. Under various global privacy regulations (including GDPR and CCPI), you have the right to request that we delete all your personal data and business financial information from our systems.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-noble-blue/20 flex items-center justify-center text-noble-blue text-sm">02</div>
                            Scope of Deletion
                        </h2>
                        <p className="text-slate-400">When you request a permanent deletion of your account, the following data categories are purged from our live production databases:</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                                <h4 className="font-bold mb-2 text-white">Identity & Profile</h4>
                                <p className="text-sm text-slate-400">Your name, email address, avatar, and authentication records managed via Google Firebase.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                                <h4 className="font-bold mb-2 text-white">Financial Records</h4>
                                <p className="text-sm text-slate-400">All uploaded CSVs, manually entered revenue metrics, and overhead costs.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                                <h4 className="font-bold mb-2 text-white">AI Interactions</h4>
                                <p className="text-sm text-slate-400">Past conversation history with the AI Coach and generated insight reports.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                                <h4 className="font-bold mb-2 text-white">Secure Credentials</h4>
                                <p className="text-sm text-slate-400">Encrypted API keys stored in your browser's secure enclave data.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-noble-blue/20 flex items-center justify-center text-noble-blue text-sm">03</div>
                            How to Initiate Deletion
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-noble-blue flex items-center justify-center font-bold text-white shadow-lg shadow-noble-blue/20">A</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Automated Wipe (Settings)</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Log in to your dashboard and navigate to <strong>Settings</strong>. Scroll to the bottom and select <strong>"Wipe All Data"</strong>. This command triggers an immediate purge of your records from our Firestore database. Note that this action is irreversible.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-white">B</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Manual Request (Email)</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        If you cannot access your account or prefer a manual intervention, you can contact our support team. Please include "Account Deletion Request" in the subject line from the email address associated with your account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pt-12 border-t border-slate-800">
                        <h2 className="text-2xl font-bold">Contact Support</h2>
                        <p className="text-slate-400">Our data protection team will process manual requests within 48-72 business hours.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                                <Mail className="text-noble-blue w-5 h-5" />
                                <a href="mailto:support@noblesworld.com.ng" className="text-white text-sm font-bold hover:text-noble-blue transition-colors">support@noblesworld.com.ng</a>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                                <Mail className="text-noble-blue w-5 h-5" />
                                <a href="mailto:clarity@noblesworld.com.ng" className="text-white text-sm font-bold hover:text-noble-blue transition-colors">clarity@noblesworld.com.ng</a>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-900 bg-[#0b0e14] text-center text-xs text-slate-600">
                &copy; {new Date().getFullYear()} Noble World | Secure Data Deletion Protocols
            </footer>
        </div>
    );
};

export default DeletionPage;
