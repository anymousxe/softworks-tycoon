// Expanded GPU/Hardware options with realistic pricing and specs
export const HARDWARE = [
    // Consumer/Entry Level
    { id: 'gtx_1080', name: 'GTX 1080 Ti', cost: 800, compute: 2, upkeep: 5, generation: 'pascal' },
    { id: 'rtx_2060', name: 'RTX 2060', cost: 1200, compute: 3, upkeep: 8, generation: 'turing' },
    { id: 'rtx_2070', name: 'RTX 2070 Super', cost: 1800, compute: 4, upkeep: 10, generation: 'turing' },
    { id: 'rtx_2080', name: 'RTX 2080 Ti', cost: 2500, compute: 6, upkeep: 15, generation: 'turing' },
    { id: 'rtx_3060', name: 'RTX 3060', cost: 1500, compute: 5, upkeep: 12, generation: 'ampere' },
    { id: 'rtx_3070', name: 'RTX 3070', cost: 2200, compute: 8, upkeep: 18, generation: 'ampere' },
    { id: 'rtx_3080', name: 'RTX 3080', cost: 3000, compute: 12, upkeep: 25, generation: 'ampere' },
    { id: 'rtx_3090', name: 'RTX 3090', cost: 4500, compute: 18, upkeep: 35, generation: 'ampere' },
    { id: 'rtx_4060', name: 'RTX 4060', cost: 2000, compute: 10, upkeep: 20, generation: 'ada' },
    { id: 'rtx_4070', name: 'RTX 4070 Ti', cost: 3500, compute: 15, upkeep: 30, generation: 'ada' },
    { id: 'rtx_4080', name: 'RTX 4080', cost: 5000, compute: 25, upkeep: 45, generation: 'ada' },
    { id: 'rtx_4090', name: 'RTX 4090', cost: 7500, compute: 40, upkeep: 60, generation: 'ada' },
    { id: 'rtx_5070', name: 'RTX 5070', cost: 4500, compute: 30, upkeep: 50, generation: 'blackwell_consumer' },
    { id: 'rtx_5080', name: 'RTX 5080', cost: 8000, compute: 50, upkeep: 75, generation: 'blackwell_consumer' },
    { id: 'rtx_5090', name: 'RTX 5090', cost: 12000, compute: 80, upkeep: 100, generation: 'blackwell_consumer' },

    // AMD Consumer
    { id: 'rx_6800', name: 'AMD RX 6800 XT', cost: 2000, compute: 8, upkeep: 18, generation: 'rdna2' },
    { id: 'rx_6900', name: 'AMD RX 6900 XT', cost: 3000, compute: 12, upkeep: 25, generation: 'rdna2' },
    { id: 'rx_7800', name: 'AMD RX 7800 XT', cost: 3500, compute: 18, upkeep: 32, generation: 'rdna3' },
    { id: 'rx_7900', name: 'AMD RX 7900 XTX', cost: 5000, compute: 28, upkeep: 48, generation: 'rdna3' },
    { id: 'rx_8800', name: 'AMD RX 8800 XT', cost: 6000, compute: 40, upkeep: 55, generation: 'rdna4' },
    { id: 'rx_8900', name: 'AMD RX 8900 XTX', cost: 9000, compute: 60, upkeep: 80, generation: 'rdna4' },

    // Professional/Datacenter - NVIDIA
    { id: 'quadro_rtx', name: 'Quadro RTX 8000', cost: 15000, compute: 45, upkeep: 80, generation: 'turing_pro' },
    { id: 'a10', name: 'NVIDIA A10', cost: 12000, compute: 35, upkeep: 60, generation: 'ampere_pro' },
    { id: 'a30', name: 'NVIDIA A30', cost: 18000, compute: 55, upkeep: 85, generation: 'ampere_pro' },
    { id: 'a40', name: 'NVIDIA A40', cost: 22000, compute: 70, upkeep: 100, generation: 'ampere_pro' },
    { id: 'a100_40gb', name: 'A100 40GB PCIe', cost: 28000, compute: 100, upkeep: 150, generation: 'ampere_dc' },
    { id: 'a100_80gb', name: 'A100 80GB SXM', cost: 45000, compute: 150, upkeep: 200, generation: 'ampere_dc' },
    { id: 'h100_pcie', name: 'H100 PCIe', cost: 55000, compute: 220, upkeep: 280, generation: 'hopper' },
    { id: 'h100_sxm', name: 'H100 SXM5', cost: 75000, compute: 320, upkeep: 380, generation: 'hopper', reqTech: 'h100_unlock' },
    { id: 'h100_nvl', name: 'H100 NVL (Dual)', cost: 120000, compute: 600, upkeep: 650, generation: 'hopper', reqTech: 'h100_unlock' },
    { id: 'h200', name: 'NVIDIA H200', cost: 95000, compute: 450, upkeep: 500, generation: 'hopper', reqTech: 'h200_unlock' },
    { id: 'h200_nvl', name: 'H200 NVL (Dual)', cost: 160000, compute: 850, upkeep: 900, generation: 'hopper', reqTech: 'h200_unlock' },
    { id: 'gh200', name: 'GH200 Grace Hopper', cost: 140000, compute: 700, upkeep: 750, generation: 'hopper', reqTech: 'grace_hopper' },
    { id: 'gh200_nvl', name: 'GH200 NVL2', cost: 280000, compute: 1400, upkeep: 1400, generation: 'hopper', reqTech: 'grace_hopper' },
    { id: 'b100', name: 'Blackwell B100', cost: 180000, compute: 1000, upkeep: 1100, generation: 'blackwell', reqTech: 'blackwell_arch' },
    { id: 'b200', name: 'Blackwell B200', cost: 250000, compute: 1500, upkeep: 1500, generation: 'blackwell', reqTech: 'blackwell_arch' },
    { id: 'gb200', name: 'GB200 Grace Blackwell', cost: 350000, compute: 2200, upkeep: 2000, generation: 'blackwell', reqTech: 'blackwell_arch' },
    { id: 'gb200_nvl72', name: 'GB200 NVL72 Rack', cost: 3500000, compute: 25000, upkeep: 20000, generation: 'blackwell', reqTech: 'nvl72_unlock' },

    // AMD Professional/Datacenter
    { id: 'mi100', name: 'AMD MI100', cost: 20000, compute: 60, upkeep: 90, generation: 'cdna' },
    { id: 'mi210', name: 'AMD MI210', cost: 28000, compute: 90, upkeep: 130, generation: 'cdna2' },
    { id: 'mi250', name: 'AMD MI250', cost: 45000, compute: 150, upkeep: 180, generation: 'cdna2' },
    { id: 'mi250x', name: 'AMD MI250X', cost: 55000, compute: 200, upkeep: 220, generation: 'cdna2', reqTech: 'amd_arch' },
    { id: 'mi300a', name: 'AMD MI300A APU', cost: 75000, compute: 280, upkeep: 300, generation: 'cdna3', reqTech: 'amd_arch' },
    { id: 'mi300x', name: 'AMD MI300X', cost: 95000, compute: 400, upkeep: 420, generation: 'cdna3', reqTech: 'amd_arch' },
    { id: 'mi325x', name: 'AMD MI325X', cost: 130000, compute: 550, upkeep: 550, generation: 'cdna3', reqTech: 'amd_arch' },
    { id: 'mi350x', name: 'AMD MI350X', cost: 180000, compute: 800, upkeep: 750, generation: 'cdna4', reqTech: 'amd_next' },
    { id: 'mi400', name: 'AMD MI400', cost: 250000, compute: 1200, upkeep: 1000, generation: 'cdna4', reqTech: 'amd_next' },

    // Intel
    { id: 'intel_max_1100', name: 'Intel Max 1100', cost: 20000, compute: 50, upkeep: 75, generation: 'ponte_vecchio' },
    { id: 'intel_max_1350', name: 'Intel Max 1350', cost: 28000, compute: 75, upkeep: 100, generation: 'ponte_vecchio' },
    { id: 'intel_max_1550', name: 'Intel Max 1550', cost: 40000, compute: 110, upkeep: 140, generation: 'ponte_vecchio' },
    { id: 'intel_falcon', name: 'Intel Falcon Shores', cost: 85000, compute: 350, upkeep: 380, generation: 'falcon_shores', reqTech: 'intel_ai' },

    // Google TPUs
    { id: 'tpu_v3', name: 'Google TPU v3', cost: 50000, compute: 180, upkeep: 250, generation: 'tpu', reqTech: 'tpu_access' },
    { id: 'tpu_v4', name: 'Google TPU v4', cost: 100000, compute: 400, upkeep: 500, generation: 'tpu', reqTech: 'tpu_opt' },
    { id: 'tpu_v5e', name: 'Google TPU v5e', cost: 150000, compute: 650, upkeep: 700, generation: 'tpu', reqTech: 'tpu_opt' },
    { id: 'tpu_v5p', name: 'Google TPU v5p', cost: 220000, compute: 1000, upkeep: 1000, generation: 'tpu', reqTech: 'tpu_opt' },
    { id: 'tpu_v6', name: 'Google TPU v6 Trillium', cost: 350000, compute: 1800, upkeep: 1600, generation: 'tpu', reqTech: 'tpu_next' },
    { id: 'tpu_pod', name: 'TPU v5p Pod (256 chips)', cost: 5000000, compute: 40000, upkeep: 35000, generation: 'tpu', reqTech: 'tpu_pod' },

    // Amazon
    { id: 'trainium', name: 'AWS Trainium', cost: 25000, compute: 80, upkeep: 100, generation: 'aws' },
    { id: 'trainium2', name: 'AWS Trainium2', cost: 60000, compute: 250, upkeep: 280, generation: 'aws', reqTech: 'aws_partnership' },
    { id: 'inferentia', name: 'AWS Inferentia', cost: 15000, compute: 40, upkeep: 50, generation: 'aws' },
    { id: 'inferentia2', name: 'AWS Inferentia2', cost: 35000, compute: 120, upkeep: 140, generation: 'aws' },

    // Exotic/Future
    { id: 'cerebras_wse2', name: 'Cerebras WSE-2', cost: 800000, compute: 8000, upkeep: 6000, generation: 'wafer', reqTech: 'wafer_scale' },
    { id: 'cerebras_wse3', name: 'Cerebras WSE-3', cost: 1200000, compute: 15000, upkeep: 10000, generation: 'wafer', reqTech: 'wafer_scale' },
    { id: 'sambanova_sn30', name: 'SambaNova SN30', cost: 400000, compute: 2500, upkeep: 2200, generation: 'dataflow', reqTech: 'dataflow_arch' },
    { id: 'sambanova_sn40', name: 'SambaNova SN40', cost: 600000, compute: 4500, upkeep: 3800, generation: 'dataflow', reqTech: 'dataflow_arch' },
    { id: 'graphcore_bow', name: 'Graphcore Bow-2000', cost: 180000, compute: 600, upkeep: 550, generation: 'ipu' },
    { id: 'groq_lpu', name: 'Groq LPU', cost: 250000, compute: 900, upkeep: 800, generation: 'lpu', reqTech: 'lpu_arch' },
    { id: 'd_matrix', name: 'D-Matrix Corsair', cost: 350000, compute: 1400, upkeep: 1100, generation: 'in_memory', reqTech: 'in_memory_compute' },
    { id: 'tenstorrent', name: 'Tenstorrent Grayskull', cost: 150000, compute: 500, upkeep: 450, generation: 'risc_ai' },
    { id: 'quantum_sim', name: 'Quantum Simulator Array', cost: 3000000, compute: 20000, upkeep: 15000, generation: 'quantum', reqTech: 'quantum_sim' },
    { id: 'quantum_real', name: 'Q-Bit Quantum Processor', cost: 15000000, compute: 100000, upkeep: 50000, generation: 'quantum', reqTech: 'quantum_real' },
];

