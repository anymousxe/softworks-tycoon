// --- STATE ---
let gameState = {
    name: "Unknown",
    cash: 0,
    fame: 0,
    week: 1,
    skills: { acting: 10, speech: 10, looks: 10 },
    studioName: null,
    roster: [], // Actors owned
    projects: [], // Movies/Shows made
    history: [] // Jobs done
};

let isSandbox = false;

// --- INITIALIZATION ---
document.getElementById('sandbox-toggle').onclick = () => {
    isSandbox = !isSandbox;
    const btn = document.getElementById('sandbox-toggle');
    if(isSandbox) {
        btn.classList.replace('text-slate-500', 'text-yellow-400');
        btn.innerHTML = `<div class="p-2 bg-yellow-500/20 rounded-lg"><i data-lucide="infinity" class="w-4 h-4 text-yellow-400"></i></div><span class="text-xs font-bold uppercase tracking-wider text-yellow-400">Sandbox Active</span>`;
    } else {
        btn.classList.replace('text-yellow-400', 'text-slate-500');
        btn.innerHTML = `<div class="p-2 bg-white/5 rounded-lg"><i data-lucide="infinity" class="w-4 h-4"></i></div><span class="text-xs font-bold uppercase tracking-wider">Sandbox Mode</span>`;
    }
    lucide.createIcons();
};

document.getElementById('btn-start').onclick = () => {
    const name = document.getElementById('inp-actor-name').value;
    if(!name) return alert("Enter a stage name!");
    
    gameState.name = name;
    gameState.cash = isSandbox ? 1000000000 : 500;
    if(isSandbox) gameState.skills = { acting: 100, speech: 100, looks: 100 };
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Initial World Gen
    for(let i=0; i<15; i++) gameState.roster.push(generateRandomActor(true)); // Add some free agents to world (not owned yet)
    
    updateHUD();
    renderTab('career');
    lucide.createIcons();
};

// --- CORE LOOP ---
function updateHUD() {
    document.getElementById('hud-name').textContent = gameState.name;
    document.getElementById('hud-cash').textContent = `$${gameState.cash.toLocaleString()}`;
    document.getElementById('hud-fame').textContent = gameState.fame.toLocaleString();
    document.getElementById('hud-week').textContent = `Week ${gameState.week}`;
}

document.getElementById('btn-next-week').onclick = () => {
    const btn = document.getElementById('btn-next-week');
    btn.disabled = true;
    btn.innerHTML = "Processing...";
    
    setTimeout(() => {
        gameState.week++;
        
        // Studio Wages
        if(gameState.studioName) {
            // Only pay actors in your roster who are NOT 'Free Agent'
            const ownedActors = gameState.roster.filter(a => a.status !== 'Free Agent');
            const wages = ownedActors.length * 500;
            gameState.cash -= wages;
        }

        // Random Events
        if(Math.random() > 0.8) {
            // New Talent appears
            // In a real DB we'd push to a global pool, here we just simulate it
        }
        
        updateHUD();
        renderTab(document.querySelector('.nav-btn.active').dataset.tab);
        
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-current"></i> NEXT`;
        lucide.createIcons();
    }, 200);
};

