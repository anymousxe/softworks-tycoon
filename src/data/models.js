// AI Model type definitions with modes
export const MODEL_TYPES = [
    {
        id: 'text',
        name: 'Text LLM',
        baseTime: 4,
        minParams: 100000000, // 100M minimum
        compute: 5,
        operational_cost_per_week: 500,
        modes: [
            { id: 'chat', name: 'Chatbot', desc: 'Conversational AI' },
            { id: 'code', name: 'Code Generation', desc: 'Programming assistant' },
            { id: 'writing', name: 'Creative Writing', desc: 'Stories, articles, copy' },
            { id: 'reasoning', name: 'Reasoning', desc: 'Logic and analysis' },
            { id: 'voice_to_text', name: 'Voice to Text', desc: 'Speech recognition' },
            { id: 'translation', name: 'Translation', desc: 'Multi-language' },
            { id: 'summarization', name: 'Summarization', desc: 'Condensing content' },
        ],
        desc: 'Standard language model for conversation and text generation.'
    },
    {
        id: 'image',
        name: 'Image Model',
        baseTime: 6,
        minParams: 500000000, // 500M minimum
        compute: 15,
        operational_cost_per_week: 1200,
        modes: [
            { id: 'generator', name: 'Image Generator', desc: 'Create images from text' },
            { id: 'editor', name: 'Image Editor', desc: 'Edit and modify images' },
            { id: 'both', name: 'Generator + Editor', desc: 'Full image capabilities' },
            { id: 'upscale', name: 'Upscaler', desc: 'Enhance image resolution' },
            { id: 'inpaint', name: 'Inpainting', desc: 'Fill in missing parts' },
        ],
        desc: 'Generates and edits high-fidelity images.'
    },
    {
        id: 'video',
        name: 'Video Model',
        baseTime: 10,
        minParams: 1000000000, // 1B minimum
        compute: 50,
        operational_cost_per_week: 4000,
        modes: [
            { id: 'generator', name: 'Video Generator', desc: 'Create videos from text' },
            { id: 'editor', name: 'Video Editor', desc: 'Edit and modify videos' },
            { id: 'both', name: 'Generator + Editor', desc: 'Full video capabilities' },
            { id: 'vfx', name: 'VFX Generator', desc: 'Special effects' },
            { id: 'animation', name: 'Animation', desc: 'Animated content' },
        ],
        desc: 'Generates realistic video clips. Extremely compute-intensive.'
    },
    {
        id: 'audio',
        name: 'Audio Model',
        baseTime: 5,
        minParams: 200000000, // 200M minimum
        compute: 10,
        operational_cost_per_week: 800,
        modes: [
            { id: 'songs', name: 'Music Generation', desc: 'Create songs and instrumentals' },
            { id: 'sounds', name: 'Sound Effects', desc: 'SFX and ambient audio' },
            { id: 'voice', name: 'Voice Synthesis', desc: 'Text-to-speech, voice cloning' },
            { id: 'all', name: 'Full Audio Suite', desc: 'All audio capabilities' },
            { id: 'podcast', name: 'Podcast Generator', desc: 'Long-form audio content' },
        ],
        desc: 'Synthesizes realistic voice and music with low latency.'
    },
    {
        id: 'multimodal',
        name: 'Multimodal Model',
        baseTime: 12,
        minParams: 2000000000, // 2B minimum
        compute: 40,
        operational_cost_per_week: 3500,
        modes: [
            { id: 'vision_language', name: 'Vision + Language', desc: 'See and talk' },
            { id: 'omni', name: 'Omni Model', desc: 'All modalities' },
            { id: 'document', name: 'Document AI', desc: 'OCR and document understanding' },
        ],
        desc: 'Handles multiple input types - text, image, audio.'
    },
    {
        id: 'embedding',
        name: 'Embedding Model',
        baseTime: 3,
        minParams: 50000000, // 50M minimum
        compute: 3,
        operational_cost_per_week: 200,
        modes: [
            { id: 'text_embed', name: 'Text Embeddings', desc: 'Semantic text vectors' },
            { id: 'image_embed', name: 'Image Embeddings', desc: 'Visual similarity' },
            { id: 'multi_embed', name: 'Multimodal Embeddings', desc: 'Cross-modal search' },
        ],
        desc: 'Creates vector embeddings for search and retrieval.'
    },
    {
        id: 'agent',
        name: 'AI Agent',
        baseTime: 8,
        minParams: 500000000, // 500M minimum
        compute: 25,
        operational_cost_per_week: 2500,
        modes: [
            { id: 'web_agent', name: 'Web Agent', desc: 'Browse and interact with web' },
            { id: 'code_agent', name: 'Code Agent', desc: 'Write, run, debug code' },
            { id: 'computer_use', name: 'Computer Use', desc: 'Control desktop applications' },
            { id: 'research', name: 'Research Agent', desc: 'Autonomous research' },
        ],
        desc: 'Autonomous AI that can take actions and complete tasks.'
    },
    {
        id: 'custom',
        name: 'Custom Architecture',
        baseTime: 8,
        minParams: 100000000, // 100M minimum
        compute: 20,
        operational_cost_per_week: 2000,
        modes: [
            { id: 'specialized', name: 'Specialized', desc: 'Domain-specific model' },
            { id: 'experimental', name: 'Experimental', desc: 'Novel architecture' },
            { id: 'hybrid', name: 'Hybrid', desc: 'Combined approaches' },
        ],
        desc: 'Build a model with a unique neural architecture.'
    },
    {
        id: 'agi',
        name: 'AGI Core',
        baseTime: 52,
        minParams: 100000000000000, // 100T minimum
        compute: 8000,
        operational_cost_per_week: 500000,
        reqTech: 'agi_theory',
        modes: [
            { id: 'proto_agi', name: 'Proto-AGI', desc: 'Early general intelligence' },
            { id: 'full_agi', name: 'Full AGI', desc: 'Human-level intelligence' },
            { id: 'superintelligence', name: 'ASI', desc: 'Beyond human capability' },
        ],
        desc: 'Artificial General Intelligence. The final frontier.'
    }
];

