// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU",
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

// Initialize Services
try { firebase.initializeApp(firebaseConfig); } catch (e) { console.error("Firebase Init Error:", e); }
const auth = firebase.auth();
const db = firebase.firestore();

// Global State
let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveInterval = null;

const APP_ID = 'softworks-tycoon';
const ADMIN_EMAIL = "anymousxe.info@gmail.com";
const SECRET_CODES = ['xavsf', 'tasik', 'uhgsa', 'kaidg']; // Valid for 30 real days

// --- DATA POOLS ---
const HARDWARE = [
    { id: 'gtx_cluster', name: 'Consumer GPU Cluster', cost: 2000, compute: 2, upkeep: 50 },
    { id: 'a100', name: 'A100 Rack', cost: 8000, compute: 8, upkeep: 150 },
    { id: 'h100', name: 'H100 Cluster', cost: 15000, compute: 15, upkeep: 250 },
    { id: 'h200', name: 'Nvidia H200', cost: 35000, compute: 40, upkeep: 500, reqTech: 'h200_unlock' },
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
    { id: 'blackwell_arch', name: 'Blackwell Arch', cost: 300, desc: 'Unlock B200 Chips' },
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

const SHOP_POOL = [
    { id: 'data_s', name: 'Data Set (Small)', cost: 5000, effect: 'Research +100', type: 'research', amount: 100 },
    { id: 'data_m', name: 'Data Set (Medium)', cost: 15000, effect: 'Research +350', type: 'research', amount: 350 },
    { id: 'data_l', name: 'Data Set (Large)', cost: 40000, effect: 'Research +1000', type: 'research', amount: 1000 },
    { id: 'data_xl', name: 'The Entire Internet', cost: 500000, effect: 'Research +15000', type: 'research', amount: 15000 },
    { id: 'consultant', name: 'AI Consultant', cost: 10000, effect: 'Dev Speed Boost (Instant)', type: 'buff' },
    { id: 'server_cool', name: 'Liquid Cooling', cost: 25000, effect: 'Compute Efficiency +5%', type: 'buff' },
    { id: 'coffee', name: 'Espresso Machine', cost: 2000, effect: 'Morale +10', type: 'cosmetic' },
    { id: 'neon', name: 'Neon Office Lights', cost: 5000, effect: 'Vibes +100', type: 'cosmetic' }
];

const REVIEW_TEXTS = {
    good: ["Literally cracked. 🔥", "Best AI I've used.", "W release.", "Game changer fr.", "Take my money 💰"],
    mid: ["It's mid but okay.", "Does the job i guess.", "Waiting for updates.", "Kinda buggy."],
    bad: ["Bro what is this? 💀", "Refunded.", "Laggier than my grandma's PC.", "This ain't it chief."]
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

        if (user.email === ADMIN_EMAIL) {
            injectAdminButton();
        }

        loadSaves();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('menu-screen').classList.add('hidden');
    }
});

