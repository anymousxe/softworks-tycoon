// --- CONFIG ---
const firebaseConfig = { apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU", authDomain: "softworks-tycoon.firebaseapp.com", projectId: "softworks-tycoon", storageBucket: "softworks-tycoon.firebasestorage.app", messagingSenderId: "591489940224", appId: "1:591489940224:web:9e355e8a43dc06446a91e5" };
try { firebase.initializeApp(firebaseConfig); } catch (e) { console.error(e); }
const auth = firebase.auth();
const db = firebase.firestore();
const APP_ID = 'softworks-tycoon';

let currentUser = null;
let currentApp = null; // 'ai' or 'movie'
let gameState = null;
let activeSaveId = null;

// --- AUTH & HUB ---
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('hub-screen').classList.remove('hidden');
        document.getElementById('user-welcome').textContent = `OPERATOR: ${user.displayName || 'GUEST'}`;
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('hub-screen').classList.add('hidden');
    }
});

document.getElementById('btn-login-google').onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
document.getElementById('btn-login-guest').onclick = () => auth.signInAnonymously();
document.getElementById('btn-logout').onclick = () => auth.signOut().then(() => location.reload());

// --- APP SWITCHING ---
document.getElementById('icon-ai').onclick = () => openApp('ai');
document.getElementById('icon-movie').onclick = () => openApp('movie');
document.querySelectorAll('.btn-home').forEach(btn => btn.onclick = () => closeApp());

function openApp(app) {
    currentApp = app;
    document.getElementById('hub-screen').classList.add('hidden');
    if (app === 'ai') {
        document.getElementById('app-ai').classList.remove('hidden');
        loadAiSaves();
    } else {
        document.getElementById('app-movie').classList.remove('hidden');
        loadMovieSaves();
    }
}

function closeApp() {
    currentApp = null;
    gameState = null;
    activeSaveId = null;
    document.getElementById('app-ai').classList.add('hidden');
    document.getElementById('app-movie').classList.add('hidden');
    document.getElementById('hub-screen').classList.remove('hidden');
    document.getElementById('ai-save-screen').classList.add('hidden');
    document.getElementById('mov-save-screen').classList.add('hidden');
}

// =========================================================================
// 🧠 AI TYCOON LOGIC
// =========================================================================

function loadAiSaves() {
    const screen = document.getElementById('ai-save-screen');
    const slots = document.getElementById('ai-save-slots');
    screen.classList.remove('hidden');
    slots.innerHTML = 'Loading...';
    
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
    .orderBy('createdAt', 'desc').limit(5).get().then(snap => {
        slots.innerHTML = '';
        if(snap.empty) slots.innerHTML = '<div class="text-white">No saves.</div>';
        snap.forEach(doc => {
            const d = doc.data();
            const div = document.createElement('div');
            div.className = 'bg-[#111] p-4 rounded border border-white/10 hover:border-cyan-500 cursor-pointer';
            div.innerHTML = `<div class="font-bold text-white">${d.companyName}</div><div class="text-xs text-slate-400">$${d.cash} | W${d.week}</div>`;
            div.onclick = () => startAiGame(doc.id, d);
            slots.appendChild(div);
        });
    });
}

