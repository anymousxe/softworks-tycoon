import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Zap } from 'lucide-react';
import useGameStore from '../../store/gameStore';

const StatsPanel = () => {
    const { activeCompany } = useGameStore();
    const models = activeCompany?.models || [];
    const hardware = activeCompany?.hardware || [];

    const liveModels = models.filter(m => m.released || m.status === 'live');
    const totalRevenue = liveModels.reduce((acc, m) => acc + (m.revenue || 0), 0);
    const totalCompute = activeCompany?.compute || 0;

    return (
        <div className="animate-in space-y-10">
            <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Analytics</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Performance Metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-8">
                    <DollarSign className="w-8 h-8 text-green-500 mb-4" />
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Total Cash</div>
                    <div className="text-3xl font-black text-white">${(activeCompany?.cash || 0).toLocaleString()}</div>
                </div>
                <div className="glass-panel p-8">
                    <Zap className="w-8 h-8 text-blue-500 mb-4" />
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Compute Power</div>
                    <div className="text-3xl font-black text-white">{totalCompute} TF</div>
                </div>
                <div className="glass-panel p-8">
                    <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Weekly Revenue</div>
                    <div className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</div>
                </div>
                <div className="glass-panel p-8">
                    <Users className="w-8 h-8 text-cyan-500 mb-4" />
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Active Models</div>
                    <div className="text-3xl font-black text-white">{liveModels.length}</div>
                </div>
            </div>

            <div className="glass-panel p-10">
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-cyan-500" />
                    Weekly Performance
                </h2>
                <div className="h-64 flex items-center justify-center text-slate-600">
                    <p className="font-mono text-sm">Charts coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
