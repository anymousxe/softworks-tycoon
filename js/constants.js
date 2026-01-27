// --- GAME CONSTANTS & DATABASE ---

const HARDWARE = [
    { id: 'gtx_cluster', name: 'Consumer GPU Cluster', cost: 2000, compute: 5, upkeep: 10 },
    { id: 'rtx_4090_farm', name: 'RTX 4090 Farm', cost: 5500, compute: 15, upkeep: 40 },
    { id: 'a100', name: 'A100 Rack', cost: 8000, compute: 30, upkeep: 80 },
    { id: 'v100_legacy', name: 'V100 Legacy Rack', cost: 12000, compute: 45, upkeep: 120 },
    { id: 'h100', name: 'H100 Cluster', cost: 15000, compute: 80, upkeep: 150 },
    { id: 'h200', name: 'Nvidia H200', cost: 35000, compute: 150, upkeep: 300, reqTech: 'h200_unlock' },
    { id: 'gh200_super', name: 'GH200 Superchip', cost: 48000, compute: 250, upkeep: 450, reqTech: 'blackwell_arch' },
    { id: 'b200', name: 'Blackwell B200', cost: 60000, compute: 400, upkeep: 600, reqTech: 'blackwell_arch' },
    { id: 'tpu_pod', name: 'Google TPU Pod', cost: 250000, compute: 1500, upkeep: 1500, reqTech: 'tpu_opt' },
    { id: 'cerebras', name: 'Wafer Scale Engine', cost: 500000, compute: 3500, upkeep: 2500, reqTech: 'wafer_scale' },
    { id: 'quantum', name: 'Q-Bit Array', cost: 1500000, compute: 10000, upkeep: 5000, reqTech: 'quantum_tech' }
];

const RIVALS_LIST = [
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
    { name: 'Nvidia Research', strength: 99, color: 'text-green-500' },
    { name: 'Sora Video', strength: 95, color: 'text-red-400' },
    { name: 'Runway ML', strength: 70, color: 'text-pink-500' }
];

