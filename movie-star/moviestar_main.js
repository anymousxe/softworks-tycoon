// moviestar_main.js

// --- 1. CONFIG & AUTH ---
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU",
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

// Safety Check
if (typeof firebase === 'undefined') console.error("Firebase not loaded");
try { firebase.initializeApp(firebaseConfig); } catch (e) { console.log("Firebase already init"); }
const auth = firebase.auth();
const db = firebase.firestore();

let user = null;
let gameState = null;
let saveInterval = null;

// --- 2. GAME STATE & DEFAULTS ---
const DEFAULT_STATE = {
    name: "Unknown",
    pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Star",
    age: 18,
    isSandbox: false,
    cash: 2500,
    fame: 0,
    week: 1,
    jobIndex: 0,
    inventory: [], // IDs of owned items
    staff: [], // Specific hired NPC objects
    activeProjects: [], // Movies/Shows currently in production
    releasedProjects: [], // Finished history
    streaming: { active: false, subs: 0, library: [], price: 10, marketingBudget: 0 }
};

// --- 3. AUTH & STARTUP ---
const loginBtn = document.getElementById('btn-login');
if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginBtn.innerHTML = `<i class="animate-spin" data-lucide="loader-2"></i> LOADING...`;
        lucide.createIcons();
        auth.signInAnonymously().catch(e => {
            alert("Login Failed: " + e.message);
            loginBtn.innerHTML = `TRY AGAIN`;
        });
    });
}

auth.onAuthStateChanged(u => {
    user = u;
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        loadGame();
    }
});

function loadGame() {
    const docRef = db.collection('artifacts').doc('softworks-tycoon').collection('users').doc(user.uid).collection('moviestar_saves').doc('main_save_v2');
    docRef.get().then(doc => {
        if (doc.exists) {
            gameState = { ...DEFAULT_STATE, ...doc.data() };
            initGame();
        } else {
            document.getElementById('create-screen').classList.remove('hidden');
            randomizePfp();
        }
    }).catch(e => console.error(e));
}

// --- 4. CHARACTER CREATION ---
let sandboxMode = false;
document.getElementById('btn-toggle-sandbox').onclick = function() {
    sandboxMode = !sandboxMode;
    this.classList.toggle('bg-white/20');
};

const pfpInput = document.getElementById('inp-pfp');
pfpInput.addEventListener('input', (e) => {
    document.getElementById('pfp-preview').src = e.target.value || "https://api.dicebear.com/7.x/avataaars/svg?seed=Star";
});

function randomizePfp() {
    const seed = Math.floor(Math.random() * 10000);
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    document.getElementById('inp-pfp').value = url;
    document.getElementById('pfp-preview').src = url;
}

document.getElementById('btn-start-game').onclick = () => {
    const f = document.getElementById('inp-first-name').value;
    const l = document.getElementById('inp-last-name').value;
    const p = document.getElementById('inp-pfp').value;

    if(!f || !l) return alert("Enter a name!");

    gameState = { ...DEFAULT_STATE };
    gameState.name = `${f} ${l}`;
    gameState.pfp = p || DEFAULT_STATE.pfp;
    gameState.isSandbox = sandboxMode;
    
    if(sandboxMode) {
        gameState.cash = 500000000;
        gameState.fame = 100000;
        gameState.inventory.push('studio_vol', 'cam_imax');
    }

    saveGame(true);
};

