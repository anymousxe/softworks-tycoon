// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU",
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

try { firebase.initializeApp(firebaseConfig); } catch (e) { console.error("Firebase Init Error:", e); }
const auth = firebase.auth();
const db = firebase.firestore();

// Global State
let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveInterval = null;
let realtimeUnsubscribe = null;

const APP_ID = 'softworks-tycoon';

// --- DATA POOLS ---
const HARDWARE = [
    { id: 'gtx_cluster', name: 'Consumer GPU Cluster', cost: 2000, compute: 2, upkeep: 50 },
    { id: 'rtx_4090_farm', name: 'RTX 4090 Farm', cost: 5500, compute: 6, upkeep: 120 },
    { id: 'a100', name: 'A100 Rack', cost: 8000, compute: 8, upkeep: 150 },
    { id: 'v100_legacy', name: 'V100 Legacy Rack', cost: 12000, compute: 12, upkeep: 200 },
    { id: 'h100', name: 'H100 Cluster', cost: 15000, compute: 15, upkeep: 250 },
    { id: 'h200', name: 'Nvidia H200', cost: 35000, compute: 40, upkeep: 500, reqTech: 'h200_unlock' },
    { id: 'gh200_super', name: 'GH200 Superchip', cost: 48000, compute: 60, upkeep: 650, reqTech: 'blackwell_arch' },
    { id: 'b200', name: 'Blackwell B200', cost: 60000, compute: 75, upkeep: 800, reqTech: 'blackwell_arch' },
    { id: 'dojo', name: 'Dojo Supercomputer', cost: 120000, compute: 150, upkeep: 1200 },
    { id: 'tpu_pod', name: 'Google TPU Pod', cost: 250000, compute: 350, upkeep: 2500, reqTech: 'tpu_opt' },
    { id: 'cerebras', name: 'Wafer Scale Engine', cost: 500000, compute: 800, upkeep: 4000, reqTech: 'wafer_scale' },
    { id: 'quantum', name: 'Q-Bit Array', cost: 1500000, compute: 3000, upkeep: 10000, reqTech: 'quantum_tech' },
    { id: 'neural_link', name: 'Bio-Neural Hive', cost: 5000000, compute: 10000, upkeep: 25000, reqTech: 'bio_computing' }
];

const RESEARCH = [
    { id: 'opt_algos', name: 'Optimized Algos', cost: 50, desc: '-1 Week Dev Time' },
    { id: 'h200_unlock', name: 'H200 Hardware', cost: 150, desc: 'Unlock H200 Chips' },
    { id: 'blackwell_arch', name: 'Blackwell Arch', cost: 300, desc: 'Unlock B200/GH200' },
    { id: 'tpu_opt', name: 'TPU Optimization', cost: 600, desc: 'Unlock TPU Pods' },
    { id: 'agi_theory', name: 'AGI Theory', cost: 1000, desc: 'Unlock Conscious AI Product' },
    { id: 'wafer_scale', name: 'Wafer Scale', cost: 2000, desc: 'Unlock Cerebras WSE' },
    { id: 'quantum_tech', name: 'Quantum Supremacy', cost: 5000, desc: 'Unlock Quantum Servers' },
    { id: 'bio_computing', name: 'Bio-Computing', cost: 10000, desc: 'Unlock Neural Hive' }
];

const PRODUCTS = [
    { id: 'text', name: 'LLM', cost: 50000, time: 4, compute: 10, specs: ['Chatbot', 'Coding', 'Writing'] },
    { id: 'image', name: 'Image Gen', cost: 80000, time: 6, compute: 20, specs: ['Realistic', 'Anime', 'Logo'] },
    { id: 'audio', name: 'Audio Model', cost: 60000, time: 5, compute: 15, specs: ['Music', 'Voice', 'SFX'] },
    { id: 'video', name: 'Video Gen', cost: 150000, time: 8, compute: 50, specs: ['Deepfake', 'Cinema', 'VFX'] },
    { id: 'game_ai', name: 'NPC Brain', cost: 200000, time: 10, compute: 80, specs: ['Gaming', 'Simulation', 'VR'] },
    { id: 'robotics', name: 'Robot OS', cost: 300000, time: 12, compute: 120, specs: ['Industrial', 'Home', 'Military'] },
    { id: 'agi', name: 'Conscious AI', cost: 5000000, time: 24, compute: 2000, specs: ['Sentience'], reqTech: 'agi_theory' }
];

const RIVALS = [
    { name: 'OpenAI (Real)', strength: 95, releases: ['GPT-5', 'Sora 2', 'Omni-Brain'], color: 'text-green-400' },
    { name: 'Anthropic', strength: 85, releases: ['Claude 4', 'Claude Opus X'], color: 'text-yellow-400' },
    { name: 'Google DeepMind', strength: 90, releases: ['Gemini Ultra 2', 'AlphaCode 3'], color: 'text-blue-400' },
    { name: 'Meta AI', strength: 80, releases: ['Llama 4', 'MetaVerse Brain'], color: 'text-blue-300' },
    { name: 'X.AI', strength: 75, releases: ['Grok 3', 'TruthGPT'], color: 'text-slate-200' },
    { name: 'Stability', strength: 70, releases: ['Stable Video 4', 'Diffusion XL'], color: 'text-purple-400' }
];

const COMPANIES = [
    { name: 'Indie Devs', budget: 500 }, { name: 'Startup Inc', budget: 1500 },
    { name: 'Facebooc', budget: 3000 }, { name: 'StreamFlix', budget: 4000 },
    { name: 'Microhard', budget: 5000 }, { name: 'Joggle', budget: 6000 },
    { name: 'Amacon', budget: 7000 }, { name: 'NvidiaX', budget: 8000 },
    { name: 'Tessla', budget: 9000 }, { name: 'Fruit Co', budget: 10000 },
    { name: 'OpenAI (Real)', budget: 12000 }, { name: 'Wall Street', budget: 15000 },
    { name: 'SpaceY', budget: 18000 }, { name: 'Pentagon', budget: 25000 },
    { name: 'Global Gov', budget: 50000 }
];

