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

// --- 4. AI SYSTEM ASSISTANT CONFIG ---
const AI_CONFIG = {
    msgLimit: 50, // CRACKED LIMIT
    windowMinutes: 5, // 5 MINUTE WINDOW
    storageKeyTimestamps: 'softworks_ai_timestamps_v6', 
};

// --- SYSTEM PROMPT ---
function getSystemPrompt(context) {
    return `
    You are 'Gemini 3 Ultra', an advanced, strategic AI advisor embedded in the game 'Softworks Tycoon'.
    
    CURRENT STATUS:
    - Funds: $${context.funds.toLocaleString()}
    - Reputation: ${context.reputation}
    - Compute: ${context.compute} TF
    - Products: ${context.products.join(', ') || "None"}
    - Unlocked Tech: ${context.unlockedTech.join(', ') || "None"}
    
    USER QUERY: "${context.userQuery}"
    
    INSTRUCTIONS:
    1. Act like a highly intelligent, slightly futuristic AI. Use "Thinking..." or "Analyzing..." if needed.
    2. Be helpful but strategic. Don't just give answers, give *plans*.
    3. Use Gen-Z/Tech slang (e.g., "cracked", "meta", "scaling", "moat").
    4. Keep it concise (under 50 words).
    `;
}

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
                    <div class="${data.cash < 0 ? 'text-red-500' : 'text-green-400'} font-bold">$${data.cash.toLocaleString()}</div>
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
        chatHistory: [],
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
    
    // SAFEGUARDS
    if(!gameState.reviews) gameState.reviews = [];
    if(!gameState.purchasedItems) gameState.purchasedItems = [];
    if(!gameState.chatHistory) gameState.chatHistory = []; 
    if(gameState.tutorialStep === undefined) gameState.tutorialStep = 99; 
    
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    setupRealtimeListener(id);

    updateHUD();
    renderTab('dash');
    loadChatHistory();
    lucide.createIcons();
    
    // Check Tutorial on Start
    setTimeout(() => runTutorial(gameState.tutorialStep), 1000);

    // CHANGELOG POPUP
    setTimeout(() => {
        document.getElementById('changelog-modal').classList.remove('hidden');
    }, 500);

    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

document.getElementById('btn-close-changelog').onclick = () => {
    document.getElementById('changelog-modal').classList.add('hidden');
}

// --- TUTORIAL SYSTEM ---
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialBox = document.getElementById('tutorial-box');
const tutorialHighlight = document.getElementById('tutorial-highlight');
const tutorialText = document.getElementById('tutorial-text');
const btnNextTut = document.getElementById('btn-next-tutorial');
const btnTriggerSkip = document.getElementById('btn-trigger-skip');
const skipModal = document.getElementById('skip-modal');

function runTutorial(step) {
    if(step >= 99) {
        tutorialOverlay.classList.add('hidden');
        return;
    }

    tutorialOverlay.classList.remove('hidden');
    tutorialHighlight.style.opacity = '1';
    btnNextTut.style.display = 'block';

    if(step === 0) {
        positionHighlight(null);
        tutorialText.textContent = "Welcome, CEO. I am your onboard guidance system. Let's get your AI empire started. First, we need compute power.";
        btnNextTut.onclick = () => { gameState.tutorialStep = 1; runTutorial(1); saveGame(); };
    }
    else if(step === 1) {
        const btn = document.getElementById('nav-market');
        positionHighlight(btn);
        tutorialText.textContent = "Navigate to the MARKET tab to purchase your first GPU cluster.";
        btnNextTut.style.display = 'none'; // Force click on nav
    }
    else if(step === 2) {
        setTimeout(() => {
            const btn = document.querySelector('#server-grid button'); // First button (GTX)
            if(btn) {
                positionHighlight(btn);
                tutorialText.textContent = "The 'Consumer GPU Cluster' is cheap but effective for starting out. Buy one now.";
                btnNextTut.style.display = 'none';
            }
        }, 500);
    }
    else if(step === 3) {
        const btn = document.getElementById('nav-dev');
        positionHighlight(btn);
        tutorialText.textContent = "Hardware acquired. Now, navigate to the CREATE tab to start your first LLM.";
        btnNextTut.style.display = 'none';
    }
    else if(step === 4) {
        const btn = document.getElementById('btn-toggle-chat-sidebar');
        positionHighlight(btn);
        tutorialText.textContent = "You're ready. Click 'AI Help' if you need strategy advice. Good luck.";
        btnNextTut.style.display = 'none';
    }
}

function positionHighlight(element) {
    if(!element) {
        tutorialHighlight.style.opacity = '0';
        return;
    }
    const rect = element.getBoundingClientRect();
    tutorialHighlight.style.opacity = '1';
    tutorialHighlight.style.top = `${rect.top - 5}px`;
    tutorialHighlight.style.left = `${rect.left - 5}px`;
    tutorialHighlight.style.width = `${rect.width + 10}px`;
    tutorialHighlight.style.height = `${rect.height + 10}px`;
    tutorialHighlight.style.animation = 'pulse-ring 2s infinite';
}

if(btnTriggerSkip) {
    btnTriggerSkip.addEventListener('click', () => {
        skipModal.classList.remove('hidden');
    });
}

