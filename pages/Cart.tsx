
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { 
  Trash2, MapPin, ArrowRight, ShoppingBag, Info, 
  Ticket as TicketIcon, CheckCircle, ChevronRight, Minus, Plus, Zap
} from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartItem, settings, applyCoupon, activeCoupon } = useApp();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [distance, setDistance] = useState(15);

  const calculateItemTotal = (item: any) => {
    const variantPrice = item.service.variants.find((v: any) => v.id === item.variantId)?.price || 0;
    const optionsPrice = item.selectedOptions.reduce((acc: number, optId: string) => {
      const opt = item.service.options.find((o: any) => o.id === optId);
      return acc + (opt?.price || 0);
    }, 0);
    return (item.service.basePrice + variantPrice + optionsPrice) * item.quantity;
  };

  const subtotal = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  const travelFees = distance * settings.pricePerKm;
  
  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'PERCENT') {
      discount = subtotal * (activeCoupon.value / 100);
    } else {
      discount = activeCoupon.value;
    }
  }

  const baseForTva = subtotal + travelFees - discount;
  const tvaAmount = baseForTva * (settings.tvaRateDefault / 100);
  const totalTTC = baseForTva + tvaAmount;

  const handleApplyCoupon = () => {
    const success = applyCoupon(couponCode);
    if (!success) {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 3000);
    } else {
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center space-y-10 animate-fadeIn">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
          <ShoppingBag size={56} />
        </div>
        <div className="space-y-4">
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Votre panier est vide</h2>
           <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">Parcourez notre catalogue d'artisans bretons pour commencer votre projet.</p>
        </div>
        <Link to="/catalog" className="inline-flex items-center gap-4 bg-slate-950 text-white px-12 py-6 rounded-[32px] font-black text-lg hover:bg-blue-600 transition-all shadow-3xl">
          Découvrir nos services <ArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-16">
      <div className="flex-grow space-y-8">
        <header className="flex justify-between items-end border-b border-slate-100 pb-10">
           <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900">Panier</h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> {cart.length} prestation(s) sélectionnée(s)</p>
           </div>
           <Link to="/catalog" className="text-blue-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all flex items-center gap-2">Continuer mes achats <ChevronRight size={14}/></Link>
        </header>

        <div className="space-y-6">
          {cart.map((item) => {
            const variant = item.service.variants.find(v => v.id === item.variantId);
            const selectedOptions = item.service.options.filter(o => item.selectedOptions.includes(o.id));
            const itemTotal = calculateItemTotal(item);

            return (
              <div key={item.id} className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 items-center group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors"></div>
                <img src={item.service.imageUrl} className="w-32 h-32 rounded-[32px] object-cover shrink-0 shadow-lg" alt={item.service.name} />
                <div className="flex-grow space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{item.service.name}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                     {variant && <span className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">{variant.name}</span>}
                     {selectedOptions.map(opt => <span key={opt.id} className="bg-blue-50 px-4 py-2 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">+{opt.name}</span>)}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                     <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-2">
                        <button onClick={() => updateCartItem(item.id, { quantity: Math.max(1, item.quantity - 1) })} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm hover:text-blue-600"><Minus size={14}/></button>
                        <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateCartItem(item.id, { quantity: item.quantity + 1 })} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm hover:text-blue-600"><Plus size={14}/></button>
                     </div>
                     <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors"><Trash2 size={20} /></button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{itemTotal.toFixed(2)}€</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Estimation HT</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Travel Fees Config */}
        <div className="bg-slate-50 p-12 rounded-[50px] border border-slate-100 space-y-6">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-[24px] shadow-lg flex items-center justify-center text-blue-600"><MapPin size={28}/></div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black text-slate-900 tracking-tighter">Calcul des frais kilométriques</h4>
                 <p className="text-xs text-slate-500 font-medium">Réglage basé sur la distance réelle depuis Saint-Brieuc.</p>
              </div>
           </div>
           <div className="flex items-center gap-10 bg-white p-8 rounded-[32px] border border-slate-100">
              <input 
                type="range" min="0" max="100" 
                value={distance} onChange={(e) => setDistance(Number(e.target.value))} 
                className="flex-grow h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex items-baseline gap-2 shrink-0">
                 <span className="text-4xl font-black text-slate-900">{distance}</span>
                 <span className="text-sm font-black text-slate-400 uppercase">KM</span>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="text-right">
                 <p className="font-black text-blue-600">+{travelFees.toFixed(2)}€</p>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Frais logistiques</p>
              </div>
           </div>
        </div>
      </div>

      <aside className="w-full lg:w-[450px] shrink-0">
        <div className="bg-white p-12 rounded-[60px] shadow-4xl border border-slate-100 sticky top-32 space-y-10">
          <div className="space-y-6">
             <h3 className="text-2xl font-black tracking-tighter">Récapitulatif</h3>
             <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-slate-500">
                   <span>Prestations</span>
                   <span className="text-slate-900">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                   <span>Déplacement</span>
                   <span className="text-slate-900">+{travelFees.toFixed(2)}€</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-sm font-black text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
                     <span className="flex items-center gap-2"><TicketIcon size={14}/> Coupon {activeCoupon.code}</span>
                     <span>-{discount.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-500 pt-4 border-t border-slate-50">
                   <span>TVA ({settings.tvaRateDefault}%)</span>
                   <span className="text-slate-900">+{tvaAmount.toFixed(2)}€</span>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[28px] border border-slate-100">
                <input 
                  type="text" 
                  placeholder="CODE PROMO" 
                  value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-grow bg-transparent border-none px-6 py-4 font-black uppercase text-xs tracking-widest focus:ring-0 outline-none"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="bg-slate-900 text-white px-8 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
                >
                  Appliquer
                </button>
             </div>
             {couponError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest px-6">Code invalide ou expiré</p>}
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-10">
             <div className="flex items-end justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total à régler</p>
                   <p className="text-6xl font-black text-blue-600 tracking-tighter leading-none">{totalTTC.toFixed(0)}<span className="text-3xl font-black">€</span></p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 justify-end"><Info size={12}/> Net à payer TTC</p>
                </div>
             </div>

             <button 
               onClick={() => navigate('/checkout')}
               className="w-full bg-slate-950 text-white py-10 rounded-[40px] font-black text-xl flex items-center justify-center gap-6 hover:bg-blue-600 shadow-4xl shadow-blue-500/20 transition-all group"
             >
               Finaliser la commande <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </button>

             <div className="flex flex-col gap-4 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Ou payez en 3x par carte bancaire</p>
                <div className="flex justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                   <div className="font-black text-xl tracking-tighter">VISA</div>
                   <div className="font-black text-xl tracking-tighter">MC</div>
                   <div className="font-black text-xl tracking-tighter">Pay</div>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Cart;