const AD_CAMPAIGNS = [
    { id: 'social_ads', name: 'Social Media Blast', cost: 2000, hype: 15, duration: 2 },
    { id: 'influencer', name: 'Influencer Shoutout', cost: 15000, hype: 40, duration: 4 },
    { id: 'billboard', name: 'Times Square Billboard', cost: 50000, hype: 80, duration: 8 },
    { id: 'superbowl', name: 'Super Bowl Commercial', cost: 5000000, hype: 200, duration: 12 }
];

const SHOP_ITEMS = [
    { id: 'data_s', name: 'Data Set (Small)', cost: 5000, effect: 'Research +100', type: 'consumable', amount: 100 },
    { id: 'data_m', name: 'Data Set (Medium)', cost: 15000, effect: 'Research +350', type: 'consumable', amount: 350 },
    { id: 'data_l', name: 'Data Set (Large)', cost: 40000, effect: 'Research +1000', type: 'consumable', amount: 1000 },
    { id: 'consultant', name: 'AI Consultant', cost: 10000, effect: 'Dev Speed Boost (Instant)', type: 'consumable', amount: 0 },
    { id: 'coffee', name: 'Espresso Machine', cost: 2000, effect: 'Permanent Morale Boost', type: 'permanent' },
    { id: 'neon', name: 'Neon Office Lights', cost: 5000, effect: 'Permanent Vibe Boost', type: 'permanent' }
];

const FALLBACK_REVIEWS = {
    good: ["Literally cracked. 🔥", "Best AI I've used.", "W release.", "Game changer fr.", "Take my money 💰"],
    mid: ["It's mid but okay.", "Does the job i guess.", "Waiting for updates.", "Kinda buggy."],
    bad: ["Bro what is this? 💀", "Refunded.", "Laggier than my grandma's PC.", "This ain't it chief."]
};

// --- AI CONFIG (Client-side usage is disabled) ---
const AI_CONFIG = {
    msgLimit: 0, // Disabled
    windowMinutes: 0, 
    storageKeyTimestamps: 'softworks_ai_timestamps_v5', 
};

// --- AUTH & SETUP ---
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        
        const name = user.displayName || (user.isAnonymous ? 'Guest Agent' : 'User');
        const photo = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-email').textContent = user.email || 'ID: ' + user.uid.slice(0,8);
        document.getElementById('user-photo').src = photo;

        loadSaves();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('menu-screen').classList.add('hidden');
    }
});

document.getElementById('btn-login-google').addEventListener('click', () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => alert(e.message));
});
document.getElementById('btn-login-guest').addEventListener('click', () => {
    auth.signInAnonymously().catch(e => alert(e.message));
});
document.getElementById('btn-logout').addEventListener('click', () => {
    auth.signOut().then(() => location.reload());
});

// --- SAVE SYSTEM ---
function loadSaves() {
    const savesRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves');
    savesRef.onSnapshot(snapshot => {
        const container = document.getElementById('save-slots');
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.className = 'glass-panel p-8 rounded-2xl cursor-pointer hover:border-cyan-500 transition-all group relative hover:-translate-y-1';
            el.innerHTML = `
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">${data.companyName}</h3>
                        <div class="mt-2 inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${data.isSandbox ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-400'}">
                            ${data.isSandbox ? 'Sandbox Mode' : 'Career Mode'}
                        </div>
                    </div>
                    <button class="text-slate-600 hover:text-red-500 delete-btn p-2" data-id="${doc.id}"><i data-lucide="trash-2"></i></button>
                </div>
                <div class="flex justify-between text-sm font-mono text-slate-500 border-t border-slate-700/50 pt-4">
                    <div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> W${data.week} Y${data.year}</div>
                    <div class="text-green-400 font-bold">$${data.cash.toLocaleString()}</div>
                </div>
            `;
            el.addEventListener('click', (e) => { if(!e.target.closest('.delete-btn')) startGame(doc.id, data); });
            el.querySelector('.delete-btn').addEventListener('click', (e) => { 
                e.stopPropagation(); 
                if(confirm('Delete save?')) savesRef.doc(doc.id).delete(); 
            });
            container.appendChild(el);
        });
        lucide.createIcons();
        if(snapshot.size < 6) {
            const btn = document.createElement('button');
            btn.className = 'border-2 border-dashed border-slate-800 text-slate-600 p-8 rounded-2xl hover:text-cyan-400 hover:border-cyan-500 hover:bg-slate-900/50 transition flex flex-col items-center justify-center gap-3 min-h-[200px] group';
            btn.innerHTML = `<i data-lucide="plus" class="w-10 h-10 group-hover:scale-110 transition-transform"></i><span class="font-bold tracking-widest">NEW SAVE</span>`;
            btn.onclick = () => document.getElementById('create-screen').classList.remove('hidden');
            container.appendChild(btn);
            lucide.createIcons();
        }
    });
}

let isSandbox = false;
document.getElementById('btn-toggle-sandbox').addEventListener('click', () => {
    isSandbox = !isSandbox;
    const div = document.getElementById('btn-toggle-sandbox');
    div.classList.toggle('border-yellow-500', isSandbox);
    div.classList.toggle('bg-yellow-500/10', isSandbox);
});