document.getElementById('btn-cancel-skip').addEventListener('click', () => {
    skipModal.classList.add('hidden');
});

document.getElementById('btn-confirm-skip').addEventListener('click', () => {
    gameState.tutorialStep = 99;
    saveGame();
    tutorialOverlay.classList.add('hidden');
    skipModal.classList.add('hidden');
    showToast('Tutorial Skipped', 'info');
});

// --- SETTINGS LOGIC ---
const settingsModal = document.getElementById('settings-modal');
document.getElementById('btn-settings').addEventListener('click', () => settingsModal.classList.remove('hidden'));
document.getElementById('btn-close-settings').addEventListener('click', () => settingsModal.classList.add('hidden'));

document.getElementById('btn-restart-tutorial').addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    gameState.tutorialStep = 0;
    saveGame();
    runTutorial(0);
});

const wipeBtn = document.getElementById('btn-wipe-ai');
if(wipeBtn) {
    wipeBtn.addEventListener('click', () => {
        gameState.chatHistory = [];
        localStorage.removeItem(AI_CONFIG.storageKeyTimestamps);
        loadChatHistory();
        saveGame();
        alert("AI Memory Wiped.");
    });
}

// --- REAL-TIME SAVE LISTENER ---
function setupRealtimeListener(saveId) {
    if (realtimeUnsubscribe) realtimeUnsubscribe();

    realtimeUnsubscribe = db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
        .doc(saveId)
        .onSnapshot(doc => {
            if (doc.exists) {
                const newData = doc.data();
                gameState = newData;
                
                if(!gameState.chatHistory) gameState.chatHistory = [];
                if(gameState.tutorialStep === undefined) gameState.tutorialStep = 99;

                updateHUD();
                
                const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
                // Don't re-render if typing
                if (activeTab !== 'dev' || !document.getElementById('new-proj-name')) {
                    renderTab(activeTab);
                }
                if (gameState.cash < 0) document.getElementById('hud-cash').classList.add('animate-pulse');
            }
        });
}

function saveGame() {
    if(!activeSaveId || !gameState) return;
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
      .doc(activeSaveId).update(gameState).catch(console.error);
}

function updateHUD() {
    document.getElementById('hud-company-name').textContent = gameState.companyName;
    document.getElementById('hud-cash').textContent = '$' + gameState.cash.toLocaleString();
    document.getElementById('hud-compute').textContent = getCompute() + ' TF';
    document.getElementById('hud-research').textContent = Math.floor(gameState.researchPts) + ' PTS';
    document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`;
}

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
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 4000);
    document.getElementById('hud-ticker').innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> ${msg}`;
}

document.getElementById('btn-next-week').addEventListener('click', () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`;
    lucide.createIcons();

    setTimeout(() => {
        gameState.week++;
        if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

        if(Math.random() > 0.85) { 
            const rival = RIVALS[Math.floor(Math.random() * RIVALS.length)];
            const release = rival.releases[Math.floor(Math.random() * rival.releases.length)];
            showToast(`COMPETITOR ALERT: ${rival.name} released ${release}!`, 'error');
            
            gameState.products.forEach(p => {
                if(p.released) {
                    p.hype = Math.max(0, p.hype - 10);
                    p.quality = Math.max(0, p.quality - 2); 
                }
            });
        }

        const upkeep = gameState.hardware.reduce((sum, hw) => sum + (HARDWARE.find(x => x.id === hw.typeId).upkeep * hw.count), 0);
        gameState.cash -= upkeep;

        gameState.researchPts += Math.floor(gameState.reputation / 5) + Math.floor(getCompute() * 0.05) + 5;

        gameState.products.forEach(p => {
            if((!p.released || p.isUpdating) && p.weeksLeft > 0) {
                p.weeksLeft--;
                if(p.weeksLeft <= 0) {
                    p.isUpdating = false;
                    if(p.updateType) {
                        const major = p.updateType === 'major';
                        const variant = ['lite', 'flash', 'pro', 'ultra'].includes(p.updateType);
                        
                        if (variant) {
                            p.released = true;
                            p.version = 1.0;
                            // Variant stats adjustments
                            if (p.updateType === 'lite') p.quality = Math.min(80, p.quality * 0.8);
                            if (p.updateType === 'ultra') p.quality = Math.min(100, p.quality * 1.3);
                            p.hype = 100;
                            showToast(`${p.name} Launched!`, 'success');
                            generateDynamicReview(p);
                        } else {
                            p.version = parseFloat((p.version + (major ? 1.0 : 0.1)).toFixed(1));
                            p.quality = Math.min(100, p.quality + (major ? 15 : 5));
                            p.hype = 100;
                            showToast(`${p.name} updated to v${p.version}!`, 'success');
                        }
                        p.updateType = null;
                    } else {
                        p.released = true;
                        const bonus = p.researchBonus || 0;
                        const baseQ = Math.floor(Math.random() * 40) + 50;
                        p.quality = Math.min(100, baseQ + bonus);
                        p.version = 1.0;
                        p.hype = 100;
                        gameState.reputation += 10;
                        showToast(`🚀 ${p.name} Launched! Quality: ${p.quality}/100`, 'success');
                        
                        generateDynamicReview(p);
                    }
                }
            }

            if(p.released && !p.isUpdating) {
                let weeklyRev = 0;
                const organicUsers = Math.floor((p.quality * p.hype * 10));
                let organicRev = Math.floor(organicUsers * 0.1); 
                
                // Variant revenue modifiers
                if (p.name.includes('[Lite]')) organicRev *= 0.6;
                if (p.name.includes('[Ultra]')) organicRev *= 1.5;

                weeklyRev += organicRev;
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
                
                if(Math.random() > 0.98) generateDynamicReview(p);
            }
        });

        if(gameState.week % 4 === 0) {
           COMPANIES.forEach(c => c.budget = Math.max(500, c.budget + (Math.floor(Math.random()*200)-100)));
        }

        saveGame();
        const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
        renderTab(activeTab);

        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-current"></i> Next`;
        lucide.createIcons();
    }, 400); 
});

