import React, { useState, useEffect } from 'react';
import { 
  Play, Plus, Save, Trash2, TrendingUp, Users, 
  Cpu, MessageSquare, DollarSign, Calendar, 
  Settings, Zap, Terminal, X,
  ShoppingBag, Award, BarChart, Server, 
  HardDrive, Share2, RefreshCw, Lock, Globe
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot,
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";

/**
 * FIREBASE SETUP
 * ------------------------------------------------------------------
 * Using the environment variables provided by the system.
 * For your private GitHub repo, you will replace these with your own keys.
 */
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- GAME CONSTANTS & DATA ---

const HARDWARE_TIERS = [
  { id: 'h100', name: 'H100 Cluster', cost: 15000, compute: 10, upkeep: 200 },
  { id: 'b200', name: 'Blackwell B200', cost: 45000, compute: 35, upkeep: 500 },
  { id: 'quantum', name: 'Quantum Node', cost: 500000, compute: 500, upkeep: 5000 },
];

const PRODUCT_TYPES = [
  { 
    id: 'text', name: 'LLM', icon: MessageSquare, baseCost: 50000, baseDevTime: 4, reqCompute: 10,
    specs: ['Chatbot', 'Code Assistant', 'Translation', 'Creative Writing']
  },
  { 
    id: 'image', name: 'Image Gen', icon: Users, baseCost: 80000, baseDevTime: 6, reqCompute: 20,
    specs: ['Photorealism', 'Anime Style', 'Logo Design', 'Deepfake Detection']
  },
  { 
    id: 'video', name: 'Video Model', icon: Play, baseCost: 150000, baseDevTime: 8, reqCompute: 50,
    specs: ['Text-to-Video', 'Video Editor', 'CGI FX', 'Animation']
  },
  { 
    id: 'audio', name: 'Audio Synth', icon: Zap, baseCost: 60000, baseDevTime: 5, reqCompute: 15,
    specs: ['Music Gen', 'TTS (Speech)', 'SFX Gen', 'Voice Cloning']
  },
];

const COMPANIES = [
  { name: 'NvidiaX', demand: 0.9, budget: 8000 },
  { name: 'Facebooc', demand: 0.6, budget: 3000 },
  { name: 'Microhard', demand: 0.8, budget: 5000 },
  { name: 'Joggle', demand: 0.85, budget: 6000 },
  { name: 'Indie Devs', demand: 0.4, budget: 500 },
  { name: 'StreamFlix', demand: 0.7, budget: 4000 },
];

// --- TYPES ---

type Hardware = {
  id: string;
  typeId: string;
  count: number;
};

type Product = {
  id: string;
  name: string;
  type: string;
  specialization: string;
  isOpenSource: boolean;
  version: number;
  quality: number; // 0-100
  hype: number;    // 0-100
  revenue: number;
  released: boolean;
  
  // Dev State
  isUpdating: boolean;
  devProgress: number; // 0-100
  devWeeksLeft: number;
  
  contracts: string[]; // Company names using this API
};

type GameState = {
  id: string; // Document ID
  companyName: string;
  isSandbox: boolean;
  cash: number;
  week: number;
  year: number;
  reputation: number;
  
  hardware: Hardware[];
  products: Product[];
  history: string[];
  
  createdAt: any;
};

// --- MAIN COMPONENT ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [saves, setSaves] = useState<GameState[]>([]);
  const [activeSave, setActiveSave] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'menu' | 'game' | 'create'>('menu'); 

  // --- AUTH ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          // Fallback if custom token fails or isn't present
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  // --- GOOGLE LOGIN (For Production) ---
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Google Auth failed (expected in iframe):", e);
      alert("Google Login is blocked in this preview iframe. Using Anonymous/System account instead.");
    }
  };

  // --- LOAD SAVES ---
  useEffect(() => {
    if (!user) return;
    const savesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'saves');
    const unsub = onSnapshot(savesRef, (snapshot) => {
      const loadedSaves: GameState[] = [];
      snapshot.forEach((doc) => {
        loadedSaves.push({ id: doc.id, ...doc.data() } as GameState);
      });
      setSaves(loadedSaves);
      setLoading(false);
    }, (err) => console.error("Firestore Read Error:", err)); // Silent fail for permission issues

    return () => unsub();
  }, [user]);

  // --- SAVE ACTIONS ---
  const handleCreateSave = async (name: string, isSandbox: boolean) => {
    if (!user) return;
    if (saves.length >= 6) {
      alert("Max 6 saves! Delete one first.");
      return;
    }

    const newGame: Omit<GameState, 'id'> = {
      companyName: name || "Softworks Inc.",
      isSandbox,
      cash: isSandbox ? 100000000 : 25000, // Starting cash
      week: 1,
      year: 2025,
      reputation: 10,
      hardware: [{ id: crypto.randomUUID(), typeId: 'h100', count: 1 }], // Start with 1 H100
      products: [],
      history: ["Softworks founded. Ready to disrupt."],
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(collection(db, 'artifacts', appId, 'users', user.uid, 'saves')), newGame);
      setView('menu');
    } catch (e) {
      console.error(e);
      alert("Error creating save.");
    }
  };

  const handleDeleteSave = async (saveId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !confirm("Delete this save?")) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'saves', saveId));
  };

  const handleSaveGame = async (state: GameState) => {
    if (!user || !state.id) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'saves', state.id), state, { merge: true });
    } catch (e) {
      console.error("Auto-save failed", e);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">Initializing Softworks OS...</div>;

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500 selection:text-black">
      {view === 'menu' && (
        <MainMenu 
          saves={saves} 
          onCreate={() => setView('create')} 
          onLoad={(s) => { setActiveSave(s); setView('game'); }} 
          onDelete={handleDeleteSave}
          onGoogle={handleGoogleLogin}
          user={user}
        />
      )}
      
      {view === 'create' && (
        <CreateSaveScreen onBack={() => setView('menu')} onCreate={handleCreateSave} />
      )}

      {view === 'game' && activeSave && (
        <GameInterface 
          initialState={activeSave} 
          onSave={handleSaveGame}
          onExit={() => { setActiveSave(null); setView('menu'); }}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// MENU COMPONENTS
// ----------------------------------------------------------------------

function MainMenu({ saves, onCreate, onLoad, onDelete, onGoogle, user }: any) {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          SOFTWORKS
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <div className="text-xs text-slate-500 uppercase font-bold">Logged In As</div>
             <div className="text-white font-mono">{user?.isAnonymous ? 'Guest Agent' : user?.email || 'User'}</div>
          </div>
          {user?.isAnonymous && (
            <button onClick={onGoogle} className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition">
              Link Google
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {saves.map((save: GameState) => (
          <div 
            key={save.id} 
            onClick={() => onLoad(save)}
            className="group relative bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500 cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{save.companyName}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${save.isSandbox ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {save.isSandbox ? 'Sandbox' : 'Career'}
                </span>
              </div>
              <button onClick={(e) => onDelete(save.id, e)} className="text-slate-600 hover:text-red-500 p-2">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex gap-4 text-sm text-slate-500 font-mono">
              <span>W{save.week}/{save.year}</span>
              <span>${save.cash.toLocaleString()}</span>
            </div>
          </div>
        ))}

        {saves.length < 6 && (
          <button 
            onClick={onCreate}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 hover:text-cyan-400 hover:border-cyan-500 hover:bg-slate-900/30 transition-all min-h-[180px]"
          >
            <Plus size={40} className="mb-2" />
            <span className="font-bold">Initialize New Corp</span>
          </button>
        )}
      </div>
    </div>
  );
}

function CreateSaveScreen({ onBack, onCreate }: any) {
  const [name, setName] = useState('');
  const [isSandbox, setIsSandbox] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-grid-white/[0.02]">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
        <h2 className="text-3xl font-bold mb-2 text-white">New Save</h2>
        <div className="space-y-6 my-8">
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Company Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Softworks"
              className="w-full bg-black border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none"
              autoFocus
            />
          </div>
          <div 
            onClick={() => setIsSandbox(!isSandbox)}
            className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between ${isSandbox ? 'bg-yellow-900/10 border-yellow-500' : 'bg-black border-slate-800'}`}
          >
            <div>
              <div className={`font-bold ${isSandbox ? 'text-yellow-400' : 'text-white'}`}>Sandbox Mode</div>
              <div className="text-xs text-slate-400">Unlimited cash. No bankruptcy.</div>
            </div>
            {isSandbox && <Zap className="text-yellow-500" />}
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800">Cancel</button>
          <button onClick={() => onCreate(name, isSandbox)} disabled={!name.trim()} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-xl font-bold transition-all">
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// GAME LOGIC & UI
// ----------------------------------------------------------------------

function GameInterface({ initialState, onSave, onExit }: { initialState: GameState, onSave: (s: GameState) => void, onExit: () => void }) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [activeTab, setActiveTab] = useState<'dash' | 'dev' | 'market' | 'server'>('dash');
  const [processing, setProcessing] = useState(false);
  const [logTicker, setLogTicker] = useState("System Online.");

  // Auto-save logic
  useEffect(() => {
    const t = setTimeout(() => onSave(gameState), 1500);
    return () => clearTimeout(t);
  }, [gameState]);

  const addLog = (msg: string) => {
    setLogTicker(msg);
    setGameState(prev => ({ ...prev, history: [msg, ...prev.history].slice(0, 50) }));
  };

  const calculateTotalCompute = () => {
    return gameState.hardware.reduce((total, hw) => {
      const tier = HARDWARE_TIERS.find(t => t.id === hw.typeId);
      return total + (tier ? tier.compute * hw.count : 0);
    }, 0);
  };

  const advanceWeek = () => {
    setProcessing(true);
    setTimeout(() => {
      setGameState(prev => {
        let newCash = prev.cash;
        let newWeek = prev.week + 1;
        let newYear = prev.year;
        
        if (newWeek > 52) { newWeek = 1; newYear++; }

        // Hardware Upkeep
        const totalUpkeep = prev.hardware.reduce((sum, hw) => {
          const tier = HARDWARE_TIERS.find(t => t.id === hw.typeId);
          return sum + (tier ? tier.upkeep * hw.count : 0);
        }, 0);
        newCash -= totalUpkeep;

        // Product Logic
        const newProducts = prev.products.map(p => {
          let updated = { ...p };

          // Development
          if ((!updated.released || updated.isUpdating) && updated.devWeeksLeft > 0) {
            updated.devWeeksLeft--;
            // Simple logic: dev progress goes up
            const totalTime = PRODUCT_TYPES.find(t => t.id === updated.type)?.baseDevTime || 10;
            updated.devProgress = Math.floor(100 - (updated.devWeeksLeft / totalTime) * 100);

            if (updated.devWeeksLeft <= 0) {
              if (updated.isUpdating) {
                updated.version += 1;
                updated.quality = Math.min(100, updated.quality + Math.floor(Math.random() * 15) + 5);
                updated.isUpdating = false;
                updated.hype = 100;
                addLog(`v${updated.version}.0 of ${updated.name} deployed!`);
              } else {
                updated.released = true;
                updated.quality = Math.floor(Math.random() * 40) + 50; // Base quality
                updated.isUpdating = false;
                updated.hype = 100;
                addLog(`Launched ${updated.name}!`);
              }
            }
          }

          // Revenue & Hype
          if (updated.released && !updated.isUpdating) {
            let weeklyRevenue = 0;

            // Contracts revenue
            updated.contracts.forEach(cName => {
              const comp = COMPANIES.find(c => c.name === cName);
              if (comp) weeklyRevenue += Math.floor(comp.budget * (updated.quality / 100));
            });

            // Open Source Mechanic
            if (updated.isOpenSource) {
              weeklyRevenue = 0; // No direct revenue
              updated.hype = Math.min(100, updated.hype + 2); // Hype grows/sustains
            } else {
              updated.hype = Math.max(0, updated.hype - 2); // Hype decays for closed source
            }
            
            updated.revenue += weeklyRevenue;
            newCash += weeklyRevenue;
          }
          return updated;
        });

        return {
          ...prev,
          cash: newCash,
          week: newWeek,
          year: newYear,
          products: newProducts
        };
      });
      setProcessing(false);
    }, 600);
  };

  // --- ACTIONS ---

  const buyHardware = (tierId: string) => {
    const tier = HARDWARE_TIERS.find(t => t.id === tierId);
    if (!tier) return;
    if (gameState.cash < tier.cost && !gameState.isSandbox) {
      alert("Insufficient funds.");
      return;
    }
    
    setGameState(prev => {
      const existing = prev.hardware.find(h => h.typeId === tierId);
      let newHwList = [...prev.hardware];
      if (existing) {
        newHwList = newHwList.map(h => h.typeId === tierId ? { ...h, count: h.count + 1 } : h);
      } else {
        newHwList.push({ id: crypto.randomUUID(), typeId: tierId, count: 1 });
      }
      return { ...prev, cash: prev.cash - tier.cost, hardware: newHwList };
    });
    addLog(`Purchased ${tier.name}.`);
  };

  const startProject = (name: string, typeId: string, spec: string, isOpenSource: boolean) => {
    const type = PRODUCT_TYPES.find(t => t.id === typeId);
    if (!type) return;

    if (gameState.cash < type.baseCost && !gameState.isSandbox) { alert("Too expensive!"); return; }
    if (calculateTotalCompute() < type.reqCompute) { alert("Not enough Compute Power! Upgrade Server Room."); return; }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      type: typeId,
      specialization: spec,
      isOpenSource,
      version: 1,
      quality: 0,
      hype: 0,
      revenue: 0,
      released: false,
      isUpdating: false,
      devProgress: 0,
      devWeeksLeft: type.baseDevTime,
      contracts: []
    };

    setGameState(prev => ({
      ...prev,
      cash: prev.cash - type.baseCost,
      products: [...prev.products, newProduct]
    }));
    addLog(`Started dev on ${name} (${spec}).`);
    setActiveTab('dash');
  };

  const updateProduct = (productId: string) => {
    setGameState(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            isUpdating: true,
            devProgress: 0,
            devWeeksLeft: 3 // Updates are faster than new products
          };
        }
        return p;
      })
    }));
    addLog("Started update patch.");
  };

  const deleteProduct = (productId: string) => {
    if(!confirm("Discontinue this product permanently?")) return;
    setGameState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
    addLog("Product discontinued.");
  };

  const toggleContract = (pid: string, cName: string) => {
    setGameState(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id !== pid) return p;
        if (p.contracts.includes(cName)) return { ...p, contracts: p.contracts.filter(c => c !== cName) };
        return { ...p, contracts: [...p.contracts, cName] };
      })
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black">
      {/* HUD */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
            <Terminal className="text-cyan-400" size={20} />
          </div>
          <div>
            <div className="font-bold text-white leading-none mb-1">{gameState.companyName}</div>
            <div className="text-[10px] text-cyan-500 font-mono animate-pulse">{logTicker}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-mono">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Funds</div>
            <div className={gameState.cash < 0 ? 'text-red-500' : 'text-green-400'}>${gameState.cash.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Compute</div>
            <div className="text-blue-400">{calculateTotalCompute()} TFLOPS</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Date</div>
            <div className="text-white">W{gameState.week}, {gameState.year}</div>
          </div>
          <button 
            onClick={advanceWeek} 
            disabled={processing}
            className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {processing ? 'Processing...' : <>Next Week <Play size={14}/></>}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 gap-4">
          <NavBtn icon={BarChart} active={activeTab==='dash'} onClick={()=>setActiveTab('dash')} label="Dash" />
          <NavBtn icon={Server} active={activeTab==='server'} onClick={()=>setActiveTab('server')} label="Server" />
          <NavBtn icon={Plus} active={activeTab==='dev'} onClick={()=>setActiveTab('dev')} label="Dev" />
          <NavBtn icon={Globe} active={activeTab==='market'} onClick={()=>setActiveTab('market')} label="Market" />
          <div className="flex-1" />
          <NavBtn icon={X} onClick={onExit} label="Exit" color="text-red-500" />
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 bg-black relative">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dash' && (
              <Dashboard 
                state={gameState} 
                onDelete={deleteProduct} 
                onUpdate={updateProduct} 
              />
            )}
            {activeTab === 'server' && (
              <ServerRoom 
                state={gameState} 
                onBuy={buyHardware} 
                totalCompute={calculateTotalCompute()} 
              />
            )}
            {activeTab === 'dev' && (
              <DevLab 
                state={gameState} 
                onStart={startProject} 
                totalCompute={calculateTotalCompute()} 
              />
            )}
            {activeTab === 'market' && (
              <Marketplace 
                state={gameState} 
                onToggle={toggleContract} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-SCREENS
// ----------------------------------------------------------------------

function Dashboard({ state, onDelete, onUpdate }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-slate-500 text-xs font-bold uppercase mb-2">Live Models</div>
          <div className="text-3xl font-bold text-white">{state.products.filter((p:any) => p.released).length}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-slate-500 text-xs font-bold uppercase mb-2">Reputation</div>
          <div className="text-3xl font-bold text-purple-400">{state.products.reduce((acc:any, p:any) => acc + (p.isOpenSource ? p.hype : 0), 0) + 10}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-slate-500 text-xs font-bold uppercase mb-2">Weekly Revenue</div>
          <div className="text-3xl font-bold text-green-400">${state.products.reduce((acc:any, p:any) => acc + p.revenue, 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {state.products.map((p: Product) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group overflow-hidden">
            {p.isOpenSource && <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl">OPEN SOURCE</div>}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <div className="text-xs text-slate-500 flex gap-2 mt-1">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-white">{p.specialization}</span>
                  <span className="font-mono">v{p.version}.0</span>
                </div>
              </div>
            </div>

            {(p.released && !p.isUpdating) ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/50 p-3 rounded-xl border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">Quality</div>
                    <div className={`text-xl font-mono font-bold ${p.quality > 80 ? 'text-green-400' : p.quality > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{p.quality}/100</div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">Hype</div>
                    <div className="text-xl font-mono font-bold text-purple-400">{p.hype}%</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onUpdate(p.id)} className="flex-1 bg-white text-black py-2 rounded-lg font-bold text-xs hover:bg-slate-200">
                    Develop Update (v{p.version + 1})
                  </button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-slate-600 hover:text-red-500 bg-slate-800 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{p.isUpdating ? 'Patching...' : 'Training...'}</span>
                  <span>{p.devWeeksLeft}w left</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-500" style={{width: `${p.devProgress}%`}}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServerRoom({ state, onBuy, totalCompute }: any) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white mb-2">Server Room</h2>
          <p className="text-slate-400">Total Capacity: <span className="text-blue-400 font-mono font-bold">{totalCompute} TFLOPS</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {HARDWARE_TIERS.map(tier => {
          const owned = state.hardware.find((h:any) => h.typeId === tier.id)?.count || 0;
          return (
            <div key={tier.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400">
                  <HardDrive size={24} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{owned}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Owned</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
              <div className="text-sm text-slate-400 mb-4 flex justify-between">
                <span>+{tier.compute} Compute</span>
                <span>-${tier.upkeep}/wk</span>
              </div>
              <button 
                onClick={() => onBuy(tier.id)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Buy <span className="bg-black/20 px-2 py-0.5 rounded text-xs">${tier.cost.toLocaleString()}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DevLab({ state, onStart, totalCompute }: any) {
  const [selectedType, setSelectedType] = useState(PRODUCT_TYPES[0]);
  const [spec, setSpec] = useState(PRODUCT_TYPES[0].specs[0]);
  const [name, setName] = useState('');
  const [isOpenSource, setIsOpenSource] = useState(false);

  useEffect(() => { setSpec(selectedType.specs[0]); }, [selectedType]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-3xl font-bold text-white">New Project</h2>
        <div className="grid grid-cols-2 gap-4">
          {PRODUCT_TYPES.map(t => (
            <div 
              key={t.id} 
              onClick={() => setSelectedType(t)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedType.id === t.id ? 'bg-cyan-900/20 border-cyan-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <t.icon className={selectedType.id === t.id ? 'text-cyan-400' : 'text-slate-500'} />
                <span className="font-bold text-white">{t.name}</span>
              </div>
              <div className="text-xs text-slate-400">
                Requires {t.reqCompute} Compute
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-4">Specialization</h3>
          <div className="flex flex-wrap gap-2">
            {selectedType.specs.map(s => (
              <button 
                key={s} 
                onClick={() => setSpec(s)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${spec === s ? 'bg-white text-black' : 'bg-black text-slate-400 border border-slate-700'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
        <h3 className="font-bold text-white mb-6">Configuration</h3>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-cyan-500 outline-none" 
              placeholder="e.g. DeepMind Alpha"
            />
          </div>
          
          <div onClick={() => setIsOpenSource(!isOpenSource)} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-800 hover:bg-slate-800">
             <div className={`w-5 h-5 rounded border flex items-center justify-center ${isOpenSource ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                {isOpenSource && <Share2 size={12} className="text-black" />}
             </div>
             <div>
               <div className="text-sm font-bold text-white">Open Source</div>
               <div className="text-[10px] text-slate-400">0 Revenue, High Hype/Rep</div>
             </div>
          </div>

          <div className="space-y-2 text-sm text-slate-400 pt-4 border-t border-slate-800">
             <div className="flex justify-between"><span>Cost</span><span className="text-white">${selectedType.baseCost.toLocaleString()}</span></div>
             <div className="flex justify-between"><span>Dev Time</span><span className="text-white">{selectedType.baseDevTime} Weeks</span></div>
             <div className="flex justify-between">
               <span>Compute Load</span>
               <span className={totalCompute >= selectedType.reqCompute ? "text-green-400" : "text-red-500 font-bold"}>
                 {selectedType.reqCompute} / {totalCompute}
               </span>
             </div>
          </div>
        </div>

        <button 
          onClick={() => onStart(name, selectedType.id, spec, isOpenSource)}
          disabled={!name || (!state.isSandbox && state.cash < selectedType.baseCost) || totalCompute < selectedType.reqCompute}
          className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all"
        >
          Initialize Project
        </button>
      </div>
    </div>
  );
}

function Marketplace({ state, onToggle }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4">
      {COMPANIES.map(comp => (
        <div key={comp.name} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-xl text-white">{comp.name}</h3>
            <span className="text-green-400 font-mono text-sm">${comp.budget}/wk</span>
          </div>
          <div className="space-y-2">
            {state.products.filter((p:any) => p.released && !p.isOpenSource).map((p:any) => { // Cannot sell open source
               const signed = p.contracts.includes(comp.name);
               return (
                 <button 
                   key={p.id}
                   onClick={() => onToggle(p.id, comp.name)}
                   className={`w-full flex justify-between px-3 py-2 rounded-lg text-sm border transition-all ${signed ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black border-slate-800 hover:border-slate-600 text-slate-400'}`}
                 >
                   <span>{p.name}</span>
                   <span>{signed ? 'Active' : 'Pitch'}</span>
                 </button>
               )
            })}
            {state.products.filter((p:any) => p.released && !p.isOpenSource).length === 0 && (
              <div className="text-xs text-slate-600 italic text-center py-2">No commercial models available.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function NavBtn({ icon: Icon, active, onClick, label, color="text-slate-400" }: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-xl transition-all flex flex-col items-center gap-1 ${active ? 'bg-cyan-900/20 text-cyan-400' : `hover:bg-slate-800 ${color}`}`}>
      <Icon size={24} />
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </button>
  )
}
