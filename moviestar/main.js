// --- CONFIG ---
const firebaseConfig = { apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU", authDomain: "softworks-tycoon.firebaseapp.com", projectId: "softworks-tycoon", storageBucket: "softworks-tycoon.firebasestorage.app", messagingSenderId: "591489940224", appId: "1:591489940224:web:9e355e8a43dc06446a91e5" };
try { firebase.initializeApp(firebaseConfig); } catch (e) { }
const auth = firebase.auth();
const db = firebase.firestore();
const APP_ID = 'softworks-tycoon';

let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveInterval = null;

// --- AUTH & LOAD ---
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        loadSaveSlots();
    } else {
        window.location.href = '../index.html';
    }
});

function loadSaveSlots() {
    const slots = document.getElementById('save-slots');
    slots.innerHTML = '<div class="text-slate-500 animate-pulse">Scanning Save Database...</div>';
    
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves')
    .orderBy('createdAt', 'desc').limit(5).get().then(snap => {
        slots.innerHTML = '';
        if(snap.empty) {
            slots.innerHTML = '<div class="text-slate-500 col-span-5 text-center italic py-10">No careers found. Start a new journey.</div>';
        }
        
        // Always show 5 slots (Empty or Filled)
        const saves = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
        
        for(let i=0; i<5; i++) {
            const data = saves[i];
            const el = document.createElement('div');
            if (data) {
                el.className = 'bg-[#111] p-6 rounded-2xl border border-white/10 hover:border-pink-500 cursor-pointer transition-all hover:-translate-y-1 group relative';
                el.innerHTML = `
                    <div class="absolute top-4 right-4 text-[10px] text-slate-600 font-mono">SLOT ${i+1}</div>
                    <div class="font-bebas text-3xl text-white mb-1 group-hover:text-pink-400 transition-colors">${data.name}</div>
                    <div class="text-xs font-mono text-slate-400">Week ${data.week} | Year ${data.year}</div>
                    <div class="text-green-400 font-bold text-lg mt-2">$${data.cash.toLocaleString()}</div>
                    <div class="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden"><div class="h-full bg-pink-500" style="width: ${(data.energy/data.maxEnergy)*100}%"></div></div>
                `;
                el.onclick = () => startGame(data.id, data);
            } else {
                el.className = 'bg-[#111]/50 p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600 gap-2';
                el.innerHTML = `<i data-lucide="plus" class="w-8 h-8"></i><span class="text-xs font-bold uppercase">Empty Slot</span>`;
            }
            slots.appendChild(el);
        }
        lucide.createIcons();
    });
}

document.getElementById('btn-new-save').onclick = () => {
    const name = prompt("Enter Stage Name:");
    if(name) {
        const isSandbox = confirm("Enable Sandbox Mode? (Infinite Money, Max Stats)");
        createNewSave(name, isSandbox);
    }
};

