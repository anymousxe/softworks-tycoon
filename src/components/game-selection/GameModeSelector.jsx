import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Gamepad2, Sparkles, ChevronRight, Zap, Users, Trophy, Star } from 'lucide-react';

const GameModeSelector = () => {
    const navigate = useNavigate();

    const gameModes = [
        {
            id: 'ai-tycoon',
            title: 'AI Company Tycoon',
            subtitle: 'Build the next frontier of artificial intelligence',
            description: 'Train AI models, compete with tech giants, and dominate the leaderboard. Manage parameters, hire researchers, and avoid lawsuits from your training data.',
            icon: Cpu,
            color: 'cyan',
            gradient: 'from-cyan-500 to-blue-600',
            features: ['Train AI Models', 'Compete on Leaderboard', 'Hire Engineers', 'Release APIs'],
            route: '/ai-tycoon'
        },
        {
            id: 'game-dev',
            title: 'Game Dev Tycoon',
            subtitle: 'Create games that define generations',
            description: 'Choose your engine, build your studio, and create games from indie gems to AAA blockbusters. Publish on Mist, trend on Z, and win Game of the Year.',
            icon: Gamepad2,
            color: 'purple',
            gradient: 'from-purple-500 to-pink-600',
            features: ['Unity/Godot/Unreal', 'Publish on Mist', 'Win Awards', 'Build Your Studio'],
            route: '/game-dev'
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Header */}
            <div className="text-center mb-16 animate-in relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-tighter uppercase">
                        Softworks
                    </h1>
                    <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">
                    Choose Your Empire
                </p>
            </div>

            {/* Game Mode Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full relative z-10">
                {gameModes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => navigate(mode.route)}
                        className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-left transition-all duration-500 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <mode.icon className="w-10 h-10 text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                            {mode.title}
                        </h2>
                        <p className={`text-${mode.color}-400 text-sm font-bold uppercase tracking-wider mb-4`}>
                            {mode.subtitle}
                        </p>

                        {/* Description */}
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {mode.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {mode.features.map((feature, i) => (
                                <span
                                    key={i}
                                    className={`px-3 py-1 rounded-full text-xs font-bold bg-${mode.color}-500/10 text-${mode.color}-400 border border-${mode.color}-500/20`}
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>

                        {/* Play Button */}
                        <div className={`flex items-center gap-2 text-${mode.color}-400 font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all`}>
                            <span>Play Now</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>

                        {/* Corner Accent */}
                        <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${mode.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                    </button>
                ))}
            </div>

            {/* Stats Banner */}
            <div className="mt-16 flex items-center gap-12 text-center relative z-10">
                <div>
                    <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-2xl font-black">2</span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">Game Modes</span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                    <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-2xl font-black">∞</span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">Possibilities</span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                    <div className="flex items-center justify-center gap-2 text-pink-400 mb-1">
                        <Star className="w-4 h-4" />
                        <span className="text-2xl font-black">$1T</span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">Max Valuation</span>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-center text-slate-700 text-[10px] font-mono uppercase tracking-widest">
                Made by anymousxe • v3.0.0
            </div>
        </div>
    );
};

export default GameModeSelector;
