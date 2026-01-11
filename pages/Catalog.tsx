
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../store';
import { 
  Search, Filter, SlidersHorizontal, ChevronRight, TrendingUp, 
  Layers, Check, X, AlertCircle, Info, Star, Clock, Grid, List
} from 'lucide-react';

const Catalog: React.FC = () => {
  const { services, categories, compareList, toggleCompare } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState<'ASC' | 'DESC' | 'NONE'>('NONE');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [priceRange, setPriceRange] = useState<number>(500);

  const selectedCat = searchParams.get('cat') || 'all';

  const filteredServices = useMemo(() => {
    let result = services.filter(s => 
      s.active && 
      (selectedCat === 'all' || s.categoryId === selectedCat) &&
      s.basePrice <= priceRange
    );
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower));
    }
    
    if (priceSort === 'ASC') result.sort((a, b) => a.basePrice - b.basePrice);
    if (priceSort === 'DESC') result.sort((a, b) => b.basePrice - a.basePrice);
    
    return result;
  }, [services, selectedCat, searchTerm, priceSort, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Compare Drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-white shadow-3xl border border-slate-200 rounded-[32px] px-8 py-5 flex items-center gap-10 animate-slideUp">
           <div className="flex gap-4">
              {compareList.map(s => (
                <div key={s.id} className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-100 group">
                  <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.name} />
                  <button onClick={() => toggleCompare(s)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={16} />
                  </button>
                </div>
              ))}
           </div>
           <div className="h-10 w-px bg-slate-200"></div>
           <button 
             onClick={() => setIsCompareOpen(true)}
             className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20"
           >
             Comparer ({compareList.length})
           </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 space-y-10 shrink-0">
          <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-widest text-[10px]">
              <Filter size={18} className="text-blue-600" /> Catégories
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setSearchParams({ cat: 'all' })}
                className={`w-full text-left px-6 py-4 rounded-[20px] transition-all text-sm font-bold flex items-center gap-4 ${selectedCat === 'all' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <span>🚀</span> Tout voir
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSearchParams({ cat: cat.id })}
                  className={`w-full text-left px-6 py-4 rounded-[20px] transition-all text-sm font-bold flex items-center justify-between ${selectedCat === cat.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'hover:bg-slate-50 text-slate-500'}`}
                >
                  <span className="flex items-center gap-4"><span>{cat.icon}</span> {cat.name}</span>
                  <ChevronRight size={14} className={selectedCat === cat.id ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-10">
             <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest text-[10px]">
              <SlidersHorizontal size={18} className="text-blue-600" /> Affinage
            </h3>
            
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Prix max : {priceRange}€</label>
               <input 
                 type="range" min="0" max="1000" step="10" 
                 value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))}
                 className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
               />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Trier par</label>
               <div className="grid gap-2">
                 <button onClick={() => setPriceSort('ASC')} className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${priceSort === 'ASC' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>Prix ↗</button>
                 <button onClick={() => setPriceSort('DESC')} className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${priceSort === 'DESC' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>Prix ↘</button>
               </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text" 
                placeholder="Rechercher une prestation..."
                className="w-full pl-16 pr-8 py-6 bg-white border border-slate-200 rounded-[40px] focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm font-medium text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] border border-slate-100">
               <button onClick={() => setViewMode('GRID')} className={`p-4 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-300 hover:text-slate-600'}`}><Grid size={20}/></button>
               <button onClick={() => setViewMode('LIST')} className={`p-4 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-300 hover:text-slate-600'}`}><List size={20}/></button>
            </div>
          </div>

          <div className={viewMode === 'GRID' ? "grid grid-cols-1 md:grid-cols-2 gap-12" : "flex flex-col gap-6"}>
            {filteredServices.map(service => {
              const isComparing = compareList.some(s => s.id === service.id);
              return (
                <div 
                  key={service.id} 
                  className={`group bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-xl hover:shadow-3xl transition-all duration-500 flex ${viewMode === 'GRID' ? 'flex-col' : 'flex-row'}`}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'GRID' ? 'h-72' : 'w-80 h-auto'}`}>
                    <img src={service.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={service.name} />
                    {service.badge && (
                       <span className="absolute top-8 left-8 bg-blue-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                          {service.badge === 'POPULAR' ? '🔥 Populaire' : service.badge === 'NEW' ? '✨ Nouveau' : '🎁 Promo'}
                       </span>
                    )}
                    <button 
                      onClick={() => toggleCompare(service)}
                      className={`absolute top-8 right-8 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-xl ${isComparing ? 'bg-blue-600 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                    >
                      <Layers size={20} />
                    </button>
                  </div>

                  <div className="p-10 space-y-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tighter">{service.name}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed line-clamp-2 text-sm">{service.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg"><Clock size={12}/> {service.duration} min</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg"><Check size={12}/> Inclus : {service.included.length} points</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">À partir de</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">{service.basePrice}€</span>
                      </div>
                      <Link to={`/service/${service.id}`} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                        Voir la fiche
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] p-10 md:p-24 overflow-y-auto">
           <button onClick={() => setIsCompareOpen(false)} className="absolute top-12 right-12 text-white hover:text-blue-400 transition-colors"><X size={48} /></button>
           <div className="max-w-7xl mx-auto space-y-20 animate-fadeIn">
              <div className="text-center space-y-6">
                 <h2 className="text-6xl font-black text-white tracking-tighter">Comparateur Expert</h2>
                 <p className="text-slate-400 text-xl font-medium">Analyse comparative des forfaits d'intervention.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {compareList.map(s => (
                   <div key={s.id} className="bg-white rounded-[60px] p-12 space-y-12 shadow-4xl relative group">
                      <div className="h-40 overflow-hidden rounded-[32px]">
                        <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.name} />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">{s.name}</h3>
                         <div className="text-5xl font-black text-blue-600 tracking-tighter">{s.basePrice}€ <span className="text-sm text-slate-400">TTC</span></div>
                      </div>
                      <div className="space-y-6 border-t border-slate-100 pt-10">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points d'intervention :</p>
                         <ul className="space-y-4">
                            {s.included.slice(0, 4).map((pt, i) => (
                              <li key={i} className="flex items-start gap-4 text-slate-600 font-bold text-sm">
                                <div className="mt-1 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0"><Check size={12}/></div>
                                {pt}
                              </li>
                            ))}
                         </ul>
                      </div>
                      <Link to={`/service/${s.id}`} className="block w-full text-center bg-slate-950 text-white py-7 rounded-[32px] font-black text-lg hover:bg-blue-600 transition-all shadow-2xl">Choisir ce forfait</Link>
                   </div>
                 ))}
                 {compareList.length < 3 && (
                    <div className="bg-white/5 border-4 border-dashed border-white/10 rounded-[60px] flex flex-col items-center justify-center p-12 text-center space-y-6">
                       <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20"><Info size={40}/></div>
                       <p className="text-white/40 font-black uppercase text-xs tracking-widest leading-loose">Ajoutez d'autres prestations<br/>pour comparer l'expertise</p>
                       <button onClick={() => setIsCompareOpen(false)} className="text-blue-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">Retour au catalogue</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