function createNewSave(name, sandbox) {
    const newGame = {
        name, 
        isSandbox: sandbox,
        cash: sandbox ? 1000000000 : 500, 
        fame: 0, week: 1, year: 2025,
        energy: 250, maxEnergy: 250, lastDoctorVisit: 0,
        skills: sandbox ? { acting: 100, speech: 100, looks: 100 } : { acting: 5, speech: 5, looks: 5 },
        roster: [], projects: [], availableJobs: [],
        studioName: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    // Generate initial world
    for(let i=0; i<6; i++) newGame.availableJobs.push(generateJob(newGame.week));
    
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves').add(newGame)
    .then(docRef => startGame(docRef.id, newGame));
}

function startGame(id, data) {
    activeSaveId = id;
    gameState = data;
    
    // Migrations & Safety
    if(!gameState.maxEnergy) gameState.maxEnergy = 250;
    if(!gameState.energy) gameState.energy = 250;
    if(!gameState.availableJobs) gameState.availableJobs = [];
    if(!gameState.projects) gameState.projects = [];
    if(!gameState.roster) gameState.roster = [];
    
    document.getElementById('save-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
    
    updateHUD();
    renderTab('career');
    lucide.createIcons();
}

function saveGame() {
    if(activeSaveId && gameState) {
        db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves').doc(activeSaveId).update(gameState);
    }
}

document.getElementById('btn-save-exit').onclick = () => {
    saveGame();
    location.reload();
};

// --- CORE LOGIC ---
function updateHUD() {
    document.getElementById('hud-name').textContent = gameState.name;
    document.getElementById('hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('hud-fame').textContent = gameState.fame.toLocaleString();
    document.getElementById('hud-week').textContent = `W${gameState.week} Y${gameState.year}`;
    
    // Energy Bar
    const pct = (gameState.energy / gameState.maxEnergy) * 100;
    document.getElementById('hud-energy-bar').style.width = `${pct}%`;
    document.getElementById('hud-energy-text').textContent = `${gameState.energy}/${gameState.maxEnergy}`;
}

document.getElementById('btn-next-week').onclick = () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`;
    lucide.createIcons();

    setTimeout(() => {
        gameState.week++;
        
        // Yearly Aging
        if(gameState.week % 52 === 0) {
            gameState.year++;
            gameState.maxEnergy--; // Age decay
            showToast("Happy Birthday! Max Energy -1 (Aging)", 'info');
        }
        
        // Weekly Energy Refill
        gameState.energy = gameState.maxEnergy;
        
        // Job Refresh
        gameState.availableJobs = gameState.availableJobs.filter(j => j.expires > gameState.week);
        while(gameState.availableJobs.length < 6) {
            gameState.availableJobs.push(generateJob(gameState.week));
        }
        
        // Studio Costs
        if(gameState.studioName) {
            const wages = gameState.roster.length * 500;
            gameState.cash -= wages;
        }

        saveGame();
        updateHUD();
        renderTab(document.querySelector('.nav-btn.active').dataset.tab);
        
        btn.disabled = false;
        btn.innerHTML = `NEXT WEEK`;
    }, 400);
};

// --- JOB GENERATOR ---
function generateJob(currentWeek) {
    const template = JOBS[Math.floor(Math.random() * JOBS.length)];
    return {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        expires: currentWeek + 5 // 5 weeks to audition
    };
}

// --- TABS & UI ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => {
        if(btn.id === 'btn-save-exit') return;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active', 'bg-white', 'text-black'));
        btn.classList.add('active', 'bg-white', 'text-black');
        renderTab(btn.dataset.tab);
    };
});

function renderTab(tab) {
    const content = document.getElementById('content-area');
    content.innerHTML = '';
    content.className = 'flex-1 p-10 overflow-y-auto custom-scrollbar relative animate-in';

    if(tab === 'career') {
        content.innerHTML = `
            <div class="mb-8">
                <h2 class="text-5xl font-bebas text-white mb-2">AVAILABLE ROLES</h2>
                <p class="text-slate-400 font-mono text-xs uppercase tracking-widest">Spend Energy to Ace Auditions.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="job-list"></div>
        `;
        const list = document.getElementById('job-list');
        
        gameState.availableJobs.forEach(job => {
            const skillGap = Math.max(0, job.req - gameState.skills.acting);
            const el = document.createElement('div');
            el.className = "bg-[#111] p-6 rounded-xl border border-white/10 hover:border-pink-500 transition-all flex flex-col justify-between";
            el.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-white text-lg leading-tight">${job.title}</h3>
                        <span class="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 font-bold">${job.type.toUpperCase()}</span>
                    </div>
                    <p class="text-xs text-slate-500 italic mb-4">"${job.desc}"</p>
                    <div class="text-xs text-slate-400 mb-2 font-mono">Pay: <span class="text-green-400 font-bold">$${job.pay.toLocaleString()}</span></div>
                    <div class="text-xs text-slate-400 mb-4 font-mono">Req: Act ${job.req} <span class="text-red-500">${skillGap > 0 ? `(-${skillGap} Skill)` : ''}</span></div>
                </div>
                <div>
                    <div class="mb-4 bg-black/40 p-3 rounded-lg border border-white/5">
                        <div class="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
                            <span>Energy Input</span>
                            <span class="text-pink-400 energy-val">0</span>
                        </div>
                        <input type="range" min="0" max="${gameState.energy}" value="0" class="w-full accent-pink-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer energy-slider">
                    </div>
                    <button class="w-full bg-white text-black font-black py-3 rounded-lg hover:bg-pink-400 transition-colors btn-audition text-xs tracking-widest">AUDITION</button>
                </div>
            `;
            
            const slider = el.querySelector('.energy-slider');
            const valDisplay = el.querySelector('.energy-val');
            
            slider.oninput = (e) => { valDisplay.textContent = e.target.value; };
            
            el.querySelector('.btn-audition').onclick = () => {
                const energySpent = parseInt(slider.value);
                
                // --- AUDITION LOGIC ---
                // If skill is low, energy is 50% effective. If skill is high, energy is 100% effective.
                const efficiency = gameState.skills.acting >= job.req ? 1.0 : 0.5;
                const effectiveEnergy = energySpent * efficiency;
                
                // Base Chance: 50% - (Gap * 5)
                let chance = 50 - (skillGap * 5); 
                // Add Energy Bonus (1 Energy = 0.5% chance)
                chance += (effectiveEnergy * 0.5);
                
                chance = Math.max(0, Math.min(100, chance)); // Clamp 0-100
                
                if(energySpent > gameState.energy) return showToast("Not enough energy!", 'error');
                
                gameState.energy -= energySpent;
                const roll = Math.random() * 100;
                
                if(roll < chance) {
                    gameState.cash += job.pay;
                    gameState.fame += job.fame;
                    gameState.history.push(job.title);
                    gameState.availableJobs = gameState.availableJobs.filter(j => j.id !== job.id);
                    showToast(`You booked the role! Earned $${job.pay.toLocaleString()}`, 'success');
                } else {
                    showToast(`Rejected! (Chance: ${Math.floor(chance)}%)`, 'error');
                }
                updateHUD();
                renderTab('career');
            };
            list.appendChild(el);
        });
    }

    if(tab === 'doctor') {
        const canVisit = (gameState.week - gameState.lastDoctorVisit) >= 2;
        content.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center">
                <div class="w-24 h-24 bg-pink-900/20 rounded-full flex items-center justify-center text-pink-500 mb-6 shadow-[0_0_40px_rgba(236,72,153,0.2)]"><i data-lucide="heart-pulse" class="w-12 h-12"></i></div>
                <h2 class="text-6xl font-bebas text-white mb-4">THE CLINIC</h2>
                <p class="text-slate-400 mb-8 max-w-md text-sm leading-relaxed">Feeling old? Tired? Our experimental treatments can restore your vitality... or ruin you.</p>
                
                <div class="bg-[#111] p-6 rounded-xl border border-white/10 mb-8">
                    <div class="text-xs text-slate-500 font-bold uppercase mb-2">Current Max Energy</div>
                    <div class="text-4xl font-black text-white">${gameState.maxEnergy}</div>
                </div>

                <button id="btn-visit-doctor" class="bg-white text-black font-black py-4 px-12 rounded-xl text-xl hover:bg-pink-400 transition-all shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed" ${!canVisit ? 'disabled' : ''}>
                    VISIT DOCTOR ($2,500)
                </button>
                <p class="mt-6 text-xs font-mono text-slate-500">${canVisit ? 'APPOINTMENT AVAILABLE' : `NEXT APPOINTMENT: ${2 - (gameState.week - gameState.lastDoctorVisit)} WEEKS`}</p>
            </div>
        `;
        
        document.getElementById('btn-visit-doctor').onclick = () => {
            if(gameState.cash < 2500) return showToast("You're broke!", 'error');
            
            gameState.cash -= 2500;
            gameState.lastDoctorVisit = gameState.week;
            
            const roll = Math.random();
            if(roll < 0.15) {
                gameState.maxEnergy -= 2;
                showToast("Malpractice! Surgery failed. (Max Energy -2)", 'error');
            } else if (roll < 0.4) {
                showToast("Nothing changed. Just a checkup.", 'info');
            } else if (roll < 0.9) {
                gameState.maxEnergy += 2;
                showToast("You feel revitalized! (Max Energy +2)", 'success');
            } else {
                gameState.maxEnergy += 5;
                showToast("MIRACLE CURE! You feel 20 again! (Max Energy +5)", 'success');
            }
            updateHUD();
            renderTab('doctor');
        };
    }

    if(tab === 'skills') {
        content.innerHTML = `<h2 class="text-4xl font-bebas text-white mb-6">ACTING SCHOOL</h2><div class="grid grid-cols-1 gap-4" id="skill-list"></div>`;
        const list = document.getElementById('skill-list');
        SKILLS_SHOP.forEach(skill => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center p-6 bg-[#111] border border-white/10 rounded-xl hover:border-pink-500/50 transition-colors";
            div.innerHTML = `
                <div class="flex items-center gap-6">
                    <div class="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><i data-lucide="book-open"></i></div>
                    <div>
                        <h3 class="font-bold text-lg text-white">${skill.name}</h3>
                        <p class="text-slate-400 text-xs">${skill.desc}</p>
                        <div class="text-pink-500 text-[10px] font-bold mt-1 bg-pink-500/10 inline-block px-2 py-0.5 rounded uppercase">+${skill.boost} ${skill.type}</div>
                    </div>
                </div>
                <button class="bg-white hover:bg-pink-400 text-black px-8 py-3 rounded-lg font-bold text-xs transition-colors uppercase tracking-wider btn-buy">Buy $${skill.cost.toLocaleString()}</button>
            `;
            div.querySelector('button').onclick = () => {
                if(gameState.cash >= skill.cost) {
                    gameState.cash -= skill.cost;
                    gameState.skills[skill.type] += skill.boost;
                    showToast(`Learned ${skill.name}!`, 'success');
                    updateHUD();
                } else showToast("Too broke!", 'error');
            };
            list.appendChild(div);
        });
    }

    if(tab === 'studio') {
        if(!gameState.studioName) {
            content.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center">
                    <div class="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_50px_rgba(234,179,8,0.4)]"><i data-lucide="clapperboard" class="w-12 h-12"></i></div>
                    <h2 class="text-6xl font-bebas text-white mb-4">START YOUR OWN STUDIO</h2>
                    <p class="text-slate-400 mb-8 max-w-md text-sm leading-relaxed">Become a mogul. Cast actors, write scripts, produce hit shows, and kill off characters for ratings.</p>
                    <input id="studio-name-input" class="bg-[#1a1a1a] text-white p-5 rounded-xl mb-4 w-80 text-center outline-none border border-white/10 focus:border-yellow-500 font-bold text-lg" placeholder="Studio Name">
                    <button id="btn-create-studio" class="bg-white hover:bg-yellow-400 text-black font-black py-4 px-10 rounded-xl text-xl uppercase tracking-widest transition-all">FOUND STUDIO ($50,000)</button>
                </div>
            `;
            document.getElementById('btn-create-studio').onclick = () => {
                const sName = document.getElementById('studio-name-input').value;
                if(gameState.cash >= 50000 && sName) {
                    gameState.cash -= 50000;
                    gameState.studioName = sName;
                    renderTab('studio');
                    updateHUD();
                } else showToast("Need $50,000 and a name!", 'error');
            };
            lucide.createIcons();
            return;
        }

        content.innerHTML = `
            <div class="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div><h2 class="text-6xl font-bebas text-white leading-none">${gameState.studioName.toUpperCase()}</h2></div>
                <button class="text-[10px] border border-slate-700 text-slate-400 px-4 py-2 rounded hover:text-white transition-colors" id="btn-rebrand">REBRAND</button>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="bg-[#111] p-8 rounded-2xl border border-white/10 h-fit">
                    <h3 class="font-black text-xl mb-6 text-white flex items-center gap-2">GREENLIGHT PROJECT</h3>
                    <div class="space-y-4">
                        <input id="proj-title" class="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white font-bold" placeholder="Project Title">
                        <select id="proj-type" class="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white"><option value="movie">Movie</option><option value="show">TV Show</option></select>
                        <select id="proj-genre" class="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white">${GENRES.map(g => `<option value="${g}">${g}</option>`).join('')}</select>
                        <button id="btn-start-proj" class="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-green-400 transition-colors tracking-widest mt-2">START PRODUCTION</button>
                    </div>
                </div>
                <div class="lg:col-span-2">
                    <h3 class="font-black text-xl mb-6 text-white">CURRENT SLATE</h3>
                    <div id="projects-list" class="space-y-4"></div>
                </div>
            </div>
        `;

        document.getElementById('btn-rebrand').onclick = () => {
            const n = prompt("New Studio Name:");
            if(n) { gameState.studioName = n; renderTab('studio'); }
        };

        document.getElementById('btn-start-proj').onclick = () => {
            const title = document.getElementById('proj-title').value;
            const type = document.getElementById('proj-type').value;
            const genre = document.getElementById('proj-genre').value;
            if(!title) return;
            
            const myActors = gameState.roster.filter(a => a.status !== 'Free Agent');
            if(myActors.length === 0) return alert("You have no actors! Go to 'Casting Roster' first.");
            
            const cast = myActors.sort(() => 0.5 - Math.random()).slice(0, 3);
            
            gameState.projects.unshift({ id: Date.now(), title, type, genre, status: 'In Production', episodes: [], cast: cast, revenue: 0 });
            renderTab('studio');
        };

        const list = document.getElementById('projects-list');
        gameState.projects.forEach(p => {
            const el = document.createElement('div');
            el.className = "bg-[#161616] p-6 rounded-xl border border-white/5";
            let actionBtn = p.type === 'show' 
                ? `<button class="bg-yellow-500 text-black text-xs font-black px-4 py-2 rounded hover:bg-yellow-400 btn-manage-ep">WRITER'S ROOM</button>`
                : `<button class="bg-green-500 text-black text-xs font-black px-4 py-2 rounded hover:bg-green-400 btn-release">RELEASE MOVIE</button>`;

            el.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <div><h3 class="font-bold text-xl text-white">${p.title} <span class="text-xs bg-slate-800 px-2 py-1 rounded ml-2 text-slate-400">${p.type.toUpperCase()}</span></h3><div class="text-xs text-green-400 font-mono mt-1">$${p.revenue.toLocaleString()} Gross</div></div>
                    ${actionBtn}
                </div>
                <div class="flex gap-2 flex-wrap">${p.cast.map(c => `<span class="text-xs bg-[#222] px-2 py-1 rounded border border-white/5 ${c.status==='Dead'?'text-red-500 line-through':''}">${c.name}</span>`).join('')}</div>
            `;
            
            if(p.type === 'show') {
                el.querySelector('.btn-manage-ep').onclick = () => openEpisodeModal(p);
            } else {
                 el.querySelector('.btn-release').onclick = () => {
                     const boxOffice = Math.floor(Math.random() * 500000) + 10000;
                     gameState.cash += boxOffice;
                     gameState.fame += Math.floor(boxOffice/1000);
                     p.revenue += boxOffice;
                     showToast(`Box Office: $${boxOffice.toLocaleString()}`, 'success');
                     updateHUD();
                     renderTab('studio');
                 };
            }
            list.appendChild(el);
        });
    }

    if(tab === 'roster') {
        content.innerHTML = `
            <div class="flex justify-between items-center mb-8"><h2 class="text-5xl font-bebas text-white">TALENT ROSTER</h2><button id="btn-scout" class="bg-white text-black font-black px-6 py-3 rounded-xl hover:bg-cyan-400 transition-colors">SCOUT ACTOR ($1k)</button></div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="roster-list"></div>
        `;
        const list = document.getElementById('roster-list');
        gameState.roster.forEach((actor, idx) => {
            const div = document.createElement('div');
            div.className = "bg-[#111] p-5 rounded-xl border border-white/10 flex justify-between items-center";
            div.innerHTML = `<div><div class="font-bold text-lg">${actor.name}</div><div class="text-xs text-slate-400">Skill: <span class="text-yellow-500">${actor.skill}</span></div></div><button class="text-red-500 hover:bg-red-900/20 px-3 py-2 rounded btn-fire"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`;
            div.querySelector('.btn-fire').onclick = () => { if(confirm(`Fire ${actor.name}?`)) { gameState.roster.splice(idx, 1); renderTab('roster'); } };
            list.appendChild(div);
        });
        document.getElementById('btn-scout').onclick = () => {
            if(gameState.cash >= 1000) {
                gameState.cash -= 1000;
                gameState.roster.push(generateRandomActor());
                renderTab('roster');
                updateHUD();
            } else showToast("Need $1000", 'error');
        };
    }
    lucide.createIcons();
}

// --- HELPERS ---
function generateRandomActor() {
    const first = Math.random() > 0.5 ? FIRST_NAMES_M[Math.floor(Math.random()*FIRST_NAMES_M.length)] : FIRST_NAMES_F[Math.floor(Math.random()*FIRST_NAMES_F.length)];
    const last = LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)];
    return { name: `${first} ${last}`, skill: Math.floor(Math.random() * 60) + 10, status: 'Active' };
}

function showToast(msg, type='info') {
    const c = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `p-4 rounded-xl border-l-4 shadow-2xl backdrop-blur-md text-sm font-bold bg-[#111] text-white ${type==='success'?'border-green-500':'border-red-500'} mb-2 animate-in`;
    el.innerText = msg;
    c.appendChild(el);
    setTimeout(()=>el.remove(), 3000);
}

// --- EPISODE LOGIC ---
function openEpisodeModal(show) {
    currentShow = show;
    document.getElementById('ep-title').value = '';
    document.getElementById('ep-plot').value = '';
    const castList = document.getElementById('episode-cast-list');
    castList.innerHTML = '';
    
    show.cast.forEach(actor => {
        const row = document.createElement('div');
        row.className = `flex justify-between items-center p-3 rounded-lg border mb-2 ${actor.status === 'Dead' ? 'bg-red-900/10 border-red-900/30' : 'bg-[#222] border-white/5'}`;
        row.innerHTML = `<span class="${actor.status === 'Dead' ? 'text-red-500 line-through' : 'text-white font-bold'}">${actor.name}</span>${actor.status !== 'Dead' ? `<button class="text-[10px] bg-red-900/30 text-red-400 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white transition-colors font-bold btn-kill">KILL</button>` : '<span class="text-[10px] text-red-500 font-mono font-bold">DEAD</span>'}`;
        if(actor.status !== 'Dead') {
            row.querySelector('.btn-kill').onclick = () => {
                if(confirm(`Kill ${actor.name}?`)) {
                    actor.status = 'Dead';
                    const rosterActor = gameState.roster.find(a => a.name === actor.name);
                    if(rosterActor) rosterActor.status = 'Dead';
                    openEpisodeModal(show);
                }
            };
        }
        castList.appendChild(row);
    });
    document.getElementById('episode-modal').classList.remove('hidden');
}

document.getElementById('close-episode-modal').onclick = () => document.getElementById('episode-modal').classList.add('hidden');
document.getElementById('btn-publish-episode').onclick = () => {
    const title = document.getElementById('ep-title').value;
    if(title) {
        const earnings = Math.floor(Math.random() * 50000) + 10000;
        currentShow.episodes.push({ title, earnings });
        currentShow.revenue += earnings;
        gameState.cash += earnings;
        gameState.fame += 100;
        document.getElementById('episode-modal').classList.add('hidden');
        renderTab('studio');
        showToast(`Episode Aired! Earned $${earnings.toLocaleString()}`, 'success');
        updateHUD();
    } else alert("Needs a title!");
};
