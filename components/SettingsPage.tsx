
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications, useUser, useBusiness } from '../contexts/NobleContext';
import {
    ChevronLeft,
    User,
    Bot,
    CreditCard,
    ShieldCheck,
    Link as LinkIcon,
    Trash2,
    RefreshCw,
    Lock,
    Eye,
    EyeOff,
    ExternalLink,
    Landmark,
    Zap,
    Bell,
    CheckCircle2,
    Sparkles,
    ShieldAlert,
    AlertCircle,
    Camera,
    Upload,
    Image as ImageIcon,
    Save,
    Workflow,
    FileText,
    Database,
    Activity,
    Globe,
    Video,
    ShoppingBag,
    Briefcase,
    MessageSquare,
    Share2,
    Mail,
    ListTodo,
    X
} from 'lucide-react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initiateOAuth, openPlaidLink, syncStripeData, connectGoogleSheets, syncHubSpotData, syncMetaAdsData, syncGoogleAdsData, syncFidelityData, syncBloombergData, syncXeroData, initiateOAuthConnection, syncTikTokAdsData } from '../services/ecosystem';

const IntegrationModal = ({ config, isOpen, onClose, onConnect, isConnecting }: any) => {
    if (!isOpen || !config) return null;
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 overflow-y-auto custom-scrollbar">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="w-full max-w-[500px] bg-[#0f172a] rounded-[24px] border border-slate-800 shadow-2xl shadow-black/50 relative z-10 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 mb-8">

                {/* Decorative Top Line */}
                <div className={`h-1.5 w-full ${config.bgClass} opacity-80`} />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 pt-10">
                    {/* Header: Icon & Title */}
                    <div className="flex flex-col items-center text-center gap-6 mb-8">
                        <div className="relative group">
                            {/* Glow Effect behind icon */}
                            <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-150 ${config.bgClass}`} />
                            <div className={`relative p-5 rounded-[24px] bg-slate-900 border border-slate-800 shadow-xl ${config.textClass}`}>
                                <Icon className="w-10 h-10" strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{config.name}</h3>
                            <p className="text-slate-400 text-sm font-medium">{config.subtitle}</p>
                        </div>
                    </div>

                    {/* Description Box */}
                    <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-800/50">
                        <p className="text-slate-300 text-sm text-center leading-relaxed">
                            {config.desc}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onConnect}
                            disabled={isConnecting}
                            className={`w-full py-4 text-white rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] ${config.buttonClass}`}
                        >
                            {isConnecting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
                            {isConnecting ? 'Establishing Secure Link...' : config.actionLabel}
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-slate-500 hover:text-white font-semibold text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Security Footer */}
                <div className="bg-slate-950/30 border-t border-slate-800/50 py-4 px-6 flex items-center justify-center gap-2.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${config.textClass}`} />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{config.security}</span>
                </div>
            </div>
        </div>
    );
};