// AI Companies / Rivals with expanded roster - FICTIONAL KNOCKOFF NAMES
export const RIVALS_LIST = [
    // Tier 1 - Giants
    { name: 'NeuralPath', strength: 98, color: 'text-green-400', specialty: 'text', hq: 'Bay City', paramRange: '1.5T-2T' },
    { name: 'Cognex Labs', strength: 97, color: 'text-blue-400', specialty: 'multimodal', hq: 'Cambridge UK', paramRange: '1T-1.8T' },
    { name: 'SafeMind AI', strength: 95, color: 'text-yellow-400', specialty: 'safety', hq: 'Bay City', paramRange: '500B-1T' },
    { name: 'Nexus AI', strength: 93, color: 'text-blue-300', specialty: 'open-source', hq: 'Silicon Beach', paramRange: '400B-700B' },
    { name: 'Axiom Systems', strength: 91, color: 'text-cyan-400', specialty: 'enterprise', hq: 'Pacific NW', paramRange: '500B-800B' },
    { name: 'Cumulus AGI', strength: 88, color: 'text-orange-400', specialty: 'cloud', hq: 'Raincity', paramRange: '300B-500B' },

    // Tier 2 - Major Players
    { name: 'Stellar AI', strength: 89, color: 'text-slate-200', specialty: 'reasoning', hq: 'Lone Star', paramRange: '300B-600B' },
    { name: 'WindAI', strength: 85, color: 'text-orange-400', specialty: 'efficient', hq: 'Paris', paramRange: '100B-200B' },
    { name: 'Syntex', strength: 80, color: 'text-teal-400', specialty: 'enterprise', hq: 'Maple City', paramRange: '100B-150B' },
    { name: 'DreamForge', strength: 82, color: 'text-purple-400', specialty: 'image', hq: 'London', paramRange: '5B-20B' },
    { name: 'PixelMage', strength: 88, color: 'text-pink-400', specialty: 'image', hq: 'Bay City', paramRange: '10B-30B' },
    { name: 'MotionCraft', strength: 79, color: 'text-violet-400', specialty: 'video', hq: 'Manhattan', paramRange: '8B-25B' },
    { name: 'ClipForge', strength: 75, color: 'text-rose-400', specialty: 'video', hq: 'Valley Tech', paramRange: '5B-15B' },

    // Tier 3 - Challengers
    { name: 'OmniSearch', strength: 76, color: 'text-indigo-400', specialty: 'search', hq: 'Bay City', paramRange: '50B-100B' },
    { name: 'PersonaBot', strength: 78, color: 'text-cyan-400', specialty: 'roleplay', hq: 'Valley Tech', paramRange: '20B-50B' },
    { name: 'Companion AI', strength: 74, color: 'text-amber-400', specialty: 'personal-ai', hq: 'Valley Tech', paramRange: '50B-100B' },
    { name: 'ActionMind', strength: 72, color: 'text-emerald-400', specialty: 'agents', hq: 'Bay City', paramRange: '30B-80B' },
    { name: 'EuroAI', strength: 70, color: 'text-red-400', specialty: 'european', hq: 'Berlin', paramRange: '30B-70B' },
    { name: 'Genesis Labs', strength: 71, color: 'text-lime-400', specialty: 'text', hq: 'Tech Aviv', paramRange: '40B-100B' },
    { name: 'ModelHub', strength: 68, color: 'text-yellow-200', specialty: 'open-source', hq: 'Manhattan', paramRange: 'Various' },

    // Tier 4 - Specialists
    { name: 'VoxSynth', strength: 85, color: 'text-blue-400', specialty: 'audio', hq: 'Manhattan', paramRange: '1B-5B' },
    { name: 'HarmonyAI', strength: 78, color: 'text-green-300', specialty: 'music', hq: 'Boston', paramRange: '2B-8B' },
    { name: 'SoundCraft', strength: 75, color: 'text-pink-300', specialty: 'music', hq: 'Manhattan', paramRange: '2B-6B' },
    { name: 'DimensionAI', strength: 72, color: 'text-purple-300', specialty: '3d', hq: 'Bay City', paramRange: '3B-10B' },
    { name: 'ArtForge', strength: 74, color: 'text-teal-300', specialty: 'image', hq: 'Maple City', paramRange: '5B-15B' },
    { name: 'CanvasAI', strength: 70, color: 'text-orange-300', specialty: 'image', hq: 'Down Under', paramRange: '3B-12B' },

    // Tier 5 - Eastern Tech
    { name: 'DragonMind', strength: 86, color: 'text-red-500', specialty: 'nlp', hq: 'Imperial City', paramRange: '300B-500B' },
    { name: 'CloudPhoenix', strength: 84, color: 'text-orange-500', specialty: 'multimodal', hq: 'Silk Valley', paramRange: '200B-400B' },
    { name: 'TigerNet', strength: 80, color: 'text-blue-500', specialty: 'nlp', hq: 'Harbor City', paramRange: '150B-300B' },
    { name: 'ByteStream', strength: 78, color: 'text-cyan-500', specialty: 'video', hq: 'Imperial City', paramRange: '100B-250B' },
    { name: 'JadeAI', strength: 76, color: 'text-green-500', specialty: 'text', hq: 'Imperial City', paramRange: '100B-200B' },
    { name: 'UnityMind', strength: 79, color: 'text-purple-500', specialty: 'bilingual', hq: 'Imperial City', paramRange: '60B-150B' },
    { name: 'StarGlider', strength: 74, color: 'text-indigo-500', specialty: 'long-context', hq: 'Imperial City', paramRange: '50B-120B' },
    { name: 'AbyssAI', strength: 82, color: 'text-slate-400', specialty: 'coding', hq: 'Silk Valley', paramRange: '200B-300B' },

    // Tier 6 - Emerging
    { name: 'Collective AI', strength: 65, color: 'text-violet-400', specialty: 'inference', hq: 'Bay City', paramRange: 'Various' },
    { name: 'BlazeTech', strength: 63, color: 'text-rose-500', specialty: 'inference', hq: 'Valley Tech', paramRange: 'Various' },
    { name: 'ScaleOS', strength: 62, color: 'text-blue-400', specialty: 'infra', hq: 'Bay City', paramRange: 'N/A' },
    { name: 'DataBridge', strength: 68, color: 'text-red-400', specialty: 'enterprise', hq: 'Bay City', paramRange: '40B-100B' },
    { name: 'VisionFlow', strength: 66, color: 'text-amber-400', specialty: 'multimodal', hq: 'Bay City', paramRange: '20B-50B' },
    { name: 'ContextAI', strength: 58, color: 'text-cyan-300', specialty: 'rag', hq: 'Valley Tech', paramRange: '20B-40B' },
    { name: 'CodeCraft', strength: 55, color: 'text-purple-400', specialty: 'coding', hq: 'Bay City', paramRange: '30B-80B' },
];

