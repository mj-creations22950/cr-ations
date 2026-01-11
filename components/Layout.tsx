
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { ShoppingBag, User, LogOut, Settings, LayoutDashboard, MapPin } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, cart, settings } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Local Bar */}
      <div className="bg-slate-950 text-white py-2 px-4 text-[10px] font-black uppercase tracking-widest">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-500" /> {settings.region}</span>
            <span>{settings.contactPhone}</span>
          </div>
          <div className="hidden md:flex gap-6">
            <span>Devis Gratuit</span>
            <span>Artisans Locaux</span>
          </div>
        </div>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
            <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-blue-500/20">A</div>
            {settings.logo}
          </Link>

          <nav className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
            <Link to="/catalog" className="hover:text-blue-600 transition-colors">Nos Prestations</Link>
            <Link to="/portfolio" className="hover:text-blue-600 transition-colors">Réalisations</Link>
            <Link to="/blog" className="hover:text-blue-600 transition-colors">Conseils</Link>
            <Link to="/faq" className="hover:text-blue-600 transition-colors">Aide</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-3 bg-slate-50 rounded-2xl text-slate-600 hover:text-blue-600 transition-all hover:shadow-inner">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/portal" className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform" title="Mon Espace Client">
                  <User size={18} />
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform" title="Admin">
                    <Settings size={18} />
                  </Link>
                )}
                <button onClick={handleLogout} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                Se Connecter
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-6">
            <h3 className="text-white text-2xl font-black tracking-tighter">{settings.companyName}</h3>
            <p className="text-sm leading-relaxed">Plateforme de mise en relation et de réservation d'artisans locaux en Côtes d'Armor. Qualité, proximité et confiance.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10"></div>
              <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10"></div>
              <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10"></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-8">Métiers</h4>
            <ul className="text-sm space-y-4 font-bold">
              <li><Link to="/catalog?cat=1" className="hover:text-blue-500 transition-colors">Plomberie & Chauffage</Link></li>
              <li><Link to="/catalog?cat=2" className="hover:text-blue-600 transition-colors">Électricité Générale</Link></li>
              <li><Link to="/catalog?cat=3" className="hover:text-blue-600 transition-colors">Rénovation Intérieure</Link></li>
              <li><Link to="/catalog" className="hover:text-blue-600 transition-colors">Toutes nos prestations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-8">Le Réseau</h4>
            <ul className="text-sm space-y-4 font-bold">
              <li><Link to="/portfolio" className="hover:text-blue-600 transition-colors">Portfolio Réalisations</Link></li>
              <li><Link to="/mentions-legales" className="hover:text-blue-600 transition-colors">Mentions Légales</Link></li>
              <li><Link to="/cgv" className="hover:text-blue-600 transition-colors">Conditions (CGV)</Link></li>
              <li><Link to="/rgpd" className="hover:text-blue-600 transition-colors">Données Personnelles</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-8">Contact Direct</h4>
            <div className="space-y-2">
              <p className="text-white font-black">{settings.contactEmail}</p>
              <p className="text-blue-500 text-2xl font-black">{settings.contactPhone}</p>
            </div>
            <p className="text-xs">{settings.baseCity}, {settings.region} (22)</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-12 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} {settings.logo} BRETAGNE. Propulsé par la technologie ServiCore.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
