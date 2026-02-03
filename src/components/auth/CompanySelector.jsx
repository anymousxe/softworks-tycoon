import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useGameStore from '../../store/gameStore';
import { Plus, Building2, Briefcase, Trash2, ShieldCheck, Zap, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CompanySelector = () => {
    const { user, profile } = useAuthStore();
    const { companies, selectCompany, createCompany } = useGameStore();
    const [showCreate, setShowCreate] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState('');
    const [isSandbox, setIsSandbox] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!newCompanyName.trim()) return toast.error('Enter a company name');
        setLoading(true);
        try {
            await createCompany(newCompanyName, isSandbox);
            toast.success(`${newCompanyName} initialized successfully!`);
            setShowCreate(false);
            setNewCompanyName('');
        } catch (error) {
            toast.error(error.message || 'Initialization failed');
        } finally {
            setLoading(false);
        }
    };

    // Get display info
    const displayName = profile?.display_name || user?.displayName || 'Anonymous CEO';
    const photoURL = profile?.photo_url || user?.photoURL;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 mt-16 animate-in">
            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"></div>

            <div className="relative max-w-6xl w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="animate-in slide-in-from-left duration-700">
                        <h1 className="text-7xl font-black text-white tracking-tighter mb-2">AI TYCOON</h1>
                        <div className="flex items-center gap-3">
                            <div className="h-px w-12 bg-cyan-500"></div>
                            <span className="text-cyan-500 font-mono tracking-[0.4em] text-sm uppercase font-bold">Select Active Simulation</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900/40 p-3 pr-6 pl-3 rounded-full border border-white/5 backdrop-blur-xl animate-in slide-in-from-right duration-700">
                        {photoURL ? (
                            <img
                                src={photoURL}
                                className="w-12 h-12 rounded-full border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 object-cover"
                                alt="Profile"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/50 bg-slate-800 flex items-center justify-center">
                                <User className="w-6 h-6 text-slate-500" />
                            </div>
                        )}
                        <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Authenticated As</div>
                            <div className="text-white font-bold text-sm tracking-tight">{displayName}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => selectCompany(company)}
                            className="glass-panel p-8 cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all group relative overflow-hidden h-64 flex flex-col justify-between"
                        >
                            {/* Animated Background Icon */}
                            <Building2 className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 group-hover:text-cyan-500/10 transition-colors duration-500 group-hover:scale-110" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${company.is_sandbox ? 'bg-yellow-500/20 text-yellow-500' : 'bg-cyan-500/20 text-cyan-500'
                                        }`}>
                                        {company.is_sandbox ? 'Sandbox Sector' : 'Career Progression'}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tighter uppercase leading-none truncate">
                                    {company.name}
                                </h3>
                            </div>

                            <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-6">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Liquid Assets</div>
                                    <div className="text-green-400 font-mono font-bold leading-none text-xl">${company.cash.toLocaleString()}</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Timeline</div>
                                    <div className="text-white font-mono font-bold leading-none">W{company.week}/{company.year}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {companies.length < 5 && (
                        <button
                            onClick={() => setShowCreate(true)}
                            className="glass-panel p-8 border-dashed border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20 transition-all group flex flex-col items-center justify-center gap-4 h-64"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 transition-all shadow-xl shadow-black/50">
                                <Plus className="w-8 h-8 text-slate-500 group-hover:text-black" />
                            </div>
                            <div className="text-center">
                                <div className="text-white font-black tracking-tighter uppercase text-xl">Establish Sector</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Available Slots: {5 - companies.length}</div>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Create Modal Overlay */}
            {showCreate && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => !loading && setShowCreate(false)}></div>
                    <div className="relative glass-panel p-10 max-w-md w-full border-cyan-500/20 animate-in scale-in">
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-8 uppercase">Initialize Corp</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 block">Company Nomenclature</label>
                                <input
                                    value={newCompanyName}
                                    onChange={(e) => setNewCompanyName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"
                                    placeholder="e.g. OMNI-RECURSION"
                                />
                            </div>

                            <button
                                onClick={() => setIsSandbox(!isSandbox)}
                                className={`w-full p-5 rounded-2xl border transition-all flex items-center gap-4 group ${isSandbox ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-slate-900/50 border-white/5'
                                    }`}
                            >
                                <div className={`p-3 rounded-xl transition-colors ${isSandbox ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-800 text-slate-500'}`}>
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className={`font-bold uppercase text-xs tracking-wider ${isSandbox ? 'text-white' : 'text-slate-400'}`}>Sandbox Protocol</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Unlimited budget. No neural logs.</div>
                                </div>
                                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSandbox ? 'border-yellow-500 bg-yellow-500' : 'border-slate-800'}`}>
                                    {isSandbox && <ShieldCheck className="w-3 h-3 text-black" />}
                                </div>
                            </button>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowCreate(false)}
                                    disabled={loading}
                                    className="px-6 py-4 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
                                >
                                    ABORT
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'SYNCHRONIZING...' : 'ESTABLISH SECTOR'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanySelector;
