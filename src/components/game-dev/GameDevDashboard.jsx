import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, Gamepad2, Building2, Users, TrendingUp, Settings, LogOut,
    Trophy, DollarSign, Calendar, Clock, Play, Pause, FastForward,
    Plus, Star, MessageCircle, Video, Sparkles, ChevronRight
} from 'lucide-react';
import useGameDevStore, { GENRES, GAME_SCOPES, ENGINES, PUBLISHERS } from '../../store/gameDevStore';
import useAuthStore from '../../store/authStore';
import MistPanel from './MistPanel';
import SocialPanel from './SocialPanel';

// Character Avatar Component (CSS-based sprite)
const CharacterAvatar = ({ character, size = 'md' }) => {
    const sizes = {
        sm: { head: 'w-8 h-10', body: 'w-10 h-6', eye: 'w-1 h-1' },
        md: { head: 'w-12 h-14', body: 'w-14 h-8', eye: 'w-1.5 h-1.5' },
        lg: { head: 'w-16 h-20', body: 'w-20 h-12', eye: 'w-2 h-2' }
    };
    const s = sizes[size];

    const getSkinColor = () => {
        const colors = {
            pale: '#FFEBD3', light: '#F5D0B9', medium: '#D4A574',
            tan: '#A67B5B', brown: '#8B5A2B', dark: '#5C4033'
        };
        return colors[character?.skinTone] || '#D4A574';
    };

    const getHairColor = () => {
        const colors = {
            black: '#1A1A1A', brown: '#4A3728', blonde: '#E6C86E',
            red: '#A52A2A', ginger: '#CD853F', gray: '#808080',
            white: '#F5F5F5', blue: '#4169E1', pink: '#FF69B4',
            purple: '#9932CC', green: '#32CD32'
        };
        return colors[character?.hairColor] || '#4A3728';
    };

    const getShirtColor = () => {
        const colors = {
            black: '#1A1A1A', white: '#F5F5F5', red: '#DC143C',
            blue: '#4169E1', green: '#228B22', yellow: '#FFD700',
            purple: '#9932CC', orange: '#FF8C00', pink: '#FF69B4', gray: '#696969'
        };
        return colors[character?.shirtColor] || '#4169E1';
    };

    const getEyeColor = () => {
        const colors = {
            blue: '#4A90D9', green: '#4CAF50', brown: '#8B4513',
            hazel: '#9E7E55', gray: '#708090', amber: '#FFBF00',
            violet: '#8A2BE2', black: '#1A1A1A'
        };
        return colors[character?.eyeColor] || '#4A90D9';
    };

    return (
        <div className="relative flex flex-col items-center">
            {/* Head */}
            <div
                className={`${s.head} rounded-full relative`}
                style={{ backgroundColor: getSkinColor() }}
            >
                {/* Hair */}
                {character?.hairStyle !== 'bald' && (
                    <div
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-[110%] h-[40%] rounded-t-full"
                        style={{ backgroundColor: getHairColor() }}
                    />
                )}
                {/* Eyes */}
                <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 flex gap-2">
                    <div className={`${s.eye} rounded-full`} style={{ backgroundColor: getEyeColor() }} />
                    <div className={`${s.eye} rounded-full`} style={{ backgroundColor: getEyeColor() }} />
                </div>
            </div>
            {/* Body */}
            <div
                className={`${s.body} rounded-t-xl -mt-1`}
                style={{ backgroundColor: getShirtColor() }}
            />
        </div>
    );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const { character, studio, logout: logoutGameDev } = useGameDevStore();
    const { logout: logoutAuth } = useAuthStore();

    const tabs = [
        { id: 'home', icon: Home, label: 'Dashboard' },
        { id: 'develop', icon: Gamepad2, label: 'Develop' },
        { id: 'studio', icon: Building2, label: 'Studio' },
        { id: 'mist', icon: () => <span className="text-lg">⚙️</span>, label: 'Mist Store' },
        { id: 'social', icon: MessageCircle, label: 'Social' },
        { id: 'finances', icon: DollarSign, label: 'Finances' },
        { id: 'awards', icon: Trophy, label: 'Awards' },
    ];

    const handleExit = () => {
        logoutGameDev();
        navigate('/select-mode');
    };

    return (
        <div className="w-20 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-6">
            {/* Character Avatar */}
            <div className="mb-8">
                <CharacterAvatar character={character} size="sm" />
            </div>

            {/* Nav Items */}
            <div className="flex-1 flex flex-col gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id
                            ? 'bg-purple-500 text-white'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        title={tab.label}
                    >
                        {typeof tab.icon === 'function' ? <tab.icon /> : <tab.icon className="w-5 h-5" />}
                    </button>
                ))}
            </div>

            {/* Settings & Exit */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => setActiveTab('settings')}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
                <button
                    onClick={handleExit}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    title="Exit"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// Top Bar
