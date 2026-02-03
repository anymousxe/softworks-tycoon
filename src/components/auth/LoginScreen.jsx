import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { Cpu, Globe, Lock, ShieldCheck, Mail } from 'lucide-react';

const LoginScreen = () => {
    const { loginGoogle, loginGuest } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (provider) => {
        setLoading(true);
        try {
            if (provider === 'google') await loginGoogle();
            else await loginGuest();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050505]">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>

            {/* Animated Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]"></div>

            <div className="relative z-10 max-w-md w-full px-6">
                <div className="glass-panel p-10 border-white/10 shadow-2xl backdrop-blur-2xl animate-in">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 mb-6">
                            <Cpu className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">SOFTWORKS</h1>
                        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase opacity-80">Simulation Core v3.0</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleLogin('google')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group"
                        >
                            <Globe className="w-5 h-5" />
                            <span>CONTINUE WITH GOOGLE</span>
                        </button>

                        <button
                            onClick={() => handleLogin('guest')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900/50 hover:bg-slate-800/80 text-white border border-white/10 font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            <ShieldCheck className="w-5 h-5 text-slate-400" />
                            <span>START AS GUEST AGENT</span>
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-transparent px-2">
                                Secure Access
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest leading-relaxed">
                            By entering the simulation, you agree to the <br />
                            <span className="text-slate-400 cursor-pointer hover:text-cyan-400 transition-colors">Neural Interface Terms of Service</span>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center flex flex-col items-center gap-2">
                    <div className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.4em]">developed by anymousxe</div>
                    <div className="flex gap-4 text-slate-700">
                        <Lock className="w-3 h-3" />
                        <ShieldCheck className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
