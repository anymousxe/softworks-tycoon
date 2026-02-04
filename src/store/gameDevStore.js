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
    { id: 'metroidvania', name: 'Metroidvania', icon: '🗡️', popularity: 0.65, difficulty: 0.7 },
    { id: 'survival', name: 'Survival', icon: '🏕️', popularity: 0.85, difficulty: 0.7 },
    { id: 'mmo', name: 'MMO', icon: '🌐', popularity: 0.8, difficulty: 0.95 },
    { id: 'battle_royale', name: 'Battle Royale', icon: '🎯', popularity: 0.9, difficulty: 0.8 }
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

// Store Platforms
export const STORE_PLATFORMS = [
    {
        id: 'mist',
        name: 'Mist',
        icon: '⚙️',
        color: 'blue',
        cut: 0.30,
        reach: 1.0,
        requirements: [],
        desc: 'The biggest PC gaming platform. 30% revenue cut.'
    },
    {
        id: 'awesome_games',
        name: 'Awesome Games',
        icon: '🎮',
        color: 'purple',
        cut: 0.12,
        reach: 0.4,
        requirements: [],
        desc: 'Lower cut but less reach. Sometimes offers exclusivity deals.',
        exclusivityBonus: 500000
    },
    {
        id: 'cloud_streaming',
        name: 'CloudStreaming',
        icon: '☁️',
        color: 'cyan',
        cut: 0.25,
        reach: 0.3,
        requirements: [],
        desc: 'Stream games without downloads. Growing platform.'
    },
    {
        id: 'xstation_store',
        name: 'XStation Store',
        icon: '🎯',
        color: 'green',
        cut: 0.30,
        reach: 0.6,
        requirements: ['console_cert'],
        desc: 'Xbox-style console marketplace. Requires certification.'
    },
    {
        id: 'playbox_store',
        name: 'PlayBox Store',
        icon: '🕹️',
        color: 'blue',
        cut: 0.30,
        reach: 0.65,
        requirements: ['console_cert'],
        desc: 'PlayStation-style console marketplace. Premium audience.'
    },
    {
        id: 'gog',
        name: 'Good Old Games',
        icon: '📀',
        color: 'amber',
        cut: 0.30,
        reach: 0.15,
        requirements: [],
        desc: 'DRM-free platform. Niche but passionate audience.'
    },
    {
        id: 'itch',
        name: 'Itch.io',
        icon: '🎲',
        color: 'pink',
        cut: 0.10,
        reach: 0.08,
        requirements: [],
        desc: 'Indie-focused. You choose the cut. Great for small games.'
    },
    {
        id: 'mistrip',
        name: 'Mistrip.com',
        icon: '🏴‍☠️',
        color: 'red',
        cut: 0,
        reach: 0.5,
        requirements: [],
        desc: 'Put it on the pirate bay yourself. Bold marketing move.',
        isPiracy: true
    }
];

// Subscription Services
export const SUBSCRIPTION_SERVICES = [
    {
        id: 'xstation_gamepass',
        name: 'XStation GamePass',
        icon: '🎮',
        color: 'green',
        monthlyPayout: 0.5, // per player per month
        reachBonus: 3.0,
        requirements: { minQuality: 70, minFame: 20 },
        desc: 'Xbox GamePass equivalent. Good exposure, decent payout.'
    },
    {
        id: 'playbox_plus',
        name: 'PlayBox+',
        icon: '➕',
        color: 'blue',
        monthlyPayout: 0.4, // per player per month
        reachBonus: 2.5,
        requirements: { minQuality: 75, minFame: 30 },
        desc: 'PlayStation Plus equivalent. Premium subscribers.'
    },
    {
        id: 'awesome_pro',
        name: 'Awesome Pro',
        icon: '⭐',
        color: 'purple',
        monthlyPayout: 0.3,
        reachBonus: 1.5,
        requirements: { minQuality: 60, minFame: 10 },
        desc: 'Epic Games style subscription. Lower barrier.'
    }
];

