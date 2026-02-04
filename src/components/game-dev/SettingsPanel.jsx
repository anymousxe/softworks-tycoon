import React, { useState } from 'react';
import {
    Settings, Volume2, VolumeX, Bell, BellOff, Moon, Sun, Save,
    RefreshCw, Download, Upload, Trash2, User, AlertTriangle, Check,
    Clock, Zap, MonitorSmartphone, RotateCcw, LogOut
} from 'lucide-react';
import useGameDevStore, { DEFAULT_SETTINGS } from '../../store/gameDevStore';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
        <div>
            <h4 className="font-bold text-white">{label}</h4>
            {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`w-14 h-8 rounded-full p-1 transition-all ${enabled ? 'bg-purple-500' : 'bg-slate-700'}`}
        >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${enabled ? 'translate-x-6' : ''}`} />
        </button>
    </div>
);

// Slider Component
const SliderSetting = ({ value, onChange, label, min = 0, max = 1, step = 0.1 }) => (
    <div className="p-4 bg-slate-800/50 rounded-xl">
        <div className="flex justify-between mb-2">
            <h4 className="font-bold text-white">{label}</h4>
            <span className="text-purple-400 font-bold">{Math.round(value * 100)}%</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
        />
    </div>
);

// Confirm Modal
const ConfirmModal = ({ title, message, onConfirm, onCancel, danger = false }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
        <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
            <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${danger ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                <AlertTriangle className={`w-8 h-8 ${danger ? 'text-red-400' : 'text-purple-400'}`} />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">{title}</h2>
            <p className="text-slate-400 text-center mb-8">{message}</p>
            <div className="flex gap-4">
                <button onClick={onCancel} className="flex-1 py-3 bg-slate-800 rounded-xl text-slate-400 font-bold">Cancel</button>
                <button
                    onClick={onConfirm}
                    className={`flex-1 py-3 rounded-xl text-white font-bold ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

