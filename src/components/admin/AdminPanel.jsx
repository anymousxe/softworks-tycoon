import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Megaphone, Zap, ShieldAlert, Trash2, Send, Clock, Plus, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastPriority, setBroadcastPriority] = useState(0);
    const [updateVersion, setUpdateVersion] = useState('3.0.0');
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateChangelog, setUpdateChangelog] = useState('');
    const [isDowntime, setIsDowntime] = useState(false);
    const [downtimeMessage, setDowntimeMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch current downtime status
        const fetchStatus = async () => {
            const { data } = await supabase.from('site_status').select('*').single();
            if (data) {
                setIsDowntime(data.is_down);
                setDowntimeMessage(data.message || '');
            }
        };
        fetchStatus();
    }, []);

    const handlePostBroadcast = async () => {
        if (!broadcastMessage) return toast.error('Message is empty');
        setLoading(true);
        try {
            // Deactivate old broadcasts
            await supabase.from('broadcasts').update({ is_active: false }).eq('is_active', true);

            const { error } = await supabase.from('broadcasts').insert([{
                message: broadcastMessage,
                priority: broadcastPriority,
                is_active: true
            }]);

            if (error) throw error;
            toast.success('Broadcast transmitted globally!');
            setBroadcastMessage('');
        } catch (error) {
            toast.error('Transmission failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePostUpdate = async () => {
        if (!updateVersion || !updateTitle || !updateChangelog) return toast.error('Check all fields');
        setLoading(true);
        try {
            const { error } = await supabase.from('update_logs').insert([{
                version: updateVersion,
                title: updateTitle,
                changelog: updateChangelog
            }]);

            if (error) throw error;
            toast.success('Update log published! Users being refreshed...');
        } catch (error) {
            toast.error('Publication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDowntime = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.from('site_status').update({
                is_down: !isDowntime,
                message: downtimeMessage
            }).eq('id', (await supabase.from('site_status').select('id').single()).data.id);

            if (error) throw error;
            setIsDowntime(!isDowntime);
            toast.success(isDowntime ? 'System back online!' : 'System offline. Maintenance mode active.');
        } catch (error) {
            toast.error('Toggle failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in space-y-12 mb-20 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">Admin Command Center</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <p className="text-red-500 font-mono text-sm tracking-[0.3em] uppercase font-bold">Priority Authorization Detected</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Broadcast Control */}
                <div className="glass-panel p-8 border-cyan-500/20 bg-cyan-500/5 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <Megaphone className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Live Transmission</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Message</label>
                            <textarea
                                value={broadcastMessage}
                                onChange={(e) => setBroadcastMessage(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-cyan-500 transition-all min-h-[100px]"
                                placeholder="Type global announcement..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Priority (0-10)</label>
                                <input
                                    type="number"
                                    value={broadcastPriority}
                                    onChange={(e) => setBroadcastPriority(Number(e.target.value))}
                                    className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-cyan-500 transition-all"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handlePostBroadcast}
                                    disabled={loading}
                                    className="btn-primary bg-cyan-500 hover:bg-cyan-400 text-black px-10 flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> TRANSMIT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance Mode */}
                <div className="glass-panel p-8 border-red-500/20 bg-red-500/5 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Lockdown</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Downtime Reason</label>
                            <textarea
                                value={downtimeMessage}
                                onChange={(e) => setDowntimeMessage(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-red-500 transition-all min-h-[100px]"
                                placeholder="Why is it down?"
                            />
                        </div>

                        <button
                            onClick={handleToggleDowntime}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-black tracking-widest text-xs uppercase flex items-center justify-center gap-3 transition-all ${isDowntime
                                    ? 'bg-green-500 text-black hover:bg-green-400'
                                    : 'bg-red-600 text-white hover:bg-red-500'
                                }`}
                        >
                            {isDowntime ? <Zap className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                            {isDowntime ? 'RESTORE SYSTEM ACCESS' : 'ENGAGE SITE DOWNTIME'}
                        </button>
                    </div>
                </div>

                {/* Update Log Entry */}
                <div className="glass-panel p-8 lg:col-span-2 border-purple-500/20 bg-purple-500/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Zap className="w-8 h-8 text-purple-400" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Simulation Changelog</h2>
                        </div>
                        <div className="text-[10px] text-purple-500 font-mono font-bold tracking-[0.2em]">VERSION DEPLOYMENT ENGINE</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Version Tag</label>
                                <input
                                    value={updateVersion}
                                    onChange={(e) => setUpdateVersion(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none"
                                    placeholder="x.x.x"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Deployment Title</label>
                                <input
                                    value={updateTitle}
                                    onChange={(e) => setUpdateTitle(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none"
                                    placeholder="Operation Genesis"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Changelog (MD Supported)</label>
                            <textarea
                                value={updateChangelog}
                                onChange={(e) => setUpdateChangelog(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-purple-500 transition-all min-h-[160px]"
                                placeholder="- Added liquid logic... \n- Refined neural paths..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePostUpdate}
                        disabled={loading}
                        className="w-full btn-primary bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 py-5 shadow-xl shadow-purple-500/10"
                    >
                        <RefreshCcw className="w-5 h-5" /> PUBLISH VERSION UPDATE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