document.getElementById('btn-confirm-create').addEventListener('click', async () => {
    const name = document.getElementById('inp-comp-name').value;
    if(!name) return;
    const newSave = {
        companyName: name, 
        isSandbox, 
        cash: isSandbox ? 100000000 : 25000,
        week: 1, year: 2025, 
        researchPts: isSandbox ? 5000 : 0, 
        reputation: 0,
        hardware: [], 
        products: [], 
        reviews: [], 
        unlockedTechs: [], 
        purchasedItems: [], 
        chatHistory: [], // Keeping this field, but functionality is disabled
        tutorialStep: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').add(newSave);
    document.getElementById('create-screen').classList.add('hidden');
});

document.getElementById('btn-cancel-create').addEventListener('click', () => document.getElementById('create-screen').classList.add('hidden'));

// --- GAME LOGIC ---
function startGame(id, data) {
    activeSaveId = id;
    gameState = data;
    
    // Safety checks for new features on old saves
    if(!gameState.reviews) gameState.reviews = [];
    if(!gameState.purchasedItems) gameState.purchasedItems = [];
    if(!gameState.chatHistory) gameState.chatHistory = []; 
    if(gameState.tutorialStep === undefined) gameState.tutorialStep = 99; 
    
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    setupRealtimeListener(id);
    updateHUD();
    renderTab('dash');
    
    // AI Chat is disabled, so we don't need loadChatHistory or updateLimitDisplay calls here
    lucide.createIcons();
    
    setTimeout(() => runTutorial(gameState.tutorialStep), 1000);

    // CHANGELOG CHECK - Fixed to actually trigger
    if (!localStorage.getItem('patch_notes_v2.1_seen')) {
        document.getElementById('changelog-modal').classList.remove('hidden');
    }

    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

document.getElementById('btn-close-changelog').addEventListener('click', () => {
    document.getElementById('changelog-modal').classList.add('hidden');
    localStorage.setItem('patch_notes_v2.1_seen', 'true');
});

// --- TUTORIAL & SETTINGS ---
function runTutorial(step) {
    const overlay = document.getElementById('tutorial-overlay');
    
    if(step >= 99) { 
        overlay.classList.add('hidden'); 
        return; 
    }
    
    overlay.classList.remove('hidden'); 
    document.getElementById('tutorial-highlight').style.opacity = '1';
    const box = document.getElementById('tutorial-text');
    const btnNext = document.getElementById('btn-next-tutorial');
    
    btnNext.style.display = 'block';

    if(step === 0) { 
        positionHighlight(null); 
        box.textContent = "Welcome, CEO. Guidance system active. First, we need compute."; 
        btnNext.onclick = () => { gameState.tutorialStep = 1; runTutorial(1); saveGame(); }; 
    }
    else if(step === 1) { 
        positionHighlight(document.getElementById('nav-market')); 
        box.textContent = "Navigate to the MARKET tab."; 
        btnNext.style.display = 'none'; 
    }
    else if(step === 2) { 
        setTimeout(() => { 
            positionHighlight(document.querySelector('#server-grid button')); 
            box.textContent = "Buy a GPU Cluster."; 
        }, 500); 
    }
    else if(step === 3) { 
        positionHighlight(document.getElementById('nav-dev')); 
        box.textContent = "Go to CREATE tab."; 
    }
    else if(step === 4) { 
        positionHighlight(document.getElementById('btn-toggle-chat-sidebar')); 
        box.textContent = "AI Chat is offline. Check the dashboard next week!"; 
        // We stop the tutorial here, as the next step was AI chat interaction
        gameState.tutorialStep = 99; 
        saveGame();
        document.getElementById('tutorial-overlay').classList.add('hidden'); 
    }
}

function positionHighlight(el) {
    const h = document.getElementById('tutorial-highlight');
    if(!el) { h.style.opacity = '0'; return; }
    const r = el.getBoundingClientRect();
    h.style.top = `${r.top-5}px`; 
    h.style.left = `${r.left-5}px`; 
    h.style.width = `${r.width+10}px`; 
    h.style.height = `${r.height+10}px`;
    h.style.animation = 'pulse-ring 2s infinite';
}

// Event handlers for skipping and restarting tutorial
document.getElementById('btn-cancel-skip').addEventListener('click', () => { document.getElementById('skip-modal').classList.add('hidden'); });
document.getElementById('btn-confirm-skip').addEventListener('click', () => { 
    gameState.tutorialStep = 99; 
    saveGame();
    document.getElementById('tutorial-overlay').classList.add('hidden');
    document.getElementById('skip-modal').classList.add('hidden');
    showToast('Tutorial Skipped', 'info');
});

// Event handlers for settings modal
document.getElementById('btn-settings').addEventListener('click', () => document.getElementById('settings-modal').classList.remove('hidden'));
document.getElementById('btn-close-settings').addEventListener('click', () => document.getElementById('settings-modal').classList.add('hidden'));
document.getElementById('btn-restart-tutorial').addEventListener('click', () => { 
    document.getElementById('settings-modal').classList.add('hidden');
    gameState.tutorialStep = 0; 
    saveGame();
    runTutorial(0);
});

// --- CORE GAME LOOP ---
document.getElementById('btn-next-week').addEventListener('click', () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true; 
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`; 
    lucide.createIcons();
    
    setTimeout(() => {
        gameState.week++;
        if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

        // Rivals Logic
        if(Math.random() > 0.85) { 
            const rival = RIVALS[Math.floor(Math.random() * RIVALS.length)];
            const release = rival.releases[Math.floor(Math.random() * rival.releases.length)];
            showToast(`COMPETITOR ALERT: ${rival.name} released ${release}!`, 'error');
            gameState.products.filter(p => p.released).forEach(p => { 
                p.hype = Math.max(0, p.hype - 10); 
                p.quality = Math.max(0, p.quality - 2); 
            });
        }

        // Upkeep & Research
        const upkeep = gameState.hardware.reduce((sum, hw) => sum + (HARDWARE.find(x => x.id === hw.typeId).upkeep * hw.count), 0);
        gameState.cash -= upkeep;
        gameState.researchPts += Math.floor(gameState.reputation / 5) + Math.floor(getCompute() * 0.05) + 5;

        // Product Logic
        gameState.products.forEach(p => {
            if((!p.released || p.isUpdating) && p.weeksLeft > 0) {
                p.weeksLeft--;
                if(p.weeksLeft <= 0) {
                    p.isUpdating = false;
                    if(p.updateType) {
                        const major = p.updateType === 'major';
                        p.version = parseFloat((p.version + (major ? 1.0 : 0.1)).toFixed(1));
                        p.quality = Math.min(100, p.quality + (major ? 15 : 5));
                        p.hype = 100;
                        showToast(`${p.name} updated to v${p.version}!`, 'success');
                        p.updateType = null;
                    } else {
                        p.released = true;
                        const bonus = p.researchBonus || 0;
                        const baseQ = Math.floor(Math.random() * 40) + 50;
                        
                        // Edition Bonus
                        const editionMult = p.edition === 'pro' ? 1.2 : (p.edition === 'lite' ? 0.8 : 1.0);
                        p.quality = Math.min(100, Math.floor((baseQ + bonus) * editionMult));
                        p.version = 1.0;
                        p.hype = 100 * (p.edition === 'pro' ? 1.5 : 1);
                        gameState.reputation += 10;
                        
                        showToast(`🚀 ${p.name} (${p.edition}) Launched!`, 'success');
                        generateFallbackReview(p); // Use local fallback review
                    }
                }
            }
            if(p.released && !p.isUpdating) {
                let weeklyRev = 0;
                const organicUsers = Math.floor((p.quality * p.hype * 10));
                weeklyRev += Math.floor(organicUsers * 0.1); 
                p.contracts.forEach(cName => {
                    const comp = COMPANIES.find(c => c.name === cName);
                    if(comp) weeklyRev += Math.floor(comp.budget * (p.quality / 100));
                });
                p.hype = Math.max(0, p.hype - 2);
                if(p.isOpenSource) { 
                    if(p.hype > 0) gameState.reputation += 0.5; 
                } else { 
                    gameState.cash += weeklyRev; 
                    p.revenue += weeklyRev; 
                }
                if(Math.random() > 0.98) generateFallbackReview(p); // Use local fallback review
            }
        });

        if(gameState.week % 4 === 0) {
            COMPANIES.forEach(c => c.budget = Math.max(500, c.budget + (Math.floor(Math.random()*200)-100)));
        }

        saveGame();
        renderTab(document.querySelector('.nav-btn.active')?.dataset.tab || 'dash');
        
        btn.disabled = false; 
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-current"></i> Next`; 
        lucide.createIcons();
    }, 400); 
});

