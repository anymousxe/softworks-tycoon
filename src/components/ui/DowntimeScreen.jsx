import React from 'react';
import { ShieldAlert, Terminal, Lock } from 'lucide-react';

const DowntimeScreen = ({ message }) => {
    return (
        <div className="fixed inset-0 z-[500] bg-[#050505] flex items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-50"></div>

            <div className="max-w-xl w-full">
                <div className="inline-block p-6 bg-red-500/10 rounded-3xl border border-red-500/20 mb-10 animate-pulse">
                    <ShieldAlert className="w-20 h-20 text-red-500" />
                </div>

                <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">System Maintenance</h1>
                <div className="flex gap-2 justify-center mb-8">
                    <div className="h-1 w-12 bg-red-500/50 rounded-full"></div>
                    <div className="h-1 w-24 bg-red-500 rounded-full"></div>
                    <div className="h-1 w-12 bg-red-500/50 rounded-full"></div>
                </div>

                <div className="glass-panel p-8 border-red-500/10 mb-8">
                    <p className="text-slate-400 font-mono text-sm leading-relaxed mb-6">
                        {message || 'The simulation is currently offline for critical architecture updates. Please stand by while internal neural paths are being restructured.'}
                    </p>

                    <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-red-500/60 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3 h-3" />
                            CODE: 503_OFFLINE
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-3 h-3" />
                            ENCRYPTION: ACTIVE
                        </div>
                    </div>
                </div>

                <div className="text-slate-700 text-[10px] uppercase tracking-[0.5em] animate-pulse">
                    Re-establishing Connection...
                </div>
            </div>
        </div>
    );
};

export default DowntimeScreen;