// --- 5. MAIN LOOP & UI ---
function initGame() {
    document.getElementById('create-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    document.getElementById('hud-avatar-img').src = gameState.pfp;
    
    updateHUD();
    renderTab('career');
    
    if(saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(() => saveGame(), 10000); 
    lucide.createIcons();
}

function saveGame(isFirst = false) {
    if(!user || !gameState) return;
    const saveIcon = document.getElementById('auto-save-icon');
    saveIcon.classList.remove('opacity-0');
    
    db.collection('artifacts').doc('softworks-tycoon').collection('users').doc(user.uid).collection('moviestar_saves').doc('main_save_v2')
        .set(gameState)
        .then(() => {
            if(isFirst) initGame();
            setTimeout(() => saveIcon.classList.add('opacity-0'), 1000);
        });
}

function updateHUD() {
    if(!gameState) return;
    document.getElementById('hud-name').textContent = gameState.name;
    document.getElementById('hud-rank').textContent = JOB_TITLES[gameState.jobIndex].title;
    document.getElementById('hud-cash').textContent = '$' + Math.floor(gameState.cash).toLocaleString();
    document.getElementById('hud-fame').textContent = Math.floor(gameState.fame).toLocaleString();
    document.getElementById('hud-week').textContent = `Week ${gameState.week}`;
}

function showToast(msg, type='info') {
    const c = document.getElementById('toast-container');
    const d = document.createElement('div');
    const color = type === 'success' ? 'bg-emerald-600' : (type === 'error' ? 'bg-red-600' : 'bg-pink-600');
    d.className = `p-4 rounded-xl text-white font-bold text-sm shadow-xl backdrop-blur-md border border-white/10 ${color} animate-in`;
    d.innerHTML = msg;
    c.appendChild(d);
    setTimeout(() => d.remove(), 4000);
}

// --- 6. NAVIGATION & TABS ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.id === 'btn-save') { saveGame(); showToast("Game Saved!", "success"); return; }
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTab(btn.dataset.tab);
    });
});