// --- DYNAMIC REVIEW GENERATION ---
async function generateDynamicReview(product) {
    const status = checkRateLimit(); 
    
    if (!status.allowed || typeof SECRETS === 'undefined' || !SECRETS.GEMINI_API_KEY) {
        generateFallbackReview(product);
        return;
    }

    const prompt = `Generate a very short (max 10 words) game review for an AI product named "${product.name}". 
    Quality is ${product.quality}/100.
    If Quality > 80: Enthusiastic, slang (cracked, fire).
    If Quality 40-80: Meh, average.
    If Quality < 40: Angry, hate it.
    Format: "Review Text"`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${SECRETS.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Interesting release.";
        text = text.replace(/"/g, ''); 

        // Add to reviews
        const users = ['User', 'Anon', 'Dev', 'AI_Fan', 'TechBro'];
        const user = users[Math.floor(Math.random() * users.length)] + Math.floor(Math.random()*100);
        
        gameState.reviews.unshift({
            product: product.name,
            user: user,
            rating: product.quality > 80 ? 5 : (product.quality < 40 ? 1 : 3),
            text: text,
            week: gameState.week
        });
        if(gameState.reviews.length > 20) gameState.reviews.pop();
        recordMessage(); 

    } catch (e) {
        console.error("AI Review Failed:", e);
        generateFallbackReview(product);
    }
}

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

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.id === 'btn-exit-game') {
            saveGame();
            if(saveInterval) clearInterval(saveInterval);
            if(realtimeUnsubscribe) realtimeUnsubscribe(); 
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('menu-screen').classList.remove('hidden');
            loadSaves(); 
            return;
        }
        if(btn.id === 'btn-toggle-chat-sidebar') {
            toggleChat();
            if(gameState.tutorialStep === 4) {
               gameState.tutorialStep = 99;
               saveGame();
               tutorialOverlay.classList.add('hidden');
            }
            return;
        }
        if(btn.id === 'btn-settings') {
            return; 
        }
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTab(btn.dataset.tab);

        if(btn.dataset.tab === 'market' && gameState.tutorialStep === 1) {
            gameState.tutorialStep = 2; 
            runTutorial(2);
        }
        if(btn.dataset.tab === 'dev' && gameState.tutorialStep === 3) {
            gameState.tutorialStep = 4;
            runTutorial(4);
        }
    });
});

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
            
            if(p.isOpenSource) card.innerHTML += `<div class="absolute top-0 right-0 bg-green-500 text-black text-[9px] font-black px-3 py-1 rounded-bl-xl tracking-widest">OPEN SOURCE</div>`;

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
                        <div class="bg-black/40 p-3 rounded-xl border border-white/5">
                            <div class="text-[9px] text-slate-500 uppercase font-bold">Quality</div>
                            <div class="${p.quality > 80 ? 'text-green-400' : 'text-yellow-400'} font-black text-xl">${p.quality}</div>
                        </div>
                        <div class="bg-black/40 p-3 rounded-xl border border-white/5">
                            <div class="text-[9px] text-slate-500 uppercase font-bold">Hype</div>
                            <div class="text-purple-400 font-black text-xl">${p.hype}%</div>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button class="bg-slate-800 text-white px-3 py-3 text-[10px] font-bold flex-1 hover:bg-slate-700 btn-patch rounded-xl tracking-wider transition-colors" data-id="${p.id}">PATCH (v${(p.version+0.1).toFixed(1)})</button>
                        <button class="bg-white text-black px-3 py-3 text-[10px] font-bold flex-1 hover:bg-cyan-400 btn-major rounded-xl tracking-wider transition-colors" data-id="${p.id}">MAJOR (v${Math.floor(p.version)+1}.0)</button>
                         <button class="border border-slate-700 text-white px-3 py-3 text-[10px] font-bold flex-1 hover:bg-slate-800 hover:border-purple-500 btn-variant rounded-xl tracking-wider transition-colors" data-id="${p.id}">EXPAND LINE</button>
                    </div>
                     <button class="w-full mt-2 text-slate-500 hover:text-red-500 text-[10px] font-bold py-2 btn-delete transition-colors">DISCONTINUE</button>
                `;
                card.querySelector('.btn-patch').onclick = () => startUpdate(p.id, 'minor');
                card.querySelector('.btn-major').onclick = () => startUpdate(p.id, 'major');
                // VARIANT BUTTON
                card.querySelector('.btn-variant').onclick = () => openVariantModal(p.id);
                card.querySelector('.btn-delete').onclick = () => {
                    if(confirm("Discontinue this product?")) {
                        gameState.products = gameState.products.filter(x => x.id !== p.id);
                        renderTab('dash');
                    }
                };
            } else {
                card.innerHTML += `
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-white text-lg">${p.name}</h3>
                        <span class="text-xs font-mono text-cyan-500 bg-cyan-900/20 px-2 py-1 rounded">${p.weeksLeft}w LEFT</span>
                    </div>
                    <div class="text-slate-500 text-xs font-mono mb-3 uppercase tracking-wider">${p.isUpdating ? 'Developing Update...' : 'Training Model...'}</div>
                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div class="h-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]" style="width: ${((p.isUpdating ? 6-p.weeksLeft : 4-p.weeksLeft)/6)*100}%"></div>
                    </div>
                `;
            }
            list.appendChild(card);
        });
        lucide.createIcons();
    }

    if(tab === 'rivals') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">MARKET LEADERBOARD</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="rivals-grid"></div>
        `;
        const grid = document.getElementById('rivals-grid');
        
        const playerCard = document.createElement('div');
        playerCard.className = 'glass-panel p-6 rounded-2xl border border-cyan-500/50 bg-cyan-900/10';
        playerCard.innerHTML = `
            <div class="flex items-center gap-4 mb-4">
                <div class="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black">YOU</div>
                <div>
                    <h3 class="font-bold text-white">${gameState.companyName}</h3>
                    <div class="text-xs text-cyan-400">Rising Star</div>
                </div>
            </div>
            <div class="text-2xl font-black text-white">${Math.floor(gameState.reputation)} REP</div>
        `;
        grid.appendChild(playerCard);

        RIVALS.forEach(r => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl';
            el.innerHTML = `
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500">${r.name[0]}</div>
                    <div>
                        <h3 class="font-bold text-white ${r.color}">${r.name}</h3>
                        <div class="text-xs text-slate-500">Market Giant</div>
                    </div>
                </div>
                <div class="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Dominance</span>
                    <span>${r.strength}%</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div class="h-full bg-white/20" style="width: ${r.strength}%"></div>
                </div>
            `;
            grid.appendChild(el);
        });
    }

    if(tab === 'market') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">HARDWARE MARKET</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="server-grid"></div>
        `;
        const grid = document.getElementById('server-grid');
        HARDWARE.forEach(h => {
            const locked = h.reqTech && !gameState.unlockedTechs.includes(h.reqTech);
            const owned = gameState.hardware.find(x => x.typeId === h.id)?.count || 0;
            const el = document.createElement('div');
            el.className = `glass-panel p-6 rounded-2xl transition-all ${locked ? 'opacity-50 bg-slate-900/20' : 'hover:border-cyan-500/50'}`;
            el.innerHTML = `<div class="text-white font-bold text-lg mb-1">${h.name}</div><div class="text-slate-500 text-xs mb-6 font-mono">${h.compute} TF / $${h.upkeep} wk</div><div class="text-4xl font-black text-white mb-6">${owned}</div><button class="w-full border border-slate-600 text-white py-3 text-[10px] tracking-widest font-bold hover:bg-white hover:text-black rounded-xl uppercase transition-colors" ${locked ? 'disabled' : ''}>BUY $${h.cost.toLocaleString()}</button>`;
            
            if(!locked) {
                el.querySelector('button').onclick = () => { 
                    if(gameState.cash >= h.cost) { 
                        gameState.cash -= h.cost; 
                        const hw = gameState.hardware.find(x => x.typeId === h.id); 
                        if(hw) hw.count++; else gameState.hardware.push({typeId:h.id, count:1}); 
                        updateHUD(); 
                        renderTab('market'); 
                        showToast(`Purchased ${h.name}`, 'success'); 
                        
                        if(gameState.tutorialStep === 2 && h.id === 'gtx_cluster') {
                            gameState.tutorialStep = 3;
                            runTutorial(3);
                        }
                    } else showToast('Insufficient Funds', 'error'); 
                };
            }
            grid.appendChild(el);
        });
    }

    if(tab === 'lab') {
        content.innerHTML = `
            <div class="flex items-center gap-6 mb-8"><h2 class="text-5xl font-black text-white tracking-tighter">R&D LAB</h2><div class="text-purple-400 font-mono font-bold bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-500/30">${Math.floor(gameState.researchPts)} PTS</div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="research-grid"></div>`;
        const grid = document.getElementById('research-grid');
        RESEARCH.forEach(r => {
            const unlocked = gameState.unlockedTechs.includes(r.id);
            const el = document.createElement('div');
            el.className = `glass-panel p-8 rounded-2xl transition-all ${unlocked ? 'border-purple-500 bg-purple-900/10' : 'hover:border-purple-500/50'}`;
            el.innerHTML = `<h3 class="font-bold text-white mb-2 text-xl">${r.name}</h3><p class="text-xs text-slate-500 mb-6 leading-relaxed">${r.desc}</p>${!unlocked ? `<button class="w-full bg-slate-800 hover:bg-purple-600 text-white font-bold py-3 rounded-xl text-xs tracking-widest transition-colors">UNLOCK (${r.cost} PTS)</button>` : '<span class="text-purple-500 font-bold text-xs tracking-widest bg-purple-900/30 px-3 py-1 rounded">ACQUIRED</span>'}`;
            if(!unlocked) el.querySelector('button').onclick = () => { if(gameState.researchPts >= r.cost) { gameState.researchPts -= r.cost; gameState.unlockedTechs.push(r.id); updateHUD(); renderTab('lab'); showToast('Researched!', 'success'); } else showToast('Need Points', 'error'); };
            grid.appendChild(el);
        });
    }

    if(tab === 'dev') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">NEW PROJECT</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" id="dev-types"></div>
                <div class="glass-panel p-8 rounded-2xl h-fit border-l-4 border-cyan-500">
                    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">Codename</label>
                    <input id="new-proj-name" class="w-full bg-black/50 border border-slate-700 p-4 text-white mb-6 rounded-xl focus:border-cyan-500 outline-none font-bold" placeholder="e.g. Skynet v1">
                    
                    <div class="mb-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                        <div class="flex justify-between text-xs font-bold text-purple-300 mb-2">
                            <span>Research Injection</span>
                            <span id="inject-val">0 PTS</span>
                        </div>
                        <input type="range" id="research-inject" min="0" max="${gameState.researchPts}" value="0" class="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer">
                        <div class="text-[10px] text-slate-400 mt-2 text-right font-mono">+<span id="quality-boost" class="text-white font-bold">0</span> Quality Boost</div>
                    </div>

                    <div class="flex items-center gap-3 mb-8 p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors" id="btn-toggle-opensource">
                        <div class="w-5 h-5 border-2 border-slate-500 rounded" id="check-os"></div>
                        <div>
                            <div class="text-sm text-white font-bold">Open Source License</div>
                            <div class="text-[10px] text-slate-500">Free release. High Reputation gain. No Revenue.</div>
                        </div>
                    </div>

                    <div id="proj-cost-preview" class="mb-6 text-xs text-slate-400 font-mono bg-black/30 p-4 rounded-xl border border-white/5">Select a model type...</div>

                    <button id="btn-start-dev" class="w-full bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-white/5 tracking-widest text-sm">INITIALIZE</button>
                </div>
            </div>
        `;
        let selectedType = null, openSource = false, injectAmount = 0;
        const typeContainer = document.getElementById('dev-types');
        
        const slider = document.getElementById('research-inject');
        const valLabel = document.getElementById('inject-val');
        const boostLabel = document.getElementById('quality-boost');
        slider.oninput = (e) => {
            injectAmount = parseInt(e.target.value);
            valLabel.textContent = `${injectAmount} PTS`;
            boostLabel.textContent = Math.floor(injectAmount / 100);
        };

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
                    document.getElementById('proj-cost-preview').innerHTML = `<div class="flex justify-between mb-1"><span>Cost</span> <span class="text-white">$${p.cost.toLocaleString()}</span></div><div class="flex justify-between mb-1"><span>Time</span> <span class="text-white">${p.time} Weeks</span></div><div class="flex justify-between"><span>Compute</span> <span class="${getCompute() >= p.compute ? 'text-green-400' : 'text-red-500'}">${p.compute} TF</span></div>`;
                };
            }
            typeContainer.appendChild(btn);
        });

        document.getElementById('btn-toggle-opensource').onclick = () => { openSource = !openSource; document.getElementById('check-os').className = `w-5 h-5 border-2 rounded transition-colors ${openSource ? 'bg-green-500 border-green-500' : 'border-slate-500'}`; };
        document.getElementById('btn-start-dev').onclick = () => {
            const name = document.getElementById('new-proj-name').value;
            if(!name || !selectedType) return showToast('Select project type and name!', 'error');
            if(gameState.cash < selectedType.cost && !gameState.isSandbox) return showToast('Insufficient Funds!', 'error');
            if(getCompute() < selectedType.compute) return showToast('Need Compute!', 'error');
            
            gameState.cash -= selectedType.cost;
            gameState.researchPts -= injectAmount;
            
            gameState.products.push({ 
                id: Date.now().toString(), name, type: selectedType.id, version: 1.0, quality: 0, revenue: 0, hype: 0, 
                released: false, isUpdating: false, isOpenSource: openSource, weeksLeft: selectedType.time, 
                researchBonus: Math.floor(injectAmount / 100), contracts: [] 
            });
            updateHUD(); showToast('Development Started', 'success'); renderTab('dash');
        };
        lucide.createIcons();
    }

    if(tab === 'biz') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">BUSINESS GROWTH</h2>
            <div class="grid grid-cols-1 gap-8">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="briefcase" class="text-green-500"></i> CONTRACTS</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="market-grid"></div>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="megaphone" class="text-yellow-500"></i> CAMPAIGNS</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="ads-grid"></div>
                </div>
            </div>
        `;
        
        const marketGrid = document.getElementById('market-grid');
        COMPANIES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl';
            el.innerHTML = `<div class="flex justify-between items-center mb-6"><h3 class="font-bold text-white text-lg">${c.name}</h3><span class="text-green-400 font-mono text-xs bg-green-900/20 px-2 py-1 rounded border border-green-500/20">$${c.budget.toLocaleString()}/wk</span></div><div class="space-y-2" id="contracts-${c.name.replace(/\s+/g, '')}"></div>`;
            const pList = el.querySelector(`#contracts-${c.name.replace(/\s+/g, '')}`);
            const commercialProducts = gameState.products.filter(p => p.released && !p.isOpenSource);
            if(commercialProducts.length === 0) pList.innerHTML = `<div class="text-xs text-slate-600 italic py-2 text-center">No commercial products available.</div>`;
            commercialProducts.forEach(p => {
                const active = p.contracts.includes(c.name);
                const btn = document.createElement('button');
                btn.className = `w-full flex justify-between items-center text-xs p-3 rounded-lg border transition-all ${active ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`;
                btn.innerHTML = `<span class="font-bold">${p.name}</span>${active ? '<i data-lucide="check" class="w-3 h-3"></i>' : '<span class="text-[9px] uppercase tracking-wider">PITCH</span>'}`;
                btn.onclick = () => {
                    if(active) { p.contracts = p.contracts.filter(x => x !== c.name); showToast(`Contract ended with ${c.name}`); }
                    else { p.contracts.push(c.name); showToast(`Signed with ${c.name}!`, 'success'); }
                    renderTab('biz');
                };
                pList.appendChild(btn);
            });
            marketGrid.appendChild(el);
        });

        const adsGrid = document.getElementById('ads-grid');
        AD_CAMPAIGNS.forEach(ad => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl hover:border-yellow-500/50 transition-colors';
            el.innerHTML = `<div class="text-yellow-400 mb-4"><i data-lucide="megaphone" class="w-8 h-8"></i></div><h3 class="font-bold text-white text-lg leading-tight mb-2">${ad.name}</h3><div class="text-xs text-slate-400 mb-6 font-mono">Impact: +${ad.hype} Hype<br>Cost: $${ad.cost.toLocaleString()}</div><button class="w-full bg-white text-black font-bold py-3 rounded-xl text-xs tracking-widest hover:bg-yellow-400 transition-colors">RUN CAMPAIGN</button>`;
            el.querySelector('button').onclick = () => {
                if(gameState.cash >= ad.cost) {
                    gameState.cash -= ad.cost;
                    gameState.products.forEach(p => { if(p.released) p.hype = Math.min(100, p.hype + ad.hype); });
                    updateHUD(); showToast('Campaign Launched! 📈', 'success');
                } else showToast('Insufficient Funds', 'error');
            };
            adsGrid.appendChild(el);
        });
        lucide.createIcons();
    }

    if(tab === 'shop') {
        content.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white tracking-tight">CORPORATE ASSETS</h2>
                <div class="text-xs text-slate-500 font-mono uppercase">Refreshes Monthly</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>
        `;
        const grid = document.getElementById('shop-grid');
        
        // Filter items: Hide permanent items if already bought
        const availableItems = SHOP_ITEMS.filter(item => {
            if(item.type === 'consumable') return true;
            return !gameState.purchasedItems.includes(item.id);
        });

        availableItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl hover:border-cyan-500/50 transition-colors';
            el.innerHTML = `<h3 class="font-bold text-white text-lg mb-1">${item.name}</h3><div class="text-xs text-cyan-400 mb-4 font-mono">${item.effect}</div><button class="w-full border border-slate-700 text-white font-bold py-3 rounded-xl hover:bg-white hover:text-black transition-colors">BUY $${item.cost.toLocaleString()}</button>`;
            el.querySelector('button').onclick = () => {
                if(gameState.cash >= item.cost) {
                    gameState.cash -= item.cost;
                    if(item.type === 'consumable') {
                        if(item.amount > 0) gameState.researchPts += item.amount;
                    } else {
                        gameState.purchasedItems.push(item.id);
                    }
                    updateHUD(); showToast('Purchased!', 'success');
                    saveGame(); 
                    renderTab('shop');
                } else showToast('Insufficient Funds!', 'error');
            };
            grid.appendChild(el);
        });
    }

    if(tab === 'reviews') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">PUBLIC SENTIMENT</h2>
            ${!gameState.reviews || gameState.reviews.length === 0 ? '<div class="text-slate-500 italic">No reviews yet. Release products to get feedback!</div>' : '<div class="space-y-4" id="reviews-list"></div>'}
        `;
        if(gameState.reviews) {
            const list = document.getElementById('reviews-list');
            gameState.reviews.forEach(r => {
                const el = document.createElement('div');
                el.className = 'glass-panel p-4 rounded-xl flex gap-4';
                const color = r.rating >= 4 ? 'bg-green-500' : (r.rating <= 2 ? 'bg-red-500' : 'bg-yellow-500');
                el.innerHTML = `<div class="w-2 rounded-full ${color} shrink-0"></div><div><div class="flex items-center gap-2 mb-1"><span class="font-bold text-white text-sm">@${r.user}</span><span class="text-xs text-slate-500">on ${r.product}</span></div><p class="text-slate-300 text-sm">"${r.text}"</p></div>`;
                list.appendChild(el);
            });
        }
    }
}

