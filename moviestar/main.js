// --- CONFIG ---
const firebaseConfig = { apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU", authDomain: "softworks-tycoon.firebaseapp.com", projectId: "softworks-tycoon", storageBucket: "softworks-tycoon.firebasestorage.app", messagingSenderId: "591489940224", appId: "1:591489940224:web:9e355e8a43dc06446a91e5" };
try { firebase.initializeApp(firebaseConfig); } catch (e) { }
const auth = firebase.auth();
const db = firebase.firestore();
const APP_ID = 'softworks-tycoon';

let currentUser = null;
let activeSaveId = null;
let gameState = null;

// --- AUTH & LOAD ---
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        loadSaveSlots();
    } else {
        window.location.href = '../index.html'; // Redirect to root if not logged in
    }
});

function loadSaveSlots() {
    const slots = document.getElementById('save-slots');
    slots.innerHTML = 'Loading...';
    
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves')
    .limit(5).get().then(snap => {
        slots.innerHTML = '';
        if(snap.empty) {
            slots.innerHTML = '<div class="text-slate-500 col-span-3 text-center">No saves found. Start a new career.</div>';
        }
        snap.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.className = 'bg-[#111] p-6 rounded-xl border border-white/10 hover:border-pink-500 cursor-pointer transition-all';
            el.innerHTML = `
                <div class="font-bebas text-2xl text-white mb-2">${data.name}</div>
                <div class="text-xs font-mono text-slate-400">Week ${data.week} | $${data.cash.toLocaleString()}</div>
                <div class="text-xs font-mono text-slate-500 mt-2">Energy: ${data.energy}/${data.maxEnergy}</div>
            `;
            el.onclick = () => startGame(doc.id, data);
            slots.appendChild(el);
        });
    });
}

document.getElementById('btn-new-save').onclick = () => {
    const name = prompt("Enter Actor Name:");
    if(name) createNewSave(name);
};