// --- RENDER TABS ---
function renderTab(tab) {
    const content = document.getElementById('content-area');
    content.innerHTML = ''; 
    content.className = 'animate-in';

    if(tab === 'dash') {
        const liveProducts = gameState.products.filter(p => p.released).length;
        const rev = gameState.products.reduce((acc, p) => acc + (p.revenue||0), 0);
        
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live Products</div>
                    <div class="text-4xl font-black text-white mt-2">${liveProducts}</div>
                </div>
                <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lifetime Revenue</div>
                    <div class="text-4xl font-black text-green-400 mt-2">$${rev.toLocaleString()}</div>
                </div>
                <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reputation</div>
                    <div class="text-4xl font-black text-purple-400 mt-2">${Math.floor(gameState.reputation)}</div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="product-list"></div>
        `;

        const list = document.getElementById('product-list');
        gameState.products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'glass-panel p-6 relative group hover:border-cyan-500/50 transition-all rounded-2xl overflow-hidden';
            
            // Badge Logic
            const badgeColor = p.edition === 'pro' ? 'bg-purple-500' : (p.edition === 'lite' ? 'bg-green-500' : 'bg-cyan-500');
            const editionLabel = p.edition ? p.edition.toUpperCase() : 'STD';
            card.innerHTML += `<div class="absolute top-0 right-0 ${badgeColor} text-black text-[9px] font-black px-3 py-1 rounded-bl-xl tracking-widest">${editionLabel}</div>`;

            if(p.released && !p.isUpdating) {
                card.innerHTML += `
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-2xl font-bold text-white tracking-tight">${p.name} <span class="text-cyan-500 text-sm font-mono">v${p.version}</span></h3>
                            <div class="text-xs text-slate-500 font-bold mt-1 bg-slate-800 inline-block px-2 py-0.5 rounded">${p.type.toUpperCase()}</div>
                        </div>
                        <div class="text-right mt-2">
                            <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Weekly Rev</div>
                            <div class="text-green-400 font-mono font-bold">$${p.isOpenSource ? 0 : Math.floor((p.revenue * 0.01) + (Math.random()*500)).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-black/40 p-3 rounded-xl border border-white/5"><div class="text-[9px] text-slate-500 uppercase font-bold">Quality</div><div class="${p.quality > 80 ? 'text-green-400' : 'text-yellow-400'} font-black text-xl">${p.quality}</div></div>
                        <div class="bg-black/40 p-3 rounded-xl border border-white/5"><div class="text-[9px] text-slate-500 uppercase font-bold">Hype</div><div class="text-purple-400 font-black text-xl">${p.hype}%</div></div>
                    </div>
                    <div class="flex gap-3">
                        <button class="bg-slate-800 text-white px-4 py-3 text-[10px] font-bold flex-1 hover:bg-slate-700 btn-patch rounded-xl tracking-wider transition-colors" data-id="${p.id}">PATCH</button>
                        <button class="bg-white text-black px-4 py-3 text-[10px] font-bold flex-1 hover:bg-cyan-400 btn-major rounded-xl tracking-wider transition-colors" data-id="${p.id}">MAJOR</button>
                        <button class="text-slate-500 hover:text-red-500 hover:bg-red-900/10 px-3 btn-delete rounded-xl transition-colors" data-id="${p.id}"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                    </div>
                `;
                card.querySelector('.btn-patch').onclick = () => startUpdate(p.id, 'minor');
                card.querySelector('.btn-major').onclick = () => startUpdate(p.id, 'major');
                card.querySelector('.btn-delete').onclick = () => { if(confirm("Discontinue?")) { gameState.products = gameState.products.filter(x => x.id !== p.id); renderTab('dash'); } };
            } else {
                card.innerHTML += `<div class="flex justify-between items-center mb-3"><h3 class="font-bold text-white text-lg">${p.name}</h3><span class="text-xs font-mono text-cyan-500 bg-cyan-900/20 px-2 py-1 rounded">${p.weeksLeft}w LEFT</span></div><div class="text-slate-500 text-xs font-mono mb-3 uppercase tracking-wider">${p.isUpdating ? 'Developing Update...' : 'Training Model...'}</div><div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="h-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]" style="width: ${((p.isUpdating ? 6-p.weeksLeft : 4-p.weeksLeft)/6)*100}%"></div></div>`;
            }
            list.appendChild(card);
        });
        lucide.createIcons();
    }

    if(tab === 'dev') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">NEW PROJECT</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" id="dev-types"></div>
                <div class="glass-panel p-8 rounded-2xl h-fit border-l-4 border-cyan-500">
                    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">Codename</label>
                    <input id="new-proj-name" class="w-full bg-black/50 border border-slate-700 p-4 text-white mb-6 rounded-xl focus:border-cyan-500 outline-none font-bold" placeholder="e.g. Skynet v1">
                    
                    <div class="mb-4">
                        <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">Edition</label>
                        <div class="grid grid-cols-3 gap-2">
                            <button class="edition-btn p-2 rounded-lg border border-slate-700 text-xs font-bold text-slate-400 hover:border-green-500 hover:text-green-400" data-ed="lite">Lite</button>
                            <button class="edition-btn p-2 rounded-lg border border-cyan-500 bg-cyan-900/20 text-xs font-bold text-white" data-ed="std">Std</button>
                            <button class="edition-btn p-2 rounded-lg border border-slate-700 text-xs font-bold text-slate-400 hover:border-purple-500 hover:text-purple-400" data-ed="pro">Pro</button>
                        </div>
                    </div>

                    <div class="mb-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                        <div class="flex justify-between text-xs font-bold text-purple-300 mb-2"><span>Research Injection</span><span id="inject-val">0 PTS</span></div>
                        <input type="range" id="research-inject" min="0" max="${gameState.researchPts}" value="0" class="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer">
                    </div>

                    <div id="proj-cost-preview" class="mb-6 text-xs text-slate-400 font-mono bg-black/30 p-4 rounded-xl border border-white/5">Select a model type...</div>
                    <button id="btn-start-dev" class="w-full bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-white/5 tracking-widest text-sm">INITIALIZE</button>
                </div>
            </div>
        `;
        let selectedType = null, selectedEdition = 'std', injectAmount = 0;
        const typeContainer = document.getElementById('dev-types');
        
        // Edition Selector Logic
        document.querySelectorAll('.edition-btn').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('.edition-btn').forEach(x => {
                    x.className = 'edition-btn p-2 rounded-lg border border-slate-700 text-xs font-bold text-slate-400';
                });
                b.className = `edition-btn p-2 rounded-lg border text-xs font-bold text-white ${b.dataset.ed === 'pro' ? 'border-purple-500 bg-purple-900/20' : (b.dataset.ed === 'lite' ? 'border-green-500 bg-green-900/20' : 'border-cyan-500 bg-cyan-900/20')}`;
                selectedEdition = b.dataset.ed;
                if(selectedType) updatePreview(selectedType, selectedEdition);
            };
        });

        // Inject Logic
        const slider = document.getElementById('research-inject');
        slider.oninput = (e) => { 
            injectAmount = parseInt(e.target.value); 
            document.getElementById('inject-val').textContent = `${injectAmount} PTS`; 
        };

        // Render Types
        PRODUCTS.forEach(p => {
            const locked = p.reqTech && !gameState.unlockedTechs.includes(p.reqTech);
            const btn = document.createElement('div');
            btn.className = `p-6 border cursor-pointer rounded-2xl transition-all relative ${locked ? 'border-slate-800 opacity-40 bg-slate-900/10' : 'border-slate-700 hover:border-cyan-500 hover:bg-slate-900/60 bg-slate-900/30'}`;
            btn.innerHTML = `<div class="flex justify-between mb-3"><div class="font-bold text-white text-lg">${p.name}</div>${locked ? '<i data-lucide="lock" class="w-4 h-4 text-red-500"></i>' : ''}</div><div class="text-xs text-slate-500 font-mono space-y-1"><div>Cost: $${p.cost.toLocaleString()}</div><div>Compute: ${p.compute} TF</div></div>`;
            if(!locked) {
                btn.onclick = () => {
                    document.querySelectorAll('#dev-types > div').forEach(d => d.classList.remove('border-cyan-500', 'bg-cyan-900/20'));
                    btn.classList.add('border-cyan-500', 'bg-cyan-900/20');
                    selectedType = p;
                    updatePreview(p, selectedEdition);
                };
            }
            typeContainer.appendChild(btn);
        });

        function updatePreview(p, edition) {
            let mult = edition === 'pro' ? 2 : (edition === 'lite' ? 0.5 : 1);
            let cost = p.cost * mult;
            let comp = p.compute * mult;
            document.getElementById('proj-cost-preview').innerHTML = `<div class="flex justify-between mb-1"><span>Cost</span> <span class="text-white">$${cost.toLocaleString()}</span></div><div class="flex justify-between"><span>Compute</span> <span class="${getCompute() >= comp ? 'text-green-400' : 'text-red-500'}">${comp} TF</span></div>`;
        }

        document.getElementById('btn-start-dev').onclick = () => {
            const name = document.getElementById('new-proj-name').value;
            if(!name || !selectedType) return showToast('Select project type and name!', 'error');
            
            let mult = selectedEdition === 'pro' ? 2 : (selectedEdition === 'lite' ? 0.5 : 1);
            let finalCost = selectedType.cost * mult;
            let finalCompute = selectedType.compute * mult;

            if(gameState.cash < finalCost && !gameState.isSandbox) return showToast('Insufficient Funds!', 'error');
            if(getCompute() < finalCompute) return showToast('Need Compute!', 'error');
            
            gameState.cash -= finalCost;
            gameState.researchPts -= injectAmount;
            
            gameState.products.push({ 
                id: Date.now().toString(), name, type: selectedType.id, version: 1.0, quality: 0, revenue: 0, hype: 0, 
                released: false, isUpdating: false, isOpenSource: false, weeksLeft: selectedType.time, 
                edition: selectedEdition, 
                researchBonus: Math.floor(injectAmount / 100), contracts: [] 
            });
            updateHUD(); showToast('Development Started', 'success'); renderTab('dash');
        };
        lucide.createIcons();
    }

    if(tab === 'market') { renderMarket(); }
    if(tab === 'lab') { renderLab(); }
    if(tab === 'biz') { renderBiz(); }
    if(tab === 'shop') { renderShop(); }
    if(tab === 'reviews') { renderReviews(); }
    if(tab === 'rivals') { renderRivals(); }
}

