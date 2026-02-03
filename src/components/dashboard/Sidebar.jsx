import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useGameStore from '../../store/gameStore';
import {
    LayoutDashboard,
    Cpu,
    BarChart3,
    Swords,
    PlusSquare,
    Server,
    FlaskConical,
    Briefcase,
    Star,
    ShoppingCart,
    Settings,
    LogOut,
    ChevronRight,
    Shield
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { logout, isAdmin } = useAuthStore();

    const navItems = [
        { id: 'dash', label: 'Home', icon: LayoutDashboard },
        { id: 'stats', label: 'Stats', icon: BarChart3 },
        { id: 'rivals', label: 'Rivals', icon: Swords },
        { id: 'dev', label: 'Create', icon: PlusSquare },
        { id: 'market', label: 'Market', icon: Server },
        { id: 'lab', label: 'Lab', icon: FlaskConical },
        { id: 'biz', label: 'Manage', icon: Briefcase },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'shop', label: 'Shop', icon: ShoppingCart },
    ];

    if (isAdmin) {
        navItems.push({ id: 'admin', label: 'Admin', icon: Shield });
    }

    return (
        <aside className="w-24 md:w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300">
            <div className="p-6 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                    <Cpu className="text-white w-6 h-6" />
                </div>
                <span className="hidden md:block font-black text-xl tracking-tighter text-white">SOFTWORKS</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${activeTab === item.id
                            ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                            : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <item.icon className={`w-6 h-6 shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                        <span className="hidden md:block font-bold text-sm tracking-wide">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto hidden md:block">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto space-y-2">
                <button className="w-full flex items-center gap-4 p-4 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all group">
                    <Settings className="w-6 h-6 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="hidden md:block font-bold text-sm">Settings</span>
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="w-6 h-6 shrink-0 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:block font-bold text-sm">Exit Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