function injectAdminButton() {
    if(document.getElementById('admin-keys-btn')) return;
    const header = document.querySelector('#menu-screen .flex');
    const btn = document.createElement('button');
    btn.id = 'admin-keys-btn';
    btn.className = 'ml-4 bg-red-900/50 border border-red-500 text-red-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-red-800 transition';
    btn.innerHTML = `<i data-lucide="shield-alert" class="inline w-3 h-3 mr-1"></i> Admin Keys`;
    btn.onclick = () => { alert(`-- CLASSIFIED CODES --\n\n${SECRET_CODES.join('\n')}\n\n(Each valid for 30 Days)`); };
    header.appendChild(btn);
    lucide.createIcons();
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
            
            // Check Premium Status based on Real Time
            let isPremiumActive = false;
            if (data.premiumExpiry) {
                const now = Date.now();
                if (data.premiumExpiry > now) {
                    isPremiumActive = true;
                }
            }

            const el = document.createElement('div');
            // Premium Glow Effect
            const glowClass = isPremiumActive ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] bg-yellow-900/5' : 'hover:border-cyan-500';
            
            el.className = `glass-panel p-8 rounded-2xl cursor-pointer transition-all group relative hover:-translate-y-1 ${glowClass}`;
            el.innerHTML = `
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">${data.companyName}</h3>
                        <div class="mt-2 flex gap-2">
                            <span class="inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${data.isSandbox ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-400'}">
                                ${data.isSandbox ? 'Sandbox Mode' : 'Career Mode'}
                            </span>
                            ${isPremiumActive ? '<span class="inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-yellow-500 text-black">VIP</span>' : ''}
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

// Create Save Logic
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
        premiumExpiry: null,
        lastDailyReward: 0,
        hardware: [{ typeId: 'gtx_cluster', count: 1 }],
        products: [],
        reviews: [],
        unlockedTechs: [],
        shopStock: [],
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
    if(!gameState.reviews) gameState.reviews = [];
    if(!gameState.shopStock) refreshShop(); 
    
    // Check Premium Status
    checkPremiumStatus();
    
    // Check Daily Reward (IRL 24 Hour Check)
    if (gameState.isPremium) {
        checkDailyReward();
    }

    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    updateHUD();
    renderTab('dash');
    lucide.createIcons();
    
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

function checkPremiumStatus() {
    if (gameState.premiumExpiry) {
        const now = Date.now();
        if (now < gameState.premiumExpiry) {
            gameState.isPremium = true; 
        } else {
            gameState.isPremium = false;
            gameState.premiumExpiry = null;
        }
    } else {
        gameState.isPremium = false;
    }
}

function checkDailyReward() {
    const now = Date.now();
    const lastClaim = gameState.lastDailyReward || 0;
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (now - lastClaim > oneDayMs) {
        gameState.cash += 50000;
        gameState.lastDailyReward = now;
        showToast("DAILY VIP BONUS: +$50,000 💸", "success");
        saveGame();
    }
}

function saveGame() {
    if(!activeSaveId || !gameState) return;
    const saveState = { ...gameState };
    delete saveState.isPremium; // Don't save the temp flag, rely on timestamp
    
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
      .doc(activeSaveId).update(saveState).catch(console.error);
}

// Rename
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

function refreshShop() {
    gameState.shopStock = [];
    const pool = [...SHOP_POOL]; 
    for(let i=0; i<4; i++) {
        if(pool.length === 0) break;
        const idx = Math.floor(Math.random() * pool.length);
        gameState.shopStock.push(pool[idx]);
        pool.splice(idx, 1);
    }
}

// --- ADVANCE WEEK ---
document.getElementById('btn-next-week').addEventListener('click', () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`;
    lucide.createIcons();

    setTimeout(() => {
        gameState.week++;
        if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

        if(gameState.week % 4 === 0) {
            refreshShop();
            showToast("New Shop Inventory Available!");
        }

        // --- RIVAL AI SIMULATION ---
        if(Math.random() > 0.85) { // 15% chance per week for a rival to drop
            const rival = RIVALS[Math.floor(Math.random() * RIVALS.length)];
            const release = rival.releases[Math.floor(Math.random() * rival.releases.length)];
            showToast(`COMPETITOR ALERT: ${rival.name} released ${release}!`, 'error');
            
            // Effect: Your products lose quality/hype
            gameState.products.forEach(p => {
                if(p.released) {
                    p.hype = Math.max(0, p.hype - 10);
                    p.quality = Math.max(0, p.quality - 2); // Your tech is getting old
                }
            });
        }

        const upkeep = gameState.hardware.reduce((sum, hw) => sum + (HARDWARE.find(x => x.id === hw.typeId).upkeep * hw.count), 0);
        gameState.cash -= upkeep;

        // Passive Research
        gameState.researchPts += Math.floor(gameState.reputation / 5) + Math.floor(getCompute() * 0.05) + 5;

        // Process Products
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
                        
                        // Apply Research Injection Bonus
                        const bonus = p.researchBonus || 0;
                        const baseQ = Math.floor(Math.random() * 40) + 50;
                        p.quality = Math.min(100, baseQ + bonus);
                        
                        p.version = 1.0;
                        p.hype = 100;
                        gameState.reputation += 10;
                        showToast(`🚀 ${p.name} Launched! Quality: ${p.quality}/100`, 'success');
                        generateReview(p);
                    }
                }
            }

            if(p.released && !p.isUpdating) {
                let weeklyRev = 0;
                const organicUsers = Math.floor((p.quality * p.hype * 10));
                const organicRev = Math.floor(organicUsers * 0.1); 
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

                if(Math.random() > 0.95) generateReview(p);
            }
        });

        if(gameState.week % 4 === 0) {
           COMPANIES.forEach(c => c.budget = Math.max(500, c.budget + (Math.floor(Math.random()*200)-100)));
        }

        updateHUD();
        const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
        renderTab(activeTab);

        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-current"></i> Next`;
        lucide.createIcons();
    }, 400); 
});