// (Helper render functions)
function renderMarket() {
    document.getElementById('content-area').innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">HARDWARE MARKET</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="server-grid"></div>`;
    const grid = document.getElementById('server-grid');
    HARDWARE.forEach(h => {
        const locked = h.reqTech && !gameState.unlockedTechs.includes(h.reqTech);
        const owned = gameState.hardware.find(x => x.typeId === h.id)?.count || 0;
        const el = document.createElement('div');
        el.className = `glass-panel p-6 rounded-2xl transition-all ${locked ? 'opacity-50 bg-slate-900/20' : 'hover:border-cyan-500/50'}`;
        el.innerHTML = `<div class="text-white font-bold text-lg mb-1">${h.name}</div><div class="text-slate-500 text-xs mb-6 font-mono">${h.compute} TF / $${h.upkeep} wk</div><div class="text-4xl font-black text-white mb-6">${owned}</div><button class="w-full border border-slate-600 text-white py-3 text-[10px] tracking-widest font-bold hover:bg-white hover:text-black rounded-xl uppercase transition-colors" ${locked ? 'disabled' : ''}>BUY $${h.cost.toLocaleString()}</button>`;
        if(!locked) el.querySelector('button').onclick = () => { if(gameState.cash >= h.cost) { gameState.cash -= h.cost; const hw = gameState.hardware.find(x => x.typeId === h.id); if(hw) hw.count++; else gameState.hardware.push({typeId:h.id, count:1}); updateHUD(); renderMarket(); showToast(`Purchased ${h.name}`, 'success'); if(gameState.tutorialStep === 2 && h.id === 'gtx_cluster') { gameState.tutorialStep = 3; runTutorial(3); } } else showToast('Insufficient Funds', 'error'); };
        grid.appendChild(el);
    });
}
function renderLab() {
    document.getElementById('content-area').innerHTML = `<div class="flex items-center gap-6 mb-8"><h2 class="text-5xl font-black text-white tracking-tighter">R&D LAB</h2><div class="text-purple-400 font-mono font-bold bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-500/30">${Math.floor(gameState.researchPts)} PTS</div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="research-grid"></div>`;
    const grid = document.getElementById('research-grid');
    RESEARCH.forEach(r => {
        const unlocked = gameState.unlockedTechs.includes(r.id);
        const el = document.createElement('div');
        el.className = `glass-panel p-8 rounded-2xl transition-all ${unlocked ? 'border-purple-500 bg-purple-900/10' : 'hover:border-purple-500/50'}`;
        el.innerHTML = `<h3 class="font-bold text-white mb-2 text-xl">${r.name}</h3><p class="text-xs text-slate-500 mb-6 leading-relaxed">${r.desc}</p>${!unlocked ? `<button class="w-full bg-slate-800 hover:bg-purple-600 text-white font-bold py-3 rounded-xl text-xs tracking-widest transition-colors">UNLOCK (${r.cost} PTS)</button>` : '<span class="text-purple-500 font-bold text-xs tracking-widest bg-purple-900/30 px-3 py-1 rounded">ACQUIRED</span>'}`;
        if(!unlocked) el.querySelector('button').onclick = () => { if(gameState.researchPts >= r.cost) { gameState.researchPts -= r.cost; gameState.unlockedTechs.push(r.id); updateHUD(); renderLab(); showToast('Researched!', 'success'); } else showToast('Need Points', 'error'); };
        grid.appendChild(el);
    });
}
function renderBiz() {
    document.getElementById('content-area').innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">BUSINESS GROWTH</h2><div class="grid grid-cols-1 gap-8"><div><h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="briefcase" class="text-green-500"></i> CONTRACTS</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="market-grid"></div></div><div><h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="megaphone" class="text-yellow-500"></i> CAMPAIGNS</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="ads-grid"></div></div></div>`;
    const marketGrid = document.getElementById('market-grid');
    COMPANIES.forEach(c => {
        const el = document.createElement('div'); el.className = 'glass-panel p-6 rounded-2xl';
        el.innerHTML = `<div class="flex justify-between items-center mb-6"><h3 class="font-bold text-white text-lg">${c.name}</h3><span class="text-green-400 font-mono text-xs bg-green-900/20 px-2 py-1 rounded border border-green-500/20">$${c.budget.toLocaleString()}/wk</span></div><div class="space-y-2" id="contracts-${c.name.replace(/\s+/g, '')}"></div>`;
        const pList = el.querySelector(`#contracts-${c.name.replace(/\s+/g, '')}`);
        const commercialProducts = gameState.products.filter(p => p.released && !p.isOpenSource);
        if(commercialProducts.length === 0) pList.innerHTML = `<div class="text-xs text-slate-600 italic py-2 text-center">No commercial products available.</div>`;
        commercialProducts.forEach(p => {
            const active = p.contracts.includes(c.name);
            const btn = document.createElement('button');
            btn.className = `w-full flex justify-between items-center text-xs p-3 rounded-lg border transition-all ${active ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`;
            btn.innerHTML = `<span class="font-bold">${p.name}</span>${active ? '<i data-lucide="check" class="w-3 h-3"></i>' : '<span class="text-[9px] uppercase tracking-wider">PITCH</span>'}`;
            btn.onclick = () => { if(active) { p.contracts = p.contracts.filter(x => x !== c.name); showToast(`Contract ended with ${c.name}`); } else { p.contracts.push(c.name); showToast(`Signed with ${c.name}!`, 'success'); } renderBiz(); };
            pList.appendChild(btn);
        });
        marketGrid.appendChild(el);
    });
    const adsGrid = document.getElementById('ads-grid');
    AD_CAMPAIGNS.forEach(ad => {
        const el = document.createElement('div'); el.className = 'glass-panel p-6 rounded-2xl hover:border-yellow-500/50 transition-colors';
        el.innerHTML = `<div class="text-yellow-400 mb-4"><i data-lucide="megaphone" class="w-8 h-8"></i></div><h3 class="font-bold text-white text-lg leading-tight mb-2">${ad.name}</h3><div class="text-xs text-slate-400 mb-6 font-mono">Impact: +${ad.hype} Hype<br>Cost: $${ad.cost.toLocaleString()}</div><button class="w-full bg-white text-black font-bold py-3 rounded-xl text-xs tracking-widest hover:bg-yellow-400 transition-colors">RUN CAMPAIGN</button>`;
        el.querySelector('button').onclick = () => { if(gameState.cash >= ad.cost) { gameState.cash -= ad.cost; gameState.products.forEach(p => { if(p.released) p.hype = Math.min(100, p.hype + ad.hype); }); updateHUD(); showToast('Campaign Launched! 📈', 'success'); } else showToast('Insufficient Funds', 'error'); };
        adsGrid.appendChild(el);
    });
}
function renderShop() {
    document.getElementById('content-area').innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">CORPORATE ASSETS</h2><div class="text-xs text-slate-500 font-mono uppercase">Refreshes Monthly</div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>`;
    const grid = document.getElementById('shop-grid');
    SHOP_ITEMS.filter(item => item.type === 'consumable' || !gameState.purchasedItems.includes(item.id)).forEach(item => {
        const el = document.createElement('div'); el.className = 'glass-panel p-6 rounded-2xl hover:border-cyan-500/50 transition-colors';
        el.innerHTML = `<h3 class="font-bold text-white text-lg mb-1">${item.name}</h3><div class="text-xs text-cyan-400 mb-4 font-mono">${item.effect}</div><button class="w-full border border-slate-700 text-white font-bold py-3 rounded-xl hover:bg-white hover:text-black transition-colors">BUY $${item.cost.toLocaleString()}</button>`;
        el.querySelector('button').onclick = () => { if(gameState.cash >= item.cost) { gameState.cash -= item.cost; if(item.type === 'consumable') { if(item.amount > 0) gameState.researchPts += item.amount; } else { gameState.purchasedItems.push(item.id); } updateHUD(); showToast('Purchased!', 'success'); saveGame(); renderShop(); } else showToast('Insufficient Funds!', 'error'); };
        grid.appendChild(el);
    });
}
function renderReviews() {
    document.getElementById('content-area').innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">PUBLIC SENTIMENT</h2>${!gameState.reviews || gameState.reviews.length === 0 ? '<div class="text-slate-500 italic">No reviews yet. Release products to get feedback!</div>' : '<div class="space-y-4" id="reviews-list"></div>'}`;
    if(gameState.reviews) { const list = document.getElementById('reviews-list'); gameState.reviews.forEach(r => { const el = document.createElement('div'); el.className = 'glass-panel p-4 rounded-xl flex gap-4'; const color = r.rating >= 4 ? 'bg-green-500' : (r.rating <= 2 ? 'bg-red-500' : 'bg-yellow-500'); el.innerHTML = `<div class="w-2 rounded-full ${color} shrink-0"></div><div><div class="flex items-center gap-2 mb-1"><span class="font-bold text-white text-sm">@${r.user}</span><span class="text-xs text-slate-500">on ${r.product}</span></div><p class="text-slate-300 text-sm">"${r.text}"</p></div>`; list.appendChild(el); }); }
}
function renderRivals() {
    document.getElementById('content-area').innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">MARKET LEADERBOARD</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="rivals-grid"></div>`;
    const grid = document.getElementById('rivals-grid');
    const playerCard = document.createElement('div'); playerCard.className = 'glass-panel p-6 rounded-2xl border border-cyan-500/50 bg-cyan-900/10';
    playerCard.innerHTML = `<div class="flex items-center gap-4 mb-4"><div class="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black">YOU</div><div><h3 class="font-bold text-white">${gameState.companyName}</h3><div class="text-xs text-cyan-400">Rising Star</div></div></div><div class="text-2xl font-black text-white">${Math.floor(gameState.reputation)} REP</div>`;
    grid.appendChild(playerCard);
    RIVALS.forEach(r => { const el = document.createElement('div'); el.className = 'glass-panel p-6 rounded-2xl'; el.innerHTML = `<div class="flex items-center gap-4 mb-4"><div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500">${r.name[0]}</div><div><h3 class="font-bold text-white ${r.color}">${r.name}</h3><div class="text-xs text-slate-500">Market Giant</div></div></div><div class="flex justify-between text-xs font-mono text-slate-400 mb-2"><span>Dominance</span><span>${r.strength}%</span></div><div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div class="h-full bg-white/20" style="width: ${r.strength}%"></div></div>`; grid.appendChild(el); });
}

