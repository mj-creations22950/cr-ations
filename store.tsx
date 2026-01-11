
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Service, Category, CartItem, Order, SiteSettings, UserRole, 
  Transaction, SystemLog, Review, CMSPage, Ticket, HomeBlockConfig, Coupon,
  AppNotification, EmailTemplate, LegalDocument
} from './types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
  cmsPages: CMSPage[];
  setCmsPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;
  logs: SystemLog[];
  addLog: (action: string, details: string, severity?: SystemLog['severity']) => void;
  tickets: Ticket[];
  addTicketMessage: (ticketId: string, text: string) => void;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  addReview: (review: Omit<Review, 'id'>) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  compareList: Service[];
  toggleCompare: (service: Service) => void;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_LEGAL_DOCS: LegalDocument[] = [
  { id: 'l1', type: 'CGV', content: '# Conditions Générales de Vente Artipol\n\nBienvenue sur notre plateforme de services de proximité...', lastUpdate: '2025-01-01', version: '1.2' },
  { id: 'l2', type: 'RGPD', content: '# Politique de Protection des Données\n\nConformément au RGPD, nous protégeons vos données clients...', lastUpdate: '2025-01-01', version: '1.1' },
  { id: 'l3', type: 'MENTIONS', content: '# Mentions Légales\n\nEditeur : Artipol Bretagne ERP. Capital social : 100,000€...', lastUpdate: '2025-01-01', version: '1.0' }
];