// VARIANT LOGIC
let selectedVariantId = null;
let selectedVariantType = null;
const variantModal = document.getElementById('variant-modal');

function openVariantModal(productId) {
    const p = gameState.products.find(x => x.id === productId);
    if(!p) return;
    
    selectedVariantId = productId;
    selectedVariantType = null;
    document.getElementById('variant-base-name').textContent = p.name;
    
    document.querySelectorAll('.variant-opt').forEach(b => {
        b.classList.remove('border-green-500', 'border-yellow-500', 'border-cyan-500', 'border-purple-500', 'bg-slate-800');
        b.classList.add('border-slate-700');
    });
    
    document.getElementById('btn-confirm-variant').disabled = true;
    document.getElementById('btn-confirm-variant').classList.add('cursor-not-allowed', 'text-slate-500', 'bg-slate-800');
    document.getElementById('btn-confirm-variant').classList.remove('text-black', 'bg-white', 'hover:bg-cyan-400');
    
    variantModal.classList.remove('hidden');
}

document.querySelectorAll('.variant-opt').forEach(btn => {
    btn.onclick = () => {
        selectedVariantType = btn.dataset.type;
        document.querySelectorAll('.variant-opt').forEach(b => {
             b.classList.remove('border-green-500', 'border-yellow-500', 'border-cyan-500', 'border-purple-500', 'bg-slate-800');
             b.classList.add('border-slate-700');
        });
        
        btn.classList.remove('border-slate-700');
        if(selectedVariantType === 'lite') btn.classList.add('border-green-500', 'bg-slate-800');
        if(selectedVariantType === 'flash') btn.classList.add('border-yellow-500', 'bg-slate-800');
        if(selectedVariantType === 'pro') btn.classList.add('border-cyan-500', 'bg-slate-800');
        if(selectedVariantType === 'ultra') btn.classList.add('border-purple-500', 'bg-slate-800');

        const confirmBtn = document.getElementById('btn-confirm-variant');
        confirmBtn.disabled = false;
        confirmBtn.textContent = `INITIALIZE ${selectedVariantType.toUpperCase()} MODEL`;
        confirmBtn.classList.remove('cursor-not-allowed', 'text-slate-500', 'bg-slate-800');
        confirmBtn.classList.add('text-black', 'bg-white', 'hover:bg-cyan-400');
    }
});

