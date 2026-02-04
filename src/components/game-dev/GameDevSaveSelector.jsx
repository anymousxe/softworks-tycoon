import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Plus, Clock, Trash2, Play, AlertTriangle } from 'lucide-react';
import useGameDevStore from '../../store/gameDevStore';
import toast from 'react-hot-toast';

const GameDevSaveSelector = () => {
    const navigate = useNavigate();
    const { saves, loadSave, createCharacter, deleteSave } = useGameDevStore();

    const handleLoadSave = (saveId) => {
        loadSave(saveId);
        navigate('/game-dev/dashboard');
    };

    const handleNewGame = () => {
        createCharacter({
            firstName: '', lastName: '', startingYear: 2024, startingAge: 20,
            skinTone: 'medium', eyeColor: 'blue', hairStyle: 'short', hairColor: 'dark', shirtColor: 'black'
        }); // Initial dummy data to trigger reset, will be properly set in CharacterCreator
        navigate('/game-dev/character');
    };

    const handleDeleteSave = (e, saveId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this save? This cannot be undone.')) {
            deleteSave(saveId);
            toast.success('Save deleted');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Gamepad2 className="w-10 h-10 text-purple-400" />
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tighter uppercase">
                            Game Dev Tycoon
                        </h1>
                    </div>
                    <p className="text-slate-500 font-mono text-xs tracking-[0.3em] uppercase">
                        Select Save File
                    </p>
                </div>

                {/* Save Slots */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Game Card */}
                    <button
                        onClick={handleNewGame}
                        className="group relative h-48 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white font-bold uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                            New Game
                        </span>
                    </button>

                    {/* Existing Saves */}
                    {saves.map((save) => (
                        <div
                            key={save.id}
                            onClick={() => handleLoadSave(save.id)}
                            className="group relative h-48 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col justify-between text-left transition-all duration-300 hover:border-white/20 hover:scale-[1.02] cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                        {save.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                        <Clock className="w-3 h-3" />
                                        {new Date(save.lastPlayed).toLocaleDateString()} {new Date(save.lastPlayed).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-purple-400 fill-current" />
                                </div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-400">
                                        Date: <span className="text-white">Y{save.data.currentYear} M{save.data.currentMonth}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        Cash: <span className="text-green-400">${save.data.cash?.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        Studio: <span className="text-white">{save.data.studios.length} Active</span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDeleteSave(e, save.id)}
                                    className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Delete Save"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameDevSaveSelector;