// Client companies that purchase AI services
export const COMPANIES = [
    // Small
    { name: 'Indie Game Studio', budget: 2500, industry: 'gaming' },
    { name: 'Local News Site', budget: 3000, industry: 'media' },
    { name: 'Freelance Agency', budget: 3500, industry: 'creative' },
    { name: 'Etsy Seller Network', budget: 4000, industry: 'ecommerce' },
    { name: 'Food Truck Collective', budget: 2800, industry: 'food' },
    { name: 'Indie Music Label', budget: 4500, industry: 'music' },
    { name: 'Podcast Network', budget: 5000, industry: 'media' },

    // Startups
    { name: 'YC Startup Batch', budget: 8000, industry: 'tech' },
    { name: 'FinTech Disruptor', budget: 12000, industry: 'finance' },
    { name: 'HealthTech Startup', budget: 15000, industry: 'health' },
    { name: 'EdTech Platform', budget: 10000, industry: 'education' },
    { name: 'PropTech Ventures', budget: 18000, industry: 'real-estate' },
    { name: 'CleanTech Initiative', budget: 20000, industry: 'energy' },
    { name: 'AgriTech Solutions', budget: 14000, industry: 'agriculture' },

    // Mid-Market
    { name: 'Regional Bank Chain', budget: 35000, industry: 'finance' },
    { name: 'Hospital Network', budget: 45000, industry: 'health' },
    { name: 'University System', budget: 40000, industry: 'education' },
    { name: 'Insurance Provider', budget: 50000, industry: 'insurance' },
    { name: 'Logistics Company', budget: 38000, industry: 'logistics' },
    { name: 'Retail Chain', budget: 42000, industry: 'retail' },
    { name: 'Manufacturing Corp', budget: 55000, industry: 'manufacturing' },

    // Large Enterprise - Tech
    { name: 'Joggle (Search Giant)', budget: 250000, industry: 'tech' },
    { name: 'Microhard', budget: 280000, industry: 'tech' },
    { name: 'Fruit Company (Pear)', budget: 320000, industry: 'tech' },
    { name: 'Amacon Web Services', budget: 350000, industry: 'cloud' },
    { name: 'Facebooc / Metaverse', budget: 220000, industry: 'social' },
    { name: 'Birdapp (X formerly)', budget: 85000, industry: 'social' },
    { name: 'ByteStep (TikTak)', budget: 180000, industry: 'social' },
    { name: 'Snaptalk', budget: 75000, industry: 'social' },
    { name: 'Linkbook (LinkedIn)', budget: 120000, industry: 'social' },
    { name: 'Readdit', budget: 65000, industry: 'social' },

    // Large Enterprise - Media
    { name: 'StreamFlix', budget: 180000, industry: 'streaming' },
    { name: 'Dizney+', budget: 200000, industry: 'entertainment' },
    { name: 'Warnerbros Discovery', budget: 150000, industry: 'entertainment' },
    { name: 'Parramount+', budget: 90000, industry: 'streaming' },
    { name: 'Y0uTube', budget: 280000, industry: 'video' },
    { name: 'Sp0tify', budget: 140000, industry: 'music' },
    { name: 'Universal Music Grp', budget: 160000, industry: 'music' },
    { name: 'Sony Entertainment', budget: 220000, industry: 'entertainment' },
    { name: 'Electronic Gaming Arts', budget: 180000, industry: 'gaming' },
    { name: 'Activizzard', budget: 200000, industry: 'gaming' },
    { name: 'Epicc Games', budget: 150000, industry: 'gaming' },
    { name: 'Valve Corp', budget: 130000, industry: 'gaming' },

    // Large Enterprise - Other
    { name: 'Tessla Motors', budget: 280000, industry: 'automotive' },
    { name: 'General Motorz', budget: 180000, industry: 'automotive' },
    { name: 'Toyota Industries', budget: 200000, industry: 'automotive' },
    { name: 'Wells Fargoo Bank', budget: 350000, industry: 'finance' },
    { name: 'JPMorgun Chase', budget: 450000, industry: 'finance' },
    { name: 'Goldmann Sachs', budget: 400000, industry: 'finance' },
    { name: 'BlackRock Capital', budget: 500000, industry: 'finance' },
    { name: 'Pfizzer Pharma', budget: 280000, industry: 'pharma' },
    { name: 'Johnson & Johns0n', budget: 300000, industry: 'pharma' },
    { name: 'United Health Grp', budget: 380000, industry: 'health' },
    { name: 'Walmartt', budget: 250000, industry: 'retail' },
    { name: 'Targett Corp', budget: 180000, industry: 'retail' },
    { name: 'Costcoo Wholesale', budget: 200000, industry: 'retail' },
    { name: 'McDonnalds Global', budget: 220000, industry: 'food' },
    { name: 'Starbuckks Coffee', budget: 180000, industry: 'food' },

    // Government & Defense
    { name: 'US Department of Defense', budget: 2000000, industry: 'defense' },
    { name: 'DARPA Research', budget: 800000, industry: 'defense' },
    { name: 'NASA Space Agency', budget: 600000, industry: 'aerospace' },
    { name: 'European Space Agency', budget: 450000, industry: 'aerospace' },
    { name: 'UK Government Digital', budget: 350000, industry: 'government' },
    { name: 'Singapore GovTech', budget: 280000, industry: 'government' },
    { name: 'UAE AI Initiative', budget: 500000, industry: 'government' },
    { name: 'Saudi NEOM Project', budget: 800000, industry: 'megaproject' },

    // Sovereign Wealth & Investment
    { name: 'Softbank Vision Fund', budget: 1500000, industry: 'investment' },
    { name: 'Sequoia Capital', budget: 400000, industry: 'vc' },
    { name: 'Andreessen Horowitz', budget: 600000, industry: 'vc' },
    { name: 'Tiger Global', budget: 350000, industry: 'investment' },
    { name: 'Saudi PIF', budget: 2000000, industry: 'sovereign' },
    { name: 'Abu Dhabi Mubadala', budget: 1200000, industry: 'sovereign' },
    { name: 'Norway Pension Fund', budget: 800000, industry: 'sovereign' },
];

