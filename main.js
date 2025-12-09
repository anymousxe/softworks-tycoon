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

// UNDO & ADMIN GLOBALS
const ADMIN_EMAIL = 'anymousxe.info@gmail.com';
let previousGameState = null;

// --- DATA IMPORT SAFETY ---
const HARDWARE = (typeof HARDWARE_DB !== 'undefined') ? HARDWARE_DB : [];
const COMPANIES = (typeof COMPANIES_DB !== 'undefined') ? COMPANIES_DB : [];
const CAMPAIGNS = (typeof CAMPAIGNS_DB !== 'undefined') ? CAMPAIGNS_DB : [];
const RIVALS_LIST = (typeof RIVALS_DB !== 'undefined') ? RIVALS_DB : [{name:'OpenAI', strength:99, color:'text-green-400'}];
const PREFIXES = (typeof MODEL_PREFIXES !== 'undefined') ? MODEL_PREFIXES : ['Super'];
const SUFFIXES = (typeof MODEL_SUFFIXES !== 'undefined') ? MODEL_SUFFIXES : ['GPT'];
const VERSIONS = (typeof MODEL_VERSIONS !== 'undefined') ? MODEL_VERSIONS : ['1.0'];

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
    { id: 'text', name: 'LLM', cost: 50000, time: 4, compute: 5, specs: ['Chatbot', 'Coding', 'Writing'] },
    { id: 'image', name: 'Image Gen', cost: 80000, time: 6, compute: 15, specs: ['Realistic', 'Anime', 'Logo'] },
    { id: 'audio', name: 'Audio Model', cost: 60000, time: 5, compute: 10, specs: ['Music', 'Voice', 'SFX'] },
    { id: 'video', name: 'Video Gen', cost: 150000, time: 8, compute: 40, specs: ['Deepfake', 'Cinema', 'VFX'] },
    { id: 'game_ai', name: 'NPC Brain', cost: 200000, time: 10, compute: 70, specs: ['Gaming', 'Simulation', 'VR'] },
    { id: 'robotics', name: 'Robot OS', cost: 300000, time: 12, compute: 100, specs: ['Industrial', 'Home', 'Military'] },
    { id: 'agi', name: 'Conscious AI', cost: 5000000, time: 24, compute: 2000, specs: ['Sentience'], reqTech: 'agi_theory' }
];

const SHOP_ITEMS = [
    { id: 'data_s', name: 'Data Set (Small)', cost: 5000, effect: 'Research +100', type: 'consumable', amount: 100 },
    { id: 'data_m', name: 'Data Set (Medium)', cost: 15000, effect: 'Research +350', type: 'consumable', amount: 350 },
    { id: 'data_l', name: 'Data Set (Large)', cost: 40000, effect: 'Research +1000', type: 'consumable', amount: 1000 },
    { id: 'consultant', name: 'AI Consultant', cost: 10000, effect: 'Dev Speed Boost (Instant)', type: 'consumable', amount: 0 },
    { id: 'coffee', name: 'Premium Coffee', cost: 2000, effect: 'Employees: +10 Morale', type: 'consumable_emp', amount: 10 },
    { id: 'party', name: 'Office Party', cost: 5000, effect: 'Employees: +30 Morale', type: 'consumable_emp', amount: 30 }
];

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
        document.getElementById('user-email').classList.remove('hidden'); 
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
        marketModels: [], 
        reviews: [],
        unlockedTechs: [],
        purchasedItems: [], 
        employees: { count: 1, morale: 100, happiness: 100 },
        tutorialStep: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').add(newSave);
    document.getElementById('create-screen').classList.add('hidden');
});

