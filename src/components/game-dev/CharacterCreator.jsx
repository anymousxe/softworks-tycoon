import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Palette, Calendar, ArrowRight, Sparkles, Eye, Scissors } from 'lucide-react';
import useGameDevStore, { CHARACTER_OPTIONS } from '../../store/gameDevStore';

const CharacterCreator = () => {
    const navigate = useNavigate();
    const createCharacter = useGameDevStore(state => state.createCharacter);

    const [step, setStep] = useState(1);
    const [character, setCharacter] = useState({
        firstName: '',
        lastName: '',
        skinTone: CHARACTER_OPTIONS.skinTones[2].id,
        eyeColor: CHARACTER_OPTIONS.eyeColors[0].id,
        hairStyle: CHARACTER_OPTIONS.hairStyles[0].id,
        hairColor: CHARACTER_OPTIONS.hairColors[1].id,
        shirtColor: CHARACTER_OPTIONS.shirtColors[3].id,
        startingYear: 2024,
        startingAge: 22
    });

    const handleCreate = () => {
        createCharacter(character);
        navigate('/game-dev/studio-setup');
    };

    const getSkinColor = () => CHARACTER_OPTIONS.skinTones.find(s => s.id === character.skinTone)?.color || '#D4A574';
    const getEyeColor = () => CHARACTER_OPTIONS.eyeColors.find(e => e.id === character.eyeColor)?.color || '#4A90D9';
    const getHairColor = () => CHARACTER_OPTIONS.hairColors.find(h => h.id === character.hairColor)?.color || '#4A3728';
    const getShirtColor = () => CHARACTER_OPTIONS.shirtColors.find(s => s.id === character.shirtColor)?.color || '#4169E1';

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Game Dev Tycoon</span>
                    <Sparkles className="w-5 h-5 text-pink-400" />
                </div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-tight">
                    Create Your Developer
                </h1>
            </div>

            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                {/* Preview Panel */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
                    {/* Character Avatar Preview */}
                    <div className="relative mb-6">
                        {/* Body/Shirt */}
                        <div
                            className="w-32 h-24 rounded-t-3xl shadow-lg"
                            style={{ backgroundColor: getShirtColor() }}
                        ></div>
                        {/* Head */}
                        <div
                            className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-28 rounded-full shadow-lg"
                            style={{ backgroundColor: getSkinColor() }}
                        >
                            {/* Hair */}
                            {character.hairStyle !== 'bald' && (
                                <div
                                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-28 h-14 rounded-t-full"
                                    style={{
                                        backgroundColor: getHairColor(),
                                        clipPath: character.hairStyle === 'mohawk'
                                            ? 'polygon(40% 0%, 60% 0%, 65% 100%, 35% 100%)'
                                            : character.hairStyle === 'spiky'
                                                ? 'polygon(0% 100%, 20% 20%, 40% 80%, 50% 0%, 60% 80%, 80% 20%, 100% 100%)'
                                                : undefined
                                    }}
                                ></div>
                            )}
                            {/* Eyes */}
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex gap-6">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getEyeColor() }}
                                ></div>
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getEyeColor() }}
                                ></div>
                            </div>
                            {/* Mouth */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-pink-600/50 rounded-full"></div>
                        </div>
                    </div>

                    {/* Name Display */}
                    <h2 className="text-2xl font-black text-white uppercase mt-8">
                        {character.firstName || 'First'} {character.lastName || 'Last'}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Age {character.startingAge} • Started in {character.startingYear}
                    </p>
                </div>

                {/* Customization Panel */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-purple-400" />
                                <h3 className="text-xl font-bold text-white">Identity</h3>
                            </div>

                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={character.firstName}
                                    onChange={(e) => setCharacter({ ...character, firstName: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Enter first name..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={character.lastName}
                                    onChange={(e) => setCharacter({ ...character, lastName: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Enter last name..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Starting Year</label>
                                    <select
                                        value={character.startingYear}
                                        onChange={(e) => setCharacter({ ...character, startingYear: parseInt(e.target.value) })}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        {Array.from({ length: 27 }, (_, i) => 2000 + i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Starting Age</label>
                                    <select
                                        value={character.startingAge}
                                        onChange={(e) => setCharacter({ ...character, startingAge: parseInt(e.target.value) })}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        {Array.from({ length: 13 }, (_, i) => 18 + i).map(age => (
                                            <option key={age} value={age}>{age}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!character.firstName || !character.lastName}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <span>Customize Appearance</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-4">
                                <Palette className="w-6 h-6 text-pink-400" />
                                <h3 className="text-xl font-bold text-white">Appearance</h3>
                            </div>

                            {/* Skin Tone */}
                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Skin Tone</label>
                                <div className="flex gap-2 flex-wrap">
                                    {CHARACTER_OPTIONS.skinTones.map(skin => (
                                        <button
                                            key={skin.id}
                                            onClick={() => setCharacter({ ...character, skinTone: skin.id })}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${character.skinTone === skin.id ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: skin.color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Eye Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Eye className="w-3 h-3" /> Eye Color
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {CHARACTER_OPTIONS.eyeColors.map(eye => (
                                        <button
                                            key={eye.id}
                                            onClick={() => setCharacter({ ...character, eyeColor: eye.id })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${character.eyeColor === eye.id ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: eye.color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Hair Style */}
                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Scissors className="w-3 h-3" /> Hair Style
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {CHARACTER_OPTIONS.hairStyles.map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => setCharacter({ ...character, hairStyle: style.id })}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${character.hairStyle === style.id ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                        >
                                            {style.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Hair Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Hair Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {CHARACTER_OPTIONS.hairColors.map(hair => (
                                        <button
                                            key={hair.id}
                                            onClick={() => setCharacter({ ...character, hairColor: hair.id })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${character.hairColor === hair.id ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ background: hair.color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Shirt Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Shirt Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {CHARACTER_OPTIONS.shirtColors.map(shirt => (
                                        <button
                                            key={shirt.id}
                                            onClick={() => setCharacter({ ...character, shirtColor: shirt.id })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${character.shirtColor === shirt.id ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: shirt.color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Create Developer</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterCreator;
