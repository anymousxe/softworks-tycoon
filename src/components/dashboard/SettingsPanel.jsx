import React, { useState } from 'react';
import { Settings, User, Volume2, Monitor, Moon, Sun, Bell, Globe, Shield, Trash2, Save, LogOut, Download, Upload } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SettingsPanel = () => {
    const { activeCompany, reset, logout } = useGameStore();
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        theme: 'dark',
        soundEnabled: true,
        notificationsEnabled: true,
        autoAdvanceWeek: false,
        showParamsExact: true,
        language: 'en'
    });

    const handleSave = () => {
        localStorage.setItem('game_settings', JSON.stringify(settings));
        toast.success('Settings saved!');
    };

    const handleExport = () => {
        const data = JSON.stringify({ company: activeCompany, settings });
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeCompany?.name || 'save'}_backup.json`;
        a.click();
        toast.success('Game exported!');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out');
    };

    const handleResetGame = () => {
        if (window.confirm('Are you sure? This will delete ALL your companies and progress!')) {
            reset();
            navigate('/');
            toast.success('Game reset');
        }
    };

    return (
        <div className="animate-in space-y-10 max-w-3xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Settings</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Configuration</p>
                </div>
            </div>

            {/* Display Settings */}
            <div className="glass-panel p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <Monitor className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Display</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white text-sm">Theme</div>
                            <div className="text-[10px] text-slate-500">Game appearance</div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                                className={`p-2 rounded-lg transition-all ${settings.theme === 'dark' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400'}`}
                            >
                                <Moon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setSettings({ ...settings, theme: 'light' })}
                                className={`p-2 rounded-lg transition-all ${settings.theme === 'light' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400'}`}
                            >
                                <Sun className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white text-sm">Parameter Display</div>
                            <div className="text-[10px] text-slate-500">Show exact or range for all models</div>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, showParamsExact: !settings.showParamsExact })}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${settings.showParamsExact ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400'}`}
                        >
                            {settings.showParamsExact ? 'Exact' : 'Range'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Audio & Notifications */}
            <div className="glass-panel p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Notifications</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white text-sm">Sound Effects</div>
                            <div className="text-[10px] text-slate-500">Enable game sounds</div>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                            className={`w-12 h-6 rounded-full transition-all relative ${settings.soundEnabled ? 'bg-cyan-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${settings.soundEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white text-sm">Notifications</div>
                            <div className="text-[10px] text-slate-500">Competitor releases, training alerts</div>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                            className={`w-12 h-6 rounded-full transition-all relative ${settings.notificationsEnabled ? 'bg-cyan-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${settings.notificationsEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white text-sm">Auto-Advance Week</div>
                            <div className="text-[10px] text-slate-500">Automatically advance every 5 seconds</div>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, autoAdvanceWeek: !settings.autoAdvanceWeek })}
                            className={`w-12 h-6 rounded-full transition-all relative ${settings.autoAdvanceWeek ? 'bg-cyan-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${settings.autoAdvanceWeek ? 'right-0.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="glass-panel p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Data Management</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleExport}
                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all flex items-center gap-3"
                    >
                        <Download className="w-5 h-5 text-green-400" />
                        <div className="text-left">
                            <div className="font-bold text-green-400 text-sm">Export Save</div>
                            <div className="text-[10px] text-slate-500">Download your progress</div>
                        </div>
                    </button>

                    <button
                        onClick={handleSave}
                        className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center gap-3"
                    >
                        <Save className="w-5 h-5 text-cyan-400" />
                        <div className="text-left">
                            <div className="font-bold text-cyan-400 text-sm">Save Settings</div>
                            <div className="text-[10px] text-slate-500">Save your preferences</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-panel p-8 space-y-6 border-red-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <h2 className="text-xl font-black text-red-400 uppercase tracking-tight">Danger Zone</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleLogout}
                        className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all flex items-center gap-3"
                    >
                        <LogOut className="w-5 h-5 text-yellow-400" />
                        <div className="text-left">
                            <div className="font-bold text-yellow-400 text-sm">Logout</div>
                            <div className="text-[10px] text-slate-500">Switch companies</div>
                        </div>
                    </button>

                    <button
                        onClick={handleResetGame}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-3"
                    >
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <div className="text-left">
                            <div className="font-bold text-red-400 text-sm">Reset Everything</div>
                            <div className="text-[10px] text-slate-500">Delete all progress</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Version Info */}
            <div className="text-center text-slate-600 text-[10px] font-mono uppercase tracking-widest">
                Softworks Tycoon v3.0.0 • Made by anymousxe
            </div>
        </div>
    );
};

export default SettingsPanel;