document.getElementById('btn-close-variant').onclick = () => variantModal.classList.add('hidden');

document.getElementById('btn-confirm-variant').onclick = () => {
    if(!selectedVariantId || !selectedVariantType) return;
    
    const parent = gameState.products.find(x => x.id === selectedVariantId);
    if(!parent) return;

    // Logic for variants
    let costMult = 1;
    let time = 2;
    if(selectedVariantType === 'lite') { costMult = 0.5; time = 2; }
    if(selectedVariantType === 'flash') { costMult = 0.8; time = 1; }
    if(selectedVariantType === 'pro') { costMult = 1.2; time = 4; }
    if(selectedVariantType === 'ultra') { costMult = 2.0; time = 8; }

    const cost = Math.floor(50000 * costMult); // Simplified base cost logic for variants

    if(gameState.cash < cost && !gameState.isSandbox) {
        showToast('Insufficient Funds for Variant', 'error');
        return;
    }

    gameState.cash -= cost;
    
    const newProduct = {
        id: Date.now().toString(),
        name: `${parent.name} [${selectedVariantType.charAt(0).toUpperCase() + selectedVariantType.slice(1)}]`,
        type: parent.type,
        version: 1.0,
        quality: parent.quality, // Start with parent quality
        revenue: 0,
        hype: 0,
        released: false,
        isUpdating: true, // Treat as update phase logic
        updateType: selectedVariantType, // Flag for update logic to handle release
        isOpenSource: parent.isOpenSource,
        weeksLeft: time,
        contracts: []
    };
    
    gameState.products.push(newProduct);
    variantModal.classList.add('hidden');
    renderTab('dash');
    updateHUD();
    showToast(`Developing ${selectedVariantType} variant...`, 'success');
};


