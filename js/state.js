// --- GLOBAL STATE & PERSISTENCE ---

let currentUser = null;
let activeSaveId = null;
let gameState = null;
let saveInterval = null;
let realtimeUnsubscribe = null;
let historyStack = [];
let godMode = false;

const State = {
    // Save system
    async saveGame() {
        if (!activeSaveId || !gameState) return;
        try {
            await db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves')
                .doc(activeSaveId).update(gameState);
        } catch (e) {
            console.error("Save failed:", e);
        }
    },

    // Data repair and migration
    cleanAndRepairData(data) {
        if (!data) return data;

        let wasModified = false;
        let corrupted = false;

        if (!data.products) { data.products = []; wasModified = true; }
        if (!data.reviews) { data.reviews = []; wasModified = true; }
        if (!data.employees) { data.employees = { count: 1, morale: 100 }; wasModified = true; }
        if (!data.marketModels) { data.marketModels = []; wasModified = true; }
        if (!data.purchasedItems) { data.purchasedItems = []; wasModified = true; }
        if (!data.unlockedTechs) { data.unlockedTechs = []; wasModified = true; }

        const seenIds = new Set();
        const cleanProducts = [];

        data.products.forEach(p => {
            if (!p || typeof p !== 'object' || !p.name) { wasModified = true; return; }
            if (!p.id) { p.id = Math.random().toString(36).substr(2, 9); wasModified = true; }
            if (seenIds.has(p.id)) { wasModified = true; return; }
            seenIds.add(p.id);

            p.weeksLeft = Number(p.weeksLeft);
            if (isNaN(p.weeksLeft)) { p.weeksLeft = 0; wasModified = true; }

            if (!p.type || p.type === 'undefined') { p.type = 'text'; wasModified = true; }
            if (p.specialty && !p.trait) { p.trait = p.specialty; delete p.specialty; wasModified = true; }
            if (!p.trait) p.trait = null;

            if (!p.capabilities) { p.capabilities = []; wasModified = true; }
            if (!p.contracts) { p.contracts = []; wasModified = true; }
            if (!p.apiConfig) { p.apiConfig = { active: false, price: 0, limit: 100 }; wasModified = true; }
            if (p.isOpenSource === undefined) { p.isOpenSource = false; wasModified = true; }

            // Zombie unsticker
            if (!p.released && !p.isUpdating && !p.isStaged && p.weeksLeft <= 0) {
                console.log(`[Fix] Unsticking ${p.name}`);
                p.isStaged = true;
                p.weeksLeft = 0;
                wasModified = true;
                corrupted = true;
            }

            cleanProducts.push(p);
        });

        if (cleanProducts.length !== data.products.length) wasModified = true;
        data.products = cleanProducts;

        return { data: data, modified: wasModified, corrupted: corrupted };
    },

    // Get total compute
    getCompute() {
        if (!gameState) return 0;
        return gameState.hardware.reduce((total, hw) => {
            const tier = HARDWARE.find(h => h.id === hw.typeId);
            return total + (tier ? tier.compute * hw.count : 0);
        }, 0);
    }
};

// Aliases
const saveGame = State.saveGame.bind(State);
const cleanAndRepairData = State.cleanAndRepairData.bind(State);
const getCompute = State.getCompute.bind(State);
