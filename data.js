// --- DATABASE & KNOCKOFFS ---

// Hardware / GPUs (Buffed Compute, Lowered Upkeep)
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

// Companies to pitch to (Added Lmsite, Listart, etc)
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

// Random Model Name Generator Parts
const MODEL_PREFIXES = ["Super", "Ultra", "Hyper", "Mega", "Omni", "Quantum", "Cyber", "Neo", "Flux", "Astro", "Deep", "Brain", "Neural", "Synapse", "Void"];
const MODEL_SUFFIXES = ["Mind", "Core", "Flow", "Net", "GPT", "Vision", "Voice", "Sim", "X", "Prime", "Max", "Pro", "One", "Zero", "Alpha"];
