// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyD0FKEuORJd63FPGbM_P3gThpZknVsytsU",
    authDomain: "softworks-tycoon.firebaseapp.com",
    projectId: "softworks-tycoon",
    storageBucket: "softworks-tycoon.firebasestorage.app",
    messagingSenderId: "591489940224",
    appId: "1:591489940224:web:9e355e8a43dc06446a91e5"
};

try {
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase Init Error:", e);
}

const auth = firebase.auth();
const db = firebase.firestore();

let isSandbox = false;
let apiTempActive = false;

// --- 2. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupEventListeners();

    // Initial UI Setup
    if (window.lucide) lucide.createIcons();
});

function setupEventListeners() {
    // Landing Screen
    const btnAI = document.getElementById('btn-mode-ai');
    if (btnAI) btnAI.onclick = () => {
        btnAI.classList.add('fade-out-up');
        setTimeout(() => document.getElementById('landing-screen').classList.add('hidden'), 500);
    };

    const btnMovie = document.getElementById('btn-mode-movie');
    if (btnMovie) btnMovie.onclick = () => window.location.href = 'https://softworks-tycoon.xyz/movie-star';

    // Save Creation
    document.getElementById('btn-confirm-create').onclick = async () => {
        const name = validateInput(document.getElementById('inp-comp-name').value, 30);
        if (!name) return;

        const newSave = {
            companyName: name,
            isSandbox: !!isSandbox,
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
            employees: { count: 1, morale: 100 },
            tutorialStep: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').add(newSave);
        document.getElementById('create-screen').classList.add('hidden');
    };

    document.getElementById('btn-cancel-create').onclick = () => document.getElementById('create-screen').classList.add('hidden');

    document.getElementById('btn-toggle-sandbox').onclick = () => {
        window.isSandbox = !window.isSandbox;
        const div = document.getElementById('btn-toggle-sandbox');
        div.classList.toggle('border-yellow-500', isSandbox);
        div.classList.toggle('bg-yellow-500/10', isSandbox);
    };

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTab(btn.dataset.tab);
        };
    });

    // Game Controls
    document.getElementById('btn-next-week').onclick = () => {
        const btn = document.getElementById('btn-next-week');
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4"></i>`;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            try {
                if (gameState) {
                    historyStack.push(JSON.parse(JSON.stringify(gameState)));
                    if (historyStack.length > 6) historyStack.shift();
                    processNextWeek();
                }
            } finally {
                btn.disabled = false;
                btn.innerHTML = `<i data-lucide="fast-forward" class="w-4 h-4"></i> <span>NEXT WEEK</span>`;
                if (window.lucide) lucide.createIcons();
            }
        }, 300);
    };

    // Modals
    setupModalListeners();
}

