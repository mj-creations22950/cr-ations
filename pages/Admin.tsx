
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { 
  Plus, Trash2, Edit3, Save, Settings, FileText, LayoutDashboard, Activity, 
  DollarSign, Palette, MapPin, Zap, RefreshCcw, CheckCircle, Wifi, 
  Database, Users, BookOpen, Cpu, Loader2, ArrowUpRight, TrendingUp,
  Layout, Eye, EyeOff, MoveUp, MoveDown, Calendar, Search, Filter, 
  ChevronRight, ShieldAlert, CreditCard, Mail, Globe, Lock, MoreHorizontal,
  ArrowRight, Clock, AlertTriangle, Download, X, Package, ShieldCheck,
  MousePointer2, Terminal, Info, Languages, CreditCard as CardIcon, FileJson,
  GripVertical, Image as ImageIcon, Send, History, Check, User
} from 'lucide-react';
import { Service } from '../types';

const Admin: React.FC = () => {
  const { 
    services, addService, updateService, deleteService, 
    transactions, settings, updateSettings, 
    logs, orders, updateOrderStatus, users 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORDERS' | 'SERVICES' | 'CLIENTS' | 'SETTINGS' | 'LOGS'>('DASHBOARD');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'IDENTITY' | 'FINANCE' | 'LEGAL' | 'EMAIL' | 'SEO' | 'SECURITY' | 'GDPR' | 'HOME_BLOCKS'>('IDENTITY');
  const [localSettings, setLocalSettings] = useState(settings);
  
  // Service Editor State
  const [editingService, setEditingService] = useState<Service | null>(null);

  const stats = useMemo(() => {
    const successfulTx = transactions.filter(t => t.status === 'SUCCESS');
    const totalRevenue = successfulTx.reduce((acc, t) => acc + t.amount, 0);
    const pendingRevenue = transactions.filter(t => t.status === 'PROCESSING').reduce((acc, t) => acc + t.amount, 0);
    return { totalRevenue, pendingRevenue, orderCount: orders.length, clientCount: users.length };
  }, [transactions, orders, users]);

  const handleSaveSettings = () => {
    updateSettings(localSettings);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (services.find(s => s.id === editingService.id)) {
      updateService(editingService.id, editingService);
    } else {
      addService(editingService);
    }
    setEditingService(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-950 text-white flex flex-col sticky top-0 h-screen overflow-hidden border-r border-white/5 shadow-4xl z-[100]">
        <div className="p-10 flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20"><Zap size={28} /></div>
          <div>
            <h2 className="font-black text-xl tracking-tighter uppercase leading-none">Artipol Pro</h2>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">v2.5 Enterprise</p>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          {[
            { id: 'DASHBOARD', label: 'Pilotage Live', icon: LayoutDashboard },
            { id: 'ORDERS', label: 'Commandes', icon: Package },
            { id: 'SERVICES', label: 'Moteur Services', icon: Database },
            { id: 'CLIENTS', label: 'Gestion Clients', icon: Users },
            { id: 'SETTINGS', label: 'Configuration', icon: Settings },
            { id: 'LOGS', label: 'Audit Trail', icon: Activity },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black text-sm transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-grow p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-12 animate-fadeIn">
               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <h1 className="text-6xl font-black tracking-tighter">Pilotage Live</h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">Bretagne • {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-4">
                     <button className="bg-white px-8 py-4 rounded-2xl border border-slate-200 font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-sm"><Download size={16}/> Rapport PDF</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Chiffre d\'Affaires', value: `${stats.totalRevenue.toFixed(2)}€`, icon: DollarSign, color: 'blue' },
                    { label: 'Transactions', value: stats.orderCount, icon: LayoutDashboard, color: 'green' },
                    { label: 'Clients Actifs', value: stats.clientCount, icon: Users, color: 'purple' },
                    { label: 'Flux Latent', value: `${stats.pendingRevenue.toFixed(2)}€`, icon: RefreshCcw, color: 'amber' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
                       <stat.icon size={28} className={`text-${stat.color}-500 mb-6`} />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                       <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'SERVICES' && (
            <div className="space-y-10 animate-fadeIn">
               <header className="flex justify-between items-center">
                  <h1 className="text-5xl font-black tracking-tighter">Inventaire Services</h1>
                  <button onClick={() => setEditingService({
                    id: `s-${Date.now()}`, name: '', categoryId: '1', basePrice: 0, active: true, duration: 60, tags: [], description: '', fullDescription: '', included: [], excluded: [], imageUrl: '', variants: [], options: []
                  })} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <Plus size={18}/> Créer Prestation
                  </button>
               </header>

               <div className="grid grid-cols-1 gap-6">
                  {services.map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-[40px] border border-slate-100 flex items-center gap-10 group hover:shadow-2xl transition-all">
                       <img src={s.imageUrl} className="w-24 h-24 rounded-3xl object-cover" alt={s.name} />
                       <div className="flex-grow">
                          <h4 className="text-2xl font-black text-slate-900">{s.name}</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{s.basePrice}€ • {s.duration} min</p>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={() => setEditingService(s)} className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={20}/></button>
                          <button onClick={() => deleteService(s.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
                       </div>
                    </div>
                  ))}
               </div>

               {editingService && (
                 <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-10">
                    <form onSubmit={handleSaveService} className="bg-white w-full max-w-4xl p-16 rounded-[60px] shadow-4xl space-y-10 max-h-[90vh] overflow-y-auto">
                       <div className="flex justify-between items-center">
                          <h2 className="text-4xl font-black tracking-tighter">Éditeur Prestation</h2>
                          <button type="button" onClick={() => setEditingService(null)}><X size={32}/></button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom du service</label>
                             <input type="text" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} className="w-full p-6 bg-slate-50 rounded-3xl border-none font-black" required />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix de base (€)</label>
                             <input type="number" value={editingService.basePrice} onChange={e => setEditingService({...editingService, basePrice: Number(e.target.value)})} className="w-full p-6 bg-slate-50 rounded-3xl border-none font-black" required />
                          </div>
                          <div className="md:col-span-2 space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description marketing</label>
                             <textarea value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full p-6 bg-slate-50 rounded-3xl border-none font-medium h-32" />
                          </div>
                          <div className="md:col-span-2 space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL de l'image (Unsplash ou autre)</label>
                             <input type="text" value={editingService.imageUrl} onChange={e => setEditingService({...editingService, imageUrl: e.target.value})} className="w-full p-6 bg-slate-50 rounded-3xl border-none font-mono text-sm" />
                          </div>
                       </div>
                       <button type="submit" className="w-full bg-blue-600 text-white py-8 rounded-[32px] font-black text-xl shadow-2xl">Enregistrer la Prestation</button>
                    </form>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'ORDERS' && (
            <div className="space-y-10 animate-fadeIn">
               <h1 className="text-5xl font-black tracking-tighter">Gestion Commandes</h1>
               <div className="bg-white rounded-[50px] shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full">
                     <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                           <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                           <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date RDV</th>
                           <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                           <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                           <th className="px-10 py-6 text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {orders.map(o => (
                           <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-10 py-8 font-black text-xs">{o.id}</td>
                              <td className="px-10 py-8">
                                 <p className="font-black text-sm">{users.find(u => u.id === o.userId)?.name || 'Anonyme'}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{o.address}</p>
                              </td>
                              <td className="px-10 py-8 text-sm font-bold text-slate-600">{o.bookingDate} • {o.bookingSlot}</td>
                              <td className="px-10 py-8 font-black text-blue-600">{o.totalTTC.toFixed(2)}€</td>
                              <td className="px-10 py-8">
                                 <select 
                                   value={o.status} 
                                   onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border-none focus:ring-0 ${o.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                                 >
                                    <option value="PAID">Payée</option>
                                    <option value="COMPLETED">Terminée</option>
                                    <option value="CANCELLED">Annulée</option>
                                 </select>
                              </td>
                              <td className="px-10 py-8 text-right">
                                 <button className="p-3 bg-white border border-slate-100 rounded-xl hover:text-blue-600 shadow-sm"><MoreHorizontal size={20}/></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
            <div className="space-y-12 animate-fadeIn">
               <header className="flex justify-between items-end">
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter">Configuration Système</h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">Cerveau de la Plateforme</p>
                  </div>
                  <button onClick={handleSaveSettings} className="bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                     <Save size={18}/> Appliquer Globale
                  </button>
               </header>

               <div className="flex flex-col lg:flex-row gap-12">
                  <aside className="w-full lg:w-72 shrink-0 space-y-2">
                     {[
                       { id: 'IDENTITY', label: 'Visuel & Thème', icon: Palette },
                       { id: 'FINANCE', label: 'IBAN & Taxes', icon: DollarSign },
                       { id: 'LEGAL', label: 'Docs Légaux', icon: FileText },
                       { id: 'SECURITY', label: 'Accès & Backup', icon: Lock },
                     ].map(tab => (
                       <button
                         key={tab.id}
                         onClick={() => setActiveSettingsTab(tab.id as any)}
                         className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSettingsTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                         <tab.icon size={16} /> {tab.label}
                       </button>
                     ))}
                  </aside>

                  <div className="flex-grow bg-white p-12 rounded-[60px] shadow-sm border border-slate-100 space-y-12">
                     {activeSettingsTab === 'IDENTITY' && (
                       <div className="space-y-10 animate-fadeIn">
                          <h3 className="text-2xl font-black tracking-tighter">Identité Visuelle</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Nom enseigne</label>
                                <input type="text" value={localSettings.logo} onChange={(e) => setLocalSettings({...localSettings, logo: e.target.value})} className="w-full p-6 bg-slate-50 rounded-3xl border-none font-black text-slate-900" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Couleur Primaire</label>
                                <input type="color" value={localSettings.primaryColor} onChange={(e) => setLocalSettings({...localSettings, primaryColor: e.target.value})} className="w-full h-16 rounded-3xl border-none cursor-pointer" />
                             </div>
                          </div>
                       </div>
                     )}
                     {activeSettingsTab === 'FINANCE' && (
                       <div className="space-y-10 animate-fadeIn">
                          <h3 className="text-2xl font-black tracking-tighter">Paramètres Bancaires</h3>
                          <div className="p-10 bg-slate-950 text-white rounded-[40px] space-y-6">
                             <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">IBAN Récepteur (Compte Principal)</p>
                             <input type="text" value={localSettings.bankAccounts[0].iban} onChange={(e) => {
                               const newBanks = [...localSettings.bankAccounts];
                               newBanks[0].iban = e.target.value;
                               setLocalSettings({...localSettings, bankAccounts: newBanks});
                             }} className="w-full bg-white/5 border-none p-6 font-mono tracking-widest rounded-3xl text-xl" />
                          </div>
                       </div>
                     )}
                     {/* ... Logic consistency for other settings tabs ... */}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'LOGS' && (
            <div className="space-y-10 animate-fadeIn">
               <h1 className="text-5xl font-black tracking-tighter">Journal d'Audit</h1>
               <div className="space-y-3">
                  {logs.map(log => (
                    <div key={log.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <span className={`w-2 h-2 rounded-full ${log.severity === 'CRITICAL' ? 'bg-red-500' : log.severity === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                          <div>
                             <p className="font-black text-xs text-slate-900">{log.action}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{log.user} • {new Date(log.date).toLocaleString()}</p>
                          </div>
                       </div>
                       <p className="text-xs font-medium text-slate-500">{log.details}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default Admin;
