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
const ADMIN_EMAIL = 'anymousxe.info@gmail.com'; 

let historyStack = [];
let godMode = false;

// --- DATA IMPORT SAFETY ---
const HARDWARE = (typeof HARDWARE_DB !== 'undefined') ? HARDWARE_DB : [];
const COMPANIES = (typeof COMPANIES_DB !== 'undefined') ? COMPANIES_DB : [];
const CAMPAIGNS = (typeof CAMPAIGNS_DB !== 'undefined') ? CAMPAIGNS_DB : [];
const RIVALS_LIST = (typeof RIVALS_DB !== 'undefined') ? RIVALS_DB : [];
const SHOP_ITEMS = (typeof SHOP_ITEMS_DB !== 'undefined') ? SHOP_ITEMS_DB : [];
const TRAITS = (typeof CUSTOM_TRAITS !== 'undefined') ? CUSTOM_TRAITS : [];
const CAPABILITIES = (typeof CAPABILITIES_DB !== 'undefined') ? CAPABILITIES_DB : [];
const PREFIXES = (typeof MODEL_PREFIXES !== 'undefined') ? MODEL_PREFIXES : ['Super'];
const SUFFIXES = (typeof MODEL_SUFFIXES !== 'undefined') ? MODEL_SUFFIXES : ['GPT'];
const VERSIONS = (typeof MODEL_VERSIONS !== 'undefined') ? MODEL_VERSIONS : ['1.0'];

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
    { id: 'text', name: 'LLM (Text)', cost: 50000, time: 4, compute: 5 },
    { id: 'image', name: 'Image Model', cost: 80000, time: 6, compute: 15 },
    { id: 'audio', name: 'Audio Model', cost: 60000, time: 5, compute: 10 },
    { id: 'video', name: 'Video Gen', cost: 150000, time: 8, compute: 40 },
    { id: 'custom', name: 'Custom Architecture', cost: 100000, time: 6, compute: 20, desc: 'Specialized for Dreaming, Feelings, etc.' },
    { id: 'agi', name: 'AGI Core', cost: 5000000, time: 24, compute: 5000, reqTech: 'agi_theory' }
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
        document.getElementById('user-photo').src = photo;

        checkAdminAccess();
        loadSaves();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('menu-screen').classList.add('hidden');
    }
});

function checkAdminAccess() {
    const godWrapper = document.getElementById('godmode-control-wrapper');
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
        godWrapper.classList.remove('hidden');
    } else {
        godWrapper.classList.add('hidden');
        if(godMode) { godMode = false; updateHUD(); }
    }
}

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

document.getElementById('btn-cancel-create').addEventListener('click', () => document.getElementById('create-screen').classList.add('hidden'));

// --- GAME LOGIC ---

// --- THE SANITIZER: Force Clean Data ---
function cleanAndRepairData(data) {
    if (!data) return data;
    
    let wasModified = false;

    // 1. Structure Check
    if (!data.products) { data.products = []; wasModified = true; }
    if (!data.reviews) { data.reviews = []; wasModified = true; }
    if (!data.employees) { data.employees = { count: 1, morale: 100 }; wasModified = true; }

    // 2. Remove Duplicates & Fix Objects
    const seenIds = new Set();
    const cleanProducts = [];

    data.products.forEach(p => {
        // Drop garbage data
        if (!p || typeof p !== 'object' || !p.name) {
            wasModified = true;
            return;
        } 
        
        // Fix ID
        if (!p.id) { 
            p.id = Math.random().toString(36).substr(2, 9); 
            wasModified = true; 
        }
        
        // Remove Duplicate IDs
        if (seenIds.has(p.id)) {
            wasModified = true;
            return;
        }
        seenIds.add(p.id);

        // 3. Normalize Fields
        if (typeof p.weeksLeft !== 'number' || isNaN(p.weeksLeft)) { p.weeksLeft = 0; wasModified = true; }
        if (!p.type || p.type === 'undefined') { p.type = 'text'; wasModified = true; }
        
        // Migrate "specialty" to "trait"
        if (p.specialty && !p.trait) { 
            p.trait = p.specialty; 
            delete p.specialty; 
            wasModified = true; 
        }
        
        // Ensure arrays
        if (!p.capabilities) { p.capabilities = []; wasModified = true; }
        if (!p.contracts) { p.contracts = []; wasModified = true; }
        if (!p.apiConfig) { p.apiConfig = { active: false, price: 0, limit: 100 }; wasModified = true; }

        // 4. UNSTICK LOGIC: If 0 weeks, not released, not updating -> FORCE STAGE
        if (!p.released && !p.isUpdating && !p.isStaged && p.weeksLeft <= 0) {
            p.isStaged = true;
            p.weeksLeft = 0;
            wasModified = true;
        }

        cleanProducts.push(p);
    });

    if (cleanProducts.length !== data.products.length) wasModified = true;
    data.products = cleanProducts;

    // Return object wrapper to know if we need to save
    return { data: data, modified: wasModified };
}

