// AI Model type definitions
export const MODEL_TYPES = [
    {
        id: 'text',
        name: 'Text LLM',
        cost: 50000,
        time: 4,
        compute: 5,
        operational_cost_per_week: 500,
        specs: ['Chatbot', 'Coding', 'Writing'],
        desc: 'Standard language model for conversation and text generation.'
    },
    {
        id: 'image',
        name: 'Image Generator',
        cost: 80000,
        time: 6,
        compute: 15,
        operational_cost_per_week: 1200,
        specs: ['Realistic', 'Anime', 'Logo', '3D Render'],
        desc: 'Generates high-fidelity images from text prompts.'
    },
    {
        id: 'video',
        name: 'Video Generator',
        cost: 180000,
        time: 10,
        compute: 50,
        operational_cost_per_week: 4000,
        specs: ['Deepfake', 'Cinema', 'VFX', 'Animation'],
        desc: 'Generates realistic video clips. Extremely compute-intensive.'
    },
    {
        id: 'audio',
        name: 'Audio Model',
        cost: 60000,
        time: 5,
        compute: 10,
        operational_cost_per_week: 800,
        specs: ['Music', 'Voice', 'SFX', 'Podcasts'],
        desc: 'Synthesizes realistic voice and music with low latency.'
    },
    {
        id: 'custom',
        name: 'Custom Architecture',
        cost: 120000,
        time: 8,
        compute: 20,
        operational_cost_per_week: 2000,
        specs: ['Specialized', 'Unique', 'Experimental'],
        desc: 'Build a model with a specific neural trait (Dreamer, Sentient, Empath, etc).'
    },
    {
        id: 'agi',
        name: 'AGI Core',
        cost: 8000000,
        time: 30,
        compute: 8000,
        operational_cost_per_week: 50000,
        reqTech: 'agi_theory',
        specs: ['Sentience', 'Omniscience', 'Singularity'],
        desc: 'Artificial General Intelligence. The final frontier.'
    }
];

// Model variant types
export const VARIANT_TYPES = [
    { id: 'lite', name: 'Lite', costMult: 0.6, qualityMult: 0.7, desc: 'Faster, cheaper' },
    { id: 'flash', name: 'Flash', costMult: 0.5, qualityMult: 0.6, desc: 'Fastest response' },
    { id: 'pro', name: 'Pro', costMult: 1.5, qualityMult: 1.3, desc: 'Higher quality' },
    { id: 'mini', name: 'Mini', costMult: 0.4, quality Mult: 0.5, desc: 'Smallest model' },
    { id: 'ultra', name: 'Ultra', costMult: 2.0, qualityMult: 1.6, desc: 'Maximum power' }
];

// Marketing campaigns
export const CAMPAIGNS = [
    { id: 'social_ads', name: 'Social Media Blast', cost: 3000, hype: 20, duration: 2 },
    { id: 'influencer', name: 'Tech Influencer', cost: 18000, hype: 50, duration: 4 },
    { id: 'billboard', name: 'Times Square Billboard', cost: 75000, hype: 150, duration: 8 },
    { id: 'superbowl', name: 'Super Bowl Ad', cost: 8000000, hype: 8000, duration: 12 }
];

// Review pools based on quality
export const REVIEWS_DB = {
    low: [
        "Absolute garbage.", "Hallucinates more than my uncle.", "Waste of money.",
        "Slow, dumb, expensive.", "Refund requested.", "Zero coherence.",
        "Why is this popular? Breaks constantly.", "L model tbh."
    ],
    mid: [
        "It's okay, not great.", "Good for drafts.", "A bit slow but works.",
        "Better than last version.", "Decent.", "Meh.", "Serviceable."
    ],
    high: [
        "Actually really good.", "Saves me hours daily.", "Code generation is spot on.",
        "Production-ready quality!", "Workflow changed forever.", "Best in class.",
        "This is cooking.", "Absolute W."
    ],
    god: [
        "AGI ACHIEVED?!", "This feels illegal.", "Consciousness simulated.",
        "Indistinguishable from reality.", "Goodbye Hollywood.", "SOTA.",
        "Physics-breaking quality.", "We've reached the singularity."
    ]
};
