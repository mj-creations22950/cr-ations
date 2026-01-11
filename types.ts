
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPPORT = 'SUPPORT',
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  iban?: string;
  bic?: string;
  createdAt: string;
  points: number;
  lastLogin?: string;
}

export interface BankAccount {
  id: string;
  label: string;
  iban: string;
  bic: string;
  isDefault: boolean;
}

export interface PaymentMethodConfig {
  id: 'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'TRANSFER' | 'SPLIT' | 'DEFERRED';
  enabled: boolean;
  label: string;
  description: string;
}

export interface FinanceRules {
  depositRequired: boolean;
  depositPercentage: number;
  latePenaltyRate: number;
  splitPaymentThreshold: number;
  deferredPaymentAllowed: boolean;
}

export interface LegalDocument {
  id: string;
  type: 'CGV' | 'MENTIONS' | 'RGPD' | 'COOKIES';
  content: string;
  lastUpdate: string;
  version: string;
}

export interface LanguageConfig {
  code: string;
  label: string;
  isDefault: boolean;
  enabled: boolean;
}

export interface SiteSettings {
  logo: string;
  companyName: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  tvaRateDefault: number;
  tvaRates: { label: string; value: number }[];
  pricePerKm: number;
  contactEmail: string;
  contactPhone: string;
  region: string;
  baseCity: string;
  homeBlocks: HomeBlockConfig[];
  surchargeEvening: number;
  surchargeWeekend: number;
  insuranceRate: number;
  bankAccounts: BankAccount[];
  paymentMethods: PaymentMethodConfig[];
  financeRules: FinanceRules;
  legalDocs: LegalDocument[];
  languages: LanguageConfig[];
  emailTemplates: EmailTemplate[];
  seoKeywords: string[];
  seoDescription: string;
  maintenanceMode: boolean;
  security: {
    twoFactorAuth: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
  };
  gdpr: {
    dataRetentionMonths: number;
    cookieBannerTitle: string;
    cookieBannerText: string;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: 'ORDER_CONFIRMED' | 'PAYMENT_RECEIVED' | 'INTERVENTION_REMINDER' | 'ORDER_CANCELLED';
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'PROCESSING' | 'SUCCESS' | 'FAILED';
  userName: string;
  timestamp: string;
}

// Added missing properties to Order to support Checkout.tsx and detailed views
export interface Order {
  id: string;
  userId: string;
  items: any[];
  totalTTC: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  bookingDate: string;
  bookingSlot: string;
  address: string;
  subtotalHT: number;
  tvaAmount: number;
  tvaRate: number;
  travelFees: number;
  surchargeAmount: number;
  discountAmount: number;
  couponUsed?: string;
  insuranceAmount: number;
}

export interface HomeBlockConfig {
  id: string;
  type: string;
  enabled: boolean;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  content?: any;
}

export interface SystemLog {
  id: string;
  date: string;
  user: string;
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: string;
  published: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: string;
  messages: any[];
  createdAt: string;
}

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  value: number;
  active: boolean;
}

// Added ServiceVariant and missing properties to Service to support Catalog and ServiceDetail
export interface ServiceVariant {
  id: string;
  name: string;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  active: boolean;
  duration: number;
  tags: string[];
  variants: ServiceVariant[];
  categoryId: string;
  description: string;
  badge?: 'POPULAR' | 'NEW' | 'PROMO';
  included: string[];
  excluded: string[];
  fullDescription: string;
  options: { id: string; name: string; price: number; description?: string; }[];
  pdfs?: { id: string; label: string; url: string; }[];
}

// Added missing Category interface
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Added missing CartItem interface
export interface CartItem {
  id: string;
  service: Service;
  variantId?: string;
  selectedOptions: string[];
  quantity: number;
  pricingType: 'LABOR_ONLY' | 'FULL';
}

// Added missing AppNotification interface
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
}
