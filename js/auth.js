// --- FIREBASE AUTH & SESSION MANAGEMENT ---

function initAuth() {
    auth.onAuthStateChanged(user => {
        currentUser = user;
        if (user) {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('menu-screen').classList.remove('hidden');

            const name = user.displayName || (user.isAnonymous ? 'Guest Agent' : 'User');
            const photo = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
            document.getElementById('user-name').textContent = name;
            document.getElementById('user-email').textContent = user.email || 'ID: ' + user.uid.slice(0, 8);
            document.getElementById('user-photo').src = photo;

            checkAdminAccess();
            loadSaves();
        } else {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('menu-screen').classList.add('hidden');
        }
    });

    document.getElementById('btn-login-google').onclick = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    document.getElementById('btn-login-guest').onclick = () => {
        auth.signInAnonymously();
    };

    document.getElementById('btn-logout').onclick = () => {
        auth.signOut();
        location.reload();
    };
}

function loadSaves() {
    if (!currentUser) return;
    const savesRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves');

    savesRef.onSnapshot(snapshot => {
        const container = document.getElementById('save-slots');
        if (!container) return;

        container.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.className = 'glass-panel p-8 rounded-2xl cursor-pointer hover:border-cyan-500 transition-all group relative hover:-translate-y-1';
            el.innerHTML = `
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">${sanitizeHTML(data.companyName)}</h3>
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
            el.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) startGame(doc.id, data);
            });
            el.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete save?')) savesRef.doc(doc.id).delete();
            });
            container.appendChild(el);
        });

        if (window.lucide) lucide.createIcons();

        if (snapshot.size < 6) {
            const btn = document.createElement('button');
            btn.className = 'border-2 border-dashed border-slate-800 text-slate-600 p-8 rounded-2xl hover:text-cyan-400 hover:border-cyan-500 hover:bg-slate-900/50 transition flex flex-col items-center justify-center gap-3 min-h-[200px] group';
            btn.innerHTML = `<i data-lucide="plus" class="w-10 h-10 group-hover:scale-110 transition-transform"></i><span class="font-bold tracking-widest">NEW SAVE</span>`;
            btn.onclick = () => document.getElementById('create-screen').classList.remove('hidden');
            container.appendChild(btn);
            if (window.lucide) lucide.createIcons();
        }
    });
}

function startGame(id, data) {
    activeSaveId = id;
    const result = cleanAndRepairData(data);
    gameState = result.data;

    if (result.modified || result.corrupted) {
        showToast("⚠️ FILE REPAIRED - SYNCING...", "error");
        db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').doc(activeSaveId).set(gameState)
            .catch(e => console.error("Sync failed", e));
    }

    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    setupRealtimeListener(id);
    updateHUD();
    renderTab('dash');

    if (gameState.tutorialStep === undefined) gameState.tutorialStep = 0;
    setTimeout(() => runTutorial(gameState.tutorialStep), 1000);

    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 5000);
}

function setupRealtimeListener(id) {
    if (realtimeUnsubscribe) realtimeUnsubscribe();
    realtimeUnsubscribe = db.collection('artifacts').doc(APP_ID).collection('users').doc(currentUser.uid).collection('saves').doc(id)
        .onSnapshot(doc => {
            const data = doc.data();
            if (data && JSON.stringify(data) !== JSON.stringify(gameState)) {
                gameState = data;
                updateHUD();
                const currentTab = document.querySelector('.nav-btn.active')?.dataset.tab || 'dash';
                renderTab(currentTab);
            }
        });
}

function checkAdminAccess() {
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
        document.getElementById('godmode-control-wrapper').classList.remove('hidden');
    } else {
        document.getElementById('godmode-control-wrapper').classList.add('hidden');
    }
}