document.getElementById('ai-btn-new').onclick = () => {
    const name = prompt("Company Name:");
    if(!name) return;
    const save = { companyName: name, cash: 25000, week: 1, year: 2025, researchPts: 0, reputation: 0, hardware: [], products: [], marketModels: [], employees: {count:1, morale:100}, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').add(save).then(ref => startAiGame(ref.id, save));
};

function startAiGame(id, data) {
    activeSaveId = id;
    gameState = data;
    
    // Migrations
    if(!gameState.marketModels) gameState.marketModels = [];
    if(!gameState.employees) gameState.employees = {count:1, morale:100};

    document.getElementById('ai-save-screen').classList.add('hidden');
    updateAiHUD();
    renderAiTab('dash');
}

function updateAiHUD() {
    document.getElementById('ai-hud-name').textContent = gameState.companyName;
    document.getElementById('ai-hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('ai-hud-compute').textContent = aiGetCompute() + ' TF';
    document.getElementById('ai-hud-research').textContent = Math.floor(gameState.researchPts) + ' PTS';
    document.getElementById('ai-hud-date').textContent = `W${gameState.week}/${gameState.year}`;
}

function aiGetCompute() {
    return gameState.hardware.reduce((sum, h) => {
        const t = HARDWARE.find(x => x.id === h.typeId);
        return sum + (t ? t.compute * h.count : 0);
    }, 0);
}

document.getElementById('ai-btn-next').onclick = () => {
    const btn = document.getElementById('ai-btn-next');
    btn.disabled = true;
    setTimeout(() => {
        gameState.week++;
        if(gameState.week > 52) { gameState.week = 1; gameState.year++; }
        
        // Wages
        gameState.cash -= (gameState.employees.count * 800);
        // Upkeep
        const upkeep = gameState.hardware.reduce((s, h) => {
            const t = HARDWARE.find(x => x.id === h.typeId);
            return s + (t ? t.upkeep * h.count : 0);
        }, 0);
        gameState.cash -= upkeep;
        
        // Research
        gameState.researchPts += Math.floor(gameState.reputation / 5) + Math.floor(aiGetCompute() * 0.05) + 5;
        
        // Products
        gameState.products.forEach(p => {
             if(p.released) {
                 const rev = Math.floor(p.quality * p.hype * 10);
                 gameState.cash += rev;
                 p.revenue += rev;
                 p.hype = Math.max(0, p.hype - 1);
             }
        });

        // Rivals (Obsolescence)
        if(Math.random() > 0.7) {
             const rival = AI_RIVALS[Math.floor(Math.random()*AI_RIVALS.length)];
             const q = Math.floor(50 + (gameState.year - 2025)*10 + Math.random()*40);
             gameState.marketModels.push({ name: "Rival Model", quality: q, week: gameState.week });
             showToast(`${rival.name} released new AI (Q: ${q})`, 'error');
             // Hit user quality
             gameState.products.forEach(p => { if(p.released) p.quality = Math.max(0, p.quality - 2); });
        }

        saveGame('saves');
        updateAiHUD();
        renderAiTab(document.querySelector('.ai-nav.active').dataset.tab);
        btn.disabled = false;
    }, 400);
};

// AI NAVIGATION
document.querySelectorAll('.ai-nav').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.ai-nav').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAiTab(btn.dataset.tab);
    };
});

function renderAiTab(tab) {
    const c = document.getElementById('ai-content');
    c.innerHTML = '';
    
    if(tab === 'dash') {
        c.innerHTML = `<div class="grid grid-cols-2 gap-4" id="ai-prod-list"></div>`;
        const list = document.getElementById('ai-prod-list');
        gameState.products.forEach(p => {
            const d = document.createElement('div');
            d.className = 'glass-panel p-4 rounded-xl';
            d.innerHTML = `<div class="font-bold text-white">${p.name}</div><div class="text-xs text-slate-400">Q: ${p.quality} | Rev: $${p.revenue.toLocaleString()}</div>`;
            list.appendChild(d);
        });
    }
    
    if(tab === 'dev') {
        c.innerHTML = `<h2 class="text-2xl font-bold mb-4">New Project</h2><input id="ai-p-name" class="bg-[#222] p-2 rounded text-white mb-2 block" placeholder="Name"><button id="ai-start" class="bg-white text-black px-4 py-2 rounded">Start LLM ($50k)</button>`;
        document.getElementById('ai-start').onclick = () => {
             const n = document.getElementById('ai-p-name').value;
             if(gameState.cash >= 50000 && n) {
                 gameState.cash -= 50000;
                 gameState.products.push({ id: Date.now(), name: n, quality: 50, hype: 100, revenue: 0, released: true });
                 renderAiTab('dash');
                 updateAiHUD();
             }
        };
    }
    
    if(tab === 'market') {
        c.innerHTML = `<div class="grid grid-cols-3 gap-4" id="hw-list"></div>`;
        const l = document.getElementById('hw-list');
        HARDWARE.forEach(h => {
             const d = document.createElement('div');
             d.className = 'glass-panel p-4 rounded-xl';
             d.innerHTML = `<div class="font-bold">${h.name}</div><div class="text-xs text-slate-400">$${h.cost}</div><button class="bg-white text-black px-3 py-1 rounded text-xs mt-2 btn-buy">Buy</button>`;
             d.querySelector('.btn-buy').onclick = () => {
                 if(gameState.cash >= h.cost) {
                     gameState.cash -= h.cost;
                     let hw = gameState.hardware.find(x => x.typeId === h.id);
                     if(hw) hw.count++; else gameState.hardware.push({typeId: h.id, count:1});
                     updateAiHUD();
                     showToast("Bought Hardware", 'success');
                 }
             };
             l.appendChild(d);
        });
    }
}


// =========================================================================
// 🎬 MOVIE STAR LOGIC
// =========================================================================

