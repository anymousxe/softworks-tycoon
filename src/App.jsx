import React, { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import { supabase } from './lib/supabase';
import LoginScreen from './components/auth/LoginScreen';
import LoadingState from './components/ui/LoadingState';
import MigrationModal from './components/auth/MigrationModal';
import BroadcastBanner from './components/ui/BroadcastBanner';
import UpdateModal from './components/ui/UpdateModal';
import DowntimeScreen from './components/ui/DowntimeScreen';

function App() {
    const { user, profile, loading, init, isAdmin } = useAuthStore();
    const [siteStatus, setSiteStatus] = useState({ is_down: false, message: '' });
    const [statusLoading, setStatusLoading] = useState(true);

    useEffect(() => {
        init();

        // Check Site Status (Downtime)
        const checkStatus = async () => {
            const { data } = await supabase
                .from('site_status')
                .select('*')
                .single();

            if (data) setSiteStatus(data);
            setStatusLoading(false);
        };

        checkStatus();

        // Real-time site status updates
        const channel = supabase
            .channel('public:site_status')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'site_status'
            }, (payload) => {
                setSiteStatus(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [init]);

    if (loading || statusLoading) {
        return <LoadingState />;
    }

    // Show downtime screen if down, unless the user is an admin
    if (siteStatus.is_down && !isAdmin) {
        return <DowntimeScreen message={siteStatus.message} />;
    }

    if (!user) {
        return <LoginScreen />;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-cyan-500 selection:text-black">
            <BroadcastBanner />
            <UpdateModal />
            <MigrationModal />

            {/* Main Game Interface (Dashboard) will go here */}
            <main className="pt-16 min-h-screen">
                <div className="p-8 text-center bg-glow min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative">
                    <div className="glass-panel p-12 max-w-2xl animate-in relative z-10 transition-all hover:scale-[1.01]">
                        <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter text-white">SOFTWORKS</h1>
                        <div className="h-1 w-32 bg-cyan-500 mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>

                        <p className="text-slate-400 mb-10 text-lg leading-relaxed font-mono">
                            Welcome back, <span className="text-white font-bold">{profile?.display_name || 'CEO'}</span>.
                            Your neural interface is synchronizing. The simulation core v3.0 is ready.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            <div className="glass-panel p-4 border-white/5 bg-white/5">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Status</div>
                                <div className="text-green-400 font-mono text-sm font-bold flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    SIMULATION ACTIVE
                                </div>
                            </div>
                            <div className="glass-panel p-4 border-white/5 bg-white/5">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Interface</div>
                                <div className="text-cyan-400 font-mono text-sm font-bold">LIQUID GLASS v1.0</div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button className="btn-primary flex-1 py-4 group">
                                ENTER DASHBOARD <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button
                                onClick={() => useAuthStore.getState().logout()}
                                className="btn-glass text-red-400 hover:text-red-300 border-red-500/10 hover:border-red-500/30 px-10"
                            >
                                DISCONNECT
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