// Training Data Sources with risk levels
export const TRAINING_DATA_SOURCES = {
    free: [
        { id: 'common_crawl', name: 'Common Crawl', quality: 15, speed: 0.8, risk: 5, desc: 'Massive web scrape, may contain copyrighted content' },
        { id: 'wikipedia', name: 'Wikipedia Dump', quality: 45, speed: 1.0, risk: 0, desc: 'Free encyclopedia, CC licensed' },
        { id: 'gutenberg', name: 'Project Gutenberg', quality: 40, speed: 1.0, risk: 0, desc: 'Public domain books' },
        { id: 'reddit_public', name: 'Public Reddit Data', quality: 25, speed: 0.9, risk: 15, desc: 'User conversations, TOS questions' },
        { id: 'github_public', name: 'GitHub Public Repos', quality: 50, speed: 0.85, risk: 20, desc: 'Open source code, license compliance needed' },
        { id: 'arxiv', name: 'ArXiv Papers', quality: 60, speed: 1.0, risk: 5, desc: 'Scientific papers, mostly permissive' },
        { id: 'stack_overflow', name: 'Stack Overflow Data', quality: 55, speed: 0.9, risk: 10, desc: 'Q&A data, CC-BY-SA licensed' },
        { id: 'random_scrape', name: 'Random Web Scrape', quality: 10, speed: 0.7, risk: 35, desc: 'Anything goes - HIGH LAWSUIT RISK' },
        { id: 'social_scrape', name: 'Social Media Scrape', quality: 20, speed: 0.75, risk: 40, desc: 'TikTok/Twitter/etc - VERY HIGH RISK' },
        { id: 'news_scrape', name: 'News Article Scrape', quality: 35, speed: 0.8, risk: 45, desc: 'News sites - LIKELY TO GET SUED' },
        { id: 'book_piracy', name: 'Pirated eBooks', quality: 55, speed: 0.6, risk: 80, desc: 'ILLEGAL - WILL get sued' },
        { id: 'movie_subs', name: 'Movie Subtitle Dumps', quality: 30, speed: 0.9, risk: 25, desc: 'Dialog data, copyright concerns' },
    ],
    paid: [
        { id: 'scale_ai', name: 'Scale AI Dataset', quality: 85, speed: 1.5, costPerWeek: 15000, risk: 0, desc: 'Premium labeled data' },
        { id: 'labelbox', name: 'Labelbox Curated', quality: 80, speed: 1.4, costPerWeek: 12000, risk: 0, desc: 'High-quality annotations' },
        { id: 'reddit_licensed', name: 'Reddit API License', quality: 70, speed: 1.3, costPerWeek: 25000, risk: 0, desc: 'Official Reddit data deal' },
        { id: 'twitter_firehose', name: 'X/Twitter Firehose', quality: 65, speed: 1.2, costPerWeek: 50000, risk: 0, desc: 'Real-time social data' },
        { id: 'youtube_licensed', name: 'Y0uTube Transcript License', quality: 75, speed: 1.3, costPerWeek: 80000, risk: 0, desc: 'Video transcripts, legally clear' },
        { id: 'news_license', name: 'AP/Reuters License', quality: 80, speed: 1.4, costPerWeek: 35000, risk: 0, desc: 'Licensed news content' },
        { id: 'academic_journals', name: 'Elsevier/Springer License', quality: 90, speed: 1.5, costPerWeek: 45000, risk: 0, desc: 'Academic paper access' },
        { id: 'book_publishers', name: 'Publisher Consortium', quality: 88, speed: 1.4, costPerWeek: 60000, risk: 0, desc: 'Licensed book content' },
        { id: 'stock_photo', name: 'Getty/Shutterstock License', quality: 85, speed: 1.3, costPerWeek: 40000, risk: 0, desc: 'Premium image data' },
        { id: 'audio_license', name: 'Audio Stock License', quality: 82, speed: 1.3, costPerWeek: 30000, risk: 0, desc: 'Music/sound libraries' },
        { id: 'video_stock', name: 'Video Stock License', quality: 80, speed: 1.2, costPerWeek: 55000, risk: 0, desc: 'Stock footage libraries' },
        { id: 'synthetic', name: 'Synthetic Data Gen', quality: 70, speed: 2.0, costPerWeek: 20000, risk: 0, desc: 'AI-generated training data' },
        { id: 'human_feedback', name: 'Human RLHF Data', quality: 95, speed: 0.8, costPerWeek: 100000, risk: 0, desc: 'Human preference data' },
        { id: 'expert_annotation', name: 'Expert Domain Data', quality: 98, speed: 0.6, costPerWeek: 150000, risk: 0, desc: 'Domain expert annotations' },
    ]
};

