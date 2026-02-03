import React from 'react';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { DollarSign, Calendar, FastForward, ArrowRightFromLine, User } from 'lucide-react';

const TopBar = () => {
    const { activeCompany, nextWeek } = useGameStore();
    const { user, profile, logout } = useAuthStore();

    if (!activeCompany) return null;

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            await logout();
        }
    };

    // Get display name and photo - Firebase provides these directly
    const displayName = user?.displayName || profile?.display_name || 'User';
    const photoURL = user?.photoURL || profile?.photo_url;

    return (
        <header className="h-20 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 fixed top-0 right-0 left-24 md:left-64 z-30 transition-all duration-300">
            <div className="flex items-center gap-6">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight leading-none uppercase">{activeCompany.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest uppercase opacity-70">Simulation Link Stable</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="hidden lg:flex items-center gap-8 border-r border-white/10 pr-8">
                    <div className="text-right">
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Corporate Funds</div>
                        <div className="text-green-400 font-black text-xl tracking-tighter flex items-center justify-end">
                            <DollarSign className="w-4 h-4" />
                            {activeCompany.cash.toLocaleString()}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Compute Power</div>
                        <div className="text-blue-400 font-black text-xl tracking-tighter flex items-center justify-end gap-1">
                            {activeCompany.compute || 0}
                            <span className="text-xs font-mono ml-0.5">TF</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Research Points</div>
                        <div className="text-purple-400 font-black text-xl tracking-tighter flex items-center justify-end gap-1">
                            {activeCompany.research_pts}
                            <span className="text-xs font-mono ml-0.5">PTS</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Simulation Timeline</div>
                        <div className="text-white font-mono text-sm font-bold flex items-center gap-2 justify-end">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            W{activeCompany.week}/{activeCompany.year}
                        </div>
                    </div>

                    <button
                        onClick={nextWeek}
                        className="bg-white hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-black text-xs tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group shadow-xl shadow-white/5"
                    >
                        NEXT WEEK
                        <FastForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* User Profile Box with Logout */}
                    <div className="glass-panel px-4 py-2 flex items-center gap-3 border-white/10">
                        {/* Profile Picture or Fallback */}
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                            {photoURL ? (
                                <img
                                    src={photoURL}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Hide image and show fallback
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : null}
                            {!photoURL && <User className="w-5 h-5 text-slate-500" />}
                        </div>

                        {/* Username */}
                        <div className="hidden md:block">
                            <div className="text-white font-bold text-sm leading-none">
                                {displayName}
                            </div>
                            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1">
                                Authenticated
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all group ml-2"
                            title="Logout"
                        >
                            <ArrowRightFromLine className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
