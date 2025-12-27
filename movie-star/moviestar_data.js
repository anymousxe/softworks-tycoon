// moviestar_data.js

const GENRES = [
    { id: 'action', name: 'Action', multiplier: 1.3, costMod: 1.5 },
    { id: 'drama', name: 'Drama', multiplier: 1.1, costMod: 0.8 },
    { id: 'scifi', name: 'Sci-Fi', multiplier: 1.5, costMod: 2.0 },
    { id: 'comedy', name: 'Comedy', multiplier: 1.2, costMod: 0.9 },
    { id: 'horror', name: 'Horror', multiplier: 1.4, costMod: 0.7 },
    { id: 'romance', name: 'Romance', multiplier: 1.0, costMod: 0.8 },
    { id: 'fantasy', name: 'Fantasy', multiplier: 1.6, costMod: 2.5 },
    { id: 'docu', name: 'Documentary', multiplier: 0.8, costMod: 0.4 },
    { id: 'thriller', name: 'Thriller', multiplier: 1.25, costMod: 1.1 },
    { id: 'musical', name: 'Musical', multiplier: 1.15, costMod: 1.3 }
];

// Expanded Job List (20+ Ranks)
const JOB_TITLES = [
    { title: "Community Theater Tree", wage: 50, reqFame: 0, reqTalent: 0 },
    { title: "Mall Santa / Elf", wage: 150, reqFame: 5, reqTalent: 5 },
    { title: "Student Film Extra", wage: 250, reqFame: 15, reqTalent: 10 },
    { title: "TikTok Influencer", wage: 400, reqFame: 50, reqTalent: 15 },
    { title: "Local Commercial Lead", wage: 800, reqFame: 100, reqTalent: 25 },
    { title: "Reality TV Contestant", wage: 1200, reqFame: 250, reqTalent: 30 },
    { title: "Soap Opera Guest", wage: 2000, reqFame: 500, reqTalent: 50 },
    { title: "Sitcom Recurring Role", wage: 3500, reqFame: 1000, reqTalent: 80 },
    { title: "Indie Film Supporting", wage: 5000, reqFame: 2000, reqTalent: 120 },
    { title: "Indie Film Lead", wage: 8000, reqFame: 3500, reqTalent: 180 },
    { title: "Network TV Regular", wage: 15000, reqFame: 5000, reqTalent: 250 },
    { title: "B-Movie Action Star", wage: 25000, reqFame: 8000, reqTalent: 300 },
    { title: "Streaming Series Lead", wage: 40000, reqFame: 15000, reqTalent: 400 },
    { title: "Blockbuster Villain", wage: 75000, reqFame: 30000, reqTalent: 500 },
    { title: "Rom-Com Heartthrob", wage: 100000, reqFame: 50000, reqTalent: 600 },
    { title: "Oscar Bait Lead", wage: 150000, reqFame: 80000, reqTalent: 800 },
    { title: "Franchise Superhero", wage: 300000, reqFame: 150000, reqTalent: 900 },
    { title: "A-List Superstar", wage: 500000, reqFame: 300000, reqTalent: 1000 },
    { title: "Living Legend", wage: 1000000, reqFame: 1000000, reqTalent: 1500 },
    { title: "Galactic Icon", wage: 5000000, reqFame: 5000000, reqTalent: 2500 }
];

const CLASSES = [
    { name: "Acting 101", cost: 100, talentGain: 2, desc: "Learn to cry on command." },
    { name: "Improv Workshop", cost: 300, talentGain: 5, desc: "Yes, and..." },
    { name: "Voice Coaching", cost: 800, talentGain: 12, desc: "Project from the diaphragm." },
    { name: "Stage Combat", cost: 1500, talentGain: 25, desc: "Safely punch people." },
    { name: "Method Acting", cost: 3000, talentGain: 45, desc: "Become the tree." },
    { name: "Directing Course", cost: 8000, talentGain: 100, desc: "Learn the other side." },
    { name: "Stunt School", cost: 15000, talentGain: 180, desc: "Jump off buildings." },
    { name: "Masterclass", cost: 50000, talentGain: 500, desc: "Taught by Meryl herself." }
];

const STAFF_TYPES = [
    { id: 'agent', name: "Talent Agent", cost: 5000, upkeep: 500, desc: "Finds better paying gigs automatically (+10% Wages)." },
    { id: 'publicist', name: "PR Publicist", cost: 8000, upkeep: 800, desc: "Manages your image (+5 Fame/week)." },
    { id: 'trainer', name: "Personal Trainer", cost: 12000, upkeep: 1200, desc: "Keeps you fit (+5 Talent/week)." },
    { id: 'lawyer', name: "Entertainment Lawyer", cost: 25000, upkeep: 2500, desc: "Sues tabloids for you (+2% of Net Worth yearly)." }
];