// --- UTILS ---
function startUpdate(id, type) { 
    const p = gameState.products.find(x => x.id === id); 
    if(p) { 
        p.isUpdating = true; 
        p.updateType = type; 
        p.weeksLeft = type === 'major' ? 6 : 2; 
        renderTab('dash'); 
        showToast(`Update started for ${p.name}`); 
    } 
}

function getCompute() { 
    return gameState.hardware.reduce((total, hw) => { 
        const tier = HARDWARE.find(h => h.id === hw.typeId); 
        return total + (tier ? tier.compute * hw.count : 0); 
    }, 0); 
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container'); 
    const el = document.createElement('div');
    const colors = type === 'success' ? 'border-green-500 bg-green-900/90 text-green-100' : (type === 'error' ? 'border-red-500 bg-red-900/90 text-red-100' : 'border-cyan-500 bg-slate-900/90 text-cyan-400');
    el.className = `toast-enter p-4 rounded-xl border-l-4 shadow-2xl backdrop-blur-md font-bold text-sm max-w-sm flex items-center gap-3 ${colors}`;
    el.innerHTML = type === 'success' ? `<i data-lucide="check-circle" class="w-5 h-5"></i> ${msg}` : `<i data-lucide="info" class="w-5 h-5"></i> ${msg}`;
    container.appendChild(el); 
    lucide.createIcons(); 
    setTimeout(() => { 
        el.style.opacity = '0'; 
        setTimeout(() => el.remove(), 500); 
    }, 4000);
    document.getElementById('hud-ticker').innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> ${msg}`;
}

// Event handler to load correct HUD data
function updateHUD() { 
    document.getElementById('hud-company-name').textContent = gameState.companyName; 
    document.getElementById('hud-cash').textContent = '$' + gameState.cash.toLocaleString(); 
    document.getElementById('hud-compute').textContent = getCompute() + ' TF'; 
    document.getElementById('hud-research').textContent = Math.floor(gameState.researchPts) + ' PTS'; 
    document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`; 
}

