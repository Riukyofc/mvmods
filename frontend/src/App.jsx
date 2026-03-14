import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Key, ShieldAlert, UploadCloud, PlayCircle, Package, LogOut,
  Plus, Trash2, Download, CheckCircle, FileText, Clock, Search, Menu, X,
  Sparkles, MonitorPlay, Terminal, ChevronRight, User, Mail, Lock
} from 'lucide-react';
import { auth } from './config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, getIdToken } from 'firebase/auth';
import api from './api';
import axios from 'axios';

export default function App() {
  const [currentView, setCurrentView] = useState('store');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 

  const [products, setProducts] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listener Master de Autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email === 'alexcastrocutrim@gmail.com') {
        setIsAdmin(true);
        const token = await getIdToken(user);
        setAdminToken(token);
      } else {
        setIsAdmin(false);
        setAdminToken(null);
        if (currentView === 'admin') setCurrentView('store');
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  // Helper para garantir token sempre fresco
  const getFreshToken = async () => {
    if (!auth.currentUser) return null;
    return await getIdToken(auth.currentUser, true); // true força refresh se necessário
  };

  // Carregar produtos da API aberta
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setIsAuthModalOpen(false);
      navigate('admin');
    } catch (error) {
      alert("Falha na autenticação: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setAdminToken(null);
    navigate('store');
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-red-500/30 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
        .glass-panel {
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}} />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50 py-2' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('store')}>
              <div className="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] bg-black border border-zinc-800">
                <img src="/logo.webp" alt="MV Logo" className="w-12 h-12 object-contain p-1" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-widest text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-red-50 transition-colors">
                  MV <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">Mods</span>
                </span>
                <span className="text-[0.65rem] text-zinc-400 font-mono uppercase tracking-[0.2em] group-hover:text-red-400 transition-colors">Graphics Studio</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('store')} className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:text-red-400 relative ${currentView === 'store' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-zinc-400'}`}>
                Catálogo
              </button>
              <button onClick={() => navigate('redeem')} className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:text-red-400 relative ${currentView === 'redeem' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-zinc-400'}`}>
                <Key className="w-4 h-4" /> Resgatar Chave
              </button>
              <div className="w-px h-6 bg-white/10 mx-2"></div>
              {isAdmin ? (
                <button onClick={() => navigate('admin')} className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-300 ${currentView === 'admin' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105' : 'bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-zinc-300'}`}>
                  <ShieldAlert className="w-4 h-4" /> Painel
                </button>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30">
                  <User className="w-4 h-4" /> Logar
                </button>
              )}
            </div>
            
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-400 hover:text-red-500 transition-colors">
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAuthModalOpen(false)}></div>
          <div className="relative w-full max-w-md glass-panel rounded-[2.5rem] p-8 sm:p-10 shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-white/10">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-white/5 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600/20 to-black border border-red-500/30 mb-5">
                <User className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-widest uppercase">{authMode === 'login' ? 'Iniciar Sessão' : 'Criar Conta'}</h2>
            </div>
            <div className="flex bg-black/50 p-1 rounded-xl mb-6 border border-white/5">
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${authMode === 'login' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>Login</button>
              <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${authMode === 'register' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>Registar</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input name="email" type="email" required className="w-full bg-black/60 border border-white/10 text-white pl-14 pr-6 py-4 rounded-2xl focus:border-red-500 outline-none" placeholder="email@exemplo.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 flex justify-between">
                  <span>Palavra-Passe</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input name="password" type="password" required className="w-full bg-black/60 border border-white/10 text-white pl-14 pr-6 py-4 rounded-2xl focus:border-red-500 outline-none" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-md mt-4">
                {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CORE PAGES */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
        {currentView === 'store' && <Storefront products={products} />}
        {currentView === 'redeem' && <RedeemPage />}
        {currentView === 'admin' && isAdmin && (
          <AdminDashboard 
            adminToken={adminToken}
            products={products} 
            setProducts={setProducts} 
            keys={keys} 
            setKeys={setKeys} 
            fetchProducts={fetchProducts}
            onLogout={handleLogout} 
          />
        )}
      </main>
    </div>
  );
}

// --------------------------------------------------------------------------------
// STOREFRONT
// --------------------------------------------------------------------------------
function Storefront({ products }) {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      <div className="relative overflow-hidden rounded-[2.5rem] glass-panel p-8 sm:p-20 group">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" /> Next-Gen Graphics
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
            Gráficos Ultra <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600 animate-gradient-x drop-shadow-md">
              Realistas.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 font-light max-w-2xl leading-relaxed">
            Eleve o visual do seu servidor FiveM para o próximo nível. Mods de iluminação, texturas 4K e presets cinematográficos de alta performance.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-6 mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1"></div>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-4">
            <Terminal className="text-red-500 w-8 h-8" /> Destaques
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1"></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 uppercase tracking-widest font-bold">Nenhum mod disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group relative glass-panel rounded-3xl overflow-hidden hover:border-red-500/50 transition-all duration-500 hover:-translate-y-3 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10"></div>
                  <div className="absolute bottom-5 left-5 z-20 flex gap-2">
                    <span className="glass-panel text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg text-zinc-200 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-red-500" /> {product.filesize}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col relative z-20 bg-gradient-to-b from-[#0a0a0a]/0 to-[#050505]">
                  <h3 className="text-2xl font-black text-white mb-4 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-zinc-400 mb-8 line-clamp-3 flex-1">{product.description}</p>
                  
                  <div className="flex gap-4">
                    {product.demo && <a href={product.demo} target="_blank" rel="noreferrer" className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2">
                      <PlayCircle className="w-5 h-5 text-red-500" /> Demo
                    </a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------
// REDEEM PAGE
// --------------------------------------------------------------------------------
function RedeemPage() {
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [redeemedProduct, setRedeemedProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setStatus('loading');
    setErrorMsg('');
    
    try {
      const response = await api.post('/redeem/validate', { code: inputKey });
      
      if (response.data.success) {
        setRedeemedProduct(response.data.data.product);
        setStatus('success');
      } else {
        throw new Error("Chave inválida");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'CHAVE INVÁLIDA OU EXPIRADA.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (redeemedProduct?.downloadUrl) {
      window.location.href = redeemedProduct.downloadUrl;
    } else {
      alert("Nenhum link de download disponível no momento.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase drop-shadow-lg">Desbloquear Mod</h1>
        <p className="text-zinc-400 mt-4 font-light text-xl">Insira a sua chave de acesso para iniciar a transferência.</p>
      </div>

      {status !== 'success' ? (
        <div className="glass-panel rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleRedeem} className="space-y-8 relative z-10">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-red-500" /> Insert Auth Key
              </label>
              <input type="text" placeholder="MV-XXXX-YYYY-ZZZZ" value={inputKey} onChange={(e) => setInputKey(e.target.value.toUpperCase())} className="w-full bg-black/50 border-2 border-white/10 text-white px-8 py-6 rounded-2xl focus:border-red-500 font-mono text-center text-2xl sm:text-3xl tracking-[0.25em] placeholder:text-zinc-700 uppercase outline-none" />
            </div>

            {status === 'error' && (
              <div className="bg-red-950/50 border border-red-500/50 text-red-400 px-6 py-5 rounded-2xl text-sm font-bold tracking-widest uppercase flex items-center gap-4">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-4">
              {status === 'loading' ? 'A DESCRIPTOGRAFAR...' : 'Validar Acesso'}
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-panel border-red-500/50 rounded-[3rem] p-10 sm:p-14 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-widest">Acesso Libertado!</h2>
            <p className="text-zinc-400 mb-12">Chave validada. Ficheiros prontos para transferência.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 bg-black/40 p-6 rounded-3xl border border-white/5">
              <img src={redeemedProduct?.image} alt={redeemedProduct?.title} className="w-32 h-32 object-cover rounded-xl" />
              <div className="text-left">
                <h3 className="font-black text-2xl text-white mb-2">{redeemedProduct?.title}</h3>
                <span className="text-xs font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl">Expira: {redeemedProduct?.expireDate}</span>
              </div>
            </div>

            <button onClick={handleDownload} className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl shadow-lg flex items-center justify-center gap-4">
              <Download className="w-7 h-7" /> Iniciar Download Seguro
            </button>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------------
// ADMIN DASHBOARD
// --------------------------------------------------------------------------------
function AdminDashboard({ products, setProducts, keys, setKeys, fetchProducts, onLogout }) {
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const token = await getIdToken(auth.currentUser, true);
        const { data } = await api.get('/keys', { headers: { Authorization: `Bearer ${token}` }});
        if(data.success) {
          setKeys(data.data);
        }
      } catch(err) {
        console.error("Erro buscar keys:", err);
      }
    };
    if (activeTab === 'keys') {
      fetchKeys();
    }
  }, [activeTab, setKeys]);

  return (
    <div className="flex flex-col xl:flex-row gap-8 mt-8">
      <div className="w-full xl:w-80 shrink-0 space-y-6">
        <div className="glass-panel rounded-[2rem] p-8">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-6">Superuser Access</p>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-black text-2xl text-white">MV</div>
            <div>
              <p className="text-base font-black text-white uppercase tracking-widest">Admin</p>
              <p className="text-xs font-mono text-green-400 flex items-center gap-2 mt-2"><span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span> Online</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-4 px-6 py-5 text-sm font-bold uppercase rounded-2xl transition-all ${activeTab === 'products' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'text-zinc-400 hover:bg-white/5 border border-transparent'}`}><Package className="w-5 h-5"/> Gestão de Mods</button>
          <button onClick={() => setActiveTab('add-product')} className={`flex items-center gap-4 px-6 py-5 text-sm font-bold uppercase rounded-2xl transition-all ${activeTab === 'add-product' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'text-zinc-400 hover:bg-white/5 border border-transparent'}`}><Plus className="w-5 h-5"/> Adicionar Novo</button>
          <button onClick={() => setActiveTab('keys')} className={`flex items-center gap-4 px-6 py-5 text-sm font-bold uppercase rounded-2xl transition-all ${activeTab === 'keys' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'text-zinc-400 hover:bg-white/5 border border-transparent'}`}><Key className="w-5 h-5"/> Gerador de Keys</button>
          <div className="h-px bg-white/10 my-4"></div>
          <button onClick={onLogout} className="flex items-center gap-4 px-6 py-5 text-sm font-bold uppercase rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400"><LogOut className="w-5 h-5"/> Terminar Sessão</button>
        </nav>
      </div>

      <div className="flex-1 glass-panel rounded-[2.5rem] p-8 sm:p-12 min-h-[800px] shadow-2xl">
        {activeTab === 'products' && <AdminProductsList products={products} setProducts={setProducts} onAdd={() => setActiveTab('add-product')} fetchProducts={fetchProducts} />}
        {activeTab === 'add-product' && <AdminAddProduct onSave={() => { fetchProducts(); setActiveTab('products'); }} />}
        {activeTab === 'keys' && <AdminKeyManager products={products} keys={keys} setKeys={setKeys} />}
      </div>
    </div>
  );
}

function AdminProductsList({ products, onAdd, fetchProducts }) {
  const handleDelete = async (productId) => {
    if(!window.confirm("Deseja mesmo eliminar este mod? O arquivo será deletado permanentemente do Banco de Dados!")) return;
    try {
      const token = await getIdToken(auth.currentUser, true);
      await api.delete(`/products/${productId}`, { headers: { Authorization: `Bearer ${token}` }});
      fetchProducts();
    } catch(err) {
      alert("Erro ao excluir: " + err.message);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black text-white uppercase">Catálogo de Mods</h2>
        <button onClick={onAdd} className="bg-red-600 px-8 py-4 rounded-xl text-sm font-bold text-white uppercase flex items-center gap-3"><Plus className="w-5 h-5" /> Novo Mod</button>
      </div>
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/60 text-zinc-400 uppercase text-xs font-bold border-b border-white/10">
            <tr><th className="px-8 py-6">Produto</th><th className="px-8 py-6">Tamanho</th><th className="px-8 py-6 text-right">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <img src={p.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <span className="font-black text-white text-lg">{p.title}</span>
                  </div>
                </td>
                <td className="px-8 py-6 font-mono text-zinc-400">{p.filesize}</td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleDelete(p.id)} className="text-zinc-500 hover:text-red-500 bg-black/50 p-3 rounded-xl"><Trash2 className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="3" className="px-8 py-20 text-center font-bold uppercase text-zinc-500">Vazio.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminAddProduct({ adminToken, onSave }) {
  const [formData, setFormData] = useState({ title: '', description: '', image: '', demo: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileState, setFileState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const uploadFileToStorage = async () => {
    if (!selectedFile) return null;
    setFileState('uploading');
    
    try {
      const token = await getIdToken(auth.currentUser, true);
      const resURL = await api.post('/products/presigned-url', { filename: selectedFile.name, contentType: selectedFile.type }, { headers: { Authorization: `Bearer ${token}` }});
      const { uploadUrl, filePath } = resURL.data.data;
      
      // Axios PUT direto p/ Cloud Storage com Barra de Progresso Real
      await axios.put(uploadUrl, selectedFile, {
        headers: { "Content-Type": selectedFile.type },
        onUploadProgress: (progressEvent) => {
           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
           setUploadProgress(percentCompleted);
        }
      });
      
      setFileState('complete');
      return filePath;
    } catch (error) {
      setFileState('idle');
      console.error("Erro detalhado do upload:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Selecione o ficheiro do mod.");
    try {
      const filePath = await uploadFileToStorage();
      const token = await getIdToken(auth.currentUser, true);

      await api.post('/products', {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        demo: formData.demo,
        filePath: filePath,
        filesize: `${(selectedFile.size / (1024*1024*1024)).toFixed(2)} GB`
      }, { headers: { Authorization: `Bearer ${token}` }});

      alert("Mod adicionado com sucesso!");
      onSave();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Erro desconhecido";
      alert("Falha no upload: " + msg);
    }
  };

  return (
    <div className="max-w-5xl">
      <h2 className="text-4xl font-black text-white uppercase mb-4">Cadastrar Mod</h2>
      <p className="text-sm text-zinc-400 mb-12">O sistema vai subir os arquivos gigantes nativamente usando URL Assinada pelo Bucket.</p>

      <form onSubmit={handleSubmit} className="space-y-10 glass-panel border-white/5 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="space-y-8">
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white px-6 py-4 rounded-2xl" placeholder="Título do Mod" />
            <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white px-6 py-4 rounded-2xl" placeholder="URL Imagem de Capa" />
            <input type="url" value={formData.demo} onChange={e => setFormData({...formData, demo: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white px-6 py-4 rounded-2xl" placeholder="URL Demo YouTube" />
            <textarea required rows="5" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white px-6 py-4 rounded-2xl resize-none" placeholder="Descrição Detalhada"></textarea>
          </div>
          <div className="flex flex-col h-full relative">
            <input 
              type="file" 
              accept=".zip,.rar" 
              className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer" 
              onChange={handleFileSelect} 
              disabled={fileState !== 'idle'} 
            />
            <div className={`flex-1 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-12 min-h-[400px] ${fileState === 'uploading' ? 'border-red-500' : 'border-white/20'}`}>
              {fileState === 'idle' && (
                <div className="text-center text-zinc-400">
                  <UploadCloud className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold">{selectedFile ? selectedFile.name : 'Click ou Solte Arquivo de até 10GB'}</p>
                </div>
              )}
              {fileState === 'uploading' && (
                <div className="w-full text-center">
                  <p className="text-red-500 font-bold mb-4">{uploadProgress}% - Enviando para Storage...</p>
                  <div className="w-full bg-black/80 rounded-full h-4 border border-white/10"><div className="bg-red-500 h-full rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>
                </div>
              )}
              {fileState === 'complete' && (
                <div className="text-green-500 text-center font-bold"><CheckCircle className="w-16 h-16 mx-auto mb-4" /> Upload Concluído</div>
              )}
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-white/5 flex justify-end">
          <button type="submit" disabled={fileState === 'uploading' || !selectedFile} className="bg-red-600 hover:bg-red-500 text-white px-10 py-5 rounded-2xl font-black uppercase disabled:opacity-50">Upload e Salvar DB</button>
        </div>
      </form>
    </div>
  );
}

function AdminKeyManager({ adminToken, products, keys, setKeys }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [duration, setDuration] = useState('1_month');
  const [generatedKey, setGeneratedKey] = useState(null);

  useEffect(() => { if(products.length > 0 && !selectedProduct) setSelectedProduct(products[0].id); }, [products]);

  const handleGenerate = async () => {
    try {
      const token = await getIdToken(auth.currentUser, true);
      const { data } = await api.post('/keys', { productId: selectedProduct, duration }, { headers: { Authorization: `Bearer ${token}` }});
      if(data.success) {
        setGeneratedKey(data.data.code);
        setKeys([data.data, ...keys]);
      }
    } catch(err) {
      alert("Erro ao gerar key");
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-black text-white uppercase mb-8">Gerador de Keys</h2>
      <div className="glass-panel rounded-[2.5rem] p-8 sm:p-12 mb-12 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-400 mb-4">Mod</label>
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="w-full bg-black/60 border border-white/10 text-white px-6 py-5 rounded-2xl">
            {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-400 mb-4">Duração</label>
          <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-black/60 border border-white/10 text-white px-6 py-5 rounded-2xl">
            <option value="1_day">1 Dia (Trial)</option><option value="1_week">1 Semana</option><option value="1_month">1 Mês</option>
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={handleGenerate} className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase py-5 rounded-2xl shadow-lg">Gerar Key</button>
        </div>
      </div>
      {generatedKey && (
        <div className="p-8 bg-red-950/30 border-2 border-red-500/50 rounded-2xl mb-12 text-center">
          <p className="text-3xl font-mono text-white tracking-[0.25em]">{generatedKey}</p>
        </div>
      )}
      <div className="glass-panel border-white/5 rounded-n3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-zinc-300"><thead className="bg-black/60 uppercase"><tr><th className="p-6">Chave</th><th className="p-6">Produto</th><th className="p-6">Status</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {keys.map((k) => <tr key={k.id}><td className="p-6 font-mono text-white">{k.code}</td><td className="p-6">{products.find(p=>p.id===k.productId)?.title}</td><td className="p-6"><span className="text-green-500 uppercase font-bold text-xs">{k.status}</span></td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
