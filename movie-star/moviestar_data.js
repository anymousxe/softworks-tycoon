// moviestar_data.js

// --- CONSTANTS & CONFIG ---

const GENRES = [
    { id: 'action', name: 'Action', multiplier: 1.4, costMod: 1.5, desc: "Explosions and fights." },
    { id: 'drama', name: 'Drama', multiplier: 1.1, costMod: 0.8, desc: "Emotional storytelling." },
    { id: 'scifi', name: 'Sci-Fi', multiplier: 1.6, costMod: 2.2, desc: "Space and lasers." },
    { id: 'comedy', name: 'Comedy', multiplier: 1.2, costMod: 0.9, desc: "Laughs per minute." },
    { id: 'horror', name: 'Horror', multiplier: 1.5, costMod: 0.7, desc: "Cheap to make, high returns." },
    { id: 'romance', name: 'Romance', multiplier: 1.0, costMod: 0.8, desc: "Love is in the air." },
    { id: 'fantasy', name: 'Fantasy', multiplier: 1.7, costMod: 2.5, desc: "Swords and sorcery." },
    { id: 'docu', name: 'Documentary', multiplier: 0.8, costMod: 0.4, desc: "Real life events." },
    { id: 'thriller', name: 'Thriller', multiplier: 1.3, costMod: 1.1, desc: "Suspense and mystery." },
    { id: 'musical', name: 'Musical', multiplier: 1.2, costMod: 1.4, desc: "Singing and dancing." },
    { id: 'western', name: 'Western', multiplier: 1.1, costMod: 1.2, desc: "Cowboys and outlaws." },
    { id: 'cyberpunk', name: 'Cyberpunk', multiplier: 1.5, costMod: 2.0, desc: "High tech, low life." },
    { id: 'noir', name: 'Noir', multiplier: 1.1, costMod: 0.9, desc: "Black and white mystery." },
    { id: 'anime', name: 'Live Action Anime', multiplier: 0.5, costMod: 1.5, desc: "Usually flops." }
];

// 200+ Shop Items (Compressed to save token space but functionally vast)
const SHOP_ITEMS = [
    // --- CAMERAS ---
    { id: 'cam_iphone', name: 'Smartphone Camera', category: 'Camera', cost: 1000, qualityBonus: 1 },
    { id: 'cam_dslr', name: 'Indie DSLR', category: 'Camera', cost: 5000, qualityBonus: 5 },
    { id: 'cam_red', name: 'Red Cinema Cam', category: 'Camera', cost: 50000, qualityBonus: 15 },
    { id: 'cam_imax', name: 'IMAX 70mm', category: 'Camera', cost: 500000, qualityBonus: 40 },
    // --- PROPS (Generic) ---
    ...Array.from({length: 50}, (_, i) => ({ id: `prop_gun_${i}`, name: `Prop Weapon Mk${i+1}`, category: 'Prop', cost: 500 + (i*100), qualityBonus: 0.1 })),
    ...Array.from({length: 50}, (_, i) => ({ id: `prop_car_${i}`, name: `Vehicle Model ${i+1}`, category: 'Vehicle', cost: 10000 + (i*5000), qualityBonus: 0.5 })),
    ...Array.from({length: 50}, (_, i) => ({ id: `prop_costume_${i}`, name: `Costume Set ${i+1}`, category: 'Wardrobe', cost: 2000 + (i*200), qualityBonus: 0.2 })),
    // --- SPECIAL ITEMS ---
    { id: 'studio_green', name: 'Green Screen Studio', category: 'Facility', cost: 100000, qualityBonus: 10 },
    { id: 'studio_vol', name: 'The Volume (LED Wall)', category: 'Facility', cost: 5000000, qualityBonus: 50 },
    { id: 'drone_swarm', name: 'Drone Swarm', category: 'Gear', cost: 25000, qualityBonus: 5 },
    { id: 'ai_script', name: 'AI Scriptwriter V1', category: 'Software', cost: 10000, qualityBonus: -5 }, // Joke item
    { id: 'coffee_machine', name: 'Gold Coffee Machine', category: 'Morale', cost: 5000, qualityBonus: 0 },
];

