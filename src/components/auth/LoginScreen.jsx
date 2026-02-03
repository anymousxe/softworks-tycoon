import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Chrome, Ghost, ArrowRight, Cpu, Zap, Globe, Lock, Terminal } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-hot-toast';

const LoginScreen = () => {
    const { loginWithGoogle, loginAsGuest } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAction = async (action) => {
        setLoading(true);
        try {
            if (action === 'google') await loginWithGoogle();
            else await loginAsGuest();
            toast.success('Neural link established!');
        } catch (error) {
            toast.error('Connection failed. Simulation offline.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030303] radial-bg">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

                {/* Animated Grid lines */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-4xl px-6"
            >
                <div className="glass-panel p-12 md:p-20 overflow-hidden relative">
                    {/* Animated Glow Border */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side: Brand & Hype */}
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3 text-cyan-500 font-mono text-xs font-black tracking-[0.4em] uppercase"
                                >
                                    <Terminal className="w-4 h-4" />
                                    Simulation Core v3.0
                                </motion.div>

                                <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">
                                    AI<br />
                                    <span className="text-glow">TYCOON</span>
                                </h1>
                            </div>

                            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                                Architect. Innovate. Dominate. Build the world's most powerful neural intelligence from your bedroom.
                            </p>

                            <div className="flex gap-6 pt-4">
                                {[
                                    { icon: Cpu, label: 'Neural', color: 'text-cyan-400' },
                                    { icon: Globe, label: 'Global', color: 'text-purple-400' },
                                    { icon: Lock, label: 'Secure', color: 'text-green-400' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Auth Actions */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <button
                                    onClick={() => handleAction('google')}
                                    disabled={loading}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className="w-full btn-premium flex items-center justify-center gap-4 py-5 hover:tracking-[0.3em]"
                                >
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        <Chrome className="w-5 h-5" />
                                    </div>
                                    ESTABLISH NEURAL LINK
                                </button>

                                <button
                                    onClick={() => handleAction('guest')}
                                    disabled={loading}
                                    className="w-full btn-glass flex items-center justify-center gap-4 py-5 group"
                                >
                                    <Ghost className="w-5 h-5 group-hover:animate-bounce" />
                                    ANONYMOUS FRAGMENT
                                </button>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Quantum Encryption Active</span>
                                </div>
                                <p className="mt-4 text-[9px] text-slate-700 leading-relaxed uppercase tracking-widest font-mono">
                                    By initializing, you accept the simulation's Terms of Service and Data Harvesting protocols.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Footer Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.5em]"
                >
                    <div>Latency: 14ms // Secure</div>
                    <div className="flex items-center gap-2 text-cyan-500/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                        Live Feed: Active
                    </div>
                </motion.div>
            </motion.div>

            {/* Extreme Visual Decoration */}
            <div className="absolute left-[-10%] top-[40%] text-[20vw] font-black text-white/[0.01] pointer-events-none select-none italic">AI</div>
            <div className="absolute right-[-10%] bottom-[10%] text-[15vw] font-black text-white/[0.01] pointer-events-none select-none">TYCOON</div>
        </div>
    );
};

export default LoginScreen;
