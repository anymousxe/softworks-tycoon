import React, { useState } from 'react';
import {
    Store, ShoppingBag, Percent, Globe, Star, CheckCircle2, Clock,
    ArrowRight, ExternalLink, DollarSign, Users, TrendingUp, Shield,
    Sparkles, Crown, Gift, X, AlertTriangle
} from 'lucide-react';
import useGameDevStore, { STORE_PLATFORMS, SUBSCRIPTION_SERVICES } from '../../store/gameDevStore';

// Platform Card
const PlatformCard = ({ platform, isActive, onSelect, gameCount }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 border-blue-500/30',
        purple: 'from-purple-500 to-purple-600 border-purple-500/30',
        cyan: 'from-cyan-500 to-cyan-600 border-cyan-500/30',
        green: 'from-green-500 to-green-600 border-green-500/30',
        amber: 'from-amber-500 to-amber-600 border-amber-500/30',
        pink: 'from-pink-500 to-pink-600 border-pink-500/30',
        red: 'from-red-500 to-red-600 border-red-500/30'
    };

    const classes = colorClasses[platform.color] || colorClasses.blue;

    return (
        <div
            onClick={onSelect}
            className={`relative p-6 rounded-3xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden group ${isActive
                ? `bg-gradient-to-br ${classes} border-transparent shadow-lg shadow-${platform.color}-500/20`
                : 'bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-white/20 hover:bg-slate-900/60'
                }`}
        >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${platform.color}-500/10 rounded-full blur-[50px] transition-opacity group-hover:opacity-100 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

            {/* Icon */}
            <div className={`relative w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-110 ${isActive ? 'bg-white/20 backdrop-blur-md' : 'bg-slate-800 border border-white/5'
                }`}>
                {platform.icon}
            </div>

            {/* Info */}
            <h3 className={`relative text-2xl font-black ${isActive ? 'text-white' : 'text-white'}`}>{platform.name}</h3>
            <p className={`relative text-sm mt-2 font-medium ${isActive ? 'text-white/90' : 'text-slate-500'}`}>{platform.desc}</p>

            {/* Stats */}
            <div className={`relative flex items-center gap-6 mt-6 pt-6 border-t ${isActive ? 'border-white/20' : 'border-white/5'}`}>
                <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white/70' : 'text-slate-500'}`}>Revenue Cut</p>
                    <p className={`text-xl font-black ${isActive ? 'text-white' : 'text-slate-200'}`}>{(platform.cut * 100).toFixed(0)}%</p>
                </div>
                <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white/70' : 'text-slate-500'}`}>Reach</p>
                    <p className={`text-xl font-black ${isActive ? 'text-white' : 'text-slate-200'}`}>{(platform.reach * 100).toFixed(0)}%</p>
                </div>
                {gameCount > 0 && (
                    <div className="ml-auto">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-400'}`}>
                            {gameCount} games
                        </span>
                    </div>
                )}
            </div>

            {/* Special badges */}
            {platform.isPiracy && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-bold uppercase tracking-wider">
                    Piracy
                </div>
            )}
            {platform.exclusivityBonus && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500/20 border border-purple-500/20 rounded-lg text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                    Exclusivity
                </div>
            )}
        </div>
    );
};