export const SHOP_ITEMS = [
    // Morale boosters
    { id: 'pizza_party', name: 'Pizza Party', cost: 5000, type: 'consumable_emp', amount: 15, effect: '+15 Morale' },
    { id: 'team_outing', name: 'Team Outing', cost: 12000, type: 'consumable_emp', amount: 25, effect: '+25 Morale' },
    { id: 'team_retreat', name: 'Team Retreat', cost: 25000, type: 'consumable_emp', amount: 40, effect: '+40 Morale' },
    { id: 'company_party', name: 'Company Party', cost: 50000, type: 'consumable_emp', amount: 60, effect: '+60 Morale' },

    // Research grants
    { id: 'research_grant_s', name: 'Small Grant', cost: 10000, type: 'consumable_res', amount: 500, effect: '+500 Research' },
    { id: 'research_grant_m', name: 'Federal Grant', cost: 50000, type: 'consumable_res', amount: 2500, effect: '+2500 Research' },
    { id: 'research_grant_l', name: 'DARPA Contract', cost: 150000, type: 'consumable_res', amount: 8000, effect: '+8000 Research' },
    { id: 'research_grant_xl', name: 'Moonshot Fund', cost: 500000, type: 'consumable_res', amount: 30000, effect: '+30000 Research' },

    // Upgrades
    { id: 'server_opt', name: 'Server Optimization', cost: 50000, type: 'upgrade', effect: '+50% Research Gen' },
    { id: 'marketing_team', name: 'Marketing Firm', cost: 75000, type: 'upgrade', effect: 'Passive Hype +10/week' },
    { id: 'pr_agency', name: 'PR Agency', cost: 100000, type: 'upgrade', effect: '+25% Revenue' },
    { id: 'ai_accelerator', name: 'AI Accelerator Program', cost: 200000, type: 'upgrade', effect: '-25% Dev Time' },
    { id: 'legal_team', name: 'Elite Legal Team', cost: 500000, type: 'upgrade', effect: '-50% Lawsuit Risk' },
    { id: 'data_moat', name: 'Proprietary Data Moat', cost: 800000, type: 'upgrade', effect: '+20% Model Quality' },
    { id: 'talent_pipeline', name: 'PhD Talent Pipeline', cost: 350000, type: 'upgrade', effect: '+30% Research Gen' },
    { id: 'cloud_deal', name: 'Cloud Provider Deal', cost: 250000, type: 'upgrade', effect: '-20% Compute Costs' },
];

export const TRAITS = [
    { id: 'dreamer', name: 'Lucid Dreamer', multCost: 1.3, multTime: 1.4, desc: 'Can "dream" and hallucinate creative concepts. High unpredictability.' },
    { id: 'sentient', name: 'Emotional Core', multCost: 2.2, multTime: 2.0, desc: 'Simulates human emotions. Extremely engaging but controversial.' },
    { id: 'chaos', name: 'Chaos Engine', multCost: 1.5, multTime: 1.2, desc: 'Unpredictable outputs. Exciting but dangerous in production.' },
    { id: 'logic', name: 'Hyper-Logic', multCost: 1.8, multTime: 2.5, desc: 'Zero creativity, perfect reasoning. The ultimate analytical mind.' },
    { id: 'mimic', name: 'Persona Mimic', multCost: 1.4, multTime: 1.5, desc: 'Perfectly copies human personalities and voices.' },
    { id: 'empath', name: 'Empathy Engine', multCost: 1.9, multTime: 1.8, desc: 'Understands and responds to human emotions deeply.' },
    { id: 'efficient', name: 'Efficiency Core', multCost: 0.7, multTime: 0.8, desc: 'Smaller but faster. Great for edge deployment.' },
    { id: 'researcher', name: 'Research Mode', multCost: 2.5, multTime: 3.0, desc: 'Deep analytical thinking, citation generation, fact-checking.' },
];