// Event handler for renaming company
document.getElementById('trigger-rename').addEventListener('click', () => { 
    document.getElementById('rename-modal').classList.remove('hidden'); 
    document.getElementById('inp-rename-company').value = gameState.companyName; 
});
document.getElementById('btn-cancel-rename').onclick = () => document.getElementById('rename-modal').classList.add('hidden');
document.getElementById('btn-confirm-rename').onclick = () => { 
    const newName = document.getElementById('inp-rename-company').value; 
    if(newName) { 
        gameState.companyName = newName; 
        updateHUD(); 
        saveGame(); 
        document.getElementById('rename-modal').classList.add('hidden'); 
        showToast('Company Rebranded!', 'success'); 
    } 
};


function setupRealtimeListener(saveId) {
    if (realtimeUnsubscribe) realtimeUnsubscribe();
    realtimeUnsubscribe = db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').doc(saveId).onSnapshot(doc => {
        if (doc.exists) { 
            const newData = doc.data(); 
            gameState = newData; 
            if(!gameState.chatHistory) gameState.chatHistory = []; 
            if(gameState.tutorialStep === undefined) gameState.tutorialStep = 99; 
            updateHUD(); 
            const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash'; 
            if (activeTab !== 'dev' || !document.getElementById('new-proj-name')) { 
                renderTab(activeTab); 
            } 
            if (gameState.cash < 0) document.getElementById('hud-cash').classList.add('animate-pulse'); 
        }
    });
}