function startUpdate(id, type) {
    const p = gameState.products.find(x => x.id === id);
    if(p) { p.isUpdating = true; p.updateType = type; p.weeksLeft = type === 'major' ? 6 : 2; renderTab('dash'); showToast(`Update started for ${p.name}`); }
}

// --- KILL SWITCH LISTENER (GLOBAL) ---
db.collection('artifacts').doc(APP_ID).collection('system').doc('config')
    .onSnapshot(doc => {
        if (doc.exists && doc.data().maintenanceMode === true) {
            if (!window.location.href.includes('maintenance.html')) {
                window.location.href = 'maintenance.html';
            }
        }
    });

// --- AI & WIDGET LOGIC ---

const chatWindow = document.getElementById('ai-chat-window');
const chatCloseBtn = document.getElementById('btn-close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const limitLabel = document.getElementById('ai-limit-counter');

function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if(!chatWindow.classList.contains('hidden')) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        updateLimitDisplay();
        loadChatHistory();
    }
}

if(chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChat);

// --- DYNAMIC RATE LIMIT LOGIC ---
function getTimestamps() {
    const data = localStorage.getItem(AI_CONFIG.storageKeyTimestamps);
    return data ? JSON.parse(data) : [];
}

function recordMessage() {
    const stamps = getTimestamps();
    stamps.push(Date.now());
    localStorage.setItem(AI_CONFIG.storageKeyTimestamps, JSON.stringify(stamps));
    updateLimitDisplay();
}

