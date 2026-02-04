import React, { useState } from 'react';
import {
    Settings, Calendar, Tag, DollarSign, Star, Users, Download,
    Play, Plus, ChevronRight, Trophy, Package, Sparkles
} from 'lucide-react';
import useGameDevStore, { GENRES, PUBLISHERS } from '../../store/gameDevStore';

// Mist Store Page (Steam parody)
const MistStorePage = ({ game, onClose }) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const genre = GENRES.find(g => g.id === game.genre);
    const releaseDate = game.releasedAt
        ? `${monthNames[game.releasedAt.month - 1]} ${game.releasedAt.year}`
        : 'Coming Soon';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-[#1b2838] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header with Mist branding */}
                <div className="bg-gradient-to-r from-[#1b2838] to-[#2a475e] p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <Settings className="w-8 h-8 text-white" />
                        <span className="text-2xl font-bold text-white tracking-wider">MIST</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Game Header */}
                <div className="p-6 bg-gradient-to-b from-[#2a475e] to-[#1b2838]">
                    <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {genre?.name || 'Game'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {releaseDate}
                        </span>
                    </div>
                </div>

                {/* Screenshots placeholder */}
                <div className="px-6 py-4">
                    <div className="bg-[#0a0f14] rounded-lg aspect-video flex items-center justify-center">
                        <div className="text-center">
                            <Play className="w-16 h-16 text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm">Game Screenshots & Trailer</p>
                        </div>
                    </div>
                </div>

                {/* Game Info Grid */}
                <div className="grid grid-cols-3 gap-6 px-6 py-4">
                    {/* Description */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-bold text-white mb-3">About This Game</h3>
                        <p className="text-slate-400 leading-relaxed">
                            {game.description || 'An exciting new game that promises hours of entertainment. Explore vast worlds, complete challenging quests, and become a legend.'}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="px-3 py-1 bg-[#2a475e] text-slate-300 text-xs rounded-full">
                                {genre?.name}
                            </span>
                            <span className="px-3 py-1 bg-[#2a475e] text-slate-300 text-xs rounded-full">
                                Singleplayer
                            </span>
                            <span className="px-3 py-1 bg-[#2a475e] text-slate-300 text-xs rounded-full">
                                Controller Support
                            </span>
                        </div>
                    </div>

                    {/* Purchase Box */}
                    <div className="bg-[#0a0f14] rounded-lg p-4">
                        <div className="mb-4">
                            <p className="text-slate-500 text-xs uppercase mb-1">Developer</p>
                            <p className="text-white font-bold">{game.studio || 'Your Studio'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-slate-500 text-xs uppercase mb-1">Publisher</p>
                            <p className="text-white font-bold">{game.publisher?.name || 'Self-Published'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-slate-500 text-xs uppercase mb-1">Release Date</p>
                            <p className="text-white font-bold">{releaseDate}</p>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-slate-400">Price</span>
                                <span className="text-3xl font-black text-green-400">
                                    ${(game.editions?.[0]?.price || 29.99).toFixed(2)}
                                </span>
                            </div>
                            <button className="w-full py-3 bg-green-600 hover:bg-green-500 rounded font-bold text-white transition-colors">
                                Add to Cart
                            </button>
                            <button className="w-full py-2 mt-2 text-slate-400 hover:text-white text-sm transition-colors">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editions */}
                {game.editions && game.editions.length > 1 && (
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Available Editions
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {game.editions.map((edition, i) => (
                                <div key={i} className="bg-[#0a0f14] rounded-lg p-4 border border-white/5">
                                    <h4 className="font-bold text-white">{edition.name}</h4>
                                    <p className="text-green-400 font-bold mt-2">${edition.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DLCs */}
                {game.dlcs && game.dlcs.length > 0 && (
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Downloadable Content
                        </h3>
                        <div className="space-y-2">
                            {game.dlcs.map((dlc, i) => (
                                <div key={i} className="bg-[#0a0f14] rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white">{dlc.name}</h4>
                                        <p className="text-slate-500 text-sm">{dlc.description}</p>
                                    </div>
                                    <span className="text-green-400 font-bold">${dlc.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="px-6 py-4 bg-[#0a0f14] mt-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-black text-white">{(game.sales || 0).toLocaleString()}</p>
                            <p className="text-slate-500 text-xs">Copies Sold</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-yellow-400">{game.rating || 0}/100</p>
                            <p className="text-slate-500 text-xs">Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-green-400">${(game.revenue || 0).toLocaleString()}</p>
                            <p className="text-slate-500 text-xs">Revenue</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-purple-400">{game.reviews?.length || 0}</p>
                            <p className="text-slate-500 text-xs">Reviews</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mist Panel for Dashboard
const MistPanel = () => {
    const { releasedGames, currentGame, releaseGame, studio } = useGameDevStore();
    const [selectedGame, setSelectedGame] = useState(null);
    const [showRelease, setShowRelease] = useState(false);
    const [releaseConfig, setReleaseConfig] = useState({
        publisher: 'self',
        price: 29.99
    });

    const handleRelease = () => {
        if (currentGame && currentGame.status === 'ready') {
            releaseGame(currentGame.id, releaseConfig.publisher, releaseConfig.price);
            setShowRelease(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Settings className="w-10 h-10 text-white" />
                <div>
                    <h1 className="text-3xl font-black text-white">MIST STORE</h1>
                    <p className="text-slate-500 text-sm">Publish and manage your games</p>
                </div>
            </div>

            {/* Ready to Release */}
            {currentGame && currentGame.status === 'ready' && (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-green-400" />
                                Ready to Release!
                            </h3>
                            <p className="text-slate-400">{currentGame.name} is complete and ready for the world.</p>
                        </div>
                        <button
                            onClick={() => setShowRelease(true)}
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-white flex items-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Publish on Mist
                        </button>
                    </div>
                </div>
            )}

            {/* Release Modal */}
            {showRelease && currentGame && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">Publish {currentGame.name}</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase mb-2">Publisher</label>
                                <div className="space-y-2">
                                    {PUBLISHERS.map(pub => (
                                        <button
                                            key={pub.id}
                                            onClick={() => setReleaseConfig({ ...releaseConfig, publisher: pub.id })}
                                            className={`w-full p-3 rounded-xl border-2 text-left transition-all ${releaseConfig.publisher === pub.id
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <p className="font-bold text-white">{pub.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {pub.cut === 0 ? 'No cut' : `${pub.cut * 100}% cut`} •
                                                {pub.reachBonus === 0 ? ' No reach bonus' : ` ${pub.reachBonus}x reach`}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] text-slate-500 uppercase mb-2">Price</label>
                                <input
                                    type="number"
                                    value={releaseConfig.price}
                                    onChange={(e) => setReleaseConfig({ ...releaseConfig, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowRelease(false)}
                                    className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRelease}
                                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-white"
                                >
                                    Release Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Released Games */}
            <h3 className="text-xl font-bold text-white mb-4">Your Games on Mist</h3>
            {releasedGames.length === 0 ? (
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-12 text-center">
                    <Settings className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No games published yet</p>
                    <p className="text-slate-600 text-sm">Complete a game and publish it here</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {releasedGames.map(game => {
                        const genre = GENRES.find(g => g.id === game.genre);
                        return (
                            <button
                                key={game.id}
                                onClick={() => setSelectedGame(game)}
                                className="bg-slate-900/50 border border-white/5 hover:border-purple-500/50 rounded-2xl overflow-hidden text-left transition-all group"
                            >
                                {/* Placeholder image */}
                                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                    <span className="text-6xl">{genre?.icon}</span>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">{game.name}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-green-400 font-bold">
                                            ${(game.editions?.[0]?.price || 29.99).toFixed(2)}
                                        </span>
                                        <span className="text-slate-500 text-sm">
                                            {(game.sales || 0).toLocaleString()} sold
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Game Detail Modal */}
            {selectedGame && (
                <MistStorePage game={{ ...selectedGame, studio: studio?.name }} onClose={() => setSelectedGame(null)} />
            )}
        </div>
    );
};

export default MistPanel;
