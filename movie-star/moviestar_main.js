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

if (typeof firebase === 'undefined') alert("CRITICAL ERROR: Firebase failed to load.");
if (typeof GENRES === 'undefined') alert("CRITICAL ERROR: 'moviestar_data.js' is missing.");

try { firebase.initializeApp(firebaseConfig); } catch (e) { console.error(e); }
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
    cash: 500,
    fame: 0,
    talent: 0,
    week: 1,
    jobIndex: 0, 
    inventory: [], 
    staff: [], // hired agents, etc.
    studio: { 
        active: false,
        employees: 0,
        morale: 100,
        movies: [] 
    },
    streaming: { active: false, subs: 0, library: [], price: 10 },
    contracts: []
};

// --- 3. AUTH LOGIC ---
const loginBtn = document.getElementById('btn-login');
if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginBtn.innerHTML = `CONNECTING...`;
        loginBtn.disabled = true;
        auth.signInAnonymously().catch(e => {
            alert("Login Failed: " + e.message);
            loginBtn.innerHTML = `TRY AGAIN`;
            loginBtn.disabled = false;
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
    const docRef = db.collection('artifacts').doc('softworks-tycoon').collection('users').doc(user.uid).collection('moviestar_saves').doc('main_save');
    docRef.get().then(doc => {
        if (doc.exists) {
            gameState = { ...DEFAULT_STATE, ...doc.data() }; // Merge to ensure new fields exist
            // Fix legacy structure if 'movies' was top level in old save
            if(gameState.movies && !gameState.studio.movies) gameState.studio.movies = gameState.movies;
            initGame();
        } else {
            document.getElementById('create-screen').classList.remove('hidden');
            // Set random PFP seed
            document.getElementById('inp-pfp').value = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random()*1000)}`;
            document.getElementById('pfp-preview').src = document.getElementById('inp-pfp').value;
        }
    }).catch(error => {
        alert("DATABASE ERROR: " + error.message);
        document.getElementById('login-screen').classList.remove('hidden');
    });
}

// --- 4. CHARACTER CREATION ---
let sandboxMode = false;
const sandboxBtn = document.getElementById('btn-toggle-sandbox');
if(sandboxBtn) {
    sandboxBtn.onclick = function() {
        sandboxMode = !sandboxMode;
        this.classList.toggle('border-yellow-500');
        this.querySelector('.text-white').classList.toggle('text-yellow-400');
    };
}

// PFP Preview Logic
const pfpInput = document.getElementById('inp-pfp');
if(pfpInput) {
    pfpInput.addEventListener('input', (e) => {
        document.getElementById('pfp-preview').src = e.target.value || "https://api.dicebear.com/7.x/avataaars/svg?seed=Star";
    });
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
        gameState.cash = 100000000;
        gameState.talent = 1000;
        gameState.fame = 5000;
    }

    saveGame(true);
};

// --- 5. MAIN GAME LOOP & UI ---
function initGame() {
    document.getElementById('create-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    document.getElementById('hud-avatar-img').src = gameState.pfp;
    
    updateHUD();
    renderTab('career'); 
    
    if(saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(() => saveGame(), 5000); // Auto-save every 5s
}

function saveGame(isFirst = false) {
    if(!user || !gameState) return;
    
    const saveIcon = document.getElementById('auto-save-icon');
    if(saveIcon) saveIcon.classList.remove('opacity-0');

    db.collection('artifacts').doc('softworks-tycoon').collection('users').doc(user.uid).collection('moviestar_saves').doc('main_save')
        .set(gameState)
        .then(() => {
            if(isFirst) initGame();
            if(saveIcon) setTimeout(() => saveIcon.classList.add('opacity-0'), 1000);
        })
        .catch(e => console.error("Save Error:", e));
}

function updateHUD() {
    if(!gameState) return;
    document.getElementById('hud-name').textContent = gameState.name;
    document.getElementById('hud-rank').textContent = JOB_TITLES[gameState.jobIndex] ? JOB_TITLES[gameState.jobIndex].title : 'Unknown';
    document.getElementById('hud-cash').textContent = '$' + Math.floor(gameState.cash).toLocaleString();
    document.getElementById('hud-fame').textContent = Math.floor(gameState.fame).toLocaleString();
    document.getElementById('hud-talent').textContent = Math.floor(gameState.talent).toLocaleString();
    
    // Age Calc
    const yearsAdded = Math.floor(gameState.week / 52);
    const displayAge = gameState.age + yearsAdded;
    
    document.getElementById('hud-week').innerHTML = `<span class="text-pink-400">Age ${displayAge}</span> • Week ${gameState.week % 52 || 52}`;
}

function showToast(msg, type='info') {
    const c = document.getElementById('toast-container');
    if(!c) return;
    const d = document.createElement('div');
    const color = type === 'success' ? 'bg-green-600' : (type === 'error' ? 'bg-red-600' : 'bg-pink-600');
    d.className = `toast-enter p-4 rounded-xl text-white font-bold text-sm shadow-xl ${color}`;
    d.innerHTML = msg;
    c.appendChild(d);
    setTimeout(() => d.remove(), 3000);
}

// --- 6. NAVIGATION ---
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
    area.className = 'animate-in';

    // --- CAREER (Stats, PFP, Team, PR) ---
    if(tab === 'career') {
        const job = JOB_TITLES[gameState.jobIndex];
        area.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="glass-panel p-8 rounded-2xl flex items-center gap-6">
                    <img src="${gameState.pfp}" class="w-24 h-24 rounded-full border-4 border-pink-500 shadow-xl">
                    <div>
                        <div class="text-3xl font-black text-white">${gameState.name}</div>
                        <div class="text-pink-400 font-bold">${job.title}</div>
                        <div class="text-slate-500 text-xs mt-1">Age: ${gameState.age + Math.floor(gameState.week/52)}</div>
                    </div>
                </div>
                <div class="glass-panel p-8 rounded-2xl border-l-4 border-pink-500">
                     <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Weekly Income</div>
                     <div class="text-4xl font-black text-white">$${job.wage.toLocaleString()}</div>
                     <div class="text-xs text-green-400 mt-2">+ Bonuses from Staff/Streaming</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4">Management Team</h3>
                    <div class="space-y-4" id="staff-list"></div>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white mb-4">Marketing & PR</h3>
                    <div class="grid grid-cols-2 gap-4" id="marketing-list"></div>
                </div>
            </div>
        `;

        // Render Staff
        STAFF_TYPES.forEach(staff => {
            const owned = (gameState.staff || []).includes(staff.id);
            const el = document.createElement('div');
            el.className = `p-4 rounded-xl border flex justify-between items-center transition-all ${owned ? 'bg-pink-900/20 border-pink-500' : 'bg-slate-900/50 border-slate-700'}`;
            el.innerHTML = `
                <div>
                    <div class="font-bold text-white">${staff.name}</div>
                    <div class="text-[10px] text-slate-400">${staff.desc}</div>
                </div>
                ${owned ? '<span class="text-pink-400 font-bold text-xs">HIRED</span>' : `<button class="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-pink-400 btn-hire" data-id="${staff.id}" data-cost="${staff.cost}">$${staff.cost.toLocaleString()}</button>`}
            `;
            document.getElementById('staff-list').appendChild(el);
        });

        // Render Marketing
        MARKETING_CAMPAIGNS.forEach(ad => {
            const el = document.createElement('button');
            el.className = 'glass-panel p-4 rounded-xl hover:border-pink-500 transition-all text-left';
            el.innerHTML = `
                <div class="font-bold text-white text-sm">${ad.name}</div>
                <div class="text-xs text-slate-500">+${ad.fameGain} Fame</div>
                <div class="mt-2 font-mono text-pink-400 font-bold">$${ad.cost.toLocaleString()}</div>
            `;
            el.onclick = () => {
                if(gameState.cash >= ad.cost) {
                    gameState.cash -= ad.cost;
                    gameState.fame += ad.fameGain;
                    updateHUD();
                    showToast(`Launched ${ad.name}! Fame +${ad.fameGain}`, 'success');
                } else showToast("Insufficient Funds", "error");
            };
            document.getElementById('marketing-list').appendChild(el);
        });

        // Hire Logic
        document.querySelectorAll('.btn-hire').forEach(b => {
            b.onclick = (e) => {
                const cost = parseInt(e.target.dataset.cost);
                const id = e.target.dataset.id;
                if(gameState.cash >= cost) {
                    gameState.cash -= cost;
                    if(!gameState.staff) gameState.staff = [];
                    gameState.staff.push(id);
                    updateHUD();
                    renderTab('career');
                    showToast("Staff Hired!", "success");
                } else showToast("Too expensive!", "error");
            };
        });
    }

    if(tab === 'education') {
        area.innerHTML = `<h2 class="text-3xl font-black text-white mb-6">ACTING SCHOOL</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="classes-list"></div>`;
        CLASSES.forEach(cls => {
            const btn = document.createElement('button');
            btn.className = "glass-panel p-6 rounded-2xl hover:border-pink-500 transition-all text-left flex flex-col h-full justify-between";
            btn.innerHTML = `
                <div>
                    <div class="font-bold text-white text-lg">${cls.name}</div>
                    <div class="text-xs text-slate-500 mb-4">${cls.desc}</div>
                </div>
                <div>
                    <div class="text-sm text-green-400 font-bold mb-1">+${cls.talentGain} Talent</div>
                    <div class="w-full py-3 bg-slate-800 text-center rounded-xl font-mono text-white text-sm group-hover:bg-pink-600">$${cls.cost.toLocaleString()}</div>
                </div>
            `;
            btn.onclick = () => {
                if(gameState.cash >= cls.cost) {
                    gameState.cash -= cls.cost;
                    gameState.talent += cls.talentGain;
                    updateHUD();
                    showToast(`Completed ${cls.name}!`, 'success');
                } else showToast("Too expensive!", "error");
            };
            document.getElementById('classes-list').appendChild(btn);
        });
    }

    if(tab === 'auditions') {
        area.innerHTML = `<h2 class="text-3xl font-black text-white mb-6">CASTING CALLS</h2><div id="audition-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>`;
        if(gameState.jobIndex < JOB_TITLES.length - 1) {
            const nextJob = JOB_TITLES[gameState.jobIndex + 1];
            const locked = gameState.fame < nextJob.reqFame || gameState.talent < nextJob.reqTalent;
            const card = document.createElement('div');
            card.className = `glass-panel p-6 rounded-2xl border ${locked ? 'border-red-500/30' : 'border-green-500/50'}`;
            card.innerHTML = `
                <div class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Promotion Audition</div>
                <h3 class="text-2xl font-black text-white mb-4">${nextJob.title}</h3>
                <div class="space-y-2 mb-6 text-sm font-mono">
                    <div class="flex justify-between ${gameState.fame >= nextJob.reqFame ? 'text-green-400' : 'text-red-400'}"><span>Req Fame:</span><span>${nextJob.reqFame}</span></div>
                    <div class="flex justify-between ${gameState.talent >= nextJob.reqTalent ? 'text-green-400' : 'text-red-400'}"><span>Req Talent:</span><span>${nextJob.reqTalent}</span></div>
                </div>
                <button class="w-full py-3 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform" ${locked ? 'disabled style="opacity:0.5"' : ''} id="btn-audition">AUDITION</button>
            `;
            document.getElementById('audition-grid').appendChild(card);
            if(!locked) card.querySelector('#btn-audition').onclick = () => startAudition(gameState.jobIndex + 1);
        } else {
            area.innerHTML += `<div class="text-white text-xl">You are at the top of the acting world!</div>`;
        }
    }

    if(tab === 'studio') {
        const studio = gameState.studio;
        area.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white">MY STUDIO</h2>
                <div class="flex gap-2">
                    <button id="btn-studio-party" class="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold text-xs">OFFICE PARTY ($5k)</button>
                    <button id="btn-new-movie" class="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"><i data-lucide="plus"></i> New Project</button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div class="glass-panel p-4 rounded-xl border-t-4 border-blue-500">
                    <div class="text-xs text-slate-500 font-bold uppercase">Staff Count</div>
                    <div class="text-2xl font-black text-white">${studio.employees || 0}</div>
                    <div class="flex gap-2 mt-2">
                        <button id="btn-hire-staff" class="text-green-400 text-xs font-bold hover:underline">HIRE (+1)</button>
                        <button id="btn-fire-staff" class="text-red-400 text-xs font-bold hover:underline">FIRE (-1)</button>
                    </div>
                 </div>
                 <div class="glass-panel p-4 rounded-xl border-t-4 border-yellow-500">
                    <div class="text-xs text-slate-500 font-bold uppercase">Staff Morale</div>
                    <div class="text-2xl font-black ${studio.morale > 80 ? 'text-green-400' : 'text-red-500'}">${studio.morale || 100}%</div>
                 </div>
                 <div class="glass-panel p-4 rounded-xl border-t-4 border-pink-500">
                    <div class="text-xs text-slate-500 font-bold uppercase">Productions</div>
                    <div class="text-2xl font-black text-white">${studio.movies.length}</div>
                 </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="movies-grid"></div>
        `;

        // Render Movies
        if(studio.movies.length === 0) {
            document.getElementById('movies-grid').innerHTML = `<div class="col-span-full text-center p-12 text-slate-500">No productions yet. Start your first film!</div>`;
        } else {
            studio.movies.forEach(m => {
                const el = document.createElement('div');
                el.className = 'glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-pink-500/50 transition-all';
                el.innerHTML = `
                    <div class="absolute top-0 right-0 bg-pink-600 text-white text-[10px] px-2 py-1 font-bold rounded-bl-lg">${m.type.toUpperCase()}</div>
                    <h3 class="font-bold text-white text-lg leading-tight mb-1">${m.title}</h3>
                    <div class="text-xs text-slate-500 mb-4">${m.genre} • Q: ${m.quality}/100</div>
                    <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>Cost: <span class="text-red-400">$${(m.budget/1000000).toFixed(1)}M</span></div>
                        <div>Rev: <span class="text-green-400">$${(m.revenue/1000000).toFixed(1)}M</span></div>
                    </div>
                `;
                document.getElementById('movies-grid').appendChild(el);
            });
        }

        // Logic
        document.getElementById('btn-new-movie').onclick = () => openProductionModal();
        document.getElementById('btn-studio-party').onclick = () => {
            if(gameState.cash >= 5000) {
                gameState.cash -= 5000;
                gameState.studio.morale = Math.min(100, gameState.studio.morale + 10);
                updateHUD(); renderTab('studio');
                showToast("Party Success! Morale +10", "success");
            } else showToast("Need Cash", "error");
        };
        document.getElementById('btn-hire-staff').onclick = () => {
             if(gameState.cash >= 1000) {
                 gameState.cash -= 1000;
                 gameState.studio.employees = (gameState.studio.employees || 0) + 1;
                 updateHUD(); renderTab('studio');
             }
        };
        document.getElementById('btn-fire-staff').onclick = () => {
             if(gameState.studio.employees > 0) {
                 gameState.studio.employees--;
                 gameState.studio.morale -= 10;
                 updateHUD(); renderTab('studio');
             }
        };
    }
    
    // STREAMING (Unchanged mostly, just ensure it renders)
    if(tab === 'streaming') {
        if(!gameState.streaming.active) {
            area.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full p-12 text-center">
                    <i data-lucide="tv" class="w-24 h-24 text-slate-700 mb-6"></i>
                    <h2 class="text-4xl font-black text-white mb-4">LAUNCH PLATFORM</h2>
                    <p class="text-slate-400 max-w-md mb-8">Start your own streaming service to compete with Netflix.</p>
                    <button id="btn-start-stream" class="bg-white text-black px-8 py-4 rounded-xl font-black text-xl hover:bg-pink-400 transition-all">LAUNCH ($1,000,000)</button>
                </div>
            `;
            setTimeout(() => {
                const btn = document.getElementById('btn-start-stream');
                if(btn) btn.onclick = () => {
                    if(gameState.cash >= 1000000) {
                        gameState.cash -= 1000000;
                        gameState.streaming.active = true;
                        updateHUD(); renderTab('streaming');
                        showToast("Streaming Service Live!", "success");
                    } else showToast("Need $1M Cash", "error");
                };
            }, 100);
        } else {
             area.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="glass-panel p-6 rounded-2xl border-t-4 border-pink-500">
                        <div class="text-xs font-bold text-slate-500 uppercase">Subscribers</div>
                        <div class="text-3xl font-black text-white">${gameState.streaming.subs.toLocaleString()}</div>
                    </div>
                    <div class="glass-panel p-6 rounded-2xl border-t-4 border-green-500">
                        <div class="text-xs font-bold text-slate-500 uppercase">Monthly Rev</div>
                        <div class="text-3xl font-black text-green-400">$${(gameState.streaming.subs * gameState.streaming.price).toLocaleString()}</div>
                    </div>
                    <div class="glass-panel p-6 rounded-2xl border-t-4 border-blue-500">
                        <div class="text-xs font-bold text-slate-500 uppercase">Library Size</div>
                        <div class="text-3xl font-black text-white">${gameState.streaming.library.length} Titles</div>
                    </div>
                </div>
            `;
        }
    }
    lucide.createIcons();
}

// --- 7. AUDITION & PRODUCTION LOGIC (Simplified for length) ---
// (Copy previous Audition Logic here, it works fine)
let auditionInterval = null;
let markerPos = 0;
let direction = 1;
let currentTargetJob = 0;
function startAudition(jobIdx) {
    currentTargetJob = jobIdx;
    document.getElementById('audition-modal').classList.remove('hidden');
    const marker = document.getElementById('game-marker');
    markerPos = 0; direction = 1;
    const speed = 1 + (jobIdx * 0.5); 
    if(auditionInterval) clearInterval(auditionInterval);
    auditionInterval = setInterval(() => {
        markerPos += (speed * direction);
        if(markerPos >= 100) direction = -1;
        if(markerPos <= 0) direction = 1;
        marker.style.left = `${markerPos}%`;
    }, 16);
}
document.getElementById('btn-audition-action').onclick = () => {
    clearInterval(auditionInterval);
    if(markerPos >= 40 && markerPos <= 60) {
        showToast("NAILED IT!", "success");
        gameState.jobIndex = currentTargetJob;
        gameState.fame += 500;
        updateHUD();
        setTimeout(() => {
            document.getElementById('audition-modal').classList.add('hidden');
            renderTab('career');
        }, 1000);
    } else {
        showToast("You bombed the audition...", "error");
        setTimeout(() => document.getElementById('audition-modal').classList.add('hidden'), 1000);
    }
};

// Production Logic (Re-implemented with Studio Morale factor)
let prodCast = [];
let prodBudget = 10000;
function openProductionModal() {
    document.getElementById('production-modal').classList.remove('hidden');
    document.getElementById('prod-title').value = generateMovieTitle();
    const genreDiv = document.getElementById('genre-select');
    genreDiv.innerHTML = '';
    GENRES.forEach(g => {
        const btn = document.createElement('button');
        btn.className = 'p-2 text-xs font-bold border border-slate-700 rounded hover:bg-pink-600 hover:border-pink-500 transition-colors genre-opt';
        btn.textContent = g.name;
        btn.dataset.val = g.id;
        btn.onclick = () => { document.querySelectorAll('.genre-opt').forEach(b => b.classList.remove('bg-pink-600')); btn.classList.add('bg-pink-600'); };
        genreDiv.appendChild(btn);
    });
    prodCast = [];
    updateCastList();
}
document.getElementById('btn-rand-title').onclick = () => document.getElementById('prod-title').value = generateMovieTitle();
document.getElementById('prod-budget-slider').oninput = function() { prodBudget = parseInt(this.value); document.getElementById('prod-budget-display').textContent = '$' + prodBudget.toLocaleString(); updateProdStats(); };
document.getElementById('btn-add-actor').onclick = () => { prodCast.push(generateRandomActor(Math.ceil(prodBudget / 1000000) || 1)); updateCastList(); };
function updateCastList() {
    const list = document.getElementById('cast-list');
    Array.from(list.children).forEach(c => { if(c.id !== 'btn-add-actor') c.remove(); });
    prodCast.forEach((a, i) => {
        const el = document.createElement('div');
        el.className = 'flex justify-between items-center bg-black p-3 rounded-lg mb-2';
        el.innerHTML = `<div><div class="font-bold text-white text-sm">${a.name}</div><div class="text-[10px] text-slate-500">Talent: ${a.talent}</div></div><button class="text-red-500 text-[10px] btn-remove-cast" data-idx="${i}">Remove</button>`;
        list.insertBefore(el, document.getElementById('btn-add-actor'));
    });
    document.querySelectorAll('.btn-remove-cast').forEach(b => b.onclick = () => { prodCast.splice(b.dataset.idx, 1); updateCastList(); });
    updateProdStats();
}
function updateProdStats() {
    const castCost = prodCast.reduce((s, a) => s + a.cost, 0);
    document.getElementById('prod-total-cost').textContent = '$' + (prodBudget + castCost).toLocaleString();
}
document.getElementById('btn-start-production').onclick = () => {
    const title = document.getElementById('prod-title').value;
    const genre = document.querySelector('.genre-opt.bg-pink-600')?.dataset.val || 'drama';
    const type = document.getElementById('prod-type').value;
    const totalCost = prodBudget + prodCast.reduce((s, a) => s + a.cost, 0);
    
    if(gameState.cash < totalCost) return showToast("Insufficient Funds!", "error");
    gameState.cash -= totalCost;
    
    // Quality Logic
    let q = Math.floor(Math.random() * 50) + 20; 
    q += Math.floor(gameState.talent / 50); // Player talent
    if(gameState.studio.morale > 80) q += 10; // Studio Morale Bonus
    if(gameState.studio.morale < 30) q -= 20; // Low Morale Penalty
    
    const revenue = Math.floor(totalCost * (q/40) * GENRES.find(g=>g.id===genre).multiplier);
    
    gameState.studio.movies.unshift({ id: Date.now(), title, genre, type, quality: q, budget: totalCost, revenue });
    gameState.cash += revenue;
    
    updateHUD(); document.getElementById('production-modal').classList.add('hidden'); renderTab('studio');
    showToast(`Released ${title}! Rev: $${revenue.toLocaleString()}`, revenue > totalCost ? 'success' : 'info');
};

// --- 8. WEEKLY TICKER ---
document.getElementById('btn-next-week').onclick = () => {
    gameState.week++;
    
    let wage = JOB_TITLES[gameState.jobIndex].wage;
    if((gameState.staff||[]).includes('agent')) wage *= 1.1; // Agent Bonus
    
    gameState.cash += wage;
    
    // Staff Upkeep
    let upkeep = 0;
    (gameState.staff||[]).forEach(id => {
        const s = STAFF_TYPES.find(x => x.id === id);
        if(s) upkeep += s.upkeep;
    });
    // Studio Staff Upkeep
    if(gameState.studio.employees) upkeep += (gameState.studio.employees * 1000);
    
    gameState.cash -= upkeep;
    
    // Passive Gains
    if((gameState.staff||[]).includes('publicist')) gameState.fame += 5;
    if((gameState.staff||[]).includes('trainer')) gameState.talent += 5;
    
    // Streaming
    if(gameState.streaming.active) {
        const streamRev = gameState.streaming.subs * gameState.streaming.price;
        gameState.cash += streamRev;
    }
    
    saveGame();
    updateHUD();
    
    // Refresh Tab
    const active = document.querySelector('.nav-btn.active');
    if(active) renderTab(active.dataset.tab);
};
