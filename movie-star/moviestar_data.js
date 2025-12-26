// moviestar_data.js

const GENRES = [
    { id: 'action', name: 'Action', multiplier: 1.2, costMod: 1.5 },
    { id: 'drama', name: 'Drama', multiplier: 1.0, costMod: 0.8 },
    { id: 'scifi', name: 'Sci-Fi', multiplier: 1.4, costMod: 2.0 },
    { id: 'comedy', name: 'Comedy', multiplier: 1.1, costMod: 0.9 },
    { id: 'horror', name: 'Horror', multiplier: 1.3, costMod: 0.7 },
    { id: 'romance', name: 'Romance', multiplier: 0.9, costMod: 0.8 },
    { id: 'fantasy', name: 'Fantasy', multiplier: 1.5, costMod: 2.5 },
    { id: 'docu', name: 'Documentary', multiplier: 0.7, costMod: 0.4 }
];

const ACTOR_FIRST_NAMES = [
    "Leonardo", "Scarlett", "Denzel", "Meryl", "Brad", "Jennifer", "Tom", "Viola", "Robert", "Emma",
    "Johnny", "Julia", "Samuel", "Anne", "Will", "Angelina", "Joaquin", "Charlize", "Christian", "Natalie",
    "Morgan", "Sandra", "Keanu", "Nicole", "Harrison", "Cate", "Daniel", "Kate", "Liam", "Margot",
    "Ryan", "Jessica", "Idris", "Lupita", "Chris", "Zendaya", "Timothee", "Florence", "Austin", "Jenna",
    "Pedro", "Bella", "Cillian", "Anya", "Oscar", "Michelle", "Paul", "Saoirse", "Adam", "Emily",
    "Benedict", "Elizabeth", "Jason", "Gal", "Dwayne", "Brie", "Henry", "Kristen", "Robert", "Salma",
    "Javier", "Penelope", "Mahershala", "Octavia", "Rami", "Regina", "Chadwick", "Tessa", "John", "Daisy",
    // ... imagine 200 more names here ...
    "River", "Phoenix", "Summer", "Rain", "Storm", "Sky", "Ocean", "Forest", "Willow", "Hazel"
];

const ACTOR_LAST_NAMES = [
    "DiCaprio", "Johansson", "Washington", "Streep", "Pitt", "Lawrence", "Hanks", "Davis", "DeNiro", "Stone",
    "Depp", "Roberts", "Jackson", "Hathaway", "Smith", "Jolie", "Phoenix", "Theron", "Bale", "Portman",
    "Freeman", "Bullock", "Reeves", "Kidman", "Ford", "Blanchett", "Craig", "Winslet", "Neeson", "Robbie",
    "Gosling", "Chastain", "Elba", "Nyong'o", "Hemsworth", "Coleman", "Chalamet", "Pugh", "Butler", "Ortega",
    "Pascal", "Ramsey", "Murphy", "Taylor-Joy", "Isaac", "Yeoh", "Mescal", "Ronan", "Driver", "Blunt",
    "Cumberbatch", "Olsen", "Momoa", "Gadot", "Johnson", "Larson", "Cavill", "Stewart", "Pattinson", "Hayek",
    "Bardem", "Cruz", "Ali", "Spencer", "Malek", "King", "Boseman", "Thompson", "David", "Ridley",
    // ... imagine 200 more names here ...
    "West", "North", "South", "East", "Winters", "Summers", "Springer", "Fall", "Frost", "Snow"
];

