import React, { useState } from 'react';
import { Trophy, Swords, TrendingUp, TrendingDown, Minus, Globe, Lock, Zap, Bell, X, ChevronDown, Filter } from 'lucide-react';
import useGameStore, { formatParameters } from '../../store/gameStore';
import { RIVALS_LIST } from '../../data/constants';

const RivalsPanel = () => {
    const { leaderboard, notifications, markNotificationRead, clearNotifications, activeCompany } = useGameStore();
    const [activeTab, setActiveTab] = useState('leaderboard');
    const [showNotifs, setShowNotifs] = useState(false);
    const [typeFilter, setTypeFilter] = useState('all');

    const top25 = leaderboard.slice(0, 25);
    const unreadNotifs = notifications.filter(n => !n.read);

    const filteredLeaderboard = typeFilter === 'all'
        ? top25
        : top25.filter(m => m.type === typeFilter);

    const getCompanyColor = (company) => {
        const rival = RIVALS_LIST.find(r => r.name === company);
        return rival?.color || 'text-white';
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'image': return '🎨';
            case 'video': return '🎬';
            case 'audio': return '🎵';
            case 'multimodal': return '🌐';
            default: return '💬';
        }
    };

    return (
        <div className="animate-in space-y-10">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Intelligence</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-10 bg-cyan-500"></div>
                        <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Market Analysis</p>
                    </div>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                    >
                        <Bell className="w-5 h-5 text-white" />
                        {unreadNotifs.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                                {unreadNotifs.length}
                            </span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="absolute right-0 top-14 w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[500px] overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-black text-white uppercase tracking-wider text-sm">Notifications</h3>
                                <button
                                    onClick={() => { clearNotifications(); setShowNotifs(false); }}
                                    className="text-[10px] text-slate-500 hover:text-white transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">No notifications</div>
                                ) : (
                                    notifications.slice(0, 20).map(notif => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markNotificationRead(notif.id)}
                                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${!notif.read ? 'bg-cyan-500/5' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className={`text-sm font-bold ${notif.type === 'competitor_release' ? 'text-yellow-400' :
                                                        notif.type === 'training_complete' ? 'text-green-400' :
                                                            notif.type === 'release' ? 'text-cyan-400' :
                                                                'text-white'
                                                    }`}>
                                                    {notif.isBreakthrough && '⚡ '}
                                                    {notif.title}
                                                </div>
                                                {!notif.read && <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>}
                                            </div>
                                            <p className="text-[11px] text-slate-500">{notif.message}</p>
                                            <p className="text-[9px] text-slate-600 mt-1">Week {notif.week}, {notif.year}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/5 pb-4">
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'leaderboard' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                >
                    <Trophy className="w-4 h-4" /> Leaderboard
                </button>
                <button
                    onClick={() => setActiveTab('rivals')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'rivals' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                >
                    <Swords className="w-4 h-4" /> Competitors
                </button>
            </div>

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <div className="flex gap-2">
                            {['all', 'text', 'image', 'video', 'multimodal'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(type)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${typeFilter === type
                                            ? 'bg-cyan-500 text-black'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard Table */}
                    <div className="glass-panel overflow-hidden border-white/5">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-left text-[9px] text-slate-500 font-black uppercase tracking-widest">#</th>
                                    <th className="px-6 py-4 text-left text-[9px] text-slate-500 font-black uppercase tracking-widest">Model</th>
                                    <th className="px-6 py-4 text-left text-[9px] text-slate-500 font-black uppercase tracking-widest">Company</th>
                                    <th className="px-6 py-4 text-left text-[9px] text-slate-500 font-black uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-right text-[9px] text-slate-500 font-black uppercase tracking-widest">Parameters</th>
                                    <th className="px-6 py-4 text-right text-[9px] text-slate-500 font-black uppercase tracking-widest">Quality</th>
                                    <th className="px-6 py-4 text-center text-[9px] text-slate-500 font-black uppercase tracking-widest">License</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaderboard.map((model, index) => {
                                    const isPlayer = model.isPlayer || model.company === activeCompany?.name;
                                    return (
                                        <tr
                                            key={model.id || index}
                                            className={`border-b border-white/5 transition-all hover:bg-white/5 ${isPlayer ? 'bg-cyan-500/5' : ''
                                                } ${index < 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-yellow-500 text-black' :
                                                        index === 1 ? 'bg-slate-400 text-black' :
                                                            index === 2 ? 'bg-orange-600 text-white' :
                                                                'bg-white/5 text-slate-500'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${isPlayer ? 'text-cyan-400' : 'text-white'}`}>
                                                        {model.name}
                                                    </span>
                                                    {isPlayer && (
                                                        <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-bold">YOU</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${getCompanyColor(model.company)}`}>
                                                    {model.company}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-lg">{getTypeIcon(model.type)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-mono text-purple-400 font-bold">
                                                    {formatParameters(model.params)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${model.quality >= 90 ? 'bg-green-500' :
                                                                    model.quality >= 70 ? 'bg-cyan-500' :
                                                                        model.quality >= 50 ? 'bg-yellow-500' :
                                                                            'bg-red-500'
                                                                }`}
                                                            style={{ width: `${model.quality}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-mono text-white text-sm font-bold w-8">{Math.round(model.quality)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {model.isOpenSource ? (
                                                    <Globe className="w-4 h-4 text-green-400 mx-auto" />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-slate-600 mx-auto" />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredLeaderboard.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No models found for this filter.
                        </div>
                    )}
                </div>
            )}

            {/* Rivals Tab */}
            {activeTab === 'rivals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RIVALS_LIST.map((rival, i) => {
                        const rivalModels = leaderboard.filter(m => m.company === rival.name);
                        const bestModel = rivalModels.sort((a, b) => b.params - a.params)[0];

                        return (
                            <div key={i} className="glass-panel p-6 hover:bg-white/5 transition-all group border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`text-xl font-black uppercase tracking-tight ${rival.color}`}>{rival.name}</h3>
                                        <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">{rival.hq}</p>
                                    </div>
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

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-slate-500">Specialty</span>
                                        <span className="text-white font-bold uppercase">{rival.specialty}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-slate-500">Est. Params</span>
                                        <span className="text-purple-400 font-mono font-bold">{rival.paramRange}</span>
                                    </div>
                                    {bestModel && (
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-slate-500">Top Model</span>
                                            <span className="text-cyan-400 font-bold">{bestModel.name}</span>
                                        </div>
                                    )}
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
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RivalsPanel;