// Model variant types - can be preset or custom
export const VARIANT_TYPES = [
    { id: 'base', name: 'Base', paramMult: 1.0, speedMult: 1.0, qualityMult: 1.0, desc: 'Standard model' },
    { id: 'lite', name: 'Lite', paramMult: 0.3, speedMult: 1.8, qualityMult: 0.7, desc: 'Smaller, faster, cheaper' },
    { id: 'mini', name: 'Mini', paramMult: 0.15, speedMult: 2.5, qualityMult: 0.5, desc: 'Tiny but quick' },
    { id: 'nano', name: 'Nano', paramMult: 0.05, speedMult: 4.0, qualityMult: 0.3, desc: 'Edge deployment' },
    { id: 'flash', name: 'Flash', paramMult: 0.5, speedMult: 3.0, qualityMult: 0.65, desc: 'Optimized for speed' },
    { id: 'pro', name: 'Pro', paramMult: 1.5, speedMult: 0.8, qualityMult: 1.3, desc: 'Enhanced capability' },
    { id: 'ultra', name: 'Ultra', paramMult: 2.5, speedMult: 0.5, qualityMult: 1.6, desc: 'Maximum power' },
    { id: 'max', name: 'Max', paramMult: 4.0, speedMult: 0.3, qualityMult: 2.0, desc: 'No compromises' },
    { id: 'turbo', name: 'Turbo', paramMult: 0.8, speedMult: 2.0, qualityMult: 0.9, desc: 'Fast with good quality' },
    { id: 'plus', name: 'Plus', paramMult: 1.2, speedMult: 0.9, qualityMult: 1.15, desc: 'Slight upgrade' },
    { id: 'advanced', name: 'Advanced', paramMult: 2.0, speedMult: 0.6, qualityMult: 1.5, desc: 'Significant upgrade' },
    { id: 'experimental', name: 'Experimental', paramMult: 1.0, speedMult: 0.7, qualityMult: 1.4, desc: 'Cutting edge, unstable' },
    { id: 'custom', name: 'Custom', paramMult: 1.0, speedMult: 1.0, qualityMult: 1.0, desc: 'User-defined variant' },
];