const TopBar = () => {
    const { character, studio, cash, currentYear, currentMonth, fame, advanceMonth } = useGameDevStore();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const characterAge = character ? character.startingAge + (currentYear - character.startingYear) : 0;

    return (
        <div className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
                <div>
                    <h2 className="text-lg font-bold text-white">{studio?.name || 'No Studio'}</h2>
                    <p className="text-xs text-slate-500">{character?.firstName} {character?.lastName}, Age {characterAge}</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Cash */}
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase">Cash</p>
                    <p className="text-lg font-black text-green-400">${cash.toLocaleString()}</p>
                </div>

                {/* Fame */}
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase">Fame</p>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-lg font-black text-yellow-400">{fame}</span>
                    </div>
                </div>

                {/* Date */}
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase">Date</p>
                    <p className="text-lg font-black text-purple-400">{monthNames[currentMonth - 1]} {currentYear}</p>
                </div>

                {/* Time Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={advanceMonth}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-bold text-sm flex items-center gap-2"
                    >
                        <FastForward className="w-4 h-4" />
                        Next Month
                    </button>
                </div>
            </div>
        </div>
    );
};

// Dashboard Home
const DashboardHome = ({ setActiveTab }) => {
    const { currentGame, releasedGames, studio, cash, fame, employees, currentYear, currentMonth } = useGameDevStore();

    const engine = ENGINES.find(e => e.id === studio?.engine);

    return (
        <div className="p-8 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <h1 className="text-3xl font-black text-white uppercase">Welcome to {studio?.name}</h1>
                </div>
                <p className="text-slate-400">
                    Your studio uses <span className="text-purple-400 font-bold">{engine?.name}</span>.
                    {currentGame ? ` Currently developing "${currentGame.name}".` : ' Start a new project to begin!'}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Games Released</p>
                    <p className="text-3xl font-black text-white">{releasedGames.length}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Team Size</p>
                    <p className="text-3xl font-black text-white">{employees.length + 1}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Total Revenue</p>
                    <p className="text-3xl font-black text-green-400">
                        ${releasedGames.reduce((sum, g) => sum + (g.revenue || 0), 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Fame Level</p>
                    <p className="text-3xl font-black text-yellow-400">{fame}/100</p>
                </div>
            </div>

            {/* Current Project */}
            {currentGame && (
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                        Current Project
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-2xl font-black text-white">{currentGame.name}</h4>
                            <p className="text-slate-500">{GENRES.find(g => g.id === currentGame.genre)?.name} • {GAME_SCOPES.find(s => s.id === currentGame.scope)?.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase">Progress</p>
                            <p className="text-3xl font-black text-purple-400">{Math.floor(currentGame.progress)}%</p>
                        </div>
                    </div>
                    <div className="mt-4 bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                            style={{ width: `${currentGame.progress}%` }}
                        />
                    </div>
                    {currentGame.status === 'ready' && (
                        <button
                            onClick={() => setActiveTab('mist')}
                            className="mt-4 w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Release on Mist!
                        </button>
                    )}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => setActiveTab('develop')}
                    className="bg-slate-900/50 border border-white/5 hover:border-purple-500/50 rounded-2xl p-6 text-left transition-all group"
                >
                    <Plus className="w-8 h-8 text-purple-400 mb-3" />
                    <h4 className="text-lg font-bold text-white">New Game</h4>
                    <p className="text-sm text-slate-500">Start developing a new title</p>
                </button>
                <button
                    onClick={() => setActiveTab('social')}
                    className="bg-slate-900/50 border border-white/5 hover:border-pink-500/50 rounded-2xl p-6 text-left transition-all group"
                >
                    <MessageCircle className="w-8 h-8 text-pink-400 mb-3" />
                    <h4 className="text-lg font-bold text-white">Post Update</h4>
                    <p className="text-sm text-slate-500">Share news on Z or YouVideo</p>
                </button>
                <button
                    onClick={() => setActiveTab('studio')}
                    className="bg-slate-900/50 border border-white/5 hover:border-cyan-500/50 rounded-2xl p-6 text-left transition-all group"
                >
                    <Users className="w-8 h-8 text-cyan-400 mb-3" />
                    <h4 className="text-lg font-bold text-white">Hire Staff</h4>
                    <p className="text-sm text-slate-500">Expand your team</p>
                </button>
            </div>
        </div>
    );
};

// Game Development Panel
const DevelopPanel = () => {
    const { currentGame, startGame, studio } = useGameDevStore();
    const [step, setStep] = useState(1);
    const [newGame, setNewGame] = useState({
        name: '',
        description: '',
        genre: 'adventure',
        scope: 'indie',
        price: 29.99
    });

    const handleStartDev = () => {
        if (!newGame.name) return;
        startGame(newGame);
        setStep(1);
        setNewGame({ name: '', description: '', genre: 'adventure', scope: 'indie', price: 29.99 });
    };

    if (currentGame && currentGame.status !== 'released') {
        return (
            <div className="p-8">
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
                    <h2 className="text-2xl font-black text-white mb-6">Currently Developing</h2>
                    <div className="text-center py-12">
                        <Gamepad2 className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-4xl font-black text-white mb-2">{currentGame.name}</h3>
                        <p className="text-slate-500 mb-8">{currentGame.description || 'A new game in development'}</p>
                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Progress</span>
                                <span className="text-purple-400 font-bold">{Math.floor(currentGame.progress)}%</span>
                            </div>
                            <div className="bg-slate-800 rounded-full h-4 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                    style={{ width: `${currentGame.progress}%` }}
                                />
                            </div>
                            <p className="text-slate-600 text-sm mt-4">
                                {currentGame.monthsWorked} / ~{currentGame.devTimeMonths} months
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <Plus className="w-6 h-6 text-purple-400" />
                Start New Game
            </h2>

            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Game Name</label>
                            <input
                                type="text"
                                value={newGame.name}
                                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                placeholder="Enter your game's name..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                value={newGame.description}
                                onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                                placeholder="What is your game about?"
                            />
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!newGame.name}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Continue <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-3">Genre</label>
                            <div className="grid grid-cols-4 gap-3">
                                {GENRES.map(genre => (
                                    <button
                                        key={genre.id}
                                        onClick={() => setNewGame({ ...newGame, genre: genre.id })}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${newGame.genre === genre.id
                                            ? 'border-purple-500 bg-purple-500/10'
                                            : 'border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-2xl">{genre.icon}</span>
                                        <p className="text-sm font-bold text-white mt-1">{genre.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-3">Scope</label>
                            <div className="grid grid-cols-5 gap-3">
                                {GAME_SCOPES.map(scope => (
                                    <button
                                        key={scope.id}
                                        onClick={() => setNewGame({ ...newGame, scope: scope.id })}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${newGame.scope === scope.id
                                            ? 'border-purple-500 bg-purple-500/10'
                                            : 'border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <p className="text-sm font-bold text-white">{scope.name}</p>
                                        <p className="text-[10px] text-slate-500">{scope.devTimeMonths[0]}-{scope.devTimeMonths[1]} mo</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-400"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleStartDev}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                            >
                                <Gamepad2 className="w-5 h-5" />
                                Start Development
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Game Dev Dashboard
const GameDevDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const { character, studio } = useGameDevStore();
    const navigate = useNavigate();

    // Redirect if no character or studio
    React.useEffect(() => {
        if (!character) {
            navigate('/game-dev/character');
        } else if (!studio) {
            navigate('/game-dev/studio-setup');
        }
    }, [character, studio, navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <DashboardHome setActiveTab={setActiveTab} />;
            case 'develop': return <DevelopPanel />;
            case 'mist': return <MistPanel />;
            case 'social': return <SocialPanel />;
            case 'studio': return <div className="p-8 text-white">Studio Management - Coming Soon</div>;
            case 'finances': return <div className="p-8 text-white">Finances - Coming Soon</div>;
            case 'awards': return <div className="p-8 text-white">Awards - Coming Soon</div>;
            case 'settings': return <div className="p-8 text-white">Settings - Coming Soon</div>;
            default: return <DashboardHome setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default GameDevDashboard;
