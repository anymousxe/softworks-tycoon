import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Brain } from 'lucide-react';

const LoadingState = () => {
    return (
        <div className="min-h-screen bg-[#030303] radial-bg flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Animated Logo */}
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl"
                >
                    <Brain className="w-12 h-12 text-cyan-400" />
                </motion.div>

                {/* Title */}
                <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase italic">
                    AI <span className="text-glow">TYCOON</span>
                </h1>

                {/* Loading Text */}
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-3 text-cyan-500 font-mono text-xs font-black tracking-[0.3em] uppercase"
                >
                    <Zap className="w-4 h-4" />
                    INITIALIZING NEURAL CORE
                </motion.div>

                {/* Loading Bar */}
                <div className="w-64 h-1 bg-slate-900 rounded-full mt-8 overflow-hidden">
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                    />
                </div>

                {/* Status Text */}
                <motion.p
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-slate-600 text-[10px] font-mono uppercase tracking-widest mt-8"
                >
                    Establishing Quantum Link...
                </motion.p>
            </motion.div>

            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        </div>
    );
};

export default LoadingState;
