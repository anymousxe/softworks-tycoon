import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { HARDWARE, SHOP_ITEMS } from '../../data/constants';
import { Cpu, Server, Zap, ShoppingCart, Info, Package, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const HardwareMarket = () => {
    const { activeCompany, purchaseHardware } = useGameStore();
    const [activeTab, setActiveTab] = useState('compute');
    const [loadingId, setLoadingId] = useState(null);

    // Safe access to hardware array
    const hardware = activeCompany?.hardware || [];

    const handlePurchase = (item) => {
        if (!activeCompany || activeCompany.cash < item.cost) {
            return toast.error('Insufficient capital for requisition');
        }

        setLoadingId(item.id);
        try {
            purchaseHardware(item);
            toast.success(`${item.name} successfully deployed!`, { icon: '🛰️' });
        } catch (error) {
            toast.error('Deployment failed');
        } finally {
            setLoadingId(null);
        }
    };

    const getOwnedCount = (id) => {
        return hardware.filter(h => h.id === id).length;
    };

    if (!activeCompany) {
        return (
            <div className="h-96 flex items-center justify-center">
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="animate-in space-y-10 mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Global Requisition</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-10 bg-cyan-500"></div>
                        <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Hardware & Infrastructure</p>
                    </div>
                </div>

                <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('compute')}
                        className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'compute' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        Compute Units
                    </button>
                    <button
                        onClick={() => setActiveTab('upgrades')}
                        className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'upgrades' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        Operations & PR
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'compute' ? (
                    HARDWARE.map((hw) => {
                        const owned = getOwnedCount(hw.id);
                        const canAfford = activeCompany.cash >= hw.cost;

                        return (
                            <div key={hw.id} className="glass-panel p-8 flex flex-col justify-between group h-80 relative overflow-hidden transition-all hover:bg-slate-900/60 font-sans">
                                <Cpu className="absolute -right-4 -bottom-4 w-32 h-32 text-white/[0.02] group-hover:text-cyan-500/[0.05] transition-all group-hover:scale-110" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-cyan-400 group-hover:scale-110 transition-transform">
                                            <Server className="w-6 h-6" />
                                        </div>
                                        {owned > 0 && (
                                            <div className="bg-cyan-500/20 text-cyan-500 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                                                {owned} INSTALLED
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{hw.name}</h3>
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <Zap className="w-3 h-3" />
                                            <span className="text-[10px] font-mono font-bold">{hw.compute} TF</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-red-400">
                                            <TrendingUp className="w-3 h-3" />
                                            <span className="text-[10px] font-mono font-bold">-${hw.upkeep}/wk</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                        <div>
                                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Deployment Cost</div>
                                            <div className={`font-black text-xl tracking-tighter ${canAfford ? 'text-green-400' : 'text-red-500/50'}`}>
                                                ${hw.cost.toLocaleString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handlePurchase(hw)}
                                            disabled={!canAfford || loadingId === hw.id}
                                            className={`p-4 rounded-xl transition-all shadow-xl ${canAfford
                                                ? 'bg-white text-black hover:bg-cyan-400'
                                                : 'bg-white/5 text-slate-700 cursor-not-allowed'
                                                }`}
                                        >
                                            {loadingId === hw.id ? <Package className="w-5 h-5 animate-bounce" /> : <ShoppingCart className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    (SHOP_ITEMS || []).map((item) => {
                        const canAfford = activeCompany.cash >= item.cost;
                        return (
                            <div key={item.id} className="glass-panel p-8 flex flex-col justify-between group h-80 border-purple-500/10 hover:border-purple-500/30">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                                            <Package className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{item.name}</h3>
                                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-4">{item.effect}</p>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                    <div>
                                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Venture Capital</div>
                                        <div className={`font-black text-xl tracking-tighter ${canAfford ? 'text-green-400' : 'text-red-500/50'}`}>
                                            ${item.cost.toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handlePurchase(item)}
                                        disabled={!canAfford || loadingId === item.id}
                                        className={`p-4 rounded-xl transition-all shadow-xl shadow-purple-500/5 ${canAfford
                                            ? 'bg-purple-600 text-white hover:bg-purple-400'
                                            : 'bg-white/5 text-slate-700 cursor-not-allowed'
                                            }`}
                                    >
                                        {loadingId === item.id ? <Package className="w-5 h-5 animate-bounce" /> : <Plus className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="glass-panel p-10 bg-cyan-500/5 border-cyan-500/20 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Info className="w-12 h-12 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-white font-black uppercase text-xl mb-2 tracking-tight">Infrastructure Notice</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                        Compute power scales linearly with installed units. Weekly operational costs are deducted automatically every Sunday at midnight server time. Ensure your liquidity remains positive to avoid <span className="text-red-400">Chapter 11 Bankruptcy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HardwareMarket;
