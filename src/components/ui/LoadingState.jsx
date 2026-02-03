import React from 'react';

const LoadingState = ({ message = 'Initializing Simulation...' }) => {
    return (
        <div className="fixed inset-0 z-[300] bg-[#050505] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl border-4 border-slate-800 border-t-cyan-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg blur-md animate-pulse"></div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
                        {message}
                    </p>
                    <div className="mt-4 flex gap-1 justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingState;