function setupModalListeners() {
    // Update Modal
    document.getElementById('btn-close-update').onclick = () => document.getElementById('update-modal').classList.add('hidden');
    document.getElementById('btn-cancel-update').onclick = () => document.getElementById('update-modal').classList.add('hidden');

    // API Modal
    document.getElementById('btn-close-api').onclick = () => document.getElementById('api-modal').classList.add('hidden');
    document.getElementById('btn-save-api').onclick = () => {
        const pId = document.getElementById('api-modal').dataset.productId;
        const p = gameState.products.find(x => x.id === pId);
        if (p) {
            p.apiConfig = {
                active: window.apiTempActive,
                price: parseFloat(document.getElementById('api-price-slider').value),
                limit: parseInt(document.getElementById('api-limit-slider').value)
            };
            saveGame();
            renderTab('dash');
            document.getElementById('api-modal').classList.add('hidden');
            showToast('API Config Saved', 'success');
        }
    };

    // God Mode
    document.getElementById('btn-toggle-godmode').onclick = () => {
        godMode = !godMode;
        document.getElementById('godmode-status').classList.toggle('hidden', !godMode);
        document.getElementById('btn-toggle-godmode').querySelector('div').classList.toggle('translate-x-8', godMode);
        updateHUD();
    };

    document.getElementById('admin-edit-cash').onclick = () => {
        const val = prompt("GOD MODE: Set Cash", gameState.cash);
        if (val !== null) { gameState.cash = parseInt(val); updateHUD(); saveGame(); }
    };

    document.getElementById('admin-edit-research').onclick = () => {
        const val = prompt("GOD MODE: Set Research Points", gameState.researchPts);
        if (val !== null) { gameState.researchPts = parseInt(val); updateHUD(); saveGame(); }
    };

    document.getElementById('trigger-rename').onclick = () => {
        document.getElementById('rename-modal').classList.remove('hidden');
        document.getElementById('inp-rename-company').value = gameState.companyName;
    };

    document.getElementById('btn-confirm-rename').onclick = () => {
        gameState.companyName = validateInput(document.getElementById('inp-rename-company').value, 30);
        updateHUD(); saveGame(); document.getElementById('rename-modal').classList.add('hidden');
    };

    document.getElementById('btn-cancel-rename').onclick = () => document.getElementById('rename-modal').classList.add('hidden');

    document.getElementById('btn-undo-week').onclick = () => {
        if (historyStack.length > 0) {
            gameState = historyStack.pop();
            updateHUD();
            saveGame();
            renderTab('dash');
            showToast("Timeline Reverted", "info");
        } else {
            showToast("No history found", "error");
        }
    };

    // Confirm Update Logic
    document.getElementById('btn-confirm-update').onclick = () => {
        const pId = document.getElementById('update-modal').dataset.productId;
        const type = document.getElementById('update-modal').dataset.updateType;
        const p = gameState.products.find(x => x.id === pId);
        const research = parseInt(document.getElementById('update-research-slider').value) || 0;

        if (p && gameState.researchPts >= research) {
            gameState.researchPts -= research;
            p.isUpdating = true;
            p.released = false;
            p.weeksLeft = type === 'major' ? 6 : 2;
            p.quality += Math.floor(research / 5);
            document.getElementById('update-modal').classList.add('hidden');
            renderTab('dash');
            updateHUD();
            showToast(`${p.name} update started!`, 'success');
        }
    };

    const updateSlider = document.getElementById('update-research-slider');
    if (updateSlider) {
        updateSlider.oninput = (e) => {
            document.getElementById('update-inject-val').textContent = `${e.target.value} PTS`;
            document.getElementById('update-quality-boost').textContent = Math.floor(e.target.value / 5);
        };
    }

    // Variant Modal Logic
    document.getElementById('btn-close-variant').onclick = () => document.getElementById('variant-modal').classList.add('hidden');

    document.querySelectorAll('.variant-opt').forEach(opt => {
        opt.onclick = () => {
            document.querySelectorAll('.variant-opt').forEach(o => o.classList.remove('border-cyan-500', 'bg-cyan-900/30'));
            opt.classList.add('border-cyan-500', 'bg-cyan-900/30');
            window.selectedVariantType = opt.dataset.type;
            document.getElementById('custom-variant-input').classList.toggle('hidden', opt.dataset.type !== 'custom');
            document.getElementById('btn-confirm-variant').disabled = false;
            document.getElementById('btn-confirm-variant').textContent = 'CONFIRM VARIANT';
            document.getElementById('btn-confirm-variant').classList.add('bg-white', 'text-black');
        };
    });

    document.getElementById('btn-confirm-variant').onclick = () => {
        const pId = document.getElementById('variant-modal').dataset.productId;
        const base = gameState.products.find(x => x.id === pId);
        if (!base || !window.selectedVariantType) return;

        let varName = window.selectedVariantType.charAt(0).toUpperCase() + window.selectedVariantType.slice(1);
        if (window.selectedVariantType === 'custom') {
            varName = validateInput(document.getElementById('inp-custom-variant').value, 15) || 'Custom';
        }

        const research = parseInt(document.getElementById('variant-research-slider').value) || 0;
        if (gameState.researchPts < research) return showToast('Need more research!', 'error');

        const newVar = {
            id: Date.now().toString(),
            name: `${base.name} ${varName}`,
            type: base.type,
            version: 1.0,
            quality: Math.floor(base.quality * 0.8) + Math.floor(research / 5),
            weeksLeft: 4,
            released: false,
            isStaged: false,
            isUpdating: false,
            trait: base.trait,
            description: `A ${varName} variant of ${base.name}.`,
            revenue: 0,
            hype: 50,
            isOpenSource: base.isOpenSource
        };

        gameState.researchPts -= research;
        gameState.products.push(newVar);
        document.getElementById('variant-modal').classList.add('hidden');
        renderTab('dash');
        updateHUD();
        showToast(`Variant ${newVar.name} initiated!`, 'success');
    };

    const variantSlider = document.getElementById('variant-research-slider');
    if (variantSlider) {
        variantSlider.oninput = (e) => {
            document.getElementById('variant-inject-val').textContent = `${e.target.value} PTS`;
            document.getElementById('variant-quality-boost').textContent = Math.floor(e.target.value / 5);
        };
    }

    // API Modal Toggle
    document.getElementById('btn-toggle-api-status').onclick = () => {
        window.apiTempActive = !window.apiTempActive;
        const btn = document.getElementById('btn-toggle-api-status');
        btn.querySelector('div').classList.toggle('translate-x-6', window.apiTempActive);
        btn.classList.toggle('bg-green-500', window.apiTempActive);
        document.getElementById('api-status-text').textContent = window.apiTempActive ? 'API ONLINE' : 'API OFFLINE';
    };
}

