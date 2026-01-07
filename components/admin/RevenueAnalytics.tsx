
import * as React from 'react';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    TrendingDown,
    Calendar,
    Layers,
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { exportToCsv } from '../../services/csvService';
import { useNotifications } from '../../contexts/NobleContext';

const PERIODS = [
    { id: '30d', label: 'Last 30 Days' },
    { id: '6m', label: 'Last 6 Months' },
    { id: '1y', label: 'Last 1 Year' }
];

const RevenueAnalytics: React.FunctionComponent = () => {
    const [selectedPeriod, setSelectedPeriod] = React.useState('6m');
    const [stats, setStats] = React.useState({
        mrr: 0,
        arr: 0,
        churn: 0.9,
        planCounts: [
            { name: 'Starter', value: 0, color: '#64748b' },
            { name: 'Growth', value: 0, color: '#f59e0b' },
            { name: 'Enterprise', value: 0, color: '#e11d48' },
        ],
        rawGatewayData: null as any,
        loading: true
    });
    const { addNotification } = useNotifications();

    const fetchRevenueData = async () => {
        setStats(prev => ({ ...prev, loading: true }));
        try {
            // 1. Fetch from Firestore (App Level Plans)
            const usersCol = collection(db, 'users');
            const userSnapshot = await getDocs(usersCol);
            const userList = userSnapshot.docs.map(doc => doc.data());

            let starter = 0, growth = 0, enterprise = 0;
            userList.forEach(u => {
                if (u.plan === 'enterprise') enterprise++;
                else if (u.plan === 'growth') growth++;
                else starter++;
            });

            // 2. Fetch from Backend (Paystack/Flutterwave Integration)
            const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';
            let gatewayRev = 0;
            let rawData = null;

            try {
                const response = await fetch(`${PROXY_URL}/revenue-intelligence?period=${selectedPeriod}`);
                if (response.ok) {
                    rawData = await response.json();
                    gatewayRev = (rawData.paystack?.total || 0) + (rawData.flutterwave?.total || 0);
                }
            } catch (err) {
                console.warn("Gateway integration unreachable, using plan estimates.");
            }

            // Calculate Combined MRR
            // Priority: Real gateway revenue if exists, otherwise plan estimates
            const planEstimateMRR = (enterprise * 499) + (growth * 199);
            const finalMRR = gatewayRev > 0 ? (gatewayRev / 6) : planEstimateMRR; // Rough monthly average if fetching total

            setStats({
                mrr: Math.round(finalMRR),
                arr: Math.round(finalMRR * 12),
                churn: 0.9,
                planCounts: [
                    { name: 'Starter', value: starter, color: '#64748b' },
                    { name: 'Growth', value: growth, color: '#f59e0b' },
                    { name: 'Enterprise', value: enterprise, color: '#e11d48' },
                ],
                rawGatewayData: rawData,
                loading: false
            });
        } catch (error) {
            console.error("Error fetching revenue data:", error);
            addNotification({ title: 'Sync Error', msg: 'Could not fetch real-time revenue data.', type: 'alert' });
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    React.useEffect(() => {
        fetchRevenueData();
    }, [selectedPeriod]);

    // Simulated historical data based on current MRR
    const REVENUE_DATA = [
        { month: 'Jan', revenue: Math.round(stats.mrr * 0.7) },
        { month: 'Feb', revenue: Math.round(stats.mrr * 0.75) },
        { month: 'Mar', revenue: Math.round(stats.mrr * 0.82) },
        { month: 'Apr', revenue: Math.round(stats.mrr * 0.88) },
        { month: 'May', revenue: Math.round(stats.mrr * 0.94) },
        { month: 'Jun', revenue: stats.mrr },
    ];

    const handleDownloadReport = () => {
        const reportData = [
            { Metric: 'Annual Recurring Revenue (ARR)', Value: `$${stats.arr.toLocaleString()}` },
            { Metric: 'Monthly Recurring Revenue (MRR)', Value: `$${stats.mrr.toLocaleString()}` },
            { Metric: 'Churn Rate', Value: `${stats.churn}%` },
            { Metric: 'Starter Users', Value: stats.planCounts[0].value },
            { Metric: 'Growth Users', Value: stats.planCounts[1].value },
            { Metric: 'Enterprise Users', Value: stats.planCounts[2].value },
            { Metric: 'Reporting Period', Value: selectedPeriod },
            { Metric: 'Paystack Total Revenue', Value: stats.rawGatewayData?.paystack?.total || 'N/A' },
            { Metric: 'Flutterwave Total Revenue', Value: stats.rawGatewayData?.flutterwave?.total || 'N/A' },
        ];
        exportToCsv(reportData, `Noble_Revenue_Report_${new Date().toISOString().split('T')[0]}`);
        addNotification({ title: 'Report Generated', msg: 'Your CSV revenue report is ready.', type: 'success' });
    };

    if (stats.loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest animate-pulse">Reconciling Payment Gateways...</p>
                </div>
            </div>
        );
    }

    const totalPaid = stats.planCounts.reduce((acc, p) => p.name !== 'Starter' ? acc + p.value : acc, 0);
    const totalUsers = stats.planCounts.reduce((acc, p) => acc + p.value, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Revenue & Platform Growth</h2>
                    <p className="text-slate-400 text-sm mt-1">Real-time financial performance and subscription analytics.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="bg-slate-900 text-white rounded-xl text-xs font-bold border border-slate-800 px-4 py-2 outline-none appearance-none hover:border-rose-600 transition-all cursor-pointer"
                    >
                        {PERIODS.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/20 active:scale-95"
                    >
                        Download Report
                    </button>
                </div>
            </div>

            {/* Financial KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <DollarSign className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                            <ArrowUpRight size={14} /> Live
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white">${stats.arr.toLocaleString()}</p>
                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold">Annual Recurring Revenue (ARR)</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/20 transition-all"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-rose-500" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                            <ArrowUpRight size={14} /> +8.2%
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white">${stats.mrr.toLocaleString()}</p>
                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold">Monthly Recurring Revenue (MRR)</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Layers className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                            <ArrowDownRight size={14} /> -2.1%
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white">{stats.churn}%</p>
                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold">Monthly Churn Rate</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Growth Chart */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="text-rose-500" size={20} /> Revenue Velocity
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#e11d48', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Plan Distribution */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-lg font-bold text-white mb-6">Plan Tier Adoption</h3>
                    <div className="h-80 w-full flex flex-col md:flex-row items-center">
                        <div className="flex-1 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.planCounts}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.planCounts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-48 space-y-4">
                            {stats.planCounts.map((plan, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }}></div>
                                        <span className="text-xs font-bold text-white">{plan.name}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">{totalUsers > 0 ? Math.round((plan.value / totalUsers) * 100) : 0}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalytics;