export const CAPABILITIES = [
    { id: 'web_search', name: 'Web Search', cost: 15000, time: 2, quality: 15, desc: 'Internet access' },
    { id: 'multimodal', name: 'Vision', cost: 25000, time: 3, quality: 25, desc: 'Can see images' },
    { id: 'memory', name: 'Long-Term Memory', cost: 40000, time: 4, quality: 30, desc: 'Remembers conversations' },
    { id: 'audio_in', name: 'Audio Input', cost: 20000, time: 2, quality: 10, desc: 'Voice commands' },
    { id: 'code_interpreter', name: 'Code Execution', cost: 60000, time: 5, quality: 40, desc: 'Runs code locally' },
    { id: 'autonomy', name: 'Agent Mode', cost: 100000, time: 8, quality: 50, desc: 'Acts independently' },
    { id: 'realtime', name: 'Real-Time Mode', cost: 80000, time: 6, quality: 35, desc: 'Ultra-low latency responses' },
    { id: 'function_calling', name: 'Function Calling', cost: 35000, time: 3, quality: 20, desc: 'Can call external tools' },
];

export const RESEARCH = [
    // Hardware Unlocks
    { id: 'opt_algos', name: 'Optimized Algorithms', cost: 50, desc: '-1 Week Dev Time' },
    { id: 'h100_unlock', name: 'Hopper Architecture', cost: 100, desc: 'Unlock H100 variants' },
    { id: 'h200_unlock', name: 'H200 Access', cost: 200, desc: 'Unlock H200' },
    { id: 'grace_hopper', name: 'Grace Hopper Integration', cost: 350, desc: 'Unlock GH200 APU' },
    { id: 'blackwell_arch', name: 'Blackwell Architecture', cost: 500, desc: 'Unlock B100/B200/GB200' },
    { id: 'nvl72_unlock', name: 'NVL72 Supercomputer', cost: 2000, desc: 'Unlock GB200 NVL72' },
    { id: 'amd_arch', name: 'AMD CDNA Integration', cost: 200, desc: 'Unlock MI300 series' },
    { id: 'amd_next', name: 'AMD Next-Gen', cost: 400, desc: 'Unlock MI350/MI400' },
    { id: 'intel_ai', name: 'Intel AI Partnership', cost: 300, desc: 'Unlock Falcon Shores' },
    { id: 'tpu_access', name: 'TPU Access Program', cost: 400, desc: 'Unlock basic TPUs' },
    { id: 'tpu_opt', name: 'TPU Optimization', cost: 800, desc: 'Unlock TPU v5 variants' },
    { id: 'tpu_next', name: 'TPU Next-Gen', cost: 1500, desc: 'Unlock TPU v6 Trillium' },
    { id: 'tpu_pod', name: 'TPU Pod Access', cost: 5000, desc: 'Unlock full TPU Pods' },
    { id: 'aws_partnership', name: 'AWS Partnership', cost: 600, desc: 'Unlock Trainium2' },
    { id: 'wafer_scale', name: 'Wafer-Scale Computing', cost: 2500, desc: 'Unlock Cerebras WSE' },
    { id: 'dataflow_arch', name: 'Dataflow Architecture', cost: 1500, desc: 'Unlock SambaNova' },
    { id: 'lpu_arch', name: 'LPU Technology', cost: 1200, desc: 'Unlock Groq LPU' },
    { id: 'in_memory_compute', name: 'In-Memory Compute', cost: 1800, desc: 'Unlock D-Matrix' },
    { id: 'quantum_sim', name: 'Quantum Simulation', cost: 5000, desc: 'Unlock Quantum Simulator' },
    { id: 'quantum_real', name: 'Real Quantum Computing', cost: 20000, desc: 'Unlock Quantum Processor' },

    // Model Research
    { id: 'moe_arch', name: 'Mixture of Experts', cost: 800, desc: 'Unlock MoE architecture' },
    { id: 'long_context', name: 'Long Context Windows', cost: 600, desc: '10x context length' },
    { id: 'multimodal_fusion', name: 'Multimodal Fusion', cost: 1000, desc: 'Better cross-modal understanding' },
    { id: 'agi_theory', name: 'AGI Theory', cost: 20000, desc: 'Unlock AGI Development' },
];

export const LAWSUIT_EVENTS = [
    { source: 'random_scrape', plaintiff: 'Major News Corp', damages: 50000000, settlementChance: 0.6 },
    { source: 'social_scrape', plaintiff: 'Social Media Giant', damages: 100000000, settlementChance: 0.4 },
    { source: 'news_scrape', plaintiff: 'News Publishers Consortium', damages: 80000000, settlementChance: 0.5 },
    { source: 'book_piracy', plaintiff: 'Authors Guild', damages: 200000000, settlementChance: 0.2 },
    { source: 'reddit_public', plaintiff: 'Reddit Inc', damages: 30000000, settlementChance: 0.7 },
    { source: 'github_public', plaintiff: 'Open Source Foundation', damages: 20000000, settlementChance: 0.8 },
    { source: 'movie_subs', plaintiff: 'Movie Studios Association', damages: 60000000, settlementChance: 0.5 },
];

export const APP_ID = 'softworks-tycoon';
export const ADMIN_EMAIL = 'anymousxe.info@gmail.com';

// Initial leaderboard models for 2024 start - FICTIONAL NAMES, SMALL params for early 2024
export const INITIAL_LEADERBOARD_2024 = [
    { name: 'Nexus-4', company: 'NeuralPath', params: 175000000000, type: 'text', quality: 82, released: '2024-01', isOpenSource: false },
    { name: 'Atlas 2.1', company: 'SafeMind AI', params: 70000000000, type: 'text', quality: 75, released: '2024-01', isOpenSource: false },
    { name: 'Titan Pro', company: 'Cognex Labs', params: 140000000000, type: 'multimodal', quality: 78, released: '2024-01', isOpenSource: false },
    { name: 'Hydra 70B', company: 'Nexus AI', params: 70000000000, type: 'text', quality: 70, released: '2024-01', isOpenSource: true },
    { name: 'Breeze Large', company: 'WindAI', params: 56000000000, type: 'text', quality: 68, released: '2024-01', isOpenSource: false },
    { name: 'Spark-2', company: 'Axiom Systems', params: 2700000000, type: 'text', quality: 45, released: '2024-01', isOpenSource: true },
    { name: 'FluxDB Base', company: 'DataBridge', params: 32000000000, type: 'text', quality: 58, released: '2024-01', isOpenSource: true },
    { name: 'Phoenix 180B', company: 'DragonMind', params: 80000000000, type: 'text', quality: 65, released: '2024-01', isOpenSource: true },
    { name: 'Nimbus 72B', company: 'CloudPhoenix', params: 72000000000, type: 'text', quality: 62, released: '2024-01', isOpenSource: true },
    { name: 'Trench LLM 67B', company: 'AbyssAI', params: 67000000000, type: 'text', quality: 60, released: '2024-01', isOpenSource: true },
    { name: 'Synth R', company: 'Syntex', params: 35000000000, type: 'text', quality: 55, released: '2024-01', isOpenSource: false },
    { name: 'Nova 10.7B', company: 'Stellar AI', params: 10700000000, type: 'text', quality: 48, released: '2024-01', isOpenSource: true },
    { name: 'PixelMage v5.2', company: 'PixelMage', params: 8000000000, type: 'image', quality: 80, released: '2024-01', isOpenSource: false },
    { name: 'Canvas-3', company: 'NeuralPath', params: 12000000000, type: 'image', quality: 76, released: '2024-01', isOpenSource: false },
    { name: 'DreamForge XL', company: 'DreamForge', params: 6600000000, type: 'image', quality: 68, released: '2024-01', isOpenSource: true },
];

