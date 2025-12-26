// moviestar_main.js

// --- 1. CONFIG & AUTH ---
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU", // Same key as AI Tycoon
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

try { firebase.initializeApp(firebaseConfig); } catch (e) {}
const auth = firebase.auth();
const db = firebase.firestore();

let user = null;
let gameState = null;
let saveInterval = null;

// --- 2. GAME STATE & DEFAULTS ---
const DEFAULT_STATE = {
    name: "Unknown",
    isSandbox: false,
    cash: 500,
    fame: 0,
    talent: 0,
    week: 1,
    jobIndex: 0, // 0 = Extra
    inventory: [], // Houses, cars
    movies: [], // Produced movies
    streaming: { active: false, subs: 0, library: [], price: 10 },
    contracts: [],
    logs: []
};

// --- 3. AUTH LOGIC ---
document.getElementById('btn-login').addEventListener('click', () => {
    auth.signInAnonymously().catch(e => alert(e.message));
});

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
            gameState = doc.data();
            initGame();
        } else {
            document.getElementById('create-screen').classList.remove('hidden');
        }
    });
}

// --- 4. CHARACTER CREATION ---
let sandboxMode = false;
document.getElementById('btn-toggle-sandbox').onclick = function() {
    sandboxMode = !sandboxMode;
    this.classList.toggle('border-yellow-500');
    this.querySelector('.text-white').classList.toggle('text-yellow-400');
};

document.getElementById('btn-start-game').onclick = () => {
    const f = document.getElementById('inp-first-name').value;
    const l = document.getElementById('inp-last-name').value;
    if(!f || !l) return alert("Enter a name!");

    gameState = { ...DEFAULT_STATE };
    gameState.name = `${f} ${l}`;
    gameState.isSandbox = sandboxMode;
    
    if(sandboxMode) {
        gameState.cash = 100000000;
        gameState.talent = 1000;
        gameState.fame = 5000;
    }

    db.collection('artifacts').doc('softworks-tycoon').collection('users').doc(user.uid).collection('moviestar_saves').doc('main_save').set(gameState);
    
    document.getElementById('create-screen').classList.add('hidden');
    initGame();
};

// --- 5. MAIN GAME LOOP & UI ---
function initGame() {
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('hud-avatar').textContent = gameState.name[0];
    updateHUD();
    renderTab('career'); // Default tab
    
    saveInterval = setInterval(() => {
        if(gameState) db.collection('artifacts').doc('softworks-tycoon').collection('users').doc(user.uid).collection('moviestar_saves').doc('main_save').set(gameState);
    }, 10000);
}

function updateHUD() {
    document.getElementById('hud-name').textContent = gameState.name;
    document.getElementById('hud-rank').textContent = JOB_TITLES[gameState.jobIndex].title;
    document.getElementById('hud-cash').textContent = '$' + Math.floor(gameState.cash).toLocaleString();
    document.getElementById('hud-fame').textContent = Math.floor(gameState.fame).toLocaleString();
    document.getElementById('hud-talent').textContent = Math.floor(gameState.talent).toLocaleString();
    document.getElementById('hud-week').textContent = `Week ${gameState.week}`;
}

function showToast(msg, type='info') {
    const c = document.getElementById('toast-container');
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
        if(btn.id === 'btn-save') {
             db.collection('artifacts').doc('softworks-tycoon').collection('users').doc(user.uid).collection('moviestar_saves').doc('main_save').set(gameState);
             showToast("Game Saved!", "success");
             return;
        }
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTab(btn.dataset.tab);
    });
});

