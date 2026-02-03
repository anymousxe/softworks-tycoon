import React from 'react';
import { Swords, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RIVALS_LIST } from '../../data/constants';

const RivalsPanel = () => {
    return (
        <div className="animate-in space-y-10">
            <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Competitors</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Market Intelligence</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RIVALS_LIST.map((rival, i) => (
                    <div key={i} className="glass-panel p-6 hover:bg-white/5 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className={`text-xl font-black uppercase tracking-tight ${rival.color}`}>{rival.name}</h3>
                            <div className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-400 font-mono">
                                {rival.strength}% STR
                            </div>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 mb-4">
                            <div
                                className={`h-2 rounded-full ${rival.color.replace('text-', 'bg-')}`}
                                style={{ width: `${rival.strength}%` }}
                            ></div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase">
                            {rival.strength > 90 ? (
                                <><TrendingUp className="w-3 h-3 text-red-500" /> Major Threat</>
                            ) : rival.strength > 75 ? (
                                <><Minus className="w-3 h-3 text-yellow-500" /> Competitive</>
                            ) : (
                                <><TrendingDown className="w-3 h-3 text-green-500" /> Catchable</>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RivalsPanel;
