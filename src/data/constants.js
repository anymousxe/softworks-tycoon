// Expanded GPU/Hardware options with realistic pricing
export const HARDWARE = [
    { id: 'gtx_cluster', name: 'Consumer GPU Cluster', cost: 2000, compute: 5, upkeep: 10 },
    { id: 'rtx_4090_farm', name: 'RTX 4090 Farm', cost: 5500, compute: 15, upkeep: 40 },
    { id: 'rtx_5090_rack', name: 'RTX 5090 Rack', cost: 12000, compute: 35, upkeep: 70 },
    { id: 'a100', name: 'A100 Tensor Rack', cost: 18000, compute: 80, upkeep: 120 },
    { id: 'h100', name: 'H100 SXM Cluster', cost: 35000, compute: 150, upkeep: 200 },
    { id: 'h200', name: 'Nvidia H200', cost: 65000, compute: 280, upkeep: 350, reqTech: 'h200_unlock' },
    { id: 'gh200_super', name: 'GH200 Grace Hopper', cost: 95000, compute: 450, upkeep: 550, reqTech: 'blackwell_arch' },
    { id: 'b200', name: 'Blackwell B200', cost: 140000, compute: 800, upkeep: 850, reqTech: 'blackwell_arch' },
    { id: 'mi300x', name: 'AMD MI300X', cost: 55000, compute: 250, upkeep: 400, reqTech: 'amd_arch' },
    { id: 'tpu_v5', name: 'Google TPU v5 Pod', cost: 280000, compute: 2000, upkeep: 2000, reqTech: 'tpu_opt' },
    { id: 'cerebras', name: 'Cerebras WSE-3', cost: 650000, compute: 5000, upkeep: 4500, reqTech: 'wafer_scale' },
    { id: 'quantum', name: 'Q-Bit Processor Array', cost: 2000000, compute: 15000, upkeep: 8000, reqTech: 'quantum_tech' }
];

export const RIVALS_LIST = [
    { name: 'OpenAI', strength: 98, color: 'text-green-400' },
    { name: 'Anthropic', strength: 95, color: 'text-yellow-400' },
    { name: 'Google DeepMind', strength: 97, color: 'text-blue-400' },
    { name: 'Meta AI', strength: 90, color: 'text-blue-300' },
    { name: 'X.AI', strength: 85, color: 'text-slate-200' },
    { name: 'Mistral', strength: 82, color: 'text-orange-400' },
    { name: 'Cohere', strength: 75, color: 'text-teal-400' },
    { name: 'Perplexity', strength: 70, color: 'text-indigo-400' },
    { name: 'Stability AI', strength: 78, color: 'text-purple-400' },
    { name: 'Midjourney', strength: 88, color: 'text-pink-400' },
    { name: 'Character.AI', strength: 83, color: 'text-cyan-400' },
    { name: 'HuggingFace', strength: 68, color: 'text-yellow-200' }
];

export const COMPANIES = [
    { name: 'Indie Devs', budget: 2500 },
    { name: 'Startup Inc', budget: 5000 },
    { name: 'Facebooc', budget: 12000 },
    { name: 'StreamFlix', budget: 18000 },
    { name: 'Microhard', budget: 25000 },
    { name: 'Joggle', budget: 35000 },
    { name: 'Amacon', budget: 45000 },
    { name: 'Fruit Co', budget: 60000 },
    { name: 'Tessla Motors', budget: 75000 },
    { name: 'Wall Street Firms', budget: 120000 },
    { name: 'Global Governments', budget: 500000 }
];

