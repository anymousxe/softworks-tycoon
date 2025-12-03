// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU",
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase Init Error:", e);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Global State
let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveInterval = null;

// --- GAME DATA ---
const APP_ID = 'softworks-tycoon';

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

const COMPANIES = [
    { name: 'Indie Devs', budget: 500 },
    { name: 'Startup Inc', budget: 1500 },
    { name: 'Facebooc', budget: 3000 },
    { name: 'StreamFlix', budget: 4000 },
    { name: 'Microhard', budget: 5000 },
    { name: 'Joggle', budget: 6000 },
    { name: 'Amacon', budget: 7000 },
    { name: 'NvidiaX', budget: 8000 },
    { name: 'Tessla', budget: 9000 },
    { name: 'Fruit Co', budget: 10000 },
    { name: 'OpenAI (Real)', budget: 12000 },
    { name: 'Wall Street', budget: 15000 },
    { name: 'SpaceY', budget: 18000 },
    { name: 'Pentagon', budget: 25000 },
    { name: 'Global Gov', budget: 50000 }
];

const INFLUENCERS = [
    { id: 'tech_tuber', name: 'Marques Brownlee', cost: 50000, impact: 20, type: 'Review' },
    { id: 'linus', name: 'Linus Tech Tips', cost: 40000, impact: 15, type: 'Showcase' },
    { id: 'mr_beast', name: 'Mr Beast', cost: 1000000, impact: 80, type: 'Viral Video' },
    { id: 'news_outlet', name: 'TechCrunch', cost: 15000, impact: 10, type: 'Article' },
    { id: 'hacker_news', name: 'Hacker News', cost: 5000, impact: 5, type: 'Post' }
];

const SHOP_ITEMS = [
    { id: 'research_boost_s', name: 'Data Set (Small)', cost: 5000, effect: 'Research +100', type: 'research', amount: 100 },
    { id: 'research_boost_l', name: 'Data Set (Large)', cost: 20000, effect: 'Research +500', type: 'research', amount: 500 },
    { id: 'consultant', name: 'AI Consultant', cost: 10000, effect: 'Dev Speed Boost (1wk)', type: 'buff', duration: 1 },
    { id: 'coffee', name: 'Espresso Machine', cost: 2000, effect: 'Morale +10', type: 'cosmetic' }
];

const REVIEW_TEXTS = {
    good: ["Literally cracked. 🔥", "Best AI I've used.", "W release.", "Game changer fr.", "Take my money 💰"],
    mid: ["It's mid but okay.", "Does the job i guess.", "Waiting for updates.", "Kinda buggy."],
    bad: ["Bro what is this? 💀", "Refunded.", "Laggier than my grandma's PC.", "This ain't it chief."]
};

// --- 2. AUTH & SCREEN MANAGEMENT ---

auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        
        // Update User Profile in Menu
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
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert(e.message));
});

document.getElementById('btn-login-guest').addEventListener('click', () => {
    auth.signInAnonymously().catch(e => alert(e.message));
});

document.getElementById('btn-logout').addEventListener('click', () => {
    auth.signOut().then(() => {
        location.reload();
    });
});

// --- 3. SAVE SYSTEM ---

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
                    <button class="text-slate-600 hover:text-red-500 delete-btn p-2 transition-colors" data-id="${doc.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="flex justify-between text-sm font-mono text-slate-500 border-t border-slate-700/50 pt-4">
                    <div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> W${data.week} Y${data.year}</div>
                    <div class="${data.cash < 0 ? 'text-red-500' : 'text-green-400'} font-bold">$${data.cash.toLocaleString()}</div>
                </div>
            `;
            
            el.addEventListener('click', (e) => {
                if(e.target.closest('.delete-btn')) return;
                startGame(doc.id, data);
            });

            el.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm('Delete this save file forever?')) savesRef.doc(doc.id).delete();
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
    div.querySelector('.font-bold').classList.toggle('text-yellow-500', isSandbox);
    div.querySelector('i').classList.toggle('text-yellow-500', isSandbox);
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
        hardware: [{ typeId: 'gtx_cluster', count: 1 }],
        products: [],
        reviews: [], // New reviews array
        unlockedTechs: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').add(newSave);
        document.getElementById('create-screen').classList.add('hidden');
        document.getElementById('inp-comp-name').value = '';
    } catch(e) {
        alert("Error creating save: " + e.message);
    }
});

document.getElementById('btn-cancel-create').addEventListener('click', () => {
    document.getElementById('create-screen').classList.add('hidden');
});

// --- 4. GAME LOOP & LOGIC ---

function startGame(id, data) {
    activeSaveId = id;
    gameState = data;
    if(!gameState.reviews) gameState.reviews = []; // Backwards compatibility
    
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    updateHUD();
    renderTab('dash');
    lucide.createIcons();
    
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

function saveGame() {
    if(!activeSaveId || !gameState) return;
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
      .doc(activeSaveId).update(gameState).catch(e => console.error("Auto-save failed:", e));
}

// Rename Feature
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

    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        setTimeout(() => el.remove(), 500);
    }, 4000);

    document.getElementById('hud-ticker').innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> ${msg}`;
}