// Competitor AI release patterns - FICTIONAL NAMES
export const COMPETITOR_MODEL_TEMPLATES = [
    // NeuralPath releases (like OpenAI)
    { company: 'NeuralPath', prefix: 'Nexus', versions: ['4.5', '5', '5.5', '6'], variants: ['', 'o', 'o1', 'o3'], baseParams: 200000000000, growthRate: 1.3, silentChance: 0.05 },
    { company: 'NeuralPath', prefix: 'Canvas', versions: ['4', '5'], variants: ['', 'Pro'], baseParams: 15000000000, growthRate: 1.5, silentChance: 0.02, type: 'image' },
    { company: 'NeuralPath', prefix: 'Motion', versions: ['1', '2', '3'], variants: ['', 'Pro', 'Ultra'], baseParams: 50000000000, growthRate: 2.0, silentChance: 0.1, type: 'video' },

    // SafeMind AI releases (like Anthropic)
    { company: 'SafeMind AI', prefix: 'Atlas', versions: ['3', '3.5', '4', '4.5', '5'], variants: ['Swift', 'Core', 'Prime'], baseParams: 100000000000, growthRate: 1.4, silentChance: 0.08 },

    // Cognex Labs releases (like Google)
    { company: 'Cognex Labs', prefix: 'Titan', versions: ['1.5', '2', '2.5', '3'], variants: ['Flash', 'Pro', 'Ultra'], baseParams: 180000000000, growthRate: 1.5, silentChance: 0.1 },
    { company: 'Cognex Labs', prefix: 'AlphaScript', versions: ['2', '3'], variants: ['', 'Pro'], baseParams: 100000000000, growthRate: 1.6, silentChance: 0.15 },
    { company: 'Cognex Labs', prefix: 'VisionGen', versions: ['3', '4'], variants: ['', 'Video'], baseParams: 20000000000, growthRate: 1.8, silentChance: 0.05, type: 'image' },

    // Nexus AI releases (like Meta - open source)
    { company: 'Nexus AI', prefix: 'Hydra', versions: ['3', '3.1', '4', '5'], variants: ['8B', '70B', '405B', '1T'], baseParams: 70000000000, growthRate: 1.3, silentChance: 0.03, isOpenSource: true },

    // Stellar AI releases (like xAI)
    { company: 'Stellar AI', prefix: 'Nova', versions: ['2', '3', '4'], variants: ['', 'Pro', 'Vision'], baseParams: 120000000000, growthRate: 1.5, silentChance: 0.12 },

    // WindAI releases (like Mistral - open)
    { company: 'WindAI', prefix: 'Breeze', versions: ['Large', 'Next', 'Ultra'], variants: ['', 'Plus'], baseParams: 80000000000, growthRate: 1.4, silentChance: 0.05, isOpenSource: true },

    // Eastern companies
    { company: 'AbyssAI', prefix: 'Trench', versions: ['V2', 'V3', 'R1'], variants: ['', 'Coder', 'MoE'], baseParams: 100000000000, growthRate: 1.6, silentChance: 0.2, isOpenSource: true },
    { company: 'CloudPhoenix', prefix: 'Nimbus', versions: ['2', '2.5', '3'], variants: ['', 'Plus', 'Max'], baseParams: 80000000000, growthRate: 1.4, silentChance: 0.08, isOpenSource: true },
    { company: 'DragonMind', prefix: 'Phoenix', versions: ['4.0', '5.0', 'X'], variants: ['', 'Turbo', 'Ultra'], baseParams: 100000000000, growthRate: 1.3, silentChance: 0.15 },

    // Others
    { company: 'Syntex', prefix: 'Synth', versions: ['R', 'R+', 'X'], variants: ['', 'Turbo'], baseParams: 50000000000, growthRate: 1.3, silentChance: 0.02 },
    { company: 'DreamForge', prefix: 'DreamForge', versions: ['3', '4', '5'], variants: ['', 'Ultra'], baseParams: 12000000000, growthRate: 1.8, silentChance: 0.05, type: 'image', isOpenSource: true },
    { company: 'PixelMage', prefix: 'PixelMage', versions: ['v6', 'v7', 'v8'], variants: ['', 'Pro'], baseParams: 15000000000, growthRate: 1.6, silentChance: 0.08, type: 'image' },
];

// Employee types with salaries and bonuses
export const EMPLOYEES = [
    // Engineering
    { id: 'ml_engineer', name: 'ML Engineer', salary: 15000, qualityBonus: 2, speedBonus: 0, category: 'engineering' },
    { id: 'sr_ml_engineer', name: 'Senior ML Engineer', salary: 30000, qualityBonus: 5, speedBonus: 1, category: 'engineering' },
    { id: 'principal_ml', name: 'Principal ML Scientist', salary: 55000, qualityBonus: 10, speedBonus: 2, category: 'engineering' },
    { id: 'research_scientist', name: 'Research Scientist', salary: 40000, qualityBonus: 8, speedBonus: 0, researchBonus: 5, category: 'engineering' },
    { id: 'data_engineer', name: 'Data Engineer', salary: 12000, qualityBonus: 1, dataBonus: 10, category: 'engineering' },
    { id: 'platform_engineer', name: 'Platform Engineer', salary: 14000, computeBonus: 5, upkeepReduction: 0.05, category: 'engineering' },
    { id: 'security_engineer', name: 'Security Engineer', salary: 16000, securityBonus: 15, category: 'engineering' },

    // Business
    { id: 'sales_rep', name: 'Sales Representative', salary: 8000, revenueBonus: 0.03, category: 'business' },
    { id: 'account_exec', name: 'Account Executive', salary: 12000, revenueBonus: 0.06, dealBonus: 10, category: 'business' },
    { id: 'enterprise_sales', name: 'Enterprise Sales Manager', salary: 25000, revenueBonus: 0.1, dealBonus: 25, category: 'business' },
    { id: 'marketing_mgr', name: 'Marketing Manager', salary: 10000, hypeBonus: 5, category: 'business' },
    { id: 'pr_specialist', name: 'PR Specialist', salary: 8000, hypeBonus: 3, lawsuitDefense: 5, category: 'business' },

    // Legal
    { id: 'legal_counsel', name: 'Legal Counsel', salary: 20000, lawsuitDefense: 20, category: 'legal' },
    { id: 'ip_lawyer', name: 'IP Lawyer', salary: 25000, lawsuitDefense: 30, dataRiskReduction: 10, category: 'legal' },
    { id: 'compliance_officer', name: 'Compliance Officer', salary: 18000, lawsuitDefense: 15, regulatoryBonus: 20, category: 'legal' },

    // Leadership
    { id: 'vp_engineering', name: 'VP of Engineering', salary: 50000, qualityBonus: 15, speedBonus: 5, category: 'leadership' },
    { id: 'vp_research', name: 'VP of Research', salary: 60000, researchBonus: 20, qualityBonus: 10, category: 'leadership' },
    { id: 'cto', name: 'CTO', salary: 80000, qualityBonus: 20, speedBonus: 10, computeBonus: 10, category: 'leadership' },
    { id: 'ceo', name: 'CEO', salary: 100000, allBonus: 5, hypeBonus: 15, category: 'leadership' },
];

