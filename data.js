// --- SOFTWORKS MASTER DATABASE ---

// ==========================================
// 🧠 AI TYCOON DATA
// ==========================================

const HARDWARE = [
    { id: 'gtx_cluster', name: 'Consumer GPU Cluster', cost: 2000, compute: 5, upkeep: 10 },
    { id: 'rtx_4090_farm', name: 'RTX 4090 Farm', cost: 5500, compute: 15, upkeep: 40 },
    { id: 'a100', name: 'A100 Rack', cost: 8000, compute: 30, upkeep: 80 },
    { id: 'v100_legacy', name: 'V100 Legacy Rack', cost: 12000, compute: 45, upkeep: 120 },
    { id: 'h100', name: 'H100 Cluster', cost: 15000, compute: 80, upkeep: 150 },
    { id: 'h200', name: 'Nvidia H200', cost: 35000, compute: 150, upkeep: 300, reqTech: 'h200_unlock' },
    { id: 'gh200_super', name: 'GH200 Superchip', cost: 48000, compute: 250, upkeep: 450, reqTech: 'blackwell_arch' },
    { id: 'b200', name: 'Blackwell B200', cost: 60000, compute: 400, upkeep: 600, reqTech: 'blackwell_arch' },
    { id: 'dojo', name: 'Dojo Supercomputer', cost: 120000, compute: 800, upkeep: 900 },
    { id: 'tpu_pod', name: 'Google TPU Pod', cost: 250000, compute: 1500, upkeep: 1500, reqTech: 'tpu_opt' },
    { id: 'cerebras', name: 'Wafer Scale Engine', cost: 500000, compute: 3500, upkeep: 2500, reqTech: 'wafer_scale' },
    { id: 'quantum', name: 'Q-Bit Array', cost: 1500000, compute: 10000, upkeep: 5000, reqTech: 'quantum_tech' },
    { id: 'neural_link', name: 'Bio-Neural Hive', cost: 5000000, compute: 50000, upkeep: 10000, reqTech: 'bio_computing' }
];

const AI_COMPANIES = [
    { name: 'Indie Devs', budget: 1500 }, { name: 'Startup Inc', budget: 3500 },
    { name: 'Lmsite', budget: 5000, type: 'AI Hosting' }, { name: 'Listart', budget: 6500, type: 'Art Assets' },
    { name: 'Facebooc', budget: 8000 }, { name: 'StreamFlix', budget: 12000 },
    { name: 'Microhard', budget: 15000 }, { name: 'Joggle', budget: 18000 },
    { name: 'Amacon', budget: 22000 }, { name: 'NvidiaX', budget: 25000 },
    { name: 'Tessla', budget: 30000 }, { name: 'Fruit Co', budget: 35000 },
    { name: 'OpenAI (Real)', budget: 45000 }, { name: 'Wall Street', budget: 60000 },
    { name: 'SpaceY', budget: 80000 }, { name: 'Pentagon', budget: 150000 },
    { name: 'Global Gov', budget: 500000 }
];

const AI_CAMPAIGNS = [
    { id: 'social_ads', name: 'Social Media Blast', cost: 2000, hype: 15, duration: 2, type: 'basic' },
    { id: 'influencer', name: 'Tech Influencer', cost: 15000, hype: 40, duration: 4, type: 'basic' },
    { id: 'billboard', name: 'Times Square Billboard', cost: 50000, hype: 100, duration: 8, type: 'basic' },
    { id: 'movie_ad', name: 'Product Placement', cost: 150000, hype: 250, duration: 10, type: 'movie' },
    { id: 'cameo_elion', name: 'Cameo: Elion Tusk', cost: 2500000, hype: 2000, duration: 1, type: 'cameo' }
];

const AI_RIVALS = [
    { name: 'OpenAI', strength: 98, color: 'text-green-400' },
    { name: 'Anthropic', strength: 92, color: 'text-yellow-400' },
    { name: 'Google DeepMind', strength: 95, color: 'text-blue-400' },
    { name: 'Meta AI', strength: 88, color: 'text-blue-300' },
    { name: 'X.AI', strength: 80, color: 'text-slate-200' },
    { name: 'Stability', strength: 75, color: 'text-purple-400' },
    { name: 'Mistral', strength: 78, color: 'text-orange-400' },
    { name: 'Nvidia Research', strength: 99, color: 'text-green-500' }
];

const AI_PRODUCTS = [
    { id: 'text', name: 'LLM', cost: 50000, time: 4, compute: 5 },
    { id: 'image', name: 'Image Gen', cost: 80000, time: 6, compute: 15 },
    { id: 'audio', name: 'Audio Model', cost: 60000, time: 5, compute: 10 },
    { id: 'video', name: 'Video Gen', cost: 150000, time: 8, compute: 40 },
    { id: 'game_ai', name: 'NPC Brain', cost: 200000, time: 10, compute: 70 },
    { id: 'robotics', name: 'Robot OS', cost: 300000, time: 12, compute: 100 },
    { id: 'agi', name: 'Conscious AI', cost: 5000000, time: 24, compute: 2000, reqTech: 'agi_theory' }
];

const AI_RESEARCH = [
    { id: 'opt_algos', name: 'Optimized Algos', cost: 50, desc: '-1 Week Dev Time' },
    { id: 'h200_unlock', name: 'H200 Hardware', cost: 150, desc: 'Unlock H200 Chips' },
    { id: 'blackwell_arch', name: 'Blackwell Arch', cost: 300, desc: 'Unlock B200/GH200' },
    { id: 'tpu_opt', name: 'TPU Optimization', cost: 600, desc: 'Unlock TPU Pods' },
    { id: 'agi_theory', name: 'AGI Theory', cost: 1000, desc: 'Unlock Conscious AI Product' },
    { id: 'wafer_scale', name: 'Wafer Scale', cost: 2000, desc: 'Unlock Cerebras WSE' },
    { id: 'quantum_tech', name: 'Quantum Supremacy', cost: 5000, desc: 'Unlock Quantum Servers' },
    { id: 'bio_computing', name: 'Bio-Computing', cost: 10000, desc: 'Unlock Neural Hive' }
];

