import React from 'react';
import { FlaskConical, Lock, Check, Zap } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import { RESEARCH } from '../../data/constants';
import { toast } from 'react-hot-toast';

const LabPanel = () => {
    const { activeCompany, updateCompany } = useGameStore();
    const researchPts = activeCompany?.research_pts || 0;
    const unlockedTech = activeCompany?.unlocked_tech || [];

    const handleResearch = (tech) => {
        if (researchPts < tech.cost) {
            return toast.error('Insufficient research points');
        }
        if (unlockedTech.includes(tech.id)) {
            return toast.error('Already unlocked');
        }

        updateCompany({
            research_pts: researchPts - tech.cost,
            unlocked_tech: [...unlockedTech, tech.id]
        });
        toast.success(`${tech.name} unlocked!`, { icon: '🔬' });
    };

    return (
        <div className="animate-in space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Research Lab</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-10 bg-cyan-500"></div>
                        <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Technology Tree</p>
                    </div>
                </div>
                <div className="glass-panel px-6 py-4 flex items-center gap-4">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest">Research Points</div>
                        <div className="text-purple-400 font-black text-xl">{researchPts}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RESEARCH.map((tech) => {
                    const isUnlocked = unlockedTech.includes(tech.id);
                    const canAfford = researchPts >= tech.cost;

                    return (
                        <div key={tech.id} className={`glass-panel p-6 ${isUnlocked ? 'border-green-500/30 bg-green-500/5' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-slate-400'}`}>
                                    {isUnlocked ? <Check className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                </div>
                                <div className="text-purple-400 font-mono text-sm font-bold">{tech.cost} PTS</div>
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{tech.name}</h3>
                            <p className="text-slate-500 text-xs mb-4">{tech.desc}</p>
                            <button
                                onClick={() => handleResearch(tech)}
                                disabled={isUnlocked || !canAfford}
                                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isUnlocked
                                        ? 'bg-green-500/20 text-green-500 cursor-default'
                                        : canAfford
                                            ? 'bg-purple-600 text-white hover:bg-purple-500'
                                            : 'bg-white/5 text-slate-600 cursor-not-allowed'
                                    }`}
                            >
                                {isUnlocked ? 'UNLOCKED' : 'RESEARCH'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LabPanel;
