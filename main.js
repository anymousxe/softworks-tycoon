// --- 1. FIREBASE CONFIGURATION ---
// REPLACE THIS OBJECT WITH YOUR KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global State
let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveListener = null;

// Game Data Consts
const APP_ID = 'softworks-ultimate'; // Just a namespace for the DB path
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
    auth.signInWithPopup(provider).catch(e => alert(e.message));
});

document.getElementById('btn-login-guest').addEventListener('click', () => {
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
            el.className = 'bg-slate-900 border border-slate-800 p-6 cursor-pointer hover:border-cyan-500 transition group relative';
            el.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-2xl font-bold text-white group-hover:text-cyan-400">${data.companyName}</h3>
                    <button class="text-slate-600 hover:text-red-500 delete-btn" data-id="${doc.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="flex justify-between text-sm font-mono text-slate-500">
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
                if(confirm('Delete save?')) savesRef.doc(doc.id).delete();
            });

            container.appendChild(el);
            lucide.createIcons();
        });

        // Add "New Game" button if slots available
        if(snapshot.size < 6) {
            const btn = document.createElement('button');
            btn.className = 'border-2 border-dashed border-slate-800 text-slate-600 p-6 hover:text-cyan-400 hover:border-cyan-500 transition flex flex-col items-center justify-center gap-2';
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

    await db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').add(newSave);
    document.getElementById('create-screen').classList.add('hidden');
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
}

function saveGame() {
    if(!activeSaveId || !gameState) return;
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
      .doc(activeSaveId).update(gameState);
}

// Save every 3 seconds
setInterval(saveGame, 3000);

// Helper: Calculate Compute
function getCompute() {
    return gameState.hardware.reduce((total, hw) => {
        const tier = HARDWARE.find(h => h.id === hw.typeId);
        return total + (tier ? tier.compute * hw.count : 0);
    }, 0);
}

// Helper: Ticker
function setTicker(msg) {
    document.getElementById('hud-ticker').textContent = msg;
}