const AI_SHOP = [
    { id: 'data_s', name: 'Data Set (Small)', cost: 5000, effect: 'Research +100', type: 'consumable', amount: 100 },
    { id: 'data_m', name: 'Data Set (Medium)', cost: 15000, effect: 'Research +350', type: 'consumable', amount: 350 },
    { id: 'consultant', name: 'AI Consultant', cost: 10000, effect: 'Dev Speed Boost (Instant)', type: 'consumable', amount: 0 },
    { id: 'coffee', name: 'Premium Coffee', cost: 2000, effect: 'Employees: +10 Morale', type: 'consumable_emp', amount: 10 }
];

const MODEL_PREFIXES = ["Super", "Ultra", "Hyper", "Mega", "Omni", "Quantum", "Cyber", "Neo", "Flux", "Deep", "Brain", "Neural", "Synapse"];
const MODEL_SUFFIXES = ["Mind", "Core", "Flow", "Net", "GPT", "Vision", "Voice", "Sim", "X", "Prime", "Max", "Pro", "Chat"];
const MODEL_VERSIONS = ["1.0", "2.0", "3.0", "3.5", "4.0", "4o", "5", "X", "Pro", "Ultra", "Max"];

// ==========================================
// 🎬 MOVIE STAR DATA
// ==========================================

const FIRST_NAMES_M = ["Leo", "Brad", "Tom", "Johnny", "Robert", "Chris", "Ryan", "Keanu", "Denzel", "Will", "Samuel", "Morgan", "Harrison", "Clint", "Al", "Joaquin", "Christian", "Matt", "Ben", "George", "Adam", "Jared", "Idris", "Jason", "Dwayne", "Kevin", "Mark", "Tim", "Oscar", "Zac"];
const FIRST_NAMES_F = ["Scarlett", "Margot", "Emma", "Jennifer", "Angelina", "Meryl", "Viola", "Zendaya", "Florence", "Anya", "Natalie", "Julia", "Sandra", "Reese", "Nicole", "Charlize", "Halle", "Salma", "Gal", "Brie", "Saoirse", "Jessica", "Anne", "Emily", "Blake", "Mila", "Kristen", "Dakota"];
const LAST_NAMES = ["Dicaprio", "Pitt", "Cruise", "Depp", "Downey", "Hemsworth", "Reynolds", "Reeves", "Washington", "Smith", "Jackson", "Freeman", "Ford", "Eastwood", "Pacino", "Phoenix", "Bale", "Damon", "Affleck", "Clooney", "Driver", "Leto", "Elba", "Momoa", "Johnson", "Hart", "Wahlberg", "Chalamet", "Holland"];

const MOVIE_GENRES = ["Action", "Horror", "Sci-Fi", "Drama", "Comedy", "Romance", "Thriller", "Fantasy", "Mystery"];

const SKILLS_SHOP = [
    { id: 'acting_101', name: 'Acting 101', type: 'acting', boost: 5, cost: 500, desc: "Learn to cry on command." },
    { id: 'improv_class', name: 'Improv Club', type: 'acting', boost: 10, cost: 1200, desc: "Yes, and..." },
    { id: 'method_acting', name: 'Method Acting', type: 'acting', boost: 20, cost: 5000, desc: "Stay in character for 3 months." },
    { id: 'masterclass', name: 'Masterclass', type: 'acting', boost: 40, cost: 25000, desc: "Taught by a legend." },
    { id: 'voice_coach', name: 'Vocal Training', type: 'speech', boost: 5, cost: 600, desc: "Stop mumbling." },
    { id: 'public_speaking', name: 'Public Speaking', type: 'speech', boost: 15, cost: 2000, desc: "Nail your interviews." },
    { id: 'gym_membership', name: 'Gym Membership', type: 'looks', boost: 5, cost: 300, desc: "Basic fitness." },
    { id: 'stylist', name: 'Personal Stylist', type: 'looks', boost: 15, cost: 4000, desc: "Drip upgrade." },
    { id: 'plastic_surgery', name: 'Cosmetic Touch-up', type: 'looks', boost: 35, cost: 50000, desc: "A little botox never hurt." }
];

const JOBS = [
    { title: "Background Extra", pay: 100, req: 0, fame: 0, type: "gig", desc: "Stand there and don't look at the camera." },
    { title: "Commercial Lead", pay: 2500, req: 10, fame: 2, type: "gig", desc: "Hold a soda can and smile." },
    { title: "Student Film", pay: 500, req: 15, fame: 5, type: "movie", desc: "Artistic, but pays in pizza." },
    { title: "Indie Horror Victim", pay: 15000, req: 25, fame: 15, type: "movie", desc: "Scream loud, die first." },
    { title: "Soap Opera Guest", pay: 8000, req: 30, fame: 10, type: "show", desc: "Dramatic reveal of an evil twin." },
    { title: "Sitcom Neighbor", pay: 40000, req: 45, fame: 30, type: "show", desc: "Walk in, say catchphrase, leave." },
    { title: "Action Sidekick", pay: 150000, req: 70, fame: 100, type: "movie", desc: "Look cool while things explode." },
    { title: "Marvel Hero", pay: 5000000, req: 95, fame: 1000, type: "movie", desc: "Green screen suit required." }
];