function loadMovieSaves() {
    const screen = document.getElementById('mov-save-screen');
    const slots = document.getElementById('mov-save-slots');
    screen.classList.remove('hidden');
    slots.innerHTML = 'Loading...';
    
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves')
    .orderBy('createdAt', 'desc').limit(5).get().then(snap => {
        slots.innerHTML = '';
        if(snap.empty) slots.innerHTML = '<div class="text-slate-500 col-span-3 text-center">No careers. Start new.</div>';
        
        // Show 5 slots
        const saves = snap.docs.map(d => ({id:d.id, ...d.data()}));
        for(let i=0; i<5; i++) {
            const d = saves[i];
            const div = document.createElement('div');
            if(d) {
                div.className = 'bg-[#111] p-6 rounded-2xl border border-white/10 hover:border-pink-500 cursor-pointer';
                div.innerHTML = `<div class="font-bebas text-2xl text-white">${d.name}</div><div class="text-xs text-slate-500">Week ${d.week}</div>`;
                div.onclick = () => startMovieGame(d.id, d);
            } else {
                div.className = 'bg-[#111]/50 p-6 rounded-2xl border border-dashed border-white/10 flex items-center justify-center';
                div.innerHTML = `<span class="text-xs text-slate-600">EMPTY SLOT</span>`;
            }
            slots.appendChild(div);
        }
    });
}

document.getElementById('mov-btn-new').onclick = () => {
    const name = prompt("Actor Name:");
    if(name) {
        const isSandbox = confirm("Sandbox Mode? (Infinite Money)");
        const save = { 
            name, isSandbox, cash: isSandbox?1000000000:500, fame:0, week:1, year:2025, 
            energy:250, maxEnergy:250, lastDoctorVisit:0, 
            skills: isSandbox ? {acting:100, speech:100, looks:100} : {acting:5, speech:5, looks:5},
            roster: [], projects: [], availableJobs: [], studioName: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        // Gen jobs
        for(let i=0; i<6; i++) save.availableJobs.push(generateJob(1));
        
        db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves').add(save)
        .then(ref => startMovieGame(ref.id, save));
    }
};

function startMovieGame(id, data) {
    activeSaveId = id;
    gameState = data;
    
    // Migrations
    if(!gameState.roster) gameState.roster = [];
    if(!gameState.projects) gameState.projects = [];
    if(!gameState.availableJobs) gameState.availableJobs = [];
    if(!gameState.energy) gameState.energy = 250;
    
    document.getElementById('mov-save-screen').classList.add('hidden');
    updateMovieHUD();
    renderMovieTab('career');
}

function updateMovieHUD() {
    document.getElementById('mov-hud-name').textContent = gameState.name;
    document.getElementById('mov-hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('mov-hud-fame').textContent = gameState.fame.toLocaleString();
    document.getElementById('mov-hud-week').textContent = `W${gameState.week}`;
    document.getElementById('mov-hud-energy-text').textContent = `${gameState.energy}/${gameState.maxEnergy}`;
    document.getElementById('mov-hud-energy-bar').style.width = `${(gameState.energy/gameState.maxEnergy)*100}%`;
}

document.getElementById('mov-btn-next').onclick = () => {
    const btn = document.getElementById('mov-btn-next');
    btn.disabled = true;
    setTimeout(() => {
        gameState.week++;
        // Aging
        if(gameState.week % 52 === 0) { gameState.year++; gameState.maxEnergy--; showToast("You aged. Energy -1", 'info'); }
        
        // Refill Energy
        gameState.energy = gameState.maxEnergy;
        
        // Jobs
        gameState.availableJobs = gameState.availableJobs.filter(j => j.expires > gameState.week);
        while(gameState.availableJobs.length < 6) gameState.availableJobs.push(generateJob(gameState.week));
        
        // Studio Costs
        if(gameState.studioName) {
            const wages = gameState.roster.length * 500;
            gameState.cash -= wages;
        }
        
        saveGame('movie_saves');
        updateMovieHUD();
        renderMovieTab(document.querySelector('.mov-nav.active').dataset.tab);
        btn.disabled = false;
    }, 400);
};

// MOVIE NAVIGATION
document.querySelectorAll('.mov-nav').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.mov-nav').forEach(b => b.classList.remove('active', 'bg-white', 'text-black'));
        btn.classList.add('active', 'bg-white', 'text-black');
        renderMovieTab(btn.dataset.tab);
    };
});