// --- CORE: Advance Week ---
document.getElementById('btn-next-week').addEventListener('click', () => {
    // 1. Time
    gameState.week++;
    if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

    // 2. Expenses
    const upkeep = gameState.hardware.reduce((sum, hw) => {
        const t = HARDWARE.find(x => x.id === hw.typeId);
        return sum + (t.upkeep * hw.count);
    }, 0);
    gameState.cash -= upkeep;

    // 3. Research
    gameState.researchPts += Math.floor(getCompute() * 0.1) + 1;

    // 4. Products
    gameState.products.forEach(p => {
        // Development
        if((!p.released || p.isUpdating) && p.weeksLeft > 0) {
            p.weeksLeft--;
            // Simple logic for progress bar calc would go here
            if(p.weeksLeft <= 0) {
                p.isUpdating = false;
                if(p.updateType) {
                    // It was an update
                    p.version = parseFloat((p.version + (p.updateType === 'major' ? 1.0 : 0.1)).toFixed(1));
                    p.quality = Math.min(100, p.quality + (p.updateType === 'major' ? 10 : 3));
                    setTicker(`${p.name} updated to v${p.version}!`);
                    p.updateType = null;
                } else {
                    // First release
                    p.released = true;
                    p.quality = Math.floor(Math.random() * 50) + 50;
                    p.version = 1.0;
                    setTicker(`${p.name} Launched!`);
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
            
            if(p.isOpenSource) {
                // Open Source logic
            } else {
                gameState.cash += weeklyRev;
                p.revenue += weeklyRev;
            }
        }
    });

    updateHUD();
    // Re-render current tab
    const activeTab = document.querySelector('.nav-btn.active').dataset.tab;
    renderTab(activeTab);
});

// --- UI RENDERING ---

function updateHUD() {
    document.getElementById('hud-company-name').textContent = gameState.companyName;
    document.getElementById('hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('hud-cash').className = gameState.cash < 0 ? 'text-red-500' : 'text-green-400';
    document.getElementById('hud-compute').textContent = `${getCompute()} TF`;
    document.getElementById('hud-research').textContent = `${gameState.researchPts} PTS`;
    document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`;
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.id === 'btn-exit-game') {
            saveGame();
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
            <div class="grid grid-cols-3 gap-4 mb-8">
                <div class="bg-slate-900 border border-slate-800 p-6">
                    <div class="text-[10px] text-slate-500 font-bold uppercase">Live Products</div>
                    <div class="text-3xl font-black text-white">${liveProducts}</div>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-6">
                    <div class="text-[10px] text-slate-500 font-bold uppercase">Total Revenue</div>
                    <div class="text-3xl font-black text-green-400">$${rev.toLocaleString()}</div>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-6">
                    <div class="text-[10px] text-slate-500 font-bold uppercase">Nodes Owned</div>
                    <div class="text-3xl font-black text-blue-400">${gameState.hardware.reduce((a,b)=>a+b.count,0)}</div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-6" id="product-list"></div>
        `;

        const list = document.getElementById('product-list');
        gameState.products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'bg-slate-900 border border-slate-800 p-6 relative group hover:border-slate-600 transition';
            
            if(p.released && !p.isUpdating) {
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold text-white">${p.name} <span class="text-cyan-500 text-sm">v${p.version}</span></h3>
                        <div class="text-green-400 font-mono">$${(p.revenue||0).toLocaleString()}</div>
                    </div>
                    <div class="flex gap-2 mt-4">
                        <button class="bg-slate-800 text-white px-3 py-2 text-xs font-bold flex-1 hover:bg-slate-700 btn-patch" data-id="${p.id}">PATCH (v${(p.version+0.1).toFixed(1)})</button>
                        <button class="bg-white text-black px-3 py-2 text-xs font-bold flex-1 hover:bg-cyan-400 btn-major" data-id="${p.id}">MAJOR (v${Math.floor(p.version)+1}.0)</button>
                    </div>
                `;
                card.querySelector('.btn-patch').onclick = () => startUpdate(p.id, 'minor');
                card.querySelector('.btn-major').onclick = () => startUpdate(p.id, 'major');
            } else {
                card.innerHTML = `
                    <div class="text-slate-500 text-xs font-mono mb-2">${p.isUpdating ? 'UPDATING...' : 'TRAINING...'}</div>
                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div class="h-full bg-cyan-500 animate-pulse w-1/2"></div>
                    </div>
                    <div class="text-right text-xs text-white mt-1">${p.weeksLeft}w left</div>
                `;
            }
            list.appendChild(card);
        });
    }

    if(tab === 'server') {
        content.innerHTML = `<div class="grid grid-cols-4 gap-4" id="server-grid"></div>`;
        const grid = document.getElementById('server-grid');
        
        HARDWARE.forEach(h => {
            const locked = h.reqTech && !gameState.unlockedTechs.includes(h.reqTech);
            const owned = gameState.hardware.find(x => x.typeId === h.id)?.count || 0;
            
            const el = document.createElement('div');
            el.className = `p-6 border ${locked ? 'border-slate-900 opacity-50' : 'border-slate-800 bg-slate-900/40'}`;
            el.innerHTML = `
                <div class="text-white font-bold text-lg mb-1">${h.name}</div>
                <div class="text-slate-500 text-xs mb-4">${h.compute} TF / $${h.upkeep} wk</div>
                <div class="text-4xl font-black text-slate-700 mb-4">${owned}</div>
                <button class="w-full border border-slate-700 text-white py-2 text-xs font-bold hover:bg-white hover:text-black transition" ${locked ? 'disabled' : ''}>
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
                    } else alert('Not enough cash!');
                };
            }
            grid.appendChild(el);
        });
    }

    // Simplified Dev Tab
    if(tab === 'dev') {
        content.innerHTML = `
            <h2 class="text-2xl font-bold text-white mb-6">NEW PROJECT</h2>
            <div class="grid grid-cols-2 gap-8">
                <div class="space-y-4" id="dev-types"></div>
                <div class="bg-slate-900 border border-slate-800 p-6">
                    <input id="new-proj-name" class="w-full bg-black border border-slate-700 p-3 text-white mb-4" placeholder="Project Name">
                    <button id="btn-start-dev" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4">INITIALIZE</button>
                </div>
            </div>
        `;
        
        let selectedType = null;
        const typeContainer = document.getElementById('dev-types');
        
        PRODUCTS.forEach(p => {
            const locked = p.reqTech && !gameState.unlockedTechs.includes(p.reqTech);
            const btn = document.createElement('div');
            btn.className = `p-4 border cursor-pointer ${locked ? 'border-slate-800 opacity-50' : 'border-slate-700 hover:border-cyan-500'}`;
            btn.innerHTML = `
                <div class="font-bold text-white">${p.name}</div>
                <div class="text-xs text-slate-500">Cost: $${p.cost.toLocaleString()} | TF: ${p.compute}</div>
                ${locked ? '<div class="text-red-500 text-[10px] font-bold">LOCKED</div>' : ''}
            `;
            if(!locked) {
                btn.onclick = () => {
                    document.querySelectorAll('#dev-types > div').forEach(d => d.classList.remove('bg-cyan-900'));
                    btn.classList.add('bg-cyan-900');
                    selectedType = p;
                };
            }
            typeContainer.appendChild(btn);
        });

        document.getElementById('btn-start-dev').onclick = () => {
            const name = document.getElementById('new-proj-name').value;
            if(!name || !selectedType) return alert('Select type and name!');
            if(gameState.cash < selectedType.cost && !gameState.isSandbox) return alert('Too expensive!');
            if(getCompute() < selectedType.compute) return alert('Need more Compute!');

            gameState.cash -= selectedType.cost;
            gameState.products.push({
                id: Date.now().toString(),
                name,
                type: selectedType.id,
                version: 1.0,
                quality: 0,
                revenue: 0,
                released: false,
                isUpdating: false,
                weeksLeft: selectedType.time,
                contracts: []
            });
            updateHUD();
            setTicker(`Started ${name}`);
            renderTab('dash'); // Switch to dash to see progress
        };
    }
    
    // R&D and Market tabs follow similar logic...
    // (Market tab logic omitted for brevity but follows same pattern)
}

function startUpdate(id, type) {
    const p = gameState.products.find(x => x.id === id);
    if(p) {
        p.isUpdating = true;
        p.updateType = type;
        p.weeksLeft = type === 'major' ? 6 : 2;
        renderTab('dash');
    }
}
