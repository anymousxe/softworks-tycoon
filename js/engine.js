// --- GAME ENGINE ---

const Engine = {
    // Generate Rival Release
    generateRivalRelease() {
        const rival = RIVALS_LIST[Math.floor(Math.random() * RIVALS_LIST.length)];
        const type = PRODUCTS[Math.floor(Math.random() * 4)];
        const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
        const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
        const ver = VERSIONS[Math.floor(Math.random() * VERSIONS.length)];

        const newModel = {
            id: 'rival_' + Date.now(),
            name: `${prefix} ${suffix} ${ver}`,
            company: rival.name,
            color: rival.color,
            quality: Math.floor(Math.random() * 80) + 40,
            type: type.id,
            version: ver,
            isUser: false
        };

        if (!gameState.marketModels) gameState.marketModels = [];
        gameState.marketModels.push(newModel);
        if (gameState.marketModels.length > 30) gameState.marketModels.shift();

        Utils.showToast(`${rival.name} released ${newModel.name}!`, 'info');
    },

    // Static Reviews Generator
    generateReviews() {
        gameState.products.forEach(p => {
            if (p.released && Math.random() > 0.7) {
                const pool = p.quality > 120 ? REVIEWS_DB.god : (p.quality > 85 ? REVIEWS_DB.high : (p.quality > 60 ? REVIEWS_DB.mid : REVIEWS_DB.low));
                const text = pool[Math.floor(Math.random() * pool.length)];
                const rating = p.quality > 120 ? 5 : (p.quality > 85 ? 4 : (p.quality > 60 ? 3 : 2));

                if (!gameState.reviews) gameState.reviews = [];
                gameState.reviews.unshift({
                    user: 'user_' + Math.floor(Math.random() * 999),
                    product: p.name,
                    text: text,
                    rating: rating
                });

                if (gameState.reviews.length > 50) gameState.reviews.pop();

                // Hype impact
                p.hype = Math.min(500, p.hype + (rating >= 4 ? 10 : -20));
                gameState.reputation += (rating >= 4 ? 2 : -5);
            }
        });
    },

    // Main Progression Logic
    processNextWeek() {
        if (!gameState) return;

        // 1. Time Advancement
        gameState.week++;
        if (gameState.week > 52) { gameState.week = 1; gameState.year++; }

        // 2. Resource Expenses
        const empCount = (gameState.employees && gameState.employees.count) || 1;
        const totalWages = empCount * 500;
        const upkeep = gameState.hardware.reduce((acc, hw) => {
            const h = HARDWARE.find(x => x.id === hw.typeId);
            return acc + (h ? h.upkeep * hw.count : 0);
        }, 0);

        gameState.cash -= (totalWages + upkeep);

        // 3. Product Development
        const compute = getCompute();
        const speedMult = Math.min(2.0, Math.max(0.5, compute / (gameState.products.length * 10 || 1)));

        gameState.products.forEach(p => {
            if (!p.released || p.isUpdating) {
                p.weeksLeft -= (1 * speedMult);
                if (p.weeksLeft <= 0) {
                    if (p.isUpdating) {
                        p.released = true; p.isUpdating = false; p.weeksLeft = 0;
                        p.version += 0.1; p.quality += 10;
                        Utils.showToast(`${p.name} Update Released!`, 'success');
                    } else {
                        p.isStaged = true; p.weeksLeft = 0;
                        Utils.showToast(`${p.name} ready for polish!`, 'success');
                    }
                }
            }

            // 4. Revenue Generation
            if (p.released && !p.isOpenSource) {
                const qualityMult = p.quality / 50;
                const hypeMult = 1 + (p.hype / 100);
                const marketShare = (p.contracts || []).length * 1000;
                p.revenue = Math.floor((500 + marketShare) * qualityMult * hypeMult);
                gameState.cash += p.revenue;

                // Decay
                p.hype = Math.max(0, p.hype - 5);
                p.quality = Math.max(1, p.quality - 0.1);
            }
        });

        // 5. Research Points
        const resBonus = gameState.purchasedItems?.includes('server_opt') ? 1.5 : 1;
        gameState.researchPts += (2 * resBonus);

        // 6. External Events
        if (Math.random() > 0.8) this.generateRivalRelease();
        this.generateReviews();

        // Finalize
        UI.updateHUD();
        saveGame();

        const currentTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
        UI.renderTab(currentTab);
    }
};

// Alias
const processNextWeek = Engine.processNextWeek.bind(Engine);
