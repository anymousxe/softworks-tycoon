import React, { useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import { supabase } from '../../lib/supabase';
import { CreditCard, Plus, Trash2, ShieldCheck, Zap, Star, Globe, DollarSign, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubscriptionBuilder = () => {
    const { activeCompany } = useGameStore();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState(9.99);
    const [rateLimit, setRateLimit] = useState(100);
    const [earlyAccess, setEarlyAccess] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            if (!activeCompany) return;
            const { data } = await supabase
                .from('subscription_plans')
                .select('*')
                .eq('company_id', activeCompany.id);
            setPlans(data || []);
        };
        fetchPlans();
    }, [activeCompany]);

    const handleCreatePlan = async () => {
        if (!name) return toast.error('Enter a plan name');
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('subscription_plans')
                .insert([{
                    company_id: activeCompany.id,
                    name,
                    price,
                    rate_limit: rateLimit,
                    early_access: earlyAccess,
                    perks: { rateLimit, earlyAccess }
                }])
                .select()
                .single();

            if (error) throw error;
            setPlans([data, ...plans]);
            setShowCreate(false);
            toast.success(`${name} plan is now active!`);
        } catch (error) {
            toast.error('Plan creation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlan = async (id) => {
        try {
            await supabase.from('subscription_plans').delete().eq('id', id);
            setPlans(plans.filter(p => p.id !== id));
            toast.success('Plan decommissioned');
        } catch (error) {
            toast.error('Decommission failed');
        }
    };

    return (
        <div className="animate-in space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Subscription Core</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-10 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Revenue Optimization Layer</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowCreate(true)}
                    className="btn-primary flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white"
                >
                    <Plus className="w-5 h-5" /> CREATE NEW TIER
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="glass-panel p-8 border-purple-500/10 hover:border-purple-500/30 transition-all bg-slate-900/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[40px] group-hover:bg-purple-500/20 transition-all"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{plan.name}</h3>
                                <div className="text-purple-400 font-mono text-xs font-bold mt-1 tracking-widest uppercase">Active Channel</div>
                            </div>
                            <button
                                onClick={() => handleDeletePlan(plan.id)}
                                className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black text-white tracking-tighter">${plan.price}</span>
                            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">/ MONTH</span>
                        </div>

                        <div className="space-y-3 mb-10">
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                {plan.rate_limit} Tokens / Min
                            </div>
                            {plan.early_access && (
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    Early Access Release
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Standard SLA Protection
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                            <div className="flex-1">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Subscribers</div>
                                <div className="text-white font-black text-xl tracking-tighter flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-600" />
                                    {plan.subscriber_count || 0}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">MRR Output</div>
                                <div className="text-green-400 font-black text-xl tracking-tighter">
                                    ${((plan.subscriber_count || 0) * plan.price).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {plans.length === 0 && (
                    <div className="lg:col-span-3 glass-panel p-20 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent">
                        <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center mb-8 border border-white/5">
                            <CreditCard className="w-10 h-10 text-slate-700" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">No Active Revenue Channels</h3>
                        <p className="text-slate-500 text-sm mb-10 max-w-sm leading-relaxed">
                            Generate passive income by establishing subscription tiers for your AI models.
                        </p>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="btn-glass hover:bg-white hover:text-black py-4 px-10"
                        >
                            ESTABLISH FIRST TIER
                        </button>
                    </div>
                )}
            </div>

            {showCreate && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowCreate(false)}></div>
                    <div className="relative glass-panel p-10 max-w-lg w-full border-purple-500/20 animate-in scale-in">
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-8 uppercase">Plan Architect</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 block">Tier Nomenclature</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-purple-500 transition-all"
                                    placeholder="e.g. ULTRA-SILVER"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 block">Price ($/Mo)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="w-full bg-slate-950 border border-white/10 p-5 pl-10 rounded-2xl text-white font-bold outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 block">Rate Limit (Tk/Min)</label>
                                    <input
                                        type="number"
                                        value={rateLimit}
                                        onChange={(e) => setRateLimit(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setEarlyAccess(!earlyAccess)}
                                className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group ${earlyAccess ? 'bg-purple-500/10 border-purple-500/50' : 'bg-slate-950 border-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl transition-colors ${earlyAccess ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                                        <Star className="w-5 h-5" />
                                    </div>
                                    <div className="text-left font-bold uppercase text-xs tracking-wider">Early Access Perks</div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${earlyAccess ? 'border-purple-500 bg-purple-500' : 'border-slate-800'}`}>
                                    {earlyAccess && <ShieldCheck className="w-3 h-3 text-white" />}
                                </div>
                            </button>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowCreate(false)}
                                    className="px-6 py-4 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
                                >
                                    ABORT
                                </button>
                                <button
                                    onClick={handleCreatePlan}
                                    disabled={loading}
                                    className="flex-1 btn-primary bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2"
                                >
                                    {loading ? 'ARCHITECTING...' : 'INITIALIZE TIER'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionBuilder;
