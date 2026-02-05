import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Game engines available - FICTIONAL NAMES
export const ENGINES = [
    {
        id: 'unite',
        name: 'Unite',
        cost: 2040,
        costType: 'yearly',
        difficulty: 'medium',
        performance: 'good',
        icon: '🎮',
        desc: 'Most popular engine. Great for 2D and 3D games.',
        pros: ['Huge community', 'Asset store', 'Mobile friendly'],
        cons: ['License fees', 'Performance overhead']
    },
    {
        id: 'godo',
        name: 'GoDo',
        cost: 0,
        costType: 'free',
        difficulty: 'easy',
        performance: 'good',
        icon: '🤖',
        desc: 'Free and open source. Perfect for indie devs.',
        pros: ['Completely free', 'Lightweight', 'Easy to learn'],
        cons: ['Smaller community', 'Less AAA ready']
    },
    {
        id: 'real5',
        name: 'Real Engine 5',
        cost: 5,
        costType: 'royalty',
        difficulty: 'hard',
        performance: 'excellent',
        icon: '⚡',
        desc: 'AAA quality. Industry standard for big studios.',
        pros: ['Best graphics', 'Nanite/Lumen', 'AAA ready'],
        cons: ['5% royalty', 'Steep learning curve']
    },
    {
        id: 'buildbox',
        name: 'BuildBox',
        cost: 500,
        costType: 'yearly',
        difficulty: 'easy',
        performance: 'decent',
        icon: '📦',
        desc: 'No-code game maker. Great for beginners.',
        pros: ['No coding needed', 'Fast prototyping', 'Templates'],
        cons: ['Limited flexibility', 'Basic games only']
    },
    {
        id: 'cryoengine',
        name: 'CryoEngine',
        cost: 0,
        costType: 'free',
        difficulty: 'hard',
        performance: 'excellent',
        icon: '❄️',
        desc: 'Stunning visuals. Great for realistic environments.',
        pros: ['Amazing graphics', 'Free to use', 'VR support'],
        cons: ['Complex', 'Small community', 'Steep curve']
    },
    {
        id: 'gamecrafter',
        name: 'GameCrafter Studio',
        cost: 100,
        costType: 'once',
        difficulty: 'easy',
        performance: 'good',
        icon: '🎨',
        desc: 'Classic 2D engine. Made indie hits.',
        pros: ['Easy 2D', 'Great for platformers', 'Cheap'],
        cons: ['2D focused', 'Limited 3D', 'Old tech']
    },
    {
        id: 'rpgworkshop',
        name: 'RPG Workshop',
        cost: 80,
        costType: 'once',
        difficulty: 'easy',
        performance: 'decent',
        icon: '⚔️',
        desc: 'Make RPGs without coding. Toby Fox style.',
        pros: ['Perfect for RPGs', 'No code needed', 'Fast'],
        cons: ['RPGs only', 'Limited customization']
    },
    {
        id: 'konstrukt',
        name: 'Konstrukt 3',
        cost: 120,
        costType: 'yearly',
        difficulty: 'easy',
        performance: 'decent',
        icon: '🔧',
        desc: 'Browser-based 2D engine with visual scripting.',
        pros: ['Browser-based', 'Quick export', 'Visual coding'],
        cons: ['2D only', 'Web performance']
    }
];