// Awards
export const AWARDS = [
    { id: 'goty', name: 'Game of the Year', prestige: 100, cashBonus: 5000000, icon: '🏆' },
    { id: 'best_indie', name: 'Best Indie Game', prestige: 50, cashBonus: 500000, icon: '💎' },
    { id: 'best_narrative', name: 'Best Narrative', prestige: 40, cashBonus: 300000, icon: '📖' },
    { id: 'best_art', name: 'Best Art Direction', prestige: 35, cashBonus: 250000, icon: '🎨' },
    { id: 'best_audio', name: 'Best Audio', prestige: 30, cashBonus: 200000, icon: '🎵' },
    { id: 'best_innovation', name: 'Most Innovative', prestige: 45, cashBonus: 400000, icon: '💡' },
    { id: 'peoples_choice', name: "People's Choice", prestige: 60, cashBonus: 750000, icon: '❤️' },
    { id: 'best_music', name: 'Best Original Score', prestige: 35, cashBonus: 200000, icon: '🎼' },
    { id: 'best_multiplayer', name: 'Best Multiplayer', prestige: 40, cashBonus: 350000, icon: '👥' },
    { id: 'best_ongoing', name: 'Best Ongoing Game', prestige: 30, cashBonus: 250000, icon: '🔄' }
];

// Award Shows
export const AWARD_SHOWS = [
    { id: 'game_awards', name: 'The Game Awards', month: 12, prestige: 100, icon: '🎖️' },
    { id: 'bafta', name: 'BAFTA Games Awards', month: 4, prestige: 80, icon: '🎭' },
    { id: 'dice', name: 'D.I.C.E. Awards', month: 2, prestige: 70, icon: '🎲' },
    { id: 'indie_showcase', name: 'Indie Showcase', month: 6, prestige: 50, icon: '🌟' },
    { id: 'gdc_awards', name: 'GDC Awards', month: 3, prestige: 60, icon: '🎓' }
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
    'BasedGamer', 'Cozy_Player', 'HardcoreOnly', 'StoryLover', 'MultiplayerKing',
    'SpeedrunnerTAS', 'ModdingKing', 'AchievementHunter', 'CasualEnjoyer', 'ReviewBomber42'
];

// Employee Types for Game Dev
export const EMPLOYEE_TYPES = [
    // Development
    { id: 'programmer', name: 'Programmer', salary: 8000, category: 'dev', devBonus: 0.15, icon: '💻' },
    { id: 'senior_programmer', name: 'Senior Programmer', salary: 15000, category: 'dev', devBonus: 0.30, icon: '👨‍💻' },
    { id: 'lead_programmer', name: 'Lead Programmer', salary: 25000, category: 'dev', devBonus: 0.50, icon: '🏆' },

    // Art
    { id: 'artist', name: '2D Artist', salary: 6000, category: 'art', qualityBonus: 5, icon: '🎨' },
    { id: '3d_artist', name: '3D Artist', salary: 8000, category: 'art', qualityBonus: 8, icon: '🖼️' },
    { id: 'concept_artist', name: 'Concept Artist', salary: 10000, category: 'art', qualityBonus: 10, icon: '✏️' },
    { id: 'animator', name: 'Animator', salary: 9000, category: 'art', qualityBonus: 7, icon: '🎬' },
    { id: 'art_director', name: 'Art Director', salary: 18000, category: 'art', qualityBonus: 20, icon: '🎯' },

    // Audio
    { id: 'composer', name: 'Composer', salary: 8000, category: 'audio', qualityBonus: 8, icon: '🎵' },
    { id: 'sound_designer', name: 'Sound Designer', salary: 7000, category: 'audio', qualityBonus: 6, icon: '🔊' },
    { id: 'voice_actor', name: 'Voice Actor', salary: 5000, category: 'audio', qualityBonus: 5, icon: '🎤' },
    { id: 'famous_voice_actor', name: 'Famous Voice Actor', salary: 50000, category: 'audio', qualityBonus: 15, hypeBonus: 10, icon: '⭐' },
    { id: 'audio_director', name: 'Audio Director', salary: 15000, category: 'audio', qualityBonus: 15, icon: '🎧' },

    // Writing
    { id: 'writer', name: 'Writer', salary: 6000, category: 'writing', qualityBonus: 5, icon: '✍️' },
    { id: 'narrative_designer', name: 'Narrative Designer', salary: 10000, category: 'writing', qualityBonus: 10, icon: '📜' },
    { id: 'lead_writer', name: 'Lead Writer', salary: 15000, category: 'writing', qualityBonus: 15, icon: '📚' },

    // QA
    { id: 'qa_tester', name: 'QA Tester', salary: 4000, category: 'qa', bugFixBonus: 0.1, icon: '🐛' },
    { id: 'qa_lead', name: 'QA Lead', salary: 8000, category: 'qa', bugFixBonus: 0.25, icon: '🔍' },

    // Marketing
    { id: 'community_manager', name: 'Community Manager', salary: 5000, category: 'marketing', hypeBonus: 5, icon: '💬' },
    { id: 'marketing_manager', name: 'Marketing Manager', salary: 10000, category: 'marketing', hypeBonus: 15, icon: '📢' },
    { id: 'pr_specialist', name: 'PR Specialist', salary: 8000, category: 'marketing', hypeBonus: 10, icon: '📰' },

    // Leadership
    { id: 'producer', name: 'Producer', salary: 12000, category: 'leadership', devBonus: 0.1, qualityBonus: 5, icon: '📋' },
    { id: 'creative_director', name: 'Creative Director', salary: 25000, category: 'leadership', qualityBonus: 20, icon: '🎨' },
    { id: 'studio_head', name: 'Studio Head', salary: 40000, category: 'leadership', devBonus: 0.2, qualityBonus: 10, hypeBonus: 10, icon: '👔' }
];

