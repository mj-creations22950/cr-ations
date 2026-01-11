
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { 
  CreditCard, Calendar, MapPin, CheckCircle, ShieldCheck, Apple, 
  Loader2, Info, ChevronRight, Zap, Shield, AlertCircle, Clock, ArrowRight
} from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, clearCart, addOrder, addTransaction, updateTransactionStatus, user, settings, activeCoupon } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(user?.address || '');
  const [distance, setDistance] = useState(15);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'SPLIT' | 'DEFERRED'>('CARD');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeInsurance, setIncludeInsurance] = useState(false);

  const subtotalHT = cart.reduce((acc, item) => {
    const vPrice = item.service.variants.find(v => v.id === item.variantId)?.price || 0;
    const oPrice = item.service.options.filter(o => item.selectedOptions.includes(o.id)).reduce((ap, op) => ap + op.price, 0);
    return acc + (item.service.basePrice + vPrice + oPrice) * item.quantity;
  }, 0);

  const travelFees = distance * settings.pricePerKm;
  
  // Calculate discount
  let discount = 0;
  if (activeCoupon) {
    discount = activeCoupon.discountType === 'PERCENT' ? subtotalHT * (activeCoupon.value / 100) : activeCoupon.value;
  }

  // Surcharge based on date (simple mock: Sundays are +Weekend surcharge)
  const isWeekend = selectedDate ? new Date(selectedDate).getDay() % 6 === 0 : false;
  const surcharge = isWeekend ? settings.surchargeWeekend : 0;
  
  const insuranceAmount = includeInsurance ? (subtotalHT + travelFees) * settings.insuranceRate : 0;
  const tvaAmount = (subtotalHT + travelFees + surcharge + insuranceAmount - discount) * (settings.tvaRateDefault / 100);
  const totalTTC = subtotalHT + travelFees + surcharge + insuranceAmount - discount + tvaAmount;

  const installments = totalTTC / 3;
  const slots = ['08:30', '10:30', '14:00', '16:00'];

  // Min date for anticipation (J+2)
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  const handleFinalize = async () => {
    if (!user) { navigate('/login'); return; }
    setIsProcessing(true);
    
    const orderId = `ART-${Math.floor(Math.random() * 999999)}`;
    const txId = `TX-${Date.now()}`;

    addTransaction({
      id: txId, orderId, amount: totalTTC, method: paymentMethod,
      status: 'PROCESSING', userName: user.name, timestamp: new Date().toISOString()
    });

    await new Promise(resolve => setTimeout(resolve, 4000));
    updateTransactionStatus(txId, 'SUCCESS');
    
    addOrder({
      id: orderId, userId: user.id, items: cart, subtotalHT, tvaAmount, 
      tvaRate: settings.tvaRateDefault, travelFees, surchargeAmount: surcharge,
      discountAmount: discount, couponUsed: activeCoupon?.code, insuranceAmount, totalTTC,
      status: 'PAID', createdAt: new Date().toISOString(),
      paymentMethod, bookingDate: selectedDate, bookingSlot: selectedSlot, address
    });

    setIsProcessing(false);
    setStep(4);
    setTimeout(() => { clearCart(); navigate('/portal'); }, 5000);
  };

  if (step === 4) return (
    <div className="max-w-4xl mx-auto py-40 text-center space-y-12 animate-fadeIn">
      <div className="w-40 h-40 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-4xl animate-bounce">
         <CheckCircle size={80} className="text-white" />
      </div>
      <div className="space-y-6">
        <h2 className="text-7xl font-black text-slate-900 tracking-tighter">Commande Confirmée !</h2>
        <p className="text-slate-400 text-2xl font-medium max-w-xl mx-auto leading-relaxed">Merci pour votre confiance. Votre artisan breton interviendra le {selectedDate} à {selectedSlot}.</p>
      </div>
      <div className="flex justify-center gap-4">
         <button onClick={() => navigate('/portal')} className="bg-slate-950 text-white px-16 py-7 rounded-[32px] font-black text-xl shadow-3xl hover:bg-blue-600 transition-all flex items-center gap-4">Accéder à mon espace <ChevronRight /></button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-20">
      <div className="flex-grow space-y-12">
        <div className="flex items-center gap-10">
           {[1, 2, 3].map(s => (
             <div key={s} className={`flex items-center gap-6 transition-all ${step >= s ? 'text-blue-600' : 'text-slate-200'}`}>
                <div className={`w-16 h-16 rounded-[24px] border-4 flex items-center justify-center font-black text-2xl ${step >= s ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}>{s}</div>
                <div className="hidden md:block">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">{s === 1 ? 'Planning' : s === 2 ? 'Lieu & Options' : 'Paiement'}</p>
                   <p className="text-xs font-bold text-slate-400">{s === 1 ? 'Choisir un créneau' : s === 2 ? 'Détails techniques' : 'Récapitulatif'}</p>
                </div>
                {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-slate-100'} rounded-full`}></div>}
             </div>
           ))}
        </div>

        {step === 1 && (
          <div className="bg-white p-16 rounded-[60px] shadow-3xl border border-slate-100 space-y-16 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10">
               <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter flex items-center gap-6"><Calendar className="text-blue-600" size={48} /> Agenda Artipol</h2>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed">Les créneaux sont synchronisés en temps réel avec nos artisans locaux.</p>
               </div>
               <div className="bg-blue-50 px-8 py-4 rounded-[24px] border border-blue-100 flex items-center gap-4">
                  <Clock className="text-blue-600" />
                  <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Anticipation : J+2 obligatoire</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">Sélectionner une date</label>
                  <input 
                    type="date" min={minDate}
                    className="w-full p-10 bg-slate-50 rounded-[40px] border-none font-black text-3xl text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none shadow-inner" 
                    value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} 
                  />
                  {isWeekend && (
                    <div className="bg-amber-50 p-6 rounded-[28px] border border-amber-100 flex items-start gap-4">
                       <AlertCircle className="text-amber-600 shrink-0" size={20} />
                       <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-relaxed">Majoration Weekend (+{settings.surchargeWeekend}€) appliquée automatiquement.</p>
                    </div>
                  )}
               </div>
               <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">Créneaux d'arrivée</label>
                  <div className="grid grid-cols-2 gap-4">
                     {slots.map(s => (
                       <button key={s} onClick={() => setSelectedSlot(s)} className={`p-10 rounded-[32px] font-black text-2xl border-4 transition-all ${selectedSlot === s ? 'bg-blue-600 text-white border-blue-600 shadow-3xl' : 'bg-white border-slate-100 text-slate-300 hover:border-blue-200'}`}>{s}</button>
                     ))}
                  </div>
               </div>
            </div>
            <button disabled={!selectedDate || !selectedSlot} onClick={() => setStep(2)} className="w-full bg-slate-950 text-white py-10 rounded-[40px] font-black text-2xl hover:bg-blue-600 transition-all disabled:opacity-20 shadow-4xl flex items-center justify-center gap-6">Étape Suivante <ArrowRight size={28} /></button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-16 rounded-[60px] shadow-3xl border border-slate-100 space-y-16 animate-fadeIn">
            <h2 className="text-5xl font-black tracking-tighter flex items-center gap-6"><MapPin className="text-blue-600" size={48} /> Lieu d'intervention</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">Coordonnées exactes</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rue, Bâtiment, Code d'accès, Étage..." className="w-full p-10 bg-slate-50 rounded-[40px] border-none h-60 font-black text-xl text-slate-700 shadow-inner" />
               </div>
               <div className="space-y-10">
                  <div className="bg-blue-50 p-10 rounded-[40px] border border-blue-100 space-y-6">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg"><Shield size={28} /></div>
                        <h4 className="text-2xl font-black text-blue-950">Garantie Excellence Artipol</h4>
                     </div>
                     <p className="text-sm font-medium text-blue-800 leading-relaxed">Protégez votre installation avec une extension de garantie décennale "Premium" couvrant tous les vices cachés pendant 12 ans.</p>
                     <label className="flex items-center gap-6 cursor-pointer group bg-white p-6 rounded-3xl border border-blue-100">
                        <div className={`w-10 h-10 rounded-xl border-4 flex items-center justify-center transition-all ${includeInsurance ? 'bg-blue-600 border-blue-600' : 'border-slate-100 group-hover:border-blue-300'}`}>
                           {includeInsurance && <CheckCircle size={20} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={includeInsurance} onChange={() => setIncludeInsurance(!includeInsurance)} />
                        <div className="flex-grow">
                           <p className="font-black text-slate-900">Activer l'extension (+{settings.insuranceRate * 100}%)</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protection complète par AXA</p>
                        </div>
                     </label>
                  </div>
               </div>
            </div>
            <div className="flex gap-10">
              <button onClick={() => setStep(1)} className="w-1/3 py-10 bg-slate-100 rounded-[40px] font-black text-xl hover:bg-slate-200 transition-all">Retour</button>
              <button disabled={!address} onClick={() => setStep(3)} className="flex-grow py-10 bg-slate-950 text-white rounded-[40px] font-black text-2xl hover:bg-blue-600 transition-all shadow-4xl">Valider & Payer</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-16 rounded-[60px] shadow-3xl border border-slate-100 space-y-16 animate-fadeIn">
            <h2 className="text-5xl font-black tracking-tighter flex items-center gap-6"><CreditCard className="text-blue-600" size={48} /> Paiement Sécurisé</h2>
            <div className="grid gap-6">
               {[
                 { id: 'CARD', label: 'Carte Bancaire / Apple Pay', sub: 'Règlement total immédiat', icon: CreditCard, promo: null },
                 { id: 'SPLIT', label: 'Paiement en 3x sans frais', sub: `3 mensualités de ${installments.toFixed(2)}€`, icon: Zap, promo: '0% de frais' },
                 { id: 'DEFERRED', label: 'Paiement Différé', sub: 'Validez après l\'intervention', icon: ShieldCheck, promo: 'Sécurité totale' }
               ].map(m => (
                 <button key={m.id} onClick={() => setPaymentMethod(m.id as any)} className={`p-10 rounded-[48px] border-4 flex items-center justify-between text-left transition-all relative group ${paymentMethod === m.id ? 'border-blue-600 bg-blue-50/50 shadow-2xl scale-[1.02]' : 'border-slate-50 hover:border-blue-100 hover:scale-[1.01]'}`}>
                    <div className="flex items-center gap-10">
                       <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center ${paymentMethod === m.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-100 text-slate-400'}`}><m.icon size={36} /></div>
                       <div>
                          <p className="font-black text-slate-900 text-2xl tracking-tighter">{m.label}</p>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{m.sub}</p>
                       </div>
                    </div>
                    {m.promo && <span className="absolute top-8 right-16 bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl animate-pulse">{m.promo}</span>}
                    {paymentMethod === m.id && <CheckCircle className="text-blue-600" size={32} />}
                 </button>
               ))}
            </div>
            <div className="pt-10 space-y-10">
               <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 flex items-center gap-8">
                  <ShieldCheck size={40} className="text-green-500" />
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">Vos données bancaires sont traitées de manière chiffrée par nos partenaires certifiés PCI-DSS. Aucun stockage n'est effectué sur nos serveurs.</p>
               </div>
               <button onClick={handleFinalize} disabled={isProcessing} className="w-full bg-blue-600 text-white py-12 rounded-[48px] font-black text-3xl shadow-4xl flex items-center justify-center gap-8 hover:bg-slate-950 transition-all">
                 {isProcessing ? <Loader2 className="animate-spin" size={48} /> : <>Confirmer le règlement de {totalTTC.toFixed(2)}€</>}
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Side Summary */}
      <div className="w-full lg:w-[500px] shrink-0">
         <div className="bg-white p-12 rounded-[60px] shadow-4xl border border-slate-100 sticky top-32 space-y-12">
            <h3 className="text-3xl font-black tracking-tighter">Votre Intervention</h3>
            
            <div className="space-y-6">
               {cart.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-start gap-10">
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 text-lg leading-tight">{item.service.name}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.quantity}x • {item.pricingType === 'FULL' ? 'Fourniture & Pose' : 'Pose seule'}</p>
                    </div>
                    <p className="font-black text-slate-900 text-lg">{(item.service.basePrice * item.quantity).toFixed(2)}€</p>
                 </div>
               ))}
            </div>

            <div className="pt-10 border-t border-slate-100 space-y-6">
               <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest"><span>Déplacement ({distance}km)</span><span className="text-slate-900">+{travelFees.toFixed(2)}€</span></div>
               {surcharge > 0 && <div className="flex justify-between text-sm font-black text-amber-600 uppercase tracking-widest"><span>Majoration Weekend</span><span>+{surcharge.toFixed(2)}€</span></div>}
               {discount > 0 && <div className="flex justify-between text-sm font-black text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100 uppercase tracking-widest"><span>Coupon {activeCoupon?.code}</span><span>-{discount.toFixed(2)}€</span></div>}
               {includeInsurance && <div className="flex justify-between text-sm font-black text-blue-600 uppercase tracking-widest"><span>Garantie Excellence</span><span>+{insuranceAmount.toFixed(2)}€</span></div>}
               <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest"><span>TVA ({settings.tvaRateDefault}%)</span><span className="text-slate-900">+{tvaAmount.toFixed(2)}€</span></div>
               
               <div className="pt-10 flex flex-col items-end">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Net à Payer</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-7xl font-black text-blue-600 tracking-tighter leading-none">{totalTTC.toFixed(0)}</span>
                     <span className="text-3xl font-black text-blue-600">€</span>
                  </div>
               </div>
            </div>

            {selectedDate && (
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex items-center gap-6">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Calendar size={28} /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendez-vous confirmé</p>
                    <p className="font-black text-slate-900 text-lg">{selectedDate} à {selectedSlot}</p>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Checkout;
