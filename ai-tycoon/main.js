// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU",
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

try { firebase.initializeApp(firebaseConfig); } catch (e) { console.error("Firebase Init Error:", e); }
const auth = firebase.auth();
const db = firebase.firestore();

// Global State
let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveInterval = null;
let realtimeUnsubscribe = null;
const APP_ID = 'softworks-tycoon';

// --- DATA IMPORT SAFETY ---
// (Same imports as before, plus Music)
const HARDWARE = (typeof HARDWARE_DB !== 'undefined') ? HARDWARE_DB : [];
const COMPANIES = (typeof COMPANIES_DB !== 'undefined') ? COMPANIES_DB : [];
const CAMPAIGNS = (typeof CAMPAIGNS_DB !== 'undefined') ? CAMPAIGNS_DB : [];
const RIVALS_LIST = (typeof RIVALS_DB !== 'undefined') ? RIVALS_DB : [];
const PREFIXES = (typeof MODEL_PREFIXES !== 'undefined') ? MODEL_PREFIXES : [];
const SUFFIXES = (typeof MODEL_SUFFIXES !== 'undefined') ? MODEL_SUFFIXES : [];
const VERSIONS = (typeof MODEL_VERSIONS !== 'undefined') ? MODEL_VERSIONS : [];

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

        loadSaves();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('hub-screen').classList.add('hidden');
    }
});