function startGame(id, data) {
    activeSaveId = id;
    
    // Initial Sanitize
    const result = cleanAndRepairData(data);
    gameState = result.data;

    // IF DATA WAS BAD, SAVE TO DB IMMEDIATELY
    if (result.modified) {
        showToast("⚠️ Save file corrupted. Auto-repairing...", "error");
        // We use .set() to OVERWRITE the database, ensuring ghosts are deleted
        db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').doc(activeSaveId).set(gameState)
            .then(() => console.log("Save repaired and synced."))
            .catch(e => console.error("Repair sync failed", e));
    }

    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    setupRealtimeListener(id);
    updateHUD();
    renderTab('dash');
    lucide.createIcons();
    
    if (gameState.tutorialStep === undefined) gameState.tutorialStep = 99;
    setTimeout(() => runTutorial(gameState.tutorialStep), 1000);
    setTimeout(() => document.getElementById('changelog-modal').classList.remove('hidden'), 500);

    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

document.getElementById('btn-close-changelog').onclick = () => document.getElementById('changelog-modal').classList.add('hidden');

// --- TUTORIAL ---
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
        tutorialText.textContent = "Welcome, CEO. We need compute power to run AI models.";
        btnNextTut.onclick = () => { gameState.tutorialStep = 1; runTutorial(1); saveGame(); };
    } else if(step === 1) {
        positionHighlight(document.getElementById('nav-market'));
        tutorialText.textContent = "Go to the MARKET tab.";
        btnNextTut.style.display = 'none'; 
    } else if(step === 2) {
        setTimeout(() => {
            const btn = document.querySelector('#server-grid button'); 
            if(btn) { positionHighlight(btn); tutorialText.textContent = "Buy a 'Consumer GPU Cluster'."; btnNextTut.style.display = 'none'; }
        }, 500);
    } else if(step === 3) {
        positionHighlight(document.getElementById('nav-dev'));
        tutorialText.textContent = "Now, go to the CREATE tab to build your AI.";
        btnNextTut.style.display = 'none';
    } else if(step === 4) {
        gameState.tutorialStep = 99; saveGame(); tutorialOverlay.classList.add('hidden');
    }
}
function positionHighlight(element) {
    if(!element) { tutorialHighlight.style.opacity = '0'; return; }
    const rect = element.getBoundingClientRect();
    tutorialHighlight.style.opacity = '1';
    tutorialHighlight.style.top = `${rect.top}px`;
    tutorialHighlight.style.left = `${rect.left}px`;
    tutorialHighlight.style.width = `${rect.width}px`;
    tutorialHighlight.style.height = `${rect.height}px`;
}
if(btnTriggerSkip) btnTriggerSkip.addEventListener('click', () => { gameState.tutorialStep = 99; saveGame(); tutorialOverlay.classList.add('hidden'); });

// --- REALTIME ---
function setupRealtimeListener(saveId) {
    if (realtimeUnsubscribe) realtimeUnsubscribe();
    realtimeUnsubscribe = db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
        .doc(saveId).onSnapshot(doc => {
            if (doc.exists) {
                // CONSTANT SANITIZATION
                // This prevents the UI from crashing if the DB sends back bad data before our write finishes.
                const result = cleanAndRepairData(doc.data());
                gameState = result.data;
                
                updateHUD();
                const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
                // Don't re-render Dev while typing to avoid input loss
                if (activeTab !== 'dev' || !document.getElementById('new-proj-name')) renderTab(activeTab);
            }
        });
}

function saveGame() {
    if(!activeSaveId || !gameState) return;
    // Using .update here for regular autosaves to be efficient, but start/repair uses .set
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').doc(activeSaveId).update(gameState).catch(console.error);
}

