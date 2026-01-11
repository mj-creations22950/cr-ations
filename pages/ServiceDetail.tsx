
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { 
  ChevronRight, ShieldCheck, CheckCircle2, ShoppingCart, 
  Calendar, Info, Wrench, Package, Zap, Download, FileText, 
  XCircle, CheckCircle, ArrowRight
} from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const { services, addToCart } = useApp();
  const navigate = useNavigate();
  const service = services.find(s => s.id === id);

  const [pricingType, setPricingType] = useState<'LABOR_ONLY' | 'FULL'>('LABOR_ONLY');
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(service?.variants[0]?.id);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'INFO' | 'INCLUS' | 'DOCS'>('INFO');

  if (!service) return <div className="p-20 text-center font-black">Prestation introuvable.</div>;

  const currentVariant = service.variants.find(v => v.id === selectedVariantId);
  const optionsPrice = selectedOptions.reduce((acc, optId) => acc + (service.options.find(o => o.id === optId)?.price || 0), 0);
  const totalPrice = (service.basePrice + (currentVariant?.price || 0) + optionsPrice);

  const handleAddToCart = () => {
    // Add dummy id to satisfy CartItem interface; store.addToCart generates a unique ID during processing
    addToCart({
      id: '',
      service,
      variantId: selectedVariantId,
      selectedOptions,
      quantity: 1,
      pricingType
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Breadcrumb Pro */}
      <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-16">
        <button onClick={() => navigate('/catalog')} className="hover:text-blue-600 transition-colors">Catalogue</button>
        <ChevronRight size={10} />
        <span className="text-slate-900">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Left Column: Visuals & Structured Info */}
        <div className="space-y-16 animate-fadeIn">
          <div className="group relative rounded-[64px] overflow-hidden shadow-4xl bg-slate-200 aspect-[4/3]">
             <img src={service.imageUrl} className="w-full h-full object-cover" alt={service.name} />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-16">
                <div className="flex gap-2 mb-6">
                   {service.tags.map(t => <span key={t} className="bg-white/10 backdrop-blur-xl border border-white/10 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{t}</span>)}
                </div>
                <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9]">{service.name}</h1>
             </div>
          </div>

          <div className="bg-white rounded-[50px] border border-slate-100 p-4 flex gap-4">
             {['INFO', 'INCLUS', 'DOCS'].map((tab) => (
               <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)}
                className={`flex-grow py-5 rounded-[32px] font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-950 text-white shadow-2xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900'}`}
               >
                 {tab === 'INFO' ? 'Expertise' : tab === 'INCLUS' ? 'Détails Forfait' : 'Documents'}
               </button>
             ))}
          </div>

          <div className="space-y-10 min-h-[400px]">
            {activeTab === 'INFO' && (
              <div className="space-y-8 animate-fadeIn">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Déroulement de l'intervention</h3>
                 <p className="text-slate-500 font-medium text-lg leading-relaxed">{service.fullDescription}</p>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100">
                       <Wrench className="text-blue-600 mb-6" size={32} />
                       <h4 className="font-black text-lg mb-2">Savoir-faire</h4>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pose certifiée RGE</p>
                    </div>
                    <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100">
                       <ShieldCheck className="text-blue-600 mb-6" size={32} />
                       <h4 className="font-black text-lg mb-2">Garantie</h4>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Décennale AXA incluse</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'INCLUS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn">
                 <div className="space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3 text-green-600 uppercase tracking-widest text-[10px] bg-green-50 px-6 py-3 rounded-full w-fit">
                       <CheckCircle size={14}/> Ce qui est inclus
                    </h3>
                    <ul className="space-y-4">
                       {service.included.map((item, i) => (
                         <li key={i} className="flex items-start gap-4 text-slate-700 font-bold text-sm bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
                            <span className="text-green-500 mt-0.5"><CheckCircle2 size={18}/></span>
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3 text-red-600 uppercase tracking-widest text-[10px] bg-red-50 px-6 py-3 rounded-full w-fit">
                       <XCircle size={14}/> Ce qui n'est pas inclus
                    </h3>
                    <ul className="space-y-4">
                       {service.excluded.map((item, i) => (
                         <li key={i} className="flex items-start gap-4 text-slate-400 font-bold text-sm bg-slate-50 p-6 rounded-[28px] border border-slate-100 italic">
                            <span className="text-red-400 mt-0.5"><XCircle size={18}/></span>
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
            )}

            {activeTab === 'DOCS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                 {service.pdfs?.map(pdf => (
                   <a key={pdf.id} href={pdf.url} className="group bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-600 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><FileText size={24}/></div>
                        <div>
                           <p className="font-black text-slate-900">{pdf.label}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document PDF • 1.2 MB</p>
                        </div>
                      </div>
                      <Download size={20} className="text-slate-300 group-hover:text-blue-600" />
                   </a>
                 ))}
                 {(!service.pdfs || service.pdfs.length === 0) && (
                   <p className="col-span-2 text-center py-20 text-slate-400 font-bold">Aucun document spécifique pour cette prestation.</p>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Config & Price Stickiness */}
        <div className="lg:sticky lg:top-32 space-y-8">
          <div className="bg-white rounded-[60px] shadow-4xl border border-slate-100 p-12 space-y-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
               <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
            </div>

            <div className="space-y-8">
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Personnalisation du forfait</h3>
               
               <div className="bg-slate-50 p-2 rounded-[32px] flex gap-2 border border-slate-100">
                  <button onClick={() => setPricingType('LABOR_ONLY')} className={`flex-grow py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${pricingType === 'LABOR_ONLY' ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/10' : 'text-slate-400 hover:text-slate-600'}`}>Pose seule</button>
                  <button onClick={() => setPricingType('FULL')} className={`flex-grow py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${pricingType === 'FULL' ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/10' : 'text-slate-400 hover:text-slate-600'}`}>Fourniture & Pose</button>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Configuration technique</p>
                  <div className="space-y-3">
                     {service.variants.map(v => (
                       <button key={v.id} onClick={() => setSelectedVariantId(v.id)} className={`w-full p-8 rounded-[32px] border-2 text-left flex justify-between items-center transition-all ${selectedVariantId === v.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200'}`}>
                          <div>
                             <span className={`font-black text-lg block ${selectedVariantId === v.id ? 'text-blue-600' : 'text-slate-600'}`}>{v.name}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inclus main d'œuvre expert</span>
                          </div>
                          <span className="text-lg font-black text-slate-900">+{v.price}€</span>
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Options de confort</p>
                  <div className="grid gap-3">
                     {service.options.map(opt => (
                       <label key={opt.id} className={`flex items-center justify-between p-8 rounded-[32px] border-2 cursor-pointer transition-all ${selectedOptions.includes(opt.id) ? 'border-blue-600 bg-blue-50/50 shadow-lg' : 'border-slate-50 hover:border-slate-100'}`}>
                          <div className="flex items-center gap-6">
                             <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedOptions.includes(opt.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                                {selectedOptions.includes(opt.id) && <CheckCircle size={16} className="text-white"/>}
                             </div>
                             <input type="checkbox" className="hidden" checked={selectedOptions.includes(opt.id)} onChange={() => setSelectedOptions(prev => prev.includes(opt.id) ? prev.filter(i => i !== opt.id) : [...prev, opt.id])} />
                             <div>
                                <span className="font-black text-slate-700 block">{opt.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{opt.description}</span>
                             </div>
                          </div>
                          <span className="text-sm font-black text-slate-900">+{opt.price}€</span>
                       </label>
                     ))}
                  </div>
               </div>
            </div>

            <div className="pt-12 border-t border-slate-100 space-y-10">
               <div className="flex items-end justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimation Immédiate TTC</p>
                     <div className="flex items-baseline gap-2">
                        <p className="text-7xl font-black text-blue-600 tracking-tighter leading-none">{totalPrice.toFixed(0)}</p>
                        <p className="text-3xl font-black text-blue-600">€</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><Info size={12}/> Devis garanti 30j</div>
                  </div>
               </div>

               <button onClick={handleAddToCart} className="w-full bg-slate-950 text-white py-10 rounded-[40px] font-black text-xl flex items-center justify-center gap-6 hover:bg-blue-600 shadow-4xl shadow-blue-500/20 transition-all group">
                 Ajouter au panier <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </button>

               <div className="flex justify-center gap-10">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Zap size={14} className="text-blue-500"/> Réservation 22</div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={14} className="text-blue-500"/> Paiement Sécurisé</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
