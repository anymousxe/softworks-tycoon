import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Sparkles, Check } from 'lucide-react';
import useGameDevStore, { ENGINES } from '../../store/gameDevStore';

const StudioSetup = () => {
    const navigate = useNavigate();
    const { character, createStudio } = useGameDevStore();

    const [studioName, setStudioName] = useState('');
    const [selectedEngine, setSelectedEngine] = useState('unity');

    const handleCreate = () => {
        if (!studioName) return;
        createStudio({
            name: studioName,
            engine: selectedEngine
        });
        navigate('/game-dev/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">
                        Welcome, {character?.firstName || 'Developer'}
                    </span>
                    <Sparkles className="w-5 h-5 text-pink-400" />
                </div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-tight">
                    Found Your Studio
                </h1>
                <p className="text-slate-500 text-sm mt-2">Choose a name and your primary game engine</p>
            </div>

            <div className="max-w-2xl w-full space-y-8 relative z-10">
                {/* Studio Name */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Building2 className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-bold text-white">Studio Name</h3>
                    </div>
                    <input
                        type="text"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-purple-500"
                        placeholder="Enter your studio name..."
                    />
                    <p className="text-slate-600 text-xs mt-2">This is how players will see your company</p>
                </div>

                {/* Engine Selection */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Choose Your Engine</h3>
                    <div className="space-y-4">
                        {ENGINES.map(engine => (
                            <button
                                key={engine.id}
                                onClick={() => setSelectedEngine(engine.id)}
                                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-start gap-4 text-left ${selectedEngine === engine.id
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-white/5 bg-slate-800/30 hover:border-white/20'
                                    }`}
                            >
                                <div className="text-4xl">{engine.icon}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-bold text-white">{engine.name}</h4>
                                        {selectedEngine === engine.id && (
                                            <Check className="w-5 h-5 text-purple-400" />
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2">{engine.desc}</p>
                                    <div className="flex gap-4 text-xs">
                                        <span className={`${engine.cost === 0 ? 'text-green-400' : engine.costType === 'royalty' ? 'text-yellow-400' : 'text-orange-400'}`}>
                                            {engine.cost === 0 ? '🆓 Free' : engine.costType === 'royalty' ? `💰 ${engine.cost}% Royalty` : `💵 $${engine.cost}/yr`}
                                        </span>
                                        <span className="text-slate-500">
                                            Difficulty: <span className={engine.difficulty === 'easy' ? 'text-green-400' : engine.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                                                {engine.difficulty}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {engine.pros.map((pro, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                                                ✓ {pro}
                                            </span>
                                        ))}
                                        {engine.cons.map((con, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full">
                                                ✗ {con}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Create Button */}
                <button
                    onClick={handleCreate}
                    disabled={!studioName}
                    className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-wider"
                >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default StudioSetup;