function renderTab(tab) {
    const area = document.getElementById('content-area');
    area.innerHTML = '';
    area.className = 'animate-in';

    if(tab === 'career') {
        const job = JOB_TITLES[gameState.jobIndex];
        area.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="glass-panel p-8 rounded-2xl border-l-4 border-pink-500">
                    <h2 class="text-2xl font-black text-white mb-2">CURRENT GIG</h2>
                    <div class="text-4xl font-bold text-pink-400 mb-6">${job.title}</div>
                    <div class="flex justify-between text-sm font-mono text-slate-400 mb-6">
                        <span>Weekly Wage:</span> <span class="text-white">$${job.wage}</span>
                    </div>
                    <button class="w-full bg-slate-800 text-slate-500 cursor-not-allowed font-bold py-4 rounded-xl">Work happens automatically weekly</button>
                </div>
                
                <div class="glass-panel p-8 rounded-2xl">
                    <h2 class="text-2xl font-black text-white mb-6">IMPROVE CRAFT</h2>
                    <div class="space-y-4" id="classes-list"></div>
                </div>
            </div>
        `;
        
        CLASSES.forEach(cls => {
            const btn = document.createElement('button');
            btn.className = "w-full flex justify-between items-center p-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all";
            btn.innerHTML = `
                <div class="text-left">
                    <div class="font-bold text-white">${cls.name}</div>
                    <div class="text-xs text-slate-500">+${cls.talentGain} Talent</div>
                </div>
                <div class="font-mono text-pink-400 font-bold">$${cls.cost.toLocaleString()}</div>
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
        
        // Next available job
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
            
            if(!locked) {
                card.querySelector('#btn-audition').onclick = () => startAudition(gameState.jobIndex + 1);
            }
        } else {
            area.innerHTML += `<div class="text-white text-xl">You are at the top of the acting world! Time to start a studio.</div>`;
        }
    }

    if(tab === 'studio') {
        const canAfford = gameState.cash >= 100000;
        area.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white">PRODUCTION STUDIO</h2>
                <button id="btn-new-movie" class="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-pink-500 flex items-center gap-2"><i data-lucide="plus"></i> New Project</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="movies-grid"></div>
        `;
        
        if(gameState.movies.length === 0) {
            document.getElementById('movies-grid').innerHTML = `<div class="col-span-full text-center p-12 text-slate-500">No productions yet. Start your first film!</div>`;
        } else {
            gameState.movies.forEach(m => {
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
                    ${m.sequelCount ? `<div class="mt-2 text-[10px] text-pink-400 text-center border border-pink-500/30 rounded py-1">Franchise Active</div>` : ''}
                `;
                document.getElementById('movies-grid').appendChild(el);
            });
        }

        document.getElementById('btn-new-movie').onclick = () => openProductionModal();
    }
    
    // STREAMING TAB LOGIC
    if(tab === 'streaming') {
        if(!gameState.streaming.active) {
            area.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full p-12 text-center">
                    <i data-lucide="tv" class="w-24 h-24 text-slate-700 mb-6"></i>
                    <h2 class="text-4xl font-black text-white mb-4">LAUNCH PLATFORM</h2>
                    <p class="text-slate-400 max-w-md mb-8">Start your own streaming service to compete with Netflix. Host your own movies and buy rights to others.</p>
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
                <h3 class="text-xl font-bold text-white mb-4">Content Acquisitions</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="contracts-grid"></div>
            `;
            
            // Generate random contracts to buy
            for(let i=0; i<3; i++) {
                const title = generateMovieTitle();
                const cost = Math.floor(Math.random() * 500000) + 50000;
                const subs = Math.floor(cost / 10); // Subs gained
                
                const el = document.createElement('div');
                el.className = 'glass-panel p-6 rounded-2xl hover:bg-slate-900/50 transition-colors';
                el.innerHTML = `
                    <h4 class="font-bold text-white text-lg mb-1">${title}</h4>
                    <div class="text-xs text-slate-500 mb-4">Exclusive Rights</div>
                    <button class="w-full border border-slate-600 text-white py-2 rounded-lg hover:bg-white hover:text-black font-bold text-xs" id="btn-buy-rights-${i}">BUY $${cost.toLocaleString()}</button>
                `;
                document.getElementById('contracts-grid').appendChild(el);
                
                setTimeout(() => {
                    document.getElementById(`btn-buy-rights-${i}`).onclick = () => {
                        if(gameState.cash >= cost) {
                            gameState.cash -= cost;
                            gameState.streaming.library.push(title);
                            gameState.streaming.subs += subs;
                            updateHUD(); renderTab('streaming');
                            showToast(`Acquired ${title}`, 'success');
                        } else showToast("Insufficient Funds", "error");
                    };
                }, 100);
            }
        }
    }

    lucide.createIcons();
}

// --- 7. AUDITION MINI-GAME ---
let auditionInterval = null;
let markerPos = 0;
let direction = 1;
let currentTargetJob = 0;

function startAudition(jobIdx) {
    currentTargetJob = jobIdx;
    document.getElementById('audition-modal').classList.remove('hidden');
    
    const marker = document.getElementById('game-marker');
    markerPos = 0;
    direction = 1;
    
    // Difficulty speed based on job level
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
    // Green zone is 40% to 60%
    if(markerPos >= 40 && markerPos <= 60) {
        showToast("NAILED IT!", "success");
        gameState.jobIndex = currentTargetJob;
        gameState.fame += 50;
        updateHUD();
        setTimeout(() => {
            document.getElementById('audition-modal').classList.add('hidden');
            renderTab('career');
        }, 1000);
    } else {
        showToast("You bombed the audition...", "error");
        setTimeout(() => {
            document.getElementById('audition-modal').classList.add('hidden');
        }, 1000);
    }
};

// --- 8. PRODUCTION LOGIC ---
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
        btn.onclick = () => {
            document.querySelectorAll('.genre-opt').forEach(b => b.classList.remove('bg-pink-600'));
            btn.classList.add('bg-pink-600');
        };
        genreDiv.appendChild(btn);
    });
    
    prodCast = [];
    updateCastList();
}

document.getElementById('btn-rand-title').onclick = () => {
    document.getElementById('prod-title').value = generateMovieTitle();
};

document.getElementById('prod-budget-slider').oninput = function() {
    prodBudget = parseInt(this.value);
    document.getElementById('prod-budget-display').textContent = '$' + prodBudget.toLocaleString();
    updateProdStats();
};

document.getElementById('btn-add-actor').onclick = () => {
    // Generate 3 random choices
    // In a real app we'd make a modal, here we just add a random one for flow
    const actor = generateRandomActor(Math.ceil(prodBudget / 1000000) || 1);
    prodCast.push(actor);
    updateCastList();
};

function updateCastList() {
    const list = document.getElementById('cast-list');
    // Keep the "Add" button, remove others
    Array.from(list.children).forEach(c => { if(c.id !== 'btn-add-actor') c.remove(); });
    
    prodCast.forEach((a, i) => {
        const el = document.createElement('div');
        el.className = 'flex justify-between items-center bg-black p-3 rounded-lg mb-2';
        el.innerHTML = `
            <div>
                <div class="font-bold text-white text-sm">${a.name}</div>
                <div class="text-[10px] text-slate-500">Talent: ${a.talent} | Fame: ${a.fame}</div>
            </div>
            <div class="text-right">
                <div class="text-pink-400 font-mono text-xs">$${a.cost.toLocaleString()}</div>
                <button class="text-red-500 text-[10px] hover:underline btn-remove-cast" data-idx="${i}">Remove</button>
            </div>
        `;
        list.insertBefore(el, document.getElementById('btn-add-actor'));
    });
    
    // Re-bind removes
    document.querySelectorAll('.btn-remove-cast').forEach(b => {
        b.onclick = () => { prodCast.splice(b.dataset.idx, 1); updateCastList(); };
    });
    updateProdStats();
}

function updateProdStats() {
    const castCost = prodCast.reduce((s, a) => s + a.cost, 0);
    const total = prodBudget + castCost;
    document.getElementById('prod-total-cost').textContent = '$' + total.toLocaleString();
    
    // Quality Calc
    const budgetFactor = Math.min(100, prodBudget / 100000);
    const talentFactor = prodCast.reduce((s,a) => s + a.talent, 0) / (prodCast.length || 1);
    const estQ = Math.min(100, Math.floor((budgetFactor * 0.4) + (talentFactor * 0.4) + (Math.random() * 20)));
    document.getElementById('prod-est-quality').textContent = estQ + "/100";
}

document.getElementById('btn-start-production').onclick = () => {
    const title = document.getElementById('prod-title').value;
    const genre = document.querySelector('.genre-opt.bg-pink-600')?.dataset.val || 'drama';
    const type = document.getElementById('prod-type').value;
    
    const castCost = prodCast.reduce((s, a) => s + a.cost, 0);
    const totalCost = prodBudget + castCost;
    
    if(gameState.cash < totalCost) return showToast("Insufficient Funds!", "error");
    
    gameState.cash -= totalCost;
    
    // Calculate outcome
    const talentSum = prodCast.reduce((s,a) => s + a.talent, 0) + (gameState.talent * 0.5); // Player director talent
    const fameSum = prodCast.reduce((s,a) => s + a.fame, 0);
    
    const baseQ = Math.floor((Math.log10(prodBudget)*10) + (talentSum / 10));
    const quality = Math.min(100, Math.max(10, baseQ + Math.floor(Math.random()*20 - 10)));
    
    // Revenue logic
    const hype = fameSum + (prodBudget / 1000) + (gameState.fame / 10);
    const multiplier = GENRES.find(g => g.id === genre).multiplier;
    const revenue = Math.floor(hype * quality * multiplier * 100 * (type === 'movie' ? 1 : 1.5)); // Shows earn more over time logic usually, simplify here
    
    const newMovie = {
        id: Date.now(),
        title, genre, type, quality, budget: totalCost, revenue,
        sequelCount: 0
    };
    
    gameState.movies.unshift(newMovie);
    gameState.cash += revenue;
    gameState.fame += Math.floor(revenue / 10000);
    
    updateHUD();
    document.getElementById('production-modal').classList.add('hidden');
    renderTab('studio');
    showToast(`Released "${title}"! Box Office: $${revenue.toLocaleString()}`, revenue > totalCost ? 'success' : 'error');
};


// --- 9. WEEKLY TICKER ---
document.getElementById('btn-next-week').onclick = () => {
    gameState.week++;
    
    // Pay Wages
    const wage = JOB_TITLES[gameState.jobIndex].wage;
    gameState.cash += wage;
    
    // Streaming Income
    if(gameState.streaming.active) {
        // Churn and Growth
        const qualityAvg = gameState.streaming.library.length * 5; // Simplified
        const growth = Math.floor(qualityAvg * 10 * Math.random());
        gameState.streaming.subs += growth;
        const streamRev = gameState.streaming.subs * gameState.streaming.price;
        gameState.cash += streamRev;
        showToast(`Streaming Rev: +$${streamRev.toLocaleString()}`);
    } else {
        showToast(`Job Pay: +$${wage}`);
    }

    updateHUD();
    
    // Update active tab if needed
    const active = document.querySelector('.nav-btn.active');
    if(active && active.dataset.tab === 'streaming') renderTab('streaming');
};