// --- TABS & RENDERING ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => {
        if(btn.hasAttribute('href')) return; // Allow exit link
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
        content.innerHTML = `
            <div class="mb-8">
                <h2 class="text-5xl font-bebas text-white mb-2">OPEN AUDITIONS</h2>
                <p class="text-slate-400 font-mono text-xs uppercase tracking-widest">Find work. Build Fame.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="job-list"></div>
        `;
        const list = document.getElementById('job-list');
        
        JOBS.forEach(job => {
            const canDo = gameState.skills.acting >= job.req;
            const div = document.createElement('div');
            div.className = `p-6 border rounded-xl transition-all flex flex-col justify-between h-full ${canDo ? 'border-white/10 bg-[#111] hover:border-yellow-500 hover:-translate-y-1' : 'border-red-900/20 bg-red-900/5 opacity-60'}`;
            div.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-xl text-white leading-tight">${job.title}</h3>
                        <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded uppercase font-bold">${job.type}</span>
                    </div>
                    <p class="text-xs text-slate-400 mb-6 italic">"${job.desc}"</p>
                </div>
                <div>
                    <div class="flex justify-between text-sm font-mono mb-4 border-t border-white/5 pt-4">
                        <span class="text-green-400 font-bold">$${job.pay.toLocaleString()}</span>
                        <span class="text-yellow-400 font-bold">+${job.fame} Fame</span>
                    </div>
                    <div class="text-[10px] text-slate-500 mb-3 uppercase font-bold tracking-wider">Req: Acting ${job.req}</div>
                    <button class="w-full py-4 rounded-lg font-black tracking-widest text-sm transition-colors ${canDo ? 'bg-white text-black hover:bg-yellow-400' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}">
                        ${canDo ? 'AUDITION' : 'LACK SKILL'}
                    </button>
                </div>
            `;
            if(canDo) {
                div.querySelector('button').onclick = () => {
                    if(Math.random() > 0.2) { // 80% chance success
                        gameState.cash += job.pay;
                        gameState.fame += job.fame;
                        gameState.history.push(job.title);
                        alert(`You got the part of "${job.title}"! Earned $${job.pay.toLocaleString()}`);
                    } else {
                        alert("Rejected! The director said you didn't have the 'look'.");
                    }
                    updateHUD();
                };
            }
            list.appendChild(div);
        });
    }

    if(tab === 'skills') {
        content.innerHTML = `
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h2 class="text-5xl font-bebas text-white mb-2">ACTING SCHOOL</h2>
                    <p class="text-slate-400 font-mono text-xs uppercase tracking-widest">Invest in yourself.</p>
                </div>
                <div class="flex gap-4">
                    <div class="text-center"><div class="text-3xl font-black text-blue-400">${gameState.skills.acting}</div><div class="text-[10px] text-slate-500 uppercase font-bold">Acting</div></div>
                    <div class="text-center"><div class="text-3xl font-black text-green-400">${gameState.skills.speech}</div><div class="text-[10px] text-slate-500 uppercase font-bold">Speech</div></div>
                    <div class="text-center"><div class="text-3xl font-black text-pink-400">${gameState.skills.looks}</div><div class="text-[10px] text-slate-500 uppercase font-bold">Looks</div></div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-4" id="skill-list"></div>
        `;
        const list = document.getElementById('skill-list');
        
        SKILLS_SHOP.forEach(skill => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center p-6 bg-[#111] border border-white/10 rounded-xl hover:border-white/30 transition-colors";
            div.innerHTML = `
                <div class="flex items-center gap-6">
                    <div class="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><i data-lucide="book-open"></i></div>
                    <div>
                        <h3 class="font-bold text-lg text-white">${skill.name}</h3>
                        <p class="text-slate-400 text-xs">${skill.desc}</p>
                        <div class="text-yellow-500 text-[10px] font-bold mt-1 bg-yellow-500/10 inline-block px-2 py-0.5 rounded uppercase">+${skill.boost} ${skill.type}</div>
                    </div>
                </div>
                <button class="bg-white hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold text-sm transition-colors uppercase tracking-wider">
                    Buy $${skill.cost.toLocaleString()}
                </button>
            `;
            div.querySelector('button').onclick = () => {
                if(gameState.cash >= skill.cost) {
                    gameState.cash -= skill.cost;
                    gameState.skills[skill.type] += skill.boost;
                    alert(`Completed ${skill.name}! ${skill.type} increased.`);
                    updateHUD();
                    renderTab('skills');
                } else {
                    alert("Not enough cash!");
                }
            };
            list.appendChild(div);
        });
    }

    if(tab === 'studio') {
        if(!gameState.studioName) {
            content.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center">
                    <div class="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_50px_rgba(234,179,8,0.4)]">
                        <i data-lucide="video" class="w-12 h-12"></i>
                    </div>
                    <h2 class="text-6xl font-bebas text-white mb-4">START YOUR OWN STUDIO</h2>
                    <p class="text-slate-400 mb-8 max-w-md text-sm leading-relaxed">Become a mogul. Cast actors from the roster, write scripts, produce hit shows, and kill off characters for ratings.</p>
                    <input id="studio-name-input" class="bg-[#1a1a1a] text-white p-5 rounded-xl mb-4 w-80 text-center outline-none border border-white/10 focus:border-yellow-500 font-bold text-lg" placeholder="Enter Studio Name">
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
                } else {
                    alert("Need $50,000 and a name!");
                }
            };
            lucide.createIcons();
            return;
        }

        content.innerHTML = `
            <div class="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                    <h2 class="text-6xl font-bebas text-white leading-none">${gameState.studioName.toUpperCase()}</h2>
                    <p class="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">Production Dashboard</p>
                </div>
                <button class="text-[10px] border border-slate-700 text-slate-400 px-4 py-2 rounded hover:text-white transition-colors" id="btn-rebrand">REBRAND STUDIO</button>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="bg-[#111] p-8 rounded-2xl border border-white/10 h-fit">
                    <h3 class="font-black text-xl mb-6 text-white flex items-center gap-2"><i data-lucide="plus-circle" class="w-5 h-5 text-green-400"></i> GREENLIGHT PROJECT</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="text-[10px] uppercase font-bold text-slate-500">Project Title</label>
                            <input id="proj-title" class="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white mt-1 outline-none focus:border-yellow-500 font-bold" placeholder="e.g. Breaking Bad 2">
                        </div>
                        <div>
                            <label class="text-[10px] uppercase font-bold text-slate-500">Format</label>
                            <select id="proj-type" class="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white mt-1 outline-none">
                                <option value="movie">Feature Film (One-off)</option>
                                <option value="show">TV Series (Episodic)</option>
                            </select>
                        </div>
                        <div>
                             <label class="text-[10px] uppercase font-bold text-slate-500">Genre</label>
                             <select id="proj-genre" class="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white mt-1 outline-none">
                                ${GENRES.map(g => `<option value="${g}">${g}</option>`).join('')}
                             </select>
                        </div>
                        
                        <button id="btn-start-proj" class="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-green-400 transition-colors tracking-widest mt-2">START PRODUCTION</button>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <h3 class="font-black text-xl mb-6 text-white flex items-center gap-2"><i data-lucide="film" class="w-5 h-5 text-yellow-400"></i> CURRENT SLATE</h3>
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
            if(!title) return alert("Enter a title!");
            
            // Check for actors in roster
            const myActors = gameState.roster.filter(a => a.status !== 'Free Agent');
            
            if(myActors.length === 0) {
                return alert("You have no actors! Go to 'Casting Roster' and scout some talent first.");
            }
            
            // Pick up to 3 random actors from roster
            const castSize = Math.min(3, myActors.length);
            const shuffled = myActors.sort(() => 0.5 - Math.random());
            const cast = shuffled.slice(0, castSize);
            
            gameState.projects.unshift({
                id: Date.now(),
                title, type, genre,
                status: 'In Production',
                episodes: [],
                cast: cast,
                revenue: 0
            });
            renderTab('studio');
        };

        const list = document.getElementById('projects-list');
        if(gameState.projects.length === 0) list.innerHTML = `<div class="text-slate-600 text-center py-10 italic">No active projects. Greenlight something!</div>`;
        
        gameState.projects.forEach(p => {
            const el = document.createElement('div');
            el.className = "bg-[#161616] p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all";
            let actionBtn = '';
            
            if(p.type === 'show') {
                actionBtn = `<button class="bg-yellow-500 text-black text-xs font-black px-4 py-2 rounded hover:bg-yellow-400 btn-manage-ep tracking-widest">WRITER'S ROOM</button>`;
            } else {
                actionBtn = `<button class="bg-green-500 text-black text-xs font-black px-4 py-2 rounded hover:bg-green-400 btn-release tracking-widest">RELEASE ($)</button>`;
            }

            // Calculate Cast Power
            const castPower = p.cast.reduce((acc, c) => acc + (c.status === 'Dead' ? 0 : c.skill), 0);

            el.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <div class="flex items-center gap-3">
                            <h3 class="font-bold text-xl text-white">${p.title}</h3>
                            <span class="text-[10px] text-black bg-white px-2 py-0.5 rounded font-bold uppercase">${p.genre} ${p.type}</span>
                        </div>
                        <div class="text-xs text-slate-500 mt-1">Gross Rev: <span class="text-green-400 font-mono">$${p.revenue.toLocaleString()}</span></div>
                    </div>
                    ${actionBtn}
                </div>
                
                <div class="bg-black/40 p-3 rounded-lg border border-white/5">
                    <div class="text-[10px] text-slate-500 uppercase font-bold mb-2">Cast & Characters</div>
                    <div class="flex flex-wrap gap-2">
                        ${p.cast.map(c => `
                            <div class="flex items-center gap-2 bg-[#222] px-3 py-1 rounded-full border border-white/5">
                                <i data-lucide="user" class="w-3 h-3 text-slate-400"></i>
                                <span class="text-xs font-bold ${c.status === 'Dead' ? 'text-red-500 line-through' : 'text-slate-200'}">${c.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${p.type === 'show' ? `
                    <div class="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <div class="text-xs text-slate-400 font-mono"><span class="text-white font-bold">${p.episodes.length}</span> Episodes Aired</div>
                        <div class="text-[10px] text-slate-500 uppercase tracking-widest">Season 1</div>
                    </div>
                ` : ''}
            `;
            
            if(p.type === 'show') {
                el.querySelector('.btn-manage-ep').onclick = () => openEpisodeModal(p);
            } else {
                 el.querySelector('.btn-release').onclick = () => {
                     const boxOffice = Math.floor(castPower * 2000 * (Math.random() + 0.5));
                     gameState.cash += boxOffice;
                     gameState.fame += Math.floor(boxOffice / 1000);
                     p.revenue += boxOffice;
                     p.status = "Released";
                     alert(`Box Office Result: $${boxOffice.toLocaleString()}`);
                     updateHUD();
                     renderTab('studio'); // Re-render to update rev
                 };
            }
            list.appendChild(el);
        });
    }

    if(tab === 'roster') {
        content.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-5xl font-bebas text-white mb-2">TALENT ROSTER</h2>
                    <p class="text-slate-400 font-mono text-xs uppercase tracking-widest">Manage your stars. Fire the weak.</p>
                </div>
                <button id="btn-scout" class="bg-white text-black font-black px-6 py-3 rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                    <i data-lucide="search" class="w-4 h-4"></i> SCOUT ACTOR ($1k)
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="roster-list"></div>
        `;
        
        const list = document.getElementById('roster-list');
        // Show Owned + Free Agents in a nice list
        // Actually, let's filter to show OWNED first, then a section for "Available to Hire" if we want, 
        // but for now let's just show owned and have the scout button add new ones.
        
        if(gameState.roster.length === 0) list.innerHTML = `<div class="col-span-3 text-center text-slate-600 italic py-10">No actors found. Scout some talent!</div>`;

        gameState.roster.forEach((actor, idx) => {
            const isOwned = actor.status !== 'Free Agent';
            const div = document.createElement('div');
            div.className = `p-5 rounded-xl flex justify-between items-center border transition-all ${isOwned ? 'bg-[#111] border-white/10' : 'bg-[#111] border-dashed border-slate-700 opacity-70'}`;
            
            div.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isOwned ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-500'}">
                        ${actor.name[0]}
                    </div>
                    <div>
                        <div class="font-bold text-lg text-white">${actor.name}</div>
                        <div class="text-xs text-slate-400 font-mono">Acting: <span class="text-yellow-500">${actor.skill}</span></div>
                    </div>
                </div>
                ${isOwned 
                    ? `<button class="text-red-500 hover:bg-red-900/20 px-3 py-2 rounded transition-colors btn-fire"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`
                    : `<button class="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded hover:bg-green-500 btn-hire">HIRE</button>`
                }
            `;
            
            if(isOwned) {
                div.querySelector('.btn-fire').onclick = () => {
                    if(confirm(`Fire ${actor.name}?`)) {
                        gameState.roster.splice(idx, 1);
                        renderTab('roster');
                    }
                };
            } else {
                 // Logic for free agents if we implemented a market list
            }
            list.appendChild(div);
        });

        document.getElementById('btn-scout').onclick = () => {
            if(gameState.cash >= 1000) {
                gameState.cash -= 1000;
                const newActor = generateRandomActor(); // Returns object with status 'Active' (owned)
                gameState.roster.push(newActor);
                renderTab('roster');
                updateHUD();
                // Scroll to bottom
                setTimeout(() => list.lastElementChild.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
                alert("Not enough cash!");
            }
        };
    }
    
    lucide.createIcons();
}