// (Keep login event listeners same as before)
document.getElementById('btn-login-google').addEventListener('click', () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
document.getElementById('btn-login-guest').addEventListener('click', () => auth.signInAnonymously());
document.getElementById('btn-logout').addEventListener('click', () => auth.signOut().then(() => location.reload()));

// --- HUB LOGIC (NEW) ---
// Switch between Hub, AI App, and Music App
function goToHub() {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('app-ai').classList.add('hidden');
    document.getElementById('app-music').classList.add('hidden');
    document.getElementById('hub-screen').classList.remove('hidden');
}

function launchApp(appId) {
    document.getElementById('hub-screen').classList.add('hidden');
    if (appId === 'ai') {
        document.getElementById('app-ai').classList.remove('hidden');
        updateHUD();
        renderTab('dash'); // Initial render
    } else if (appId === 'music') {
        document.getElementById('app-music').classList.remove('hidden');
        initMusicSim(); // Initialize music logic from music.js
    }
}

// Hub Event Listeners
document.getElementById('launch-ai').onclick = () => launchApp('ai');
document.getElementById('launch-music').onclick = () => launchApp('music');
document.querySelectorAll('.btn-home-hub').forEach(btn => {
    btn.onclick = () => goToHub();
});


// --- SAVE SYSTEM ---
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
        hardware: [], 
        products: [],
        marketModels: [], 
        reviews: [],
        unlockedTechs: [],
        purchasedItems: [], 
        employees: { count: 1, morale: 100, happiness: 100 },
        // MUSIC DATA INIT
        music: {
            artistName: "Lil Algo",
            fame: 0,
            listeners: 0,
            flow: 100,
            label: 'indie',
            discography: []
        },
        tutorialStep: 0,
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
    
    // --- SAFEGUARDS & MIGRATION ---
    // Ensure all AI arrays exist
    if(!gameState.reviews) gameState.reviews = [];
    if(!gameState.purchasedItems) gameState.purchasedItems = [];
    if(!gameState.marketModels) gameState.marketModels = []; 
    if(gameState.tutorialStep === undefined) gameState.tutorialStep = 99; 
    if(!gameState.employees) gameState.employees = { count: 1, morale: 100, happiness: 100 };
    
    // Ensure Music Object Exists
    if(!gameState.music) {
        gameState.music = {
            artistName: "Lil Algo",
            fame: 0,
            listeners: 0,
            flow: 100,
            label: 'indie',
            discography: []
        };
    }
    
    // Hide Menu, Show Hub
    document.getElementById('menu-screen').classList.add('hidden');
    goToHub();
    
    setupRealtimeListener(id);
    lucide.createIcons();

    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

// ... [Rest of AI Logic: updateHUD, getCompute, showToast] ...
// KEEP ALL YOUR EXISTING AI FUNCTIONS (updateHUD, getCompute, showToast, renderTab, etc.) HERE.
// Just make sure updateHUD also updates the Music header if it's visible.

function updateHUD() {
    // AI HUD
    const aiCash = document.getElementById('hud-cash');
    if(aiCash) {
        document.getElementById('hud-company-name').textContent = gameState.companyName;
        document.getElementById('hud-cash').textContent = '$' + gameState.cash.toLocaleString();
        document.getElementById('hud-compute').textContent = getCompute() + ' TF';
        document.getElementById('hud-research').textContent = Math.floor(gameState.researchPts) + ' PTS';
        document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`;
    }
    // Music HUD is handled in music.js via updateMusicHUD, but we can trigger it here too if needed
    if(typeof updateMusicHUD === 'function') updateMusicHUD();
}

// --- SHARED NEXT WEEK LOGIC ---
// This function will be called by BOTH the AI "Next" button and the Music "Next" button
// We can create a wrapper or just expose this function globally.

function processNextWeek(source) {
    // 1. Time Progression
    gameState.week++;
    if(gameState.week > 52) { gameState.week = 1; gameState.year++; }

    // 2. AI Updates (Wages, Hardware, Products)
    if(gameState.employees) {
        const wages = (gameState.employees.count || 1) * 800;
        gameState.cash -= wages;
        if(Math.random() > 0.8 && gameState.employees.morale > 20) gameState.employees.morale -= 2;
    }

    const upkeep = gameState.hardware.reduce((sum, hw) => {
        const tier = HARDWARE.find(x => x.id === hw.typeId);
        return sum + (tier ? tier.upkeep * hw.count : 0);
    }, 0);
    gameState.cash -= upkeep;
    gameState.researchPts += Math.floor(gameState.reputation / 5) + Math.floor(getCompute() * 0.05) + 5;

    // AI Product Revenue & Decay
    if (gameState.products) {
        gameState.products.forEach(p => {
            // ... (Your existing product logic: updating weeksLeft, revenue, obsolescence) ...
            // PASTE THE LOGIC FROM PREVIOUS MAIN.JS HERE
            // For brevity in this response, I assume you keep the logic we just perfected.
            
            // [Simplified placeholder for logic]
            if((!p.released || p.isUpdating) && p.weeksLeft > 0) {
                 p.weeksLeft--;
                 if(p.weeksLeft <= 0) {
                     p.isUpdating = false;
                     p.released = true;
                     showToast(`${p.name} Ready!`, 'success');
                 }
            }
            if(p.released && !p.isUpdating) {
                let rev = Math.floor(p.quality * p.hype * 10);
                gameState.cash += rev;
                p.revenue += rev;
                p.hype = Math.max(0, p.hype - 1);
            }
        });
    }
    
    // 3. Music Updates (Flow, Streams)
    if (gameState.music) {
        if(gameState.music.flow < 100) gameState.music.flow += 5;
        
        let weeklyStreams = 0;
        gameState.music.discography.forEach(s => {
            // Decay based on age
            const age = (gameState.week + (gameState.year * 52)) - (s.weekReleased + (s.yearReleased * 52));
            const decay = Math.max(0.1, 1 - (age * 0.05));
            const newStreams = Math.floor(s.quality * 100 * decay);
            s.streams += newStreams;
            weeklyStreams += newStreams;
        });
        
        // Royalties (approx $0.004 per stream)
        const royalties = Math.floor(weeklyStreams * 0.004);
        gameState.cash += royalties;
        gameState.music.listeners = weeklyStreams; // Simulating active listeners
    }

    // 4. Rivals
    if(Math.random() > 0.7) {
        if(typeof generateRivalRelease === 'function') generateRivalRelease();
    }

    // 5. Save & Render
    saveGame();
    updateHUD();
    
    // Refresh current view
    const currentAiTab = document.querySelector('#app-ai .nav-btn.active')?.dataset.tab || 'dash';
    const currentMusicTab = document.querySelector('.music-nav-btn.active')?.dataset.tab || 'studio';
    
    if (!document.getElementById('app-ai').classList.contains('hidden')) renderTab(currentAiTab);
    if (!document.getElementById('app-music').classList.contains('hidden')) renderMusicTab(currentMusicTab);
    
    lucide.createIcons();
}

// Hook up buttons
document.getElementById('btn-next-week').onclick = () => processNextWeek('ai'); // AI button

// ... (Keep the rest of your renderTab, startUpdate, modal logic here) ...