document.getElementById('btn-cancel-create').addEventListener('click', () => document.getElementById('create-screen').classList.add('hidden');

// --- GAME LOGIC ---

function startGame(id, data) {
    activeSaveId = id;
    gameState = data;
    
    // --- SAFEGUARDS & MIGRATION ---
    if(!gameState.reviews) gameState.reviews = [];
    if(!gameState.purchasedItems) gameState.purchasedItems = [];
    if(!gameState.marketModels) gameState.marketModels = []; 
    if(gameState.tutorialStep === undefined) gameState.tutorialStep = 99; 
    
    if(!gameState.employees || typeof gameState.employees !== 'object') {
        gameState.employees = { count: 1, morale: 100, happiness: 100 };
    }
    
    if(gameState.products) {
        gameState.products.forEach(p => {
            if(!p.apiConfig) p.apiConfig = { active: false, price: 0, limit: 100 };
            if(!p.contracts) p.contracts = [];
        });
    }

    if(gameState.marketModels.length > 0) {
        const types = ['text', 'image', 'audio', 'video', 'game_ai', 'robotics', 'agi'];
        gameState.marketModels.forEach(m => {
            if(!m.modelType) {
                m.modelType = types[Math.floor(Math.random() * types.length)];
            }
        });
    }
    
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    setupRealtimeListener(id);

    updateHUD();
    renderTab('dash');
    lucide.createIcons();
    
    setTimeout(() => runTutorial(gameState.tutorialStep), 1000);
    
    setTimeout(() => {
        document.getElementById('changelog-modal').classList.remove('hidden');
    }, 500);

    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

document.getElementById('btn-close-changelog').onclick = () => {
    document.getElementById('changelog-modal').classList.add('hidden');
};

// --- TUTORIAL SYSTEM ---
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialHighlight = document.getElementById('tutorial-highlight');
const tutorialText = document.getElementById('tutorial-text');
const btnNextTut = document.getElementById('btn-next-tutorial');
const btnTriggerSkip = document.getElementById('btn-trigger-skip');

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
        tutorialText.textContent = "Welcome, CEO. I am your guidance system. First, we need compute power to run our AI models.";
        btnNextTut.onclick = () => { gameState.tutorialStep = 1; runTutorial(1); saveGame(); };
    }
    else if(step === 1) {
        const btn = document.getElementById('nav-market');
        positionHighlight(btn);
        tutorialText.textContent = "Navigate to the MARKET tab to purchase your first GPU cluster.";
        btnNextTut.style.display = 'none'; 
    }
    else if(step === 2) {
        setTimeout(() => {
            const btn = document.querySelector('#server-grid button'); 
            if(btn) {
                positionHighlight(btn);
                tutorialText.textContent = "The 'Consumer GPU Cluster' is efficient for startups. Buy one now.";
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
        gameState.tutorialStep = 99; 
        saveGame();
        tutorialOverlay.classList.add('hidden');
    }
}

function positionHighlight(element) {
    if(!element) {
        tutorialHighlight.style.opacity = '0';
        return;
    }
    const rect = element.getBoundingClientRect();
    tutorialHighlight.style.opacity = '1';
    tutorialHighlight.style.top = `${rect.top}px`;
    tutorialHighlight.style.left = `${rect.left}px`;
    tutorialHighlight.style.width = `${rect.width}px`;
    tutorialHighlight.style.height = `${rect.height}px`;
}

if(btnTriggerSkip) {
    btnTriggerSkip.addEventListener('click', () => {
        gameState.tutorialStep = 99;
        saveGame();
        tutorialOverlay.classList.add('hidden');
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
                if(gameState.tutorialStep === undefined) gameState.tutorialStep = 99;
                
                if(!gameState.employees) gameState.employees = { count: 1, morale: 100, happiness: 100 };
                if(!gameState.marketModels) gameState.marketModels = [];

                updateHUD();
                const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
                if (activeTab !== 'dev' || !document.getElementById('new-proj-name')) {
                    renderTab(activeTab);
                }
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

// --- GENERATE RIVAL RELEASE & OBSOLESCENCE ---
function generateRivalRelease() {
    const rival = RIVALS_LIST[Math.floor(Math.random() * RIVALS_LIST.length)];
    const pre = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const ver = VERSIONS[Math.floor(Math.random() * VERSIONS.length)];
    
    const variants = ['', 'Lite', 'Flash', 'Pro', 'Ultra'];
    const variant = variants[Math.floor(Math.random() * variants.length)];
    const variantSuffix = variant ? ` [${variant}]` : '';
    
    const types = ['text', 'image', 'audio', 'video', 'game_ai', 'robotics', 'agi'];
    const type = types[Math.floor(Math.random() * types.length)];

    const isOpenSource = Math.random() > 0.85;

    const releaseName = `${pre}${suf} ${ver}${variantSuffix}`;
    
    let baseQ = 50 + (gameState.year - 2025) * 10;
    if(variant === 'Lite') baseQ -= 10;
    if(variant === 'Ultra') baseQ += 20;
    const quality = Math.min(150, Math.floor(baseQ + Math.random() * 40));

    if(!gameState.marketModels) gameState.marketModels = [];
    gameState.marketModels.push({
        id: Date.now().toString(),
        name: releaseName,
        company: rival.name,
        color: rival.color,
        quality: quality,
        modelType: type, 
        type: variant || 'Base',
        isOpenSource: isOpenSource,
        week: gameState.week,
        year: gameState.year
    });
    
    if(gameState.marketModels.length > 50) gameState.marketModels.shift();

    const osText = isOpenSource ? " (OPEN SOURCE)" : "";
    showToast(`${rival.name} released ${releaseName}${osText} (Q: ${quality})`, 'error');
    
    if (gameState.products) {
        let hitCount = 0;
        gameState.products.forEach(p => {
            if(p.released && !p.isUpdating) {
                let hit = quality > p.quality ? 5 : 2;
                if(isOpenSource) hit += 2;
                
                p.quality = Math.max(0, p.quality - hit);
                p.hype = Math.max(0, p.hype - 5);
                hitCount++;
            }
        });
        if(hitCount > 0) showToast(`Market shift! Your live models lost quality.`, 'info');
    }
}

// --- NEXT WEEK LOGIC ---
document.getElementById('btn-next-week').addEventListener('click', () => {
    // *** UNDO SYSTEM: CAPTURE STATE BEFORE CHANGES ***
    try {
        previousGameState = JSON.parse(JSON.stringify(gameState));
    } catch(e) {
        console.error("Failed to snapshot state", e);
    }
    // ************************************************

    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`;
    lucide.createIcons();

    setTimeout(() => {
        try {
            if(!gameState.employees) gameState.employees = { count: 1, morale: 100 };

            gameState.week++;
            if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

            if(Math.random() > 0.7) {
                generateRivalRelease();
            }

            if(gameState.marketModels && gameState.marketModels.length > 0) {
                gameState.marketModels = gameState.marketModels.filter(m => {
                    if (Math.random() > 0.3) {
                        m.quality = Math.max(0, m.quality - 1);
                    }
                    if(m.quality <= 15) {
                        return false; 
                    }
                    return true; 
                });
            }

            const wages = (gameState.employees.count || 1) * 800;
            gameState.cash -= wages;
            
            if(Math.random() > 0.8 && gameState.employees.morale > 20) gameState.employees.morale -= 2;

            const upkeep = gameState.hardware.reduce((sum, hw) => {
                const tier = HARDWARE.find(x => x.id === hw.typeId);
                return sum + (tier ? tier.upkeep * hw.count : 0);
            }, 0);
            gameState.cash -= upkeep;

            gameState.researchPts += Math.floor(gameState.reputation / 5) + Math.floor(getCompute() * 0.05) + 5;

            if (gameState.products && Array.isArray(gameState.products)) {
                gameState.products.forEach(p => {
                    if(!p.apiConfig) p.apiConfig = { active: false, price: 0, limit: 100 };
                    if(!p.contracts) p.contracts = [];

                    if((!p.released || p.isUpdating) && p.weeksLeft > 0) {
                        const speedMult = gameState.employees.morale > 80 ? 1.5 : (gameState.employees.morale < 40 ? 0.5 : 1.0);
                        p.weeksLeft -= (1 * speedMult);
                        
                        if(p.weeksLeft <= 0) {
                            p.isUpdating = false;
                            p.weeksLeft = 0;
                            if(p.updateType) {
                                const major = p.updateType === 'major';
                                const variant = ['lite', 'flash', 'pro', 'ultra', 'custom'].includes(p.updateType);
                                
                                if (variant) {
                                    p.released = true;
                                    p.version = 1.0;
                                    if (p.updateType === 'lite') p.quality = Math.min(80, p.quality * 0.8);
                                    if (p.updateType === 'ultra') p.quality = Math.min(100, p.quality * 1.3);
                                    
                                    if(p.researchBonus) p.quality = Math.min(150, p.quality + p.researchBonus);
                                    p.researchBonus = 0; 

                                    p.hype = 100;
                                    showToast(`${p.name} Launched!`, 'success');
                                } else {
                                    p.version = parseFloat((p.version + (major ? 1.0 : 0.1)).toFixed(1));
                                    p.quality = Math.min(150, p.quality + (major ? 15 : 5));
                                    
                                    if(p.researchBonus) p.quality = Math.min(150, p.quality + p.researchBonus);
                                    p.researchBonus = 0; 

                                    p.hype = 100;
                                    showToast(`${p.name} updated to v${p.version}!`, 'success');
                                }
                                p.updateType = null;
                            } else {
                                p.released = true;
                                const bonus = p.researchBonus || 0;
                                const baseQ = Math.floor(Math.random() * 40) + 50;
                                p.quality = Math.min(150, baseQ + bonus); 
                                p.version = 1.0;
                                p.hype = 100;
                                gameState.reputation += 10;
                                showToast(`🚀 ${p.name} Launched! Quality: ${p.quality}/150`, 'success');
                            }
                        }
                    }

                    if(p.released && !p.isUpdating) {
                        let weeklyRev = 0;
                        const organicUsers = Math.floor((p.quality * p.hype * 25)); 
                        let organicRev = Math.floor(organicUsers * 0.5); 
                        
                        if (p.name.includes('[Lite]')) organicRev *= 0.6;
                        if (p.name.includes('[Ultra]')) organicRev *= 1.5;

                        weeklyRev += organicRev;
                        p.contracts.forEach(cName => {
                            const comp = COMPANIES.find(c => c.name === cName);
                            if(comp) weeklyRev += Math.floor(comp.budget * (p.quality / 100));
                        });
                        
                        if(p.apiConfig && p.apiConfig.active) {
                            if(p.apiConfig.price === 0) {
                                p.hype = Math.min(250, p.hype + 5); 
                                const limitMult = p.apiConfig.limit / 100;
                                gameState.cash -= (200 * limitMult); 
                            } else {
                                const apiUsers = Math.floor(organicUsers * 0.1); 
                                const limitPenalty = p.apiConfig.limit < 500 ? 0.8 : 1.0;
                                const priceFactor = (100 - p.apiConfig.price) / 100; 
                                const revenue = Math.floor(apiUsers * p.apiConfig.price * priceFactor * limitPenalty);
                                weeklyRev += revenue;
                                p.hype = Math.max(0, p.hype - 1);
                            }
                        } else {
                             p.hype = Math.max(0, p.hype - 2);
                        }
                        
                        if(p.isOpenSource) {
                            if(p.hype > 0) gameState.reputation += 1.5;
                        } else {
                            gameState.cash += weeklyRev;
                            p.revenue += weeklyRev;
                        }
                    }
                });
            }

            if(gameState.week % 4 === 0) {
               COMPANIES.forEach(c => c.budget = Math.max(500, c.budget + (Math.floor(Math.random()*500)-100)));
            }

            saveGame();
            const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
            renderTab(activeTab);

        } catch (err) {
            console.error("Next Week Error:", err);
            showToast("System stabilized. Trying again...", 'info');
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-current"></i> Next`;
            lucide.createIcons();
        }
    }, 400); 
});

// --- RENDER LOGIC ---
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
        
        // Handle Settings Button separately
        if(btn.id === 'nav-settings') return;
        
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

    // --- DASHBOARD ---
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
                const apiActive = p.apiConfig && p.apiConfig.active;
                const apiStatus = apiActive ? (p.apiConfig.price === 0 ? 'text-purple-400' : 'text-green-400') : 'text-slate-600';
                
                card.innerHTML += `
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-2xl font-bold text-white tracking-tight">${p.name} <span class="text-cyan-500 text-sm font-mono">v${p.version}</span></h3>
                            <div class="flex gap-2 mt-1">
                                <div class="text-xs text-slate-500 font-bold bg-slate-800 inline-block px-2 py-0.5 rounded">${p.type.toUpperCase()}</div>
                                <div class="text-xs font-bold bg-slate-900/50 inline-block px-2 py-0.5 rounded ${apiStatus} flex items-center gap-1">
                                    <i data-lucide="globe" class="w-3 h-3"></i> API
                                </div>
                            </div>
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

                    <div class="grid grid-cols-2 gap-2 mb-2">
                         <button class="bg-slate-800 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-700 btn-patch rounded-xl tracking-wider transition-colors" data-id="${p.id}">PATCH</button>
                         <button class="bg-white text-black px-3 py-3 text-[10px] font-bold hover:bg-cyan-400 btn-major rounded-xl tracking-wider transition-colors" data-id="${p.id}">v2.0</button>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                         <button class="border border-slate-700 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-800 hover:border-purple-500 btn-variant rounded-xl tracking-wider transition-colors" data-id="${p.id}">EXTEND LINE</button>
                         <button class="border border-slate-700 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-800 hover:border-green-500 btn-api rounded-xl tracking-wider transition-colors" data-id="${p.id}">CONFIG API</button>
                    </div>
                    <button class="w-full mt-2 text-slate-500 hover:text-red-500 text-[10px] font-bold py-2 btn-delete transition-colors">DISCONTINUE PRODUCT</button>
                `;
                card.querySelector('.btn-patch').onclick = () => openUpdateModal(p.id, 'minor');
                card.querySelector('.btn-major').onclick = () => openUpdateModal(p.id, 'major');
                card.querySelector('.btn-variant').onclick = () => openVariantModal(p.id);
                card.querySelector('.btn-api').onclick = () => openApiModal(p.id); 
                card.querySelector('.btn-delete').onclick = () => {
                    if(confirm(`Permanently discontinue ${p.name}? This cannot be undone.`)) {
                        gameState.products = gameState.products.filter(x => x.id !== p.id);
                        saveGame();
                        renderTab('dash');
                        showToast('Product Discontinued', 'info');
                    }
                };
            } else {
                card.innerHTML += `
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-white text-lg">${p.name}</h3>
                        <span class="text-xs font-mono text-cyan-500 bg-cyan-900/20 px-2 py-1 rounded">${Math.ceil(p.weeksLeft)}w LEFT</span>
                    </div>
                    <div class="text-slate-500 text-xs font-mono mb-3 uppercase tracking-wider">${p.isUpdating ? 'Developing Update...' : 'Training Model...'}</div>
                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div class="h-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]" style="width: 50%"></div>
                    </div>
                `;
            }
            list.appendChild(card);
        });
        lucide.createIcons();
    }

    // --- STATS TAB ---
    if(tab === 'stats') {
        content.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white tracking-tight">GLOBAL LEADERBOARD</h2>
                <div class="text-xs text-slate-500 font-mono">RANKING BY QUALITY</div>
            </div>
            <div class="glass-panel rounded-2xl overflow-hidden border border-slate-800">
                <div class="grid grid-cols-6 bg-slate-900/80 p-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <div>Rank</div>
                    <div>Type</div>
                    <div class="col-span-2">Model Name</div>
                    <div>Developer</div>
                    <div class="text-right">Quality</div>
                </div>
                <div id="stats-list" class="divide-y divide-slate-800/50"></div>
            </div>
        `;
        
        const list = document.getElementById('stats-list');
        const userModels = (gameState.products || []).filter(p => p.released).map(p => ({
            name: p.name,
            company: gameState.companyName,
            quality: p.quality,
            type: p.type, 
            isOpenSource: p.isOpenSource,
            isUser: true,
            color: 'text-cyan-400'
        }));
        
        const marketModels = (gameState.marketModels || []).map(m => ({
            ...m,
            type: m.modelType || 'text',
            isOpenSource: m.isOpenSource || false
        }));
        
        const allModels = [...userModels, ...marketModels].sort((a,b) => b.quality - a.quality);
        
        const getIcon = (t) => {
            switch(t) {
                case 'text': return 'message-square';
                case 'image': return 'image';
                case 'audio': return 'music';
                case 'video': return 'video';
                case 'game_ai': return 'gamepad-2';
                case 'robotics': return 'bot';
                case 'agi': return 'brain-circuit';
                default: return 'help-circle';
            }
        };

        allModels.forEach((m, i) => {
            const el = document.createElement('div');
            el.className = `grid grid-cols-6 p-4 items-center text-sm ${m.isUser ? 'bg-cyan-900/10' : 'hover:bg-slate-900/30'} transition-colors`;
            
            const osBadge = m.isOpenSource ? `<span class="bg-green-900/40 text-green-400 text-[9px] px-1.5 py-0.5 rounded border border-green-500/30 ml-2 font-bold tracking-wider">OPEN</span>` : '';

            el.innerHTML = `
                <div class="font-mono text-slate-500">#${i+1}</div>
                <div class="text-slate-400 flex items-center gap-2">
                    <i data-lucide="${getIcon(m.type)}" class="w-4 h-4"></i>
                    <span class="text-[9px] font-bold uppercase tracking-wider text-slate-600">${m.type.substring(0,4)}</span>
                </div>
                <div class="col-span-2 font-bold text-white flex items-center">${m.name} ${osBadge}</div>
                <div class="${m.color || 'text-slate-400'} text-xs font-bold">${m.company}</div>
                <div class="text-right font-mono font-bold ${m.quality > 100 ? 'text-purple-400' : 'text-slate-300'}">${m.quality}</div>
            `;
            list.appendChild(el);
        });
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
                </div>
            </div>
            <div class="text-2xl font-black text-white">${Math.floor(gameState.reputation)} REP</div>
        `;
        grid.appendChild(playerCard);

        RIVALS_LIST.forEach(r => {
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
            el.innerHTML = `
                <div class="text-white font-bold text-lg mb-1">${h.name}</div>
                <div class="text-slate-500 text-xs mb-6 font-mono">${h.compute} TF / $${h.upkeep} wk</div>
                <div class="text-4xl font-black text-white mb-6">${owned}</div>
                <div class="flex gap-2">
                    <button class="flex-1 border border-slate-600 text-white py-3 text-[10px] tracking-widest font-bold hover:bg-white hover:text-black rounded-xl uppercase transition-colors btn-buy" ${locked ? 'disabled' : ''}>BUY $${h.cost.toLocaleString()}</button>
                    ${owned > 0 ? `<button class="px-3 border border-red-900 text-red-500 hover:bg-red-900 rounded-xl btn-sell"><i data-lucide="minus"></i></button>` : ''}
                </div>
            `;
            
            if(!locked) {
                el.querySelector('.btn-buy').onclick = () => { 
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
                if(owned > 0) {
                    el.querySelector('.btn-sell').onclick = () => {
                        const hw = gameState.hardware.find(x => x.typeId === h.id);
                        if(hw && hw.count > 0) {
                            hw.count--;
                            gameState.cash += Math.floor(h.cost * 0.5); 
                            updateHUD();
                            renderTab('market');
                            showToast(`Sold ${h.name}`, 'info');
                        }
                    };
                }
            }
            grid.appendChild(el);
        });
        lucide.createIcons();
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
                        <div class="text-[10px] text-slate-400 mt-2 text-right font-mono">+<span id="quality-boost" class="text-white font-bold">0</span> Quality</div>
                    </div>

                    <div class="flex items-center gap-3 mb-8 p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors" id="btn-toggle-opensource">
                        <div class="w-5 h-5 border-2 border-slate-500 rounded" id="check-os"></div>
                        <div>
                            <div class="text-sm text-white font-bold">Open Source License</div>
                            <div class="text-[10px] text-slate-500">Free release. Reputation gain. No Revenue.</div>
                        </div>
                    </div>
                    <button id="btn-start-dev" class="w-full bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-white/5 tracking-widest text-sm">INITIALIZE</button>
                </div>
            </div>
        `;
        let selectedType = null, openSource = false, injectAmount = 0;
        const typeContainer = document.getElementById('dev-types');
        const slider = document.getElementById('research-inject');
        const valLabel = document.getElementById('inject-val');
        const boostLabel = document.getElementById('quality-boost');
        
        if(slider) slider.oninput = (e) => {
            injectAmount = parseInt(e.target.value);
            valLabel.textContent = `${injectAmount} PTS`;
            boostLabel.textContent = injectAmount; 
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
                researchBonus: injectAmount, // 1:1 RATIO FIX
                contracts: [],
                apiConfig: { active: false, price: 0, limit: 100 }
            });
            updateHUD(); showToast('Development Started', 'success'); 
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('nav-dash').classList.add('active');
            renderTab('dash');
        };
        lucide.createIcons();
    }

    if(tab === 'biz') {
        const empCount = (gameState.employees && gameState.employees.count) || 1;
        const morale = (gameState.employees && gameState.employees.morale) || 100;

        content.innerHTML = `
            <div class="grid grid-cols-1 gap-8">
                <div class="glass-panel p-6 rounded-2xl border-l-4 border-yellow-500">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="users" class="text-yellow-500"></i> HR DEPARTMENT</h3>
                    <div class="flex justify-between items-center gap-4">
                        <div class="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl flex-1">
                            <div><div class="text-[10px] uppercase text-slate-500 font-bold">Headcount</div><div class="text-2xl font-black text-white">${empCount}</div></div>
                            <div class="h-8 w-px bg-white/10"></div>
                            <div><div class="text-[10px] uppercase text-slate-500 font-bold">Morale</div><div class="text-2xl font-black ${morale > 80 ? 'text-green-400' : 'text-red-500'}">${morale}%</div></div>
                        </div>
                        <div class="flex gap-2">
                            <button id="btn-hire" class="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-green-400">HIRE (+1)</button>
                            <button id="btn-fire" class="border border-slate-700 text-red-500 font-bold px-6 py-2 rounded-lg hover:bg-red-900/20">FIRE (-1)</button>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="briefcase" class="text-green-500"></i> B2B CONTRACTS</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="contract-grid"></div>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2"><i data-lucide="megaphone" class="text-purple-500"></i> CAMPAIGNS & CAMEOS</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="ads-grid"></div>
                </div>
            </div>
        `;

        document.getElementById('btn-hire').onclick = () => {
            if(!gameState.employees) gameState.employees = { count: 1, morale: 100 };
            gameState.employees.count++;
            gameState.cash -= 1000; 
            updateHUD(); renderTab('biz');
        };
        document.getElementById('btn-fire').onclick = () => {
            if(!gameState.employees) gameState.employees = { count: 1, morale: 100 };
            if(gameState.employees.count > 1) {
                gameState.employees.count--;
                gameState.employees.morale -= 10;
                updateHUD(); renderTab('biz');
            }
        };

        const contractGrid = document.getElementById('contract-grid');
        const liveProds = (gameState.products || []).filter(p => p.released && !p.isOpenSource);

        COMPANIES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-5 rounded-xl flex flex-col h-full';
            el.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-bold text-white text-lg">${c.name}</h3>
                        <div class="text-xs text-green-400 font-mono">$${c.budget.toLocaleString()}/wk</div>
                    </div>
                    <div class="bg-slate-800 p-2 rounded-lg"><i data-lucide="building-2" class="w-4 h-4 text-slate-400"></i></div>
                </div>
                <div class="flex-1 space-y-2" id="c-list-${c.name.replace(/\s/g, '')}">
                    ${liveProds.length === 0 ? '<div class="text-xs text-slate-600 italic">No commercial models.</div>' : ''}
                </div>
            `;
            
            const list = el.querySelector(`[id^="c-list-"]`);
            liveProds.forEach(p => {
                const active = (p.contracts || []).includes(c.name);
                const btn = document.createElement('button');
                btn.className = `w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all border ${active ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'}`;
                btn.innerHTML = `<div class="flex justify-between items-center"><span>${p.name}</span>${active ? '<i data-lucide="check" class="w-3 h-3"></i>' : ''}</div>`;
                
                btn.onclick = () => {
                    if(!p.contracts) p.contracts = [];
                    if(active) {
                        p.contracts = p.contracts.filter(x => x !== c.name);
                        showToast(`Contract ended with ${c.name}`);
                    } else {
                        p.contracts.push(c.name);
                        showToast(`Contract signed with ${c.name}!`, 'success');
                    }
                    renderTab('biz'); 
                };
                list.appendChild(btn);
            });
            contractGrid.appendChild(el);
        });

        const adsGrid = document.getElementById('ads-grid');
        if(adsGrid) {
            CAMPAIGNS.forEach(ad => {
                 const el = document.createElement('div');
                 el.className = 'glass-panel p-6 rounded-2xl hover:border-purple-500/50 transition-colors relative overflow-hidden';
                 if(ad.type === 'cameo') el.className += ' border-l-4 border-yellow-500';
                 
                 el.innerHTML = `
                    <h3 class="font-bold text-white text-lg mb-1">${ad.name}</h3>
                    <div class="text-xs text-slate-400 mb-4 font-mono">Cost: $${ad.cost.toLocaleString()} | Hype: +${ad.hype}</div>
                    <button class="w-full bg-slate-800 text-white font-bold py-2 rounded-lg text-xs hover:bg-purple-600 transition-colors">LAUNCH</button>
                 `;
                 
                 el.querySelector('button').onclick = () => {
                     if(gameState.cash >= ad.cost) {
                         gameState.cash -= ad.cost;
                         let count = 0;
                         if(gameState.products) {
                             gameState.products.forEach(p => { 
                                 if(p.released) { p.hype = Math.min(250, p.hype + ad.hype); count++; }
                             });
                         }
                         if(count > 0) {
                             updateHUD(); showToast('Campaign Live!', 'success');
                         } else {
                             showToast('No live products to advertise!', 'error');
                             gameState.cash += ad.cost; 
                         }
                     } else showToast('Insufficient Funds', 'error');
                 };
                 adsGrid.appendChild(el);
            });
        }
        lucide.createIcons();
    }

    if(tab === 'shop') {
        content.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white tracking-tight">CORPORATE ASSETS</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>
        `;
        const grid = document.getElementById('shop-grid');
        
        const availableItems = SHOP_ITEMS.filter(item => {
            if(item.type.includes('consumable')) return true;
            return !(gameState.purchasedItems || []).includes(item.id);
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
                    } else if(item.type === 'consumable_emp') {
                        if(!gameState.employees) gameState.employees = { morale: 100 };
                        gameState.employees.morale = Math.min(100, gameState.employees.morale + item.amount);
                        showToast(`Staff Morale Increased!`, 'success');
                    } else {
                        if(!gameState.purchasedItems) gameState.purchasedItems = [];
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
let variantInjectAmount = 0;
const variantModal = document.getElementById('variant-modal');

function openVariantModal(productId) {
    const p = gameState.products.find(x => x.id === productId);
    if(!p) return;
    
    selectedVariantId = productId;
    selectedVariantType = null;
    variantInjectAmount = 0;
    document.getElementById('variant-research-slider').value = 0;
    document.getElementById('variant-inject-val').textContent = "0 PTS";
    document.getElementById('variant-quality-boost').textContent = "0";
    
    document.getElementById('variant-base-name').textContent = p.name;
    document.getElementById('custom-variant-input').classList.add('hidden');
    
    document.querySelectorAll('.variant-opt').forEach(b => {
         b.classList.remove('border-green-500', 'border-yellow-500', 'border-cyan-500', 'border-purple-500', 'border-pink-500', 'bg-slate-800');
         b.classList.add('border-slate-700');
    });
    
    document.getElementById('btn-confirm-variant').disabled = true;
    document.getElementById('btn-confirm-variant').classList.add('cursor-not-allowed', 'text-slate-500', 'bg-slate-800');
    
    variantModal.classList.remove('hidden');
}

// Variant Slider Logic
document.getElementById('variant-research-slider').oninput = (e) => {
    variantInjectAmount = parseInt(e.target.value);
    document.getElementById('variant-inject-val').textContent = `${variantInjectAmount} PTS`;
    document.getElementById('variant-quality-boost').textContent = variantInjectAmount;
};

document.querySelectorAll('.variant-opt').forEach(btn => {
    btn.onclick = () => {
        selectedVariantType = btn.dataset.type;
        document.querySelectorAll('.variant-opt').forEach(b => {
             b.classList.remove('border-green-500', 'border-yellow-500', 'border-cyan-500', 'border-purple-500', 'border-pink-500', 'bg-slate-800');
             b.classList.add('border-slate-700');
        });
        
        btn.classList.remove('border-slate-700');
        if(selectedVariantType === 'lite') btn.classList.add('border-green-500', 'bg-slate-800');
        if(selectedVariantType === 'flash') btn.classList.add('border-yellow-500', 'bg-slate-800');
        if(selectedVariantType === 'pro') btn.classList.add('border-cyan-500', 'bg-slate-800');
        if(selectedVariantType === 'ultra') btn.classList.add('border-purple-500', 'bg-slate-800');
        if(selectedVariantType === 'custom') {
            btn.classList.add('border-pink-500', 'bg-slate-800');
            document.getElementById('custom-variant-input').classList.remove('hidden');
        } else {
            document.getElementById('custom-variant-input').classList.add('hidden');
        }

        const confirmBtn = document.getElementById('btn-confirm-variant');
        confirmBtn.disabled = false;
        confirmBtn.textContent = `INITIALIZE VARIANT`;
        confirmBtn.classList.remove('cursor-not-allowed', 'text-slate-500', 'bg-slate-800');
        confirmBtn.classList.add('text-black', 'bg-white', 'hover:bg-cyan-400');
    }
});

document.getElementById('btn-close-variant').onclick = () => variantModal.classList.add('hidden');

document.getElementById('btn-confirm-variant').onclick = () => {
    if(!selectedVariantId || !selectedVariantType) return;
    
    const parent = gameState.products.find(x => x.id === selectedVariantId);
    if(!parent) return;

    let costMult = 1;
    let time = 2;
    let suffix = "";

    if(selectedVariantType === 'lite') { costMult = 0.5; time = 2; suffix = "[Lite]"; }
    if(selectedVariantType === 'flash') { costMult = 0.8; time = 1; suffix = "[Flash]"; }
    if(selectedVariantType === 'pro') { costMult = 1.2; time = 4; suffix = "[Pro]"; }
    if(selectedVariantType === 'ultra') { costMult = 2.0; time = 8; suffix = "[Ultra]"; }
    if(selectedVariantType === 'custom') {
        const customName = document.getElementById('inp-custom-variant').value;
        if(!customName) return showToast('Enter a custom name!', 'error');
        costMult = 1.5; time = 5; suffix = `[${customName}]`;
    }

    const cost = Math.floor(50000 * costMult); 

    if((gameState.cash < cost || gameState.researchPts < variantInjectAmount) && !gameState.isSandbox) {
        showToast('Insufficient Funds/Research', 'error');
        return;
    }

    gameState.cash -= cost;
    gameState.researchPts -= variantInjectAmount;
    
    gameState.products.push({
        id: Date.now().toString(),
        name: `${parent.name} ${suffix}`,
        type: parent.type,
        version: 1.0,
        quality: parent.quality,
        revenue: 0,
        hype: 0,
        released: false,
        isUpdating: true,
        updateType: selectedVariantType,
        isOpenSource: parent.isOpenSource,
        weeksLeft: time,
        researchBonus: variantInjectAmount, // Apply Bonus
        contracts: [],
        apiConfig: { active: false, price: 0, limit: 100 }
    });
    
    variantModal.classList.add('hidden');
    renderTab('dash');
    updateHUD();
    showToast(`Developing variant...`, 'success');
};

// --- UPDATE MODAL LOGIC (NEW) ---
const updateModal = document.getElementById('update-modal');
let selectedUpdateId = null;
let selectedUpdateType = null;
let updateInjectAmount = 0;

function openUpdateModal(productId, type) {
    const p = gameState.products.find(x => x.id === productId);
    if(!p) return;
    
    selectedUpdateId = productId;
    selectedUpdateType = type;
    updateInjectAmount = 0;
    
    document.getElementById('update-target-name').textContent = p.name;
    document.getElementById('update-research-slider').value = 0;
    document.getElementById('update-inject-val').textContent = "0 PTS";
    document.getElementById('update-quality-boost').textContent = "0";
    
    // Set max based on current RP
    document.getElementById('update-research-slider').max = gameState.researchPts;
    
    updateModal.classList.remove('hidden');
}

document.getElementById('update-research-slider').oninput = (e) => {
    updateInjectAmount = parseInt(e.target.value);
    document.getElementById('update-inject-val').textContent = `${updateInjectAmount} PTS`;
    document.getElementById('update-quality-boost').textContent = updateInjectAmount;
};

document.getElementById('btn-cancel-update').onclick = () => updateModal.classList.add('hidden');

document.getElementById('btn-confirm-update').onclick = () => {
    if(!selectedUpdateId) return;
    const p = gameState.products.find(x => x.id === selectedUpdateId);
    
    if(gameState.researchPts < updateInjectAmount && !gameState.isSandbox) {
        showToast('Insufficient Research Points', 'error');
        return;
    }
    
    gameState.researchPts -= updateInjectAmount;
    p.isUpdating = true;
    p.updateType = selectedUpdateType;
    p.weeksLeft = selectedUpdateType === 'major' ? 6 : 2;
    p.researchBonus = updateInjectAmount; // Store bonus for later
    
    updateModal.classList.add('hidden');
    renderTab('dash');
    updateHUD();
    showToast(`Update started for ${p.name}`);
};

// --- API MODAL LOGIC ---
const apiModal = document.getElementById('api-modal');
let selectedApiId = null;

function openApiModal(productId) {
    const p = gameState.products.find(x => x.id === productId);
    if(!p) return;
    
    selectedApiId = productId;
    if(!p.apiConfig) p.apiConfig = { active: false, price: 0, limit: 100 };
    
    // UI State
    const statusBtn = document.getElementById('btn-toggle-api-status');
    const dot = statusBtn.querySelector('div');
    const statusText = document.getElementById('api-status-text');
    
    if(p.apiConfig.active) {
        statusBtn.classList.replace('bg-slate-700', 'bg-green-500');
        dot.classList.replace('left-1', 'left-7');
        statusText.textContent = "API Online";
        statusText.className = "text-[10px] text-green-400";
    } else {
        statusBtn.classList.replace('bg-green-500', 'bg-slate-700');
        dot.classList.replace('left-7', 'left-1');
        statusText.textContent = "Currently Offline";
        statusText.className = "text-[10px] text-slate-500";
    }

    // Inputs
    document.getElementById('api-price-input').value = p.apiConfig.price;
    document.getElementById('api-price-slider').value = p.apiConfig.price;
    
    document.getElementById('api-limit-input').value = p.apiConfig.limit;
    document.getElementById('api-limit-slider').value = p.apiConfig.limit;
    
    apiModal.classList.remove('hidden');
}

// SYNC LOGIC
const priceInput = document.getElementById('api-price-input');
const priceSlider = document.getElementById('api-price-slider');
priceInput.oninput = () => { priceSlider.value = priceInput.value; };
priceSlider.oninput = () => { priceInput.value = priceSlider.value; };

const limitInput = document.getElementById('api-limit-input');
const limitSlider = document.getElementById('api-limit-slider');
limitInput.oninput = () => { limitSlider.value = limitInput.value; };
limitSlider.oninput = () => { limitInput.value = limitSlider.value; };

document.getElementById('btn-toggle-api-status').onclick = (e) => {
    const btn = e.currentTarget;
    const dot = btn.querySelector('div');
    const isActive = btn.classList.contains('bg-green-500');
    const statusText = document.getElementById('api-status-text');
    
    if(isActive) {
        btn.classList.replace('bg-green-500', 'bg-slate-700');
        dot.classList.replace('left-7', 'left-1');
        statusText.textContent = "Currently Offline";
        statusText.className = "text-[10px] text-slate-500";
    } else {
        btn.classList.replace('bg-slate-700', 'bg-green-500');
        dot.classList.replace('left-1', 'left-7');
        statusText.textContent = "API Online";
        statusText.className = "text-[10px] text-green-400";
    }
};

document.getElementById('btn-save-api').onclick = () => {
    if(!selectedApiId) return;
    const p = gameState.products.find(x => x.id === selectedApiId);
    if(p) {
        const isActive = document.getElementById('btn-toggle-api-status').classList.contains('bg-green-500');
        p.apiConfig = {
            active: isActive,
            price: parseFloat(document.getElementById('api-price-input').value),
            limit: parseInt(document.getElementById('api-limit-input').value)
        };
        showToast('API Configuration Deployed', 'success');
        apiModal.classList.add('hidden');
        renderTab('dash');
    }
};

document.getElementById('btn-close-api').onclick = () => apiModal.classList.add('hidden');

function startUpdate(id, type) {
    const p = gameState.products.find(x => x.id === id);
    if(p) { p.isUpdating = true; p.updateType = type; p.weeksLeft = type === 'major' ? 6 : 2; renderTab('dash'); showToast(`Update started for ${p.name}`); }
}

// --- ADMIN & UNDO LOGIC HANDLERS ---

// Toggle Settings Modal
const btnSettings = document.getElementById('nav-settings');
if(btnSettings) {
    btnSettings.onclick = () => {
        document.getElementById('settings-modal').classList.remove('hidden');
        // Check for Admin
        if(currentUser && currentUser.email === ADMIN_EMAIL) {
            document.getElementById('admin-panel').classList.remove('hidden');
        } else {
            document.getElementById('admin-panel').classList.add('hidden');
        }
    };
}

document.getElementById('btn-close-settings').onclick = () => {
    document.getElementById('settings-modal').classList.add('hidden');
};

// UNDO Logic
document.getElementById('btn-undo-week').onclick = () => {
    if(!previousGameState) {
        showToast("No timeline point found!", "error");
        return;
    }
    
    // Restore state
    gameState = JSON.parse(JSON.stringify(previousGameState));
    saveGame();
    updateHUD();
    
    // Refresh the current tab to show restored data
    const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
    if(typeof renderTab === 'function') renderTab(activeTab);
    
    showToast("Timeline Restored! (Week Undone)", "success");
    document.getElementById('settings-modal').classList.add('hidden');
    
    // Clear previous state so you can't double undo
    previousGameState = null;
};

// Admin Logic
document.getElementById('btn-admin-save').onclick = () => {
    const cashInput = document.getElementById('admin-cash').value;
    const resInput = document.getElementById('admin-research').value;

    if(cashInput !== "") {
        gameState.cash = parseInt(cashInput);
    }
    if(resInput !== "") {
        gameState.researchPts = parseInt(resInput);
    }
    
    saveGame();
    updateHUD();
    showToast("GOD MODE: STATE UPDATED", "success");
};

lucide.createIcons();
