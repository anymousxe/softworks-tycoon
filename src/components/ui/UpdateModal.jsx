import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Zap, Calendar, History, ArrowRight } from 'lucide-react';

const UpdateModal = () => {
    const [log, setLog] = useState(null);
    const [show, setShow] = useState(false);
    const [lastSeenLogId, setLastSeenLogId] = useState(localStorage.getItem('last_update_log_id'));

    useEffect(() => {
        // Initial fetch for the latest update
        const fetchLatestUpdate = async () => {
            const { data } = await supabase
                .from('update_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data && data.id !== lastSeenLogId) {
                setLog(data);
                setShow(true);
            }
        };

        fetchLatestUpdate();

        // Real-time subscription for new update logs
        const channel = supabase
            .channel('public:update_logs')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'update_logs'
            }, (payload) => {
                // Trigger page refresh as requested (user data is safe in Supabase)
                // We'll show the modal after refresh by storing the new ID
                localStorage.setItem('pending_update_log', JSON.stringify(payload.new));
                window.location.reload();
            })
            .subscribe();

        // Check if we just refreshed due to a new update
        const pendingUpdate = localStorage.getItem('pending_update_log');
        if (pendingUpdate) {
            setLog(JSON.parse(pendingUpdate));
            setShow(true);
            localStorage.removeItem('pending_update_log');
        }

        return () => {
            supabase.removeChannel(channel);
        };
    }, [lastSeenLogId]);

    const handleClose = () => {
        if (log) {
            localStorage.setItem('last_update_log_id', log.id);
            setLastSeenLogId(log.id);
        }
        setShow(false);
    };

    if (!show || !log) return null;

    return (
        <div className="fixed inset-0 z-[280] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl"></div>

            <div className="relative glass-panel max-w-2xl w-full p-0 border-purple-500/30 overflow-hidden animate-in scale-in">
                {/* Header with Background Image/Pattern */}
                <div className="h-48 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40 relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                    <div className="relative z-10 text-center">
                        <div className="inline-block p-4 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 mb-4 shadow-2xl">
                            <Zap className="w-12 h-12 text-purple-400 fill-purple-400/20" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Simulation Update LIVE</h2>
                    </div>
                </div>

                <div className="p-10">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="text-purple-400 font-black text-2xl tracking-tight">v{log.version}</span>
                            <span className="text-slate-600 font-mono text-xs">// {log.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] uppercase">
                            <Calendar className="w-3 h-3" />
                            {new Date(log.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar mb-10">
                        <div className="prose prose-invert prose-sm max-w-none">
                            <div className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                {log.changelog}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full btn-primary bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white flex items-center justify-center gap-3 py-5"
                    >
                        SYNCHRONIZE SIMULATION <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