// Subscription Service Card
const SubscriptionCard = ({ service, isApplied, onApply, eligible }) => {
    return (
        <div className={`p-6 rounded-2xl border-2 transition-all ${isApplied
            ? 'bg-green-500/10 border-green-500/50'
            : eligible
                ? 'bg-slate-800/50 border-white/5 hover:border-purple-500/30'
                : 'bg-slate-800/30 border-white/5 opacity-50'
            }`}>
            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${isApplied ? 'bg-green-500/20' : 'bg-slate-700'
                    }`}>
                    {service.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{service.desc}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                <div>
                    <p className="text-[10px] text-slate-600 uppercase">Monthly Payout</p>
                    <p className="font-bold text-green-400">${service.monthlyPayout}/player</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-600 uppercase">Reach Bonus</p>
                    <p className="font-bold text-cyan-400">{service.reachBonus}x</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-600 uppercase">Requirements</p>
                    <p className="font-bold text-slate-400">{service.requirements.minQuality}+ quality</p>
                </div>
            </div>

            {!isApplied && (
                <button
                    onClick={onApply}
                    disabled={!eligible}
                    className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${eligible
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {eligible ? 'Apply Now' : 'Not Eligible'}
                </button>
            )}
            {isApplied && (
                <div className="flex items-center justify-center gap-2 mt-4 py-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    Applied
                </div>
            )}
        </div>
    );
};

// Release Game Modal
const ReleaseModal = ({ game, onClose, onRelease }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState(['mist']);

    const togglePlatform = (platformId) => {
        if (selectedPlatforms.includes(platformId)) {
            if (selectedPlatforms.length > 1) {
                setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
            }
        } else {
            setSelectedPlatforms([...selectedPlatforms, platformId]);
        }
    };

    const totalCut = selectedPlatforms.reduce((max, p) => {
        const platform = STORE_PLATFORMS.find(sp => sp.id === p);
        return Math.max(max, platform?.cut || 0);
    }, 0);

    const totalReach = selectedPlatforms.reduce((sum, p) => {
        const platform = STORE_PLATFORMS.find(sp => sp.id === p);
        return sum + (platform?.reach || 0);
    }, 0);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Store className="w-6 h-6 text-purple-400" />
                        Release "{game.name}" to Stores
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <p className="text-slate-400 mb-6">Select the platforms where you want to release your game:</p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {STORE_PLATFORMS.map(platform => (
                        <button
                            key={platform.id}
                            onClick={() => togglePlatform(platform.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPlatforms.includes(platform.id)
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{platform.icon}</span>
                                <div>
                                    <h4 className="font-bold text-white">{platform.name}</h4>
                                    <p className="text-xs text-slate-500">{(platform.cut * 100).toFixed(0)}% cut</p>
                                </div>
                                {selectedPlatforms.includes(platform.id) && (
                                    <CheckCircle2 className="w-5 h-5 text-purple-400 ml-auto" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-white mb-4">Release Summary</h4>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-[10px] text-slate-600 uppercase">Platforms</p>
                            <p className="text-2xl font-black text-white">{selectedPlatforms.length}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-600 uppercase">Max Rev Cut</p>
                            <p className="text-2xl font-black text-red-400">{(totalCut * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-600 uppercase">Total Reach</p>
                            <p className="text-2xl font-black text-green-400">{(totalReach * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 bg-slate-800 rounded-xl text-slate-400 font-bold">Cancel</button>
                    <button
                        onClick={() => onRelease(selectedPlatforms)}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover:opacity-90 transition-all"
                    >
                        Release Game 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Stores Panel
const StoresPanel = () => {
    const { releasedGames, currentGame, releaseGame, releaseOnPlatform, applyToSubscription, fame, setModSupport, setPiracyProtection } = useGameDevStore();
    const [selectedPlatform, setSelectedPlatform] = useState('mist');
    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    // Get games per platform
    const getGamesOnPlatform = (platformId) => {
        return releasedGames.filter(g => g.platforms?.includes(platformId)).length;
    };

    // Get games eligible for subscription
    const getEligibleGames = (service) => {
        return releasedGames.filter(g =>
            g.quality >= service.requirements.minQuality &&
            fame >= service.requirements.minFame &&
            !g.subscriptions?.includes(service.id)
        );
    };

    const handleRelease = (platforms) => {
        if (currentGame && currentGame.status === 'ready') {
            releaseGame(currentGame.id, 'self', currentGame.editions[0]?.price || 29.99, platforms);
        }
        setShowReleaseModal(false);
    };

    const handleSubscriptionApply = (gameId, serviceId) => {
        const result = applyToSubscription(gameId, serviceId);
        // Could show toast based on result
    };

    const handleAddPlatform = (gameId, platformId) => {
        releaseOnPlatform(gameId, platformId);
        // Refresh selected game data
        setSelectedGame(releasedGames.find(g => g.id === gameId));
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">Store Platforms</h1>
                    <p className="text-slate-500">Distribute your games worldwide</p>
                </div>
            </div>

            {/* Ready to Release Banner */}
            {currentGame && currentGame.status === 'ready' && (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{currentGame.name} is Ready!</h3>
                        <p className="text-green-400 text-sm">Your game is complete and ready to be released</p>
                    </div>
                    <button
                        onClick={() => setShowReleaseModal(true)}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-bold"
                    >
                        Release Now
                    </button>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <ShoppingBag className="w-8 h-8 text-blue-400 mb-2" />
                    <p className="text-4xl font-black text-white">{releasedGames.length}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Games Released</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <Globe className="w-8 h-8 text-purple-400 mb-2" />
                    <p className="text-4xl font-black text-purple-400">{STORE_PLATFORMS.length}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Platforms Available</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <Users className="w-8 h-8 text-green-400 mb-2" />
                    <p className="text-4xl font-black text-green-400">
                        {releasedGames.reduce((sum, g) => sum + (g.sales || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">Total Sales</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <DollarSign className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-4xl font-black text-amber-400">
                        ${(releasedGames.reduce((sum, g) => sum + (g.revenue || 0), 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">Total Revenue</p>
                </div>
            </div>

            {/* Platform Grid */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Store className="w-5 h-5 text-blue-400" />
                    Store Platforms
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STORE_PLATFORMS.map(platform => (
                        <PlatformCard
                            key={platform.id}
                            platform={platform}
                            isActive={selectedPlatform === platform.id}
                            onSelect={() => setSelectedPlatform(platform.id)}
                            gameCount={getGamesOnPlatform(platform.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Subscription Services */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Subscription Services
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {SUBSCRIPTION_SERVICES.map(service => {
                        const eligibleGames = getEligibleGames(service);
                        const hasApplied = releasedGames.some(g => g.subscriptions?.includes(service.id));

                        return (
                            <SubscriptionCard
                                key={service.id}
                                service={service}
                                isApplied={hasApplied}
                                eligible={eligibleGames.length > 0}
                                onApply={() => {
                                    if (eligibleGames.length > 0) {
                                        handleSubscriptionApply(eligibleGames[0].id, service.id);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Released Games on Selected Platform */}
            {releasedGames.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-purple-400" />
                        Your Games on {STORE_PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {releasedGames.filter(g => g.platforms?.includes(selectedPlatform)).map(game => (
                            <button
                                key={game.id}
                                onClick={() => setSelectedGame(game)}
                                className="bg-slate-800/50 border border-white/5 hover:border-purple-500/50 rounded-2xl p-6 text-left transition-all"
                            >
                                <h4 className="text-lg font-bold text-white mb-2">{game.name}</h4>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-green-400">{(game.sales || 0).toLocaleString()} sales</span>
                                    <span className="text-amber-400">${(game.revenue || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {game.platforms?.map(p => (
                                        <span key={p} className="px-2 py-1 bg-slate-700 rounded text-[10px] text-slate-400">
                                            {STORE_PLATFORMS.find(sp => sp.id === p)?.icon}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        ))}
                        {releasedGames.filter(g => g.platforms?.includes(selectedPlatform)).length === 0 && (
                            <div className="col-span-full text-center py-8 text-slate-600">
                                No games on this platform yet
                            </div>
                        )}

                        {/* Game Details Modal */}
                        {selectedGame && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                                <div className="bg-slate-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white">{selectedGame.name}</h2>
                                        <button onClick={() => setSelectedGame(null)} className="p-2 hover:bg-white/5 rounded-lg">
                                            <X className="w-5 h-5 text-slate-500" />
                                        </button>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-4 gap-4 mb-6">
                                        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-black text-white">{(selectedGame.sales || 0).toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">Sales</p>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-black text-green-400">${(selectedGame.revenue || 0).toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">Revenue</p>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-black text-yellow-400">{selectedGame.rating || 0}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">Rating</p>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-black text-purple-400">${(selectedGame.editions?.[0]?.price || 0).toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">Price</p>
                                        </div>
                                    </div>

                                    {/* Current Platforms */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Available On</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedGame.platforms?.map(p => {
                                                const platform = STORE_PLATFORMS.find(sp => sp.id === p);
                                                return (
                                                    <div key={p} className="px-3 py-2 bg-slate-800 rounded-lg flex items-center gap-2">
                                                        <span className="text-lg">{platform?.icon}</span>
                                                        <span className="text-sm text-white font-bold">{platform?.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Add to More Platforms */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Expand to More Platforms</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {STORE_PLATFORMS.filter(p => !selectedGame.platforms?.includes(p.id)).map(platform => (
                                                <button
                                                    key={platform.id}
                                                    onClick={() => handleAddPlatform(selectedGame.id, platform.id)}
                                                    className="p-3 bg-slate-800/50 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/50 rounded-xl text-left transition-all"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{platform.icon}</span>
                                                        <span className="text-xs font-bold text-white">{platform.name}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-1">{(platform.cut * 100).toFixed(0)}% cut</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Game Settings */}
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Game Settings</h3>
                                        <div className="space-y-3">
                                            <div className="bg-slate-800/50 rounded-xl p-4">
                                                <p className="text-xs text-slate-500 uppercase mb-2">Mod Support</p>
                                                <p className="text-white font-bold capitalize">{selectedGame.modSupport || 'None'}</p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-xl p-4">
                                                <p className="text-xs text-slate-500 uppercase mb-2">DRM Protection</p>
                                                <p className="text-white font-bold capitalize">{selectedGame.drm || 'None'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Release Modal */}
            {showReleaseModal && currentGame && (
                <ReleaseModal
                    game={currentGame}
                    onClose={() => setShowReleaseModal(false)}
                    onRelease={handleRelease}
                />
            )}
        </div>
    );
};

export default StoresPanel;