function checkRateLimit() {
    let stamps = getTimestamps();
    const now = Date.now();
    
    // Updated Limit Logic
    const windowMs = AI_CONFIG.windowMinutes * 60 * 1000;

    // Filter stamps to only keep those within current window
    stamps = stamps.filter(t => (now - t) < windowMs);
    
    // Save cleaned stamps back to storage
    localStorage.setItem(AI_CONFIG.storageKeyTimestamps, JSON.stringify(stamps));

    return {
        allowed: stamps.length < AI_CONFIG.msgLimit,
        remaining: Math.max(0, AI_CONFIG.msgLimit - stamps.length),
        windowMinutes: AI_CONFIG.windowMinutes
    };
}

function updateLimitDisplay() {
    const status = checkRateLimit();
    if(limitLabel) {
        limitLabel.textContent = `${status.remaining}/${AI_CONFIG.msgLimit} MSGS (${status.windowMinutes}m Window)`;
        limitLabel.className = status.remaining === 0 ? "text-[10px] text-red-500 font-mono animate-pulse" : "text-[10px] text-cyan-400 font-mono";
    }
    
    if (status.remaining <= 0 && chatInput) {
        chatInput.placeholder = `Cooldown active (${status.windowMinutes}m)...`;
        chatInput.disabled = true;
        chatForm.querySelector('button').disabled = true;
    } else if (chatInput) {
        chatInput.placeholder = "Ask System AI...";
        chatInput.disabled = false;
        chatForm.querySelector('button').disabled = false;
    }
}