export const SHOP_ITEMS = [
    { id: 'pizza_party', name: 'Pizza Party', cost: 5000, type: 'consumable_emp', amount: 15, effect: '+15 Morale' },
    { id: 'team_retreat', name: 'Team Retreat', cost: 25000, type: 'consumable_emp', amount: 40, effect: '+40 Morale' },
    { id: 'research_grant_s', name: 'Small Grant', cost: 10000, type: 'consumable_res', amount: 500, effect: '+500 Research' },
    { id: 'research_grant_m', name: 'Federal Grant', cost: 50000, type: 'consumable_res', amount: 2500, effect: '+2500 Research' },
    { id: 'research_grant_l', name: 'DARPA Contract', cost: 150000, type: 'consumable_res', amount: 8000, effect: '+8000 Research' },
    { id: 'server_opt', name: 'Server Optimization', cost: 50000, type: 'upgrade', effect: '+50% Research Gen' },
    { id: 'marketing_team', name: 'Marketing Firm', cost: 75000, type: 'upgrade', effect: 'Passive Hype +10/week' },
    { id: 'pr_agency', name: 'PR Agency', cost: 100000, type: 'upgrade', effect: '+25% Revenue' },
    { id: 'ai_accelerator', name: 'AI Accelerator Program', cost: 200000, type: 'upgrade', effect: '-25% Dev Time' }
];

export const TRAITS = [
    { id: 'dreamer', name: 'Lucid Dreamer', multCost: 1.3, multTime: 1.4, desc: 'Can "dream" and hallucinate creative concepts. High unpredictability.' },
    { id: 'sentient', name: 'Emotional Core', multCost: 2.2, multTime: 2.0, desc: 'Simulates human emotions. Extremely engaging but controversial.' },
    { id: 'chaos', name: 'Chaos Engine', multCost: 1.5, multTime: 1.2, desc: 'Unpredictable outputs. Exciting but dangerous in production.' },
    { id: 'logic', name: 'Hyper-Logic', multCost: 1.8, multTime: 2.5, desc: 'Zero creativity, perfect reasoning. The ultimate analytical mind.' },
    { id: 'mimic', name: 'Persona Mimic', multCost: 1.4, multTime: 1.5, desc: 'Perfectly copies human personalities and voices.' },
    { id: 'empath', name: 'Empathy Engine', multCost: 1.9, multTime: 1.8, desc: 'Understands and responds to human emotions deeply.' }
];

export const CAPABILITIES = [
    { id: 'web_search', name: 'Web Search', cost: 15000, time: 2, quality: 15, desc: 'Internet access' },
    { id: 'multimodal', name: 'Vision', cost: 25000, time: 3, quality: 25, desc: 'Can see images' },
    { id: 'memory', name: 'Long-Term Memory', cost: 40000, time: 4, quality: 30, desc: 'Remembers conversations' },
    { id: 'audio_in', name: 'Audio Input', cost: 20000, time: 2, quality: 10, desc: 'Voice commands' },
    { id: 'code_interpreter', name: 'Code Execution', cost: 60000, time: 5, quality: 40, desc: 'Runs code locally' },
    { id: 'autonomy', name: 'Agent Mode', cost: 100000, time: 8, quality: 50, desc: 'Acts independently' }
];

export const RESEARCH = [
    { id: 'opt_algos', name: 'Optimized Algorithms', cost: 50, desc: '-1 Week Dev Time' },
    { id: 'h200_unlock', name: 'H200 Hardware Access', cost: 150, desc: 'Unlock H200' },
    { id: 'blackwell_arch', name: 'Blackwell Architecture', cost: 350, desc: 'Unlock B200/GH200' },
    { id: 'amd_arch', name: 'AMD Integration', cost: 200, desc: 'Unlock MI300X' },
    { id: 'tpu_opt', name: 'TPU Optimization', cost: 800, desc: 'Unlock TPU v5' },
    { id: 'wafer_scale', name: 'Wafer-Scale Computing', cost: 2500, desc: 'Unlock Cerebras' },
    { id: 'quantum_tech', name: 'Quantum Computing', cost: 8000, desc: 'Unlock Quantum' },
    { id: 'agi_theory', name: 'AGI Theory', cost: 20000, desc: 'Unlock AGI Development' }
];

export const APP_ID = 'softworks-tycoon';
export const ADMIN_EMAIL = 'anymousxe.info@gmail.com';
