// --- UI RENDERING & COMPONENT LOGIC ---

const UI = {
    // Top HUD Update
    updateHUD() {
        if (!gameState) return;

        document.getElementById('hud-company-name').textContent = gameState.companyName;
        document.getElementById('hud-cash').textContent = '$' + gameState.cash.toLocaleString();
        document.getElementById('hud-compute').textContent = getCompute() + ' TF';
        document.getElementById('hud-research').textContent = Math.floor(gameState.researchPts) + ' PTS';
        document.getElementById('hud-date').textContent = `W${gameState.week}/${gameState.year}`;

        if (typeof checkAdminAccess === 'function') checkAdminAccess();

        if (godMode) {
            document.getElementById('admin-edit-cash').classList.remove('hidden');
            document.getElementById('admin-edit-research').classList.remove('hidden');
            this.renderGodModeList();
        } else {
            document.getElementById('admin-edit-cash').classList.add('hidden');
            document.getElementById('admin-edit-research').classList.add('hidden');
        }
    },

    // Main Tab Router
    renderTab(tab) {
        const content = document.getElementById('content-area');
        if (!content) return;

        content.innerHTML = '';
        content.className = 'animate-in';

        switch (tab) {
            case 'dash': this.renderDash(content); break;
            case 'stats': this.renderStats(content); break;
            case 'dev': this.renderDev(content); break;
            case 'market': this.renderMarket(content); break;
            case 'shop': this.renderShop(content); break;
            case 'reviews': this.renderReviews(content); break;
            case 'biz': this.renderBiz(content); break;
            case 'lab': this.renderLab(content); break;
        }

        if (window.lucide) lucide.createIcons();
    },

    // --- SUB-RENDERS ---

    renderDash(container) {
        const liveProducts = (gameState.products || []).filter(p => p.released).length;
        const rev = (gameState.products || []).reduce((acc, p) => acc + (p.revenue || 0), 0);

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live Products</div>
                    <div class="text-4xl font-black text-white mt-2">${liveProducts}</div>
                </div>
                <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lifetime Revenue</div>
                    <div class="text-4xl font-black text-green-400 mt-2">$${rev.toLocaleString()}</div>
                </div>
                <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reputation</div>
                    <div class="text-4xl font-black text-purple-400 mt-2">${Math.floor(gameState.reputation)}</div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="product-list"></div>
        `;

        const list = document.getElementById('product-list');
        (gameState.products || []).forEach(p => {
            const card = this.createProductCard(p);
            list.appendChild(card);
        });
    },

    createProductCard(p) {
        try {
            const card = document.createElement('div');
            card.className = 'glass-panel p-6 relative group hover:border-cyan-500/50 transition-all rounded-2xl overflow-hidden';

            const prodType = PRODUCTS.find(pt => pt.id === p.type);
            const displaySpecs = prodType ? prodType.specs.join(' • ') : "Legacy Model";

            if (!p.released && p.isStaged) {
                this.setupStagingCard(card, p, displaySpecs);
            } else if (p.released && !p.isUpdating) {
                this.setupLiveCard(card, p, displaySpecs);
            } else {
                this.setupDevCard(card, p);
            }
            return card;
        } catch (err) {
            console.error("Error rendering product card", err);
            return document.createElement('div');
        }
    },

    // (Helper renderers for Dash cards)
    setupStagingCard(card, p, displaySpecs) {
        card.classList.add('border-green-500', 'bg-green-900/10');
        const availableCaps = CAPABILITIES.filter(cap => !(p.capabilities || []).includes(cap.id));
        const capsOptions = availableCaps.map(c => `<option value="${c.id}">${c.name} (+${c.time}w, $${c.cost})</option>`).join('');

        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 class="font-bold text-white text-xl">${sanitizeHTML(p.name)}</h3>
                    <div class="text-[10px] text-slate-400 uppercase tracking-widest">${displaySpecs}</div>
                </div>
                <span class="text-xs font-black bg-green-500 text-black px-2 py-1 rounded animate-pulse">COOKING</span>
            </div>
            <div class="p-3 bg-slate-900/50 rounded-xl mb-4 border border-slate-800 text-xs text-slate-400 italic">
                "${sanitizeHTML(p.description || 'No description provided.')}"
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-black/40 p-3 rounded-xl border border-white/5"><div class="text-[9px] text-slate-500 uppercase font-bold">Current Quality</div><div class="text-white font-black text-xl">${p.quality}</div></div>
                <div class="bg-black/40 p-3 rounded-xl border border-white/5"><div class="text-[9px] text-slate-500 uppercase font-bold">Trait</div><div class="text-purple-400 font-bold uppercase text-xs mt-1">${p.trait ? p.trait.toUpperCase() : 'NONE'}</div></div>
            </div>
            <div class="mb-4">
                 <label class="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Install Module</label>
                 <div class="flex gap-2">
                    <select class="cap-selector bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 flex-1 outline-none">${capsOptions || '<option disabled>Maxed Out!</option>'}</select>
                    <button class="btn-add-cap bg-slate-800 hover:bg-white hover:text-black text-white px-4 py-2 rounded-lg font-bold text-xs">INSTALL</button>
                 </div>
            </div>
            <button class="btn-launch w-full bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl font-black text-xs tracking-widest transition-all shadow-lg shadow-green-500/20">LAUNCH MODEL 🚀</button>
        `;

        card.querySelector('.btn-add-cap').onclick = () => {
            const capId = card.querySelector('.cap-selector').value;
            const cap = CAPABILITIES.find(c => c.id === capId);
            if (cap && gameState.cash >= cap.cost) {
                gameState.cash -= cap.cost;
                p.weeksLeft += cap.time;
                p.quality += cap.quality;
                p.isStaged = false;
                if (!p.capabilities) p.capabilities = [];
                p.capabilities.push(cap.id);
                this.updateHUD(); this.renderTab('dash');
                showToast(`Installing ${cap.name}...`, 'success');
            } else {
                showToast(`Need $${cap.cost || '??'}`, 'error');
            }
        };

        card.querySelector('.btn-launch').onclick = () => {
            p.released = true; p.isStaged = false; p.hype = 100;
            gameState.reputation += 25;
            this.updateHUD(); this.renderTab('dash');
            showToast(`${p.name} is LIVE!`, 'success');
        };
    },

    setupLiveCard(card, p, displaySpecs) {
        const apiActive = p.apiConfig && p.apiConfig.active;
        const apiStatus = apiActive ? (p.apiConfig.price === 0 ? 'text-purple-400' : 'text-green-400') : 'text-slate-600';

        card.innerHTML += `
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h3 class="text-2xl font-bold text-white tracking-tight">${sanitizeHTML(p.name)} <span class="text-cyan-500 text-sm font-mono">v${p.version}</span></h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <div class="text-xs text-slate-500 font-bold bg-slate-800 px-2 py-0.5 rounded">${(p.type || 'text').toUpperCase()}</div>
                        ${p.trait ? `<div class="text-xs text-pink-300 font-bold bg-pink-900/30 border border-pink-500/30 px-2 py-0.5 rounded">${p.trait.toUpperCase()}</div>` : ''}
                        <div class="text-xs font-bold bg-slate-900/50 inline-block px-2 py-0.5 rounded ${apiStatus} flex items-center gap-1"><i data-lucide="globe" class="w-3 h-3"></i> API</div>
                        ${p.isOpenSource ? `<div class="text-xs font-bold bg-blue-900/50 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded flex items-center gap-1">OPEN SOURCE</div>` : ''}
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Weekly Rev</div>
                    <div class="text-green-400 font-mono font-bold">$${p.isOpenSource ? 0 : Math.floor(p.revenue * 0.01).toLocaleString()}</div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-black/40 p-3 rounded-xl border border-white/5"><div class="text-[9px] text-slate-500 uppercase font-bold">Quality</div><div class="text-green-400 font-black text-xl">${p.quality}</div></div>
                <div class="bg-black/40 p-3 rounded-xl border border-white/5"><div class="text-[9px] text-slate-500 uppercase font-bold">Hype</div><div class="text-purple-400 font-black text-xl">${p.hype}</div></div>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-2">
                 <button class="bg-slate-800 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-700 btn-patch rounded-xl tracking-wider transition-colors">PATCH</button>
                 <button class="bg-white text-black px-3 py-3 text-[10px] font-bold hover:bg-cyan-400 btn-major rounded-xl tracking-wider transition-colors">v${Math.floor(p.version) + 1}.0</button>
            </div>
            <div class="grid grid-cols-2 gap-2">
                 <button class="border border-slate-700 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-800 hover:border-purple-500 btn-variant rounded-xl tracking-wider transition-colors">VARIANT</button>
                 <button class="border border-slate-700 text-white px-3 py-3 text-[10px] font-bold hover:bg-slate-800 hover:border-green-500 btn-api rounded-xl tracking-wider transition-colors">API</button>
            </div>
            <button class="w-full mt-2 text-slate-500 hover:text-red-500 text-[10px] font-bold py-2 btn-delete">DISCONTINUE</button>
        `;

        card.querySelector('.btn-patch').onclick = () => openUpdateModal(p.id, 'minor');
        card.querySelector('.btn-major').onclick = () => openUpdateModal(p.id, 'major');
        card.querySelector('.btn-variant').onclick = () => openVariantModal(p.id);
        card.querySelector('.btn-api').onclick = () => openApiModal(p.id);
        card.querySelector('.btn-delete').onclick = () => { if (confirm('Discontinue?')) { gameState.products = gameState.products.filter(x => x.id !== p.id); saveGame(); this.renderTab('dash'); } };
    },

    setupDevCard(card, p) {
        card.innerHTML += `
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-white text-lg">${sanitizeHTML(p.name)}</h3>
                <span class="text-xs font-mono text-cyan-500 bg-cyan-900/20 px-2 py-1 rounded">${Math.ceil(p.weeksLeft)}w LEFT</span>
            </div>
            <div class="text-slate-500 text-xs font-mono mb-3 uppercase tracking-wider">${p.isUpdating ? 'Updating...' : `Training...`}</div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="h-full bg-cyan-500 animate-pulse" style="width: 50%"></div></div>
        `;
    },

    // --- OTHER TABS ---

    renderStats(container) {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white tracking-tight">GLOBAL LEADERBOARD</h2>
            </div>
            <div class="glass-panel rounded-2xl overflow-hidden border border-slate-800">
                <div class="grid grid-cols-6 bg-slate-900/80 p-4 text-[10px] uppercase font-bold text-slate-500">
                    <div>Rank</div><div>Type</div><div class="col-span-2">Model Name</div><div>Developer</div><div class="text-right">Quality</div>
                </div>
                <div id="stats-list" class="divide-y divide-slate-800/50"></div>
            </div>
        `;
        const allModels = [
            ...(gameState.products || []).filter(p => p.released).map(p => ({ ...p, company: gameState.companyName, isUser: true })),
            ...gameState.marketModels
        ].sort((a, b) => b.quality - a.quality);

        const list = document.getElementById('stats-list');
        allModels.forEach((m, i) => {
            const el = document.createElement('div');
            el.className = `grid grid-cols-6 p-4 items-center text-sm ${m.isUser ? 'bg-cyan-900/10' : ''}`;
            el.innerHTML = `
                <div class="text-slate-500">#${i + 1}</div>
                <div class="text-slate-400 flex items-center gap-2"><span class="text-[9px] font-bold uppercase tracking-wider text-slate-600">${m.type ? m.type.substring(0, 4) : 'UNK'}</span></div>
                <div class="col-span-2 font-bold text-white">${sanitizeHTML(m.name)}</div>
                <div class="${m.color || 'text-slate-400'} text-xs font-bold">${sanitizeHTML(m.company)}</div>
                <div class="text-right font-mono font-bold ${m.quality > 100 ? 'text-purple-400' : 'text-slate-300'}">${m.quality}</div>
            `;
            list.appendChild(el);
        });
    },

    renderDev(container) {
        container.innerHTML = `
            <h2 class="text-3xl font-black text-white mb-6 tracking-tight">NEW PROJECT</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" id="dev-types"></div>
                <div class="glass-panel p-8 rounded-2xl h-fit border-l-4 border-cyan-500">
                    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Codename</label>
                    <input id="new-proj-name" class="w-full bg-black/50 border border-slate-700 p-4 text-white mb-4 rounded-xl outline-none font-bold" placeholder="Project Name">
                    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Description</label>
                    <textarea id="new-proj-specs" class="w-full bg-black/50 border border-slate-700 p-4 text-white mb-6 rounded-xl outline-none font-mono text-sm h-20 resize-none" placeholder="e.g. Best for coding..."></textarea>
                    
                    <div id="specialty-container" class="mb-6 hidden">
                        <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Special Trait</label>
                        <select id="specialty-select" class="w-full bg-slate-900 border border-slate-700 p-3 text-white rounded-xl outline-none text-sm font-bold mb-2">
                             ${TRAITS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                        </select>
                        <p id="specialty-desc" class="text-xs text-slate-500 italic">Select a model type.</p>
                    </div>

                    <div class="flex items-center gap-2 mb-4">
                        <input type="checkbox" id="chk-opensource" class="accent-cyan-500 w-4 h-4 cursor-pointer">
                        <label for="chk-opensource" class="text-xs text-slate-400 font-bold uppercase cursor-pointer">Open Source (Rep++ / No Revenue)</label>
                    </div>

                    <div class="mb-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                        <div class="flex justify-between text-xs font-bold text-purple-300 mb-2"><span>Research Injection</span><span id="inject-val">0 PTS</span></div>
                        <div class="flex gap-2">
                            <input type="range" id="research-inject" min="0" max="${gameState.researchPts}" value="0" class="flex-1 accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer self-center">
                            <input type="number" id="research-inject-input" class="w-20 bg-slate-900 text-white text-xs font-mono text-center border border-slate-700 rounded p-2 outline-none" value="0">
                        </div>
                        <div class="text-[10px] text-slate-400 mt-2 text-right font-mono">+<span id="quality-boost" class="text-white font-bold">0</span> Quality</div>
                    </div>
                    <button id="btn-start-dev" class="w-full bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-lg text-sm tracking-widest">INITIALIZE</button>
                </div>
            </div>
        `;

        let selectedType = null;
        const grid = document.getElementById('dev-types');
        PRODUCTS.forEach(p => {
            const locked = p.reqTech && !gameState.unlockedTechs.includes(p.reqTech);
            const btn = document.createElement('div');
            btn.className = `p-6 border cursor-pointer rounded-2xl transition-all relative ${locked ? 'border-slate-800 opacity-40 bg-slate-900/10' : 'border-slate-700 hover:border-cyan-500 hover:bg-slate-900/60 bg-slate-900/30'}`;
            btn.innerHTML = `<div class="flex justify-between mb-3"><div class="font-bold text-white text-lg">${p.name}</div>${locked ? '<i data-lucide="lock" class="w-4 h-4 text-red-500"></i>' : ''}</div><div class="text-xs text-slate-500 font-mono">Cost: $${p.cost.toLocaleString()} | Compute: ${p.compute} TF</div>`;
            if (!locked) btn.onclick = () => {
                document.querySelectorAll('#dev-types > div').forEach(d => d.classList.remove('border-cyan-500', 'bg-cyan-900/20'));
                btn.classList.add('border-cyan-500', 'bg-cyan-900/20'); selectedType = p;
                document.getElementById('specialty-container').classList.toggle('hidden', p.id !== 'custom');
            };
            grid.appendChild(btn);
        });

        // Event listeners (Injecting into the newly created DOM)
        const specialtySelect = document.getElementById('specialty-select');
        if (specialtySelect) specialtySelect.onchange = () => {
            const spec = TRAITS.find(s => s.id === specialtySelect.value);
            if (spec) document.getElementById('specialty-desc').textContent = `${spec.desc} (x${spec.multCost} Cost, x${spec.multTime} Time)`;
        };

        const slider = document.getElementById('research-inject');
        const numInput = document.getElementById('research-inject-input');
        if (slider && numInput) {
            const sync = (val) => {
                let v = Math.min(gameState.researchPts, Math.max(0, parseInt(val) || 0));
                slider.value = v; numInput.value = v;
                document.getElementById('inject-val').textContent = `${v} PTS`;
                document.getElementById('quality-boost').textContent = v;
            };
            slider.oninput = (e) => sync(e.target.value);
            numInput.oninput = (e) => sync(e.target.value);
        }

        document.getElementById('btn-start-dev').onclick = () => {
            const name = validateInput(document.getElementById('new-proj-name').value, 40);
            const desc = validateInput(document.getElementById('new-proj-specs').value, 200);
            const research = parseInt(slider.value) || 0;
            if (!name || !selectedType) return showToast('Missing Info', 'error');
            if (gameState.cash < selectedType.cost) return showToast('No Money', 'error');

            gameState.cash -= selectedType.cost;
            gameState.researchPts -= research;
            gameState.products.push({
                id: Date.now().toString(), name, type: selectedType.id, version: 1.0, quality: 50 + research,
                weeksLeft: selectedType.time, released: false, isStaged: false, isUpdating: false,
                trait: selectedType.id === 'custom' ? specialtySelect.value : null,
                description: desc || "A cool model.", revenue: 0, hype: 0, isOpenSource: document.getElementById('chk-opensource').checked
            });
            this.updateHUD(); showToast('Development Started!', 'success'); this.renderTab('dash');
        };
    },

    renderMarket(container) {
        container.innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">HARDWARE MARKET</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="server-grid"></div>`;
        const grid = document.getElementById('server-grid');
        HARDWARE.forEach(h => {
            const locked = h.reqTech && !gameState.unlockedTechs.includes(h.reqTech);
            const owned = gameState.hardware.find(x => x.typeId === h.id)?.count || 0;
            const el = document.createElement('div');
            el.className = `glass-panel p-6 rounded-2xl transition-all ${locked ? 'opacity-50 bg-slate-900/20' : 'hover:border-cyan-500/50'}`;
            el.innerHTML = `<div class="text-white font-bold text-lg mb-1">${h.name}</div><div class="text-slate-500 text-xs mb-6 font-mono">${h.compute} TF / $${h.upkeep} wk</div><div class="text-4xl font-black text-white mb-6">${owned}</div><div class="flex gap-2"><button class="flex-1 border border-slate-600 text-white py-3 text-[10px] tracking-widest font-bold hover:bg-white hover:text-black rounded-xl uppercase transition-colors btn-buy" ${locked ? 'disabled' : ''}>BUY $${h.cost.toLocaleString()}</button>${owned > 0 ? `<button class="px-3 border border-red-900 text-red-500 hover:bg-red-900 rounded-xl btn-sell"><i data-lucide="minus"></i></button>` : ''}</div>`;

            if (!locked) {
                el.querySelector('.btn-buy').onclick = () => {
                    if (gameState.cash >= h.cost) {
                        gameState.cash -= h.cost;
                        const hw = gameState.hardware.find(x => x.typeId === h.id);
                        if (hw) hw.count++; else gameState.hardware.push({ typeId: h.id, count: 1 });
                        this.updateHUD(); this.renderTab('market'); showToast(`Purchased ${h.name}`, 'success');
                    } else showToast('Insufficient Funds', 'error');
                };
                if (owned > 0) el.querySelector('.btn-sell').onclick = () => {
                    const hw = gameState.hardware.find(x => x.typeId === h.id);
                    if (hw && hw.count > 0) { hw.count--; gameState.cash += Math.floor(h.cost * 0.5); this.updateHUD(); this.renderTab('market'); showToast(`Sold ${h.name}`, 'info'); }
                };
            }
            grid.appendChild(el);
        });
    },

    renderShop(container) {
        container.innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">CORPORATE ASSETS</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-grid"></div>`;
        const grid = document.getElementById('shop-grid');
        const availableItems = SHOP_ITEMS.filter(item => item.type.includes('consumable') || !(gameState.purchasedItems || []).includes(item.id));

        availableItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-2xl hover:border-cyan-500/50 transition-colors';
            el.innerHTML = `<h3 class="font-bold text-white text-lg mb-1">${item.name}</h3><div class="text-xs text-cyan-400 mb-4 font-mono">${item.effect}</div><button class="w-full border border-slate-700 text-white font-bold py-3 rounded-xl hover:bg-white hover:text-black">BUY $${item.cost.toLocaleString()}</button>`;
            el.querySelector('button').onclick = () => {
                if (gameState.cash >= item.cost) {
                    gameState.cash -= item.cost;
                    if (item.type === 'consumable_res') gameState.researchPts += item.amount;
                    else if (item.type === 'consumable_emp') { if (!gameState.employees) gameState.employees = { morale: 100 }; gameState.employees.morale = Math.min(100, gameState.employees.morale + item.amount); }
                    else { if (!gameState.purchasedItems) gameState.purchasedItems = []; gameState.purchasedItems.push(item.id); }
                    this.updateHUD(); saveGame(); this.renderTab('shop'); showToast(`${item.name} acquired!`, 'success');
                } else showToast('Insufficient Funds!', 'error');
            };
            grid.appendChild(el);
        });
    },

    renderReviews(container) {
        container.innerHTML = `<h2 class="text-3xl font-black text-white mb-6 tracking-tight">PUBLIC SENTIMENT</h2>${!gameState.reviews || gameState.reviews.length === 0 ? '<div class="text-slate-500 italic">No reviews yet.</div>' : '<div class="space-y-4" id="reviews-list"></div>'}`;
        const list = document.getElementById('reviews-list');
        if (list && gameState.reviews) gameState.reviews.forEach(r => {
            const el = document.createElement('div'); el.className = 'glass-panel p-4 rounded-xl flex gap-4';
            const color = r.rating >= 4 ? 'bg-green-500' : (r.rating <= 2 ? 'bg-red-500' : 'bg-yellow-500');
            el.innerHTML = `<div class="w-2 rounded-full ${color} shrink-0"></div><div><div class="flex items-center gap-2 mb-1"><span class="font-bold text-white text-sm">@${sanitizeHTML(r.user)}</span><span class="text-xs text-slate-500">on ${sanitizeHTML(r.product)}</span><div class="flex text-yellow-500 text-[10px]">${"★".repeat(Math.min(5, Math.max(0, r.rating)))}</div></div><p class="text-slate-300 text-sm">"${sanitizeHTML(r.text)}"</p></div>`;
            list.appendChild(el);
        });
    },

    renderBiz(container) {
        const empCount = (gameState.employees && gameState.employees.count) || 1;
        const morale = (gameState.employees && gameState.employees.morale) || 100;
        container.innerHTML = `
            <div class="grid grid-cols-1 gap-8">
                <div class="glass-panel p-6 rounded-2xl border-l-4 border-yellow-500">
                    <h3 class="text-xl font-bold text-white mb-4">HR DEPARTMENT</h3>
                    <div class="flex justify-between items-center gap-4">
                        <div class="bg-slate-900/50 p-4 rounded-xl flex-1 flex gap-4">
                            <div><div class="text-[10px] uppercase text-slate-500 font-bold">Headcount</div><div class="text-2xl font-black text-white">${empCount}</div></div>
                            <div class="h-8 w-px bg-white/10"></div>
                            <div><div class="text-[10px] uppercase text-slate-500 font-bold">Morale</div><div class="text-2xl font-black ${morale > 80 ? 'text-green-400' : 'text-red-500'}">${morale}%</div></div>
                        </div>
                        <div class="flex gap-2"><button id="btn-hire" class="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-green-400">HIRE</button><button id="btn-fire" class="border border-slate-700 text-red-500 font-bold px-6 py-2 rounded-lg hover:bg-red-900/20">FIRE</button></div>
                    </div>
                </div>
                <div><h3 class="text-xl font-bold text-white mb-4">B2B CONTRACTS</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="contract-grid"></div></div>
                <div><h3 class="text-xl font-bold text-white mt-8 mb-4">CAMPAIGNS</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="ads-grid"></div></div>
            </div>`;

        document.getElementById('btn-hire').onclick = () => { if (!gameState.employees) gameState.employees = { count: 1, morale: 100 }; gameState.employees.count++; gameState.cash -= 1000; this.updateHUD(); this.renderTab('biz'); };
        document.getElementById('btn-fire').onclick = () => { if (gameState.employees.count > 1) { gameState.employees.count--; gameState.employees.morale -= 10; this.updateHUD(); this.renderTab('biz'); } };

        const cGrid = document.getElementById('contract-grid');
        const liveProds = (gameState.products || []).filter(p => p.released && !p.isOpenSource);
        COMPANIES.forEach(c => {
            const el = document.createElement('div'); el.className = 'glass-panel p-5 rounded-xl';
            el.innerHTML = `<h3 class="font-bold text-white text-lg">${c.name}</h3><div class="text-xs text-green-400 font-mono mb-4">$${c.budget.toLocaleString()}/wk</div><div class="space-y-2" id="c-list-${c.name.replace(/\s/g, '')}">${liveProds.length === 0 ? '<div class="text-xs text-slate-600 italic">No models.</div>' : ''}</div>`;
            const list = el.querySelector(`[id^="c-list-"]`);
            liveProds.forEach(p => {
                const active = (p.contracts || []).includes(c.name);
                const btn = document.createElement('button');
                btn.className = `w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all border ${active ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-slate-700 text-slate-500'}`;
                btn.innerHTML = `<div class="flex justify-between items-center"><span>${sanitizeHTML(p.name)}</span>${active ? '✓' : ''}</div>`;
                btn.onclick = () => { if (!p.contracts) p.contracts = []; if (active) p.contracts = p.contracts.filter(x => x !== c.name); else p.contracts.push(c.name); this.renderTab('biz'); };
                list.appendChild(btn);
            });
            cGrid.appendChild(el);
        });

        const adsGrid = document.getElementById('ads-grid');
        CAMPAIGNS.forEach(ad => {
            const el = document.createElement('div'); el.className = 'glass-panel p-6 rounded-2xl';
            el.innerHTML = `<h3 class="font-bold text-white text-lg mb-1">${ad.name}</h3><div class="text-xs text-slate-400 mb-4 font-mono">$${ad.cost.toLocaleString()} | +${ad.hype} Hype</div><button class="w-full bg-slate-800 text-white font-bold py-2 rounded-lg text-xs hover:bg-purple-600">LAUNCH</button>`;
            el.querySelector('button').onclick = () => { if (gameState.cash >= ad.cost) { gameState.cash -= ad.cost; gameState.products.forEach(p => { if (p.released) p.hype = Math.min(500, p.hype + ad.hype); }); this.updateHUD(); showToast('Campaign Live!', 'success'); } else showToast('Insufficient Funds', 'error'); };
            adsGrid.appendChild(el);
        });
    },

    renderLab(container) {
        container.innerHTML = `<div class="flex items-center gap-6 mb-8"><h2 class="text-5xl font-black text-white tracking-tighter">R&D LAB</h2><div class="text-purple-400 font-mono font-bold bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-500/30">${Math.floor(gameState.researchPts)} PTS</div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="research-grid"></div>`;
        const grid = document.getElementById('research-grid');
        RESEARCH.forEach(r => {
            const unlocked = gameState.unlockedTechs.includes(r.id);
            const el = document.createElement('div');
            el.className = `glass-panel p-8 rounded-2xl transition-all ${unlocked ? 'border-purple-500 bg-purple-900/10' : 'hover:border-purple-500/50'}`;
            el.innerHTML = `<h3 class="font-bold text-white mb-2 text-xl">${r.name}</h3><p class="text-xs text-slate-500 mb-6">${r.desc}</p>${!unlocked ? `<button class="w-full bg-slate-800 hover:bg-purple-600 text-white font-bold py-3 rounded-xl text-xs tracking-widest">UNLOCK (${r.cost} PTS)</button>` : '<span class="text-purple-500 font-bold text-xs tracking-widest bg-purple-900/30 px-3 py-1 rounded">ACQUIRED</span>'}`;
            if (!unlocked) el.querySelector('button').onclick = () => { if (gameState.researchPts >= r.cost) { gameState.researchPts -= r.cost; gameState.unlockedTechs.push(r.id); this.updateHUD(); this.renderTab('lab'); showToast('Researched!', 'success'); } else showToast('Need Points', 'error'); };
            grid.appendChild(el);
        });
    },

    renderGodModeList() {
        let container = document.getElementById('godmode-list-container');
        if (!container) {
            const wrapper = document.querySelector('#godmode-control-wrapper > div');
            if (wrapper) {
                container = document.createElement('div'); container.id = 'godmode-list-container'; container.className = "mt-4 space-y-2 max-h-60 overflow-y-auto border-t border-white/10 pt-4";
                wrapper.appendChild(container);
            }
        }
        if (container && gameState.products) {
            container.innerHTML = `<h4 class="text-xs font-bold text-slate-500 uppercase">Registry Manager</h4>`;
            gameState.products.forEach(p => {
                const row = document.createElement('div'); row.className = "flex justify-between items-center text-xs bg-slate-900/50 p-2 rounded";
                row.innerHTML = `<span class="text-white">${sanitizeHTML(p.name)} <span class="text-slate-500">(${p.weeksLeft}w)</span></span><button class="text-red-500 hover:text-white font-bold">DEL</button>`;
                row.querySelector('button').onclick = () => { if (confirm('Delete?')) { gameState.products = gameState.products.filter(x => x.id !== p.id); State.saveGame(); this.updateHUD(); this.renderTab('dash'); } };
                container.appendChild(row);
            });
        }
    }
};

// Alias
const updateHUD = UI.updateHUD.bind(UI);
const renderTab = UI.renderTab.bind(UI);