// Common custom variant names players might use
export const CUSTOM_VARIANT_SUGGESTIONS = [
    'Ultra Super', 'Mega Pro', 'Hyper Flash', 'Super Lite', 'Extreme', 'Ultimate',
    'Platinum', 'Diamond', 'Elite', 'Premium', 'Signature', 'Deluxe', 'Supreme',
    'Infinity', 'Quantum', 'Nova', 'Alpha', 'Omega', 'Prime', 'Core', 'Edge',
    'Vision', 'Genius', 'Expert', 'Master', 'Scholar', 'Sage', 'Oracle',
    'Thunder', 'Lightning', 'Storm', 'Blaze', 'Phoenix', 'Dragon', 'Titan',
];

// Parameter tiers for display/leaderboard
export const PARAMETER_TIERS = [
    { id: 'tiny', min: 0, max: 100000000, display: '<100M', color: 'text-slate-400' },
    { id: 'small', min: 100000000, max: 500000000, display: '100M-500M', color: 'text-slate-300' },
    { id: 'medium', min: 500000000, max: 1000000000, display: '500M-1B', color: 'text-blue-400' },
    { id: 'large', min: 1000000000, max: 7000000000, display: '1-7B', color: 'text-green-400' },
    { id: 'xlarge', min: 7000000000, max: 20000000000, display: '7-20B', color: 'text-yellow-400' },
    { id: 'huge', min: 20000000000, max: 70000000000, display: '20-70B', color: 'text-orange-400' },
    { id: 'massive', min: 70000000000, max: 200000000000, display: '70-200B', color: 'text-red-400' },
    { id: 'giant', min: 200000000000, max: 500000000000, display: '200-500B', color: 'text-purple-400' },
    { id: 'colossal', min: 500000000000, max: 1000000000000, display: '500B-1T', color: 'text-pink-400' },
    { id: 'titan', min: 1000000000000, max: 5000000000000, display: '1-5T', color: 'text-cyan-400' },
    { id: 'godlike', min: 5000000000000, max: Infinity, display: '5T+', color: 'text-amber-300' },
];

// Model name prefixes - creative names for AI models
export const MODEL_NAME_PREFIXES = [
    // Greek/Roman
    'Apollo', 'Athena', 'Zeus', 'Hermes', 'Atlas', 'Prometheus', 'Titan', 'Oracle',
    'Phoenix', 'Nemesis', 'Chronos', 'Helios', 'Ares', 'Hera', 'Poseidon',
    // Norse
    'Odin', 'Thor', 'Loki', 'Freya', 'Baldur', 'Fenrir', 'Ragnarok', 'Mjolnir',
    // Egyptian
    'Ra', 'Osiris', 'Anubis', 'Isis', 'Horus', 'Sphinx', 'Pharaoh', 'Nile',
    // Sci-Fi
    'Nexus', 'Cortex', 'Synth', 'Cipher', 'Vector', 'Matrix', 'Nova', 'Quantum',
    'Nebula', 'Cosmos', 'Stellar', 'Pulsar', 'Quasar', 'Andromeda', 'Orion',
    // Tech
    'Axiom', 'Binary', 'Core', 'Delta', 'Echo', 'Flux', 'Helix', 'Ion',
    'Kernel', 'Lambda', 'Nexus', 'Omega', 'Prism', 'Pulse', 'Sigma', 'Tau',
    // Nature
    'Aurora', 'Blaze', 'Cascade', 'Dawn', 'Eclipse', 'Frost', 'Glacier', 'Horizon',
    'Inferno', 'Jade', 'Kinetic', 'Lunar', 'Monsoon', 'Nightfall', 'Obsidian',
    // Abstract
    'Apex', 'Zenith', 'Pinnacle', 'Summit', 'Vertex', 'Paragon', 'Paradigm',
    'Epoch', 'Era', 'Genesis', 'Origin', 'Prime', 'Prisma', 'Radiant',
    // Military/Power
    'Sentinel', 'Guardian', 'Warden', 'Bastion', 'Citadel', 'Fortress', 'Shield',
    'Vanguard', 'Aegis', 'Paladin', 'Crusader', 'Legion', 'Spartan', 'Titan',
    // Modern Tech Names
    'Sage', 'Scholar', 'Genius', 'Maestro', 'Virtuoso', 'Prodigy', 'Savant',
    'Muse', 'Aria', 'Lyric', 'Verse', 'Sonnet', 'Opus', 'Symphony',
    // Elements
    'Carbon', 'Cobalt', 'Copper', 'Crystal', 'Diamond', 'Emerald', 'Gold',
    'Iron', 'Jade', 'Mercury', 'Nickel', 'Onyx', 'Platinum', 'Ruby', 'Silver',
    // Animals
    'Falcon', 'Hawk', 'Eagle', 'Raven', 'Phoenix', 'Dragon', 'Wolf', 'Lion',
    'Tiger', 'Panther', 'Jaguar', 'Leopard', 'Cobra', 'Viper', 'Shark',
    // Japanese
    'Sakura', 'Shogun', 'Samurai', 'Ninja', 'Ronin', 'Kitsune', 'Tengu',
    // Chinese
    'Dragon', 'Phoenix', 'Qilin', 'Jade', 'Lotus', 'Bamboo', 'Silk',
    // Hindu
    'Shiva', 'Vishnu', 'Brahma', 'Ganesha', 'Krishna', 'Rama', 'Hanuman',
    // Celtic
    'Druid', 'Merlin', 'Avalon', 'Excalibur', 'Camelot', 'Arthur',
    // Modern Compound
    'DeepCore', 'NeuralNet', 'MindForge', 'ThinkTank', 'BrainWave', 'SynapseAI',
    'CogniTech', 'IntelliBrain', 'SmartMind', 'LogicCore', 'ReasonEngine',
];