// --- CORE: Advance Week ---
document.getElementById('btn-next-week').addEventListener('click', () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`;
    lucide.createIcons();

    setTimeout(() => {
        gameState.week++;
        if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

        const upkeep = gameState.hardware.reduce((sum, hw) => {
            const t = HARDWARE.find(x => x.id === hw.typeId);
            return sum + (t.upkeep * hw.count);
        }, 0);
        gameState.cash -= upkeep;

        // Passive Research
        const passiveResearch = Math.floor(gameState.reputation / 5) + Math.floor(getCompute() * 0.05) + 5;
        gameState.researchPts += passiveResearch;

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
                        p.quality = Math.floor(Math.random() * 40) + 50;
                        p.version = 1.0;
                        p.hype = 100;
                        gameState.reputation += 10;
                        showToast(`🚀 ${p.name} Launched!`, 'success');
                        generateReview(p);
                    }
                }
            }

            if(p.released && !p.isUpdating) {
                let weeklyRev = 0;
                // B2B Revenue
                p.contracts.forEach(cName => {
                    const comp = COMPANIES.find(c => c.name === cName);
                    if(comp) weeklyRev += Math.floor(comp.budget * (p.quality / 100));
                });
                
                // Hype Decay
                p.hype = Math.max(0, p.hype - 2);

                if(p.isOpenSource) {
                    if(p.hype > 0) gameState.reputation += 0.5;
                } else {
                    gameState.cash += weeklyRev;
                    p.revenue += weeklyRev;
                }

                // Random Review Chance
                if(Math.random() > 0.95) generateReview(p);
            }
        });

        // Market Flux (Simulate economy changes)
        if(gameState.week % 4 === 0) {
           // Every 4 weeks, budgets shift slightly
           COMPANIES.forEach(c => {
               const shift = Math.floor(Math.random() * 200) - 100;
               c.budget = Math.max(500, c.budget + shift);
           });
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
    
    // Keep list clean
    if(gameState.reviews.length > 20) gameState.reviews.pop();
}

// --- UI RENDERING ---

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
            loadSaves(); // refresh saves
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
            
            if(p.isOpenSource) {
                card.innerHTML += `<div class="absolute top-0 right-0 bg-green-500 text-black text-[9px] font-black px-3 py-1 rounded-bl-xl tracking-widest">OPEN SOURCE</div>`;
            }

            if(p.released && !p.isUpdating) {
                card.innerHTML += `
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-2xl font-bold text-white tracking-tight">${p.name} <span class="text-cyan-500 text-sm font-mono">v${p.version}</span></h3>
                            <div class="text-xs text-slate-500 font-bold mt-1 bg-slate-800 inline-block px-2 py-0.5 rounded">${p.type.toUpperCase()}</div>
                        </div>
                        <div class="text-right mt-2">
                            <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Revenue</div>
                            <div class="text-green-400 font-mono font-bold">$${p.isOpenSource ? 0 : Math.floor(p.revenue * 0.01).toLocaleString()}/wk</div>
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

    if(tab === 'server') {
        content.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="server-grid"></div>`;
        const grid = document.getElementById('server-grid');
        
        HARDWARE.forEach(h => {
            const locked = h.reqTech && !gameState.unlockedTechs.includes(h.reqTech);
            const owned = gameState.hardware.find(x => x.typeId === h.id)?.count || 0;
            
            const el = document.createElement('div');
            el.className = `p-6 border rounded-2xl transition-all ${locked ? 'border-slate-800 opacity-40 bg-slate-900/10' : 'border-slate-700 bg-slate-900/40 hover:border-blue-500/50'}`;
            el.innerHTML = `
                <div class="flex justify-between mb-2">
                    <div class="text-white font-bold text-lg leading-tight">${h.name}</div>
                    ${locked ? '<i data-lucide="lock" class="w-4 h-4 text-slate-600"></i>' : ''}
                </div>
                <div class="text-slate-500 text-xs mb-6 font-mono">${h.compute} TF / $${h.upkeep} wk</div>
                <div class="text-4xl font-black text-white mb-6">${owned}</div>
                <button class="w-full border border-slate-600 text-white py-3 text-[10px] tracking-widest font-bold hover:bg-white hover:text-black transition-colors rounded-xl uppercase" ${locked ? 'disabled' : ''}>
                    BUY $${h.cost.toLocaleString()}
                </button>
            `;
            if(!locked) {
                el.querySelector('button').onclick = () => {
                    if(gameState.cash >= h.cost) {
                        gameState.cash -= h.cost;
                        const hw = gameState.hardware.find(x => x.typeId === h.id);
                        if(hw) hw.count++; else gameState.hardware.push({ typeId: h.id, count: 1 });
                        updateHUD();
                        renderTab('server');
                        showToast(`Purchased ${h.name}`, 'success');
                    } else showToast('Insufficient Funds!', 'error');
                };
            }
            grid.appendChild(el);
        });
        lucide.createIcons();
    }

    if(tab === 'research') {
        content.innerHTML = `
            <div class="flex items-center gap-6 mb-8">
                <h2 class="text-5xl font-black text-white tracking-tighter">R&D LAB</h2>
                <div class="text-purple-400 font-mono bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-500/30 font-bold">${gameState.researchPts} PTS AVAILABLE</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="research-grid"></div>
        `;
        const grid = document.getElementById('research-grid');
        
        RESEARCH.forEach(r => {
            const unlocked = gameState.unlockedTechs.includes(r.id);
            const el = document.createElement('div');
            el.className = `p-8 border rounded-2xl transition-all relative overflow-hidden ${unlocked ? 'border-purple-500 bg-purple-900/10' : 'border-slate-800 bg-slate-900/40 hover:border-purple-500/50'}`;
            el.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <i data-lucide="flask-conical" class="${unlocked ? 'text-purple-500' : 'text-slate-600'} w-6 h-6"></i>
                    ${unlocked ? '<span class="bg-purple-500 text-black text-[9px] font-black px-2 py-1 rounded tracking-widest">ACQUIRED</span>' : ''}
                </div>
                <h3 class="font-bold text-white mb-2 text-xl">${r.name}</h3>
                <p class="text-xs text-slate-500 mb-6 leading-relaxed">${r.desc}</p>
                ${!unlocked ? `<button class="w-full bg-slate-800 hover:bg-purple-600 text-white font-bold py-3 rounded-xl text-xs tracking-widest transition-colors">UNLOCK (${r.cost} PTS)</button>` : ''}
            `;
            
            if(!unlocked) {
                el.querySelector('button').onclick = () => {
                    if(gameState.researchPts >= r.cost) {
                        gameState.researchPts -= r.cost;
                        gameState.unlockedTechs.push(r.id);
                        updateHUD();
                        renderTab('research');
                        showToast(`Researched: ${r.name}`, 'success');
                    } else showToast("Need more Research Points", 'error');
                }
            }
            grid.appendChild(el);
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
        
        let selectedType = null;
        let openSource = false;
        const typeContainer = document.getElementById('dev-types');
        
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
                    <div>Cost: $${p.cost.toLocaleString()}</div>
                    <div>Compute: ${p.compute} TF</div>
                </div>
            `;
            if(!locked) {
                btn.onclick = () => {
                    document.querySelectorAll('#dev-types > div').forEach(d => d.classList.remove('border-cyan-500', 'bg-cyan-900/20'));
                    btn.classList.add('border-cyan-500', 'bg-cyan-900/20');
                    selectedType = p;
                    document.getElementById('proj-cost-preview').innerHTML = `
                        <div class="flex justify-between mb-1"><span>Cost</span> <span class="text-white">$${p.cost.toLocaleString()}</span></div>
                        <div class="flex justify-between mb-1"><span>Time</span> <span class="text-white">${p.time} Weeks</span></div>
                        <div class="flex justify-between"><span>Compute</span> <span class="${getCompute() >= p.compute ? 'text-green-400' : 'text-red-500'}">${p.compute} TF</span></div>
                    `;
                };
            }
            typeContainer.appendChild(btn);
        });

        document.getElementById('btn-toggle-opensource').onclick = () => {
            openSource = !openSource;
            const box = document.getElementById('check-os');
            box.className = `w-5 h-5 border-2 rounded transition-colors ${openSource ? 'bg-green-500 border-green-500' : 'border-slate-500'}`;
        };

        document.getElementById('btn-start-dev').onclick = () => {
            const name = document.getElementById('new-proj-name').value;
            if(!name || !selectedType) return showToast('Select project type and name!', 'error');
            if(gameState.cash < selectedType.cost && !gameState.isSandbox) return showToast('Insufficient Funds!', 'error');
            if(getCompute() < selectedType.compute) return showToast(`Need ${selectedType.compute} TF Compute!`, 'error');

            gameState.cash -= selectedType.cost;
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
                contracts: []
            });
            updateHUD();
            showToast(`Development started: ${name}`, 'success');
            renderTab('dash');
        };
        lucide.createIcons();
    }
    
    // Market Logic
    if(tab === 'market') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">B2B MARKETPLACE</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="market-grid"></div>
        `;
        const grid = document.getElementById('market-grid');
        
        COMPANIES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl';
            el.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-white text-lg">${c.name}</h3>
                    <span class="text-green-400 font-mono text-xs bg-green-900/20 px-2 py-1 rounded border border-green-500/20">$${c.budget.toLocaleString()}/wk</span>
                </div>
                <div class="space-y-2" id="contracts-${c.name.replace(/\s+/g, '')}"></div>
            `;
            
            const pList = el.querySelector(`#contracts-${c.name.replace(/\s+/g, '')}`);
            const commercialProducts = gameState.products.filter(p => p.released && !p.isOpenSource);
            
            if(commercialProducts.length === 0) {
                pList.innerHTML = `<div class="text-xs text-slate-600 italic py-2 text-center">No products to pitch.</div>`;
            } else {
                commercialProducts.forEach(p => {
                    const active = p.contracts.includes(c.name);
                    const btn = document.createElement('button');
                    btn.className = `w-full flex justify-between items-center text-xs p-3 rounded-lg border transition-all ${active ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`;
                    btn.innerHTML = `
                        <span class="font-bold">${p.name}</span>
                        ${active ? '<i data-lucide="check" class="w-3 h-3"></i>' : '<span class="text-[9px] uppercase tracking-wider">PITCH</span>'}
                    `;
                    btn.onclick = () => {
                        if(active) {
                            p.contracts = p.contracts.filter(x => x !== c.name);
                            showToast(`Contract ended with ${c.name}`);
                        } else {
                            p.contracts.push(c.name);
                            showToast(`Signed with ${c.name}!`, 'success');
                        }
                        renderTab('market');
                    };
                    pList.appendChild(btn);
                });
            }
            grid.appendChild(el);
        });
        lucide.createIcons();
    }

    // PR / Media Tab
    if(tab === 'pr') {
        content.innerHTML = `
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-3xl font-black text-white tracking-tight">MEDIA RELATIONS</h2>
                <div class="text-purple-400 font-bold bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-500/20">Reputation: ${Math.floor(gameState.reputation)}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="pr-grid"></div>
        `;
        const grid = document.getElementById('pr-grid');
        
        INFLUENCERS.forEach(inf => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl hover:border-purple-500/50 transition-colors';
            el.innerHTML = `
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl">📺</div>
                    <div>
                        <h3 class="font-bold text-white text-lg leading-tight">${inf.name}</h3>
                        <div class="text-xs text-purple-400">${inf.type}</div>
                    </div>
                </div>
                <div class="flex justify-between text-xs text-slate-500 mb-6 font-mono border-t border-slate-700/50 pt-4">
                    <span>Impact: +${inf.impact} Rep</span>
                    <span>Cost: $${inf.cost.toLocaleString()}</span>
                </div>
                <button class="w-full bg-white text-black font-bold py-3 rounded-xl text-xs tracking-widest hover:bg-purple-400 transition-colors">SPONSOR CONTENT</button>
            `;
            
            el.querySelector('button').onclick = () => {
                if(gameState.cash >= inf.cost) {
                    gameState.cash -= inf.cost;
                    gameState.reputation += inf.impact;
                    
                    // Boost hype of all products
                    gameState.products.forEach(p => { if(p.released) p.hype = Math.min(100, p.hype + 20); });
                    
                    updateHUD();
                    renderTab('pr');
                    showToast(`Sponsored video with ${inf.name}!`, 'success');
                } else showToast('Insufficient Funds!', 'error');
            };
            grid.appendChild(el);
        });
    }

    // REVIEWS TAB
    if(tab === 'reviews') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">PUBLIC SENTIMENT</h2>
            ${!gameState.reviews || gameState.reviews.length === 0 ? 
                '<div class="text-slate-500 italic">No reviews yet. Release products to get feedback!</div>' : 
                '<div class="space-y-4" id="reviews-list"></div>'}
        `;
        
        if(gameState.reviews) {
            const list = document.getElementById('reviews-list');
            gameState.reviews.forEach(r => {
                const el = document.createElement('div');
                el.className = 'glass-panel p-4 rounded-xl flex gap-4';
                const color = r.rating >= 4 ? 'bg-green-500' : (r.rating <= 2 ? 'bg-red-500' : 'bg-yellow-500');
                el.innerHTML = `
                    <div class="w-2 rounded-full ${color}"></div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold text-white text-sm">@${r.user}</span>
                            <span class="text-xs text-slate-500">on ${r.product}</span>
                        </div>
                        <p class="text-slate-300 text-sm">"${r.text}"</p>
                    </div>
                `;
                list.appendChild(el);
            });
        }
    }

    // SHOP TAB
    if(tab === 'shop') {
        content.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">CORPORATE ASSETS</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>
        `;
        const grid = document.getElementById('shop-grid');
        
        // Mock Stripe Product
        const stripeEl = document.createElement('div');
        stripeEl.className = 'glass-panel p-6 rounded-2xl border border-yellow-500/30 bg-yellow-900/10';
        stripeEl.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-bold text-white text-xl">PRO LICENSE</h3>
                <span class="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PREMIUM</span>
            </div>
            <p class="text-xs text-slate-400 mb-6">Support development and get a cool badge.</p>
            <button class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <span>$4.99 (Stripe)</span>
            </button>
        `;
        stripeEl.querySelector('button').onclick = () => {
            alert("This is where Stripe Checkout would open! 💳 (Thanks for the $19.69 lol)");
        };
        grid.appendChild(stripeEl);

        SHOP_ITEMS.forEach(item => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl hover:border-cyan-500/50 transition-colors';
            el.innerHTML = `
                <h3 class="font-bold text-white text-lg mb-1">${item.name}</h3>
                <div class="text-xs text-cyan-400 mb-4 font-mono">${item.effect}</div>
                <button class="w-full border border-slate-700 text-white font-bold py-3 rounded-xl hover:bg-white hover:text-black transition-colors">
                    BUY $${item.cost.toLocaleString()}
                </button>
            `;
            el.querySelector('button').onclick = () => {
                if(gameState.cash >= item.cost) {
                    gameState.cash -= item.cost;
                    if(item.type === 'research') gameState.researchPts += item.amount;
                    if(item.type === 'cosmetic') showToast('Coffee machine installed. ☕', 'success');
                    // Add other effects here
                    updateHUD();
                    showToast('Purchased!', 'success');
                } else showToast('Insufficient Funds!', 'error');
            };
            grid.appendChild(el);
        });
    }
}

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