// Game Editions
export const EDITION_TYPES = [
    { id: 'standard', name: 'Standard Edition', priceMultiplier: 1.0, contents: ['Base Game'] },
    { id: 'deluxe', name: 'Deluxe Edition', priceMultiplier: 1.5, contents: ['Base Game', 'Soundtrack', 'Artbook', 'Bonus Skins'] },
    { id: 'ultimate', name: 'Ultimate Edition', priceMultiplier: 2.0, contents: ['Base Game', 'Soundtrack', 'Artbook', 'Season Pass', 'Exclusive Content'] },
    { id: 'collectors', name: "Collector's Edition", priceMultiplier: 3.0, contents: ['Base Game', 'Physical Goodies', 'Statue', 'Steelbook', 'Everything'] },
    { id: 'goty', name: 'Game of the Year Edition', priceMultiplier: 1.2, contents: ['Base Game', 'All DLC', 'Updates'], unlockCondition: 'award_goty' }
];

// DRM Types
export const DRM_TYPES = [
    { id: 'none', name: 'No DRM', cost: 0, piracyProtection: 0, playerSatisfaction: 1.0, desc: 'No protection. Players love it, pirates too.' },
    { id: 'basic', name: 'Basic DRM', cost: 10000, piracyProtection: 0.3, playerSatisfaction: 0.95, desc: 'Simple key verification. Cracked in days.' },
    { id: 'advanced', name: 'Advanced DRM', cost: 100000, piracyProtection: 0.6, playerSatisfaction: 0.85, desc: 'Harder to crack. Some performance impact.' },
    { id: 'denuvo', name: 'Denovo Protection', cost: 500000, piracyProtection: 0.8, playerSatisfaction: 0.7, desc: 'Very hard to crack. Performance hit. Controversy.' },
    { id: 'always_online', name: 'Always Online', cost: 50000, piracyProtection: 0.9, playerSatisfaction: 0.5, desc: 'Requires internet. Players hate it. Very effective.' }
];

// Mod Support Levels
export const MOD_SUPPORT_LEVELS = [
    { id: 'none', name: 'No Mod Support', cost: 0, communityBonus: 0, longevity: 1.0, desc: 'No modding allowed or possible.' },
    { id: 'basic', name: 'Basic Modding', cost: 20000, communityBonus: 1.3, longevity: 1.5, desc: 'Community figures out how to mod anyway.' },
    { id: 'official', name: 'Official Mod Tools', cost: 100000, communityBonus: 2.0, longevity: 3.0, desc: 'Provided modding tools. Active community.' },
    { id: 'workshop', name: 'Full Workshop Support', cost: 250000, communityBonus: 3.0, longevity: 5.0, desc: 'Steam Workshop style. Mods extend game life.' },
    { id: 'open_source', name: 'Open Source Engine', cost: 0, communityBonus: 4.0, longevity: 10.0, desc: 'Full engine access. Ultimate freedom.' }
];

// Office Upgrades
export const OFFICE_UPGRADES = [
    { id: 'basic_office', name: 'Basic Office', cost: 50000, capacity: 10, morale: 0, icon: '🏢' },
    { id: 'modern_office', name: 'Modern Office', cost: 200000, capacity: 25, morale: 5, icon: '🏙️' },
    { id: 'campus', name: 'Tech Campus', cost: 1000000, capacity: 100, morale: 15, icon: '🏛️' },
    { id: 'gaming_lounge', name: 'Gaming Lounge', cost: 50000, capacity: 0, morale: 10, icon: '🎮' },
    { id: 'mocap_studio', name: 'Motion Capture Studio', cost: 500000, capacity: 0, qualityBonus: 10, icon: '📹' },
    { id: 'sound_stage', name: 'Professional Sound Stage', cost: 300000, capacity: 0, qualityBonus: 8, icon: '🎙️' },
    { id: 'server_room', name: 'Dedicated Servers', cost: 200000, capacity: 0, onlineCapability: true, icon: '🖥️' },
    { id: 'cafeteria', name: 'Free Cafeteria', cost: 100000, capacity: 0, morale: 8, icon: '🍕' },
    { id: 'gym', name: 'Fitness Center', cost: 150000, capacity: 0, morale: 5, icon: '💪' },
    { id: 'daycare', name: 'On-site Daycare', cost: 200000, capacity: 0, morale: 12, icon: '👶' }
];

