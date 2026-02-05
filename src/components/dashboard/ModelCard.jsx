import React, { useState } from 'react';
import { Cpu, Users, Zap, TrendingUp, MoreVertical, Globe, Lock, ChevronDown, Play, Pause, GitBranch, Eye, EyeOff, Settings } from 'lucide-react';
import useGameStore, { formatParameters } from '../../store/gameStore';
import { VARIANT_TYPES, PARAMETER_TIERS } from '../../data/models';
import { toast } from 'react-hot-toast';

const ModelCard = ({ model }) => {
    const { releaseModel, createVariant, toggleParamDisclosure, setModelOpenSource } = useGameStore();
    const [showVariantMenu, setShowVariantMenu] = useState(false); // ... existing state

    // ... existing logic ...

    return (
        <div className={`glass-panel p-6 border-white/5 hover:border-white/10 transition-all group relative flex flex-col justify-between min-h-[320px] ${isCreated ? 'bg-slate-900/20' :
            isTraining ? 'bg-purple-500/5' :
                isTrained ? 'bg-yellow-500/5' :
                    'bg-slate-900/60'
            }`}>
            {/* Background Status Glow - Wrapped in overflow-hidden container to prevent spill but allow popups */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40 pointer-events-none ${isCreated ? 'bg-slate-500' :
                    isTraining ? 'bg-purple-500' :
                        isTrained ? 'bg-yellow-500' :
                            'bg-cyan-500'
                    }`}></div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    {/* ... (Header Content Unchanged) ... */}
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${isCreated ? 'bg-slate-800 border-white/5 text-slate-500' :
                            isTraining ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                isTrained ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                    'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                            }`}>
                            {model.type === 'image' ? <Zap className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tighter uppercase leading-none mb-1">{model.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-500 font-mono uppercase">V{model.version}</span>
                                {model.is_open_source && (
                                    <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">OPEN</span>
                                )}
                                {model.variant !== 'base' && (
                                    <span className="text-[8px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                        {model.customVariant || model.variant}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* ... (Options Menu Unchanged) ... */}
                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="text-slate-600 hover:text-white transition-colors p-1"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        {showOptions && (
                            <div className="absolute right-0 top-8 bg-slate-900 border border-white/10 rounded-xl p-2 z-20 w-48 shadow-xl">
                                <button
                                    onClick={() => toggleParamDisclosure(model.id)}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                                >
                                    {model.disclosed_params ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {model.disclosed_params ? 'Hide Params' : 'Show Params'}
                                </button>
                                {isReleased && (
                                    <button
                                        onClick={() => setModelOpenSource(model.id, !model.is_open_source, 'apache')}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                                    >
                                        <Globe className="w-4 h-4" />
                                        {model.is_open_source ? 'Make Proprietary' : 'Open Source'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {/* ... (Status Badge & Stats Unchanged) ... */}
                    {/* Status Badge */}
                    <div className={`inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isCreated ? 'bg-slate-800 text-slate-400' :
                        isTraining ? 'bg-purple-500/20 text-purple-400' :
                            isTrained ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-cyan-500/20 text-cyan-400'
                        }`}>
                        {model.status}
                    </div>

                    {/* Created State */}
                    {isCreated && (
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="text-[10px] text-slate-500 mb-1">Awaiting training configuration</div>
                            <div className="text-[9px] text-slate-600">Mode: {model.mode}</div>
                        </div>
                    )}

                    {/* Training Progress */}
                    {isTraining && (
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                <span>Training Progress</span>
                                <span>{trainingProgress}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                                    style={{ width: `${trainingProgress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[9px]">
                                <span className="text-slate-600 font-mono">
                                    Week {model.training_weeks_completed}/{model.training_weeks_total}
                                </span>
                                <span className={`font-bold ${parameterTier?.color || 'text-slate-400'}`}>
                                    {displayParams} params
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Trained State */}
                    {isTrained && (
                        <div className="space-y-3">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
                                <div className="text-[9px] text-yellow-500 font-black uppercase tracking-widest mb-1">Training Complete</div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] text-white/80 font-mono">
                                        {displayParams} parameters
                                    </span>
                                    <span className="text-[10px] text-green-400 font-bold">
                                        Quality: {model.quality}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Released State */}
                    {isReleased && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Parameters</div>
                                    <div className={`font-bold text-sm tracking-tight ${parameterTier?.color || 'text-white'}`}>
                                        {displayParams}
                                    </div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Weekly Rev</div>
                                    <div className="text-green-400 font-bold text-sm tracking-tight">
                                        ${(model.revenue || 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-500 px-1">
                                <span>Quality: <span className="text-white font-bold">{model.quality}%</span></span>
                                <span>Hype: <span className="text-purple-400 font-bold">+{model.hype || 0}</span></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 pt-4 flex gap-2">
                {isCreated && (
                    <button className="flex-1 bg-slate-800 text-slate-500 py-3 rounded-xl font-bold text-xs uppercase cursor-not-allowed">
                        Configure Training
                    </button>
                )}

                {isTraining && (
                    <button className="flex-1 bg-purple-500/20 text-purple-400 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        Training...
                    </button>
                )}

                {isTrained && (
                    <button
                        onClick={handleRelease}
                        className="flex-1 btn-primary py-3 text-xs"
                    >
                        RELEASE MODEL
                    </button>
                )}

                {isReleased && (
                    <>
                        <button
                            onClick={() => toast('Management console coming soon', { icon: '🚧' })}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-bold text-xs uppercase transition-all"
                        >
                            MANAGE
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowVariantMenu(!showVariantMenu)}
                                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 py-3 px-4 rounded-xl font-bold text-xs uppercase transition-all flex items-center gap-2"
                            >
                                <GitBranch className="w-4 h-4" />
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            {showVariantMenu && (
                                <div className="absolute right-0 bottom-14 bg-slate-900 border border-white/10 rounded-xl p-3 z-50 w-64 shadow-2xl">
                                    <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Create Variant</div>

                                    {/* Preset Variants */}
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {VARIANT_TYPES.filter(v => v.id !== 'base' && v.id !== 'custom').slice(0, 6).map(variant => (
                                            <button
                                                key={variant.id}
                                                onClick={() => handleCreateVariant(variant.id)}
                                                className="text-left px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                            >
                                                <div className="text-white font-bold">{variant.name}</div>
                                                <div className="text-[9px] text-slate-500">{variant.desc}</div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Variant */}
                                    <div className="border-t border-white/5 pt-3">
                                        <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Custom Variant</div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={customVariantName}
                                                onChange={(e) => setCustomVariantName(e.target.value)}
                                                placeholder="e.g. Ultra Super"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                                            />
                                            <button
                                                onClick={() => customVariantName.trim() && handleCreateVariant('custom', customVariantName.trim())}
                                                disabled={!customVariantName.trim()}
                                                className="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-30"
                                            >
                                                GO
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModelCard;