const MARKETING_CAMPAIGNS = [
    { name: "Social Media Blast", cost: 1000, fameGain: 50, hype: 10 },
    { name: "Tabloid Scandal", cost: 5000, fameGain: 300, hype: 50 },
    { name: "Talk Show Appearance", cost: 20000, fameGain: 1500, hype: 200 },
    { name: "Super Bowl Ad", cost: 1000000, fameGain: 50000, hype: 5000 }
];

// Helper to generate random items
const ACTOR_FIRST_NAMES = ["Leonardo", "Scarlett", "Denzel", "Meryl", "Brad", "Jennifer", "Tom", "Viola", "Robert", "Emma", "Johnny", "Julia", "Samuel", "Anne", "Will", "Angelina", "Joaquin", "Charlize", "Christian", "Natalie", "Morgan", "Sandra", "Keanu", "Nicole", "Harrison", "Cate", "Daniel", "Kate", "Liam", "Margot", "Ryan", "Jessica", "Idris", "Lupita", "Chris", "Zendaya", "Timothee", "Florence", "Austin", "Jenna", "Pedro", "Bella", "Cillian", "Anya", "Oscar", "Michelle", "Paul", "Saoirse", "Adam", "Emily"];
const ACTOR_LAST_NAMES = ["DiCaprio", "Johansson", "Washington", "Streep", "Pitt", "Lawrence", "Hanks", "Davis", "DeNiro", "Stone", "Depp", "Roberts", "Jackson", "Hathaway", "Smith", "Jolie", "Phoenix", "Theron", "Bale", "Portman", "Freeman", "Bullock", "Reeves", "Kidman", "Ford", "Blanchett", "Craig", "Winslet", "Neeson", "Robbie", "Gosling", "Chastain", "Elba", "Nyong'o", "Hemsworth", "Coleman", "Chalamet", "Pugh", "Butler", "Ortega", "Pascal", "Ramsey", "Murphy", "Taylor-Joy", "Isaac", "Yeoh", "Mescal", "Ronan", "Driver", "Blunt"];

const MOVIE_PREFIXES = ["The Last", "A Quiet", "Return of the", "Empire of", "Attack of the", "The Secret", "Lost in", "Chronicles of", "Legend of", "Rise of the", "Dawn of the", "War for", "Battle of", "Escape from", "Journey to", "Night at the", "Silence of the", "Guardians of", "Lord of the", "Game of", "House of", "Citizen", "American", "Midnight", "Eternal", "Infinite", "Dark", "Golden", "Silver", "Iron", "Steel", "Velvet", "Neon", "Cyber", "Space"];
const MOVIE_NOUNS = ["Samurai", "Jedi", "Avenger", "Wizard", "King", "Queen", "Prince", "Princess", "Knight", "Warrior", "Soldier", "Spy", "Detective", "Cop", "Doctor", "Nurse", "Teacher", "Student", "Lover", "Hater", "Friend", "Enemy", "Stranger", "Neighbor", "Alien", "Robot", "Cyborg", "Monster", "Ghost", "Vampire", "Werewolf", "Zombie", "Demon", "Angel", "God", "Devil"];
const MOVIE_SUFFIXES = ["Legacy", "Protocol", "Redemption", "Resurrection", "Revolution", "Evolution", "Reloaded", "Revolutions", "Awakens", "Returns", "Forever", "Begins", "Rises", "Falls", "Part I", "Part II", "Origins", "Prequel", "Sequel", "Reboot", "Remake", "Uncut", "Saga", "Trilogy"];

function generateRandomActor(budgetLevel) {
    const f = ACTOR_FIRST_NAMES[Math.floor(Math.random() * ACTOR_FIRST_NAMES.length)];
    const l = ACTOR_LAST_NAMES[Math.floor(Math.random() * ACTOR_LAST_NAMES.length)];
    const talent = Math.floor(Math.random() * (20 * budgetLevel)) + (10 * budgetLevel);
    const fame = Math.floor(Math.random() * (100 * budgetLevel)) + (50 * budgetLevel);
    const cost = (talent * 100) + (fame * 50);
    return { id: Date.now() + Math.random(), name: `${f} ${l}`, talent, fame, cost };
}

function generateMovieTitle() {
    const p = MOVIE_PREFIXES[Math.floor(Math.random() * MOVIE_PREFIXES.length)];
    const n = MOVIE_NOUNS[Math.floor(Math.random() * MOVIE_NOUNS.length)];
    if(Math.random() > 0.8) {
        const s = MOVIE_SUFFIXES[Math.floor(Math.random() * MOVIE_SUFFIXES.length)];
        return `${p} ${n}: ${s}`;
    }
    return `${p} ${n}`;
}
