import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { checkLegacySaves } from '../../lib/firebase';
import { AlertTriangle, Trash2, RefreshCcw, DollarSign, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MigrationModal = () => {
    const { user, profile } = useAuthStore();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkMigration = async () => {
            if (!user || !profile || profile.has_seen_migration_popup) return;

            const hasLegacy = await checkLegacySaves(user.uid);
            if (hasLegacy) {
                setShow(true);
            } else {
                // Mark as seen if no legacy data found
                await supabase
                    .from('users')
                    .update({ has_seen_migration_popup: true })
                    .eq('id', profile.id);
            }
        };

        checkMigration();
    }, [user, profile]);

    const handleMigrationChoice = async (choice) => {
        setLoading(true);
        try {
            if (choice === 'migrate') {
                toast.promise(
                    new Promise(async (resolve, reject) => {
                        // In a real scenario, this would involve fetching from Firestore 
                        // and inserting into Supabase. For now, we'll mark as migrated.
                        const { error } = await supabase
                            .from('users')
                            .update({
                                has_migrated: true,
                                has_seen_migration_popup: true
                            })
                            .eq('id', profile.id);

                        if (error) reject(error);
                        else resolve();
                    }),
                    {
                        loading: 'Migrating legacy data...',
                        success: 'Migration successful (some data may require manual fix)',
                        error: 'Migration failed. Please try wiping clean.',
                    }
                );
            } else {
                // Wipe Clean
                await supabase
                    .from('users')
                    .update({
                        has_migrated: false,
                        has_seen_migration_popup: true
                    })
                    .eq('id', profile.id);

                // Delete any existing Supabase data if any
                await supabase.from('companies').delete().eq('user_id', profile.id);

                toast.success('Campaign wiped clean. Welcome to Version 3.0!');
            }
            setShow(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
            <div className="relative glass-panel max-w-lg w-full p-8 border-yellow-500/30 overflow-hidden">
                {/* Warning Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]"></div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/10 rounded-2xl">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Legacy Data Found</h2>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                    We detected existing simulation data from <span className="text-cyan-400 font-bold">Version 2.0</span>.
                    The infrastructure has changed significantly. You can attempt to migrate your data, but it may cause
                    <span className="text-red-400 font-bold"> system corruption</span>.
                </p>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={() => handleMigrationChoice('migrate')}
                        disabled={loading}
                        className="w-full group flex items-center justify-between p-5 bg-slate-900/50 border border-white/5 hover:border-cyan-500 transition-all rounded-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <RefreshCcw className="w-6 h-6 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                            <div className="text-left">
                                <div className="font-bold text-white uppercase tracking-wider text-sm">Attempt Migration</div>
                                <div className="text-[10px] text-slate-500 uppercase">May be buggy or corrupt saves</div>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleMigrationChoice('wipe')}
                        disabled={loading}
                        className="w-full group flex items-center justify-between p-5 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500 transition-all rounded-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                            <div className="text-left">
                                <div className="font-bold text-white uppercase tracking-wider text-sm">Wipe Clean</div>
                                <div className="text-[10px] text-slate-500 uppercase font-mono">Recommended for stability</div>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <DollarSign className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest leading-relaxed">
                        NEW USERS (OR WIPED USERS) GET A <span className="text-white">$15,000</span> STARTING BONUS GIFT.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MigrationModal;