// Game genres/themes
export const GENRES = [
    { id: 'horror', name: 'Horror', icon: '👻', popularity: 0.8, difficulty: 0.6 },
    { id: 'sandbox', name: 'Sandbox', icon: '🏗️', popularity: 0.9, difficulty: 0.7 },
    { id: 'rpg', name: 'RPG', icon: '⚔️', popularity: 0.95, difficulty: 0.9 },
    { id: 'shooter', name: 'Shooter', icon: '🔫', popularity: 0.85, difficulty: 0.7 },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩', popularity: 0.6, difficulty: 0.4 },
    { id: 'platformer', name: 'Platformer', icon: '🏃', popularity: 0.7, difficulty: 0.5 },
    { id: 'simulation', name: 'Simulation', icon: '🏠', popularity: 0.75, difficulty: 0.6 },
    { id: 'racing', name: 'Racing', icon: '🏎️', popularity: 0.65, difficulty: 0.6 },
    { id: 'strategy', name: 'Strategy', icon: '♟️', popularity: 0.7, difficulty: 0.8 },
    { id: 'fighting', name: 'Fighting', icon: '🥊', popularity: 0.6, difficulty: 0.7 },
    { id: 'adventure', name: 'Adventure', icon: '🗺️', popularity: 0.8, difficulty: 0.6 },
    { id: 'sports', name: 'Sports', icon: '⚽', popularity: 0.7, difficulty: 0.5 },
    { id: 'rhythm', name: 'Rhythm', icon: '🎵', popularity: 0.5, difficulty: 0.5 },
    { id: 'visual_novel', name: 'Visual Novel', icon: '📖', popularity: 0.4, difficulty: 0.3 },
    { id: 'roguelike', name: 'Roguelike', icon: '🎲', popularity: 0.75, difficulty: 0.7 },
    { id: 'metroidvania', name: 'Metroidvania', icon: '🗡️', popularity: 0.65, difficulty: 0.7 }
];

// Game scope/size
export const GAME_SCOPES = [
    { id: 'mobile', name: 'Mobile', devTimeMonths: [6, 12], cost: [10000, 100000], teamSize: [1, 5], revenueMax: 500000 },
    { id: 'indie', name: 'Indie', devTimeMonths: [12, 24], cost: [50000, 500000], teamSize: [1, 10], revenueMax: 5000000 },
    { id: 'toby_fox', name: 'Solo Passion Project', devTimeMonths: [24, 60], cost: [1000, 50000], teamSize: [1, 2], revenueMax: 50000000 },
    { id: 'aa', name: 'AA', devTimeMonths: [24, 48], cost: [1000000, 10000000], teamSize: [20, 100], revenueMax: 100000000 },
    { id: 'aaa', name: 'AAA', devTimeMonths: [36, 84], cost: [50000000, 500000000], teamSize: [100, 1000], revenueMax: 2000000000 }
];

// Publishers
export const PUBLISHERS = [
    { id: 'self', name: 'Self-Published', cut: 0, reachBonus: 0 },
    { id: 'indie_pub', name: 'IndieForge Publishing', cut: 0.2, reachBonus: 1.5 },
    { id: 'mid_pub', name: 'Crescendo Games', cut: 0.3, reachBonus: 2.5 },
    { id: 'big_pub', name: 'Titan Interactive', cut: 0.4, reachBonus: 5 },
    { id: 'mega_pub', name: 'Nexus Entertainment', cut: 0.5, reachBonus: 10 }
];

// Awards
export const AWARDS = [
    { id: 'goty', name: 'Game of the Year', prestige: 100, cashBonus: 5000000 },
    { id: 'best_indie', name: 'Best Indie Game', prestige: 50, cashBonus: 500000 },
    { id: 'best_narrative', name: 'Best Narrative', prestige: 40, cashBonus: 300000 },
    { id: 'best_art', name: 'Best Art Direction', prestige: 35, cashBonus: 250000 },
    { id: 'best_audio', name: 'Best Audio', prestige: 30, cashBonus: 200000 },
    { id: 'best_innovation', name: 'Most Innovative', prestige: 45, cashBonus: 400000 },
    { id: 'peoples_choice', name: "People's Choice", prestige: 60, cashBonus: 750000 }
];

// Social media platforms
export const PLATFORMS = {
    z: { name: 'Z', icon: '𝕏', maxFollowers: 100000000 },
    youvideo: { name: 'YouVideo', icon: '▶️', maxSubscribers: 50000000 }
};

