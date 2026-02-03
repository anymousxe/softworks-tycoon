import React from 'react';
import { Briefcase, Users, Building2 } from 'lucide-react';
import useGameStore from '../../store/gameStore';

const BusinessPanel = () => {
    const { activeCompany } = useGameStore();

    return (
        <div className="animate-in space-y-10">
            <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Business</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Company Management</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8">
                    <Building2 className="w-8 h-8 text-cyan-500 mb-4" />
                    <h3 className="text-xl font-black text-white uppercase mb-2">{activeCompany?.name}</h3>
                    <p className="text-slate-500 text-sm mb-4">
                        {activeCompany?.is_sandbox ? 'Sandbox Mode - Unlimited Resources' : 'Career Mode'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-[10px] text-slate-600 uppercase">Founded</div>
                            <div className="text-white font-mono">Year {activeCompany?.year || 2024}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-600 uppercase">Week</div>
                            <div className="text-white font-mono">W{activeCompany?.week || 1}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8">
                    <Users className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="text-xl font-black text-white uppercase mb-2">Workforce</h3>
                    <p className="text-slate-500 text-sm mb-4">Employee management coming soon...</p>
                </div>
            </div>

            <div className="glass-panel p-10 border-dashed border-white/10 bg-transparent text-center">
                <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-600 uppercase mb-2">More Features Coming</h3>
                <p className="text-slate-700 text-sm">Hiring, partnerships, acquisitions, and more...</p>
            </div>
        </div>
    );
};

export default BusinessPanel;