function generateReview(product) {
    const sentiment = product.quality > 80 ? 'good' : (product.quality < 40 ? 'bad' : 'mid');
    const texts = REVIEW_TEXTS[sentiment];
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

function updateHUD() {
    document.getElementById('hud-company-name').textContent = gameState.companyName;
    document.getElementById('hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('hud-cash').className = gameState.cash < 0 ? 'text-red-500 text-lg font-bold' : 'text-green-400 text-lg font-bold';
    document.getElementById('hud-compute').textContent = `${getCompute()} TF`;
    document.getElementById('hud-research').textContent = `${Math.floor(gameState.researchPts)} PTS`;
    document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`;
}

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

                    <div class="flex gap-3">
                        <button class="bg-slate-800 text-white px-4 py-3 text-[10px] font-bold flex-1 hover:bg-slate-700 btn-patch rounded-xl tracking-wider transition-colors" data-id="${p.id}">PATCH (v${(p.version+0.1).toFixed(1)})</button>
                        <button class="bg-white text-black px-4 py-3 text-[10px] font-bold flex-1 hover:bg-cyan-400 btn-major rounded-xl tracking-wider transition-colors" data-id="${p.id}">MAJOR (v${Math.floor(p.version)+1}.0)</button>
                        <button class="text-slate-500 hover:text-red-500 hover:bg-red-900/10 px-3 btn-delete rounded-xl transition-colors" data-id="${p.id}"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                    </div>
                `;
                card.querySelector('.btn-patch').onclick = () => startUpdate(p.id, 'minor');
                card.querySelector('.btn-major').onclick = () => startUpdate(p.id, 'major');
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
        
        // Add Player Card
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

    if(tab === 'server') {
        content.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="server-grid"></div>`;
        const grid = document.getElementById('server-grid');
        HARDWARE.forEach(h => {
            const locked = h.reqTech && !gameState.unlockedTechs.includes(h.reqTech);
            const owned = gameState.hardware.find(x => x.typeId === h.id)?.count || 0;
            const el = document.createElement('div');
            el.className = `p-6 border rounded-2xl transition-all ${locked ? 'border-slate-800 opacity-40 bg-slate-900/10' : 'border-slate-700 bg-slate-900/40 hover:border-blue-500/50'}`;
            el.innerHTML = `<div class="text-white font-bold text-lg">${h.name}</div><div class="text-slate-500 text-xs mb-4">${h.compute} TF</div><div class="text-4xl font-black text-white mb-4">${owned}</div><button class="w-full border border-slate-600 text-white py-2 text-xs font-bold hover:bg-white hover:text-black rounded transition" ${locked ? 'disabled' : ''}>BUY $${h.cost.toLocaleString()}</button>`;
            if(!locked) el.querySelector('button').onclick = () => { if(gameState.cash >= h.cost) { gameState.cash -= h.cost; const hw = gameState.hardware.find(x => x.typeId === h.id); if(hw) hw.count++; else gameState.hardware.push({typeId:h.id, count:1}); updateHUD(); renderTab('server'); showToast(`Purchased ${h.name}`, 'success'); } else showToast('Insufficient Funds', 'error'); };
            grid.appendChild(el);
        });
    }

    if(tab === 'research') {
        content.innerHTML = `<div class="flex items-center gap-6 mb-8"><h2 class="text-5xl font-black text-white tracking-tighter">R&D LAB</h2><div class="text-purple-400 font-mono font-bold">${Math.floor(gameState.researchPts)} PTS</div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="research-grid"></div>`;
        const grid = document.getElementById('research-grid');
        RESEARCH.forEach(r => {
            const unlocked = gameState.unlockedTechs.includes(r.id);
            const el = document.createElement('div');
            el.className = `p-8 border rounded-2xl transition-all ${unlocked ? 'border-purple-500 bg-purple-900/10' : 'border-slate-800 bg-slate-900/40 hover:border-purple-500/50'}`;
            el.innerHTML = `<h3 class="font-bold text-white mb-2">${r.name}</h3><p class="text-xs text-slate-500 mb-4">${r.desc}</p>${!unlocked ? `<button class="w-full bg-slate-800 hover:bg-purple-600 text-white font-bold py-3 rounded-xl text-xs tracking-widest transition-colors">UNLOCK (${r.cost} PTS)</button>` : '<span class="text-purple-500 font-bold text-xs">ACQUIRED</span>'}`;
            if(!unlocked) el.querySelector('button').onclick = () => { if(gameState.researchPts >= r.cost) { gameState.researchPts -= r.cost; gameState.unlockedTechs.push(r.id); updateHUD(); renderTab('research'); showToast('Researched!', 'success'); } else showToast('Need Points', 'error'); };
            grid.appendChild(el);
        });
    }

    if(tab === 'dev') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">NEW PROJECT</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" id="dev-types"></div>
                <div class="glass-panel p-8 rounded-2xl h-fit border-l-4 border-cyan-500">
                    <input id="new-proj-name" class="w-full bg-black/50 border border-slate-700 p-4 text-white mb-6 rounded-xl focus:border-cyan-500 outline-none font-bold" placeholder="Project Name">
                    
                    <!-- Research Injection -->
                    <div class="mb-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                        <div class="flex justify-between text-xs font-bold text-purple-300 mb-2">
                            <span>Research Injection</span>
                            <span id="inject-val">0 PTS</span>
                        </div>
                        <input type="range" id="research-inject" min="0" max="${gameState.researchPts}" value="0" class="w-full accent-purple-500">
                        <div class="text-[10px] text-slate-400 mt-2 text-right">+<span id="quality-boost">0</span> Quality Boost</div>
                    </div>

                    <div class="flex items-center gap-3 mb-8 cursor-pointer" id="btn-toggle-opensource"><div class="w-5 h-5 border-2 border-slate-500 rounded" id="check-os"></div><span class="text-sm text-white font-bold">Open Source</span></div>
                    <button id="btn-start-dev" class="w-full bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-white/5 tracking-widest text-sm">INITIALIZE</button>
                </div>
            </div>
        `;
        let selectedType = null, openSource = false, injectAmount = 0;
        const typeContainer = document.getElementById('dev-types');
        
        // Setup Slider Logic
        const slider = document.getElementById('research-inject');
        const valLabel = document.getElementById('inject-val');
        const boostLabel = document.getElementById('quality-boost');
        
        slider.oninput = (e) => {
            injectAmount = parseInt(e.target.value);
            valLabel.textContent = `${injectAmount} PTS`;
            // 100 Points = 1 Quality
            boostLabel.textContent = Math.floor(injectAmount / 100);
        };

        PRODUCTS.forEach(p => {
            const locked = p.reqTech && !gameState.unlockedTechs.includes(p.reqTech);
            const btn = document.createElement('div');
            btn.className = `p-6 border cursor-pointer rounded-2xl transition-all ${locked ? 'border-slate-800 opacity-40' : 'border-slate-700 hover:border-cyan-500'}`;
            btn.innerHTML = `<div class="font-bold text-white text-lg">${p.name}</div><div class="text-xs text-slate-500">$${p.cost.toLocaleString()} | ${p.compute} TF</div>`;
            if(!locked) btn.onclick = () => { document.querySelectorAll('#dev-types > div').forEach(d => d.classList.remove('border-cyan-500')); btn.classList.add('border-cyan-500'); selectedType = p; };
            typeContainer.appendChild(btn);
        });
        document.getElementById('btn-toggle-opensource').onclick = () => { openSource = !openSource; document.getElementById('check-os').className = `w-5 h-5 border-2 rounded ${openSource ? 'bg-green-500 border-green-500' : 'border-slate-500'}`; };
        document.getElementById('btn-start-dev').onclick = () => {
            const name = document.getElementById('new-proj-name').value;
            if(!name || !selectedType) return showToast('Invalid Config', 'error');
            if(gameState.cash < selectedType.cost && !gameState.isSandbox) return showToast('No Funds', 'error');
            if(getCompute() < selectedType.compute) return showToast('Need Compute', 'error');
            
            gameState.cash -= selectedType.cost;
            gameState.researchPts -= injectAmount; // Deduct injected points
            
            gameState.products.push({ 
                id: Date.now().toString(), 
                name, 
                type: selectedType.id, 
                version: 1.0, 
                quality: 0, 
                revenue: 0, 
                hype: 0, 
                released: false, 
                isUpdating: false, 
                isOpenSource: openSource, 
                weeksLeft: selectedType.time, 
                researchBonus: Math.floor(injectAmount / 100), // Save bonus for release
                contracts: [] 
            });
            updateHUD(); showToast('Started Dev', 'success'); renderTab('dash');
        };
    }

    if(tab === 'market') {
        content.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="market-grid"></div>`;
        const grid = document.getElementById('market-grid');
        COMPANIES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl';
            el.innerHTML = `<div class="flex justify-between items-center mb-6"><h3 class="font-bold text-white text-lg">${c.name}</h3><span class="text-green-400 font-mono text-xs">$${c.budget.toLocaleString()}/wk</span></div><div class="space-y-2" id="contracts-${c.name.replace(/\s+/g, '')}"></div>`;
            const pList = el.querySelector(`#contracts-${c.name.replace(/\s+/g, '')}`);
            const commercialProducts = gameState.products.filter(p => p.released && !p.isOpenSource);
            if(commercialProducts.length === 0) pList.innerHTML = `<div class="text-xs text-slate-600 italic">No products.</div>`;
            commercialProducts.forEach(p => {
                const active = p.contracts.includes(c.name);
                const btn = document.createElement('button');
                btn.className = `w-full flex justify-between items-center text-xs p-3 rounded-lg border transition-all ${active ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`;
                btn.innerHTML = `<span>${p.name}</span>${active ? '<i data-lucide="check" class="w-3 h-3"></i>' : 'PITCH'}`;
                btn.onclick = () => {
                    if(active) p.contracts = p.contracts.filter(x => x !== c.name);
                    else { p.contracts.push(c.name); showToast('Contract Signed!', 'success'); }
                    renderTab('market');
                };
                pList.appendChild(btn);
            });
            grid.appendChild(el);
        });
    }

    if(tab === 'ads') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">ADVERTISING MANAGER</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="ads-grid"></div>
        `;
        const grid = document.getElementById('ads-grid');
        AD_CAMPAIGNS.forEach(ad => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl hover:border-yellow-500/50 transition-colors';
            el.innerHTML = `
                <div class="text-yellow-400 mb-4"><i data-lucide="megaphone" class="w-8 h-8"></i></div>
                <h3 class="font-bold text-white text-lg leading-tight mb-2">${ad.name}</h3>
                <div class="text-xs text-slate-400 mb-6 font-mono">Impact: +${ad.hype} Hype<br>Cost: $${ad.cost.toLocaleString()}</div>
                <button class="w-full bg-white text-black font-bold py-3 rounded-xl text-xs tracking-widest hover:bg-yellow-400 transition-colors">RUN CAMPAIGN</button>
            `;
            el.querySelector('button').onclick = () => {
                if(gameState.cash >= ad.cost) {
                    gameState.cash -= ad.cost;
                    // Boost hype of all released products
                    gameState.products.forEach(p => { if(p.released) p.hype = Math.min(100, p.hype + ad.hype); });
                    updateHUD();
                    showToast('Campaign Launched! 📈', 'success');
                } else showToast('Insufficient Funds', 'error');
            };
            grid.appendChild(el);
        });
        lucide.createIcons();
    }

    if(tab === 'reviews') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">PUBLIC SENTIMENT</h2>
            ${!gameState.reviews || gameState.reviews.length === 0 ? '<div class="text-slate-500 italic">No reviews yet.</div>' : '<div class="space-y-4" id="reviews-list"></div>'}
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

    if(tab === 'shop') {
        content.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white tracking-tight">CORPORATE ASSETS</h2>
                <div class="text-xs text-slate-500 font-mono uppercase">Refreshes Monthly</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>
        `;
        const grid = document.getElementById('shop-grid');
        
        // --- REDEMPTION BOX ---
        const redeemEl = document.createElement('div');
        redeemEl.className = 'glass-panel p-6 rounded-2xl border border-yellow-500/30 bg-yellow-900/10';
        
        let daysLeft = 0;
        if(gameState.premiumExpiry) {
            daysLeft = Math.ceil((gameState.premiumExpiry - Date.now()) / (1000 * 60 * 60 * 24));
        }

        if(gameState.isPremium) {
             redeemEl.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="font-bold text-white text-xl">VIP STATUS</h3>
                    <span class="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">ACTIVE</span>
                </div>
                <p class="text-xs text-slate-400 mb-6 font-mono">Time Remaining: ${daysLeft > 0 ? daysLeft : 0} Days</p>
                <div class="text-xs text-yellow-400 font-bold">Perk: +$50,000 / 24hrs (IRL)</div>
            `;
        } else {
            redeemEl.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="font-bold text-white text-xl">REDEEM CODE</h3>
                    <span class="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PRO</span>
                </div>
                <p class="text-xs text-slate-400 mb-4">Enter a valid code to unlock VIP status for 30 Days.</p>
                <input id="code-input" class="w-full bg-black/50 border border-yellow-500/30 text-white p-3 rounded-lg mb-3 text-xs font-mono" placeholder="Enter Code...">
                <button id="btn-redeem" class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors">ACTIVATE</button>
            `;
        }
        
        grid.appendChild(redeemEl);
        
        // Logic for Redeem button
        if(!gameState.isPremium && redeemEl.querySelector('#btn-redeem')) {
            redeemEl.querySelector('#btn-redeem').onclick = () => {
                const code = document.getElementById('code-input').value.toLowerCase().trim();
                if(SECRET_CODES.includes(code)) {
                    const now = Date.now();
                    // Add 30 days in milliseconds
                    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                    
                    gameState.premiumExpiry = now + thirtyDays;
                    gameState.isPremium = true;
                    gameState.cash += 50000; // Immediate bonus
                    
                    saveGame();
                    showToast("Code Redeemed! VIP Active for 30 Days.", "success");
                    updateHUD();
                    renderTab('shop');
                } else {
                    showToast("Invalid Code.", "error");
                }
            };
        }

        // Render Dynamic Stock
        if(gameState.shopStock) {
            gameState.shopStock.forEach(item => {
                const el = document.createElement('div');
                el.className = 'glass-panel p-6 rounded-2xl hover:border-cyan-500/50 transition-colors';
                el.innerHTML = `<h3 class="font-bold text-white text-lg mb-1">${item.name}</h3><div class="text-xs text-cyan-400 mb-4 font-mono">${item.effect}</div><button class="w-full border border-slate-700 text-white font-bold py-3 rounded-xl hover:bg-white hover:text-black transition-colors">BUY $${item.cost.toLocaleString()}</button>`;
                el.querySelector('button').onclick = () => {
                    if(gameState.cash >= item.cost) {
                        gameState.cash -= item.cost;
                        if(item.type === 'research') gameState.researchPts += item.amount;
                        if(item.type === 'cosmetic') showToast('Cosmetic Purchased!', 'success');
                        // Add buff logic here if needed
                        updateHUD();
                        showToast('Purchased!', 'success');
                        // Remove from stock to simulate single stock
                        gameState.shopStock = gameState.shopStock.filter(x => x !== item);
                        renderTab('shop');
                    } else showToast('Insufficient Funds!', 'error');
                };
                grid.appendChild(el);
            });
        }
    }
}

function startUpdate(id, type) {
    const p = gameState.products.find(x => x.id === id);
    if(p) { p.isUpdating = true; p.updateType = type; p.weeksLeft = type === 'major' ? 6 : 2; renderTab('dash'); showToast(`Update started for ${p.name}`); }
}