// --- AI FALLBACK & DISABLE ---

function generateFallbackReview(product) {
    const sentiment = product.quality > 80 ? 'good' : (product.quality < 40 ? 'bad' : 'mid');
    const texts = FALLBACK_REVIEWS[sentiment];
    const text = texts[Math.floor(Math.random() * texts.length)];
    const users = ['User', 'Anon', 'Dev', 'AI_Fan', 'TechBro'];
    const user = users[Math.floor(Math.random() * users.length)] + Math.floor(Math.random()*100);
    
    gameState.reviews.unshift({
        product: product.name,
        user: user,
        rating: sentiment === 'good' ? 5 : (sentiment === 'mid' ? 3 : 1),
        text: text,
        week: gameState.week
    });
    if(gameState.reviews.length > 20) gameState.reviews.pop();
}

// AI Chat function replacement - keeps chat disabled
function toggleChat() {
    document.getElementById('ai-chat-window').classList.toggle('hidden');
}

// WIPE AI Memory button handler
document.getElementById('btn-wipe-ai').addEventListener('click', () => {
    gameState.chatHistory = [];
    localStorage.removeItem(AI_CONFIG.storageKeyTimestamps);
    // Since AI is offline, we just alert the user.
    alert("AI Memory Wiped (Functionality is currently offline).");
});

lucide.createIcons();