function createNewSave(name) {
    const newGame = {
        name, cash: 500, fame: 0, week: 1, year: 2025,
        energy: 250, maxEnergy: 250, lastDoctorVisit: 0,
        skills: { acting: 5, speech: 5, looks: 5 },
        roster: [], projects: [], availableJobs: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    // Generate initial jobs
    for(let i=0; i<6; i++) newGame.availableJobs.push(generateJob(newGame.week));
    
    db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves').add(newGame)
    .then(docRef => startGame(docRef.id, newGame));
}

function startGame(id, data) {
    activeSaveId = id;
    gameState = data;
    
    // Migrations
    if(!gameState.maxEnergy) gameState.maxEnergy = 250;
    if(!gameState.energy) gameState.energy = 250;
    if(!gameState.availableJobs) gameState.availableJobs = [];
    
    document.getElementById('save-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    updateHUD();
    renderTab('career');
    lucide.createIcons();
}

// --- CORE LOGIC ---
function updateHUD() {
    document.getElementById('hud-name').textContent = gameState.name;
    document.getElementById('hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('hud-fame').textContent = gameState.fame.toLocaleString();
    document.getElementById('hud-week').textContent = `W${gameState.week}`;
    
    // Energy Bar
    const pct = (gameState.energy / gameState.maxEnergy) * 100;
    document.getElementById('hud-energy-bar').style.width = `${pct}%`;
    document.getElementById('hud-energy-text').textContent = `${gameState.energy}/${gameState.maxEnergy}`;
}

document.getElementById('btn-next-week').onclick = () => {
    gameState.week++;
    if(gameState.week % 52 === 0) {
        gameState.year++;
        gameState.maxEnergy--; // Age decay
        alert("Happy Birthday! You feel slightly older... (Max Energy -1)");
    }
    
    // Refill Energy
    gameState.energy = gameState.maxEnergy;
    
    // Refresh Jobs (Keep some, add new)
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

// --- TABS ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => {
        if(btn.id === 'btn-save-exit') {
            saveGame();
            location.reload();
            return;
        }
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active', 'bg-white', 'text-black'));
        btn.classList.add('active', 'bg-white', 'text-black');
        renderTab(btn.dataset.tab);
    };
});

function renderTab(tab) {
    const content = document.getElementById('content-area');
    content.innerHTML = '';
    content.className = 'flex-1 p-10 overflow-y-auto bg-[#080808] custom-scrollbar relative animate-in';

    if(tab === 'career') {
        content.innerHTML = `<h2 class="text-4xl font-bebas text-white mb-6">AVAILABLE ROLES</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="job-list"></div>`;
        const list = document.getElementById('job-list');
        
        gameState.availableJobs.forEach(job => {
            const el = document.createElement('div');
            el.className = "bg-[#111] p-6 rounded-xl border border-white/10 hover:border-pink-500 transition-all";
            el.innerHTML = `
                <div class="flex justify-between">
                    <h3 class="font-bold text-white text-lg">${job.title}</h3>
                    <span class="text-xs text-slate-500">${job.expires - gameState.week}w left</span>
                </div>
                <div class="text-xs text-slate-400 mb-4">${job.type.toUpperCase()} • Req: Act ${job.req}</div>
                <div class="mb-4">
                    <label class="text-[10px] uppercase font-bold text-slate-500">Energy Input</label>
                    <input type="range" min="0" max="${gameState.energy}" value="0" class="w-full accent-pink-500 energy-slider" data-id="${job.id}">
                    <div class="text-right text-xs text-pink-400 energy-val">0 Energy</div>
                </div>
                <button class="w-full bg-white text-black font-bold py-2 rounded hover:bg-pink-400 btn-audition">AUDITION</button>
            `;
            
            // Slider Logic
            const slider = el.querySelector('.energy-slider');
            const valDisplay = el.querySelector('.energy-val');
            slider.oninput = (e) => { valDisplay.textContent = `${e.target.value} Energy`; };
            
            // Audition Logic
            el.querySelector('.btn-audition').onclick = () => {
                const energySpent = parseInt(slider.value);
                if(energySpent > gameState.energy) return alert("Not enough energy!");
                
                // Calculate Success Chance
                // Base chance based on skill gap + Energy Bonus
                // If skill < req, very hard. Energy helps bridge the gap.
                const skillDiff = gameState.skills.acting - job.req;
                let chance = 50 + (skillDiff * 2); // Base 50% +/- skill
                chance += (energySpent * 0.5); // 2 Energy = 1% Chance
                
                gameState.energy -= energySpent;
                
                const roll = Math.random() * 100;
                if(roll < chance) {
                    gameState.cash += job.pay;
                    gameState.fame += job.fame;
                    gameState.availableJobs = gameState.availableJobs.filter(j => j.id !== job.id); // Remove job
                    alert(`You booked the role! Earned $${job.pay}`);
                } else {
                    alert(`Rejected! (Chance was ${Math.min(100, Math.floor(chance))}%)`);
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
                <div class="w-20 h-20 bg-pink-900/20 rounded-full flex items-center justify-center text-pink-500 mb-6"><i data-lucide="heart-pulse" class="w-10 h-10"></i></div>
                <h2 class="text-5xl font-bebas text-white mb-4">THE CLINIC</h2>
                <p class="text-slate-400 mb-8 max-w-md">Restore your vitality. Experimental treatments available.</p>
                <button id="btn-visit-doctor" class="bg-white text-black font-black py-4 px-10 rounded-xl text-xl hover:bg-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed" ${!canVisit ? 'disabled' : ''}>
                    VISIT DOCTOR ($2,500)
                </button>
                <p class="mt-4 text-xs text-slate-500">${canVisit ? 'Available Now' : 'Come back in ' + (2 - (gameState.week - gameState.lastDoctorVisit)) + ' weeks'}</p>
            </div>
        `;
        
        document.getElementById('btn-visit-doctor').onclick = () => {
            if(gameState.cash < 2500) return alert("You're broke!");
            
            gameState.cash -= 2500;
            gameState.lastDoctorVisit = gameState.week;
            
            const roll = Math.random();
            if(roll < 0.1) {
                gameState.maxEnergy -= 2;
                alert("Malpractice! The surgery went wrong. (Max Energy -2)");
            } else if (roll < 0.3) {
                alert("Nothing changed. Just a checkup.");
            } else if (roll < 0.8) {
                gameState.maxEnergy += 1;
                alert("You feel revitalized! (Max Energy +1)");
            } else {
                gameState.maxEnergy += 3;
                alert("Miracle Cure! You feel 20 again! (Max Energy +3)");
            }
            updateHUD();
            renderTab('doctor');
        };
    }
    
    // (Skills, Studio, Roster logic - simplified reuse from previous)
    if(tab === 'skills') { /* Same logic as before */ renderSkills(content); }
    if(tab === 'studio') { /* Same logic as before */ renderStudio(content); }
    if(tab === 'roster') { /* Same logic as before */ renderRoster(content); }
    
    lucide.createIcons();
}

// --- HELPER RENDERS (Re-using logic from previous artifact but cleaning up) ---
function renderSkills(content) {
    // ... Copy paste skill shop logic from previous response ...
    // Just ensure it uses gameState correctly
     content.innerHTML = `<h2 class="text-4xl font-bebas text-white mb-6">Acting School</h2><div class="grid grid-cols-1 gap-4" id="skill-list"></div>`;
        const list = document.getElementById('skill-list');
        SKILLS_SHOP.forEach(skill => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center p-6 bg-[#111] border border-white/10 rounded-xl";
            div.innerHTML = `<div><h3 class="font-bold text-lg">${skill.name}</h3><p class="text-slate-400 text-xs">${skill.desc}</p><div class="text-pink-500 text-xs font-bold mt-1">+${skill.boost} ${skill.type.toUpperCase()}</div></div><button class="bg-slate-800 hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors btn-buy">BUY $${skill.cost.toLocaleString()}</button>`;
            div.querySelector('.btn-buy').onclick = () => {
                if(gameState.cash >= skill.cost) {
                    gameState.cash -= skill.cost;
                    gameState.skills[skill.type] += skill.boost;
                    alert("Skill Improved!");
                    updateHUD();
                } else alert("Too broke!");
            };
            list.appendChild(div);
        });
}

function renderStudio(content) {
    if(!gameState.studioName) {
        content.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center"><h2 class="text-5xl font-bebas text-white mb-4">START STUDIO</h2><input id="sname" class="bg-[#222] text-white p-3 rounded mb-4" placeholder="Name"><button id="btn-start-studio" class="bg-pink-500 text-white font-bold py-3 px-8 rounded">FOUND ($50k)</button></div>`;
        document.getElementById('btn-start-studio').onclick = () => {
            const n = document.getElementById('sname').value;
            if(gameState.cash>=50000 && n) { gameState.cash-=50000; gameState.studioName = n; renderTab('studio'); updateHUD(); }
        }
    } else {
        content.innerHTML = `<div class="flex justify-between mb-6"><h2 class="text-5xl font-bebas">${gameState.studioName}</h2></div><div id="proj-list"></div><button id="btn-new-proj" class="bg-white text-black font-bold py-3 px-6 rounded mt-4">NEW PROJECT</button>`;
        // Add project logic here similar to previous
        document.getElementById('btn-new-proj').onclick = () => {
             const title = prompt("Project Title:");
             if(title) {
                 gameState.projects.push({id: Date.now(), title, type: 'movie', cast: gameState.roster.slice(0,3), revenue:0 });
                 renderTab('studio');
             }
        };
        const list = document.getElementById('proj-list');
        gameState.projects.forEach(p => {
            const d = document.createElement('div');
            d.className = "bg-[#111] p-4 rounded mb-2 border border-white/10";
            d.innerHTML = `<div class="font-bold">${p.title}</div><div class="text-xs text-slate-400">Rev: $${p.revenue}</div>`;
            list.appendChild(d);
        });
    }
}

function renderRoster(content) {
     content.innerHTML = `<div class="flex justify-between mb-6"><h2 class="text-5xl font-bebas">ROSTER</h2><button id="btn-scout" class="bg-white text-black font-bold px-4 py-2 rounded">SCOUT ($1k)</button></div><div id="r-list" class="grid grid-cols-2 gap-4"></div>`;
     const list = document.getElementById('r-list');
     gameState.roster.forEach((a, i) => {
         const d = document.createElement('div');
         d.className = "bg-[#111] p-4 rounded border border-white/10";
         d.innerHTML = `<div class="font-bold">${a.name}</div><div class="text-xs text-slate-400">Skill: ${a.skill}</div>`;
         list.appendChild(d);
     });
     document.getElementById('btn-scout').onclick = () => {
         if(gameState.cash >= 1000) {
             gameState.cash -= 1000;
             // FIX: Properly generate and push
             const newActor = {
                name: "Random Actor " + Math.floor(Math.random()*100),
                skill: Math.floor(Math.random()*50)+10,
                status: 'Active'
             };
             gameState.roster.push(newActor);
             updateHUD();
             renderTab('roster');
         }
     }
}

function saveGame() {
    if(activeSaveId && gameState) {
        db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('movie_saves').doc(activeSaveId).update(gameState);
    }
}