// --- UTILS ---
function generateRandomActor(isFreeAgent = false) {
    const isMale = Math.random() > 0.5;
    const first = isMale ? FIRST_NAMES_M[Math.floor(Math.random()*FIRST_NAMES_M.length)] : FIRST_NAMES_F[Math.floor(Math.random()*FIRST_NAMES_F.length)];
    const last = LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)];
    return {
        name: `${first} ${last}`,
        skill: Math.floor(Math.random() * 60) + 10, // 10-70 skill
        status: isFreeAgent ? 'Free Agent' : 'Active'
    };
}

// --- EPISODE MODAL LOGIC ---
const epModal = document.getElementById('episode-modal');
let currentShow = null;

function openEpisodeModal(show) {
    currentShow = show;
    document.getElementById('ep-title').value = '';
    document.getElementById('ep-plot').value = '';
    
    // Render Cast List with Kill Options
    const castList = document.getElementById('episode-cast-list');
    castList.innerHTML = '';
    
    show.cast.forEach((actor, idx) => {
        const row = document.createElement('div');
        row.className = `flex justify-between items-center p-3 rounded-lg border mb-2 ${actor.status === 'Dead' ? 'bg-red-900/10 border-red-900/30' : 'bg-[#222] border-white/5'}`;
        
        row.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-lucide="${actor.status === 'Dead' ? 'skull' : 'user'}" class="w-4 h-4 ${actor.status === 'Dead' ? 'text-red-500' : 'text-slate-400'}"></i>
                <span class="${actor.status === 'Dead' ? 'text-red-500 line-through' : 'text-white font-bold'}">${actor.name}</span>
            </div>
            ${actor.status !== 'Dead' ? `<button class="text-[10px] bg-red-900/30 text-red-400 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white transition-colors font-bold btn-kill">KILL CHAR</button>` : '<span class="text-[10px] text-red-500 font-mono font-bold">DECEASED</span>'}
        `;
        
        if(actor.status !== 'Dead') {
            row.querySelector('.btn-kill').onclick = () => {
                if(confirm(`Write a death scene for ${actor.name}? They will be permanently removed from the roster after this episode.`)) {
                    actor.status = 'Dead'; // Mark dead in show context
                    // Optionally mark dead in global roster too or remove them
                    // Let's keep them in roster but marked as Dead
                    const rosterActor = gameState.roster.find(a => a.name === actor.name);
                    if(rosterActor) rosterActor.status = 'Dead';
                    
                    openEpisodeModal(show); // Re-render
                }
            };
        }
        castList.appendChild(row);
    });
    
    lucide.createIcons();
    epModal.classList.remove('hidden');
}

document.getElementById('close-episode-modal').onclick = () => epModal.classList.add('hidden');

document.getElementById('btn-publish-episode').onclick = () => {
    const title = document.getElementById('ep-title').value;
    const plot = document.getElementById('ep-plot').value;
    
    if(title && plot) {
        // Calculate Rating based on Writing skill (random for now) + Cast Skill
        const activeCast = currentShow.cast.filter(c => c.status !== 'Dead');
        const avgSkill = activeCast.length > 0 ? activeCast.reduce((a,b)=>a+b.skill,0) / activeCast.length : 0;
        
        const earnings = Math.floor((avgSkill * 2000) + 20000 + (Math.random() * 10000));
        
        currentShow.episodes.push({ title, plot, earnings });
        currentShow.revenue += earnings;
        
        gameState.cash += earnings;
        gameState.fame += Math.floor(earnings / 200);
        
        epModal.classList.add('hidden');
        renderTab('studio');
        updateHUD();
        
        // Toast Effect
        const toast = document.createElement('div');
        toast.className = "fixed bottom-10 right-10 bg-green-500 text-black px-6 py-4 rounded-xl font-bold shadow-2xl animate-bounce z-[200]";
        toast.innerText = `📺 Episode Aired! Earned $${earnings.toLocaleString()}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        
    } else {
        alert("Script incomplete! Write a title and plot.");
    }
};

lucide.createIcons();