function updateHUD() {
    document.getElementById('hud-company-name').textContent = gameState.companyName;
    document.getElementById('hud-cash').textContent = '$' + gameState.cash.toLocaleString();
    document.getElementById('hud-compute').textContent = getCompute() + ' TF';
    document.getElementById('hud-research').textContent = Math.floor(gameState.researchPts) + ' PTS';
    document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`;
    
    checkAdminAccess();
    if (godMode) {
        document.getElementById('admin-edit-cash').classList.remove('hidden');
        document.getElementById('admin-edit-research').classList.remove('hidden');
    } else {
        document.getElementById('admin-edit-cash').classList.add('hidden');
        document.getElementById('admin-edit-research').classList.add('hidden');
    }
}

document.getElementById('admin-edit-cash').addEventListener('click', () => {
    const val = prompt("GOD MODE: Set Cash Amount", gameState.cash);
    if(val) { gameState.cash = parseInt(val); updateHUD(); saveGame(); }
});
document.getElementById('admin-edit-research').addEventListener('click', () => {
    const val = prompt("GOD MODE: Set Research Points", gameState.researchPts);
    if(val) { gameState.researchPts = parseInt(val); updateHUD(); saveGame(); }
});
document.getElementById('trigger-rename').addEventListener('click', () => {
    document.getElementById('rename-modal').classList.remove('hidden');
    document.getElementById('inp-rename-company').value = gameState.companyName;
});
document.getElementById('btn-cancel-rename').onclick = () => document.getElementById('rename-modal').classList.add('hidden');
document.getElementById('btn-confirm-rename').onclick = () => {
    gameState.companyName = document.getElementById('inp-rename-company').value;
    updateHUD(); saveGame(); document.getElementById('rename-modal').classList.add('hidden');
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

// --- GENERATE RIVAL RELEASE ---
function generateRivalRelease() {
    const rival = RIVALS_LIST[Math.floor(Math.random() * RIVALS_LIST.length)];
    const pre = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const ver = VERSIONS[Math.floor(Math.random() * VERSIONS.length)];
    
    const types = ['text', 'image', 'audio', 'video'];
    const type = types[Math.floor(Math.random() * types.length)];

    let baseQ = 50 + (gameState.year - 2025) * 20; 
    const quality = Math.floor(baseQ + Math.random() * 50);

    if(!gameState.marketModels) gameState.marketModels = [];
    gameState.marketModels.push({
        id: Date.now().toString(),
        name: `${pre}${suf} ${ver}`,
        company: rival.name,
        color: rival.color,
        quality: quality,
        modelType: type, 
        week: gameState.week,
        year: gameState.year
    });
    
    if(gameState.marketModels.length > 50) gameState.marketModels.shift();
    showToast(`${rival.name} released ${pre}${suf} (Q: ${quality})`, 'error');
}

// --- NEW DIVERSE REVIEW GENERATION ---
function generateReviews() {
    if(!gameState.reviews) gameState.reviews = [];
    
    const liveProducts = gameState.products.filter(p => p.released);
    if(liveProducts.length === 0) return;

    if(Math.random() > 0.6) { // 40% chance
        const p = liveProducts[Math.floor(Math.random() * liveProducts.length)];
        
        let sentimentPool = [];
        let rating = 0;

        // Dynamic Quality Standards (Expectations rise every year)
        const yearOffset = (gameState.year - 2025) * 25;
        const relativeQuality = p.quality - yearOffset;

        if (relativeQuality > 120) {
            sentimentPool = REVIEWS_DB.god;
            rating = 5;
        } else if (relativeQuality > 80) {
            sentimentPool = REVIEWS_DB.high;
            rating = Math.random() > 0.5 ? 5 : 4;
        } else if (relativeQuality > 40) {
            sentimentPool = REVIEWS_DB.mid;
            rating = Math.random() > 0.5 ? 4 : 3;
        } else {
            sentimentPool = REVIEWS_DB.low;
            rating = Math.random() > 0.5 ? 2 : 1;
        }

        if(p.type === 'agi' && rating > 3) {
            sentimentPool.push("It's... alive.");
        }
        if(p.trait === 'dreamer' && rating > 3) sentimentPool.push("The dreams this thing has are wild.");
        if(p.trait === 'sentient') sentimentPool.push("I think it fell in love with me?");

        const text = sentimentPool[Math.floor(Math.random() * sentimentPool.length)];

        gameState.reviews.unshift({
            user: "User" + Math.floor(1000 + Math.random() * 9000),
            text: text,
            rating: rating,
            product: p.name,
            date: `W${gameState.week}`
        });
        
        if(gameState.reviews.length > 20) gameState.reviews.pop(); 
        showToast(`New review for ${p.name}`, 'info');
    }
}

// --- NEXT WEEK LOGIC (FIXED RELEASE LOOP) ---
document.getElementById('btn-next-week').addEventListener('click', () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`;
    lucide.createIcons();

    setTimeout(() => {
        try {
            if (gameState) {
                historyStack.push(JSON.parse(JSON.stringify(gameState)));
                if (historyStack.length > 6) historyStack.shift();
            }

            gameState.week++;
            if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

            if(Math.random() > 0.7) generateRivalRelease();
            generateReviews();

            const wages = (gameState.employees.count || 1) * 800;
            gameState.cash -= wages;
            const upkeep = gameState.hardware.reduce((sum, hw) => {
                const tier = HARDWARE.find(x => x.id === hw.typeId);
                return sum + (tier ? tier.upkeep * hw.count : 0);
            }, 0);
            gameState.cash -= upkeep;

            gameState.researchPts += Math.floor(gameState.reputation / 5) + Math.floor(getCompute() * 0.05) + 5;

            if (gameState.products) {
                gameState.products.forEach(p => {
                    // Update Development Logic
                    if(!p.released && p.weeksLeft > 0) {
                        const speedMult = gameState.employees.morale > 80 ? 1.5 : (gameState.employees.morale < 40 ? 0.5 : 1.0);
                        p.weeksLeft -= (1 * speedMult);
                        
                        // Check if just finished
                        if(p.weeksLeft <= 0) {
                            p.weeksLeft = 0;
                            if(p.isUpdating) {
                                // Auto-release updates
                                p.released = true;
                                p.isUpdating = false;
                                if(p.updateType === 'major') {
                                    p.version = parseFloat((p.version + 1.0).toFixed(1));
                                    p.quality += 15 + (p.researchBonus || 0);
                                } else if (p.updateType !== 'minor') {
                                    // Variants
                                    p.version = 1.0;
                                    p.quality += (p.researchBonus || 0);
                                } else {
                                    // Minor
                                    p.version = parseFloat((p.version + 0.1).toFixed(1));
                                    p.quality += 5 + (p.researchBonus || 0);
                                }
                                p.hype = 100;
                                showToast(`${p.name} Update Released!`, 'success');
                            } else {
                                // New Product -> Go to Staging (Cooking Phase)
                                p.isStaged = true;
                                showToast(`${p.name} is ready for polish!`, 'success');
                            }
                        }
                    }

                    // Live Product Logic
                    if(p.released && !p.isUpdating) {
                        let weeklyRev = 0;
                        const organicUsers = Math.floor((p.quality * p.hype * 25)); 
                        let organicRev = Math.floor(organicUsers * 0.5); 
                        
                        // Trait/Type Bonus
                        if(p.trait === 'dreamer') organicRev *= 1.3;
                        if(p.trait === 'sentient') organicRev *= 2.0;
                        if(p.type === 'agi') organicRev *= 5.0;

                        weeklyRev += organicRev;
                        
                        if(p.contracts) {
                            p.contracts.forEach(cName => {
                                const comp = COMPANIES.find(c => c.name === cName);
                                if(comp) weeklyRev += Math.floor(comp.budget * (p.quality / 100));
                            });
                        }
                        
                        // API
                        if(p.apiConfig && p.apiConfig.active) {
                            if(p.apiConfig.price === 0) {
                                p.hype = Math.min(500, p.hype + 5); 
                                const limitMult = p.apiConfig.limit / 100;
                                gameState.cash -= (200 * limitMult); 
                            } else {
                                const apiUsers = Math.floor(organicUsers * 0.1); 
                                const limitPenalty = p.apiConfig.limit < 500 ? 0.8 : 1.0;
                                const priceFactor = (100 - p.apiConfig.price) / 100; 
                                weeklyRev += Math.floor(apiUsers * p.apiConfig.price * priceFactor * limitPenalty);
                                p.hype = Math.max(0, p.hype - 1);
                            }
                        } else {
                             p.hype = Math.max(0, p.hype - 2);
                        }
                        
                        if(p.isOpenSource) {
                            if(p.hype > 0) gameState.reputation += (p.quality / 50);
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
            console.error(err);
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
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('menu-screen').classList.remove('hidden');
            loadSaves(); 
            return;
        }
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTab(btn.dataset.tab);
        if(btn.dataset.tab === 'market' && gameState.tutorialStep === 1) { gameState.tutorialStep = 2; runTutorial(2); }
        if(btn.dataset.tab === 'dev' && gameState.tutorialStep === 3) { gameState.tutorialStep = 4; runTutorial(4); }
    });
});

function renderTab(tab) {
    const content = document.getElementById('content-area');
    content.innerHTML = '';
    content.className = 'animate-in';

    // --- DASHBOARD ---
    if(tab === 'dash') {
        const liveProducts = (gameState.products || []).filter(p => p.released).length;
        const rev = (gameState.products || []).reduce((acc, p) => acc + (p.revenue||0), 0);
        
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
        (gameState.products || []).forEach(p => {
            // Safety Check inside render loop to prevent crashing entire dashboard
            try {
                const card = document.createElement('div');
                card.className = 'glass-panel p-6 relative group hover:border-cyan-500/50 transition-all rounded-2xl overflow-hidden';
                
                // --- STAGING STATE (READY TO LAUNCH OR ADD CAPABILITIES) ---
                if (!p.released && p.isStaged) {
                    card.classList.add('border-green-500', 'bg-green-900/10');
                    
                    // Dropdown options for capabilities
                    const availableCaps = CAPABILITIES.filter(cap => !(p.capabilities || []).includes(cap.id));
                    const capsOptions = availableCaps.map(c => `<option value="${c.id}">${c.name} (+${c.time}w, $${c.cost})</option>`).join('');
                    
                    card.innerHTML = `
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-white text-xl">${p.name}</h3>
                            <span class="text-xs font-black bg-green-500 text-black px-2 py-1 rounded animate-pulse">COOKING</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="bg-black/40 p-3 rounded-xl border border-white/5">
                                <div class="text-[9px] text-slate-500 uppercase font-bold">Current Quality</div>
                                <div class="text-white font-black text-xl">${p.quality}</div>
                            </div>
                            <div class="bg-black/40 p-3 rounded-xl border border-white/5">
                                <div class="text-[9px] text-slate-500 uppercase font-bold">Trait</div>
                                <div class="text-purple-400 font-bold uppercase text-xs mt-1">${p.trait ? p.trait.toUpperCase() : 'NONE'}</div>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                             <label class="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Install Module</label>
                             <div class="flex gap-2">
                                <select class="cap-selector bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 flex-1 outline-none">
                                    ${capsOptions || '<option disabled>Maxed Out!</option>'}
                                </select>
                                <button class="btn-add-cap bg-slate-800 hover:bg-white hover:text-black text-white px-4 py-2 rounded-lg font-bold text-xs">INSTALL</button>
                             </div>
                        </div>

                        <button class="btn-launch w-full bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl font-black text-xs tracking-widest transition-all shadow-lg shadow-green-500/20">
                            LAUNCH MODEL 🚀
                        </button>
                    `;
                    
                    card.querySelector('.btn-add-cap').onclick = () => {
                        const sel = card.querySelector('.cap-selector');
                        const capId = sel.value;
                        const cap = CAPABILITIES.find(c => c.id === capId);
                        
                        if(cap) {
                            if(gameState.cash >= cap.cost) {
                                gameState.cash -= cap.cost;
                                p.weeksLeft += cap.time;
                                p.quality += cap.quality;
                                p.isStaged = false; // Go back to "dev" mode
                                if(!p.capabilities) p.capabilities = [];
                                p.capabilities.push(cap.id);
                                updateHUD();
                                renderTab('dash');
                                showToast(`Installing ${cap.name}...`, 'success');
                            } else {
                                showToast(`Need $${cap.cost}`, 'error');
                            }
                        }
                    };

                    card.querySelector('.btn-launch').onclick = () => {
                        p.released = true;
                        p.isStaged = false;
                        p.hype = 100;
                        gameState.reputation += 25;
                        updateHUD(); renderTab('dash');
                        showToast(`${p.name} is LIVE!`, 'success');
                    };

                } 
                // --- LIVE PRODUCT ---
                else if(p.released && !p.isUpdating) {
                    const apiActive = p.apiConfig && p.apiConfig.active;
                    const apiStatus = apiActive ? (p.apiConfig.price === 0 ? 'text-purple-400' : 'text-green-400') : 'text-slate-600';

                    card.innerHTML += `
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <div class="flex items-center gap-2">
                                    <h3 class="text-2xl font-bold text-white tracking-tight">${p.name} <span class="text-cyan-500 text-sm font-mono">v${p.version}</span></h3>
                                </div>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <div class="text-xs text-slate-500 font-bold bg-slate-800 px-2 py-0.5 rounded">${(p.type || 'text').toUpperCase()}</div>
                                    ${p.trait ? `<div class="text-xs text-pink-300 font-bold bg-pink-900/30 border border-pink-500/30 px-2 py-0.5 rounded">${p.trait.toUpperCase()}</div>` : ''}
                                    <div class="text-xs font-bold bg-slate-900/50 inline-block px-2 py-0.5 rounded ${apiStatus} flex items-center gap-1"><i data-lucide="globe" class="w-3 h-3"></i> API</div>
                                    ${p.capabilities ? p.capabilities.map(c => `<div class="text-[10px] bg-purple-900/50 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-bold">${c}</div>`).join('') : ''}
                                </div>
                            </div>
                            <div class="text-right mt-2">
                                <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Weekly Rev</div>
                                <div class="text-green-400 font-mono font-bold">$${p.isOpenSource ? 0 : Math.floor(p.revenue * 0.01).toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="bg-black/40 p-3 rounded-xl border border-white/5">
                                <div class="text-[9px] text-slate-500 uppercase font-bold">Quality</div>
                                <div class="text-green-400 font-black text-xl">${p.quality} <span class="text-xs text-slate-600">/ ∞</span></div>
                            </div>
                            <div class="bg-black/40 p-3 rounded-xl border border-white/5">
                                <div class="text-[9px] text-slate-500 uppercase font-bold">Hype</div>
                                <div class="text-purple-400 font-black text-xl">${p.hype} <span class="text-xs text-slate-600">/ 500</span></div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2 mb-2">
                             <button class="bg-slate-800 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-700 btn-patch rounded-xl tracking-wider transition-colors" data-id="${p.id}">PATCH</button>
                             <button class="bg-white text-black px-3 py-3 text-[10px] font-bold hover:bg-cyan-400 btn-major rounded-xl tracking-wider transition-colors" data-id="${p.id}">v${Math.floor(p.version)+1}.0</button>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                             <button class="border border-slate-700 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-800 hover:border-purple-500 btn-variant rounded-xl tracking-wider transition-colors" data-id="${p.id}">EXTEND LINE</button>
                             <button class="border border-slate-700 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-800 hover:border-green-500 btn-api rounded-xl tracking-wider transition-colors" data-id="${p.id}">CONFIG API</button>
                        </div>
                        <button class="w-full mt-2 text-slate-500 hover:text-red-500 text-[10px] font-bold py-2 btn-delete transition-colors">DISCONTINUE</button>
                    `;
                    card.querySelector('.btn-patch').onclick = () => openUpdateModal(p.id, 'minor');
                    card.querySelector('.btn-major').onclick = () => openUpdateModal(p.id, 'major');
                    card.querySelector('.btn-variant').onclick = () => openVariantModal(p.id); 
                    card.querySelector('.btn-api').onclick = () => openApiModal(p.id); 
                    card.querySelector('.btn-delete').onclick = () => { if(confirm('Discontinue?')) { gameState.products = gameState.products.filter(x => x.id !== p.id); saveGame(); renderTab('dash'); }};
                } 
                // --- IN DEVELOPMENT ---
                else {
                    card.innerHTML += `
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-bold text-white text-lg">${p.name}</h3>
                            <span class="text-xs font-mono text-cyan-500 bg-cyan-900/20 px-2 py-1 rounded">${Math.ceil(p.weeksLeft)}w LEFT</span>
                        </div>
                        <div class="text-slate-500 text-xs font-mono mb-3 uppercase tracking-wider">${p.isUpdating ? 'Updating...' : 'Training Model...'}</div>
                        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="h-full bg-cyan-500 animate-pulse" style="width: 50%"></div></div>
                    `;
                }
                list.appendChild(card);
            } catch (err) { console.error("Error rendering product card", err); }
        });
        lucide.createIcons();
    }

    // --- STATS TAB (Restored) ---
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
            name: p.name, company: gameState.companyName, quality: p.quality, type: p.type, isUser: true, color: 'text-cyan-400'
        }));
        
        const marketModels = (gameState.marketModels || []).map(m => ({
            ...m, type: m.modelType || 'text', isUser: false
        }));
        
        const allModels = [...userModels, ...marketModels].sort((a,b) => b.quality - a.quality);
        
        const getIcon = (t) => {
            switch(t) {
                case 'text': return 'message-square'; case 'image': return 'image'; case 'audio': return 'music'; case 'video': return 'video'; default: return 'help-circle';
            }
        };

        allModels.forEach((m, i) => {
            const el = document.createElement('div');
            el.className = `grid grid-cols-6 p-4 items-center text-sm ${m.isUser ? 'bg-cyan-900/10' : 'hover:bg-slate-900/30'} transition-colors`;
            el.innerHTML = `
                <div class="font-mono text-slate-500">#${i+1}</div>
                <div class="text-slate-400 flex items-center gap-2"><i data-lucide="${getIcon(m.type)}" class="w-4 h-4"></i><span class="text-[9px] font-bold uppercase tracking-wider text-slate-600">${m.type ? m.type.substring(0,4) : 'UNK'}</span></div>
                <div class="col-span-2 font-bold text-white flex items-center">${m.name}</div>
                <div class="${m.color || 'text-slate-400'} text-xs font-bold">${m.company}</div>
                <div class="text-right font-mono font-bold ${m.quality > 100 ? 'text-purple-400' : 'text-slate-300'}">${m.quality}</div>
            `;
            list.appendChild(el);
        });
        lucide.createIcons();
    }

    // --- RIVALS TAB (Restored) ---
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
                <div><h3 class="font-bold text-white">${gameState.companyName}</h3></div>
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
                <div class="flex justify-between text-xs font-mono text-slate-400 mb-2"><span>Dominance</span><span>${r.strength}%</span></div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div class="h-full bg-white/20" style="width: ${r.strength}%"></div></div>
            `;
            grid.appendChild(el);
        });
        lucide.createIcons();
    }

    // --- MANAGE TAB (Restored) ---
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
                <div><h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="briefcase" class="text-green-500"></i> B2B CONTRACTS</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="contract-grid"></div></div>
                <div><h3 class="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2"><i data-lucide="megaphone" class="text-purple-500"></i> CAMPAIGNS & CAMEOS</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="ads-grid"></div></div>
            </div>
        `;
        document.getElementById('btn-hire').onclick = () => { if(!gameState.employees) gameState.employees = {count:1, morale:100}; gameState.employees.count++; gameState.cash -= 1000; updateHUD(); renderTab('biz'); };
        document.getElementById('btn-fire').onclick = () => { if(gameState.employees.count > 1) { gameState.employees.count--; gameState.employees.morale -= 10; updateHUD(); renderTab('biz'); }};
        
        const cGrid = document.getElementById('contract-grid');
        const liveProds = (gameState.products || []).filter(p => p.released && !p.isOpenSource);
        COMPANIES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-5 rounded-xl flex flex-col h-full';
            el.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div><h3 class="font-bold text-white text-lg">${c.name}</h3><div class="text-xs text-green-400 font-mono">$${c.budget.toLocaleString()}/wk</div></div>
                    <div class="bg-slate-800 p-2 rounded-lg"><i data-lucide="building-2" class="w-4 h-4 text-slate-400"></i></div>
                </div>
                <div class="flex-1 space-y-2" id="c-list-${c.name.replace(/\s/g, '')}">${liveProds.length === 0 ? '<div class="text-xs text-slate-600 italic">No commercial models.</div>' : ''}</div>
            `;
            const list = el.querySelector(`[id^="c-list-"]`);
            liveProds.forEach(p => {
                const active = (p.contracts || []).includes(c.name);
                const btn = document.createElement('button');
                btn.className = `w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all border ${active ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'}`;
                btn.innerHTML = `<div class="flex justify-between items-center"><span>${p.name}</span>${active ? '<i data-lucide="check" class="w-3 h-3"></i>' : ''}</div>`;
                btn.onclick = () => { if(!p.contracts) p.contracts = []; if(active) p.contracts = p.contracts.filter(x => x !== c.name); else p.contracts.push(c.name); renderTab('biz'); };
                list.appendChild(btn);
            });
            cGrid.appendChild(el);
        });

        const adsGrid = document.getElementById('ads-grid');
        CAMPAIGNS.forEach(ad => {
             const el = document.createElement('div');
             el.className = 'glass-panel p-6 rounded-2xl hover:border-purple-500/50 transition-colors relative overflow-hidden';
             if(ad.type === 'cameo') el.className += ' border-l-4 border-yellow-500';
             el.innerHTML = `<h3 class="font-bold text-white text-lg mb-1">${ad.name}</h3><div class="text-xs text-slate-400 mb-4 font-mono">Cost: $${ad.cost.toLocaleString()} | Hype: +${ad.hype}</div><button class="w-full bg-slate-800 text-white font-bold py-2 rounded-lg text-xs hover:bg-purple-600 transition-colors">LAUNCH</button>`;
             el.querySelector('button').onclick = () => { if(gameState.cash >= ad.cost) { gameState.cash -= ad.cost; gameState.products.forEach(p => { if(p.released) p.hype = Math.min(500, p.hype + ad.hype); }); updateHUD(); showToast('Campaign Live!', 'success'); } else showToast('Insufficient Funds', 'error'); };
             adsGrid.appendChild(el);
        });
        lucide.createIcons();
    }

    // --- DEV TAB (Updated for Specialty System) ---
    if(tab === 'dev') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">NEW PROJECT</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" id="dev-types"></div>
                <div class="glass-panel p-8 rounded-2xl h-fit border-l-4 border-cyan-500">
                    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">Codename</label>
                    <input id="new-proj-name" class="w-full bg-black/50 border border-slate-700 p-4 text-white mb-4 rounded-xl focus:border-cyan-500 outline-none font-bold" placeholder="Project Name">
                    
                    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">Description (Fluff)</label>
                    <textarea id="new-proj-specs" class="w-full bg-black/50 border border-slate-700 p-4 text-white mb-6 rounded-xl focus:border-cyan-500 outline-none font-mono text-sm h-20 resize-none" placeholder="e.g. Best for coding Python..."></textarea>

                    <div id="specialty-container" class="mb-6 hidden">
                        <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">Special Trait</label>
                        <select id="specialty-select" class="w-full bg-slate-900 border border-slate-700 p-3 text-white rounded-xl focus:border-purple-500 outline-none text-sm font-bold mb-2">
                             ${TRAITS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                        </select>
                        <p id="specialty-desc" class="text-xs text-slate-500 italic">Select a model type.</p>
                    </div>

                    <div class="mb-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                        <div class="flex justify-between text-xs font-bold text-purple-300 mb-2"><span>Research Injection</span><span id="inject-val">0 PTS</span></div>
                        <input type="range" id="research-inject" min="0" max="${gameState.researchPts}" value="0" class="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer">
                        <div class="text-[10px] text-slate-400 mt-2 text-right font-mono">+<span id="quality-boost" class="text-white font-bold">0</span> Quality</div>
                    </div>
                    <button id="btn-start-dev" class="w-full bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-white/5 tracking-widest text-sm">INITIALIZE</button>
                </div>
            </div>
        `;

        let selectedType = null, injectAmount = 0;
        const typeContainer = document.getElementById('dev-types');
        const specialtyContainer = document.getElementById('specialty-container');
        const specialtySelect = document.getElementById('specialty-select');
        const specialtyDesc = document.getElementById('specialty-desc');
        
        // Populate Types
        PRODUCTS.forEach(p => {
            const locked = p.reqTech && !gameState.unlockedTechs.includes(p.reqTech);
            const btn = document.createElement('div');
            btn.className = `p-6 border cursor-pointer rounded-2xl transition-all relative ${locked ? 'border-slate-800 opacity-40 bg-slate-900/10' : 'border-slate-700 hover:border-cyan-500 hover:bg-slate-900/60 bg-slate-900/30'}`;
            btn.innerHTML = `
                <div class="flex justify-between mb-3">
                    <div class="font-bold text-white text-lg">${p.name}</div>
                    ${locked ? '<i data-lucide="lock" class="w-4 h-4 text-red-500"></i>' : ''}
                </div>
                <div class="text-xs text-slate-500 font-mono space-y-1">
                    <div>Base Cost: $${p.cost.toLocaleString()}</div>
                    <div>Base Compute: ${p.compute} TF</div>
                    <div>Base Time: ${p.time} Weeks</div>
                </div>`;
            
            if(!locked) {
                btn.onclick = () => {
                    document.querySelectorAll('#dev-types > div').forEach(d => d.classList.remove('border-cyan-500', 'bg-cyan-900/20'));
                    btn.classList.add('border-cyan-500', 'bg-cyan-900/20');
                    selectedType = p;
                    
                    if(p.id === 'custom') {
                        specialtyContainer.classList.remove('hidden');
                        // Trigger change to set initial desc
                        specialtySelect.onchange(); 
                    } else {
                        specialtyContainer.classList.add('hidden');
                    }
                };
            }
            typeContainer.appendChild(btn);
        });

        // Specialty Description Update
        specialtySelect.onchange = () => {
             const spec = TRAITS.find(s => s.id === specialtySelect.value);
             if(spec) specialtyDesc.textContent = `${spec.desc} (x${spec.multCost} Cost, x${spec.multTime} Time)`;
        };

        document.getElementById('research-inject').oninput = (e) => {
            injectAmount = parseInt(e.target.value);
            document.getElementById('inject-val').textContent = `${injectAmount} PTS`;
            document.getElementById('quality-boost').textContent = injectAmount; 
        };

        document.getElementById('btn-start-dev').onclick = () => {
            const name = document.getElementById('new-proj-name').value;
            const specs = document.getElementById('new-proj-specs').value; 
            
            if(!name || !selectedType) return showToast('Select project type and name!', 'error');

            let traitId = null;
            let multCost = 1.0, multTime = 1.0, multCompute = 1.0;

            if(selectedType.id === 'custom') {
                traitId = specialtySelect.value;
                const specData = TRAITS.find(s => s.id === traitId);
                if(specData) {
                    multCost = specData.multCost;
                    multTime = specData.multTime;
                    multCompute = specData.multCompute;
                }
            }
            
            // RESOURCE SCALING LOGIC
            let baseCost = selectedType.cost * multCost;
            let baseCompute = selectedType.compute * multCompute;
            let baseTime = selectedType.time * multTime;
            
            if(injectAmount > 500) { baseCompute += 50; baseCost += 100000; }
            if(injectAmount > 2000) { baseCompute += 200; baseCost += 500000; }

            if(gameState.cash < baseCost && !gameState.isSandbox) return showToast(`Insufficient Funds! Need $${baseCost.toLocaleString()}`, 'error');
            if(getCompute() < baseCompute) return showToast(`Need ${Math.ceil(baseCompute)} TF Compute!`, 'error');
            
            gameState.cash -= baseCost;
            gameState.researchPts -= injectAmount;
            
            let baseQ = Math.floor(Math.random() * 40) + 50;
            if(selectedType.id === 'agi') baseQ = 500; 

            gameState.products.push({ 
                id: Date.now().toString(), name, type: selectedType.id, version: 1.0, 
                quality: baseQ + injectAmount, revenue: 0, hype: 0, 
                released: false, isUpdating: false, isStaged: false,
                weeksLeft: baseTime, 
                researchBonus: 0, customFeatures: [], isOpenSource: false,
                capabilities: [], trait: traitId,
                description: specs || "A cool model."
            });
            updateHUD(); showToast('Development Started. Let him cook.', 'success'); renderTab('dash');
        };
        lucide.createIcons();
    }

    // --- MARKET TAB (Restored) ---
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
                        updateHUD(); renderTab('market'); showToast(`Purchased ${h.name}`, 'success'); 
                        if(gameState.tutorialStep === 2 && h.id === 'gtx_cluster') { gameState.tutorialStep = 3; runTutorial(3); }
                    } else showToast('Insufficient Funds', 'error'); 
                };
                if(owned > 0) {
                    el.querySelector('.btn-sell').onclick = () => {
                        const hw = gameState.hardware.find(x => x.typeId === h.id);
                        if(hw && hw.count > 0) { hw.count--; gameState.cash += Math.floor(h.cost*0.5); updateHUD(); renderTab('market'); showToast(`Sold ${h.name}`, 'info'); }
                    };
                }
            }
            grid.appendChild(el);
        });
        lucide.createIcons();
    }

    // --- SHOP TAB (Updated) ---
    if(tab === 'shop') {
        content.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white tracking-tight">CORPORATE ASSETS</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>
        `;
        const grid = document.getElementById('shop-grid');
        // Filter out one-time items already bought, keep consumables
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
                    if(item.type === 'consumable_res') { gameState.researchPts += item.amount; showToast('Research Acquired!', 'success'); }
                    else if(item.type === 'consumable_emp') { if(!gameState.employees) gameState.employees = { morale: 100 }; gameState.employees.morale = Math.min(100, gameState.employees.morale + item.amount); showToast(`Staff Morale Increased!`, 'success'); }
                    else { if(!gameState.purchasedItems) gameState.purchasedItems = []; gameState.purchasedItems.push(item.id); }
                    updateHUD(); saveGame(); renderTab('shop');
                } else showToast('Insufficient Funds!', 'error');
            };
            grid.appendChild(el);
        });
        lucide.createIcons();
    }

    // --- LAB TAB ---
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

    // --- REVIEWS TAB ---
    if(tab === 'reviews') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">PUBLIC SENTIMENT</h2>
            ${!gameState.reviews || gameState.reviews.length === 0 ? '<div class="text-slate-500 italic">No reviews yet. Release products to get feedback!</div>' : '<div class="space-y-4" id="reviews-list"></div>'}
        `;
        if(gameState.reviews) {
            const list = document.getElementById('reviews-list');
            gameState.reviews.forEach(r => {
                const el = document.createElement('div');
                el.className = 'glass-panel p-4 rounded-xl flex gap-4 animate-in';
                const color = r.rating >= 4 ? 'bg-green-500' : (r.rating <= 2 ? 'bg-red-500' : 'bg-yellow-500');
                el.innerHTML = `
                    <div class="w-2 rounded-full ${color} shrink-0"></div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold text-white text-sm">@${r.user}</span>
                            <span class="text-xs text-slate-500">on ${r.product}</span>
                            <div class="flex text-yellow-500 text-[10px]">${"★".repeat(r.rating)}</div>
                        </div>
                        <p class="text-slate-300 text-sm">"${r.text}"</p>
                    </div>
                `;
                list.appendChild(el);
            });
        }
    }
}

// UPDATE MODAL
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
    document.getElementById('update-research-slider').max = gameState.researchPts;
    document.getElementById('update-inject-val').textContent = "0 PTS";
    document.getElementById('update-quality-boost').textContent = "0";
    
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
    
    if(gameState.researchPts < updateInjectAmount && !gameState.isSandbox) return showToast('Insufficient Research Points', 'error');
    
    gameState.researchPts -= updateInjectAmount;
    p.isUpdating = true;
    p.updateType = selectedUpdateType;
    p.weeksLeft = selectedUpdateType === 'major' ? 6 : 2;
    p.researchBonus = updateInjectAmount;
    
    updateModal.classList.add('hidden');
    renderTab('dash');
    updateHUD();
    showToast(`Update started for ${p.name}`);
};

// --- RESTORED API MODAL LOGIC ---
const apiModal = document.getElementById('api-modal');
let selectedApiId = null;

function openApiModal(productId) {
    const p = gameState.products.find(x => x.id === productId);
    if(!p) return;
    selectedApiId = productId;
    if(!p.apiConfig) p.apiConfig = { active: false, price: 0, limit: 100 };
    
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

    document.getElementById('api-price-input').value = p.apiConfig.price;
    document.getElementById('api-price-slider').value = p.apiConfig.price;
    document.getElementById('api-limit-input').value = p.apiConfig.limit;
    document.getElementById('api-limit-slider').value = p.apiConfig.limit;
    
    apiModal.classList.remove('hidden');
}

const priceInput = document.getElementById('api-price-input');
const priceSlider = document.getElementById('api-price-slider');
if(priceInput) priceInput.oninput = () => { priceSlider.value = priceInput.value; };
if(priceSlider) priceSlider.oninput = () => { priceInput.value = priceSlider.value; };

const limitInput = document.getElementById('api-limit-input');
const limitSlider = document.getElementById('api-limit-slider');
if(limitInput) limitInput.oninput = () => { limitSlider.value = limitInput.value; };
if(limitSlider) limitSlider.oninput = () => { limitInput.value = limitSlider.value; };

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

// --- RESTORED VARIANT MODAL LOGIC ---
const variantModal = document.getElementById('variant-modal');
let selectedVariantId = null;
let selectedVariantType = null;
let variantInjectAmount = 0;

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
    
    let costMult = 1; let time = 2; let suffix = "";
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
        showToast('Insufficient Funds/Research', 'error'); return;
    }

    gameState.cash -= cost;
    gameState.researchPts -= variantInjectAmount;
    
    gameState.products.push({
        id: Date.now().toString(),
        name: `${parent.name} ${suffix}`,
        type: parent.type,
        version: 1.0,
        quality: parent.quality,
        revenue: 0, hype: 0, released: false,
        isUpdating: true, updateType: selectedVariantType,
        isOpenSource: parent.isOpenSource,
        weeksLeft: time,
        researchBonus: variantInjectAmount,
        contracts: [], apiConfig: { active: false, price: 0, limit: 100 },
        customFeatures: parent.customFeatures,
        specialty: parent.specialty
    });
    
    variantModal.classList.add('hidden'); renderTab('dash'); updateHUD();
    showToast(`Developing variant...`, 'success');
};


// GOD MODE SETTINGS
const settingsOverlay = document.getElementById('settings-overlay');
const undoBtn = document.getElementById('btn-undo-week');
const godModeToggle = document.getElementById('btn-toggle-godmode');

document.getElementById('nav-settings').addEventListener('click', () => {
    settingsOverlay.classList.remove('hidden');
    const dotsContainer = document.getElementById('history-dots');
    dotsContainer.innerHTML = '';
    for(let i=0; i<6; i++) {
        const isActive = i < historyStack.length;
        const dot = document.createElement('div');
        dot.className = `w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-cyan-500' : 'bg-slate-800'}`;
        dotsContainer.appendChild(dot);
    }
    if(historyStack.length === 0) {
        undoBtn.disabled = true;
        undoBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        undoBtn.disabled = false;
        undoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    lucide.createIcons();
});

