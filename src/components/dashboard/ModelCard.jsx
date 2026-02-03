import React from 'react';
import { Cpu, Users, Zap, TrendingUp, MoreVertical, Globe, Lock } from 'lucide-react';

const ModelCard = ({ model }) => {
    const isDevelopment = !model.released && !model.is_staged;
    const isStaged = model.is_staged;
    const isLive = model.released;

    return (
        <div className={`glass-panel p-6 border-white/5 hover:border-white/10 transition-all group relative overflow-hidden flex flex-col justify-between h-80 ${isDevelopment ? 'bg-slate-900/30' :
                isStaged ? 'bg-cyan-500/5' :
                    'bg-slate-900/60'
            }`}>

            {/* Background Status Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40 pointer-events-none ${isDevelopment ? 'bg-slate-500' :
                    isStaged ? 'bg-yellow-500' :
                        'bg-cyan-500'
                }`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${isDevelopment ? 'bg-slate-800 border-white/5 text-slate-500' :
                                isStaged ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                    'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                            }`}>
                            {model.type === 'image' ? <Zap className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">{model.name}</h3>
                            <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase truncate max-w-[120px]">
                                ID: {model.id.substring(0, 8)} // V{model.version}
                            </div>
                        </div>
                    </div>
                    <button className="text-slate-600 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {isDevelopment && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                <span>Neural Syncing</span>
                                <span>{50}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                                <div className="h-full bg-slate-600 rounded-full w-1/2 animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
                            </div>
                            <div className="text-[10px] text-slate-600 font-mono uppercase tracking-tighter">
                                Estimated Time: {model.weeks_left} Weeks
                            </div>
                        </div>
                    )}

                    {isStaged && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
                            <div className="text-[9px] text-yellow-500 font-black uppercase tracking-widest mb-1">Architecture Finalized</div>
                            <div className="text-[10px] text-white/80 font-mono leading-relaxed">
                                Ready for deployment to public infrastructure.
                            </div>
                        </div>
                    )}

                    {isLive && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Weekly Gross</div>
                                <div className="text-green-400 font-bold text-sm tracking-tight">${model.revenue.toLocaleString()}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Hype Level</div>
                                <div className="text-purple-400 font-bold text-sm tracking-tight">+{model.hype}%</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 pt-6 flex gap-3">
                {isDevelopment && (
                    <button className="flex-1 bg-slate-800 text-slate-500 py-3 rounded-xl font-bold text-xs uppercase cursor-not-allowed">
                        TRAINING IN PROGRESS
                    </button>
                )}
                {isStaged && (
                    <button className="flex-1 btn-primary py-3 text-xs shadow-yellow-500/20">
                        INITIALIZE LAUNCH
                    </button>
                )}
                {isLive && (
                    <>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-bold text-xs uppercase transition-all">
                            MANAGE
                        </button>
                        <button className="flex-1 btn-primary py-3 text-xs">
                            PROMOTE
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModelCard;