const MOVIE_PREFIXES = [
    "The Last", "A Quiet", "Return of the", "Empire of", "Attack of the", "The Secret", "Lost in", "Chronicles of",
    "Legend of", "Rise of the", "Dawn of the", "War for", "Battle of", "Escape from", "Journey to", "Night at the",
    "Silence of the", "Guardians of", "Lord of the", "Game of", "House of", "Citizen", "American", "Midnight",
    "Eternal", "Infinite", "Dark", "Golden", "Silver", "Iron", "Steel", "Velvet", "Neon", "Cyber", "Space",
    "Deep", "Wild", "Fast", "Furious", "Deadly", "Lethal", "Final", "First", "Second", "Third", "Ultimate",
    "Supreme", "Rogue", "Rebel", "Phantom", "Ghost", "Shadow", "Spirit", "Soul", "Heart", "Blood", "Tears",
    "Love", "Hate", "Hope", "Fear", "Dream", "Nightmare", "Vision", "Sound", "Touch", "Taste", "Smell"
];

const MOVIE_NOUNS = [
    "Samurai", "Jedi", "Avenger", "Wizard", "King", "Queen", "Prince", "Princess", "Knight", "Warrior",
    "Soldier", "Spy", "Detective", "Cop", "Doctor", "Nurse", "Teacher", "Student", "Lover", "Hater",
    "Friend", "Enemy", "Stranger", "Neighbor", "Alien", "Robot", "Cyborg", "Monster", "Ghost", "Vampire",
    "Werewolf", "Zombie", "Demon", "Angel", "God", "Devil", "Hero", "Villain", "Titan", "Giant",
    "Dragon", "Beast", "Creature", "Thing", "Planet", "Star", "Galaxy", "Universe", "World", "City",
    "Town", "Village", "House", "Home", "School", "Hospital", "Prison", "Ship", "Boat", "Plane",
    "Car", "Train", "Bus", "Bike", "Road", "Street", "Highway", "Bridge", "Tunnel", "Mountain"
];

const MOVIE_SUFFIXES = [
    "Legacy", "Protocol", "Redemption", "Resurrection", "Revolution", "Evolution", "Reloaded", "Revolutions",
    "Awakens", "Returns", "Forever", "Begins", "Rises", "Falls", "Part I", "Part II", "Part III",
    "Origins", "Prequel", "Sequel", "Reboot", "Remake", "Uncut", "Extended", "Director's Cut", "Final Cut",
    "Saga", "Trilogy", "Anthology", "Collection", "Volume 1", "Volume 2", "Chapter 1", "Chapter 2", "Episode I",
    "Episode II", "Episode III", "Episode IV", "Episode V", "Episode VI", "Episode VII", "Episode VIII", "Episode IX"
];

const JOB_TITLES = [
    { title: "Background Extra", wage: 200, reqFame: 0, reqTalent: 0 },
    { title: "Commercial Actor", wage: 500, reqFame: 10, reqTalent: 5 },
    { title: "Soap Opera Guest", wage: 1200, reqFame: 50, reqTalent: 20 },
    { title: "Indie Film Lead", wage: 3000, reqFame: 150, reqTalent: 50 },
    { title: "TV Series Regular", wage: 15000, reqFame: 500, reqTalent: 100 },
    { title: "Blockbuster Supporting", wage: 50000, reqFame: 2000, reqTalent: 300 },
    { title: "A-List Superstar", wage: 500000, reqFame: 10000, reqTalent: 800 }
];

const CLASSES = [
    { name: "Acting 101", cost: 100, talentGain: 2 },
    { name: "Improv Workshop", cost: 300, talentGain: 5 },
    { name: "Voice Coaching", cost: 800, talentGain: 12 },
    { name: "Method Acting", cost: 2000, talentGain: 35 },
    { name: "Stunt School", cost: 5000, talentGain: 80 },
    { name: "Masterclass", cost: 15000, talentGain: 200 }
];

// Helper to generate random items
function generateRandomActor(budgetLevel) {
    const f = ACTOR_FIRST_NAMES[Math.floor(Math.random() * ACTOR_FIRST_NAMES.length)];
    const l = ACTOR_LAST_NAMES[Math.floor(Math.random() * ACTOR_LAST_NAMES.length)];
    
    // Scale stats based on budget level (1 = low, 5 = high)
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