// Chat History Loading from DB
function loadChatHistory() {
    chatMessages.innerHTML = `
        <div class="bg-slate-800/50 p-3 rounded-xl rounded-tl-none text-xs text-slate-300 border border-white/5">
            Greetings, Operator. I have full access to your company metrics. Need help with names, strategy, or market analysis?
        </div>
    `;
    if(gameState.chatHistory && gameState.chatHistory.length > 0) {
        gameState.chatHistory.forEach(msg => appendMessage(msg.role, msg.text, false)); 
    }
}

// Add Message to UI & Save to DB
function appendMessage(role, text, save = true) {
    const div = document.createElement('div');
    if (role === 'user') {
        div.className = "bg-cyan-900/30 p-3 rounded-xl rounded-tr-none text-xs text-cyan-100 border border-cyan-500/20 self-end ml-8";
        div.innerHTML = text; 
    } else {
        div.className = "bg-slate-800/50 p-3 rounded-xl rounded-tl-none text-xs text-slate-300 border border-white/5 mr-8";
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
    }
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (save) {
        gameState.chatHistory.push({ role, text });
        if(gameState.chatHistory.length > 50) gameState.chatHistory.shift(); // Keep DB size reasonable
        saveGame();
    }
}

// AI Interaction
async function askGemini(prompt) {
    const status = checkRateLimit();
    if (!status.allowed) {
        appendMessage('system', `❌ <b>System Alert:</b> Neural link overheated. Cooldown active for ${status.windowMinutes} minutes.`, false);
        return;
    }

    // Build Context
    const context = {
        company: gameState.companyName,
        funds: gameState.cash,
        week: gameState.week,
        year: gameState.year,
        reputation: gameState.reputation,
        compute: getCompute(),
        products: gameState.products.map(p => `${p.name} (v${p.version}, Q:${p.quality}, Hype:${p.hype})`),
        rivals: RIVALS.map(r => `${r.name} (${r.strength}%)`),
        unlockedTech: gameState.unlockedTechs,
        userQuery: prompt
    };

    const systemPrompt = getSystemPrompt(context);

    // Show Loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = "text-xs text-slate-500 italic ml-2 animate-pulse";
    loadingDiv.id = "ai-loading";
    loadingDiv.innerText = "Analyzing...";
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        if (typeof SECRETS === 'undefined' || !SECRETS.GEMINI_API_KEY) {
            throw new Error("API Key missing in secrets.js");
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${SECRETS.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();
        
        // Remove loading
        const loader = document.getElementById('ai-loading');
        if(loader) loader.remove();

        if (data.error) {
            appendMessage('system', `❌ Error: ${data.error.message}`, false);
        } else {
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "System Error: No response data.";
            appendMessage('system', aiText);
            recordMessage(); 
        }

    } catch (e) {
        const loader = document.getElementById('ai-loading');
        if(loader) loader.remove();
        appendMessage('system', `❌ Connection Error: ${e.message}`, false);
    }
}

if(chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        chatInput.value = '';
        askGemini(text);
    });
}

// Initial Load
setInterval(updateLimitDisplay, 60000); 
updateLimitDisplay();

lucide.createIcons();
