import React, { useState } from 'react';
import { ShoppingCart, Zap, Package, Check } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import { SHOP_ITEMS } from '../../data/constants';
import { toast } from 'react-hot-toast';

const ShopPanel = () => {
    const { activeCompany, updateCompany } = useGameStore();
    const [loadingId, setLoadingId] = useState(null);

    const handlePurchase = (item) => {
        if (!activeCompany || activeCompany.cash < item.cost) {
            return toast.error('Insufficient funds');
        }

        setLoadingId(item.id);

        let updates = { cash: activeCompany.cash - item.cost };

        // Apply item effects
        if (item.type === 'consumable_res') {
            updates.research_pts = (activeCompany.research_pts || 0) + item.amount;
        }

        updateCompany(updates);
        toast.success(`${item.name} purchased!`, { icon: '🛒' });
        setLoadingId(null);
    };

    return (
        <div className="animate-in space-y-10">
            <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Shop</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Consumables & Upgrades</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOP_ITEMS.map((item) => {
                    const canAfford = (activeCompany?.cash || 0) >= item.cost;

                    return (
                        <div key={item.id} className="glass-panel p-6 flex flex-col justify-between h-64">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${item.type.includes('upgrade') ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-400 uppercase">
                                        {item.type.includes('upgrade') ? 'Upgrade' : 'Consumable'}
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{item.name}</h3>
                                <p className="text-cyan-500 text-xs font-mono">{item.effect}</p>
                            </div>

                            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                <div className={`font-black text-xl ${canAfford ? 'text-green-400' : 'text-red-500/50'}`}>
                                    ${item.cost.toLocaleString()}
                                </div>
                                <button
                                    onClick={() => handlePurchase(item)}
                                    disabled={!canAfford || loadingId === item.id}
                                    className={`p-3 rounded-xl transition-all ${canAfford
                                            ? 'bg-white text-black hover:bg-cyan-400'
                                            : 'bg-white/5 text-slate-700 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShopPanel;
