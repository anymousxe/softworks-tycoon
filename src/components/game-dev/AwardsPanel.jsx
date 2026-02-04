import React, { useState } from 'react';
import {
    Trophy, Award, Star, Crown, Calendar, Medal, Sparkles,
    ChevronRight, Gift, Zap
} from 'lucide-react';
import useGameDevStore, { AWARDS, AWARD_SHOWS } from '../../store/gameDevStore';

// Award Card
const AwardCard = ({ award, game, year }) => {
    const awardInfo = AWARDS.find(a => a.id === award.awardId);

    return (
        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-yellow-500/20">
                {awardInfo?.icon || '🏆'}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{awardInfo?.name}</h4>
                <p className="text-yellow-400 text-sm">{game}</p>
                <p className="text-xs text-slate-500">{year}</p>
            </div>
            <div className="text-right">
                <p className="text-green-400 font-bold">+${(awardInfo?.cashBonus || 0).toLocaleString()}</p>
                <p className="text-xs text-amber-400">+{awardInfo?.prestige} prestige</p>
            </div>
        </div>
    );
};

// Nomination Card
const NominationCard = ({ nomination, isWinner }) => {
    const awardInfo = AWARDS.find(a => a.id === nomination.awardId);

    return (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${isWinner
                ? 'bg-yellow-500/20 border border-yellow-500/50'
                : 'bg-slate-800/50 border border-white/5'
            }`}>
            <span className="text-2xl">{awardInfo?.icon || '🎖️'}</span>
            <div className="flex-1">
                <h4 className={`font-bold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>{awardInfo?.name}</h4>
                <p className="text-xs text-slate-500">{nomination.gameName}</p>
            </div>
            {isWinner && <Crown className="w-5 h-5 text-yellow-400" />}
        </div>
    );
};

// Upcoming Shows
const UpcomingShow = ({ show, month }) => {
    const showInfo = AWARD_SHOWS.find(s => s.id === show);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl">
                {showInfo?.icon || '🎖️'}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white">{showInfo?.name}</h4>
                <p className="text-xs text-slate-500">{monthNames[showInfo?.month - 1 || 0]}</p>
            </div>
            <div className="text-right">
                <p className="text-purple-400 text-sm font-bold">Prestige: {showInfo?.prestige}</p>
            </div>
        </div>
    );
};

// Main Awards Panel
const AwardsPanel = () => {
    const { awards, nominations, releasedGames, currentYear, currentMonth, fame } = useGameDevStore();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Calculate total prestige from awards
    const totalPrestige = awards.reduce((sum, a) => {
        const awardInfo = AWARDS.find(aw => aw.id === a.awardId);
        return sum + (awardInfo?.prestige || 0);
    }, 0);

    // Get upcoming award shows
    const upcomingShows = AWARD_SHOWS.filter(show => {
        if (currentMonth < show.month) return true;
        return false;
    }).slice(0, 3);

    // Check if any games are eligible for awards
    const eligibleGames = releasedGames.filter(g => {
        // Games released this year or last year are eligible
        const releaseYear = g.releasedAt?.year;
        return releaseYear >= currentYear - 1 && g.quality >= 70;
    });

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">Awards & Recognition</h1>
                    <p className="text-slate-500">Your studio's achievements and nominations</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl p-6">
                    <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                    <p className="text-4xl font-black text-yellow-400">{awards.length}</p>
                    <p className="text-[10px] text-yellow-400/80 uppercase">Awards Won</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <Medal className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-4xl font-black text-white">{nominations.length}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Nominations</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <Star className="w-8 h-8 text-purple-400 mb-2" />
                    <p className="text-4xl font-black text-purple-400">{totalPrestige}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Total Prestige</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <Zap className="w-8 h-8 text-pink-400 mb-2" />
                    <p className="text-4xl font-black text-pink-400">{eligibleGames.length}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Eligible Games</p>
                </div>
            </div>

            {/* Awards Won */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Awards Won
                </h3>

                {awards.length === 0 ? (
                    <div className="text-center py-12">
                        <Trophy className="w-20 h-20 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No awards yet</p>
                        <p className="text-slate-600 text-sm mt-2">Create high-quality games to earn nominations!</p>
                        <p className="text-xs text-slate-700 mt-4">
                            Tip: Games need 70+ quality rating to be eligible for awards
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {awards.map((award, i) => (
                            <AwardCard key={i} award={award} game={award.gameName} year={award.year} />
                        ))}
                    </div>
                )}
            </div>

            {/* Current Nominations */}
            {nominations.length > 0 && (
                <div className="bg-slate-900/50 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Current Nominations
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {nominations.map((nom, i) => (
                            <NominationCard key={i} nomination={nom} isWinner={false} />
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Award Shows */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Award Shows This Year
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {AWARD_SHOWS.map(show => {
                        const isPast = show.month < currentMonth;
                        return (
                            <div
                                key={show.id}
                                className={`rounded-xl p-4 flex items-center gap-3 transition-all ${isPast
                                        ? 'bg-slate-800/30 opacity-50'
                                        : 'bg-slate-800/50 border border-white/5 hover:border-purple-500/30'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl">
                                    {show.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{show.name}</h4>
                                    <p className="text-xs text-slate-500">{monthNames[show.month - 1]}</p>
                                </div>
                                {isPast ? (
                                    <span className="text-xs text-slate-600">Completed</span>
                                ) : (
                                    <span className="text-xs text-purple-400">{show.month - currentMonth} months</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Eligible Games Info */}
            {eligibleGames.length > 0 && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-green-400" />
                        Award-Eligible Games
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">These games may receive nominations at upcoming award shows:</p>
                    <div className="flex flex-wrap gap-3">
                        {eligibleGames.map(game => (
                            <div key={game.id} className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2">
                                <Star className="w-4 h-4 text-green-400" />
                                <span className="text-white font-bold">{game.name}</span>
                                <span className="text-green-400 text-sm">({game.quality} quality)</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Available Awards Info */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Award Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {AWARDS.map(award => (
                        <div key={award.id} className="p-4 bg-slate-800/50 rounded-xl text-center">
                            <span className="text-3xl">{award.icon}</span>
                            <h4 className="font-bold text-white text-sm mt-2">{award.name}</h4>
                            <p className="text-xs text-green-400 mt-1">+${(award.cashBonus / 1000).toFixed(0)}k</p>
                            <p className="text-xs text-amber-400">+{award.prestige} prestige</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AwardsPanel;