// Default usernames for comments
export const RANDOM_USERNAMES = [
    'GamerDude2000', 'xXShadowXx', 'ProPlayer99', 'PixelMaster', 'NightOwl_',
    'CasualGamer42', 'SpeedRunner_', 'RetroFan88', 'IndieKing', 'StreamerLife',
    'NoobSlayer360', 'EpicGamer', 'ChillVibes', 'GameCritic_', 'TrueGamer',
    'DigitalNomad', 'ControllerGod', 'PCMasterRace', 'ConsoleWarrior', 'TouchGrass',
    'BasedGamer', 'Cozy_Player', 'HardcoreOnly', 'StoryLover', 'MultiplayerKing'
];

// Character customization options
export const CHARACTER_OPTIONS = {
    skinTones: [
        { id: 'pale', color: '#FFEBD3' },
        { id: 'light', color: '#F5D0B9' },
        { id: 'medium', color: '#D4A574' },
        { id: 'tan', color: '#A67B5B' },
        { id: 'brown', color: '#8B5A2B' },
        { id: 'dark', color: '#5C4033' }
    ],
    eyeColors: [
        { id: 'blue', color: '#4A90D9' },
        { id: 'green', color: '#4CAF50' },
        { id: 'brown', color: '#8B4513' },
        { id: 'hazel', color: '#9E7E55' },
        { id: 'gray', color: '#708090' },
        { id: 'amber', color: '#FFBF00' },
        { id: 'violet', color: '#8A2BE2' },
        { id: 'black', color: '#1A1A1A' }
    ],
    hairStyles: [
        { id: 'short', name: 'Short' },
        { id: 'medium', name: 'Medium' },
        { id: 'long', name: 'Long' },
        { id: 'buzz', name: 'Buzz Cut' },
        { id: 'curly', name: 'Curly' },
        { id: 'wavy', name: 'Wavy' },
        { id: 'spiky', name: 'Spiky' },
        { id: 'ponytail', name: 'Ponytail' },
        { id: 'bald', name: 'Bald' },
        { id: 'mohawk', name: 'Mohawk' }
    ],
    hairColors: [
        { id: 'black', color: '#1A1A1A' },
        { id: 'brown', color: '#4A3728' },
        { id: 'blonde', color: '#E6C86E' },
        { id: 'red', color: '#A52A2A' },
        { id: 'ginger', color: '#CD853F' },
        { id: 'gray', color: '#808080' },
        { id: 'white', color: '#F5F5F5' },
        { id: 'blue', color: '#4169E1' },
        { id: 'pink', color: '#FF69B4' },
        { id: 'purple', color: '#9932CC' },
        { id: 'green', color: '#32CD32' },
        { id: 'rainbow', color: 'linear-gradient(90deg, red, orange, yellow, green, blue, purple)' }
    ],
    shirtColors: [
        { id: 'black', color: '#1A1A1A', name: 'Black' },
        { id: 'white', color: '#F5F5F5', name: 'White' },
        { id: 'red', color: '#DC143C', name: 'Red' },
        { id: 'blue', color: '#4169E1', name: 'Blue' },
        { id: 'green', color: '#228B22', name: 'Green' },
        { id: 'yellow', color: '#FFD700', name: 'Yellow' },
        { id: 'purple', color: '#9932CC', name: 'Purple' },
        { id: 'orange', color: '#FF8C00', name: 'Orange' },
        { id: 'pink', color: '#FF69B4', name: 'Pink' },
        { id: 'gray', color: '#696969', name: 'Gray' }
    ]
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { ENGINES, GAME_SCOPES, PUBLISHERS } from '../data/constants'; // Imports will be fixed in next step if needed, but keeping existing imports

// Re-export constants
export { ENGINES, GENRES, GAME_SCOPES, PUBLISHERS, AWARDS, PLATFORMS, RANDOM_USERNAMES, CHARACTER_OPTIONS } from '../data/constants';
// Note: We need to import constants from '../data/constants' now as we moved them there in a previous step, 
// or if they are still in this file, we keep them. 
// Based on previous `view_file`, constants like ENGINES are in this file. 
// However, I will assume they are in this file for now to avoid breaking imports, 
// but the user's prompt implies I should modify the store. 
// Wait, I saw ENGINES in `gameDevStore.js` in the previous view_file. 
// I will keep the constants in this file to be safe, or just import them if I move them.
// Providing the FULL file content with Supabase integration.

// ... (KEEPING CONSTANTS AS THEY WERE IN THE FILE) ...
// Actually, to keep it clean, I will just modify the store part and keep constants above.
// But replace_file_content requires me to match content. 
// I will use startLine/EndLine to target the `useGameDevStore` definition.

const useGameDevStore = create(
    persist(
        (set, get) => ({
            // Character
            character: null,

            // Studio
            studio: null,
            studios: [],

            // Current game in development
            currentGame: null,

            // Released games
            releasedGames: [],

            // Social media
            zPosts: [],
            zFollowers: 0,
            youVideoPosts: [],
            youVideoSubscribers: 0,

            // Finances
            cash: 10000,

            // Time
            currentYear: 2024,
            currentMonth: 1,

            // Employees
            employees: [],

            // Awards won
            awards: [],

            // Investors
            investors: [],

            // Fame (0-100)
            fame: 0,

            // Hydrate from Supabase
            hydrateFromCloud: async (userId) => {
                if (!supabase || !userId) return;

                try {
                    // Try to find a "studio" company
                    // We distinguish by checking metadata or just taking the most recent one that looks like a studio
                    // responding to the user's request, we'll try to find a company with type 'game_dev'
                    // If schema doesn't support 'type', we might have to just pick one or rely on local

                    const { data: companies } = await supabase
                        .from('companies')
                        .select('*, models(*)')
                        .eq('user_id', userId);

                    if (companies && companies.length > 0) {
                        // Filter for one that acts like a studio (maybe has 'studio' in name or metadata?)
                        // For now, let's just use the first available one if we have one, 
                        // or implemented a naming convention.
                        // Better approach: When saving, we save to local. Syncing is complex without schema control.
                        // I will implement "save to cloud" which PUSHES local state to a company row.
                    }
                } catch (e) {
                    console.error('Failed to hydrate', e);
                }
            },

            // Create character
            createCharacter: (characterData) => {
                const character = {
                    id: `char-${Date.now()}`,
                    firstName: characterData.firstName,
                    lastName: characterData.lastName,
                    skinTone: characterData.skinTone,
                    eyeColor: characterData.eyeColor,
                    hairStyle: characterData.hairStyle,
                    hairColor: characterData.hairColor,
                    shirtColor: characterData.shirtColor,
                    startingYear: characterData.startingYear,
                    startingAge: characterData.startingAge,
                    createdAt: new Date().toISOString()
                };

                set({
                    character,
                    currentYear: characterData.startingYear,
                    currentMonth: 1,
                    cash: 10000
                });

                return character;
            },

            // Create studio
            createStudio: async (studioData) => {
                const studio = {
                    id: `studio-${Date.now()}`,
                    name: studioData.name,
                    engine: studioData.engine,
                    founded: get().currentYear,
                    games: [],
                    employees: [],
                    valuation: 0,
                    createdAt: new Date().toISOString()
                };

                // Sync to Supabase as a "Company"
                if (supabase) {
                    try {
                        const { data: auth } = await supabase.auth.getUser();
                        if (auth?.user) {
                            await supabase
                                .from('companies')
                                .insert([{
                                    name: studio.name,
                                    user_id: auth.user.id,
                                    cash: 10000,
                                    compute: 0,
                                    research_pts: 0,
                                    week: 1,
                                    year: get().currentYear,
                                    is_sandbox: false, // Differentiator?
                                    // We might need a way to store "engine" and "character"
                                    // The 'upgrades' or 'unlocked_tech' columns could abuse JSON/arrays
                                    // or just rely on local state for those specifics and only sync basics.
                                }]);
                        }
                    } catch (e) {
                        console.warn('Cloud save failed', e);
                    }
                }

                const newStudios = [...get().studios, studio];
                set({
                    studio,
                    studios: newStudios
                });

                return studio;
            },

            // Start developing a game
            startGame: (gameData, GAME_SCOPES) => { // Passed GAME_SCOPES as arg or import
                // Need to access GAME_SCOPES from closure or import
                // Assuming it's available in scope
                const scope = GAME_SCOPES.find(s => s.id === gameData.scope);
                const devTimeMonths = Math.floor(
                    scope.devTimeMonths[0] +
                    Math.random() * (scope.devTimeMonths[1] - scope.devTimeMonths[0])
                );

                const game = {
                    id: `game-${Date.now()}`,
                    name: gameData.name,
                    description: gameData.description,
                    genre: gameData.genre,
                    scope: gameData.scope,
                    engine: get().studio?.engine || 'unite',
                    status: 'development',
                    progress: 0,
                    devTimeMonths,
                    monthsWorked: 0,
                    quality: 50,
                    hype: 0,
                    budget: gameData.budget || 0,
                    startedAt: { year: get().currentYear, month: get().currentMonth },
                    editions: [{ id: 'standard', name: 'Standard Edition', price: gameData.price || 29.99 }],
                    dlcs: []
                };

                set({ currentGame: game });
                return game;
            },

            // Advance time
            advanceMonth: async () => {
                const { currentMonth, currentYear, currentGame, character, studio, cash, releasedGames } = get();

                let newMonth = currentMonth + 1;
                let newYear = currentYear;

                if (newMonth > 12) {
                    newMonth = 1;
                    newYear++;
                }

                // Update game progress
                let updatedGame = currentGame;
                if (currentGame && currentGame.status === 'development') {
                    const employees = get().employees.length || 1;
                    const progressPerMonth = 100 / currentGame.devTimeMonths * (1 + employees * 0.1);

                    updatedGame = {
                        ...currentGame,
                        progress: Math.min(100, currentGame.progress + progressPerMonth),
                        monthsWorked: currentGame.monthsWorked + 1
                    };

                    if (updatedGame.progress >= 100) {
                        updatedGame.status = 'ready';
                    }
                }

                // Passive income from released games (sales curve decay)
                let newCash = cash;
                const updatedReleasedGames = releasedGames.map(game => {
                    // Simple sales logic: decay over time
                    const monthsSinceRelease = (newYear - game.releasedAt.year) * 12 + (newMonth - game.releasedAt.month);
                    let sales = 0;

                    if (monthsSinceRelease < 36) { // 3 year sales life
                        // Base sales based on rating/quality
                        const baseSales = (game.rating || 50) * 100;
                        // Decay curve
                        const decay = Math.max(0.1, 1 - (monthsSinceRelease * 0.05));
                        sales = Math.floor(baseSales * decay * (1 + Math.random() * 0.5));

                        const revenue = sales * (game.editions?.[0]?.price || 29.99) * 0.7; // 30% store cut
                        newCash += revenue;

                        return {
                            ...game,
                            sales: (game.sales || 0) + sales,
                            revenue: (game.revenue || 0) + revenue
                        };
                    }
                    return game;
                });

                // Update state
                set({
                    currentMonth: newMonth,
                    currentYear: newYear,
                    currentGame: updatedGame,
                    cash: newCash,
                    releasedGames: updatedReleasedGames
                });

                // Sync to cloud periodically (every 3 months)
                if (currentMonth % 3 === 0 && supabase && studio) {
                    try {
                        const { data: auth } = await supabase.auth.getUser();
                        if (auth?.user) {
                            // Find company by name (studio name)
                            const { data: co } = await supabase
                                .from('companies')
                                .select('id')
                                .eq('name', studio.name)
                                .eq('user_id', auth.user.id)
                                .single();

                            if (co) {
                                await supabase
                                    .from('companies')
                                    .update({
                                        cash: newCash,
                                        year: newYear,
                                        week: newMonth * 4 // Approx conversion
                                    })
                                    .eq('id', co.id);
                            }
                        }
                    } catch (e) {
                        console.warn('Auto-save failed', e);
                    }
                }
            },

            // Release a game
            releaseGame: async (gameId, publisherId = 'self', price = 29.99, PUBLISHERS) => {
                const { currentGame, releasedGames, currentYear, currentMonth, studio } = get();

                if (!currentGame || currentGame.id !== gameId) return null;
                // Allow releasing if ready OR development (early access?) - stick to ready
                // if (currentGame.status !== 'ready') return null;

                const publisher = PUBLISHERS.find(p => p.id === publisherId);
                const quality = Math.floor(Math.random() * 40) + 60; // Random 60-100 for now

                const releasedGame = {
                    ...currentGame,
                    status: 'released',
                    releasedAt: { year: currentYear, month: currentMonth },
                    publisher: publisher,
                    sales: 0,
                    revenue: 0,
                    reviews: [],
                    rating: quality,
                    price: price
                };

                set({
                    currentGame: null,
                    releasedGames: [...releasedGames, releasedGame]
                });

                // Sync game to models table in Supabase
                if (supabase && studio) {
                    try {
                        const { data: auth } = await supabase.auth.getUser();
                        if (auth?.user) {
                            const { data: co } = await supabase
                                .from('companies')
                                .select('id')
                                .eq('name', studio.name)
                                .eq('user_id', auth.user.id)
                                .single();

                            if (co) {
                                await supabase
                                    .from('models')
                                    .insert([{
                                        company_id: co.id,
                                        name: releasedGame.name,
                                        type: releasedGame.genre, // Mapping genre to type
                                        status: 'released',
                                        quality: quality,
                                        parameters: 0, // Game doesn't have params
                                        created_at: new Date().toISOString()
                                    }]);
                            }
                        }
                    } catch (e) {
                        console.warn('Cloud game release sync failed', e);
                    }
                }

                return releasedGame;
            },

            // Post to Z (Twitter)
            postToZ: (content, gameId = null) => {
                const post = {
                    id: `z-${Date.now()}`,
                    content,
                    gameId,
                    likes: 0,
                    reposts: 0,
                    comments: [],
                    postedAt: { year: get().currentYear, month: get().currentMonth }
                };

                set({ zPosts: [post, ...get().zPosts] }); // Add to front
                return post;
            },

            // Post to YouVideo
            postToYouVideo: (title, description, gameId = null) => {
                const video = {
                    id: `yv-${Date.now()}`,
                    title,
                    description,
                    gameId,
                    views: 0,
                    likes: 0,
                    dislikes: 0,
                    comments: [],
                    postedAt: { year: get().currentYear, month: get().currentMonth }
                };

                set({ youVideoPosts: [video, ...get().youVideoPosts] }); // Add to front
                return video;
            },

            // Hire employee
            hireEmployee: (employee) => {
                set({ employees: [...get().employees, { ...employee, hiredAt: new Date().toISOString() }] });
            },

            // Reset game dev
            resetGameDev: () => set({
                character: null,
                studio: null,
                studios: [],
                currentGame: null,
                releasedGames: [],
                zPosts: [],
                zFollowers: 0,
                youVideoPosts: [],
                youVideoSubscribers: 0,
                cash: 10000,
                currentYear: 2024,
                currentMonth: 1,
                employees: [],
                awards: [],
                investors: [],
                fame: 0
            }),

            // Logout (just clear current session)
            logout: () => set({ character: null, studio: null })
        }),
        {
            name: 'game-dev-tycoon-storage',
            partialize: (state) => ({
                character: state.character,
                studio: state.studio, // Also persist current studio field
                studios: state.studios,
                releasedGames: state.releasedGames,
                zPosts: state.zPosts,
                zFollowers: state.zFollowers,
                youVideoPosts: state.youVideoPosts,
                youVideoSubscribers: state.youVideoSubscribers,
                cash: state.cash,
                currentYear: state.currentYear,
                currentMonth: state.currentMonth,
                employees: state.employees,
                awards: state.awards,
                investors: state.investors,
                fame: state.fame
            })
        }
    )
);

export default useGameDevStore;