// Configuration Map for all Integrations
const integrationConfigs: Record<string, any> = {
    'stripe': {
        name: 'Connect Stripe', subtitle: 'Secure one-click payments', desc: 'Link your Stripe account to sync live transaction data, MRR, and churn metrics instantly.',
        icon: CreditCard, textClass: 'text-purple-500', bgClass: 'bg-purple-500', borderClass: 'border-purple-500', buttonClass: 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20',
        actionLabel: 'Login with Stripe', security: 'PCI DSS Certified. Secure read-only access.',
        badge: 'COMING SOON', badgeClass: 'bg-purple-600 text-white border-purple-400/30'
    },
    'plaid': {
        name: 'Connect Banking', subtitle: 'Powered by Plaid', desc: 'Securely connect to over 11,000 financial institutions to aggregate bank balances.',
        icon: LinkIcon, textClass: 'text-emerald-500', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-500', buttonClass: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20',
        actionLabel: 'Launch Link', security: 'Bank-Level Encryption. Credentials never shared.',
        badge: 'COMING SOON', badgeClass: 'bg-emerald-600 text-white border-emerald-400/30'
    },
    'hubspot': {
        name: 'Connect HubSpot', subtitle: 'Secure one-click connection', desc: 'Sync your HubSpot CRM data, deals, and marketing contacts to power your Clarity Engine insights.',
        icon: Activity, textClass: 'text-orange-500', bgClass: 'bg-orange-500', borderClass: 'border-orange-500', buttonClass: 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20',
        actionLabel: 'Login with HubSpot', security: 'OAuth 2.0 industry standard.',
        badge: 'COMING SOON', badgeClass: 'bg-orange-600 text-white border-orange-400/30'
    },
    'sheets': {
        name: 'Connect Google Sheets', subtitle: 'Secure one-click connection', desc: 'Link your Google Sheets account to automatically sync financial models and custom datasets.',
        icon: Globe, textClass: 'text-green-500', bgClass: 'bg-green-500', borderClass: 'border-green-500', buttonClass: 'bg-white hover:bg-gray-100 text-slate-900',
        actionLabel: 'Login with Google', security: 'OAuth 2.0 industry standard.',
        badge: 'TEST MODE', badgeClass: 'bg-green-600 text-white border-green-400/30 animate-blink'
    },
    'meta': {
        name: 'Connect Meta Ads', subtitle: 'Secure one-click connection', desc: 'Connect Facebook & Instagram ad accounts to unlock AI-driven insights on spend and ROI.',
        icon: Globe, textClass: 'text-blue-500', bgClass: 'bg-blue-500', borderClass: 'border-blue-500', buttonClass: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20',
        actionLabel: 'Continue with Facebook', security: 'We never post to your social profiles.',
        badge: 'COMING SOON', badgeClass: 'bg-blue-600 text-white border-blue-400/30'
    },
    'google-ads': {
        name: 'Connect Google Ads', subtitle: 'Secure one-click connection', desc: 'Securely link your Google Ads account. We\'ll sync your campaign performance automatically.',
        icon: Sparkles, textClass: 'text-amber-500', bgClass: 'bg-amber-500', borderClass: 'border-amber-500', buttonClass: 'bg-white hover:bg-gray-100 text-slate-900',
        actionLabel: 'Continue with Google', security: 'OAuth 2.0. Credentials never stored.',
        badge: 'COMING SOON', badgeClass: 'bg-amber-600 text-white border-amber-400/30'
    },
    'fidelity': {
        name: 'Connect Fidelity', subtitle: 'Brokerage & 401k Sync', desc: 'Securely link your Fidelity institutional or retail accounts to sync portfolio data in real-time.',
        icon: CreditCard, textClass: 'text-blue-600', bgClass: 'bg-blue-600', borderClass: 'border-blue-600', buttonClass: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20',
        actionLabel: 'Login with Fidelity', security: 'FINRA Compliant. Encrypted at rest.',
        badge: 'COMING SOON', badgeClass: 'bg-blue-700 text-white border-blue-500/30'
    },
    'bloomberg': {
        name: 'Bloomberg Terminal', subtitle: 'B-PIPE secure connection', desc: 'Initialize a secure handshake with your organization\'s Bloomberg Data License or Terminal instance.',
        icon: Activity, textClass: 'text-red-600', bgClass: 'bg-red-600', borderClass: 'border-red-600', buttonClass: 'bg-red-600 hover:bg-red-500 shadow-red-900/20',
        actionLabel: 'Connect Terminal', security: 'Institutional Grade E2E encryption.',
        badge: 'COMING SOON', badgeClass: 'bg-red-700 text-white border-red-500/30'
    },
    'xero': {
        name: 'Connect Xero', subtitle: 'Secure accounting sync', desc: 'Authenticate with Xero to securely sync your ledger, invoices, and bank reconciliation data.',
        icon: Database, textClass: 'text-cyan-500', bgClass: 'bg-cyan-500', borderClass: 'border-cyan-500', buttonClass: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20',
        actionLabel: 'Login with Xero', security: 'Bank-Grade Security. Read-only access.',
        badge: 'COMING SOON', badgeClass: 'bg-cyan-600 text-white border-cyan-400/30'
    },
    'quickbooks': {
        name: 'Connect QuickBooks', subtitle: 'Automated bookkeeping', desc: 'Sync your invoices, expenses, and payroll data directly from Intuit QuickBooks.',
        icon: FileText, textClass: 'text-green-500', bgClass: 'bg-green-500', borderClass: 'border-green-500', buttonClass: 'bg-green-600 hover:bg-green-500 shadow-green-900/20',
        actionLabel: 'Login with Intuit', security: 'Bank-Grade Security. Read-only access.',
        badge: 'COMING SOON', badgeClass: 'bg-green-700 text-white border-green-500/30'
    },
    'tiktok ads': {
        name: 'Connect TikTok Ads', subtitle: 'Viral campaign tracking', desc: 'Ingest your TikTok campaign data to analyze video engagement, spend, and conversion rates.',
        icon: Video, textClass: 'text-pink-500', bgClass: 'bg-pink-500', borderClass: 'border-pink-500', buttonClass: 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/20',
        actionLabel: 'Login with TikTok', security: 'Secure & Private. No posting permissions.',
        badge: 'COMING SOON', badgeClass: 'bg-pink-600 text-white border-pink-400/30'
    },
    'shopify': {
        name: 'Connect Shopify', subtitle: 'E-commerce Sync', desc: 'Sync your store\'s orders, products, and customer data for unified commerce insights.',
        icon: ShoppingBag, textClass: 'text-lime-500', bgClass: 'bg-lime-500', borderClass: 'border-lime-500', buttonClass: 'bg-lime-600 hover:bg-lime-500 shadow-lime-900/20',
        actionLabel: 'Login with Shopify', security: 'Secure Commerce Sync.',
        badge: 'COMING SOON', badgeClass: 'bg-lime-600 text-white border-lime-400/30'
    },
    'salesforce': {
        name: 'Connect Salesforce', subtitle: 'Enterprise CRM', desc: 'Ingest your enterprise leads, opportunities, and pipeline data directly from Salesforce.',
        icon: Briefcase, textClass: 'text-blue-400', bgClass: 'bg-blue-400', borderClass: 'border-blue-400', buttonClass: 'bg-[#00A1E0] hover:bg-[#0091ca]',
        actionLabel: 'Login with Salesforce', security: 'Enterprise Grade Security.',
        badge: 'COMING SOON', badgeClass: 'bg-blue-500 text-white border-blue-300/30'
    },
    'slack': {
        name: 'Connect Slack', subtitle: 'Team Communications', desc: 'Receive real-time Clarity Engine alerts and reports directly in your Slack channels.',
        icon: MessageSquare, textClass: 'text-fuchsia-500', bgClass: 'bg-fuchsia-500', borderClass: 'border-fuchsia-500', buttonClass: 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-900/20',
        actionLabel: 'Login with Slack', security: 'Encrypted Messaging Channel.',
        badge: 'COMING SOON', badgeClass: 'bg-fuchsia-600 text-white border-fuchsia-400/30'
    },
    'linkedin-ads': {
        name: 'Connect LinkedIn', subtitle: 'B2B Marketing Sync', desc: 'Analyze your professional B2B campaigns, spend, and lead generation quality.',
        icon: Share2, textClass: 'text-blue-700', bgClass: 'bg-blue-700', borderClass: 'border-blue-700', buttonClass: 'bg-[#0a66c2] hover:bg-[#004182] shadow-blue-900/20',
        actionLabel: 'Login with LinkedIn', security: 'Professional Data Privacy.',
        badge: 'COMING SOON', badgeClass: 'bg-blue-800 text-white border-blue-600/30'
    },
    'mailchimp': {
        name: 'Connect Mailchimp', subtitle: 'Email Automation', desc: 'Track open rates, click-throughs, and audience growth from your email campaigns.',
        icon: Mail, textClass: 'text-yellow-600', bgClass: 'bg-yellow-600', borderClass: 'border-yellow-600', buttonClass: 'bg-[#ffe01b] hover:bg-[#e6c915] text-slate-900',
        actionLabel: 'Login with Mailchimp', security: 'Secure Audience Sync.',
        badge: 'COMING SOON', badgeClass: 'bg-yellow-600 text-white border-yellow-400/30'
    },
    'asana': {
        name: 'Connect Asana', subtitle: 'Project Tracking', desc: 'Monitor project progress, task completion rates, and team productivity.',
        icon: ListTodo, textClass: 'text-rose-400', bgClass: 'bg-rose-400', borderClass: 'border-rose-400', buttonClass: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-900/20',
        actionLabel: 'Login with Asana', security: 'Secure Project Data.',
        badge: 'COMING SOON', badgeClass: 'bg-rose-600 text-white border-rose-400/30'
    }
};