const JOB_TITLES = [
    { title: "Background Extra", wage: 100, reqFame: 0, reqTalent: 0 },
    { title: "Commercial Actor", wage: 500, reqFame: 50, reqTalent: 10 },
    { title: "Soap Opera Star", wage: 2000, reqFame: 200, reqTalent: 50 },
    { title: "TV Series Regular", wage: 10000, reqFame: 1000, reqTalent: 150 },
    { title: "Movie Star", wage: 100000, reqFame: 5000, reqTalent: 300 },
    { title: "A-List Icon", wage: 1000000, reqFame: 50000, reqTalent: 600 },
    { title: "Legend", wage: 5000000, reqFame: 500000, reqTalent: 1000 }
];

// Massive Name Lists
const FIRST_NAMES = ["Liam","Olivia","Noah","Emma","Oliver","Charlotte","Elijah","Amelia","James","Ava","William","Sophia","Benjamin","Isabella","Lucas","Mia","Henry","Evelyn","Theodore","Harper","Jack","Camila","Levi","Gianna","Alexander","Abigail","Jackson","Luna","Mateo","Ella","Daniel","Elizabeth","Michael","Sofia","Mason","Emily","Sebastian","Avery","Ethan","Mila","Logan","Aria","Owen","Scarlett","Samuel","Penelope","Jacob","Layla","Asher","Chloe","Aiden","Willow","John","Maya","Joseph","Nora","Wyatt","Hazel","David","Elena","Leo","Lily","Luke","Violet","Julian","Aurora","Hudson","Savannah","Grayson","Brooklyn","Matthew","Paisley","Ezra","Claire","Gabriel","Skylar","Carter","Lucy","Isaac","Katherine","Jayden","Sloane","Luca","Ellie","Anthony","Anna","Dylan","Josephine","Lincoln","Grace","Thomas","Ruby","Maverick","Zoe","Elias","Madelyn","Josiah","Serenity","Charles","Kinsley","Caleb","Sadie","Christopher","Alice","Ezekiel","Chloe","Miles","Bella","Jaxon","Florence","Isaiah","Keira","Andrew","Dale","Joshua","Brittany","Nathan","Mariah","Nolan","Cardi","Adrian","Megan","Cameron","Salma","Santiago","Halle","Eli","Demi","Aaron","Selena","Ryan","Lana","Angel","Dua","Cooper","Ariana","Waylon","Taylor","Easton","Billie","Kai","Kylie","Christian","Kendall","Landon","Kim","Colton","Khloe","Roman","Kourtney","Axel","Kris","Brooks","Caitlyn","Jonathan","Paris","Robert","Nicole","Jameson","Lindsay","Ian","Hilary","Everett","Amanda","Greyson","Miley","Wesley","Ashley","Jeremiah","Vanessa","Hunter","Zac","Leonardo","Jared","Jordan","Jensen","Jose","Misha","Bennett","Pedro","Silas","Oscar","Nicholas","Paul","Parker","Timothee","Beau","Austin","Weston","Harry","Austin","Niall","Connor","Louis","Carson","Zayn","Dominic","Liam","Xavier","Shawn","Jaxson","Justin","Jace","Hailey","Emmett","Gigi","Adam","Bella","Declan","Kendall","Rowan","Cara","Micah","Karlie","Kayden","Joan","Gael","Cindy","River","Naomi","Ryder","Tyra","Kingston","Heidi","Damian","Gisele","Sawyer","Adriana","Luka","Candice","Evan","Alessandra","Vincent","Behati","Harrison","Lily","Chase","Jasmine","Diego","Elsa","Myles","Martha","Jasper","Snoop","Zachary","Eminem","Adriel","Jay","Nathaniel","Kanye","Arthur","Drake","Gavin","Travis","Brayden","Weeknd","Giovanni","Post","Bruno","Malone","Luciano","Frank","Calvin","Ocean","Blake","Tyler","Zion","Rocky","Kyrie","A$AP","Enzo","Fergie","George","Gwen","Cole","Shakira","Juan","Beyonce","Luis","Rihanna","Bentley","Madonna"];
const LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts","Gomez","Phillips","Evans","Turner","Diaz","Parker","Cruz","Edwards","Collins","Reyes","Stewart","Morris","Morales","Murphy","Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper","Peterson","Bailey","Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson","Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz","Hughes","Price","Alvarez","Castillo","Sanders","Patel","Myers