// Model name suffixes/versions
export const MODEL_NAME_SUFFIXES = [
    // Versions
    '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0',
    'v1', 'v2', 'v3', 'v4', 'v5', 'v6',
    // Years
    '2024', '2025', '2026', '2027',
    // Codenames
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    // Descriptive
    'Prime', 'Core', 'Edge', 'Next', 'Neo', 'X', 'Z', 'Infinity',
    // Empty (no suffix)
    '',
];

// Marketing campaigns
export const CAMPAIGNS = [
    { id: 'social_ads', name: 'Social Media Blast', cost: 3000, hype: 20, duration: 2 },
    { id: 'influencer', name: 'Tech Influencer', cost: 18000, hype: 50, duration: 4 },
    { id: 'twitter_trending', name: 'Twitter/X Trending', cost: 35000, hype: 80, duration: 3 },
    { id: 'youtube_sponsor', name: 'YouTube Sponsorship', cost: 50000, hype: 100, duration: 6 },
    { id: 'podcast_tour', name: 'Podcast Tour', cost: 40000, hype: 70, duration: 5 },
    { id: 'tech_conference', name: 'Tech Conference Keynote', cost: 100000, hype: 200, duration: 4 },
    { id: 'billboard', name: 'Times Square Billboard', cost: 75000, hype: 150, duration: 8 },
    { id: 'tv_commercial', name: 'National TV Ad', cost: 500000, hype: 400, duration: 6 },
    { id: 'superbowl', name: 'Super Bowl Ad', cost: 8000000, hype: 8000, duration: 12 },
    { id: 'world_tour', name: 'Global Launch Event', cost: 2000000, hype: 2000, duration: 10 },
];

// Open source license options
export const OPEN_SOURCE_LICENSES = [
    { id: 'proprietary', name: 'Proprietary (Closed)', revenueBonus: 1.0, hypeBonus: 0, adoptionRate: 0.6, desc: 'Keep it closed, maximize revenue' },
    { id: 'api_only', name: 'API Access Only', revenueBonus: 0.9, hypeBonus: 0.2, adoptionRate: 0.7, desc: 'No weights, API access' },
    { id: 'research', name: 'Research License', revenueBonus: 0.7, hypeBonus: 0.4, adoptionRate: 0.8, desc: 'Free for research, paid commercial' },
    { id: 'apache', name: 'Apache 2.0', revenueBonus: 0.3, hypeBonus: 0.8, adoptionRate: 1.2, desc: 'Fully open, permissive' },
    { id: 'llama', name: 'Llama-style License', revenueBonus: 0.5, hypeBonus: 0.6, adoptionRate: 1.0, desc: 'Open with restrictions' },
    { id: 'gpl', name: 'GPL (Copyleft)', revenueBonus: 0.2, hypeBonus: 0.7, adoptionRate: 0.9, desc: 'Open, requires sharing' },
    { id: 'mit', name: 'MIT License', revenueBonus: 0.25, hypeBonus: 0.85, adoptionRate: 1.3, desc: 'Maximum freedom' },
];