const SettingsPage: React.FC = () => {
    const { user, sendPasswordResetEmail, updateUserPassword } = useAuth();
    const { userProfile, updateUserProfile, apiKeys, updateApiKeys } = useUser();
    const { wipeAppData, resetProfile, activeProfile, activeProfileData, updateFinancialData } = useBusiness();
    const { addNotification, clearAllNotifications } = useNotifications();
    const navigate = useNavigate();

    // Tabs
    const [activeTab, setActiveTab] = useState<'account' | 'ai' | 'billing' | 'notifications' | 'security' | 'integrations' | 'data'>('account');

    // Local State
    const [name, setName] = useState(userProfile.name);
    const [role, setRole] = useState(userProfile.role || 'Founder');
    const [notifications, setNotifications] = useState({
        marketAlerts: userProfile.notifications?.marketAlerts ?? true,
        weeklyDigest: userProfile.notifications?.weeklyDigest ?? true,
        productUpdates: userProfile.notifications?.productUpdates ?? false
    });
    const [tempApiKeys, setTempApiKeys] = useState(apiKeys);
    const [showGoogleKey, setShowGoogleKey] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Integration Config State
    const [configuringIntegration, setConfiguringIntegration] = useState<string | null>(null);
    const [stripeKey, setStripeKey] = useState('');
    const [plaidConfig, setPlaidConfig] = useState({ clientId: '', secret: '' });
    const [hubspotKey, setHubspotKey] = useState('');
    const [sheetsKey, setSheetsKey] = useState('');
    const [metaAdsConfig, setMetaAdsConfig] = useState({ appId: '', accessToken: '' });
    const [googleAdsConfig, setGoogleAdsConfig] = useState({
        developerToken: '',
        clientId: '',
        clientSecret: '',
        customerId: ''
    });
    const [fidelityConfig, setFidelityConfig] = useState({ apiKey: '', partnerId: '' });
    const [bloombergConfig, setBloombergConfig] = useState({ terminalId: '', sapiEndpoint: '' });
    const [xeroConfig, setXeroConfig] = useState({ clientId: '', clientSecret: '' });
    const [isConnecting, setIsConnecting] = useState(false);

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

    // Security & Integrations
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(userProfile.twoFactorEnabled ?? false);
    const [connectedApps, setConnectedApps] = useState<string[]>(userProfile.integrations ?? ['Fidelity Investments', 'Bloomberg Terminal']);

    // Avatar State
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(userProfile.avatarUrl);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserProfile({
                ...userProfile,
                name,
                role,
                notifications,
                twoFactorEnabled,
                integrations: connectedApps,
                avatarUrl: avatarPreview,
                preferredProvider: 'gemini'
            });
            updateApiKeys(tempApiKeys, true);

            addNotification({
                title: "Settings Updated",
                msg: "All your preferences have been securely saved.",
                type: "success"
            });
        } catch (error) {
            addNotification({
                title: "Save Failed",
                msg: "An error occurred while saving your changes.",
                type: "alert"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        try {
            await sendPasswordResetEmail(user.email);
            addNotification({
                title: "Reset Link Sent",
                msg: `Check your inbox at ${user.email} to secure your account.`,
                type: "success"
            });
        } catch (error) {
            addNotification({
                title: "Failed to Send",
                msg: "Could not initiate password reset. Please try again.",
                type: "alert"
            });
        }
    };

    const handleUpdatePasswordUI = async () => {
        if (!newPassword || !confirmPassword) return;
        if (newPassword !== confirmPassword) {
            addNotification({ title: 'Mismatch', msg: 'Passwords do not match.', type: 'alert' });
            return;
        }
        if (newPassword.length < 8) {
            addNotification({ title: 'Weak Password', msg: 'Password must be at least 8 characters.', type: 'alert' });
            return;
        }

        setIsPasswordUpdating(true);
        try {
            await updateUserPassword(newPassword);
            setNewPassword('');
            setConfirmPassword('');
            addNotification({
                title: "Password Updated",
                msg: "Your security credentials have been successfully updated in Firebase.",
                type: "success"
            });
        } catch (error: any) {
            if (error.code === 'auth/requires-recent-login') {
                addNotification({
                    title: "Action Required",
                    msg: "For security, please log out and log back in before changing your password.",
                    type: "alert"
                });
            } else {
                addNotification({
                    title: "Update Failed",
                    msg: error.message || "Could not update password. Please try again later.",
                    type: "alert"
                });
            }
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            addNotification({ title: 'Invalid File', msg: 'Please select an image file.', type: 'alert' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            addNotification({ title: 'File Too Large', msg: 'Image must be under 5MB.', type: 'alert' });
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            setAvatarPreview(downloadURL);
            await updateUserProfile({
                ...userProfile,
                avatarUrl: downloadURL
            });

            addNotification({
                title: "Avatar Updated",
                msg: "Your professional profile picture has been synchronized.",
                type: "success"
            });
        } catch (error: any) {
            console.error("Avatar upload error:", error);
            addNotification({
                title: "Upload Failed",
                msg: "Could not upload image. Please check your connection.",
                type: "alert"
            });
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const toggleIntegration = async (appName: string) => {
        if (connectedApps.includes(appName)) {
            setConnectedApps(prev => prev.filter(a => a !== appName));
            addNotification({ title: 'App Disconnected', msg: `${appName} has been removed from your workspace.`, type: 'info' });
            return;
        }

        // Real Connection Flows
        if (appName === 'Stripe Finance') {
            setConfiguringIntegration('stripe');
        } else if (appName === 'Plaid Core') {
            setConfiguringIntegration('plaid');
        } else if (appName === 'Fidelity Investments') {
            setConfiguringIntegration('fidelity');
        } else if (appName === 'Bloomberg Terminal') {
            setConfiguringIntegration('bloomberg');
        } else if (appName === 'Xero') {
            setConfiguringIntegration('xero');
        } else if (appName === 'QuickBooks') {
            setConfiguringIntegration('quickbooks');
        } else if (appName === 'TikTok Ads') {
            setConfiguringIntegration('tiktok ads');
        } else if (appName === 'Shopify') {
            setConfiguringIntegration('shopify');
        } else if (appName === 'Salesforce') {
            setConfiguringIntegration('salesforce');
        } else if (appName === 'Slack') {
            setConfiguringIntegration('slack');
        } else if (appName === 'LinkedIn Ads') {
            setConfiguringIntegration('linkedin-ads');
        } else if (appName === 'Mailchimp') {
            setConfiguringIntegration('mailchimp');
        } else if (appName === 'Asana') {
            setConfiguringIntegration('asana');
        } else if (appName === 'Google Sheets') {
            setConfiguringIntegration('sheets');
        } else if (appName === 'HubSpot') {
            setConfiguringIntegration('hubspot');
        } else if (appName === 'Meta Ads') {
            setConfiguringIntegration('meta');
        } else if (appName === 'Google Ads') {
            setConfiguringIntegration('google-ads');
        } else {
            // Default toggle for other apps
            setConnectedApps(prev => [...prev, appName]);
            addNotification({ title: 'App Connected', msg: `${appName} is now syncing with Noble Clarity.`, type: 'success' });
        }
    };

    const handleStripeConnect = async () => {
        if (!stripeKey) return;
        setIsConnecting(true);
        try {
            const response = await syncStripeData(stripeKey);
            setConnectedApps(prev => [...prev, 'Stripe Finance']);
            addNotification({
                title: response.mode === 'test' ? 'Stripe Linked (Sandbox)' : 'Stripe Connected',
                msg: response.mode === 'test' ? 'Using synthetic test data for development.' : 'Live revenue data is now being ingested.',
                type: 'success'
            });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Invalid Stripe API key.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handlePlaidConnect = async () => {
        if (!plaidConfig.clientId || !plaidConfig.secret) return;
        setIsConnecting(true);
        try {
            // In a real app, this would verify the keys with your backend
            console.log('Verifying Plaid credentials...');

            // Re-using openPlaidLink which handles the user flow
            openPlaidLink((token) => {
                setConnectedApps(prev => [...prev, 'Plaid Core']);
                addNotification({
                    title: 'Plaid Linked',
                    msg: 'Bank aggregation is now active using provided credentials.',
                    type: 'success'
                });
                setConfiguringIntegration(null);
                setIsConnecting(false);
            });
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Invalid Plaid credentials.', type: 'alert' });
            setIsConnecting(false);
        }
    };

    const handleHubSpotConnect = async () => {
        if (!hubspotKey) return;
        setIsConnecting(true);
        try {
            await syncHubSpotData(hubspotKey);
            setConnectedApps(prev => [...prev, 'HubSpot']);
            addNotification({
                title: 'HubSpot Linked',
                msg: 'CRM and marketing pipeline data is now syncing.',
                type: 'success'
            });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Invalid HubSpot access token.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleSheetsConnect = async () => {
        if (!sheetsKey) return;
        setIsConnecting(true);
        try {
            await connectGoogleSheets(sheetsKey);
            setConnectedApps(prev => [...prev, 'Google Sheets']);
            addNotification({
                title: 'Sheets Sync Active',
                msg: 'Your spreadsheet data is now being synchronized.',
                type: 'success'
            });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Invalid Google Sheets API key.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleMetaAdsConnect = async () => {
        if (!metaAdsConfig.appId || !metaAdsConfig.accessToken) return;
        setIsConnecting(true);
        try {
            await syncMetaAdsData(metaAdsConfig.appId, metaAdsConfig.accessToken);
            setConnectedApps(prev => [...prev, 'Meta Ads']);
            addNotification({
                title: 'Meta Ads Linked',
                msg: 'Campaign performance and ROI data is now syncing.',
                type: 'success'
            });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Invalid Meta Ads credentials.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleGoogleAdsConnect = async () => {
        if (!googleAdsConfig.developerToken || !googleAdsConfig.clientId || !googleAdsConfig.clientSecret || !googleAdsConfig.customerId) return;
        setIsConnecting(true);
        try {
            await syncGoogleAdsData(googleAdsConfig);
            setConnectedApps(prev => [...prev, 'Google Ads']);
            addNotification({
                title: 'Google Ads Linked',
                msg: 'Search campaign performance and ROAS data is now syncing.',
                type: 'success'
            });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Invalid Google Ads credentials.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleFidelityConnect = async () => {
        if (!fidelityConfig.apiKey || !fidelityConfig.partnerId) return;
        setIsConnecting(true);
        try {
            await syncFidelityData(fidelityConfig);
            setConnectedApps(prev => [...prev, 'Fidelity Investments']);
            addNotification({ title: 'Fidelity Linked', msg: 'Brokerage and asset data is now syncing.', type: 'success' });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Invalid Fidelity credentials.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleBloombergConnect = async () => {
        if (!bloombergConfig.terminalId || !bloombergConfig.sapiEndpoint) return;
        setIsConnecting(true);
        try {
            await syncBloombergData(bloombergConfig.terminalId, bloombergConfig.sapiEndpoint);
            setConnectedApps(prev => [...prev, 'Bloomberg Terminal']);
            addNotification({ title: 'Terminal Linked', msg: 'Real-time market depth sync is established.', type: 'success' });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Bloomberg handshake failed.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleXeroConnect = async () => {
        if (!xeroConfig.clientId || !xeroConfig.clientSecret) return;
        setIsConnecting(true);
        try {
            await syncXeroData(xeroConfig.clientId, xeroConfig.clientSecret);
            setConnectedApps(prev => [...prev, 'Xero']);
            addNotification({ title: 'Xero Connected', msg: 'Accounting books are now synchronized.', type: 'success' });
            setConfiguringIntegration(null);
        } catch (error) {
            addNotification({ title: 'Connection Failed', msg: 'Xero OAuth validation failed.', type: 'alert' });
        } finally {
            setIsConnecting(false);
        }
    };

    const navItems = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'ai', label: 'AI Configuration', icon: Bot },
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'integrations', label: 'Integrations', icon: LinkIcon },
        { id: 'data', label: 'Advanced / Data', icon: Trash2 },
    ];

    return (
        <div className="min-h-screen bg-[#0B0E14] text-slate-300 font-sans selection:bg-noble-blue selection:text-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white group"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight font-display">Command Center <span className="text-noble-blue text-sm align-top ml-2 font-mono uppercase tracking-widest">Settings</span></h1>
                            <p className="text-slate-500 mt-1 font-medium">Configure your noble workspace, AI agents, and security parameters.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="hidden md:flex items-center gap-2 px-8 py-3.5 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-2xl font-bold transition-all shadow-xl shadow-noble-blue/20 disabled:opacity-50 active:scale-95"
                    >
                        {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <nav className="space-y-1 bg-slate-900/40 p-2 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] text-sm font-bold transition-all ${activeTab === item.id
                                        ? 'bg-noble-blue text-white shadow-xl shadow-noble-blue/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 bg-slate-900/20 rounded-[3rem] border border-white/5 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">

                        {activeTab === 'account' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Account Identity</h2>
                                    <p className="text-slate-500">Manage your professional profile visible across the organization.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter full name"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-noble-blue outline-none transition-all placeholder:text-slate-700 font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Professional Role</label>
                                        <input
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            placeholder="e.g. Founder, CEO"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:border-noble-blue outline-none transition-all placeholder:text-slate-700 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Official Email Address</label>
                                        <div className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 px-6 text-slate-400 font-mono italic">
                                            {user?.email || userProfile.email}
                                        </div>
                                        <p className="text-[10px] text-slate-600 mt-2 ml-1 italic">* Email cannot be modified. Contact support to change your primary handle.</p>
                                    </div>
                                </div>


                                <div className="p-8 bg-noble-blue/5 border border-noble-blue/20 rounded-3xl flex items-center gap-8 group">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:scale-105 transition-all overflow-hidden shadow-2xl">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-10 h-10 text-slate-700" />
                                            )}
                                            {isUploadingAvatar && (
                                                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
                                                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 p-2.5 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl cursor-pointer shadow-xl active:scale-95 transition-all border border-white/20">
                                            <Camera size={16} />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                disabled={isUploadingAvatar}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                            Avatar & Brand Identity
                                            <span className="text-[10px] bg-noble-blue/20 text-noble-blue px-2 py-0.5 rounded-full uppercase tracking-tighter">Live Sync</span>
                                        </h4>
                                        <p className="text-sm text-slate-500 mb-4 max-w-sm">Upload a professional headshot or company logo. Supported formats: JPG, PNG, WebP (Max 5MB).</p>
                                        <div className="flex items-center gap-4">
                                            <label className="text-xs font-bold text-noble-blue hover:underline cursor-pointer flex items-center gap-1.5 group/label">
                                                <Upload size={12} className="group-hover/label:-translate-y-0.5 transition-transform" />
                                                Choose New Image
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    disabled={isUploadingAvatar}
                                                />
                                            </label>
                                            <span className="text-slate-800 text-sm">|</span>
                                            <button
                                                onClick={() => setAvatarPreview(`https://ui-avatars.com/api/?name=${name || 'User'}&background=random`)}
                                                className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                            >
                                                Reset to Default
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Change Section */}
                                <div className="pt-12 border-t border-white/5 space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Security Credentials</h3>
                                        <p className="text-slate-500">Update your account authentication directly.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Secure Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Min. 8 characters"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-noble-blue outline-none transition-all placeholder:text-slate-700 font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Verify password"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-noble-blue outline-none transition-all placeholder:text-slate-700 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-start">
                                        <button
                                            onClick={handleUpdatePasswordUI}
                                            disabled={!newPassword || newPassword !== confirmPassword || isPasswordUpdating}
                                            className="px-8 py-3.5 bg-white text-slate-950 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50 active:scale-95 flex items-center gap-2"
                                        >
                                            {isPasswordUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                            Update Authentication
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">AI Configuration</h2>
                                    <p className="text-slate-500">Select your preferred cognitive models and manage secure API keys.</p>
                                </div>

                                {/* API Key Inputs */}
                                <div className="space-y-8">
                                    {/* Gemini Key */}
                                    <div className="p-8 rounded-[2.5rem] border bg-noble-blue/5 border-noble-blue/30 transition-all">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                                                    <Bot className="w-6 h-6 text-noble-blue" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">Gemini API Key</h4>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Setup Instructions:</p>
                                                        <ul className="text-[11px] text-slate-500 list-decimal list-inside space-y-0.5">
                                                            <li>Sign in to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-noble-blue hover:underline">Google AI Studio</a></li>
                                                            <li>Click "Get API key" on the sidebar</li>
                                                            <li>Create a new API key in a new or existing project</li>
                                                            <li>Copy and paste the key below</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowGoogleKey(!showGoogleKey)}
                                                className="p-2 text-slate-500 hover:text-white transition-colors"
                                            >
                                                {showGoogleKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <input
                                            type={showGoogleKey ? "text" : "password"}
                                            value={tempApiKeys.google}
                                            onChange={(e) => setTempApiKeys({ ...tempApiKeys, google: e.target.value })}
                                            placeholder="AIzaSa..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:border-noble-blue outline-none"
                                        />
                                        <p className="mt-4 text-[11px] text-slate-500 flex items-center gap-2">
                                            <AlertCircle size={14} className="text-noble-blue" />
                                            Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-noble-blue hover:underline font-bold inline-flex items-center gap-1">Get one from Google AI Studio <ExternalLink size={10} /></a>
                                        </p>
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={() => {
                                                updateApiKeys({ ...tempApiKeys, google: tempApiKeys.google }, true);
                                                addNotification({ title: 'Gemini Key Saved', msg: 'Your Gemini API configuration has been updated.', type: 'success' });
                                            }}
                                            className="px-6 py-3 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-noble-blue/20 flex items-center gap-2"
                                        >
                                            <Save size={16} />
                                            Save Gemini Configuration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Subscription & Billing</h2>
                                    <p className="text-slate-500">Manage your subscription tier, billing period, and payment history.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-noble-blue/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-noble-blue/20 transition-all"></div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-noble-blue/10 rounded-2xl border border-noble-blue/20">
                                                <Zap className="w-6 h-6 text-noble-blue" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Plan</p>
                                                <h4 className="text-xl font-bold text-white uppercase">{userProfile.plan} Plan</h4>
                                            </div>
                                        </div>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-slate-500">Status</span>
                                                <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-slate-500">Monthly Cost</span>
                                                <span className="text-white font-bold">{userProfile.plan === 'enterprise' ? '$250' : userProfile.plan === 'growth' ? '$25' : 'Free'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-slate-500">Next Renewal</span>
                                                <span className="text-white font-bold">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/pricing')}
                                            className="w-full py-4 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-2xl font-bold transition-all shadow-lg shadow-noble-blue/20"
                                        >
                                            Modify Subscription
                                        </button>
                                    </div>

                                    <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Method</p>
                                                <h4 className="text-xl font-bold text-white">â€¢â€¢â€¢â€¢ 4242</h4>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">Your subscription is currently processed via Paystack. Primary card ends in 4242.</p>
                                        <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all">Update Payment Method</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Notification Intelligence</h2>
                                    <p className="text-slate-500">Stay informed with real-time financial alerts and digest reports.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'marketAlerts', title: 'Critical Market Alerts', desc: 'Real-time notifications about significant variance in your business KPIs.' },
                                        { id: 'weeklyDigest', title: 'Weekly Financial Digest', desc: 'A curated summary of your performance, runway, and growth metrics.' },
                                        { id: 'productUpdates', title: 'Noble Clarity Changelog', desc: 'Be the first to know about new features and strategic upgrades.' }
                                    ].map((item) => (
                                        <div key={item.id} className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-between group hover:border-noble-blue/30 transition-all">
                                            <div className="max-w-md">
                                                <h4 className="text-white font-bold group-hover:text-noble-blue transition-colors">{item.title}</h4>
                                                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                                                className={`relative w-14 h-8 rounded-full transition-all duration-500 shadow-inner ${notifications[item.id as keyof typeof notifications] ? 'bg-noble-blue' : 'bg-slate-800'}`}
                                            >
                                                <div className={`absolute top-1.5 left-1.5 w-5 h-5 bg-white rounded-full transition-transform duration-500 ${notifications[item.id as keyof typeof notifications] ? 'translate-x-6 scale-110 shadow-lg' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Security Perimeter</h2>
                                    <p className="text-slate-500">Bolster your account security with professional-grade authentication controls.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg">Two-Factor Authentication (2FA)</h4>
                                                <p className="text-slate-500 text-sm max-w-sm">Requires a secondary code from your mobile device to access the Command Center.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setTwoFactorEnabled(!twoFactorEnabled);
                                                addNotification({
                                                    title: !twoFactorEnabled ? '2FA Protocol Initiated' : '2FA Deactivated',
                                                    msg: !twoFactorEnabled ? 'Scan the QR code in your authenticator app to complete setup.' : 'Your account is now using single-factor authentication.',
                                                    type: !twoFactorEnabled ? 'success' : 'alert'
                                                });
                                            }}
                                            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all border ${twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'}`}
                                        >
                                            {twoFactorEnabled ? 'Protocol Active' : 'Enable 2FA'}
                                        </button>
                                    </div>

                                    <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-between group">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                                                <Lock className="w-8 h-8 text-slate-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg">Master Password</h4>
                                                <p className="text-slate-500 text-sm">Initiate a secure password reset via your registered email address.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handlePasswordReset}
                                            className="px-8 py-3 bg-slate-800 hover:bg-noble-blue text-white rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Strategic Integrations</h2>
                                    <p className="text-slate-500">Sync your Noble Clarity dashboard with industry-leading financial and marketing platforms.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Fidelity Investments', id: 'fidelity', desc: 'Secure brokerage and asset management data.', icon: Landmark, color: 'text-noble-blue', bg: 'bg-noble-blue/10' },
                                        { name: 'Bloomberg Terminal', id: 'bloomberg', desc: 'Real-time market depth and terminals sync.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                        { name: 'Stripe Finance', id: 'stripe', desc: 'SaaS metrics and subscription revenue data.', icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                                        { name: 'Plaid Core', id: 'plaid', desc: 'Multi-bank transaction and balance aggregation.', icon: LinkIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                        { name: 'QuickBooks', id: 'quickbooks', desc: 'Cloud accounting and automated bookkeeping.', icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                                        { name: 'Xero', id: 'xero', desc: 'Beautiful business software for accounting.', icon: Database, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                                        { name: 'Google Sheets', id: 'sheets', desc: 'Dynamic data syncing from spreadsheets.', icon: Globe, color: 'text-green-500', bg: 'bg-green-500/10' },
                                        { name: 'HubSpot', id: 'hubspot', desc: 'CRM and marketing automation pipeline.', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                        { name: 'Meta Ads', id: 'meta', desc: 'Social advertising performance and ROI.', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-600/10' },
                                        { name: 'Google Ads', id: 'google-ads', desc: 'Search engine marketing and lead costs.', icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                                        { name: 'TikTok Ads', id: 'tiktok ads', desc: 'Viral video ad performance and tracking.', icon: Video, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                                        { name: 'Shopify', id: 'shopify', desc: 'E-commerce sales and inventory sync.', icon: ShoppingBag, color: 'text-lime-500', bg: 'bg-lime-500/10' },
                                        { name: 'Salesforce', id: 'salesforce', desc: 'Enterprise CRM and lead pipeline.', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                        { name: 'Slack', id: 'slack', desc: 'Team communication and alerts.', icon: MessageSquare, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
                                        { name: 'LinkedIn Ads', id: 'linkedin-ads', desc: 'B2B marketing and professional reach.', icon: Share2, color: 'text-blue-700', bg: 'bg-blue-700/10' },
                                        { name: 'Mailchimp', id: 'mailchimp', desc: 'Email marketing campaigns and audiences.', icon: Mail, color: 'text-yellow-600', bg: 'bg-yellow-600/10' },
                                        { name: 'Asana', id: 'asana', desc: 'Project management and task tracking.', icon: ListTodo, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                                    ].map((app) => (
                                        <div key={app.name} className="relative p-6 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-between group hover:border-white/20 transition-all overflow-visible">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 ${app.bg} rounded-2xl border border-white/5 shadow-inner`}>
                                                    <app.icon className={`w-6 h-6 ${app.color}`} />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm leading-tight">{app.name}</h4>
                                                    <p className="text-[10px] text-slate-500 mt-1 max-w-[150px]">{app.desc}</p>
                                                </div>
                                            </div>

                                            {/* Blinking Badge */}
                                            {integrationConfigs[app.id]?.badge && (
                                                <div className={`absolute -top-2 -right-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl border ${integrationConfigs[app.id]?.badgeClass}`}>
                                                    {integrationConfigs[app.id]?.badge}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => toggleIntegration(app.name)}
                                                disabled={isConnecting}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${connectedApps.includes(app.name) ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'} disabled:opacity-50`}
                                            >
                                                {connectedApps.includes(app.name) ? 'Connected' : 'Connect'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Configuration Modals */}
                                {configuringIntegration && integrationConfigs[configuringIntegration] && (
                                    <IntegrationModal
                                        isOpen={!!configuringIntegration}
                                        config={integrationConfigs[configuringIntegration]}
                                        onClose={() => setConfiguringIntegration(null)}
                                        isConnecting={isConnecting}
                                        onConnect={async () => {
                                            if (!configuringIntegration) return;
                                            setIsConnecting(true);
                                            try {
                                                let serviceKey = configuringIntegration;
                                                // Key mapping for legacy services
                                                if (configuringIntegration === 'sheets') serviceKey = 'google-sheets';
                                                if (configuringIntegration === 'meta') serviceKey = 'meta-ads';
                                                if (configuringIntegration === 'tiktok ads') serviceKey = 'tiktok-ads';

                                                const result: any = await initiateOAuthConnection(serviceKey);

                                                const app = integrationConfigs[configuringIntegration];
                                                const appName = app.name.replace('Connect ', '').replace(' Banking', 'Plaid').replace(' Terminal', '');

                                                // --- DATA SYNC LOGIC ---
                                                // Once connected, we immediately fetch the data simulation (or real data)
                                                // and update the main app state.
                                                if (activeProfileData?.current) {
                                                    let newData = { ...activeProfileData.current };

                                                    if (configuringIntegration === 'stripe') {
                                                        const sync = await syncStripeData('sk_test_simulated');
                                                        if (sync.success) {
                                                            newData.revenue = (newData.revenue || 0) + sync.data.rev;
                                                            newData.mrr = (newData.mrr || 0) + (sync.data.rev / 12);
                                                            newData.churnRate = sync.data.churn;
                                                        }
                                                    } else if (configuringIntegration === 'meta') {
                                                        const sync = await syncMetaAdsData('app_id', 'token');
                                                        if (sync.success) {
                                                            newData.marketingSpend = (newData.marketingSpend || 0) + sync.data.spend;
                                                            newData.cac = (newData.marketingSpend / (newData.revenue / 100)); // Rough estimation update
                                                        }
                                                    } else if (configuringIntegration === 'google-ads') {
                                                        const sync = await syncGoogleAdsData({} as any);
                                                        if (sync.success) {
                                                            newData.marketingSpend = (newData.marketingSpend || 0) + sync.data.spend;
                                                        }
                                                    } else if (configuringIntegration === 'fidelity') {
                                                        const sync = await syncFidelityData({ apiKey: 'demo', partnerId: 'demo' });
                                                        if (sync.success) {
                                                            newData.cashOnHand = (newData.cashOnHand || 0) + sync.data.portfolioValue;
                                                        }
                                                    } else if (configuringIntegration === 'xero') {
                                                        const sync = await syncXeroData('demo', 'demo');
                                                        if (sync.success) {
                                                            newData.expenses = (newData.expenses || 0) + sync.data.accountsPayable;
                                                            newData.cashOnHand = (newData.cashOnHand || 0) + sync.data.cashBalance;
                                                        }
                                                    } else if (configuringIntegration === 'hubspot') {
                                                        const sync = await syncHubSpotData('demo');
                                                        if (sync.success) {
                                                            // Example: Update projected pipe
                                                            // We might need a field for pipeline value in data model, currently mapping to standard financial data
                                                        }
                                                    } else if (configuringIntegration === 'tiktok ads') {
                                                        const sync = await syncTikTokAdsData('token');
                                                        if (sync.success) {
                                                            newData.marketingSpend = (newData.marketingSpend || 0) + sync.data.spend;
                                                        }
                                                    }

                                                    // For Google Sheets (Real Auth), we might fetch from a sheet here if we had the sheet ID.
                                                    // Since initiateOAuthConnection returns the token for sheets, we could trigger a sheet read.
                                                    if (configuringIntegration === 'sheets' && result?.success) {
                                                        // In a real app, prompt for Sheet ID or list sheets.
                                                        // For now, we trust the connection.
                                                    }

                                                    updateFinancialData(newData);
                                                }

                                                setConnectedApps((prev: string[]) => {
                                                    const updated = prev.includes(appName) ? prev : [...prev, appName];
                                                    updateUserProfile({ ...userProfile, integrations: updated });
                                                    return updated;
                                                });

                                                addNotification({
                                                    title: `${appName} Connected`,
                                                    msg: 'Integration active. Data synced locally.',
                                                    type: 'success'
                                                });
                                                setConfiguringIntegration(null);
                                            } catch (error) {
                                                console.error("Integration failed", error);
                                                addNotification({ title: 'Connection Failed', msg: 'Handshake failed.', type: 'error' });
                                            } finally {
                                                setIsConnecting(false);
                                            }
                                        }}
                                    />
                                )}

































                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Advanced Workspace Utility</h2>
                                    <p className="text-slate-500">Low-level controls for workspace management and sensitive data removal.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-between group hover:border-amber-500/20 transition-all">
                                        <div>
                                            <h4 className="text-white font-bold leading-tight">Reset Profile Memory</h4>
                                            <p className="text-sm text-slate-500 mt-1">Wipe historical snapshots and active goals for <span className="text-white font-bold italic">{activeProfile?.name}</span>.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (confirm("Confirm: Wipe all data for this business?")) {
                                                    resetProfile();
                                                    addNotification({ title: 'Profile Reset', msg: 'The business profile has been cleared.', type: 'info' });
                                                }
                                            }}
                                            className="px-6 py-3 bg-slate-900 hover:bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl font-bold text-xs transition-all"
                                        >
                                            Reset Profile
                                        </button>
                                    </div>

                                    <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-between group hover:border-noble-blue/20 transition-all">
                                        <div>
                                            <h4 className="text-white font-bold leading-tight">Clear Notification Registry</h4>
                                            <p className="text-sm text-slate-500 mt-1">Permanently purge your notification history and alerts.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (confirm("Permanent: Clear all notifications?")) {
                                                    clearAllNotifications();
                                                    addNotification({ title: 'Logs Purged', msg: 'System logs and notifications cleared.', type: 'info' });
                                                }
                                            }}
                                            className="px-6 py-3 bg-slate-900 hover:bg-noble-blue/10 text-noble-blue border border-noble-blue/20 rounded-2xl font-bold text-xs transition-all"
                                        >
                                            Purge Registry
                                        </button>
                                    </div>

                                    <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] flex items-center justify-between group hover:bg-rose-500/10 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                                <ShieldAlert className="w-8 h-8 text-rose-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-rose-500 font-bold leading-tight">Global Wipe Protocol</h4>
                                                <p className="text-sm text-slate-500 mt-1">Irreversibly delete all profiles, encryption keys, and session data.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={wipeAppData}
                                            className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-900/40 transition-all active:scale-95"
                                        >
                                            Initiate Wipe
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Save Button */}
                <div className="md:hidden mt-8">
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-3 py-5 bg-noble-blue text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-noble-blue/30"
                    >
                        Save Updated Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
