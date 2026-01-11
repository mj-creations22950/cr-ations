
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ServiceDetail from './pages/ServiceDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Portal from './pages/Portal';
import Admin from './pages/Admin';
import CookieBanner from './components/CookieBanner';
import { UserRole } from './types';
import { Construction, Lock, ShieldCheck } from 'lucide-react';

// Maintenance Screen
const MaintenanceMode: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center space-y-10">
    <div className="w-32 h-32 bg-blue-600 rounded-[40px] flex items-center justify-center shadow-4xl shadow-blue-500/20 animate-pulse">
       <Construction size={56} className="text-white" />
    </div>
    <div className="space-y-4">
      <h1 className="text-6xl font-black text-white tracking-tighter">Chantier en cours</h1>
      <p className="text-slate-400 text-xl font-medium max-w-md mx-auto">Notre plateforme fait peau neuve. Nous revenons très prochainement pour mieux vous servir en Bretagne.</p>
    </div>
    <div className="pt-10 border-t border-white/5 w-full max-w-xs text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
      Propulsé par Artipol ServiCore v2.5
    </div>
  </div>
);

const Login: React.FC = () => {
  const { setUser } = useApp();
  const loginAs = (role: UserRole) => {
    setUser({
      id: role === UserRole.ADMIN ? '1' : '2',
      email: role === UserRole.ADMIN ? 'admin@serviflow.com' : 'client@test.com',
      name: role === UserRole.ADMIN ? 'Admin Principal' : 'Jean Dupont',
      role: role,
      address: '123 Rue de la République, Saint-Brieuc',
      createdAt: new Date().toISOString(),
      points: 150
    });
    window.location.hash = role === UserRole.ADMIN ? '#/admin' : '#/portal';
  };

  return (
    <div className="max-w-2xl mx-auto my-32 p-16 bg-white rounded-[60px] shadow-4xl text-center space-y-12 border border-slate-100">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto"><Lock size={40}/></div>
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tighter">Connexion Sécurisée</h2>
        <p className="text-slate-400 font-medium">Accédez à votre espace Artipol en un clic pour les tests.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => loginAs(UserRole.CLIENT)} className="group p-10 bg-slate-50 rounded-[40px] border border-slate-100 hover:bg-blue-600 hover:text-white transition-all text-left space-y-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm"><ShieldCheck size={24}/></div>
           <p className="font-black uppercase tracking-widest text-xs">Espace Client</p>
           <p className="text-sm opacity-60">Suivi interventions & factures</p>
        </button>
        <button onClick={() => loginAs(UserRole.ADMIN)} className="group p-10 bg-slate-900 text-white rounded-[40px] hover:bg-blue-600 transition-all text-left space-y-4">
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white transition-colors"><Lock size={24}/></div>
           <p className="font-black uppercase tracking-widest text-xs">Console Admin</p>
           <p className="text-sm opacity-60">Gestion totale & configuration</p>
        </button>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { settings, user } = useApp();
  
  // Maintenance check - Admin bypass
  if (settings.maintenanceMode && user?.role !== UserRole.ADMIN) {
    return <MaintenanceMode />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <CookieBanner />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
