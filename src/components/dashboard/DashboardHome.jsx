import React from 'react';
import useGameStore from '../../store/gameStore';
import ModelCard from './ModelCard';
import { LayoutDashboard, TrendingUp, BarChart, Globe, Zap, PlusSquare } from 'lucide-react';

const DashboardHome = ({ onNavigate }) => {
    const { models, activeCompany } = useGameStore();

    const liveModels = models.filter(m => m.released);
    const totalWeeklyRevenue = liveModels.reduce((acc, m) => acc + (m.revenue || 0), 0);
    const avgQuality = liveModels.length > 0
        ? Math.round(liveModels.reduce((acc, m) => acc + (m.quality || 0), 0) / liveModels.length)
        : 0;

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Global Operations</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-10 bg-cyan-500"></div>
                        <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Sector: {activeCompany?.name}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="glass-panel px-6 py-4 border-white/5 flex items-center gap-4 bg-white/5">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <div>
                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Weekly Gross</div>
                            <div className="text-white font-black text-lg tracking-tight leading-none">${totalWeeklyRevenue.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="glass-panel px-6 py-4 border-white/5 flex items-center gap-4 bg-white/5">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <div>
                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Avg Quality</div>
                            <div className="text-white font-black text-lg tracking-tight leading-none">{avgQuality}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content: Model Grid */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                            <Globe className="w-5 h-5 text-cyan-500" />
                            Neural Assets
                        </h2>
                        <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                            Live: {liveModels.length} // Total: {models.length}
                        </div>
                    </div>

                    {models.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {models.map(model => (
                                <ModelCard key={model.id} model={model} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent min-h-[400px]">
                            <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center mb-8 border border-white/5 shadow-2xl group transition-all hover:scale-110">
                                <LayoutDashboard className="w-10 h-10 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">No Neural Assets Found</h3>
                            <p className="text-slate-500 text-sm mb-10 max-w-sm leading-relaxed">
                                Your corporation currently has no active neural architectures.
                                Initialize development to begin market domination.
                            </p>
                            <button
                                onClick={() => onNavigate('dev')}
                                className="btn-primary px-10 py-5 flex items-center gap-3 group"
                            >
                                <PlusSquare className="w-5 h-5" />
                                INITIALIZE CREATOR
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar: Market Overview */}
                <div className="lg:col-span-1 space-y-8">
                    <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                        <BarChart className="w-5 h-5 text-purple-500" />
                        Market Feed
                    </h2>

                    <div className="space-y-4">
                        {[
                            { name: 'OpenAI', type: 'gpt-5', price: '$0.002', trend: 'down' },
                            { name: 'Anthropic', type: 'claude-4', price: '$0.005', trend: 'up' },
                            { name: 'DeepMind', type: 'gemini-exp', price: '$0.001', trend: 'stable' }
                        ].map((feed, i) => (
                            <div key={i} className="glass-panel p-5 bg-white/5 border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                                <div>
                                    <div className="text-white font-black text-xs uppercase tracking-wider mb-1 group-hover:text-cyan-400 transition-colors">{feed.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono uppercase">{feed.type}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-green-500 font-mono text-xs font-bold leading-none mb-1">{feed.price}</div>
                                    <div className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">/ 1K TOKENS</div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => onNavigate('rivals')}
                            className="w-full text-center py-4 text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] hover:text-cyan-500 transition-colors border-t border-white/5"
                        >
                            View All Intelligence Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
