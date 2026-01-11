
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { 
  ArrowRight, Star, Shield, Clock, Award, Zap, 
  MessageCircle, Phone, Smartphone, ShieldCheck, ChevronRight,
  Construction, MapPin
} from 'lucide-react';

const Home: React.FC = () => {
  const { settings, services, reviews, cmsPages } = useApp();
  // Ensure blocks are rendered in the order set in admin
  const activeBlocks = settings.homeBlocks.filter(b => b.enabled);

  return (
    <div className="flex flex-col">
      {activeBlocks.map((block) => {
        switch (block.type) {
          case 'HERO': return <HeroBlock key={block.id} config={block} settings={settings} />;
          case 'SERVICES': return <ServicesBlock key={block.id} config={block} services={services} settings={settings} />;
          case 'URGENCY': return <UrgencyBlock key={block.id} config={block} />;
          case 'PROMO': return <PromoBlock key={block.id} config={block} settings={settings} />;
          case 'PROJECTS': return <ProjectsBlock key={block.id} config={block} />;
          case 'REVIEWS': return <ReviewsBlock key={block.id} config={block} reviews={reviews} />;
          case 'WHY_US': return <WhyUsBlock key={block.id} config={block} settings={settings} />;
          case 'CTA': return <CTABlock key={block.id} config={block} settings={settings} />;
          case 'BLOG': return <BlogBlock key={block.id} config={block} pages={cmsPages} />;
          case 'SECURITY': return <SecurityBlock key={block.id} config={block} />;
          case 'PARTNERS': return <PartnersBlock key={block.id} config={block} />;
          default: return null;
        }
      })}
      
      {/* Floating Fast Contact */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4">
         <button className="bg-[#25D366] text-white p-4 rounded-full shadow-3xl hover:scale-110 transition-transform"><MessageCircle size={28} /></button>
         <button className="bg-blue-600 text-white p-4 rounded-full shadow-3xl hover:scale-110 transition-transform"><Phone size={28} /></button>
      </div>
    </div>
  );
};

// --- Block Components remain similar but now reactive to config changes ---

const HeroBlock = ({ config, settings }: any) => (
  <section className="relative min-h-[90vh] flex items-center bg-slate-950 text-white overflow-hidden py-20">
    <div className="absolute inset-0">
      <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-20" alt="Hero" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
    </div>
    <div className="relative max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-12 animate-fadeIn">
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div> Disponible à {settings.baseCity}
        </div>
        <h1 className="text-8xl font-black leading-[0.85] tracking-tighter" style={{ color: settings.primaryColor }}>{settings.heroTitle}</h1>
        <p className="text-xl text-slate-400 font-medium max-w-xl">{settings.heroSubtitle}</p>
        <div className="flex flex-wrap gap-6 pt-6">
          <Link to={config.ctaLink || '/catalog'} className="bg-blue-600 text-white px-12 py-7 rounded-[32px] font-black text-xl shadow-3xl hover:bg-white hover:text-blue-600 transition-all flex items-center gap-4 group" style={{ backgroundColor: settings.primaryColor }}>
            {config.ctaText} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <div className="flex flex-col justify-center">
             <div className="flex text-amber-400 gap-1 mb-1"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">4.9/5 • Basé sur +250 interventions</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicesBlock = ({ config, services, settings }: any) => (
  <section className="py-32 bg-white px-4">
    <div className="max-w-7xl mx-auto space-y-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h2 className="text-5xl font-black tracking-tighter">{config.title}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{config.subtitle}</p>
        </div>
        <Link to="/catalog" className="font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-xs" style={{ color: settings.primaryColor }}>Toutes les prestations <ChevronRight size={18}/></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {services.slice(0, 3).map((s: any) => (
          <Link to={`/service/${s.id}`} key={s.id} className="group bg-slate-50 p-10 rounded-[60px] border border-slate-100 hover:bg-white hover:shadow-4xl transition-all space-y-10">
            <div className="w-20 h-20 bg-white rounded-[24px] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ color: settings.primaryColor }}>
               <Zap size={32} />
            </div>
            <div className="space-y-4">
               <h3 className="text-3xl font-black tracking-tighter">{s.name}</h3>
               <p className="text-slate-500 font-medium leading-relaxed">{s.description}</p>
            </div>
            <div className="flex items-center justify-between pt-6">
               <span className="font-black text-xl">Dès {s.basePrice}€</span>
               <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors" style={{ backgroundColor: settings.primaryColor }}><ChevronRight /></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const UrgencyBlock = ({ config }: any) => (
  <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
       <div className="space-y-4 text-center md:text-left">
          <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4 justify-center md:justify-start">
             <Clock className="text-blue-500 animate-pulse" /> {config.title}
          </h2>
          <p className="text-slate-400 font-medium">{config.subtitle}</p>
       </div>
       <div className="flex gap-8">
          {['Lundi', 'Mardi', 'Mercredi'].map((day, i) => (
            <div key={day} className={`p-6 rounded-[30px] border-2 transition-all ${i === 0 ? 'bg-blue-600 border-blue-600 shadow-3xl shadow-blue-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
               <p className="text-[10px] font-black uppercase tracking-widest mb-2">{day}</p>
               <p className="font-black text-lg">{i === 0 ? '2 créneaux' : 'Complet'}</p>
            </div>
          ))}
       </div>
    </div>
  </section>
);

const PromoBlock = ({ config }: any) => (
  <section className="py-20 px-4">
    <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[60px] p-16 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
       <div className="space-y-6 text-center md:text-left">
          <h2 className="text-6xl font-black tracking-tighter">{config.title}</h2>
          <p className="text-2xl font-bold opacity-80">{config.subtitle}</p>
          <div className="inline-block bg-white/20 backdrop-blur-md px-8 py-4 rounded-3xl">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-2 opacity-60">Offre Flash Artipol</span>
             <span className="text-4xl font-black font-mono tracking-widest uppercase">Disponible</span>
          </div>
       </div>
       <Link to="/catalog" className="bg-white text-blue-600 px-12 py-7 rounded-[32px] font-black text-xl hover:scale-105 transition-transform shadow-2xl">Profiter de l'offre</Link>
    </div>
  </section>
);

const ProjectsBlock = ({ config }: any) => (
  <section className="py-32 bg-slate-50 px-4">
     <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
           <h2 className="text-5xl font-black tracking-tighter">{config.title}</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{config.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="group relative rounded-[50px] overflow-hidden shadow-2xl bg-white border border-slate-200">
              <div className="flex flex-col h-full">
                 <div className="flex h-80">
                    <div className="w-1/2 relative">
                       <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Before" />
                       <span className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-[10px] font-black uppercase">Avant</span>
                    </div>
                    <div className="flex-grow relative">
                       <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover border-l-4 border-white" alt="After" />
                       <span className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase">Après</span>
                    </div>
                 </div>
                 <div className="p-10 space-y-4">
                    <h3 className="text-2xl font-black">Rénovation Complète Lannion</h3>
                    <p className="text-slate-500 font-medium">Réfection intégrale plomberie et sanitaires.</p>
                 </div>
              </div>
           </div>
           <div className="bg-white rounded-[50px] p-12 border border-slate-200 flex flex-col justify-center space-y-8">
              <Construction size={48} className="text-blue-600" />
              <h3 className="text-4xl font-black tracking-tighter">Votre projet mérite l'excellence.</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Nous documentons chaque chantier pour garantir une transparence totale sur la qualité des matériaux et de la pose.</p>
              <button className="text-blue-600 font-black uppercase tracking-widest text-xs flex items-center gap-3">Voir le portfolio <ChevronRight /></button>
           </div>
        </div>
     </div>
  </section>
);

const ReviewsBlock = ({ config, reviews }: any) => (
  <section className="py-32 px-4 bg-white">
     <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
           <h2 className="text-5xl font-black tracking-tighter">{config.title}</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{config.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {reviews.slice(0, 3).map((r: any) => (
             <div key={r.id} className="bg-slate-50 p-10 rounded-[40px] space-y-6 border border-slate-100 relative group">
                <div className="absolute -top-6 left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"><Star size={20} fill="#fbbf24" className="text-amber-400" /></div>
                <p className="text-slate-700 font-medium italic leading-relaxed pt-4">"{r.comment}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-600">{r.userName[0]}</div>
                   <div>
                      <p className="font-black text-slate-900">{r.userName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Vérifié Artipol</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
     </div>
  </section>
);

const WhyUsBlock = ({ config, settings }: any) => (
  <section className="py-32 bg-slate-950 text-white px-4">
     <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
           <h2 className="text-5xl font-black tracking-tighter">{config.title}</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{config.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
           {[
             { t: 'Assurance Pro', d: 'Garantie décennale incluse', i: ShieldCheck },
             { t: 'Réactivité', d: 'Intervention sous 48h', i: Clock },
             { t: 'Expertise', d: 'Artisans locaux certifiés', i: Award },
             { t: 'Paiement', d: '3x sans frais disponible', i: Smartphone },
           ].map((item, i) => (
             <div key={i} className="space-y-6 group">
                <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:-translate-y-2 transition-transform" style={{ backgroundColor: settings.primaryColor }}>
                   <item.i size={28} />
                </div>
                <h4 className="text-xl font-black">{item.t}</h4>
                <p className="text-slate-500 font-medium text-sm">{item.d}</p>
             </div>
           ))}
        </div>
     </div>
  </section>
);

const CTABlock = ({ config, settings }: any) => (
  <section className="py-20 px-4">
     <div className="max-w-4xl mx-auto bg-white rounded-[60px] p-20 text-center shadow-4xl border border-slate-100 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: settings.primaryColor }}></div>
        <h2 className="text-6xl font-black tracking-tighter text-slate-950">{config.title}</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
           <Link to="/catalog" className="bg-slate-950 text-white px-12 py-6 rounded-3xl font-black text-lg hover:bg-blue-600 transition-all" style={{ backgroundColor: settings.primaryColor }}>{config.ctaText}</Link>
           <button className="bg-slate-50 text-slate-900 border border-slate-200 px-12 py-6 rounded-3xl font-black text-lg hover:bg-white transition-all">Demander un rappel</button>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Ou appelez-nous au {settings.contactPhone}</p>
     </div>
  </section>
);

const BlogBlock = ({ config, pages }: any) => (
  <section className="py-32 px-4 bg-slate-50">
     <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex justify-between items-end">
           <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter">{config.title}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{config.subtitle}</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {pages.filter(p => p.type === 'BLOG').map((p: any) => (
             <div key={p.id} className="bg-white rounded-[40px] overflow-hidden group border border-slate-100 hover:shadow-2xl transition-all">
                <div className="h-56 bg-slate-200 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.title} />
                </div>
                <div className="p-10 space-y-6">
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Conseil • {p.date}</span>
                   <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">{p.title}</h3>
                   <button className="text-xs font-black uppercase tracking-widest flex items-center gap-2">Lire la suite <ArrowRight size={14} /></button>
                </div>
             </div>
           ))}
        </div>
     </div>
  </section>
);

const SecurityBlock = ({ config }: any) => (
  <section className="py-20 px-4">
     <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {[
          { t: 'Paiement Sécurisé', d: 'Stripe & Apple Pay certifié', i: Shield },
          { t: 'Données Protégées', d: 'Conformité RGPD totale', i: ShieldCheck },
          { t: 'Garantie Qualité', d: 'Artisans assurés & qualifiés', i: Award },
        ].map((item, i) => (
          <div key={i} className="p-10 space-y-4">
             <div className="flex justify-center text-slate-300"><item.i size={40} /></div>
             <h4 className="font-black text-slate-900">{item.t}</h4>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.d}</p>
          </div>
        ))}
     </div>
  </section>
);

const PartnersBlock = ({ config }: any) => (
  <section className="py-20 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
     <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-20">
        <div className="font-black text-3xl tracking-tighter uppercase">QUALIBAT</div>
        <div className="font-black text-3xl tracking-tighter uppercase">RGE</div>
        <div className="font-black text-3xl tracking-tighter uppercase">CE</div>
        <div className="font-black text-3xl tracking-tighter uppercase">AXA</div>
        <div className="font-black text-3xl tracking-tighter uppercase">CMB</div>
     </div>
  </section>
);

export default Home;
