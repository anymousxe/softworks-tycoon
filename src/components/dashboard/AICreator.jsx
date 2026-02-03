import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { MODEL_TYPES, VARIANT_TYPES } from '../../data/models';
import { TRAITS, CAPABILITIES } from '../../data/constants';
import { Cpu, Zap, Star, Shield, Lock, Info, Check, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const AICreator = ({ onFinish }) => {
    const { activeCompany, selectCompany } = useGameStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Selection State
    const [selectedType, setSelectedType] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(VARIANT_TYPES.find(v => v.id === 'pro'));
    const [name, setName] = useState('');
    const [selectedTraits, setSelectedTraits] = useState([]);
    const [selectedCapabilities, setSelectedCapabilities] = useState([]);

    const totalCost = selectedType
        ? Math.floor((selectedType.cost * selectedVariant.costMult) +
            selectedTraits.reduce((acc, t) => acc + (selectedType.cost * (t.multCost - 1)), 0) +
            selectedCapabilities.reduce((acc, c) => acc + c.cost, 0))
        : 0;

    const totalTime = selectedType
        ? Math.floor((selectedType.time * selectedVariant.qualityMult) +
            selectedTraits.reduce((acc, t) => acc + (selectedType.time * (t.multTime - 1)), 0) +
            selectedCapabilities.reduce((acc, c) => acc + c.time, 0))
        : 0;

    const handleCreate = async () => {
        if (!name.trim()) return toast.error('Enter a project codename');
        if (activeCompany.cash < totalCost) return toast.error('Insufficient corporate funds');

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('models')
                .insert([{
                    company_id: activeCompany.id,
                    name,
                    type: selectedType.id,
                    version: 1.0,
                    quality: Math.floor(50 * selectedVariant.qualityMult),
                    weeks_left: totalTime,
                    description: name,
                    capabilities: selectedCapabilities,
                    api_config: { active: false, price: 0, limit: 100 }
                }])
                .select()
                .single();

            if (error) throw error;

            // Update cash
            await supabase
                .from('companies')
                .update({ cash: activeCompany.cash - totalCost })
                .eq('id', activeCompany.id);

            // Refresh data
            await selectCompany(activeCompany.id);

            toast.success(`${name} initialized and moved to development sector!`, { icon: '🚀' });
            onFinish();
        } catch (error) {
            toast.error('Synthesis failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in max-w-5xl mx-auto space-y-10 mb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Neural Synthesis</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Phase {step}: {step === 1 ? 'Architecture Selection' : 'Optimization'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {step === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MODEL_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type)}
                                    className={`glass-panel p-6 text-left group transition-all relative overflow-hidden ${selectedType?.id === type.id
                                            ? 'border-cyan-500 bg-cyan-500/5'
                                            : 'border-white/5 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-6 transition-colors ${selectedType?.id === type.id ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-slate-500'
                                        }`}>
                                        {type.id === 'text' && <Cpu className="w-6 h-6" />}
                                        {type.id === 'image' && <Zap className="w-6 h-6" />}
                                        {type.id === 'video' && <Star className="w-6 h-6" />}
                                        {type.id === 'audio' && <Shield className="w-6 h-6" />}
                                        {['custom', 'agi'].includes(type.id) && <Lock className="w-6 h-6" />}
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{type.name}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed mb-6">{type.desc}</p>
                                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                        <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Base Cost</div>
                                        <div className="text-white font-mono font-bold">${type.cost.toLocaleString()}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in translate-y-2">
                            {/* Project Identity */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Project Codename</label>
                                <input
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/5 p-6 rounded-2xl text-2xl font-black uppercase tracking-tighter text-white outline-none focus:border-cyan-500 transition-all"
                                    placeholder="e.g. PROJECT-GENESIS"
                                />
                            </div>

                            {/* Variant Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Model Variant</label>
                                <div className="flex flex-wrap gap-2">
                                    {VARIANT_TYPES.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all flex items-center gap-2 ${selectedVariant.id === v.id
                                                    ? 'bg-white text-black underline-offset-4'
                                                    : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                                }`}
                                        >
                                            {selectedVariant.id === v.id && <Check className="w-4 h-4" />}
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Traits (Selection logic) */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Neural Traits (Max 2)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {TRAITS.map(trait => {
                                        const isSelected = selectedTraits.find(t => t.id === trait.id);
                                        return (
                                            <button
                                                key={trait.id}
                                                onClick={() => {
                                                    if (isSelected) setSelectedTraits(selectedTraits.filter(t => t.id !== trait.id));
                                                    else if (selectedTraits.length < 2) setSelectedTraits([...selectedTraits, trait]);
                                                    else toast.error('Max 2 traits per model');
                                                }}
                                                className={`glass-panel p-5 text-left border-white/5 transition-all flex items-start gap-4 ${isSelected ? 'bg-cyan-500/10 border-cyan-500/30' : 'hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-slate-800'}`}>
                                                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                                                </div>
                                                <div>
                                                    <div className={`font-black uppercase text-xs tracking-wider ${isSelected ? 'text-white' : 'text-slate-400'}`}>{trait.name}</div>
                                                    <div className="text-[9px] text-slate-600 mt-1 leading-relaxed">{trait.desc}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info / Checkout Panel */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-8 sticky top-32 space-y-8 bg-slate-900/60 border-cyan-500/10">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                                <FlaskConical className="w-8 h-8 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase text-xl leading-none">Bill of Materials</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Pre-synthesis Report</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Model Base</span>
                                <span className="text-white font-mono">{selectedType?.name || '---'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Optimization</span>
                                <span className="text-white font-mono uppercase">{selectedVariant.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Est. Dev Time</span>
                                <span className="text-purple-400 font-mono font-bold underline decoration-purple-500/30">{totalTime} Weeks</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Total Requisition</span>
                                <span className="text-green-400 font-black text-xl tracking-tighter ">${totalCost.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                            <Info className="w-4 h-4 text-cyan-500 shrink-0" />
                            <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                RESOURCES WILL BE DEDUCTED UPON PROJECT INITIALIZATION. CANCELING LATER RESULTS IN <span className="text-red-400 text-[10px]">50% SURCHARGE</span>.
                            </p>
                        </div>

                        {step === 1 ? (
                            <button
                                disabled={!selectedType}
                                onClick={() => setStep(2)}
                                className="w-full btn-primary flex items-center justify-center gap-2 group py-4 disabled:opacity-20"
                            >
                                PROCEED TO OPTIMIZATION <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    className="p-4 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors border border-white/5"
                                >
                                    BACK
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="flex-1 btn-primary py-4"
                                >
                                    {loading ? 'SYNTHESIZING...' : 'INITIALIZE PROJECT'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

import { FlaskConical } from 'lucide-react';

export default AICreator;