const COMPANIES = [
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

const CAMPAIGNS = [
    { id: 'social_ads', name: 'Social Media Blast', cost: 2000, hype: 15, duration: 2, type: 'basic' },
    { id: 'influencer', name: 'Tech Influencer', cost: 15000, hype: 40, duration: 4, type: 'basic' },
    { id: 'billboard', name: 'Times Square Billboard', cost: 50000, hype: 100, duration: 8, type: 'basic' },
    { id: 'movie_ad', name: 'Product Placement in "Fast & Furious 29"', cost: 150000, hype: 250, duration: 10, type: 'movie' },
    { id: 'cameo_alex', name: 'Cameo: Alerios Alex', cost: 300000, hype: 400, duration: 1, type: 'cameo' },
    { id: 'cameo_ryan', name: 'Cameo: Ryant Renyold', cost: 800000, hype: 900, duration: 1, type: 'cameo' },
    { id: 'cameo_elion', name: 'Cameo: Elion Tusk', cost: 2500000, hype: 2000, duration: 1, type: 'cameo' },
    { id: 'superbowl', name: 'Super Bowl Commercial', cost: 5000000, hype: 5000, duration: 12, type: 'basic' }
];

const SHOP_ITEMS = [
    { id: 'pizza_party', name: 'Pizza Party', cost: 5000, type: 'consumable_emp', amount: 15, effect: '+15 Morale' },
    { id: 'team_retreat', name: 'Team Retreat', cost: 25000, type: 'consumable_emp', amount: 40, effect: '+40 Morale' },
    { id: 'research_grant_s', name: 'Small Grant', cost: 10000, type: 'consumable_res', amount: 500, effect: '+500 Research Pts' },
    { id: 'research_grant_l', name: 'Federal Grant', cost: 100000, type: 'consumable_res', amount: 5000, effect: '+5000 Research Pts' },
    { id: 'server_opt', name: 'Server Optimization', cost: 50000, type: 'upgrade', effect: 'Passive Compute Boost' },
    { id: 'marketing_team', name: 'Marketing Firm', cost: 75000, type: 'upgrade', effect: 'Passive Hype Gen' }
];

const TRAITS = [
    { id: 'dreamer', name: 'Lucid Dreamer', multCost: 1.2, multTime: 1.5, multCompute: 1.2, desc: 'High hallucinations. Can "dream" up new concepts.' },
    { id: 'sentient', name: 'Emotional Core', multCost: 2.0, multTime: 2.0, multCompute: 2.0, desc: 'Simulated feelings. High user engagement, high risk.' },
    { id: 'chaos', name: 'Chaos Engine', multCost: 1.5, multTime: 1.2, multCompute: 1.5, desc: 'Unpredictable outputs. Fun but dangerous.' },
    { id: 'logic', name: 'Hyper-Logic', multCost: 1.8, multTime: 2.5, multCompute: 1.8, desc: 'Zero creativity, perfect reasoning. The "Spock" model.' },
    { id: 'mimic', name: 'Persona Mimic', multCost: 1.3, multTime: 1.3, multCompute: 1.3, desc: 'Perfectly copies human personalities.' }
];

const CAPABILITIES = [
    { id: 'web_search', name: 'Web Search', cost: 15000, time: 2, quality: 15, desc: 'Access the internet.' },
    { id: 'multimodal', name: 'Multi-Modal Vision', cost: 25000, time: 3, quality: 25, desc: 'Can see images.' },
    { id: 'memory', name: 'Long-Term Memory', cost: 40000, time: 4, quality: 30, desc: 'Remembers user chats.' },
    { id: 'audio_in', name: 'Audio Input', cost: 20000, time: 2, quality: 10, desc: 'Hears voice commands.' },
    { id: 'code_interpreter', name: 'Code Interpreter', cost: 60000, time: 5, quality: 40, desc: 'Runs code locally.' },
    { id: 'autonomy', name: 'Agent Autonomy', cost: 100000, time: 8, quality: 50, desc: 'Can act on its own.' }
];

const REVIEWS_DB = {
    low: [
        "Trash. Absolute garbage.", "Hallucinates more than my uncle.", "Waste of API credits.",
        "Slow, dumb, and expensive.", "Can't even code a Hello World properly.",
        "The generated images look like nightmares.", "Refund requested.", "Zero coherence.",
        "Why is this so popular? It breaks constantly.", "L model tbh."
    ],
    mid: [
        "It's okay, not great.", "Good for basic drafts, bad for final.", "A bit slow but works.",
        "Better than the last version, but still buggy.", "Serviceable.", "Meh.",
        "The video generation is choppy but cool concept.", "Decent logic reasoning."
    ],
    high: [
        "Actually really good.", "Saves me 5 hours a day.", "Code generation is spot on.",
        "The 3D models are usable in production!", "Video consistency is improved.",
        "My workflow is changed forever.", "Solid performance.", "Best in class for the price.",
        "This is cooking.", "Absolute W."
    ],
    god: [
        "AGI ACHIEVED?!", "This feels illegal it's so good.", "Consciousness simulated.",
        "The quality is indistinguishable from reality.", "Goodbye Hollywood.",
        "I asked it to solve physics and it did.", "Absolute SOTA.", "Unbelievable details."
    ]
};

const RESEARCH = [
    { id: 'opt_algos', name: 'Optimized Algos', cost: 50, desc: '-1 Week Dev Time' },
    { id: 'h200_unlock', name: 'H200 Hardware', cost: 150, desc: 'Unlock H200 Chips' },
    { id: 'blackwell_arch', name: 'Blackwell Arch', cost: 300, desc: 'Unlock B200/GH200' },
    { id: 'tpu_opt', name: 'TPU Optimization', cost: 600, desc: 'Unlock TPU Pods' },
    { id: 'wafer_scale', name: 'Wafer Scale', cost: 2000, desc: 'Unlock Cerebras WSE' },
    { id: 'quantum_tech', name: 'Quantum Supremacy', cost: 5000, desc: 'Unlock Quantum Servers' },
    { id: 'agi_theory', name: 'AGI Theory', cost: 15000, desc: 'Unlock AGI Model Development' }
];

const PRODUCTS = [
    { id: 'text', name: 'LLM (Text)', cost: 50000, time: 4, compute: 5, specs: ['Chatbot', 'Coding', 'Writing'], desc: "Standard language model. Reliable and versatile." },
    { id: 'image', name: 'Image Model', cost: 80000, time: 6, compute: 15, specs: ['Realistic', 'Anime', 'Logo'], desc: "Generates high-fidelity images from text prompts." },
    { id: 'audio', name: 'Audio Model', cost: 60000, time: 5, compute: 10, specs: ['Music', 'Voice', 'SFX'], desc: "Synthesizes voice and music with low latency." },
    { id: 'video', name: 'Video Gen', cost: 150000, time: 8, compute: 40, specs: ['Deepfake', 'Cinema', 'VFX'], desc: "Heavy compute. Generates short video clips." },
    { id: 'custom', name: 'Custom Architecture', cost: 100000, time: 6, compute: 20, specs: ['Specialized', 'Unique', 'Experimental'], desc: "Build a model with a specific neural trait (Dreamer, Sentient, etc)." },
    { id: 'agi', name: 'AGI Core', cost: 5000000, time: 24, compute: 5000, reqTech: 'agi_theory', specs: ['Sentience', 'Omniscience', 'Singularity'], desc: "Artificial General Intelligence. The final frontier." }
];

const PREFIXES = ["Super", "Ultra", "Hyper", "Mega", "Omni", "Quantum", "Cyber", "Neo", "Flux", "Astro", "Deep", "Brain", "Neural", "Synapse", "Void", "Star", "Nexus", "Titan", "Giga", "Terra", "Galactic", "Cosmic", "Infinite", "Alpha", "Omega", "Zeta", "Prime", "Core", "Apex", "Zenith", "Horizon"];
const SUFFIXES = ["Mind", "Core", "Flow", "Net", "GPT", "Vision", "Voice", "Sim", "X", "Prime", "Max", "Pro", "One", "Zero", "Alpha", "Beta", "Gamma", "Delta", "Sigma", "Turbo", "V", "XL", "XS", "Nano", "Heavy", "Light", "Chat", "Code", "Art", "Imagine", "Real", "Dream", "Nightmare", "Pulse"];
const VERSIONS = ["1.0", "2.0", "3.0", "3.5", "4.0", "4o", "5", "X", "Pro", "Ultra", "Max", "Turbo", "Preview", "Final"];

const APP_ID = 'softworks-tycoon';
const ADMIN_EMAIL = 'anymousxe.info@gmail.com'; 
