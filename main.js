// --- 1. FIREBASE CONFIGURATION ---
// YOUR KEYS - SOFTWORKS TYCOON
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU",
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

// Initialize Firebase (Compat Mode)
try {
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase Init Error (ignore if hot-reloading):", e);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Global State
let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveInterval = null;

// Game Data Consts
const APP_ID = 'softworks-tycoon'; // Namespace for your specific DB
const HARDWARE = [
    { id: 'h100', name: 'H100 Cluster', cost: 15000, compute: 10, upkeep: 200 },
    { id: 'h200', name: 'H200 Chipset', cost: 35000, compute: 30, upkeep: 450, reqTech: 'h200_unlock' },
    { id: 'dojo', name: 'Dojo Node', cost: 120000, compute: 120, upkeep: 1200 },
    { id: 'quantum', name: 'Q-Bit Array', cost: 1000000, compute: 2000, upkeep: 8000, reqTech: 'quantum_tech' }
];
const RESEARCH = [
    { id: 'opt_algos', name: 'Optimized Algos', cost: 50, desc: '-1 Week Dev Time' },
    { id: 'h200_unlock', name: 'H200 Hardware', cost: 150, desc: 'Unlock H200 in Store' },
    { id: 'agi_theory', name: 'AGI Theory', cost: 500, desc: 'Unlock Conscious AI' },
    { id: 'quantum_tech', name: 'Quantum Comp', cost: 1000, desc: 'Unlock Quantum Servers' }
];
const PRODUCTS = [
    { id: 'text', name: 'LLM', cost: 50000, time: 4, compute: 10, specs: ['Chat', 'Code', 'Writing'] },
    { id: 'image', name: 'Image Gen', cost: 80000, time: 6, compute: 20, specs: ['Art', 'Photo', 'Logo'] },
    { id: 'video', name: 'Video Model', cost: 150000, time: 8, compute: 50, specs: ['Deepfake', 'Cinema', 'VFX'] },
    { id: 'audio', name: 'Audio Synth', cost: 60000, time: 5, compute: 15, specs: ['Music', 'Voice', 'SFX'] },
    { id: 'agi', name: 'Conscious AI', cost: 5000000, time: 20, compute: 1000, specs: ['Sentience'], reqTech: 'agi_theory' }
];
const COMPANIES = [
    { name: 'NvidiaX', budget: 8000 }, { name: 'Facebooc', budget: 3000 },
    { name: 'Microhard', budget: 5000 }, { name: 'Joggle', budget: 6000 },
    { name: 'Govt_Defense', budget: 25000 }
];

// --- 2. AUTH & SCREEN MANAGEMENT ---

auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        document.getElementById('user-email').textContent = user.isAnonymous ? 'Guest Agent' : user.email;
        loadSaves();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('menu-screen').classList.add('hidden');
    }
});

document.getElementById('btn-login-google').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => {
        alert("Login Error: " + e.message);
    });
});

