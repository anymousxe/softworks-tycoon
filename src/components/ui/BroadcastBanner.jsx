import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Megaphone, Zap } from 'lucide-react';

const BroadcastBanner = () => {
    const [broadcast, setBroadcast] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Initial fetch of active broadcasts
        const fetchBroadcast = async () => {
            const { data } = await supabase
                .from('broadcasts')
                .select('*')
                .eq('is_active', true)
                .order('priority', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) setBroadcast(data);
        };

        fetchBroadcast();

        // Real-time subscription
        const channel = supabase
            .channel('public:broadcasts')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'broadcasts'
            }, (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    if (payload.new.is_active) {
                        setBroadcast(payload.new);
                        setVisible(true);
                    } else if (broadcast?.id === payload.new.id) {
                        setBroadcast(null);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [broadcast?.id]);

    if (!broadcast || !visible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-[1px]">
                <div className="bg-slate-950/90 backdrop-blur-xl px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-cyan-500/20 p-1.5 rounded-lg shrink-0">
                            <Megaphone className="w-4 h-4 text-cyan-400 animate-bounce" />
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm font-bold truncate">
                            <span className="text-white shrink-0">anymousxe</span>
                            <div className="bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded font-black tracking-tighter shrink-0">DEV</div>
                            <span className="text-slate-400 shrink-0 mx-1">—</span>
                            <span className="text-slate-100 truncate">{broadcast.message}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setVisible(false)}
                        className="p-1 hover:bg-white/5 rounded-lg transition-colors ml-4"
                    >
                        <X className="w-4 h-4 text-slate-500 hover:text-white" />
                    </button>
                </div>
            </div>
            {/* Decorative shadow */}
            <div className="h-4 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>
    );
};

export default BroadcastBanner;