const DEFAULT_HOME_BLOCKS: HomeBlockConfig[] = [
  { id: 'h1', type: 'HERO', enabled: true, title: "L'artisanat 2.0", subtitle: "Réservez vos prestations de rénovation avec devis immédiat.", ctaText: "Découvrir nos services", ctaLink: "/catalog" },
  { id: 'h2', type: 'URGENCY', enabled: true, title: "Dépannage Rapide", subtitle: "Disponibilités pour interventions sous 48h en Côtes d'Armor." },
  { id: 'h3', type: 'SERVICES', enabled: true, title: "Nos Métiers", subtitle: "Plomberie, Électricité, Rénovation." },
  { id: 'h4', type: 'PROMO', enabled: true, title: "Offre Breizh", subtitle: "Remise immédiate de -10% avec le code BREIZH10." },
  { id: 'h5', type: 'PROJECTS', enabled: true, title: "Nos Réalisations", subtitle: "Avant/Après de nos derniers chantiers bretons." },
  { id: 'h6', type: 'REVIEWS', enabled: true, title: "Avis Clients", subtitle: "Ils nous font confiance pour leurs travaux." },
  { id: 'h7', type: 'WHY_US', enabled: true, title: "Pourquoi Artipol ?", subtitle: "Les garanties de notre réseau d'artisans." },
  { id: 'h8', type: 'CTA', enabled: true, title: "Prêt à lancer votre projet ?", ctaText: "Réserver maintenant" },
  { id: 'h9', type: 'SECURITY', enabled: true, title: "Sécurité & Garanties" }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cmsPages, setCmsPages] = useState<CMSPage[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [compareList, setCompareList] = useState<Service[]>([]);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [settings, setSettings] = useState<SiteSettings>({
    logo: 'Artipol',
    companyName: 'Artipol Bretagne ERP',
    heroTitle: "L'artisanat 2.0 en Côtes d'Armor.",
    heroSubtitle: "Réservez vos prestations de rénovation avec devis immédiat.",
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    currency: 'EUR',
    tvaRateDefault: 20,
    tvaRates: [
      { label: 'Taux Normal', value: 20 },
      { label: 'Taux Réduit (Travaux)', value: 10 },
      { label: 'Taux Super Réduit', value: 5.5 }
    ],
    pricePerKm: 0.95,
    contactEmail: 'contact@artipol-bretagne.fr',
    contactPhone: '02 96 42 00 22',
    region: 'Bretagne',
    baseCity: 'Saint-Brieuc',
    homeBlocks: DEFAULT_HOME_BLOCKS,
    surchargeEvening: 25,
    surchargeWeekend: 45,
    insuranceRate: 0.03,
    bankAccounts: [{ id: 'ba1', label: 'Compte Principal CMB', iban: 'FR76 1234 5678 9012 3456 7890 123', bic: 'CMBFR22', isDefault: true }],
    paymentMethods: [
      { id: 'CARD', label: 'Carte Bancaire', enabled: true, description: 'Stripe, Visa, Mastercard' },
      { id: 'APPLE_PAY', label: 'Apple Pay', enabled: true, description: 'Paiement express' },
      { id: 'SPLIT', label: 'Paiement 3x', enabled: true, description: 'Sans frais via Alma' }
    ],
    financeRules: {
      depositRequired: true,
      depositPercentage: 30,
      latePenaltyRate: 10.5,
      splitPaymentThreshold: 300,
      deferredPaymentAllowed: false
    },
    legalDocs: DEFAULT_LEGAL_DOCS,
    languages: [
      { code: 'FR', label: 'Français', isDefault: true, enabled: true },
      { code: 'EN', label: 'English', isDefault: false, enabled: false }
    ],
    emailTemplates: [],
    seoKeywords: ['artisan bretagne', 'plomberie saint-brieuc', 'renovation 22'],
    seoDescription: 'Artipol : Votre réseau d\'artisans experts en Côtes d\'Armor. Devis gratuit et réservation en ligne.',
    maintenanceMode: false,
    security: {
      twoFactorAuth: false,
      maxLoginAttempts: 5,
      sessionTimeout: 60
    },
    gdpr: {
      dataRetentionMonths: 36,
      cookieBannerTitle: 'Votre vie privée en Bretagne',
      cookieBannerText: 'Nous utilisons des cookies pour améliorer votre expérience et garantir la sécurité des paiements.'
    }
  });

  const addLog = (action: string, details: string, severity: SystemLog['severity'] = 'INFO') => {
    const newLog: SystemLog = { id: Date.now().toString(), date: new Date().toISOString(), user: user?.name || 'Système', action, details, severity };
    setLogs(prev => [newLog, ...prev]);
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    addLog('CONFIGURATION', 'Mise à jour des paramètres système.', 'INFO');
  };

  const addService = (s: Service) => {
    setServices(prev => [...prev, s]);
    addLog('INVENTAIRE', `Nouveau service ajouté : ${s.name}`);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addLog('INVENTAIRE', `Mise à jour du service ID: ${id}`);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    addLog('INVENTAIRE', `Suppression du service ID: ${id}`, 'WARNING');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addReview = (review: Omit<Review, 'id'>) => {
    const newReview = { ...review, id: Math.random().toString(36).substr(2, 9) };
    setReviews(prev => [newReview, ...prev]);
    addLog('AVIS', `Nouvel avis client publié pour le service ${review.serviceId}`);
  };

  const addTicketMessage = (ticketId: string, text: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t, messages: [...t.messages, { id: Date.now().toString(), sender: 'CLIENT', text, date: new Date().toISOString() }]
    } : t));
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const clearCart = () => { setCart([]); setActiveCoupon(null); };
  const addOrder = (order: Order) => {
     setOrders(prev => [order, ...prev]);
     addLog('COMMANDE', `Nouvelle commande enregistrée : ${order.id}`, 'INFO');
  };
  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addLog('COMMANDE', `Statut commande ${id} modifié : ${status}`);
  };

  const addTransaction = (tx: Transaction) => setTransactions(prev => [tx, ...prev]);
  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
  };

  useEffect(() => {
    setCategories([
       { id: '1', name: 'Plomberie', icon: '🚰' },
       { id: '2', name: 'Électricité', icon: '⚡' },
       { id: '3', name: 'Rénovation', icon: '🏗️' }
    ]);
    
    setServices([
       { 
         id: 's1', name: 'Installation Robinetterie', categoryId: '1', basePrice: 89, active: true, duration: 60, 
         imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
         description: 'Remplacement de votre mitigeur cuisine ou salle de bain par un artisan expert.',
         fullDescription: 'Intervention complète incluant la dépose de l\'ancien robinet, la pose du nouveau et les tests d\'étanchéité.',
         included: ['Dépose ancien robinet', 'Pose mitigeur neuf', 'Raccords flexibles', 'Garantie 2 ans'],
         excluded: ['Fourniture du robinet (en option)', 'Modifications tuyauterie cuivre'],
         tags: ['Urgent', 'Plomberie'],
         variants: [{ id: 'v1', name: 'Standard', price: 0 }, { id: 'v2', name: 'Premium (Luxe)', price: 40 }],
         options: [{ id: 'o1', name: 'Fourniture mitigeur Grohe', price: 120, description: 'Modèle haute qualité' }]
       },
       { 
         id: 's2', name: 'Mise en sécurité Tableau', categoryId: '2', basePrice: 249, active: true, duration: 180, 
         imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800',
         description: 'Remise aux normes NF C 15-100 de votre tableau électrique.',
         fullDescription: 'Mise en sécurité complète pour protéger vos biens et votre famille contre les risques électriques.',
         included: ['Audit diagnostic', 'Pose interrupteur différentiel', 'Étiquetage circuits'],
         excluded: ['Câblage nouvelle ligne', 'Consuel'],
         tags: ['Sécurité', 'Electricité'],
         variants: [],
         options: []
       }
    ]);

    setOrders([
      {
        id: 'ART-9912', userId: '2', items: [], totalTTC: 450, status: 'COMPLETED', createdAt: '2025-01-15',
        paymentMethod: 'CARD', bookingDate: '2025-01-20', bookingSlot: '08:30', address: 'Saint-Brieuc',
        subtotalHT: 375, tvaAmount: 75, tvaRate: 20, travelFees: 0, surchargeAmount: 0, discountAmount: 0, insuranceAmount: 0
      }
    ]);

    setUsers([
      { id: '2', name: 'Jean Dupont', email: 'jean@test.com', role: UserRole.CLIENT, points: 150, createdAt: '2025-01-10', lastLogin: '2025-02-18' }
    ]);

    setTickets([
       { id: 'TK-88', userId: '2', subject: 'Problème de rendez-vous', status: 'OPEN', messages: [{id: 'm1', sender: 'SUPPORT', text: 'Bonjour, comment puis-je vous aider ?', date: '2025-02-15T10:00:00Z'}], createdAt: '2025-02-15' }
    ]);

    setReviews([
       { id: 'r1', serviceId: 's1', userId: 'client1', userName: 'Hervé Le Goff', rating: 5, comment: 'Excellent travail à Lannion, artisan très ponctuel.', date: '2025-01-20', verified: true }
    ]);

    setCmsPages([
       { id: 'p1', slug: 'entretien-plomberie', title: 'Entretenir sa plomberie en hiver', type: 'BLOG', content: 'Conseils experts...', published: true },
       { id: 'p2', slug: 'normes-elec', title: 'Les normes NF C 15-100 expliquées', type: 'BLOG', content: 'Tout savoir...', published: true }
    ]);
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser, users, setUsers, services, setServices, addService, updateService, deleteService,
      categories, setCategories, cart, addToCart, removeFromCart: (id) => setCart(prev => prev.filter(i => i.id !== id)), 
      updateCartItem: (id, u) => setCart(prev => prev.map(i => i.id === id ? {...i, ...u} : i)),
      clearCart, orders, setOrders, addOrder, updateOrderStatus, transactions, addTransaction, updateTransactionStatus, 
      cmsPages, setCmsPages, settings, updateSettings, logs, addLog, 
      tickets, addTicketMessage, reviews, setReviews, addReview, notifications, markNotificationRead,
      compareList, toggleCompare: (s) => setCompareList(prev => prev.some(x => x.id === s.id) ? prev.filter(x => x.id !== s.id) : [...prev, s]),
      coupons, setCoupons, activeCoupon, applyCoupon: () => false
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