// Character customization options
export const CHARACTER_OPTIONS = {
    skinTones: [
        { id: 'pale', color: '#FFEBD3' },
        { id: 'light', color: '#F5D0B9' },
        { id: 'medium', color: '#D4A574' },
        { id: 'tan', color: '#A67B5B' },
        { id: 'brown', color: '#8B5A2B' },
        { id: 'dark', color: '#5C4033' },
        { id: 'deep', color: '#3D2314' }
    ],
    eyeColors: [
        { id: 'blue', color: '#4A90D9' },
        { id: 'green', color: '#4CAF50' },
        { id: 'brown', color: '#8B4513' },
        { id: 'hazel', color: '#9E7E55' },
        { id: 'gray', color: '#708090' },
        { id: 'amber', color: '#FFBF00' },
        { id: 'violet', color: '#8A2BE2' },
        { id: 'black', color: '#1A1A1A' },
        { id: 'heterochromia', color: 'linear-gradient(90deg, #4A90D9 50%, #4CAF50 50%)' }
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
        { id: 'mohawk', name: 'Mohawk' },
        { id: 'afro', name: 'Afro' },
        { id: 'braids', name: 'Braids' },
        { id: 'undercut', name: 'Undercut' }
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
        { id: 'gray', color: '#696969', name: 'Gray' },
        { id: 'teal', color: '#008080', name: 'Teal' },
        { id: 'navy', color: '#000080', name: 'Navy' }
    ],
    accessories: [
        { id: 'none', name: 'None' },
        { id: 'glasses', name: 'Glasses' },
        { id: 'sunglasses', name: 'Sunglasses' },
        { id: 'headphones', name: 'Headphones' },
        { id: 'cap', name: 'Cap' },
        { id: 'beanie', name: 'Beanie' },
        { id: 'earrings', name: 'Earrings' }
    ],
    facialHair: [
        { id: 'none', name: 'None' },
        { id: 'stubble', name: 'Stubble' },
        { id: 'beard', name: 'Beard' },
        { id: 'goatee', name: 'Goatee' },
        { id: 'mustache', name: 'Mustache' },
        { id: 'full_beard', name: 'Full Beard' }
    ]
};

