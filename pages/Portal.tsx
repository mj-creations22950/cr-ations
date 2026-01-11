
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { 
  Package, User, FileText, Settings, ChevronRight, Calendar, 
  CreditCard, Shield, LogOut, HelpCircle, Download, Clock,
  MessageSquare, Send, Paperclip, Check, Trash2, Printer, 
  MapPin, X, Star, Bell, ArrowRight, ShieldCheck, DownloadCloud,
  LayoutDashboard, History, Zap, Award
} from 'lucide-react';

const Portal: React.FC = () => {
  const { user, orders, tickets, addTicketMessage, setUser, settings, notifications, markNotificationRead, addReview } = useApp();
  const navigate = useNavigate();
  const [activePortalTab, setActivePortalTab] = useState<'DASHBOARD' | 'ORDERS' | 'PLANNING' | 'MESSAGES' | 'INVOICES' | 'SECURITY'>('DASHBOARD');
  const [msgInput, setMsgInput] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isReviewingId, setIsReviewingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const nextIntervention = orders.find(o => o.status === 'PAID');
  const totalSpent = orders.reduce((acc, o) => acc + o.totalTTC, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSendMsg = (ticketId: string) => {
    if (!msgInput.trim()) return;
    addTicketMessage(ticketId, msgInput);
    setMsgInput('');
  };

  const handleReview = (serviceId: string) => {
    addReview({
      serviceId,
      userId: user?.id || '2',
      userName: user?.name || 'Client',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString(),
      verified: true
    });
    setIsReviewingId(null);
  };

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 shrink-0 space-y-8 no-print">
        <div className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
          <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-inner overflow-hidden">
             <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-black text-2xl text-slate-900 leading-tight">{user.name}</h3>
          <div className="mt-4 flex flex-col items-center gap-2">
             <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">Client Platinum</span>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.points} Points Fidélité</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'DASHBOARD', label: 'Vue d\'ensemble', icon: LayoutDashboard },
            { id: 'ORDERS', label: 'Mes Interventions', icon: Package },
            { id: 'PLANNING', label: 'Agenda & Planning', icon: Calendar },
            { id: 'MESSAGES', label: 'Support & Chat', icon: MessageSquare, count: 1 },
            { id: 'INVOICES', label: 'Mes Factures', icon: FileText },
            { id: 'SECURITY', label: 'Compte & Sécurité', icon: Shield },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActivePortalTab(item.id as any)}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[24px] font-black transition-all ${activePortalTab === item.id ? 'bg-blue-600 text-white shadow-3xl shadow-blue-500/20 translate-x-3' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
            >
              <item.icon size={20} /> <span className="text-sm">{item.label}</span>
              {item.count && <span className="ml-auto bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="pt-6">
           <button onClick={() => { setUser(null); navigate('/'); }} className="w-full flex items-center gap-5 px-8 py-5 rounded-[24px] text-red-500 font-black hover:bg-red-50 transition-all">
            <LogOut size={20} /> <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow space-y-12 animate-fadeIn no-print">
        
        {activePortalTab === 'DASHBOARD' && (
          <div className="space-y-12">
            <header className="flex justify-between items-end">
               <div className="space-y-2">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Tableau de bord</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Bonjour {user.name}, ravis de vous revoir.</p>
               </div>
               <div className="relative">
                  <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 relative hover:text-blue-600 transition-colors">
                     <Bell size={24} />
                     {unreadCount > 0 && <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                  </button>
               </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Zap size={24}/></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dépense Totale</p>
                  <p className="text-3xl font-black text-slate-900">{totalSpent.toFixed(2)}€</p>
               </div>
               <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-4">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><Check size={24}/></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interventions Terminées</p>
                  <p className="text-3xl font-black text-slate-900">{orders.filter(o => o.status === 'COMPLETED').length}</p>
               </div>
               <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl text-white space-y-4">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center"><Award size={24}/></div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Rang Fidélité</p>
                  <p className="text-3xl font-black">Platinum Member</p>
               </div>
            </div>

            {/* Next Intervention Highlight */}
            {nextIntervention ? (
               <div className="bg-blue-600 rounded-[60px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-4xl shadow-blue-600/20 animate-slideUp">
                  <div className="space-y-6">
                     <div className="inline-flex items-center gap-3 bg-white/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Clock size={14}/> Prochaine intervention
                     </div>
                     <h3 className="text-5xl font-black tracking-tighter leading-none">{nextIntervention.items[0].service.name}</h3>
                     <p className="text-2xl font-bold opacity-80">{nextIntervention.bookingDate} à {nextIntervention.bookingSlot}</p>
                  </div>
                  <div className="flex flex-col items-center gap-4 bg-white/10 p-8 rounded-[40px] border border-white/20">
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Technicien assigné</p>
                        <p className="text-xl font-black">Mickael Le Gall</p>
                     </div>
                     <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Consulter les détails</button>
                  </div>
               </div>
            ) : (
               <div className="bg-white p-20 rounded-[60px] border-4 border-dashed border-slate-100 text-center space-y-8">
                  <Calendar size={48} className="mx-auto text-slate-100" />
                  <div className="space-y-2">
                     <p className="text-2xl font-black text-slate-900">Aucune intervention prévue</p>
                     <p className="text-slate-400 font-medium max-w-sm mx-auto">Besoin d'un artisan breton ? Découvrez nos disponibilités de la semaine.</p>
                  </div>
                  <button onClick={() => navigate('/catalog')} className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all">Réserver un service</button>
               </div>
            )}
          </div>
        )}

        {activePortalTab === 'ORDERS' && (
          <div className="space-y-8">
            <header className="flex justify-between items-end">
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Historique des Interventions</h2>
               <div className="flex gap-4">
                  <button className="px-6 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Toutes</button>
                  <button className="px-6 py-2 bg-white text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">En cours</button>
               </div>
            </header>
            
            <div className="grid gap-6">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100 group relative overflow-hidden transition-all hover:shadow-2xl">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="space-y-6">
                         <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commande {order.id}</span>
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
                         </div>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{order.items[0].service.name}</h3>
                         <div className="flex flex-wrap gap-10 text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-600" /> {order.bookingDate}</div>
                            <div className="flex items-center gap-2"><Clock size={16} className="text-blue-600" /> {order.bookingSlot}</div>
                            <div className="flex items-center gap-2"><MapPin size={16} className="text-blue-600" /> {order.address.split(',')[0]}</div>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-6">
                         <p className="text-4xl font-black text-blue-600 tracking-tighter">{order.totalTTC.toFixed(2)}€</p>
                         <div className="flex gap-4">
                            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Download size={20} /></button>
                            {order.status === 'COMPLETED' && (
                               <button onClick={() => setIsReviewingId(order.id)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Laisser un avis</button>
                            )}
                            <button onClick={() => setSelectedOrderId(order.id)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><ChevronRight size={20} /></button>
                         </div>
                      </div>
                   </div>
                   
                   {/* Review Form Expansion */}
                   {isReviewingId === order.id && (
                     <div className="mt-10 p-10 bg-slate-50 rounded-[40px] border border-slate-200 animate-slideUp space-y-8">
                        <div className="flex justify-between items-center">
                           <h4 className="text-xl font-black">Votre avis compte énormément</h4>
                           <button onClick={() => setIsReviewingId(null)}><X size={24} /></button>
                        </div>
                        <div className="flex gap-4">
                           {[1, 2, 3, 4, 5].map(star => (
                             <button key={star} onClick={() => setReviewRating(star)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${reviewRating >= star ? 'bg-amber-400 text-white' : 'bg-white text-slate-200'}`}><Star size={24} fill={reviewRating >= star ? 'currentColor' : 'none'} /></button>
                           ))}
                        </div>
                        <textarea 
                          value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Comment s'est passée votre intervention ?" 
                          className="w-full p-8 rounded-3xl bg-white border-none focus:ring-4 focus:ring-blue-100 h-32 font-medium"
                        />
                        <button onClick={() => handleReview(order.items[0].service.id)} className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl">Publier mon avis</button>
                     </div>
                   )}
                </div>
              )) : <p className="text-center py-20 text-slate-400 font-bold">Aucune commande trouvée.</p>}
            </div>
          </div>
        )}

        {activePortalTab === 'MESSAGES' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-[700px]">
             {/* Tickets List */}
             <div className="bg-white rounded-[50px] border border-slate-100 p-8 space-y-6 overflow-y-auto">
                <h3 className="text-2xl font-black tracking-tighter">Support Client</h3>
                <div className="space-y-3">
                   {tickets.map(t => (
                      <button key={t.id} className="w-full p-6 bg-slate-50 rounded-[32px] border-2 border-blue-600 flex flex-col items-start gap-2 text-left">
                         <div className="flex justify-between w-full">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.id}</span>
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                         </div>
                         <p className="font-black text-slate-900 leading-tight">{t.subject}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dernier message : 10h22</p>
                      </button>
                   ))}
                   <button className="w-full py-6 border-4 border-dashed border-slate-100 rounded-[32px] text-slate-300 font-black uppercase text-[10px] tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all">Ouvrir un ticket</button>
                </div>
             </div>

             {/* Chat Interface */}
             <div className="lg:col-span-2 bg-white rounded-[50px] border border-slate-100 flex flex-col overflow-hidden shadow-sm">
                <header className="p-8 border-b border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center"><Award size={24}/></div>
                      <div>
                         <p className="font-black text-slate-900">Support Technique Artipol</p>
                         <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> En ligne</p>
                      </div>
                   </div>
                </header>
                <div className="flex-grow p-10 space-y-6 overflow-y-auto bg-slate-50/30">
                   {tickets[0].messages.map((m, i) => (
                      <div key={i} className={`flex ${m.sender === 'CLIENT' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] p-8 rounded-[32px] shadow-sm font-medium leading-relaxed ${m.sender === 'CLIENT' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                            {m.text}
                            <div className={`mt-2 text-[8px] font-black uppercase tracking-widest opacity-60 ${m.sender === 'CLIENT' ? 'text-right' : 'text-left'}`}>10:25</div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="p-8 border-t border-slate-50 flex gap-4">
                   <button className="p-6 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-100 transition-all"><Paperclip size={24}/></button>
                   <input 
                     type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)}
                     placeholder="Votre message..." 
                     className="flex-grow bg-slate-50 rounded-3xl px-8 border-none focus:ring-4 focus:ring-blue-100 font-medium" 
                   />
                   <button onClick={() => handleSendMsg(tickets[0].id)} className="p-6 bg-blue-600 text-white rounded-3xl shadow-xl hover:scale-105 transition-all"><Send size={24}/></button>
                </div>
             </div>
          </div>
        )}

        {activePortalTab === 'SECURITY' && (
          <div className="max-w-4xl space-y-16">
             <div className="bg-white p-12 rounded-[60px] border border-slate-100 space-y-12 shadow-sm">
                <h3 className="text-3xl font-black tracking-tighter flex items-center gap-4"><ShieldCheck className="text-blue-600" size={32}/> Données & Confidentialité</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><DownloadCloud size={24}/></div>
                      <h4 className="text-xl font-black">Exporter mes données</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Conformément au RGPD, téléchargez l'intégralité de vos informations personnelles et historique au format JSON.</p>
                      <button className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">Démarrer l'export</button>
                   </div>
                   <div className="p-10 bg-red-50 rounded-[40px] border border-red-100 space-y-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm"><Trash2 size={24}/></div>
                      <h4 className="text-xl font-black text-red-900">Supprimer mon compte</h4>
                      <p className="text-sm text-red-600/60 font-medium leading-relaxed">Cette action est irréversible. Toutes vos factures et votre historique seront définitivement supprimés.</p>
                      <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">Suppression définitive</button>
                   </div>
                </div>

                <div className="space-y-6 pt-12 border-t border-slate-50">
                   <h4 className="text-xl font-black">Sécurité du compte</h4>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-100">
                         <div>
                            <p className="font-black text-slate-900">Double Authentification (2FA)</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protégez votre compte avec votre téléphone</p>
                         </div>
                         <div className="w-14 h-8 bg-slate-200 rounded-full p-1 cursor-pointer">
                            <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-100">
                         <div>
                            <p className="font-black text-slate-900">Mot de passe</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dernière modification : il y a 3 mois</p>
                         </div>
                         <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Modifier</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Placeholder for Planning, Invoices following similar structure */}
        {(activePortalTab === 'PLANNING' || activePortalTab === 'INVOICES') && (
           <div className="bg-white p-24 rounded-[60px] border-4 border-dashed border-slate-100 text-center space-y-8">
              <History size={48} className="mx-auto text-slate-100" />
              <div className="space-y-2">
                 <p className="text-2xl font-black text-slate-900">Section en cours de synchronisation</p>
                 <p className="text-slate-400 font-medium">Votre agenda et vos documents sont générés en temps réel par notre moteur ServiCore.</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Portal;