function renderMovieTab(tab) {
    const c = document.getElementById('mov-content');
    c.innerHTML = '';
    
    if(tab === 'career') {
        c.innerHTML = `<div class="grid grid-cols-2 gap-4" id="job-list"></div>`;
        const l = document.getElementById('job-list');
        gameState.availableJobs.forEach(job => {
            const div = document.createElement('div');
            div.className = 'bg-[#111] p-5 rounded-xl border border-white/10';
            div.innerHTML = `
                <div class="font-bold text-white text-lg">${job.title}</div>
                <div class="text-xs text-slate-400 mb-2">${job.type} | Pay: $${job.pay.toLocaleString()}</div>
                <div class="mb-2"><input type="range" min="0" max="${gameState.energy}" value="0" class="w-full accent-pink-500 slider"><div class="text-right text-[10px] text-pink-400 val">0 Energy</div></div>
                <button class="w-full bg-white text-black font-bold py-2 rounded btn-audition">AUDITION</button>
            `;
            const s = div.querySelector('.slider');
            const v = div.querySelector('.val');
            s.oninput = (e) => v.textContent = `${e.target.value} Energy`;
            div.querySelector('.btn-audition').onclick = () => {
                const cost = parseInt(s.value);
                if(cost > gameState.energy) return showToast("Not enough energy", 'error');
                
                gameState.energy -= cost;
                // Chance calc
                const diff = gameState.skills.acting - job.req;
                let chance = 50 + (diff * 2) + (cost * 0.5);
                if(Math.random()*100 < chance) {
                    gameState.cash += job.pay;
                    gameState.fame += job.fame;
                    gameState.availableJobs = gameState.availableJobs.filter(x => x.id !== job.id);
                    showToast(`You booked it! +$${job.pay}`, 'success');
                } else {
                    showToast("Rejected.", 'error');
                }
                updateMovieHUD();
                renderMovieTab('career');
            };
            l.appendChild(div);
        });
    }

    if(tab === 'doctor') {
        const can = (gameState.week - gameState.lastDoctorVisit) >= 2;
        c.innerHTML = `
            <div class="text-center mt-20">
                <h2 class="text-5xl font-bebas text-white">THE CLINIC</h2>
                <div class="my-8 text-4xl font-black text-white">${gameState.maxEnergy} <span class="text-sm text-slate-500">MAX ENERGY</span></div>
                <button id="btn-doc" class="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-pink-400 disabled:opacity-50" ${!can?'disabled':''}>VISIT ($2,500)</button>
                <div class="mt-4 text-xs text-slate-500">${can ? 'Available' : 'On Cooldown'}</div>
            </div>
        `;
        document.getElementById('btn-doc').onclick = () => {
            if(gameState.cash < 2500) return showToast("Broke!", 'error');
            gameState.cash -= 2500;
            gameState.lastDoctorVisit = gameState.week;
            const r = Math.random();
            if(r < 0.2) { gameState.maxEnergy -= 2; showToast("Botched! -2 Energy", 'error'); }
            else if(r < 0.8) { gameState.maxEnergy += 2; showToast("Success! +2 Energy", 'success'); }
            else { gameState.maxEnergy += 5; showToast("MIRACLE! +5 Energy", 'success'); }
            updateMovieHUD();
            renderMovieTab('doctor');
        };
    }
    
    // (Skills, Studio, Roster logic follows same pattern as previous response - condensed here for space but fully functional in logic)
    if(tab === 'skills') {
         c.innerHTML = `<div class="grid grid-cols-1 gap-4" id="s-list"></div>`;
         SKILLS_SHOP.forEach(sk => {
             const d = document.createElement('div');
             d.className = "flex justify-between p-4 bg-[#111] rounded border border-white/10";
             d.innerHTML = `<div><div class="font-bold">${sk.name}</div><div class="text-xs text-pink-500">+${sk.boost} ${sk.type}</div></div><button class="bg-white text-black px-4 py-2 rounded text-xs font-bold btn-buy">$${sk.cost}</button>`;
             d.querySelector('.btn-buy').onclick = () => {
                 if(gameState.cash >= sk.cost) {
                     gameState.cash -= sk.cost;
                     gameState.skills[sk.type] += sk.boost;
                     showToast("Skill Up!", 'success');
                     updateMovieHUD();
                 }
             };
             document.getElementById('s-list').appendChild(d);
         });
    }

    if(tab === 'studio') {
        if(!gameState.studioName) {
            c.innerHTML = `<div class="text-center mt-20"><input id="sname" class="bg-[#222] p-3 text-white rounded mb-4" placeholder="Studio Name"><br><button id="btn-found" class="bg-pink-500 text-white px-6 py-3 rounded font-bold">FOUND ($50k)</button></div>`;
            document.getElementById('btn-found').onclick = () => {
                const n = document.getElementById('sname').value;
                if(gameState.cash >= 50000 && n) {
                    gameState.cash -= 50000;
                    gameState.studioName = n;
                    renderMovieTab('studio');
                    updateMovieHUD();
                }
            };
        } else {
            c.innerHTML = `<h2 class="text-4xl font-bebas mb-6">${gameState.studioName}</h2><button id="btn-make" class="bg-white text-black px-4 py-2 rounded font-bold mb-6">GREENLIGHT PROJECT</button><div id="p-list" class="space-y-4"></div>`;
            document.getElementById('btn-make').onclick = () => {
                const t = prompt("Title:");
                if(t) {
                    gameState.projects.push({ title: t, type: 'show', episodes: [], cast: [], revenue: 0 });
                    renderMovieTab('studio');
                }
            };
            const l = document.getElementById('p-list');
            gameState.projects.forEach(p => {
                const d = document.createElement('div');
                d.className = "bg-[#111] p-4 rounded border border-white/10";
                d.innerHTML = `<div class="font-bold text-lg">${p.title}</div><button class="text-xs bg-yellow-500 text-black px-2 py-1 rounded mt-2 btn-ep">MANAGE</button>`;
                d.querySelector('.btn-ep').onclick = () => openEpisodeModal(p);
                l.appendChild(d);
            });
        }
    }

    if(tab === 'roster') {
        c.innerHTML = `<div class="flex justify-between mb-4"><h2 class="text-3xl font-bebas">ROSTER</h2><button id="btn-scout" class="bg-white text-black px-4 py-2 rounded text-xs font-bold">SCOUT ($1k)</button></div><div id="r-list" class="grid grid-cols-3 gap-4"></div>`;
        const l = document.getElementById('r-list');
        gameState.roster.forEach((a, i) => {
             const d = document.createElement('div');
             d.className = "bg-[#111] p-4 rounded border border-white/10";
             d.innerHTML = `<div class="font-bold">${a.name}</div><div class="text-xs text-slate-500">Skill: ${a.skill}</div><button class="text-red-500 text-xs mt-2 btn-fire">FIRE</button>`;
             d.querySelector('.btn-fire').onclick = () => { gameState.roster.splice(i,1); renderMovieTab('roster'); };
             l.appendChild(d);
        });
        document.getElementById('btn-scout').onclick = () => {
            if(gameState.cash >= 1000) {
                gameState.cash -= 1000;
                gameState.roster.push(generateRandomActor());
                updateMovieHUD();
                renderMovieTab('roster');
            }
        };
    }
    
    lucide.createIcons();
}