// Main Settings Panel
const SettingsPanel = () => {
    const { settings, updateSettings, resetGameDev, character } = useGameDevStore();
    const { logout: authLogout } = useAuthStore();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('game');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        resetGameDev();
        setShowResetConfirm(false);
        navigate('/game-dev');
    };

    const handleLogout = async () => {
        await authLogout();
        navigate('/');
    };

    const handleExportSave = () => {
        const data = localStorage.getItem('game-dev-tycoon-storage');
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `softworks-tycoon-save-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportSave = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        localStorage.setItem('game-dev-tycoon-storage', e.target.result);
                        window.location.reload();
                    } catch (err) {
                        alert('Invalid save file');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const tabs = [
        { id: 'game', name: 'Game', icon: Zap },
        { id: 'audio', name: 'Audio', icon: Volume2 },
        { id: 'display', name: 'Display', icon: MonitorSmartphone },
        { id: 'account', name: 'Account', icon: User },
        { id: 'data', name: 'Data', icon: Save }
    ];

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Settings</h1>
                        <p className="text-slate-500">Customize your game experience</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                >
                    {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {saved ? 'Saved!' : 'Save Settings'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-900/50 p-2 rounded-2xl">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                                ? 'bg-purple-500 text-white'
                                : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Settings Content */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                {/* Game Settings */}
                {activeTab === 'game' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-400" />
                            Game Settings
                        </h3>

                        <div className="p-4 bg-slate-800/50 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-white">Autosave Interval</h4>
                                <span className="text-purple-400 font-bold">{settings.autosaveInterval} minutes</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={settings.autosaveInterval}
                                onChange={(e) => updateSettings({ autosaveInterval: parseInt(e.target.value) })}
                                className="w-full accent-purple-500"
                            />
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-white">Time Speed</h4>
                                <span className="text-purple-400 font-bold">{settings.timeSpeed}x</span>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(speed => (
                                    <button
                                        key={speed}
                                        onClick={() => updateSettings({ timeSpeed: speed })}
                                        className={`flex-1 py-2 rounded-lg font-bold ${settings.timeSpeed === speed
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-slate-700 text-slate-400'
                                            }`}
                                    >
                                        {speed}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ToggleSwitch
                            enabled={settings.notificationsEnabled}
                            onChange={(v) => updateSettings({ notificationsEnabled: v })}
                            label="Notifications"
                            description="Show in-game event notifications"
                        />

                        <ToggleSwitch
                            enabled={settings.showTutorialTips}
                            onChange={(v) => updateSettings({ showTutorialTips: v })}
                            label="Tutorial Tips"
                            description="Show helpful tips during gameplay"
                        />
                    </div>
                )}

                {/* Audio Settings */}
                {activeTab === 'audio' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-cyan-400" />
                            Audio Settings
                        </h3>

                        <ToggleSwitch
                            enabled={settings.soundEnabled}
                            onChange={(v) => updateSettings({ soundEnabled: v })}
                            label="Sound Effects"
                            description="Enable/disable all sound effects"
                        />

                        <SliderSetting
                            value={settings.musicVolume}
                            onChange={(v) => updateSettings({ musicVolume: v })}
                            label="Music Volume"
                        />

                        <SliderSetting
                            value={settings.sfxVolume}
                            onChange={(v) => updateSettings({ sfxVolume: v })}
                            label="SFX Volume"
                        />
                    </div>
                )}

                {/* Display Settings */}
                {activeTab === 'display' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <MonitorSmartphone className="w-5 h-5 text-green-400" />
                            Display Settings
                        </h3>

                        <ToggleSwitch
                            enabled={settings.darkMode}
                            onChange={(v) => updateSettings({ darkMode: v })}
                            label="Dark Mode"
                            description="Use dark theme (always on for now)"
                        />

                        <ToggleSwitch
                            enabled={settings.compactUI}
                            onChange={(v) => updateSettings({ compactUI: v })}
                            label="Compact UI"
                            description="Use smaller UI elements"
                        />
                    </div>
                )}

                {/* Account Settings */}
                {activeTab === 'account' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-pink-400" />
                            Account
                        </h3>

                        {character && (
                            <div className="p-6 bg-slate-800/50 rounded-xl flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                                    {character.firstName?.[0]}{character.lastName?.[0]}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">{character.firstName} {character.lastName}</h4>
                                    <p className="text-slate-500 text-sm">Started in {character.startingYear} • Age {character.startingAge}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full p-4 bg-slate-800/50 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-all text-left"
                        >
                            <LogOut className="w-6 h-6 text-slate-400" />
                            <div>
                                <h4 className="font-bold text-white">Log Out</h4>
                                <p className="text-xs text-slate-500">Return to login screen</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Data Settings */}
                {activeTab === 'data' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Save className="w-5 h-5 text-amber-400" />
                            Data Management
                        </h3>

                        <button
                            onClick={handleExportSave}
                            className="w-full p-4 bg-slate-800/50 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-all"
                        >
                            <Download className="w-6 h-6 text-green-400" />
                            <div className="text-left">
                                <h4 className="font-bold text-white">Export Save</h4>
                                <p className="text-xs text-slate-500">Download your save file as JSON</p>
                            </div>
                        </button>

                        <button
                            onClick={handleImportSave}
                            className="w-full p-4 bg-slate-800/50 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-all"
                        >
                            <Upload className="w-6 h-6 text-blue-400" />
                            <div className="text-left">
                                <h4 className="font-bold text-white">Import Save</h4>
                                <p className="text-xs text-slate-500">Load a save file from your computer</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-4 hover:bg-red-500/20 transition-all"
                        >
                            <Trash2 className="w-6 h-6 text-red-400" />
                            <div className="text-left">
                                <h4 className="font-bold text-red-400">Reset All Progress</h4>
                                <p className="text-xs text-slate-500">Delete all save data and start fresh</p>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Confirm Modals */}
            {showResetConfirm && (
                <ConfirmModal
                    title="Reset All Progress?"
                    message="This will delete ALL your save data including characters, studios, games, and achievements. This cannot be undone!"
                    onConfirm={handleReset}
                    onCancel={() => setShowResetConfirm(false)}
                    danger
                />
            )}
            {showLogoutConfirm && (
                <ConfirmModal
                    title="Log Out?"
                    message="You'll be returned to the login screen. Your progress is saved."
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutConfirm(false)}
                />
            )}
        </div>
    );
};

export default SettingsPanel;