document.getElementById('btn-login-guest').addEventListener('click', () => {
    // Falls back to Anonymous auth which generates a Guest ID
    auth.signInAnonymously().catch(e => alert(e.message));
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
            el.className = 'bg-slate-900 border border-slate-800 p-6 cursor-pointer hover:border-cyan-500 hover:bg-slate-800 transition group relative';
            el.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-2xl font-bold text-white group-hover:text-cyan-400">${data.companyName}</h3>
                    <button class="text-slate-600 hover:text-red-500 delete-btn p-2" data-id="${doc.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="flex justify-between text-sm font-mono text-slate-500 border-t border-slate-800 pt-3">
                    <span>W${data.week} Y${data.year}</span>
                    <span class="${data.cash < 0 ? 'text-red-500' : 'text-green-500'}">$${data.cash.toLocaleString()}</span>
                </div>
                <div class="mt-2 text-[10px] uppercase font-bold tracking-widest ${data.isSandbox ? 'text-yellow-500' : 'text-slate-600'}">
                    ${data.isSandbox ? 'Sandbox Mode' : 'Career Mode'}
                </div>
            `;
            
            // Click to load
            el.addEventListener('click', (e) => {
                if(e.target.closest('.delete-btn')) return;
                startGame(doc.id, data);
            });

            // Click to delete
            el.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm('Permanently delete this save file?')) savesRef.doc(doc.id).delete();
            });

            container.appendChild(el);
        });
        lucide.createIcons();

        // Add "New Game" button if slots available
        if(snapshot.size < 6) {
            const btn = document.createElement('button');
            btn.className = 'border-2 border-dashed border-slate-800 text-slate-600 p-6 hover:text-cyan-400 hover:border-cyan-500 hover:bg-slate-900/50 transition flex flex-col items-center justify-center gap-2 min-h-[160px]';
            btn.innerHTML = `<i data-lucide="plus" class="w-8 h-8"></i><span class="font-bold">NEW SAVE</span>`;
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
});

document.getElementById('btn-confirm-create').addEventListener('click', async () => {
    const name = document.getElementById('inp-comp-name').value;
    if(!name) return;

    const newSave = {
        companyName: name,
        isSandbox,
        cash: isSandbox ? 100000000 : 25000,
        week: 1, year: 2025,
        researchPts: isSandbox ? 1000 : 0,
        reputation: 0,
        hardware: [{ typeId: 'h100', count: 1 }],
        products: [],
        unlockedTechs: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').add(newSave);
        document.getElementById('create-screen').classList.add('hidden');
        document.getElementById('inp-comp-name').value = ''; // clear input
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
    
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    updateHUD();
    renderTab('dash');
    lucide.createIcons();
    
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000); // Save every 5s
}

function saveGame() {
    if(!activeSaveId || !gameState) return;
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
      .doc(activeSaveId).update(gameState).catch(e => console.error("Auto-save failed:", e));
}

// Helper: Calculate Compute
function getCompute() {
    return gameState.hardware.reduce((total, hw) => {
        const tier = HARDWARE.find(h => h.id === hw.typeId);
        return total + (tier ? tier.compute * hw.count : 0);
    }, 0);
}

// Helper: Ticker / Notification
function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    const colors = type === 'success' ? 'border-green-500 bg-green-900/80 text-green-200' : 'border-cyan-500 bg-slate-900/90 text-cyan-400';
    
    el.className = `toast-enter p-4 rounded-lg border-l-4 shadow-xl backdrop-blur-md font-mono text-sm max-w-xs ${colors}`;
    el.innerHTML = msg;
    
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        setTimeout(() => el.remove(), 500);
    }, 4000);

    // Also update ticker
    document.getElementById('hud-ticker').textContent = msg;
}

// --- CORE: Advance Week ---
document.getElementById('btn-next-week').addEventListener('click', () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i> Processing`;
    lucide.createIcons();

    setTimeout(() => {
        // 1. Time
        gameState.week++;
        if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

        // 2. Expenses
        const upkeep = gameState.hardware.reduce((sum, hw) => {
            const t = HARDWARE.find(x => x.id === hw.typeId);
            return sum + (t.upkeep * hw.count);
        }, 0);
        gameState.cash -= upkeep;

        // 3. Research (Passive gain based on Reputation + Compute overhead)
        const passiveResearch = Math.floor(gameState.reputation / 10) + 1;
        gameState.researchPts += passiveResearch;

        // 4. Products
        gameState.products.forEach(p => {
            // Development
            if((!p.released || p.isUpdating) && p.weeksLeft > 0) {
                p.weeksLeft--;
                
                // Tech: Optimized Algos makes dev faster? (Simulated by checking unlocked techs)
                // We could implement logic here, but keeping it simple for now.

                if(p.weeksLeft <= 0) {
                    p.isUpdating = false;
                    if(p.updateType) {
                        // It was an update
                        const major = p.updateType === 'major';
                        p.version = parseFloat((p.version + (major ? 1.0 : 0.1)).toFixed(1));
                        p.quality = Math.min(100, p.quality + (major ? 15 : 5));
                        p.hype = 100; // Hype reset on update
                        showToast(`${p.name} updated to v${p.version}!`, 'success');
                        p.updateType = null;
                    } else {
                        // First release
                        p.released = true;
                        p.quality = Math.floor(Math.random() * 40) + 50; // 50-90 start
                        p.version = 1.0;
                        p.hype = 100;
                        gameState.reputation += 5;
                        showToast(`🚀 ${p.name} Launched successfully!`, 'success');
                    }
                }
            }

            // Revenue
            if(p.released && !p.isUpdating) {
                let weeklyRev = 0;
                p.contracts.forEach(cName => {
                    const comp = COMPANIES.find(c => c.name === cName);
                    if(comp) weeklyRev += Math.floor(comp.budget * (p.quality / 100));
                });
                
                // Hype Decay
                p.hype = Math.max(0, p.hype - 2);

                if(p.isOpenSource) {
                    // Open Source grants reputation and hype sustain
                    if(p.hype > 0) gameState.reputation += 0.2;
                } else {
                    // Closed source makes money
                    gameState.cash += weeklyRev;
                    p.revenue += weeklyRev;
                }
            }
        });

        updateHUD();
        // Re-render current tab
        const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
        renderTab(activeTab);

        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> Next`;
        lucide.createIcons();
    }, 500); // 0.5s delay for "processing" feel
});

// --- UI RENDERING ---

function updateHUD() {
    document.getElementById('hud-company-name').textContent = gameState.companyName;
    document.getElementById('hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('hud-cash').className = gameState.cash < 0 ? 'text-red-500 font-bold' : 'text-green-400 font-bold';
    document.getElementById('hud-compute').textContent = `${getCompute()} TF`;
    document.getElementById('hud-research').textContent = `${Math.floor(gameState.researchPts)} PTS`;
    document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`;
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.id === 'btn-exit-game') {
            saveGame();
            if(saveInterval) clearInterval(saveInterval);
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('menu-screen').classList.remove('hidden');
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
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div class="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase">Live Products</div>
                    <div class="text-3xl font-black text-white">${liveProducts}</div>
                </div>
                <div class="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase">Total Revenue</div>
                    <div class="text-3xl font-black text-green-400">$${rev.toLocaleString()}</div>
                </div>
                <div class="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase">Reputation</div>
                    <div class="text-3xl font-black text-purple-400">${Math.floor(gameState.reputation)}</div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="product-list"></div>
        `;

        const list = document.getElementById('product-list');
        gameState.products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'bg-slate-900 border border-slate-800 p-6 relative group hover:border-slate-600 transition rounded-xl overflow-hidden';
            
            if(p.isOpenSource) {
                card.innerHTML += `<div class="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-bold px-2 py-1">OPEN SOURCE</div>`;
            }

            if(p.released && !p.isUpdating) {
                card.innerHTML += `
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white">${p.name} <span class="text-cyan-500 text-sm">v${p.version}</span></h3>
                            <div class="text-xs text-slate-500">${p.type.toUpperCase()}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-[10px] text-slate-500 uppercase">Rev/Wk</div>
                            <div class="text-green-400 font-mono">$${p.isOpenSource ? 0 : Math.floor(p.revenue * 0.01).toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-black/50 p-2 rounded">
                            <div class="text-[10px] text-slate-500 uppercase">Quality</div>
                            <div class="${p.quality > 80 ? 'text-green-400' : 'text-yellow-400'} font-bold">${p.quality}/100</div>
                        </div>
                        <div class="bg-black/50 p-2 rounded">
                            <div class="text-[10px] text-slate-500 uppercase">Hype</div>
                            <div class="text-purple-400 font-bold">${p.hype}%</div>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button class="bg-slate-800 text-white px-3 py-2 text-xs font-bold flex-1 hover:bg-slate-700 btn-patch rounded" data-id="${p.id}">PATCH (v${(p.version+0.1).toFixed(1)})</button>
                        <button class="bg-white text-black px-3 py-2 text-xs font-bold flex-1 hover:bg-cyan-400 btn-major rounded" data-id="${p.id}">MAJOR (v${Math.floor(p.version)+1}.0)</button>
                        <button class="text-slate-500 hover:text-red-500 px-2 btn-delete" data-id="${p.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
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
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-bold text-white">${p.name}</h3>
                        <span class="text-xs font-mono text-cyan-500">${p.weeksLeft}w</span>
                    </div>
                    <div class="text-slate-500 text-xs font-mono mb-2">${p.isUpdating ? 'UPDATING...' : 'TRAINING MODEL...'}</div>
                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div class="h-full bg-cyan-500 animate-pulse" style="width: ${((p.isUpdating ? 6-p.weeksLeft : 4-p.weeksLeft)/6)*100}%"></div>
                    </div>
                `;
            }
            list.appendChild(card);
        });
        lucide.createIcons();
    }

    if(tab === 'server') {
        content.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="server-grid"></div>`;
        const grid = document.getElementById('server-grid');
        
        HARDWARE.forEach(h => {
            const locked = h.reqTech && !gameState.unlockedTechs.includes(h.reqTech);
            const owned = gameState.hardware.find(x => x.typeId === h.id)?.count || 0;
            
            const el = document.createElement('div');
            el.className = `p-6 border rounded-xl ${locked ? 'border-slate-900 opacity-50 bg-slate-900/20' : 'border-slate-800 bg-slate-900/40 hover:border-slate-600'}`;
            el.innerHTML = `
                <div class="flex justify-between mb-2">
                    <div class="text-white font-bold text-lg">${h.name}</div>
                    ${locked ? '<i data-lucide="lock" class="w-4 h-4 text-slate-600"></i>' : ''}
                </div>
                <div class="text-slate-500 text-xs mb-4 font-mono">${h.compute} TF / $${h.upkeep} wk</div>
                <div class="text-4xl font-black text-slate-700 mb-4">${owned}</div>
                <button class="w-full border border-slate-700 text-white py-2 text-xs font-bold hover:bg-white hover:text-black transition rounded" ${locked ? 'disabled' : ''}>
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
                        showToast(`Purchased ${h.name}`);
                    } else showToast('Insufficient Funds!', 'error');
                };
            }
            grid.appendChild(el);
        });
        lucide.createIcons();
    }

    if(tab === 'research') {
        content.innerHTML = `
            <div class="flex items-center gap-4 mb-6">
                <h2 class="text-4xl font-black text-white">R&D LAB</h2>
                <div class="text-purple-400 font-mono">${gameState.researchPts} PTS AVAILABLE</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="research-grid"></div>
        `;
        const grid = document.getElementById('research-grid');
        
        RESEARCH.forEach(r => {
            const unlocked = gameState.unlockedTechs.includes(r.id);
            const el = document.createElement('div');
            el.className = `p-6 border rounded-xl transition ${unlocked ? 'border-purple-500 bg-purple-900/10' : 'border-slate-800 bg-slate-900/40 hover:border-purple-500/50'}`;
            el.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <i data-lucide="beaker" class="${unlocked ? 'text-purple-500' : 'text-slate-600'}"></i>
                    ${unlocked ? '<span class="bg-purple-500 text-black text-[10px] font-bold px-2 py-1 rounded">UNLOCKED</span>' : ''}
                </div>
                <h3 class="font-bold text-white mb-1">${r.name}</h3>
                <p class="text-xs text-slate-500 mb-4">${r.desc}</p>
                ${!unlocked ? `<button class="w-full bg-slate-800 hover:bg-purple-600 text-white font-bold py-2 rounded text-xs">RESEARCH (${r.cost} PTS)</button>` : ''}
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
            <h2 class="text-2xl font-bold text-white mb-6">NEW PROJECT</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" id="dev-types"></div>
                <div class="bg-slate-900/80 border border-slate-800 p-6 rounded-xl h-fit">
                    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Project Config</label>
                    <input id="new-proj-name" class="w-full bg-black border border-slate-700 p-3 text-white mb-4 rounded focus:border-cyan-500 outline-none" placeholder="Project Name">
                    
                    <div class="flex items-center gap-2 mb-6 p-3 border border-slate-800 rounded cursor-pointer hover:bg-slate-800" id="btn-toggle-opensource">
                        <div class="w-4 h-4 border border-slate-500 rounded" id="check-os"></div>
                        <span class="text-sm text-white">Open Source License</span>
                    </div>

                    <div id="proj-cost-preview" class="mb-4 text-xs text-slate-400 font-mono"></div>

                    <button id="btn-start-dev" class="w-full bg-white hover:bg-cyan-400 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20">INITIALIZE PROJECT</button>
                </div>
            </div>
        `;
        
        let selectedType = null;
        let openSource = false;
        const typeContainer = document.getElementById('dev-types');
        
        PRODUCTS.forEach(p => {
            const locked = p.reqTech && !gameState.unlockedTechs.includes(p.reqTech);
            const btn = document.createElement('div');
            btn.className = `p-4 border cursor-pointer rounded-xl transition-all ${locked ? 'border-slate-800 opacity-50' : 'border-slate-700 hover:border-cyan-500 hover:bg-slate-900'}`;
            btn.innerHTML = `
                <div class="flex justify-between mb-2">
                    <div class="font-bold text-white">${p.name}</div>
                    ${locked ? '<i data-lucide="lock" class="w-4 h-4 text-red-500"></i>' : ''}
                </div>
                <div class="text-xs text-slate-500 font-mono">Cost: $${p.cost.toLocaleString()} <br> TF: ${p.compute}</div>
            `;
            if(!locked) {
                btn.onclick = () => {
                    document.querySelectorAll('#dev-types > div').forEach(d => d.classList.remove('border-cyan-500', 'bg-cyan-900/10'));
                    btn.classList.add('border-cyan-500', 'bg-cyan-900/10');
                    selectedType = p;
                    document.getElementById('proj-cost-preview').innerHTML = `
                        Cost: $${p.cost.toLocaleString()}<br>
                        Dev Time: ${p.time} Weeks<br>
                        Required Compute: ${p.compute} TF
                    `;
                };
            }
            typeContainer.appendChild(btn);
        });

        // OS Toggle
        document.getElementById('btn-toggle-opensource').onclick = () => {
            openSource = !openSource;
            const box = document.getElementById('check-os');
            box.className = `w-4 h-4 border rounded ${openSource ? 'bg-green-500 border-green-500' : 'border-slate-500'}`;
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
        content.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="market-grid"></div>`;
        const grid = document.getElementById('market-grid');
        
        COMPANIES.forEach(c => {
            const el = document.createElement('div');
            el.className = 'bg-slate-900 border border-slate-800 p-6 rounded-xl';
            el.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-white text-lg">${c.name}</h3>
                    <span class="text-green-500 font-mono text-sm">$${c.budget.toLocaleString()}/wk</span>
                </div>
                <div class="space-y-2" id="contracts-${c.name}"></div>
            `;
            
            const pList = el.querySelector(`#contracts-${c.name}`);
            const commercialProducts = gameState.products.filter(p => p.released && !p.isOpenSource);
            
            if(commercialProducts.length === 0) {
                pList.innerHTML = `<div class="text-xs text-slate-600 italic">No commercial products available.</div>`;
            } else {
                commercialProducts.forEach(p => {
                    const active = p.contracts.includes(c.name);
                    const btn = document.createElement('button');
                    btn.className = `w-full flex justify-between text-xs p-2 rounded border transition ${active ? 'bg-green-900/20 border-green-500 text-green-400' : 'border-slate-800 text-slate-400 hover:bg-slate-800'}`;
                    btn.innerHTML = `<span>${p.name}</span><span>${active ? 'ACTIVE' : 'PITCH'}</span>`;
                    btn.onclick = () => {
                        if(active) {
                            p.contracts = p.contracts.filter(x => x !== c.name);
                        } else {
                            p.contracts.push(c.name);
                            showToast(`Contract Signed with ${c.name}`, 'success');
                        }
                        renderTab('market');
                    };
                    pList.appendChild(btn);
                });
            }
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