// --- MODAL OPENERS (Global) ---

window.openUpdateModal = (pId, type) => {
    const p = gameState.products.find(x => x.id === pId);
    if (!p) return;
    const modal = document.getElementById('update-modal');
    modal.classList.remove('hidden');
    modal.dataset.productId = pId;
    modal.dataset.updateType = type;

    document.getElementById('update-title').textContent = type === 'major' ? `v${Math.floor(p.version) + 1}.0 UPGRADE` : 'PATCH UPDATE';
};

window.openApiModal = (pId) => {
    const p = gameState.products.find(x => x.id === pId);
    if (!p) return;
    const modal = document.getElementById('api-modal');
    modal.classList.remove('hidden');
    modal.dataset.productId = pId;

    document.getElementById('api-price-slider').value = p.apiConfig?.price || 0;
    document.getElementById('api-limit-slider').value = p.apiConfig?.limit || 100;
};

window.openVariantModal = (pId) => {
    const p = gameState.products.find(x => x.id === pId);
    if (!p) return;
    const modal = document.getElementById('variant-modal');
    modal.classList.remove('hidden');
    modal.dataset.productId = pId;
    document.getElementById('variant-base-name').textContent = p.name;

    // Reset selections
    document.querySelectorAll('.variant-opt').forEach(o => o.classList.remove('border-cyan-500', 'bg-cyan-900/30'));
    document.getElementById('btn-confirm-variant').disabled = true;
    document.getElementById('btn-confirm-variant').textContent = 'SELECT A VARIANT';
    document.getElementById('btn-confirm-variant').classList.remove('bg-white', 'text-black');
};

// --- TUTORIAL ENGINE ---

window.runTutorial = (step) => {
    if (step === 99) return;

    const steps = [
        { msg: "Welcome, Agent. Let's build the future of AI.", target: null },
        { msg: "First, you need hardware. Head to the MARKET tab.", target: document.querySelector('[data-tab="market"]') },
        { msg: "Buy a GPU Cluster to get started.", target: null },
        { msg: "Now, create your first model in the DEV tab.", target: document.querySelector('[data-tab="dev"]') },
        { msg: "Once cooked, launch it from the DASHBOARD.", target: document.querySelector('[data-tab="dash"]') }
    ];

    if (step < steps.length) {
        showToast(steps[step].msg);
        positionHighlight(steps[step].target);
        gameState.tutorialStep = step + 1;
    } else {
        positionHighlight(null);
        gameState.tutorialStep = 99;
    }
    saveGame();
};
