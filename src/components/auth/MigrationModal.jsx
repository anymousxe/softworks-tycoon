import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const MigrationModal = () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user has old localStorage data
        const checkLegacyData = () => {
            const user = auth.currentUser;
            if (!user) return;

            // Check for old game data in localStorage
            const hasLegacyData = localStorage.getItem('gameState') ||
                localStorage.getItem('currentSave') ||
                localStorage.getItem('saves');

            // Check if user has already migrated
            const hasMigrated = localStorage.getItem('migration_completed');

            if (hasLegacyData && !hasMigrated) {
                setShow(true);
            }
        };

        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setTimeout(checkLegacyData, 1000); // Small delay to ensure everything is loaded
            }
        });

        return () => unsubscribe();
    }, []);

    const handleWipeClean = async () => {
        setLoading(true);
        try {
            // Clear ALL localStorage data
            localStorage.clear();

            // Mark migration as completed
            localStorage.setItem('migration_completed', 'true');

            toast.success('All legacy data wiped clean. Starting fresh!', { icon: '🧹' });
            setShow(false);
        } catch (error) {
            toast.error('Failed to wipe data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = () => {
        // Just mark as completed without wiping
        localStorage.setItem('migration_completed', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    onClick={handleDismiss}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative glass-panel p-10 max-w-lg w-full border-yellow-500/20 bg-yellow-500/5"
                >
                    <button
                        onClick={handleDismiss}
                        className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                            <AlertTriangle className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Legacy Data Detected</h2>
                            <p className="text-yellow-500/80 text-xs font-mono uppercase tracking-widest mt-1">System Migration Required</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                        <div className="glass-panel p-6 bg-red-500/5 border-red-500/20">
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                <span className="font-black text-red-400 uppercase">⚠️ Critical Notice:</span> Old game data from the previous version has been detected.
                                The new AI Tycoon v3.0 uses a completely different architecture.
                            </p>
                            <p className="text-slate-400 text-xs leading-relaxed font-mono">
                                We <span className="text-red-400 font-bold">strongly recommend</span> wiping all legacy data to prevent corruption and ensure optimal performance.
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleDismiss}
                            disabled={loading}
                            className="flex-1 btn-glass py-4 text-slate-500 hover:text-white"
                        >
                            DISMISS
                        </button>
                        <button
                            onClick={handleWipeClean}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                        >
                            <Trash2 className="w-4 h-4" />
                            {loading ? 'WIPING...' : 'WIPE CLEAN'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MigrationModal;
