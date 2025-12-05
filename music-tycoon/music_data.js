// --- SOFTWORKS MUSIC DATABASE ---

const MUSIC_GENRES = ['Hip-Hop', 'Pop', 'R&B', 'Trap', 'Alternative', 'Rock'];

const SONG_ADJECTIVES = [
    "Midnight", "Broken", "Neon", "Electric", "Savage", "Lonely", "Golden", "Toxic", 
    "Cyber", "Endless", "Final", "Lost", "Dark", "Bright", "Cold", "Hot", "Empty", 
    "Rich", "Poor", "Digital", "Analog", "Silent", "Loud", "Dead", "Alive"
];

const SONG_NOUNS = [
    "Dreams", "Vibes", "Heart", "Money", "Love", "City", "Lights", "Memories", 
    "Time", "Soul", "Waves", "Drive", "Summer", "Winter", "Night", "Star", "Demon", 
    "Angel", "Sky", "Rain", "Fire", "Ice", "Code", "Glitch", "System"
];

const MUSIC_RIVALS_DB = [
    { name: 'Drak3', fame: 100, genre: 'Hip-Hop' },
    { name: 'Tayla Swyft', fame: 98, genre: 'Pop' },
    { name: 'The Wknd', fame: 95, genre: 'R&B' },
    { name: 'Kanyay West', fame: 92, genre: 'Rap' },
    { name: 'Travis Scott', fame: 90, genre: 'Trap' },
    { name: 'Olivia Rod', fame: 85, genre: 'Pop' },
    { name: 'Post Malon', fame: 80, genre: 'Pop-Rap' },
    { name: 'Doja Catty', fame: 78, genre: 'Pop' },
    { name: 'Lil Uzi Vertical', fame: 75, genre: 'Trap' }
];

const LABELS_DB = [
    { id: 'indie', name: 'Indie Distro', tier: 1, cut: 0, bonus: 1.0, desc: "Self-published. You keep 100% royalties.", color: "text-slate-400" },
    { id: 'underground', name: 'Underground Recs', tier: 2, cut: 0.2, bonus: 1.5, desc: "Street cred. Small hype boost. 20% cut.", color: "text-yellow-400" },
    { id: 'defjamz', name: 'Def Jamz', tier: 3, cut: 0.4, bonus: 2.5, desc: "Major Label status. Big marketing. 40% cut.", color: "text-red-400" },
    { id: 'sonyx', name: 'Sonyx Music', tier: 4, cut: 0.5, bonus: 3.5, desc: "Global Reach. Massive resources. 50% cut.", color: "text-blue-400" },
    { id: 'universole', name: 'Universole', tier: 5, cut: 0.7, bonus: 6.0, desc: "Industry Plant. You are everywhere. 70% cut.", color: "text-purple-400" }
];

// CSS Classes for covers
const ALBUM_ART_STYLES = [
    { id: 'blue_haze', class: 'bg-gradient-to-tr from-blue-700 to-cyan-400', name: 'Blue Haze' },
    { id: 'sunset', class: 'bg-gradient-to-br from-red-600 to-yellow-400', name: 'Sunset' },
    { id: 'dark_mode', class: 'bg-black border border-white/20', name: 'Dark Mode' },
    { id: 'chrome', class: 'bg-gradient-to-b from-slate-300 to-slate-600 border border-white', name: 'Chrome' },
    { id: 'slime', class: 'bg-[#ccff00] text-black', name: 'Slime' },
    { id: 'void', class: 'bg-purple-900 animate-pulse', name: 'The Void' },
    { id: 'matrix', class: 'bg-green-900 border border-green-500', name: 'Matrix' },
    { id: 'fire', class: 'bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400', name: 'Inferno' }
];