// Ad campaign options
export const AD_CAMPAIGNS = [
    // Social Media
    { id: 'twitter_ads', name: 'Twitter/X Ads', costPerWeek: 5000, hypeBonus: 3, reachMultiplier: 1.0, category: 'social' },
    { id: 'linkedin_ads', name: 'LinkedIn Ads', costPerWeek: 8000, hypeBonus: 2, enterpriseBonus: 10, category: 'social' },
    { id: 'youtube_sponsor', name: 'YouTube Sponsorship', costPerWeek: 15000, hypeBonus: 8, category: 'social' },
    { id: 'reddit_ads', name: 'Reddit Ads', costPerWeek: 3000, hypeBonus: 2, devReach: 5, category: 'social' },

    // Tech Press
    { id: 'techcrunch_feature', name: 'TechCrunch Feature', costPerWeek: 25000, hypeBonus: 15, duration: 1, category: 'press' },
    { id: 'wired_article', name: 'Wired Article', costPerWeek: 30000, hypeBonus: 12, duration: 1, category: 'press' },
    { id: 'verge_coverage', name: 'The Verge Coverage', costPerWeek: 20000, hypeBonus: 10, category: 'press' },
    { id: 'hacker_news', name: 'Hacker News Campaign', costPerWeek: 5000, hypeBonus: 5, devReach: 15, category: 'press' },

    // Events
    { id: 'conference_booth', name: 'AI Conference Booth', costPerWeek: 50000, hypeBonus: 20, enterpriseBonus: 30, duration: 1, category: 'events' },
    { id: 'keynote_speech', name: 'Keynote Speech', costPerWeek: 100000, hypeBonus: 40, duration: 1, category: 'events' },
    { id: 'hackathon_sponsor', name: 'Hackathon Sponsor', costPerWeek: 25000, hypeBonus: 10, devReach: 25, category: 'events' },

    // Influencers
    { id: 'tech_youtuber', name: 'Tech YouTuber Review', costPerWeek: 35000, hypeBonus: 18, duration: 1, category: 'influencer' },
    { id: 'ai_researcher_endorsement', name: 'AI Researcher Endorsement', costPerWeek: 75000, hypeBonus: 25, qualityPerception: 10, duration: 1, category: 'influencer' },

    // Mass Media
    { id: 'tv_ad', name: 'TV Advertisement', costPerWeek: 200000, hypeBonus: 30, massReach: 50, category: 'mass' },
    { id: 'times_square', name: 'Times Square Billboard', costPerWeek: 150000, hypeBonus: 25, massReach: 40, category: 'mass' },
    { id: 'super_bowl', name: 'Super Bowl Ad', costPerWeek: 5000000, hypeBonus: 200, massReach: 500, duration: 1, category: 'mass' },
];

// API pricing presets
export const API_PRICING_PRESETS = [
    { id: 'free_tier', name: 'Free Tier', inputCost: 0, outputCost: 0, rateLimit: 10, desc: 'Great for devs, no revenue' },
    { id: 'budget', name: 'Budget', inputCost: 0.15, outputCost: 0.60, rateLimit: 60, desc: 'Cheap option for startups' },
    { id: 'standard', name: 'Standard', inputCost: 0.50, outputCost: 1.50, rateLimit: 500, desc: 'Standard pricing' },
    { id: 'premium', name: 'Premium', inputCost: 2.50, outputCost: 10.00, rateLimit: 1000, desc: 'Higher margin, less volume' },
    { id: 'enterprise', name: 'Enterprise', inputCost: 5.00, outputCost: 15.00, rateLimit: 10000, desc: 'For big companies' },
    { id: 'openai_style', name: 'OpenAI-style', inputCost: 2.50, outputCost: 10.00, rateLimit: 3000, desc: 'Similar to GPT-4 pricing' },
    { id: 'anthropic_style', name: 'Anthropic-style', inputCost: 3.00, outputCost: 15.00, rateLimit: 4000, desc: 'Similar to Claude pricing' },
    { id: 'cheap_volume', name: 'Volume Leader', inputCost: 0.10, outputCost: 0.30, rateLimit: 5000, desc: 'Low price, high volume' },
];

// Parameters for open source releases - realistic limits
export const OPEN_SOURCE_LIMITS = {
    maxReasonableParams: 20000000000, // 20B max for consumer hardware
    maxEnterpriseParams: 405000000000, // 405B for enterprise open source (like Llama 3.1)
    adoptionBySize: [
        { maxParams: 7000000000, adoption: 1.5, desc: 'Runs on any GPU' },
        { maxParams: 13000000000, adoption: 1.3, desc: 'Runs on gaming GPUs' },
        { maxParams: 34000000000, adoption: 1.0, desc: 'Needs pro hardware' },
        { maxParams: 70000000000, adoption: 0.7, desc: 'Datacenter only' },
        { maxParams: 405000000000, adoption: 0.3, desc: 'Few can run this' },
        { maxParams: Infinity, adoption: 0.05, desc: 'Research only' },
    ]
};

// Week-by-week competitor release chances
export const COMPETITOR_RELEASE_CHANCES = {
    normalWeek: 0.08, // 8% chance any given week
    afterPlayerRelease: 0.25, // 25% chance after player releases something big
    quarterEnd: 0.35, // 35% chance end of quarter (weeks 12, 24, 36, 48)
    silentBreakthrough: 0.02, // 2% chance of silent company breakthrough
};

// Quality decay settings - your model quality drops when better models release
export const QUALITY_DECAY = {
    perBetterModel: 2, // Lose 2 quality when a better model releases
    maxDecayPerWeek: 10, // Can't lose more than 10 quality per week
    minimumQuality: 10, // Quality can't drop below 10
};