function renderTab(tab) {
    const area = document.getElementById('content-area');
    area.innerHTML = '';
    area.className = 'max-w-7xl mx-auto pb-20 animate-in';

    // --- CAREER ---
    if(tab === 'career') {
        const job = JOB_TITLES[gameState.jobIndex];
        area.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="glass-panel p-8 rounded-3xl flex items-center gap-6">
                    <img src="${gameState.pfp}" class="w-24 h-24 rounded-full border-4 border-pink-500 shadow-xl object-cover">
                    <div>
                        <div class="text-3xl font-black text-white">${gameState.name}</div>
                        <div class="text-pink-400 font-bold">${job.title}</div>
                        <div class="text-gray-400 text-xs mt-2">Net Worth: $${(gameState.cash + (gameState.inventory.length * 1000)).toLocaleString()}</div>
                    </div>
                </div>
                <div class="glass-panel p-8 rounded-3xl border-l-4 border-pink-500 flex flex-col justify-center">
                     <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Weekly Wage</div>
                     <div class="text-5xl font-black text-white">$${job.wage.toLocaleString()}</div>
                </div>
            </div>
            
            <h3 class="text-2xl font-bold text-white mb-4">Inventory</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" id="inventory-grid"></div>
        `;
        
        gameState.inventory.forEach(itemId => {
            const item = SHOP_ITEMS.find(i => i.id === itemId);
            if(item) {
                const el = document.createElement('div');
                el.className = 'glass-panel p-4 rounded-2xl flex flex-col items-center text-center';
                el.innerHTML = `
                    <div class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-2"><i data-lucide="box" class="text-pink-400"></i></div>
                    <div class="text-xs font-bold text-white">${item.name}</div>
                    <div class="text-[10px] text-gray-500">${item.category}</div>
                `;
                document.getElementById('inventory-grid').appendChild(el);
            }
        });
        if(gameState.inventory.length === 0) document.getElementById('inventory-grid').innerHTML = `<div class="text-gray-500 text-sm">Inventory is empty. Go shopping!</div>`;
    }

    // --- SHOP ---
    if(tab === 'shop') {
        area.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white">EQUIPMENT STORE</h2>
                <div class="text-emerald-400 font-mono font-bold">$${gameState.cash.toLocaleString()}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>
        `;
        
        SHOP_ITEMS.forEach(item => {
            const owned = gameState.inventory.includes(item.id);
            const el = document.createElement('div');
            el.className = `glass-panel p-6 rounded-2xl border ${owned ? 'border-emerald-500/50' : 'border-white/10'} hover:border-pink-500 transition-all`;
            el.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-white/5 rounded-xl"><i data-lucide="shopping-bag" class="text-white"></i></div>
                    ${owned ? '<span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">Owned</span>' : ''}
                </div>
                <h3 class="font-bold text-white text-lg">${item.name}</h3>
                <p class="text-xs text-gray-400 mb-4">${item.category} • +${item.qualityBonus} Quality</p>
                <button class="w-full py-3 rounded-xl font-bold text-sm ${owned ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-pink-400'}" ${owned ? 'disabled' : ''}>
                    ${owned ? 'PURCHASED' : '$' + item.cost.toLocaleString()}
                </button>
            `;
            if(!owned) {
                el.querySelector('button').onclick = () => {
                    if(gameState.cash >= item.cost) {
                        gameState.cash -= item.cost;
                        gameState.inventory.push(item.id);
                        updateHUD();
                        renderTab('shop');
                        showToast(`Bought ${item.name}!`, 'success');
                    } else showToast("Insufficient Funds", "error");
                };
            }
            document.getElementById('shop-grid').appendChild(el);
        });
    }

    // --- STUDIO ---
    if(tab === 'studio') {
        area.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-4xl font-black text-white">PRODUCTION STUDIO</h2>
                    <p class="text-gray-400 text-sm mt-1">Manage your empire.</p>
                </div>
                <button id="btn-start-wiz" class="liquid-button bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 text-lg shadow-[0_0_30px_rgba(219,39,119,0.4)]">
                    <i data-lucide="plus-circle"></i> NEW PROJECT
                </button>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-4">Released Projects</h3>
            <div class="grid grid-cols-1 gap-4" id="released-list"></div>
        `;
        
        const list = document.getElementById('released-list');
        if(gameState.releasedProjects.length === 0) list.innerHTML = `<div class="p-8 text-center text-gray-500 glass-panel rounded-2xl">No released projects yet. Start cooking!</div>`;
        
        gameState.releasedProjects.forEach(p => {
            const profit = p.revenue - p.totalCost;
            const isHit = profit > 0;
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 ' + (isHit ? 'border-emerald-500' : 'border-red-500');
            el.innerHTML = `
                <div>
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-bold uppercase px-2 py-1 bg-white/10 rounded text-gray-300">${p.type}</span>
                        <h4 class="text-xl font-bold text-white">${p.title}</h4>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">${p.genre} • Rating: <span class="${p.quality > 80 ? 'text-emerald-400' : 'text-white'} font-bold">${p.quality}/100</span></div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-gray-500 uppercase font-bold">Profit</div>
                    <div class="text-xl font-mono font-bold ${isHit ? 'text-emerald-400' : 'text-red-400'}">${profit > 0 ? '+' : ''}$${Math.floor(profit).toLocaleString()}</div>
                </div>
            `;
            list.appendChild(el);
        });

        document.getElementById('btn-start-wiz').onclick = openProductionWizard;
    }

    // --- ACTIVE PROJECTS (Dashboard) ---
    if(tab === 'active-projects') {
        area.innerHTML = `<h2 class="text-3xl font-black text-white mb-6">ONGOING PRODUCTIONS</h2><div class="space-y-6" id="active-list"></div>`;
        
        if(gameState.activeProjects.length === 0) {
            document.getElementById('active-list').innerHTML = `<div class="text-center p-12 text-gray-500">No active productions. Go to Studio to start one.</div>`;
        }
        
        gameState.activeProjects.forEach((proj, idx) => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-3xl relative overflow-hidden';
            
            // Logic based on type
            let actions = '';
            let status = '';
            
            if(proj.type === 'movie' || proj.type === 'book') {
                const pct = Math.min(100, (proj.progress / proj.weeksNeeded) * 100);
                status = `
                    <div class="w-full bg-gray-800 h-4 rounded-full mt-4 overflow-hidden">
                        <div class="bg-pink-500 h-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                    <div class="flex justify-between text-xs mt-2 font-mono text-gray-400">
                        <span>Week ${proj.progress} / ${proj.weeksNeeded}</span>
                        <span>${Math.floor(pct)}% Complete</span>
                    </div>
                `;
                if(proj.progress >= proj.weeksNeeded) {
                    actions = `<button class="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-emerald-400 mt-4 btn-release" data-idx="${idx}">RELEASE PROJECT</button>`;
                } else {
                     actions = `<div class="text-center text-xs text-pink-400 mt-4 font-bold animate-pulse">PRODUCTION IN PROGRESS...</div>`;
                }
            } else if(proj.type === 'show') {
                status = `
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div class="bg-black/30 p-3 rounded-xl">
                            <div class="text-[10px] text-gray-500 uppercase">Season</div>
                            <div class="text-xl font-bold text-white">${proj.season}</div>
                        </div>
                        <div class="bg-black/30 p-3 rounded-xl">
                            <div class="text-[10px] text-gray-500 uppercase">Episodes</div>
                            <div class="text-xl font-bold text-white">${proj.episodes}</div>
                        </div>
                    </div>
                `;
                actions = `
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <button class="py-3 bg-white/10 hover:bg-white text-white hover:text-black font-bold rounded-xl btn-produce-ep" data-idx="${idx}">+ Make Episode ($${proj.weeklyCost.toLocaleString()})</button>
                        <button class="py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl btn-release-season" data-idx="${idx}" ${proj.episodes < 1 ? 'disabled style="opacity:0.5"' : ''}>Finish Season</button>
                    </div>
                `;
            }

            el.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-2xl font-bold text-white">${proj.title}</h3>
                        <div class="text-sm text-pink-400 font-bold uppercase">${proj.type} • ${proj.genre}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-500 uppercase">Weekly Burn</div>
                        <div class="text-red-400 font-mono font-bold">-$${proj.weeklyCost.toLocaleString()}</div>
                    </div>
                </div>
                ${status}
                ${actions}
            `;
            document.getElementById('active-list').appendChild(el);
        });

        // Bind Actions
        document.querySelectorAll('.btn-release').forEach(b => {
            b.onclick = () => releaseProject(parseInt(b.dataset.idx));
        });
        document.querySelectorAll('.btn-produce-ep').forEach(b => {
            b.onclick = () => produceEpisode(parseInt(b.dataset.idx));
        });
        document.querySelectorAll('.btn-release-season').forEach(b => {
            b.onclick = () => finishSeason(parseInt(b.dataset.idx));
        });
    }

    lucide.createIcons();
}

// --- 7. HIRING & PRODUCTION WIZARD ---

// Global Wizard State
let wizState = {
    step: 1,
    type: 'movie',
    title: '',
    genre: '',
    source: null,
    crew: { director: null, editor: null },
    cast: []
};

function openProductionWizard() {
    wizState = { step: 1, type: 'movie', title: '', genre: 'action', source: null, crew: { director: null, editor: null }, cast: [] };
    document.getElementById('production-modal').classList.remove('hidden');
    renderWizard();
}

function renderWizard() {
    // Nav Steps
    document.querySelectorAll('.step-btn').forEach(b => {
        b.classList.remove('active');
        if(parseInt(b.dataset.step) === wizState.step) b.classList.add('active');
    });

    // Show Content
    document.querySelectorAll('.wizard-step').forEach(d => d.classList.add('hidden'));
    document.getElementById(`step-${wizState.step}`).classList.remove('hidden');
    
    // Step 1 Logic: Populate Genres & Sources
    if(wizState.step === 1) {
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
        // Find the card matching type and select it (simplified selector)
        // ... (Skipping verbose DOM manipulation for brevity, handled by setProdType)
        
        const genreList = document.getElementById('prod-genre-list');
        genreList.innerHTML = '';
        GENRES.forEach(g => {
            const b = document.createElement('button');
            b.className = `px-4 py-2 rounded-lg border text-xs font-bold transition-all ${wizState.genre === g.id ? 'bg-pink-600 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`;
            b.textContent = g.name;
            b.onclick = () => { wizState.genre = g.id; renderWizard(); };
            genreList.appendChild(b);
        });

        const adaptSelect = document.getElementById('prod-adaptation');
        adaptSelect.innerHTML = `<option value="">Original Screenplay</option>`;
        gameState.releasedProjects.filter(p => p.type === 'book').forEach(book => {
            adaptSelect.innerHTML += `<option value="${book.id}">Adapt: ${book.title}</option>`;
        });
        adaptSelect.onchange = (e) => wizState.source = e.target.value;
    }

    // Step 3: Cast List
    if(wizState.step === 3) {
        const cContainer = document.getElementById('cast-list-container');
        cContainer.innerHTML = '';
        wizState.cast.forEach((role, idx) => {
            const el = document.createElement('div');
            el.className = 'flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5';
            el.innerHTML = `
                <img src="${role.actor.pfp}" class="w-12 h-12 rounded-full object-cover">
                <div class="flex-1">
                    <div class="text-white font-bold">${role.actor.name}</div>
                    <div class="text-xs text-pink-400">${role.roleName} (${role.roleType})</div>
                </div>
                <div class="text-right text-xs text-gray-400">
                    <div>Talent: ${role.actor.stats.talent}</div>
                    <div>Wage: $${role.actor.cost.toLocaleString()}/wk</div>
                </div>
                <button class="p-2 text-red-500 hover:bg-white/10 rounded" onclick="removeCast(${idx})"><i data-lucide="trash-2"></i></button>
            `;
            cContainer.appendChild(el);
        });
        lucide.createIcons();
    }

    // Step 4: Review
    if(wizState.step === 4) {
        document.getElementById('review-title').textContent = document.getElementById('prod-title').value || "Untitled Project";
        document.getElementById('review-type').textContent = wizState.type.toUpperCase();
        document.getElementById('review-genre').textContent = GENRES.find(g=>g.id===wizState.genre).name;
        document.getElementById('review-cast-count').textContent = wizState.cast.length;
        
        const cost = calculateWeeklyCost();
        document.getElementById('review-cost').textContent = '$' + cost.toLocaleString();
        document.getElementById('prod-current-cost').textContent = '$' + cost.toLocaleString() + ' / wk';
    }
}

// Helpers
window.setProdType = (t) => { wizState.type = t; document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected')); event.currentTarget.classList.add('selected'); };
window.randomizeTitle = () => document.getElementById('prod-title').value = generateMovieTitle();
window.closeModal = (id) => document.getElementById(id).classList.add('hidden');

// Navigation
document.getElementById('btn-next-step').onclick = () => {
    if(wizState.step < 4) {
        if(wizState.step === 1 && !document.getElementById('prod-title').value) return showToast("Enter a title!", "error");
        wizState.step++;
        renderWizard();
    }
};
document.getElementById('btn-prev-step').onclick = () => {
    if(wizState.step > 1) {
        wizState.step--;
        renderWizard();
    }
};

// --- HIRING SYSTEM ---
let hiringTarget = ''; // 'director', 'editor', 'actor'

window.openHiring = (target) => {
    hiringTarget = target;
    document.getElementById('hiring-modal').classList.remove('hidden');
    const list = document.getElementById('hiring-list');
    list.innerHTML = '';
    
    // Generate Candidates
    const count = 12;
    for(let i=0; i<count; i++) {
        const person = generatePerson(target);
        const el = document.createElement('button');
        el.className = 'glass-panel p-4 rounded-xl flex items-center gap-4 text-left hover:border-pink-500 transition-all group';
        el.innerHTML = `
            <img src="${person.pfp}" class="w-16 h-16 rounded-xl object-cover bg-gray-800">
            <div class="flex-1">
                <div class="font-bold text-white group-hover:text-pink-400">${person.name}</div>
                <div class="text-xs text-gray-400 flex gap-2 mt-1">
                    <span class="bg-white/10 px-2 py-0.5 rounded">Talent: ${person.stats.talent}</span>
                    <span class="bg-white/10 px-2 py-0.5 rounded">Fame: ${person.stats.fame}</span>
                </div>
            </div>
            <div class="text-right">
                <div class="text-emerald-400 font-mono font-bold">$${person.cost.toLocaleString()}</div>
                <div class="text-[10px] text-gray-500">/ week</div>
            </div>
        `;
        el.onclick = () => selectCandidate(person);
        list.appendChild(el);
    }
};

function generatePerson(role) {
    const f = FIRST_NAMES[Math.floor(Math.random()*FIRST_NAMES.length)];
    const l = LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)];
    const talent = Math.floor(Math.random() * 100) + (gameState.fame/100);
    const fame = Math.floor(Math.random() * 100);
    const cost = Math.floor((talent * 200) + (fame * 50));
    return {
        id: Date.now() + Math.random(),
        name: `${f} ${l}`,
        role,
        pfp: `https://api.dicebear.com/7.x/avataaars/svg?seed=${f}${l}`,
        stats: { talent, fame },
        cost: Math.max(500, cost)
    };
}

function selectCandidate(person) {
    document.getElementById('hiring-modal').classList.add('hidden');
    if(hiringTarget === 'director') {
        wizState.crew.director = person;
        document.getElementById('director-select').innerHTML = `
            <div class="p-4 bg-pink-900/20 border border-pink-500/50 rounded-xl flex justify-between items-center">
                <span class="font-bold text-white">${person.name}</span>
                <span class="text-xs text-emerald-400">$${person.cost}/wk</span>
            </div>`;
    } else if(hiringTarget === 'editor') {
        wizState.crew.editor = person;
        document.getElementById('editor-select').innerHTML = `
            <div class="p-4 bg-pink-900/20 border border-pink-500/50 rounded-xl flex justify-between items-center">
                <span class="font-bold text-white">${person.name}</span>
                <span class="text-xs text-emerald-400">$${person.cost}/wk</span>
            </div>`;
    } else if(hiringTarget === 'actor') {
        // Open Role Details
        document.getElementById('role-modal').classList.remove('hidden');
        // Hacky way to pass person to the confirm button
        document.getElementById('btn-confirm-role').onclick = () => {
            const roleName = document.getElementById('role-char-name').value || "Unnamed";
            const roleType = document.getElementById('role-type').value || "Extra";
            wizState.cast.push({ actor: person, roleName, roleType });
            document.getElementById('role-modal').classList.add('hidden');
            renderWizard();
        };
    }
}

window.removeCast = (idx) => {
    wizState.cast.splice(idx, 1);
    renderWizard();
};

function calculateWeeklyCost() {
    let cost = 0;
    if(wizState.crew.director) cost += wizState.crew.director.cost;
    if(wizState.crew.editor) cost += wizState.crew.editor.cost;
    wizState.cast.forEach(c => cost += c.actor.cost);
    
    // Base production cost based on type
    if(wizState.type === 'movie') cost += 5000;
    if(wizState.type === 'show') cost += 10000;
    
    return cost;
}

// --- GREENLIGHT ---
document.getElementById('btn-greenlight').onclick = () => {
    const cost = calculateWeeklyCost();
    if(gameState.cash < cost * 2) return showToast("You need at least 2 weeks of budget!", "error");
    
    const genreData = GENRES.find(g => g.id === wizState.genre);
    
    const newProject = {
        id: Date.now(),
        title: document.getElementById('prod-title').value,
        type: wizState.type,
        genre: genreData.name,
        genreId: genreData.id,
        crew: wizState.crew,
        cast: wizState.cast,
        weeklyCost: cost,
        progress: 0,
        weeksNeeded: wizState.type === 'movie' ? 12 : (wizState.type === 'book' ? 20 : 0), // Movies need 12 weeks, Shows are infinite
        season: 1,
        episodes: 0, // for shows
        quality: 0,
        totalCost: 0
    };
    
    gameState.activeProjects.push(newProject);
    document.getElementById('production-modal').classList.add('hidden');
    updateHUD();
    renderTab('active-projects');
    showToast("Project Greenlit!", "success");
};

// --- SHOW LOGIC ---
function produceEpisode(idx) {
    const proj = gameState.activeProjects[idx];
    if(gameState.cash < proj.weeklyCost) return showToast("Insufficient Funds!", "error");
    
    gameState.cash -= proj.weeklyCost;
    proj.totalCost += proj.weeklyCost;
    proj.episodes++;
    
    // Quality Calc
    let epQuality = Math.floor(Math.random() * 50);
    // Add bonuses from cast/crew
    if(proj.crew.director) epQuality += (proj.crew.director.stats.talent / 5);
    proj.cast.forEach(c => epQuality += (c.actor.stats.talent / 10));
    
    // Add bonuses from items
    gameState.inventory.forEach(id => {
        const item = SHOP_ITEMS.find(i=>i.id===id);
        if(item) epQuality += item.qualityBonus;
    });

    proj.quality = (proj.quality * (proj.episodes-1) + epQuality) / proj.episodes; // Average quality
    
    updateHUD();
    renderTab('active-projects');
    showToast(`Episode ${proj.episodes} Produced!`, 'success');
}

function finishSeason(idx) {
    const proj = gameState.activeProjects[idx];
    
    // Calculate Revenue
    const genreMod = GENRES.find(g=>g.id===proj.genreId).multiplier;
    const baseRev = (proj.quality * 1000) * proj.episodes;
    const revenue = Math.floor(baseRev * genreMod * (1 + gameState.fame/500));
    
    gameState.cash += revenue;
    gameState.fame += Math.floor(proj.quality * proj.episodes);
    
    showToast(`Season Wrapped! Revenue: $${revenue.toLocaleString()}`, 'success');
    
    // Move to history but keep "IP" alive (simplified: just archiving for now, in a real game we'd keep it renewable)
    // For this version: Shows stay active but season resets or you can cancel. 
    // Let's archive it to history as a "Season" entry and keep it active for next season.
    
    gameState.releasedProjects.unshift({
        ...proj,
        title: `${proj.title} (S${proj.season})`,
        revenue
    });
    
    proj.season++;
    proj.episodes = 0;
    proj.totalCost = 0; // Reset cost tracker for new season
    
    updateHUD();
    renderTab('active-projects');
}

// --- PROJECT UPDATE LOGIC (NEXT WEEK) ---
document.getElementById('btn-next-week').onclick = () => {
    gameState.week++;
    
    // Wages
    gameState.cash += JOB_TITLES[gameState.jobIndex].wage;
    
    // Update Active Movies/Books (Progress Bars)
    gameState.activeProjects.forEach((proj, i) => {
        if(proj.type === 'movie' || proj.type === 'book') {
            if(proj.progress < proj.weeksNeeded) {
                if(gameState.cash >= proj.weeklyCost) {
                    gameState.cash -= proj.weeklyCost;
                    proj.totalCost += proj.weeklyCost;
                    proj.progress++;
                } else {
                    showToast(`Production stalled on ${proj.title}: No Cash`, 'error');
                }
            }
        }
    });

    updateHUD();
    
    // Refresh current tab if needed
    const activeBtn = document.querySelector('.nav-btn.active');
    if(activeBtn && activeBtn.dataset.tab === 'active-projects') renderTab('active-projects');
};

function releaseProject(idx) {
    const proj = gameState.activeProjects[idx];
    
    // Final Quality Calc
    let baseQ = 50;
    if(proj.crew.director) baseQ += (proj.crew.director.stats.talent / 4);
    if(proj.crew.editor) baseQ += (proj.crew.editor.stats.talent / 4);
    proj.cast.forEach(c => baseQ += (c.actor.stats.talent / 8));
    gameState.inventory.forEach(id => {
        const item = SHOP_ITEMS.find(i=>i.id===id);
        if(item) baseQ += item.qualityBonus;
    });
    
    proj.quality = Math.min(100, Math.floor(baseQ));
    
    // Revenue
    const genreMod = GENRES.find(g=>g.id===proj.genreId).multiplier;
    const revenue = Math.floor(proj.totalCost * (proj.quality/40) * genreMod * (Math.random() + 0.5));
    
    gameState.cash += revenue;
    gameState.fame += (proj.quality * 10);
    
    // Archive
    gameState.releasedProjects.unshift({ ...proj, revenue });
    gameState.activeProjects.splice(idx, 1);
    
    showToast(`${proj.title} Released! Box Office: $${revenue.toLocaleString()}`, 'success');
    renderTab('studio');
    updateHUD();
}

// --- HELPERS ---
function generateMovieTitle() {
    // Uses the arrays from data.js
    const p = MOVIE_PREFIXES[Math.floor(Math.random() * MOVIE_PREFIXES.length)];
    const n = MOVIE_NOUNS[Math.floor(Math.random() * MOVIE_NOUNS.length)];
    return `${p} ${n}`;
}
