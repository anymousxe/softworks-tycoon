import React from 'react';
import useGameStore from '../../store/gameStore';
import ModelCard from './ModelCard';
import { LayoutDashboard, TrendingUp, BarChart, Globe, Zap, PlusSquare, Clock, Cpu, AlertTriangle } from 'lucide-react';

const DashboardHome = ({ onNavigate }) => {
    const { activeCompany, pendingLawsuits } = useGameStore();

    // Categorize models by status
    const models = activeCompany?.models || [];
    const trainingModels = models.filter(m => m.status === 'training');
    const trainedModels = models.filter(m => m.status === 'trained');
    const releasedModels = models.filter(m => m.status === 'released');
    const createdModels = models.filter(m => m.status === 'created');

    const totalWeeklyRevenue = releasedModels.reduce((acc, m) => acc + (m.revenue || 0), 0);
    const avgQuality = releasedModels.length > 0
        ? Math.round(releasedModels.reduce((acc, m) => acc + (m.quality || 0), 0) / releasedModels.length)
        : 0;
    const totalCompute = activeCompany?.compute || 0;

    return (
        <div className="space-y-10 animate-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Global Operations</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-10 bg-cyan-500"></div>
                        <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Sector: {activeCompany?.name}</p>
                    </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <div className="glass-panel px-6 py-4 border-white/5 flex items-center gap-4 bg-white/5">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <div>
                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Weekly Gross</div>
                            <div className="text-white font-black text-lg tracking-tight leading-none">${totalWeeklyRevenue.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="glass-panel px-6 py-4 border-white/5 flex items-center gap-4 bg-white/5">
                        <Cpu className="w-5 h-5 text-purple-500" />
                        <div>
                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Compute</div>
                            <div className="text-white font-black text-lg tracking-tight leading-none">{totalCompute.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="glass-panel px-6 py-4 border-white/5 flex items-center gap-4 bg-white/5">
                        <Zap className="w-5 h-5 text-cyan-500" />
                        <div>
                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Avg Quality</div>
                            <div className="text-white font-black text-lg tracking-tight leading-none">{avgQuality}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lawsuit Warning */}
            {pendingLawsuits?.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                        <div>
                            <div className="text-red-400 font-black uppercase text-sm mb-1">Pending Lawsuits: {pendingLawsuits.length}</div>
                            <div className="text-[10px] text-red-400/70">You are being sued for training data usage. Click to manage.</div>
                        </div>
                    </div>
                    <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase">
                        View Lawsuits
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content: Model Grid */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Training Models Section */}
                    {trainingModels.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-purple-500" />
                                <h2 className="text-lg font-black text-white tracking-widest uppercase">In Training</h2>
                                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-bold">{trainingModels.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trainingModels.map(model => (
                                    <ModelCard key={model.id} model={model} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ready to Release Section */}
                    {trainedModels.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-lg font-black text-white tracking-widest uppercase">Ready to Release</h2>
                                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-bold">{trainedModels.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trainedModels.map(model => (
                                    <ModelCard key={model.id} model={model} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Released Models Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-cyan-500" />
                                <h2 className="text-lg font-black text-white tracking-widest uppercase">Released Models</h2>
                                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full font-bold">{releasedModels.length}</span>
                            </div>
                            <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                                Total: {models.length}
                            </div>
                        </div>

                        {releasedModels.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {releasedModels.map(model => (
                                    <ModelCard key={model.id} model={model} />
                                ))}
                            </div>
                        ) : models.length === 0 ? (
                            <div className="glass-panel p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent min-h-[400px]">
                                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center mb-8 border border-white/5 shadow-2xl group transition-all hover:scale-110">
                                    <LayoutDashboard className="w-10 h-10 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">No Models Yet</h3>
                                <p className="text-slate-500 text-sm mb-10 max-w-sm leading-relaxed">
                                    Create your first AI model to begin training.<br />
                                    Model creation is <span className="text-green-400 font-bold">FREE</span> - you only pay for training.
                                </p>
                                <button
                                    onClick={() => onNavigate('dev')}
                                    className="btn-primary px-10 py-5 flex items-center gap-3 group"
                                >
                                    <PlusSquare className="w-5 h-5" />
                                    CREATE MODEL
                                </button>
                            </div>
                        ) : (
                            <div className="glass-panel p-8 text-center border-dashed border-white/10 bg-transparent">
                                <p className="text-slate-500 text-sm">No released models yet. Train and release your models!</p>
                            </div>
                        )}
                    </div>

                    {/* Created but not configured */}
                    {createdModels.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <LayoutDashboard className="w-5 h-5 text-slate-500" />
                                <h2 className="text-lg font-black text-white tracking-widest uppercase">Awaiting Configuration</h2>
                                <span className="text-[10px] bg-white/10 text-slate-400 px-2 py-1 rounded-full font-bold">{createdModels.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {createdModels.map(model => (
                                    <ModelCard key={model.id} model={model} />
                                ))}
                            </div>
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
                            { name: 'OpenAI', model: 'GPT-5', params: '1.5T', trend: 'stable' },
                            { name: 'Anthropic', model: 'Claude 4', params: '800B', trend: 'up' },
                            { name: 'DeepMind', model: 'Gemini 2', params: '1.2T', trend: 'up' },
                            { name: 'Meta', model: 'Llama 4', params: '405B', trend: 'stable' },
                            { name: 'xAI', model: 'Grok 3', params: '600B', trend: 'up' }
                        ].map((feed, i) => (
                            <div key={i} className="glass-panel p-5 bg-white/5 border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                                <div>
                                    <div className="text-white font-black text-xs uppercase tracking-wider mb-1 group-hover:text-cyan-400 transition-colors">{feed.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono uppercase">{feed.model}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-purple-400 font-mono text-xs font-bold leading-none mb-1">{feed.params}</div>
                                    <div className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">PARAMS</div>
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

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-black text-white tracking-widest uppercase">Quick Actions</h2>
                        <button
                            onClick={() => onNavigate('dev')}
                            className="w-full glass-panel p-4 flex items-center gap-3 hover:bg-white/10 transition-all border-white/5"
                        >
                            <PlusSquare className="w-5 h-5 text-cyan-500" />
                            <span className="text-white font-bold text-sm">Create New Model</span>
                        </button>
                        <button
                            onClick={() => onNavigate('market')}
                            className="w-full glass-panel p-4 flex items-center gap-3 hover:bg-white/10 transition-all border-white/5"
                        >
                            <Cpu className="w-5 h-5 text-purple-500" />
                            <span className="text-white font-bold text-sm">Buy Hardware</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