// Settings defaults
export const DEFAULT_SETTINGS = {
    autosaveInterval: 5, // minutes
    notificationsEnabled: true,
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    timeSpeed: 1, // 1 = normal, 2 = fast, 3 = very fast
    showTutorialTips: true,
    darkMode: true,
    compactUI: false
};

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
            loans: [],
            monthlyExpenses: 0,
            monthlyIncome: 0,
            financialHistory: [],

            // Time
            currentYear: 2024,
            currentMonth: 1,

            // Employees
            employees: [],

            // Awards won
            awards: [],
            nominations: [],

            // Investors
            investors: [],

            // Fame (0-100)
            fame: 0,

            // Office
            officeUpgrades: [],
            officeCapacity: 5,

            // Settings
            settings: { ...DEFAULT_SETTINGS },

            // Piracy tracking
            piracyEvents: [],

            // Multi-save system
            saves: [],
            currentSaveId: null,

            // Save the current game state
            saveGame: () => {
                const {
                    character, studio, studios, currentGame, releasedGames,
                    zPosts, zFollowers, youVideoPosts, youVideoSubscribers,
                    cash, loans, monthlyExpenses, monthlyIncome, financialHistory,
                    currentYear, currentMonth, employees, awards, nominations,
                    investors, fame, officeUpgrades, officeCapacity, settings,
                    piracyEvents, currentSaveId, saves
                } = get();

                if (!character) return; // Don't save if no game started

                const saveData = {
                    id: currentSaveId || `save-${Date.now()}`,
                    lastPlayed: new Date().toISOString(),
                    name: studio?.name ? `${studio.name} (${character.firstName})` : `${character.firstName} ${character.lastName}`,
                    data: {
                        character, studio, studios, currentGame, releasedGames,
                        zPosts, zFollowers, youVideoPosts, youVideoSubscribers,
                        cash, loans, monthlyExpenses, monthlyIncome, financialHistory,
                        currentYear, currentMonth, employees, awards, nominations,
                        investors, fame, officeUpgrades, officeCapacity, settings,
                        piracyEvents
                    }
                };

                const newSaves = currentSaveId
                    ? saves.map(s => s.id === currentSaveId ? saveData : s)
                    : [...saves, saveData];

                set({
                    saves: newSaves,
                    currentSaveId: saveData.id
                });
            },

            // Load a save
            loadSave: (saveId) => {
                const save = get().saves.find(s => s.id === saveId);
                if (save) {
                    set({
                        ...save.data,
                        currentSaveId: saveId
                    });
                }
            },

            // Delete a save
            deleteSave: (saveId) => {
                set({ saves: get().saves.filter(s => s.id !== saveId) });
            },

            // Create character (modified to start new save context)
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
                    accessory: characterData.accessory || 'none',
                    facialHair: characterData.facialHair || 'none',
                    startingYear: characterData.startingYear,
                    startingAge: characterData.startingAge,
                    createdAt: new Date().toISOString()
                };

                // Create a new save ID immediately
                const newSaveId = `save-${Date.now()}`;

                set({
                    currentSaveId: newSaveId,
                    character,
                    studio: null,
                    studios: [],
                    currentGame: null,
                    releasedGames: [],
                    zPosts: [],
                    zFollowers: 0,
                    youVideoPosts: [],
                    youVideoSubscribers: 0,
                    cash: 10000,
                    loans: [],
                    monthlyExpenses: 0,
                    monthlyIncome: 0,
                    financialHistory: [],
                    currentYear: characterData.startingYear,
                    currentMonth: 1,
                    employees: [],
                    awards: [],
                    nominations: [],
                    investors: [],
                    fame: 0,
                    officeUpgrades: [],
                    officeCapacity: 5,
                    settings: { ...DEFAULT_SETTINGS },
                    piracyEvents: []
                });

                // Initial save
                get().saveGame();

                return character;
            },

            // Create studio (Auto-save after creation)
            createStudio: (studioData) => {
                const studio = {
                    id: `studio-${Date.now()}`,
                    name: studioData.name,
                    engine: studioData.engine,
                    founded: get().currentYear,
                    games: [],
                    employees: [],
                    valuation: 0,
                    reputation: 50,
                    createdAt: new Date().toISOString()
                };

                const newStudios = [...get().studios, studio];
                set({
                    studio,
                    studios: newStudios
                });

                get().saveGame(); // Save progress

                return studio;
            },

            // Switch studio
            switchStudio: (studioId) => {
                const studios = get().studios;
                const newStudio = studios.find(s => s.id === studioId);
                if (newStudio) {
                    set({ studio: newStudio });
                    get().saveGame();
                }
            },

            // Delete studio
            deleteStudio: (studioId) => {
                const studios = get().studios.filter(s => s.id !== studioId);
                const currentStudio = get().studio;

                set({
                    studios,
                    studio: currentStudio?.id === studioId ? (studios[0] || null) : currentStudio
                });
                get().saveGame();
            },

            // Start developing a game
            startGame: (gameData) => {
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
                    engine: get().studio?.engine || 'unity',
                    status: 'development',
                    progress: 0,
                    devTimeMonths,
                    monthsWorked: 0,
                    quality: 50,
                    hype: 0,
                    bugs: Math.floor(Math.random() * 50) + 20, // Start with some bugs
                    budget: gameData.budget || 0,
                    startedAt: { year: get().currentYear, month: get().currentMonth },
                    editions: [{ id: 'standard', name: 'Standard Edition', price: gameData.price || 29.99 }],
                    dlcs: [],
                    chapters: [],
                    platforms: ['mist'], // Default to Mist
                    modSupport: 'none',
                    drm: 'none',
                    updates: [],
                    features: []
                };

                set({ currentGame: game });
                get().saveGame();
                return game;
            },

            // Add feature/gameplay to game in development
            addGameFeature: (feature) => {
                const currentGame = get().currentGame;
                if (!currentGame) return;

                const updatedGame = {
                    ...currentGame,
                    features: [...(currentGame.features || []), feature],
                    quality: currentGame.quality + (feature.qualityBonus || 0),
                    devTimeMonths: currentGame.devTimeMonths + (feature.timeAddition || 1)
                };

                set({ currentGame: updatedGame });
            },

            // Add edition to released game
            addGameEdition: (gameId, edition) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId) {
                        return {
                            ...game,
                            editions: [...(game.editions || []), edition]
                        };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
            },

            // Add DLC to released game
            addDLC: (gameId, dlc) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId) {
                        return {
                            ...game,
                            dlcs: [...(game.dlcs || []), {
                                ...dlc,
                                id: `dlc-${Date.now()}`,
                                releasedAt: { year: get().currentYear, month: get().currentMonth },
                                sales: 0,
                                revenue: 0
                            }]
                        };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
            },

            // Add chapter/episode to game
            addChapter: (gameId, chapter) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId) {
                        return {
                            ...game,
                            chapters: [...(game.chapters || []), {
                                ...chapter,
                                id: `chapter-${Date.now()}`,
                                releasedAt: { year: get().currentYear, month: get().currentMonth }
                            }]
                        };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
            },

            // Update game post-release (fixes, features)
            pushGameUpdate: (gameId, update) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId) {
                        return {
                            ...game,
                            bugs: Math.max(0, (game.bugs || 0) - (update.bugsFixes || 0)),
                            quality: Math.min(100, (game.quality || 50) + (update.qualityBoost || 0)),
                            updates: [...(game.updates || []), {
                                ...update,
                                id: `update-${Date.now()}`,
                                releasedAt: { year: get().currentYear, month: get().currentMonth }
                            }]
                        };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
            },

            // Set mod support for game
            setModSupport: (gameId, level) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId) {
                        return { ...game, modSupport: level };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
            },

            // Set DRM/piracy protection
            setPiracyProtection: (gameId, drmType) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId) {
                        return { ...game, drm: drmType };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
            },

            // Release on additional platform
            releaseOnPlatform: (gameId, platformId) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId && !game.platforms.includes(platformId)) {
                        return {
                            ...game,
                            platforms: [...game.platforms, platformId]
                        };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
            },

            // Apply for subscription service
            applyToSubscription: (gameId, serviceId) => {
                const service = SUBSCRIPTION_SERVICES.find(s => s.id === serviceId);
                const game = get().releasedGames.find(g => g.id === gameId);

                if (!service || !game) return { success: false, reason: 'Invalid game or service' };

                // Check requirements
                if (game.quality < service.requirements.minQuality) {
                    return { success: false, reason: `Requires ${service.requirements.minQuality}+ quality rating` };
                }
                if (get().fame < service.requirements.minFame) {
                    return { success: false, reason: `Requires ${service.requirements.minFame}+ studio fame` };
                }

                const releasedGames = get().releasedGames.map(g => {
                    if (g.id === gameId) {
                        return {
                            ...g,
                            subscriptions: [...(g.subscriptions || []), serviceId]
                        };
                    }
                    return g;
                });

                set({ releasedGames });
                get().saveGame();
                return { success: true };
            },

            // Advance time by 1 month
            advanceMonth: () => {
                const { currentMonth, currentYear, currentGame, employees, releasedGames, fame, loans } = get();

                let newMonth = currentMonth + 1;
                let newYear = currentYear;

                if (newMonth > 12) {
                    newMonth = 1;
                    newYear++;
                }

                // Calculate employee costs
                const employeeCosts = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

                // Calculate loan interest
                const loanPayments = loans.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0);

                // Update game progress
                let updatedGame = currentGame;
                if (currentGame && currentGame.status === 'development') {
                    const employeeBonus = employees.reduce((sum, emp) => sum + (emp.devBonus || 0), 0);
                    const progressPerMonth = (100 / currentGame.devTimeMonths) * (1 + employeeBonus);

                    updatedGame = {
                        ...currentGame,
                        progress: Math.min(100, currentGame.progress + progressPerMonth),
                        monthsWorked: currentGame.monthsWorked + 1,
                        // Quality affected by employees
                        quality: Math.min(100, currentGame.quality + employees.reduce((sum, emp) => sum + (emp.qualityBonus || 0) * 0.1, 0))
                    };

                    if (updatedGame.progress >= 100) {
                        updatedGame.status = 'ready';
                        updatedGame.bugs = Math.max(0, updatedGame.bugs - employees.filter(e => e.category === 'qa').length * 5);
                    }
                }

                // Generate revenue from released games
                let monthlyRevenue = 0;
                const updatedReleasedGames = releasedGames.map(game => {
                    // Calculate monthly sales based on quality, fame, platforms
                    const platformMultiplier = game.platforms.reduce((sum, p) => {
                        const platform = STORE_PLATFORMS.find(sp => sp.id === p);
                        return sum + (platform?.reach || 0);
                    }, 0);

                    const qualityFactor = (game.quality || 50) / 100;
                    const ageFactor = Math.max(0.1, 1 - ((newYear - game.releasedAt.year) * 12 + newMonth - game.releasedAt.month) * 0.05);

                    const baseSales = Math.floor(1000 * qualityFactor * platformMultiplier * ageFactor * (1 + fame / 100));
                    const price = game.editions[0]?.price || 29.99;
                    const revenue = baseSales * price;

                    monthlyRevenue += revenue;

                    return {
                        ...game,
                        sales: (game.sales || 0) + baseSales,
                        revenue: (game.revenue || 0) + revenue
                    };
                });

                // Calculate new cash
                const newCash = get().cash + monthlyRevenue - employeeCosts - loanPayments;

                // Record financial history
                const financialHistory = [...get().financialHistory, {
                    year: newYear,
                    month: newMonth,
                    income: monthlyRevenue,
                    expenses: employeeCosts + loanPayments,
                    balance: newCash
                }].slice(-24); // Keep last 24 months

                set({
                    currentMonth: newMonth,
                    currentYear: newYear,
                    currentGame: updatedGame,
                    releasedGames: updatedReleasedGames,
                    cash: newCash,
                    monthlyIncome: monthlyRevenue,
                    monthlyExpenses: employeeCosts + loanPayments,
                    financialHistory
                });

                // Auto-save every month
                get().saveGame();
            },

            // Release a game
            releaseGame: (gameId, publisherId = 'self', price = 29.99, platforms = ['mist']) => {
                const { currentGame, releasedGames, currentYear, currentMonth, studio } = get();

                if (!currentGame || currentGame.id !== gameId) return null;
                if (currentGame.status !== 'ready') return null;

                const publisher = PUBLISHERS.find(p => p.id === publisherId);

                const releasedGame = {
                    ...currentGame,
                    status: 'released',
                    releasedAt: { year: currentYear, month: currentMonth },
                    publisher: publisher,
                    platforms: platforms,
                    sales: 0,
                    revenue: 0,
                    reviews: [],
                    rating: Math.min(100, currentGame.quality + Math.floor(Math.random() * 20) - 10),
                    piracyRate: 0,
                    subscriptions: []
                };

                // Calculate initial hype/sales based on quality and fame
                const priceToUse = price || currentGame.editions[0]?.price || 29.99;
                const initialSales = Math.floor(
                    1000 * (releasedGame.quality / 100) * (1 + get().fame / 50) * (1 + (publisher?.reachBonus || 0))
                );
                releasedGame.sales = initialSales;
                releasedGame.revenue = initialSales * priceToUse * (1 - (publisher?.cut || 0));

                set({
                    currentGame: null,
                    releasedGames: [...releasedGames, releasedGame],
                    cash: get().cash + releasedGame.revenue,
                    fame: Math.min(100, get().fame + Math.floor(releasedGame.quality / 10))
                });
                get().saveGame();

                return releasedGame;
            },

            // Remove game from store (Unlist)
            unlistGame: (gameId, platformId) => {
                const releasedGames = get().releasedGames.map(game => {
                    if (game.id === gameId) {
                        return {
                            ...game,
                            platforms: game.platforms.filter(p => p !== platformId)
                        };
                    }
                    return game;
                });
                set({ releasedGames });
                get().saveGame();
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

                // Gain followers based on post
                const currentFollowers = get().zFollowers;
                const newFollowers = Math.floor(Math.random() * 50) + Math.floor(currentFollowers * 0.05) + 5;

                set({
                    zPosts: [post, ...get().zPosts].slice(0, 50), // Limit history
                    zFollowers: currentFollowers + newFollowers
                });
                get().saveGame();
                return post;
            },

            // Delete Z post
            deleteZPost: (postId) => {
                set({ zPosts: get().zPosts.filter(p => p.id !== postId) });
                get().saveGame();
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

                // Gain subscribers based on video
                const currentSubs = get().youVideoSubscribers;
                const newSubs = Math.floor(Math.random() * 100) + Math.floor(currentSubs * 0.08) + 10;

                set({
                    youVideoPosts: [video, ...get().youVideoPosts].slice(0, 50), // Limit history
                    youVideoSubscribers: currentSubs + newSubs
                });
                get().saveGame();
                return video;
            },

            // Delete YouVideo video
            deleteYouVideo: (videoId) => {
                set({ youVideoPosts: get().youVideoPosts.filter(v => v.id !== videoId) });
                get().saveGame();
            },

            // Hire employee
            hireEmployee: (employee) => {
                const newEmployee = {
                    ...employee,
                    id: `emp-${Date.now()}`,
                    hiredAt: new Date().toISOString(),
                    morale: 80
                };
                set({ employees: [...get().employees, newEmployee] });
                get().saveGame();
            },

            // Fire employee
            fireEmployee: (employeeId) => {
                set({ employees: get().employees.filter(e => e.id !== employeeId) });
                get().saveGame();
            },

            // Purchase office upgrade
            purchaseOfficeUpgrade: (upgradeId) => {
                const upgrade = OFFICE_UPGRADES.find(u => u.id === upgradeId);
                if (!upgrade) return { success: false, reason: 'Invalid upgrade' };
                if (get().cash < upgrade.cost) return { success: false, reason: 'Insufficient funds' };
                if (get().officeUpgrades.includes(upgradeId)) return { success: false, reason: 'Already owned' };

                set({
                    cash: get().cash - upgrade.cost,
                    officeUpgrades: [...get().officeUpgrades, upgradeId],
                    officeCapacity: get().officeCapacity + (upgrade.capacity || 0)
                });
                get().saveGame();
                return { success: true };
            },

            // Take a loan
            takeLoan: (amount, interestRate = 0.05, termMonths = 24) => {
                const monthlyPayment = (amount * (1 + interestRate)) / termMonths;
                const loan = {
                    id: `loan-${Date.now()}`,
                    amount,
                    interestRate,
                    termMonths,
                    monthlyPayment,
                    remainingMonths: termMonths,
                    takenAt: { year: get().currentYear, month: get().currentMonth }
                };

                set({
                    cash: get().cash + amount,
                    loans: [...get().loans, loan]
                });
                get().saveGame();
            },

            // Pay off loan early
            payLoan: (loanId, amount) => {
                const loans = get().loans.map(loan => {
                    if (loan.id === loanId) {
                        const newRemaining = loan.amount - amount;
                        if (newRemaining <= 0) {
                            return null; // Remove loan
                        }
                        return {
                            ...loan,
                            amount: newRemaining,
                            monthlyPayment: (newRemaining * (1 + loan.interestRate)) / loan.remainingMonths
                        };
                    }
                    return loan;
                }).filter(Boolean);

                set({
                    cash: get().cash - amount,
                    loans
                });
                get().saveGame();
            },

            // Update settings
            updateSettings: (newSettings) => {
                set({ settings: { ...get().settings, ...newSettings } });
                get().saveGame();
            },

            // Reset game dev (clears active state only)
            resetGameDev: () => {
                set({
                    currentSaveId: null,
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
                    loans: [],
                    monthlyExpenses: 0,
                    monthlyIncome: 0,
                    financialHistory: [],
                    currentYear: 2024,
                    currentMonth: 1,
                    employees: [],
                    awards: [],
                    nominations: [],
                    investors: [],
                    fame: 0,
                    officeUpgrades: [],
                    officeCapacity: 5,
                    settings: { ...DEFAULT_SETTINGS },
                    piracyEvents: []
                });
            },

            // Logout (back to menu)
            logout: () => {
                get().saveGame(); // Save before quit
                set({ currentSaveId: null, character: null }); // Clear active
            }
        }),
        {
            name: 'game-dev-tycoon-storage',
            partialize: (state) => ({
                saves: state.saves,
                // Persist active state too so reload works
                currentSaveId: state.currentSaveId,
                character: state.character,
                studios: state.studios,
                studio: state.studio,
                releasedGames: state.releasedGames,
                zPosts: state.zPosts,
                zFollowers: state.zFollowers,
                youVideoPosts: state.youVideoPosts,
                youVideoSubscribers: state.youVideoSubscribers,
                cash: state.cash,
                loans: state.loans,
                financialHistory: state.financialHistory,
                currentYear: state.currentYear,
                currentMonth: state.currentMonth,
                employees: state.employees,
                awards: state.awards,
                nominations: state.nominations,
                investors: state.investors,
                fame: state.fame,
                officeUpgrades: state.officeUpgrades,
                officeCapacity: state.officeCapacity,
                settings: state.settings,
                piracyEvents: state.piracyEvents
            })
        }
    )
);

export default useGameDevStore;
