
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { ShieldCheck, X, Check } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const { settings } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('artipol_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('artipol_consent', 'all');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-10 left-10 right-10 z-[200] animate-slideUp">
      <div className="max-w-4xl mx-auto bg-slate-900 text-white p-10 rounded-[40px] shadow-4xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tighter">{settings.gdpr.cookieBannerTitle}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{settings.gdpr.cookieBannerText}</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => setShow(false)} className="flex-grow md:flex-none px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">Refuser</button>
          <button onClick={handleAccept} className="flex-grow md:flex-none px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3">
            <Check size={16} /> Accepter tout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