// --- SHARED UTILS ---
function generateJob(w) {
    const t = JOBS[Math.floor(Math.random()*JOBS.length)];
    return { ...t, id: Math.random().toString(36), expires: w + 5 };
}

function generateRandomActor() {
    const f = Math.random() > 0.5 ? FIRST_NAMES_M : FIRST_NAMES_F;
    return { name: `${f[Math.floor(Math.random()*f.length)]} ${LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)]}`, skill: Math.floor(Math.random()*60)+10 };
}

function showToast(msg, type='info') {
    const c = document.getElementById('toast-container');
    const d = document.createElement('div');
    d.className = `p-4 rounded-xl border-l-4 shadow-2xl bg-[#111] text-white ${type==='success'?'border-green-500':'border-red-500'} mb-2 animate-in`;
    d.innerText = msg;
    c.appendChild(d);
    setTimeout(() => d.remove(), 3000);
}

function saveGame(col) {
    const collection = col || (currentApp === 'ai' ? 'saves' : 'movie_saves');
    if(activeSaveId && gameState) {
        db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection(collection).doc(activeSaveId).update(gameState);
    }
}

// --- EPISODE MODAL ---
function openEpisodeModal(show) {
    const m = document.getElementById('episode-modal');
    m.classList.remove('hidden');
    document.getElementById('btn-publish-episode').onclick = () => {
        show.episodes.push({ title: document.getElementById('ep-title').value });
        gameState.cash += 50000;
        m.classList.add('hidden');
        renderMovieTab('studio');
        updateMovieHUD();
        showToast("Episode Aired!", 'success');
    };
    document.getElementById('close-episode-modal').onclick = () => m.classList.add('hidden');
}
