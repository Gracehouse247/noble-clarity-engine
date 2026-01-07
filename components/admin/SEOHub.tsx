
import * as React from 'react';
import {
    Globe,
    TrendingUp,
    ExternalLink,
    Share2,
    Search,
    MousePointer2,
    BarChart3,
    ListFilter
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const TRAFFIC_DATA = [
    { day: 'Mon', organic: 1200, direct: 450, social: 300 },
    { day: 'Tue', organic: 1400, direct: 500, social: 350 },
    { day: 'Wed', organic: 1100, direct: 480, social: 280 },
    { day: 'Thu', organic: 1900, direct: 600, social: 450 },
    { day: 'Fri', organic: 2100, direct: 750, social: 400 },
    { day: 'Sat', organic: 1600, direct: 550, social: 320 },
    { day: 'Sun', organic: 1300, direct: 400, social: 250 },
];

const REFERRING_DOMAINS = [
    { domain: 'techcrunch.com', traffic: '1.2k', authority: 92, trend: 'up' },
    { domain: 'producthunt.com', traffic: '850', authority: 88, trend: 'up' },
    { domain: 'hackernews.com', traffic: '420', authority: 91, trend: 'down' },
    { domain: 'indiehackers.com', traffic: '310', authority: 75, trend: 'up' },
    { domain: 'medium.com', traffic: '280', authority: 94, trend: 'stable' },
];

const SEOHub: React.FunctionComponent = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">SEO Hub</h2>
                    <p className="text-slate-400 text-sm mt-1">Monitor platform visibility, organic acquisition and referral authority.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold border border-slate-800">
                        Update IndexNow
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Traffic Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <MousePointer2 className="text-rose-500" size={20} /> Acquisition Channels
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div> Organic
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Direct
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={TRAFFIC_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                />
                                <Line type="monotone" dataKey="organic" stroke="#e11d48" strokeWidth={3} dot={{ fill: '#e11d48', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="direct" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Keywords / Quick Stats */}
                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Domain Authority</h4>
                        <p className="text-4xl font-extrabold text-white">42 <span className="text-sm font-medium text-emerald-500">+4</span></p>
                        <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-600 w-[42%]"></div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex-1">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Indexing Status</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Indexed Pages', val: '124', status: 'Healthy' },
                                { label: 'Crawl Errors', val: '0', status: 'Clean' },
                                { label: 'Mobile Optimized', val: '100%', status: 'Perfect' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs text-slate-300">{stat.label}</span>
                                    <span className="text-xs font-bold text-white">{stat.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Referring Domains Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Share2 className="text-blue-500" size={16} /> Referring Domain Profiles
                    </h3>
                    <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                        <ListFilter size={14} /> View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] text-slate-500 uppercase font-bold tracking-widest bg-slate-950/20 border-b border-slate-800">
                                <th className="px-8 py-4">Domain</th>
                                <th className="px-8 py-4">Traffic Acquisition</th>
                                <th className="px-8 py-4">Domain Authority (DA)</th>
                                <th className="px-8 py-4 text-center">Backlink Quality</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {REFERRING_DOMAINS.map((domain, i) => (
                                <tr key={i} className="hover:bg-slate-800/20 transition-all cursor-pointer">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                                                <Globe size={14} className="text-slate-400" />
                                            </div>
                                            <span className="text-sm font-bold text-white">{domain.domain}</span>
                                            <ExternalLink size={12} className="text-slate-600" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-300 font-mono">{domain.traffic} visits</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full max-w-[100px]">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${domain.authority}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-white">{domain.authority}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${domain.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' :
                                                domain.trend === 'down' ? 'bg-rose-500/10 text-rose-500' :
                                                    'bg-slate-500/10 text-slate-500'
                                            }`}>
                                            {domain.trend}ward
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SEOHub;
