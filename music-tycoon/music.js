// --- MUSIC SIMULATOR LOGIC ---

function initMusicSim() {
    // Ensure Music Data exists in GameState
    if (!gameState.music) {
        gameState.music = {
            artistName: "Lil Algo",
            fame: 0,
            listeners: 0,
            flow: 100,
            label: 'indie',
            discography: []
        };
    }
    
    updateMusicHUD();
    renderMusicTab('studio');
}

// Navigation
document.querySelectorAll('.music-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.music-nav-btn').forEach(b => b.classList.remove('active', 'bg-white/10', 'text-white'));
        btn.classList.add('active', 'bg-white/10', 'text-white');
        renderMusicTab(btn.dataset.tab);
    });
});

function renderMusicTab(tab) {
    const container = document.getElementById('music-content');
    container.innerHTML = '';
    container.className = 'animate-in';

    if (tab === 'studio') {
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-[#181818] p-8 rounded-xl border border-[#282828]">
                    <h2 class="text-3xl font-black text-white mb-6 tracking-tight">CREATE NEW TRACK</h2>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Track Title</label>
                            <div class="flex gap-2 mt-2">
                                <input id="song-input" type="text" class="flex-1 bg-[#282828] border border-transparent focus:border-green-500 text-white px-4 py-3 rounded-lg font-bold outline-none transition-colors" placeholder="Enter title...">
                                <button id="btn-gen-song-name" class="bg-[#282828] text-white p-3 rounded-lg hover:bg-[#383838]"><i data-lucide="dices"></i></button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between bg-[#282828] p-4 rounded-lg">
                            <span class="text-white font-bold text-sm">Explicit Content</span>
                            <button id="btn-explicit" class="text-[10px] font-bold px-3 py-1 rounded border border-slate-600 text-slate-500 transition-all">CLEAN</button>
                        </div>

                        <div>
                            <label class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Cover Art</label>
                            <div class="grid grid-cols-4 gap-2 mt-2" id="cover-grid"></div>
                        </div>

                        <button id="btn-drop-song" class="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-full text-lg transition-transform hover:scale-[1.02] shadow-xl shadow-green-900/20">
                            DROP RELEASE ($1,000)
                        </button>
                        <div class="text-center text-[10px] text-slate-500">Requires 20 Creative Flow</div>
                    </div>
                </div>

                <div class="bg-gradient-to-b from-[#202020] to-[#121212] p-8 rounded-xl border border-[#282828] flex flex-col items-center justify-center text-center">
                    <div id="preview-cover" class="w-48 h-48 bg-[#282828] rounded-lg shadow-2xl mb-6 flex items-center justify-center text-slate-600">
                        <i data-lucide="music" class="w-12 h-12"></i>
                    </div>
                    <h3 id="preview-title" class="text-2xl font-bold text-white mb-1">Untitled Track</h3>
                    <p class="text-sm text-slate-400 mb-6">${gameState.music.artistName}</p>
                    <div class="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div class="h-full bg-slate-500 w-1/3"></div>
                    </div>
                    <div class="flex justify-between w-full text-[10px] text-slate-500 mt-2 font-mono">
                        <span>0:00</span>
                        <span>2:45</span>
                    </div>
                </div>
            </div>
        `;

        // Cover Art Grid
        const coverGrid = document.getElementById('cover-grid');
        let selectedCover = ALBUM_ART_STYLES[0];
        const previewCover = document.getElementById('preview-cover');
        
        ALBUM_ART_STYLES.forEach(style => {
            const el = document.createElement('div');
            el.className = `h-12 rounded cursor-pointer transition-all border-2 ${style.class} ${selectedCover.id === style.id ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`;
            el.onclick = () => {
                selectedCover = style;
                previewCover.className = `w-48 h-48 rounded-lg shadow-2xl mb-6 flex items-center justify-center text-white/50 text-4xl font-black ${style.class}`;
                previewCover.innerHTML = ''; // Remove icon
                renderMusicTab('studio'); // Re-render to update grid selection visuals (lazy way)
            };
            coverGrid.appendChild(el);
        });

        // Logic
        let isExplicit = false;
        document.getElementById('btn-explicit').onclick = (e) => {
            isExplicit = !isExplicit;
            e.target.textContent = isExplicit ? "EXPLICIT" : "CLEAN";
            e.target.className = isExplicit ? "text-[10px] font-bold px-3 py-1 rounded bg-red-500/20 text-red-500 border border-red-500" : "text-[10px] font-bold px-3 py-1 rounded border border-slate-600 text-slate-500";
        };

        document.getElementById('btn-gen-song-name').onclick = () => {
            const adj = SONG_ADJECTIVES[Math.floor(Math.random() * SONG_ADJECTIVES.length)];
            const noun = SONG_NOUNS[Math.floor(Math.random() * SONG_NOUNS.length)];
            const title = `${adj} ${noun}`;
            document.getElementById('song-input').value = title;
            document.getElementById('preview-title').textContent = title;
        };

        document.getElementById('btn-drop-song').onclick = () => {
            const title = document.getElementById('song-input').value;
            if (!title) return showToast("Enter a song title!", "error");
            if (gameState.cash < 1000) return showToast("Not enough cash ($1000)!", "error");
            if (gameState.music.flow < 20) return showToast("Not enough Creative Flow!", "error");

            gameState.cash -= 1000;
            gameState.music.flow -= 20;
            
            // Quality Calculation
            const baseQ = Math.floor(Math.random() * 40) + 40; // 40-80 base
            const quality = Math.min(100, baseQ + (gameState.music.fame / 20)); // Fame boosts quality cap
            
            const newSong = {
                id: Date.now().toString(),
                title: title,
                explicit: isExplicit,
                cover: selectedCover,
                quality: quality,
                streams: 0,
                weekReleased: gameState.week,
                yearReleased: gameState.year
            };

            gameState.music.discography.unshift(newSong);
            showToast(`Dropped "${title}"!`, "success");
            updateHUD(); // Sync cash
            renderMusicTab('catalog');
        };
    }

    if (tab === 'catalog') {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-black text-white tracking-tight">YOUR CATALOG</h2>
                <div class="text-xs text-slate-400 font-mono">${gameState.music.discography.length} RELEASES</div>
            </div>
            <div class="grid grid-cols-1 gap-3" id="catalog-list"></div>
        `;

        const list = document.getElementById('catalog-list');
        if (gameState.music.discography.length === 0) {
            list.innerHTML = `<div class="p-8 text-center text-slate-600 italic">No songs released yet. Head to the studio.</div>`;
        } else {
            gameState.music.discography.forEach(song => {
                const el = document.createElement('div');
                el.className = "group flex items-center gap-4 bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-colors border border-transparent hover:border-white/5";
                el.innerHTML = `
                    <div class="w-12 h-12 rounded shadow-lg ${song.cover.class}"></div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-white text-lg">${song.title}</span>
                            ${song.explicit ? '<span class="border border-slate-500 text-[8px] text-slate-400 px-1 rounded flex items-center h-4">E</span>' : ''}
                        </div>
                        <div class="text-xs text-slate-500 font-mono">
                            Q: ${song.quality} • Released W${song.weekReleased}/${song.yearReleased}
                        </div>
                    </div>
                    <div class="text-right mr-4">
                        <div class="text-[10px] uppercase text-slate-500 font-bold">Streams</div>
                        <div class="text-white font-mono">${song.streams.toLocaleString()}</div>
                    </div>
                    <button class="p-2 text-slate-600 hover:text-red-500 transition-colors btn-delete-song"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                `;
                
                el.querySelector('.btn-delete-song').onclick = () => {
                    if(confirm(`Delete "${song.title}" from streaming services? This cannot be undone.`)) {
                        gameState.music.discography = gameState.music.discography.filter(s => s.id !== song.id);
                        renderMusicTab('catalog');
                        showToast("Song removed from services.", "info");
                    }
                };
                list.appendChild(el);
            });
        }
    }

    if (tab === 'labels') {
        container.innerHTML = `
            <div class="mb-8">
                <h2 class="text-3xl font-black text-white tracking-tight mb-2">RECORD DEALS</h2>
                <p class="text-slate-400 text-sm">Sign with a label to boost your reach. They take a cut of your royalties.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="label-grid"></div>
        `;
        
        const grid = document.getElementById('label-grid');
        LABELS_DB.forEach(label => {
            const isSigned = gameState.music.label === label.id;
            const el = document.createElement('div');
            el.className = `relative p-6 rounded-xl border transition-all ${isSigned ? 'bg-green-900/10 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-[#181818] border-[#282828] hover:border-white/20'}`;
            
            el.innerHTML = `
                ${isSigned ? '<div class="absolute -top-3 -right-3 bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full tracking-widest">SIGNED</div>' : ''}
                <h3 class="text-xl font-bold text-white ${label.color} mb-2">${label.name}</h3>
                <p class="text-xs text-slate-400 mb-6 leading-relaxed h-10">${label.desc}</p>
                
                <div class="grid grid-cols-2 gap-4 mb-6 text-sm font-mono">
                    <div class="bg-black/30 p-2 rounded">
                        <div class="text-[10px] text-slate-500">Split</div>
                        <div class="text-white font-bold">${label.cut * 100}%</div>
                    </div>
                    <div class="bg-black/30 p-2 rounded">
                        <div class="text-[10px] text-slate-500">Boost</div>
                        <div class="text-green-400 font-bold">${label.bonus}x</div>
                    </div>
                </div>

                ${isSigned 
                    ? `<button class="w-full border border-slate-600 text-slate-400 py-3 rounded-lg text-xs font-bold hover:bg-red-900/20 hover:text-red-500 hover:border-red-900 transition-colors btn-leave">LEAVE LABEL</button>` 
                    : `<button class="w-full bg-white text-black py-3 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors btn-sign">SIGN DEAL</button>`
                }
            `;

            if (isSigned) {
                el.querySelector('.btn-leave').onclick = () => {
                    if(confirm("Leave label? You will revert to Indie (0% cut, 1.0x boost).")) {
                        gameState.music.label = 'indie';
                        updateHUD();
                        renderMusicTab('labels');
                        showToast("You are now independent.");
                    }
                };
            } else {
                el.querySelector('.btn-sign').onclick = () => {
                    gameState.music.label = label.id;
                    updateHUD();
                    renderMusicTab('labels');
                    showToast(`Signed to ${label.name}!`, 'success');
                };
            }

            grid.appendChild(el);
        });
    }
    
    lucide.createIcons();
}

function updateMusicHUD() {
    if(!gameState.music) return;
    document.getElementById('hud-music-artist').textContent = gameState.music.artistName;
    document.getElementById('hud-music-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('hud-music-listeners').textContent = gameState.music.listeners.toLocaleString();
    document.getElementById('hud-music-flow').textContent = gameState.music.flow;
}
