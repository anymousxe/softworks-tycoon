// --- DATABASE & KNOCKOFFS ---



// Hardware / GPUs

const HARDWARE_DB = [

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



// Companies to pitch to (Contract Grid)

const COMPANIES_DB = [

    { name: 'Indie Devs', budget: 1500 }, 

    { name: 'Startup Inc', budget: 3500 },

    { name: 'Lmsite', budget: 5000, type: 'AI Hosting' }, 

    { name: 'Listart', budget: 6500, type: 'Art Assets' },

    { name: 'Facebooc', budget: 8000 }, 

    { name: 'StreamFlix', budget: 12000 },

    { name: 'Microhard', budget: 15000 }, 

    { name: 'Joggle', budget: 18000 },

    { name: 'Amacon', budget: 22000 }, 

    { name: 'NvidiaX', budget: 25000 },

    { name: 'Tessla', budget: 30000 }, 

    { name: 'Fruit Co', budget: 35000 },

    { name: 'OpenAI (Real)', budget: 45000 }, 

    { name: 'Wall Street', budget: 60000 },

    { name: 'SpaceY', budget: 80000 }, 

    { name: 'Pentagon', budget: 150000 },

    { name: 'Global Gov', budget: 500000 }

];



// Marketing Cameos & Methods

const CAMPAIGNS_DB = [

    { id: 'social_ads', name: 'Social Media Blast', cost: 2000, hype: 15, duration: 2, type: 'basic' },

    { id: 'influencer', name: 'Tech Influencer', cost: 15000, hype: 40, duration: 4, type: 'basic' },

    { id: 'billboard', name: 'Times Square Billboard', cost: 50000, hype: 100, duration: 8, type: 'basic' },

    { id: 'movie_ad', name: 'Product Placement in "Fast & Furious 29"', cost: 150000, hype: 250, duration: 10, type: 'movie' },

    { id: 'cameo_alex', name: 'Cameo: Alerios Alex', cost: 300000, hype: 400, duration: 1, type: 'cameo' },

    { id: 'cameo_ryan', name: 'Cameo: Ryant Renyold', cost: 800000, hype: 900, duration: 1, type: 'cameo' },

    { id: 'cameo_elion', name: 'Cameo: Elion Tusk', cost: 2500000, hype: 2000, duration: 1, type: 'cameo' },

    { id: 'superbowl', name: 'Super Bowl Commercial', cost: 5000000, hype: 5000, duration: 12, type: 'basic' }

];



// --- MASSIVE RIVALS LIST ---

const RIVALS_DB = [

    { name: 'OpenAI', strength: 98, color: 'text-green-400' },

    { name: 'Anthropic', strength: 92, color: 'text-yellow-400' },

    { name: 'Google DeepMind', strength: 95, color: 'text-blue-400' },

    { name: 'Meta AI', strength: 88, color: 'text-blue-300' },

    { name: 'X.AI', strength: 80, color: 'text-slate-200' },

    { name: 'Stability', strength: 75, color: 'text-purple-400' },

    { name: 'Mistral', strength: 78, color: 'text-orange-400' },

    { name: 'Cohere', strength: 70, color: 'text-teal-400' },

    { name: 'Midjourney', strength: 85, color: 'text-pink-400' },

    { name: 'Character.AI', strength: 82, color: 'text-cyan-400' },

    { name: 'Perplexity', strength: 65, color: 'text-indigo-400' },

    { name: 'HuggingFace', strength: 60, color: 'text-yellow-200' },

    { name: 'Tencent', strength: 85, color: 'text-green-600' },

    { name: 'Baidu', strength: 82, color: 'text-blue-600' },

    { name: 'Alibaba', strength: 80, color: 'text-orange-600' },

    { name: 'Apple ML', strength: 90, color: 'text-slate-400' },

    { name: 'Amazon AGI', strength: 88, color: 'text-yellow-600' },

    { name: 'IBM Watson', strength: 50, color: 'text-blue-800' },

    { name: 'Tesla AI', strength: 75, color: 'text-red-500' },

    { name: 'Nvidia Research', strength: 99, color: 'text-green-500' }

];



// NAME GENERATOR PARTS (Trillions of combinations)

const MODEL_PREFIXES = [

    "Super", "Ultra", "Hyper", "Mega", "Omni", "Quantum", "Cyber", "Neo", "Flux", "Astro", "Deep", 

    "Brain", "Neural", "Synapse", "Void", "Star", "Nexus", "Titan", "Giga", "Terra", "Galactic", 

    "Cosmic", "Infinite", "Alpha", "Omega", "Zeta", "Prime", "Core", "Apex", "Zenith", "Horizon", 

    "Vector", "Tensor", "Scalar", "Logic", "Reason", "Thought", "Mind", "Soul", "Spirit", "Ghost"

];



const MODEL_SUFFIXES = [

    "Mind", "Core", "Flow", "Net", "GPT", "Vision", "Voice", "Sim", "X", "Prime", "Max", "Pro", 

    "One", "Zero", "Alpha", "Beta", "Gamma", "Delta", "Sigma", "Turbo", "V", "XL", "XS", "Nano", 

    "Heavy", "Light", "Chat", "Code", "Art", "Imagine", "Real", "Dream", "Nightmare", "Pulse", 

    "Wave", "Signal", "Node", "Link", "Chain", "Graph", "Matrix"

];



const MODEL_VERSIONS = ["1.0", "2.0", "3.0", "3.5", "4.0", "4o", "5", "X", "Pro", "Ultra", "Max"];
