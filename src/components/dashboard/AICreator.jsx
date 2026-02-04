import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { MODEL_TYPES, VARIANT_TYPES, PARAMETER_TIERS, OPEN_SOURCE_LICENSES } from '../../data/models';
import { TRAINING_DATA_SOURCES } from '../../data/constants';
import { Cpu, Zap, Star, Shield, Lock, Info, Check, ArrowRight, ArrowLeft, Play, Database, Clock, AlertTriangle, GitBranch, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AICreator = ({ onFinish }) => {
    const { activeCompany, createModel, startTraining, createVariant } = useGameStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Model creation state
    const [selectedType, setSelectedType] = useState(null);
    const [selectedMode, setSelectedMode] = useState(null);
    const [name, setName] = useState('');
    const [isOpenSource, setIsOpenSource] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState('proprietary');
    const [disclosedParams, setDisclosedParams] = useState(true);

    // Training config state
    const [selectedDataSources, setSelectedDataSources] = useState([]);
    const [trainingWeeks, setTrainingWeeks] = useState(4);
    const [computeAllocation, setComputeAllocation] = useState(50);

    // Calculate training cost
    const weeklyCost = selectedDataSources.reduce((acc, sourceId) => {
        const paidSource = TRAINING_DATA_SOURCES.paid.find(s => s.id === sourceId);
        return acc + (paidSource?.costPerWeek || 0);
    }, 0);
    const totalTrainingCost = weeklyCost * trainingWeeks;

    // Calculate lawsuit risk
    const lawsuitRisk = selectedDataSources.reduce((acc, sourceId) => {
        const freeSource = TRAINING_DATA_SOURCES.free.find(s => s.id === sourceId);
        return Math.max(acc, freeSource?.risk || 0);
    }, 0);

    // Calculate data quality
    const dataQuality = selectedDataSources.length > 0
        ? Math.round(selectedDataSources.reduce((acc, sourceId) => {
            const freeSource = TRAINING_DATA_SOURCES.free.find(s => s.id === sourceId);
            const paidSource = TRAINING_DATA_SOURCES.paid.find(s => s.id === sourceId);
            return acc + (freeSource?.quality || paidSource?.quality || 0);
        }, 0) / selectedDataSources.length)
        : 0;

    // Estimated parameters
    const computeValue = (activeCompany?.compute || 0) * (computeAllocation / 100);
    const estimatedParams = Math.floor(
        50000000 * (1 + computeValue * 0.001) * (1 + dataQuality * 0.01) * trainingWeeks
    );

    const toggleDataSource = (sourceId) => {
        if (selectedDataSources.includes(sourceId)) {
            setSelectedDataSources(selectedDataSources.filter(s => s !== sourceId));
        } else {
            setSelectedDataSources([...selectedDataSources, sourceId]);
        }
    };

    const handleCreateModel = async () => {
        if (!name.trim()) return toast.error('Enter a model name');
        if (!selectedType) return toast.error('Select a model type');
        if (!selectedMode) return toast.error('Select a model mode');

        setLoading(true);
        try {
            const model = await createModel({
                name: name.trim(),
                type: selectedType.id,
                mode: selectedMode.id,
                operational_cost: selectedType.operational_cost_per_week
            });

            if (model) {
                toast.success(`${name} created! Now configure training.`, { icon: '✨' });
                setStep(3); // Go to training config
            }
        } catch (error) {
            toast.error('Failed to create model');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTraining = async () => {
        if (selectedDataSources.length === 0) {
            return toast.error('Select at least one data source');
        }
        if (trainingWeeks < 1) {
            return toast.error('Training must be at least 1 week');
        }
        if (totalTrainingCost > activeCompany.cash) {
            return toast.error('Insufficient funds for training');
        }

        setLoading(true);
        try {
            // Find the model we just created
            const latestModel = activeCompany.models[activeCompany.models.length - 1];

            await startTraining(latestModel.id, {
                dataSources: selectedDataSources,
                weeks: trainingWeeks,
                computeAllocation: computeAllocation
            });

            toast.success(`Training started! ${trainingWeeks} weeks to completion.`, { icon: '🚀' });
            onFinish();
        } catch (error) {
            toast.error('Failed to start training');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Architecture Selection';
            case 2: return 'Model Configuration';
            case 3: return 'Training Setup';
            default: return 'Neural Synthesis';
        }
    };

    return (
        <div className="animate-in max-w-5xl mx-auto space-y-10 mb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Create AI Model</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">
                        Phase {step}: {getStepTitle()}
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-600'
                            }`}>
                            {step > s ? <Check className="w-5 h-5" /> : s}
                        </div>
                        {s < 3 && <div className={`w-16 h-0.5 ${step > s ? 'bg-cyan-500' : 'bg-white/10'}`} />}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Step 1: Select Type */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in">
                            {MODEL_TYPES.filter(t => !t.reqTech || (activeCompany?.unlocked_tech || []).includes(t.reqTech)).map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setSelectedType(type);
                                        setSelectedMode(null);
                                    }}
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
                                        {['custom', 'agi', 'multimodal', 'embedding', 'agent'].includes(type.id) && <Lock className="w-6 h-6" />}
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{type.name}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed mb-4">{type.desc}</p>
                                    <div className="text-[9px] text-slate-600 font-mono uppercase">
                                        {type.modes?.length || 0} Modes Available
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Configure Model */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in">
                            {/* Model Name */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Model Name</label>
                                <input
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/5 p-6 rounded-2xl text-2xl font-black uppercase tracking-tighter text-white outline-none focus:border-cyan-500 transition-all"
                                    placeholder="e.g. TITAN-7B"
                                />
                            </div>

                            {/* Mode Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Model Mode</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {selectedType?.modes?.map(mode => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode)}
                                            className={`p-4 rounded-xl text-left transition-all ${selectedMode?.id === mode.id
                                                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                                                    : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-bold text-sm mb-1">{mode.name}</div>
                                            <div className="text-[10px] text-slate-500">{mode.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Open Source Toggle */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Distribution</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsOpenSource(false)}
                                        className={`flex-1 p-4 rounded-xl flex items-center gap-3 transition-all ${!isOpenSource ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-white/5 border border-white/5'
                                            }`}
                                    >
                                        <Lock className={`w-5 h-5 ${!isOpenSource ? 'text-cyan-400' : 'text-slate-500'}`} />
                                        <div className="text-left">
                                            <div className={`font-bold text-sm ${!isOpenSource ? 'text-white' : 'text-slate-400'}`}>Proprietary</div>
                                            <div className="text-[10px] text-slate-500">Maximum revenue</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setIsOpenSource(true)}
                                        className={`flex-1 p-4 rounded-xl flex items-center gap-3 transition-all ${isOpenSource ? 'bg-green-500/20 border border-green-500/40' : 'bg-white/5 border border-white/5'
                                            }`}
                                    >
                                        <Globe className={`w-5 h-5 ${isOpenSource ? 'text-green-400' : 'text-slate-500'}`} />
                                        <div className="text-left">
                                            <div className={`font-bold text-sm ${isOpenSource ? 'text-white' : 'text-slate-400'}`}>Open Source</div>
                                            <div className="text-[10px] text-slate-500">Maximum hype</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Parameter Disclosure */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Parameter Disclosure</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDisclosedParams(true)}
                                        className={`flex-1 p-4 rounded-xl transition-all ${disclosedParams ? 'bg-white/10 border border-white/20' : 'bg-white/5 border border-white/5'
                                            }`}
                                    >
                                        <div className={`font-bold text-sm mb-1 ${disclosedParams ? 'text-white' : 'text-slate-400'}`}>Exact Count</div>
                                        <div className="text-[10px] text-slate-500">e.g. "70.6B parameters"</div>
                                    </button>
                                    <button
                                        onClick={() => setDisclosedParams(false)}
                                        className={`flex-1 p-4 rounded-xl transition-all ${!disclosedParams ? 'bg-white/10 border border-white/20' : 'bg-white/5 border border-white/5'
                                            }`}
                                    >
                                        <div className={`font-bold text-sm mb-1 ${!disclosedParams ? 'text-white' : 'text-slate-400'}`}>Range Only</div>
                                        <div className="text-[10px] text-slate-500">e.g. "20-70B class"</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Training Setup */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in">
                            {/* Free Data Sources */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Free Data Sources</label>
                                    <span className="text-[9px] text-yellow-500 font-bold px-2 py-0.5 bg-yellow-500/10 rounded">LAWSUIT RISK</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TRAINING_DATA_SOURCES.free.map(source => {
                                        const isSelected = selectedDataSources.includes(source.id);
                                        return (
                                            <button
                                                key={source.id}
                                                onClick={() => toggleDataSource(source.id)}
                                                className={`p-4 rounded-xl text-left transition-all border ${isSelected
                                                        ? 'bg-yellow-500/10 border-yellow-500/30'
                                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>{source.name}</div>
                                                    {source.risk > 30 && <AlertTriangle className="w-4 h-4 text-red-400" />}
                                                </div>
                                                <div className="text-[10px] text-slate-500 mb-2">{source.desc}</div>
                                                <div className="flex justify-between text-[9px]">
                                                    <span className="text-green-400">Quality: {source.quality}%</span>
                                                    <span className={source.risk > 20 ? 'text-red-400' : 'text-yellow-400'}>
                                                        Risk: {source.risk}%
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Paid Data Sources */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Licensed Data</label>
                                    <span className="text-[9px] text-green-500 font-bold px-2 py-0.5 bg-green-500/10 rounded">SAFE</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TRAINING_DATA_SOURCES.paid.slice(0, 8).map(source => {
                                        const isSelected = selectedDataSources.includes(source.id);
                                        return (
                                            <button
                                                key={source.id}
                                                onClick={() => toggleDataSource(source.id)}
                                                className={`p-4 rounded-xl text-left transition-all border ${isSelected
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>{source.name}</div>
                                                    <Database className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div className="text-[10px] text-slate-500 mb-2">{source.desc}</div>
                                                <div className="flex justify-between text-[9px]">
                                                    <span className="text-green-400">Quality: {source.quality}%</span>
                                                    <span className="text-cyan-400">${source.costPerWeek.toLocaleString()}/wk</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Training Duration */}
                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Training Duration</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="52"
                                        value={trainingWeeks}
                                        onChange={(e) => setTrainingWeeks(parseInt(e.target.value))}
                                        className="flex-1 accent-cyan-500"
                                    />
                                    <div className="text-xl font-black text-white w-24 text-right">{trainingWeeks} weeks</div>
                                </div>
                            </div>

                            {/* Compute Allocation */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Compute Allocation</label>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        Available: {activeCompany?.compute || 0} units
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={computeAllocation}
                                        onChange={(e) => setComputeAllocation(parseInt(e.target.value))}
                                        className="flex-1 accent-purple-500"
                                    />
                                    <div className="text-xl font-black text-purple-400 w-24 text-right">{computeAllocation}%</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Panel */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-8 sticky top-32 space-y-8 bg-slate-900/60 border-cyan-500/10">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                                <Cpu className="w-8 h-8 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase text-xl leading-none">
                                    {step === 3 ? 'Training Config' : 'Model Spec'}
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                                    {step === 1 ? 'Select Type' : step === 2 ? 'Configure' : 'Train'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Model Type</span>
                                <span className="text-white font-mono">{selectedType?.name || '---'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Mode</span>
                                <span className="text-white font-mono">{selectedMode?.name || '---'}</span>
                            </div>
                            {step === 3 && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Data Quality</span>
                                        <span className="text-green-400 font-mono font-bold">{dataQuality}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Lawsuit Risk</span>
                                        <span className={`font-mono font-bold ${lawsuitRisk > 30 ? 'text-red-400' : lawsuitRisk > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {lawsuitRisk}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Est. Parameters</span>
                                        <span className="text-purple-400 font-mono font-bold">
                                            {estimatedParams >= 1000000000
                                                ? `${(estimatedParams / 1000000000).toFixed(1)}B`
                                                : `${(estimatedParams / 1000000).toFixed(0)}M`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Training Cost</span>
                                        <span className="text-green-400 font-black text-xl tracking-tighter">
                                            ${totalTrainingCost.toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {lawsuitRisk > 30 && step === 3 && (
                            <div className="bg-red-500/10 p-4 rounded-xl flex items-center gap-3 border border-red-500/20">
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-[10px] text-red-400 font-bold uppercase leading-relaxed">
                                    HIGH LAWSUIT RISK! Consider using licensed data.
                                </p>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                                <Info className="w-4 h-4 text-cyan-500 shrink-0" />
                                <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                    MODEL CREATION IS FREE. TRAINING COSTS MONEY.
                                </p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-2">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    disabled={loading || step === 3}
                                    className="p-4 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors border border-white/5 disabled:opacity-30"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}

                            {step === 1 && (
                                <button
                                    disabled={!selectedType}
                                    onClick={() => setStep(2)}
                                    className="flex-1 btn-primary flex items-center justify-center gap-2 group py-4 disabled:opacity-20"
                                >
                                    SELECT MODE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}

                            {step === 2 && (
                                <button
                                    disabled={!name.trim() || !selectedMode || loading}
                                    onClick={handleCreateModel}
                                    className="flex-1 btn-primary flex items-center justify-center gap-2 group py-4 disabled:opacity-20"
                                >
                                    {loading ? 'CREATING...' : 'CREATE MODEL'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}

                            {step === 3 && (
                                <button
                                    disabled={selectedDataSources.length === 0 || loading || totalTrainingCost > activeCompany.cash}
                                    onClick={handleStartTraining}
                                    className="flex-1 btn-primary flex items-center justify-center gap-2 group py-4 disabled:opacity-20"
                                >
                                    {loading ? 'STARTING...' : 'START TRAINING'}
                                    <Play className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AICreator;
