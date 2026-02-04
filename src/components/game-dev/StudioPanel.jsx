import React, { useState } from 'react';
import {
    Building2, Users, Plus, Trash2, DollarSign, Star, TrendingUp,
    ChevronRight, Briefcase, Settings, Crown, Award, UserPlus, X
} from 'lucide-react';
import useGameDevStore, { EMPLOYEE_TYPES, OFFICE_UPGRADES, ENGINES } from '../../store/gameDevStore';

// Employee Card
const EmployeeCard = ({ employee, onFire }) => {
    const empType = EMPLOYEE_TYPES.find(e => e.id === employee.id?.split('-')[0]) || {};

    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex items-center gap-4 group hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl">
                {empType.icon || '👤'}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white">{empType.name || employee.name}</h4>
                <p className="text-xs text-slate-500 capitalize">{empType.category}</p>
            </div>
            <div className="text-right">
                <p className="text-green-400 font-bold text-sm">${(empType.salary || 0).toLocaleString()}/mo</p>
                <p className="text-xs text-slate-600">Morale: {employee.morale || 80}%</p>
            </div>
            <button
                onClick={() => onFire(employee.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

// Hire Modal
const HireModal = ({ onClose, onHire }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { cash } = useGameDevStore();

    const categories = ['all', 'dev', 'art', 'audio', 'writing', 'qa', 'marketing', 'leadership'];

    const filteredEmployees = selectedCategory === 'all'
        ? EMPLOYEE_TYPES
        : EMPLOYEE_TYPES.filter(e => e.category === selectedCategory);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <UserPlus className="w-6 h-6 text-purple-400" />
                        Hire New Team Member
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm capitalize whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Employee Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4">
                    {filteredEmployees.map(emp => (
                        <button
                            key={emp.id}
                            onClick={() => onHire(emp)}
                            disabled={cash < emp.salary}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${cash >= emp.salary
                                    ? 'border-white/5 hover:border-purple-500/50 bg-slate-800/50'
                                    : 'border-red-500/20 bg-red-500/5 opacity-50'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{emp.icon}</span>
                                <div>
                                    <h4 className="font-bold text-white">{emp.name}</h4>
                                    <p className="text-xs text-slate-500 capitalize">{emp.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-green-400 font-bold">${emp.salary.toLocaleString()}/mo</span>
                                <div className="text-xs text-slate-500">
                                    {emp.devBonus && <span className="text-cyan-400">+{(emp.devBonus * 100).toFixed(0)}% Dev</span>}
                                    {emp.qualityBonus && <span className="text-purple-400">+{emp.qualityBonus} Quality</span>}
                                    {emp.hypeBonus && <span className="text-pink-400">+{emp.hypeBonus} Hype</span>}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Studio Switcher
const StudioSwitcher = ({ onClose }) => {
    const { studios, studio, switchStudio, deleteStudio, createStudio } = useGameDevStore();
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEngine, setNewEngine] = useState('unite');

    const handleCreate = () => {
        if (!newName.trim()) return;
        createStudio({ name: newName, engine: newEngine });
        setShowCreate(false);
        setNewName('');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-purple-400" />
                        Your Studios
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {showCreate ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
                            placeholder="New studio name..."
                        />
                        <select
                            value={newEngine}
                            onChange={(e) => setNewEngine(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
                        >
                            {ENGINES.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-4">
                            <button onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-slate-800 rounded-xl text-slate-400">Cancel</button>
                            <button onClick={handleCreate} className="flex-1 py-3 bg-purple-500 rounded-xl text-white font-bold">Create</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {studios.map(s => (
                            <div
                                key={s.id}
                                className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${studio?.id === s.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <button onClick={() => switchStudio(s.id)} className="flex-1 text-left">
                                    <h4 className="font-bold text-white">{s.name}</h4>
                                    <p className="text-xs text-slate-500">{ENGINES.find(e => e.id === s.engine)?.name} • Founded {s.founded}</p>
                                </button>
                                {studios.length > 1 && (
                                    <button
                                        onClick={() => deleteStudio(s.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => setShowCreate(true)}
                            className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-slate-500 hover:text-white hover:border-white/30 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Studio
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Studio Panel
const StudioPanel = () => {
    const {
        studio, employees, officeUpgrades, officeCapacity, fame, cash,
        hireEmployee, fireEmployee, purchaseOfficeUpgrade
    } = useGameDevStore();

    const [showHire, setShowHire] = useState(false);
    const [showStudioSwitch, setShowStudioSwitch] = useState(false);

    const handleHire = (employee) => {
        hireEmployee(employee);
        setShowHire(false);
    };

    const handleUpgrade = (upgradeId) => {
        const result = purchaseOfficeUpgrade(upgradeId);
        if (!result.success) {
            // Could show toast error
        }
    };

    const monthlyPayroll = employees.reduce((sum, emp) => {
        const empType = EMPLOYEE_TYPES.find(e => e.id === emp.id?.split('-')[0]);
        return sum + (empType?.salary || 0);
    }, 0);

    return (
        <div className="p-8 space-y-8">
            {/* Studio Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">{studio?.name}</h1>
                        <p className="text-slate-500">Founded {studio?.founded} • {ENGINES.find(e => e.id === studio?.engine)?.name}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowStudioSwitch(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white flex items-center gap-2"
                >
                    <Settings className="w-4 h-4" />
                    Manage Studios
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Team Size</p>
                    <p className="text-3xl font-black text-white">{employees.length}/{officeCapacity}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Monthly Payroll</p>
                    <p className="text-3xl font-black text-red-400">${monthlyPayroll.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Studio Fame</p>
                    <p className="text-3xl font-black text-yellow-400">{fame}/100</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Reputation</p>
                    <p className="text-3xl font-black text-purple-400">{studio?.reputation || 50}/100</p>
                </div>
            </div>

            {/* Employees Section */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Team Members
                    </h3>
                    <button
                        onClick={() => setShowHire(true)}
                        disabled={employees.length >= officeCapacity}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-xl text-white font-bold flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Hire
                    </button>
                </div>

                {employees.length === 0 ? (
                    <div className="text-center py-12 text-slate-600">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No employees yet. Hire your first team member!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {employees.map(emp => (
                            <EmployeeCard key={emp.id} employee={emp} onFire={fireEmployee} />
                        ))}
                    </div>
                )}
            </div>

            {/* Office Upgrades */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    Office Upgrades
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {OFFICE_UPGRADES.map(upgrade => {
                        const owned = officeUpgrades.includes(upgrade.id);
                        const canAfford = cash >= upgrade.cost;

                        return (
                            <button
                                key={upgrade.id}
                                onClick={() => !owned && handleUpgrade(upgrade.id)}
                                disabled={owned || !canAfford}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${owned
                                        ? 'border-green-500/30 bg-green-500/10'
                                        : canAfford
                                            ? 'border-white/5 hover:border-cyan-500/50'
                                            : 'border-white/5 opacity-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{upgrade.icon}</span>
                                    <h4 className="font-bold text-white">{upgrade.name}</h4>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={owned ? 'text-green-400' : 'text-cyan-400'}>
                                        {owned ? '✓ Owned' : `$${upgrade.cost.toLocaleString()}`}
                                    </span>
                                    {upgrade.capacity > 0 && (
                                        <span className="text-xs text-slate-500">+{upgrade.capacity} capacity</span>
                                    )}
                                    {upgrade.morale > 0 && (
                                        <span className="text-xs text-slate-500">+{upgrade.morale} morale</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Modals */}
            {showHire && <HireModal onClose={() => setShowHire(false)} onHire={handleHire} />}
            {showStudioSwitch && <StudioSwitcher onClose={() => setShowStudioSwitch(false)} />}
        </div>
    );
};

export default StudioPanel;
