import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#030303] radial-bg flex items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full relative z-10"
            >
                <div className="inline-block p-6 bg-red-500/10 rounded-[2.5rem] border border-red-500/20 mb-10">
                    <ShieldAlert className="w-20 h-20 text-red-500" />
                </div>

                <h1 className="text-8xl font-black text-white tracking-tighter mb-4 italic">404</h1>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-[0.3em] mb-12">Neural Path Not Found</p>

                <div className="glass-panel p-8 border-red-500/10 bg-red-500/5 mb-10">
                    <p className="text-slate-400 text-sm leading-relaxed font-bold">
                        The sector you are trying to access does not exist in the current simulation timeline. Your connection may have been corrupted.
                    </p>
                </div>

                <Link
                    to="/"
                    className="btn-premium inline-flex items-center gap-3"
                >
                    <Home className="w-5 h-5" /> RE-ESTABLISH CONNECTION
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