document.getElementById('btn-close-settings').addEventListener('click', () => settingsOverlay.classList.add('hidden'));

undoBtn.addEventListener('click', () => {
    if(historyStack.length === 0) return;
    if(confirm('Revert time by 1 week?')) {
        gameState = historyStack.pop();
        saveGame();
        updateHUD();
        renderTab('dash');
        settingsOverlay.classList.add('hidden');
        showToast('Timeline Restored', 'success');
    }
});

godModeToggle.addEventListener('click', () => {
    if (!currentUser || currentUser.email !== ADMIN_EMAIL) return showToast('ACCESS DENIED', 'error');
    godMode = !godMode;
    const dot = godModeToggle.querySelector('div');
    if(godMode) {
        godModeToggle.classList.replace('bg-slate-800', 'bg-red-600');
        dot.classList.replace('left-1', 'left-9'); 
        document.getElementById('godmode-status').classList.remove('hidden');
    } else {
        godModeToggle.classList.replace('bg-red-600', 'bg-slate-800');
        dot.classList.replace('left-9', 'left-1');
        document.getElementById('godmode-status').classList.add('hidden');
    }
    updateHUD(); 
});

// --- NEW: MODE SELECTION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const landingScreen = document.getElementById('landing-screen');
    const btnAI = document.getElementById('btn-mode-ai');
    const btnMovie = document.getElementById('btn-mode-movie');

    if(btnAI) {
        btnAI.addEventListener('click', () => {
            landingScreen.classList.add('fade-out-up');
            setTimeout(() => {
                landingScreen.classList.add('hidden');
            }, 500);
        });
    }

    if(btnMovie) {
        btnMovie.addEventListener('click', () => {
            btnMovie.style.transform = 'scale(0.98)';
            btnMovie.style.borderColor = '#ec4899';
            setTimeout(() => {
                window.location.href = 'https://softworks-tycoon.xyz/movie-star';
            }, 150);
        });
    }
});
