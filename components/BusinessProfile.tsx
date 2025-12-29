import React, { useState, useEffect } from 'react';
import {
    Building2,
    Calendar,
    Users,
    Briefcase,
    ChevronDown,
    Sparkles,
    Save,
    TrendingUp
} from 'lucide-react';
import { useBusiness } from '../contexts/NobleContext';
import { INDUSTRY_BENCHMARKS, calculateKPIs } from '../constants';

const BusinessProfile: React.FC = () => {
    const { activeProfile, updateProfile, activeProfileData } = useBusiness();

    const [formData, setFormData] = useState({
        name: activeProfile?.name || '',
        industry: activeProfile?.industry || 'Technology',
        businessSize: activeProfile?.businessSize || '1-10 Employees',
        foundingDate: activeProfile?.foundingDate || new Date().toISOString().split('T')[0]
    });

    // Derived Benchmarks from real data
    const kpis = activeProfileData ? calculateKPIs(activeProfileData.current) : null;
    const industryBenchmarks = INDUSTRY_BENCHMARKS[activeProfile?.industry || 'Technology'];

    const benchmarks = {
        revenueGrowth: {
            value: 28, // Placeholder as we don't have YoY growth in current data yet
            industry: 22
        },
        netProfitMargin: {
            value: kpis ? Math.round(kpis.netProfitMargin) : 0,
            industry: industryBenchmarks?.netProfitMargin || 0
        },
        roi: {
            value: kpis ? Math.round(kpis.roi) : 0,
            industry: 30 // Industry standard ROI placeholder
        }
    };

    // Sync with active profile
    useEffect(() => {
        if (activeProfile) {
            setFormData(prev => ({
                ...prev,
                name: activeProfile.name,
                industry: activeProfile.industry,
                businessSize: activeProfile.businessSize || prev.businessSize,
                foundingDate: activeProfile.foundingDate || prev.foundingDate
            }));
        }
    }, [activeProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = () => {
        if (activeProfile) {
            updateProfile(activeProfile.id, {
                name: formData.name,
                industry: formData.industry,
                businessSize: formData.businessSize,
                foundingDate: formData.foundingDate
            });
        }
    };

    return (
        <div className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-8 bg-[#0b0e14] min-h-full">
            <div className="flex w-full flex-col max-w-7xl flex-1">
                <div className="flex flex-wrap justify-between items-center gap-4 py-8">
                    <h1 className="text-white text-4xl sm:text-5xl font-display font-black leading-tight tracking-[-0.033em] min-w-72">
                        Business Profile & Benchmarking
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Core Information */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="p-0.5 rounded-xl bg-white/10 shadow-lg">
                            <div className="rounded-lg bg-[#18232e] bg-opacity-80 backdrop-blur-sm p-6 space-y-6">
                                <h2 className="text-2xl font-display font-bold text-white">Core Information</h2>
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400" htmlFor="name">Company Name</label>
                                        <div className="relative mt-1">
                                            <input
                                                className="w-full rounded-lg border-white/20 bg-white/5 p-3 text-white focus:border-[#259df4] focus:ring-[#259df4] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.2)] pl-10"
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400" htmlFor="industry">Industry</label>
                                        <div className="relative mt-1">
                                            <input
                                                className="w-full rounded-lg border-white/20 bg-white/5 p-3 text-white focus:border-[#259df4] focus:ring-[#259df4] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.2)] pl-10"
                                                id="industry"
                                                type="text"
                                                value={formData.industry}
                                                onChange={handleChange}
                                            />
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-400" htmlFor="businessSize">Business Size</label>
                                            <div className="relative mt-1">
                                                <input
                                                    className="w-full rounded-lg border-white/20 bg-white/5 p-3 text-white focus:border-[#259df4] focus:ring-[#259df4] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.2)] pl-10"
                                                    id="businessSize"
                                                    type="text"
                                                    value={formData.businessSize}
                                                    onChange={handleChange}
                                                />
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-400" htmlFor="foundingDate">Founding Date</label>
                                            <div className="relative mt-1">
                                                <input
                                                    className="w-full rounded-lg border-white/20 bg-white/5 p-3 text-white focus:border-[#259df4] focus:ring-[#259df4] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.2)] pl-10"
                                                    id="foundingDate"
                                                    type="date"
                                                    value={formData.foundingDate}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#259df4] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span className="truncate">Save Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Industry Benchmarking */}
                    <div className="lg:col-span-3">
                        <div className="p-0.5 rounded-xl bg-white/10 shadow-lg h-full">
                            <div className="rounded-lg bg-[#18232e] bg-opacity-80 backdrop-blur-sm p-6 h-full flex flex-col">
                                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-display font-bold text-white">Industry Benchmarking</h2>
                                    <div className="relative">
                                        <select className="appearance-none rounded-lg border-white/20 bg-white/5 py-2 pl-3 pr-8 text-gray-300 focus:border-[#259df4] focus:ring-[#259df4] transition-all text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                                            <option>Enterprise SaaS - Global</option>
                                            <option>Fintech - North America</option>
                                            <option>AI/ML - Europe</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    </div>
                                </div>

                                <div className="flex-grow space-y-6">
                                    {/* Revenue Growth */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium text-gray-400">Revenue Growth (YoY)</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 shrink-0 text-right text-lg font-bold text-[#259df4]">{benchmarks.revenueGrowth.value}%</div>
                                            <div className="w-full bg-black/20 rounded-full h-4 relative overflow-hidden">
                                                <div className="bg-gray-600 h-4 rounded-full" style={{ width: `${benchmarks.revenueGrowth.industry}%` }}></div>
                                                <div className="bg-[#259df4] h-4 rounded-full absolute top-0" style={{ width: `${benchmarks.revenueGrowth.value}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 shrink-0 text-right text-sm text-gray-400">Industry Avg.</div>
                                            <div className="w-full bg-black/20 rounded-full h-4 relative">
                                                <div className="bg-gray-600 h-4 rounded-full" style={{ width: `${benchmarks.revenueGrowth.industry}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Net Profit Margin */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium text-gray-400">Net Profit Margin</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 shrink-0 text-right text-lg font-bold text-[#259df4]">{benchmarks.netProfitMargin.value}%</div>
                                            <div className="w-full bg-black/20 rounded-full h-4 relative overflow-hidden">
                                                <div className="bg-gray-600 h-4 rounded-full" style={{ width: `${benchmarks.netProfitMargin.industry}%` }}></div>
                                                <div className="bg-[#259df4] h-4 rounded-full absolute top-0" style={{ width: `${benchmarks.netProfitMargin.value}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 shrink-0 text-right text-sm text-gray-400">Industry Avg.</div>
                                            <div className="w-full bg-black/20 rounded-full h-4 relative">
                                                <div className="bg-gray-600 h-4 rounded-full" style={{ width: `${benchmarks.netProfitMargin.industry}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ROI */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium text-gray-400">Return on Investment (ROI)</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 shrink-0 text-right text-lg font-bold text-[#259df4]">{benchmarks.roi.value}%</div>
                                            <div className="w-full bg-black/20 rounded-full h-4 relative overflow-hidden">
                                                <div className="bg-gray-600 h-4 rounded-full" style={{ width: `${benchmarks.roi.industry}%` }}></div>
                                                <div className="bg-[#259df4] h-4 rounded-full absolute top-0" style={{ width: `${benchmarks.roi.value}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 shrink-0 text-right text-sm text-gray-400">Industry Avg.</div>
                                            <div className="w-full bg-black/20 rounded-full h-4 relative">
                                                <div className="bg-gray-600 h-4 rounded-full" style={{ width: `${benchmarks.roi.industry}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 p-0.5 rounded-xl bg-gradient-to-br from-[#a855f7]/30 to-[#259df4]/30 shadow-lg">
                                    <div className="rounded-lg bg-[#18232e]/90 p-4">
                                        <div className="flex items-start gap-4">
                                            <Sparkles className="w-6 h-6 text-[#a855f7] mt-1" />
                                            <div>
                                                <h3 className="font-bold text-white">AI-Driven Insight</h3>
                                                <p className="text-gray-300 mt-1">Your Net Profit Margin is below the industry average for top performers. Focus on optimizing operational costs could close this performance gap.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
