import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
// We'll add content components here

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dash');

    return (
        <div className="min-h-screen bg-[#050505] flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 ml-24 md:ml-64 flex flex-col transition-all duration-300">
                <TopBar />

                <main className="flex-1 mt-20 p-8 overflow-y-auto custom-scrollbar relative">
                    {/* Background Ambient Glows */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto relative z-10 animate-in">
                        {/* Tab Routing will happen here */}
                        {activeTab === 'dash' && (
                            <div className="space-y-8">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase">OPERATIONS CENTER</h1>
                                    <p className="text-slate-500 font-mono text-sm tracking-widest">REAL-TIME SIMULATION FEED</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Market Dominance', value: '0.0%', color: 'text-cyan-400' },
                                        { label: 'Weekly Gross', value: '$0', color: 'text-green-400' },
                                        { label: 'Global Reputation', value: '100', color: 'text-purple-400' },
                                    ].map((stat, i) => (
                                        <div key={i} className="glass-panel p-8 group border-white/5 hover:border-white/10">
                                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                                            <div className={`text-4xl font-black ${stat.color} group-hover:scale-105 transition-transform duration-500`}>
                                                {stat.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="glass-panel p-12 flex flex-col items-center border-dashed border-white/10 bg-transparent">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 border border-white/5">
                                        <LayoutDashboard className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Initialize Model Training</h3>
                                    <p className="text-slate-500 text-sm mb-8 text-center max-w-sm">No active models detected in the current sector. Head to the Create tab to start your first neural architecture.</p>
                                    <button
                                        onClick={() => setActiveTab('dev')}
                                        className="btn-glass hover:bg-white hover:text-black"
                                    >
                                        LAUNCH CREATOR
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'dash' && (
                            <div className="h-96 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin mb-4"></div>
                                <h3 className="text-slate-500 font-mono text-xs uppercase tracking-widest">Sector Synchronizing...</h3>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

import { LayoutDashboard } from 'lucide-react';

export default Dashboard;