// Review pools based on quality
export const REVIEWS_DB = {
    terrible: [
        "This is literally unusable.", "My calculator gives better answers.",
        "Did an intern train this?", "Absolute dumpster fire of a model.",
        "I want my API credits back.", "This hallucinates everything.",
        "Slower than my grandma's dial-up.", "Zero coherence, zero value.",
        "L model tbh.", "ratio", "This ain't it chief.",
        "How did this pass QA?", "Brick-tier intelligence.",
        "My houseplant could do better.", "AVOID AT ALL COSTS.",
    ],
    low: [
        "Absolute garbage.", "Hallucinates more than my uncle.",
        "Waste of money.", "Slow, dumb, expensive.",
        "Refund requested.", "Zero coherence.",
        "Why is this popular? Breaks constantly.", "L model tbh.",
        "Mid at best.", "Not worth the hype.",
        "Overpromised, underdelivered.", "Back to ChatGPT I go.",
    ],
    mid: [
        "It's okay, not great.", "Good for drafts.",
        "A bit slow but works.", "Better than last version.",
        "Decent.", "Meh.", "Serviceable.",
        "Gets the job done mostly.", "Acceptable quality.",
        "Not bad, not amazing.", "Room for improvement.",
        "Solid B-tier model.", "Usable but not impressive.",
    ],
    high: [
        "Actually really good.", "Saves me hours daily.",
        "Code generation is spot on.", "Production-ready quality!",
        "Workflow changed forever.", "Best in class.",
        "This is cooking.", "Absolute W.",
        "Finally, a model that gets it.", "Worth every penny.",
        "Impressed with the capabilities.", "Highly recommended.",
        "Top tier reasoning.", "The best I've used.",
    ],
    excellent: [
        "This is insanely good.", "How is this even possible?",
        "Jaw dropped at the quality.", "Game changer.",
        "Every other model feels obsolete.", "Peak AI right here.",
        "The future is now.", "Flawless execution.",
        "I'm genuinely impressed.", "This changes everything.",
        "World class model.", "Industry leading.",
    ],
    god: [
        "AGI ACHIEVED?!", "This feels illegal.",
        "Consciousness simulated.", "Indistinguishable from reality.",
        "Goodbye Hollywood.", "SOTA by a mile.",
        "Physics-breaking quality.", "We've reached the singularity.",
        "Is this even legal?", "The machines have won.",
        "Beyond human capability.", "Scientists are baffled.",
        "Nobel Prize material.", "History in the making.",
    ]
};

// Training speed formula constants
export const TRAINING_CONSTANTS = {
    BASE_PARAMS_PER_WEEK: 50000000, // 50M params per week base
    COMPUTE_MULTIPLIER: 0.001, // Each compute point adds this multiplier
    DATA_QUALITY_MULTIPLIER: 0.01, // Data quality percentage adds this
    MIN_TRAINING_WEEKS: 1,
    MAX_TRAINING_WEEKS: 104, // 2 years max
    PARAMS_TO_QUALITY_RATIO: 0.00000000001, // How params convert to quality score
};

// Competitor behavior constants
export const COMPETITOR_AI = {
    REACTION_THRESHOLD: 1.5, // React if player model is 1.5x their best
    RESPONSE_TIME_WEEKS_MIN: 4,
    RESPONSE_TIME_WEEKS_MAX: 26,
    CATCH_UP_RATE: 0.8, // How close they get to player
    RANDOM_RELEASE_CHANCE: 0.05, // 5% chance per week of random release
};
