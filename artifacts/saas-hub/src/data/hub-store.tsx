import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { products as seedProducts, type Product } from '@/data/products';

export type HubBranding = {
  brandName: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  contactEmail: string;
};

export type HubPromotion = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonUrl: string;
  productId: string;
};

const defaultBranding: HubBranding = {
  brandName: 'saas hub',
  tagline: 'The useful side of software',
  description: 'Independent software for people building the next useful thing.',
  primaryColor: '#147d7b',
  accentColor: '#e67d57',
  contactEmail: 'hello@saashub.example',
};

const defaultPromotion: HubPromotion = {
  enabled: true,
  eyebrow: 'Built for momentum',
  title: 'The next useful thing is already here.',
  description: 'Meet the latest addition to the SaaS Hub family. Focused software, thoughtfully made.',
  buttonLabel: 'Try it now',
  buttonUrl: 'https://cove.saas-hub.example',
  productId: 'cove',
};

const STORAGE_KEY = 'saas-hub-content-v1';

type StoredContent = {
  products: Product[];
  branding: HubBranding;
  promotion: HubPromotion;
};

function getInitialContent(): StoredContent {
  if (typeof window === 'undefined') {
    return { products: seedProducts, branding: defaultBranding, promotion: defaultPromotion };
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { products: seedProducts, branding: defaultBranding, promotion: defaultPromotion };
    const parsed = JSON.parse(saved) as Partial<StoredContent>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : seedProducts,
      branding: { ...defaultBranding, ...(parsed.branding ?? {}) },
      promotion: { ...defaultPromotion, ...(parsed.promotion ?? {}) },
    };
  } catch {
    return { products: seedProducts, branding: defaultBranding, promotion: defaultPromotion };
  }
}

type HubStore = StoredContent & {
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateBranding: (branding: HubBranding) => void;
  updatePromotion: (promotion: HubPromotion) => void;
  resetContent: () => void;
};

const HubStoreContext = createContext<HubStore | null>(null);

export function HubProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<StoredContent>(getInitialContent);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    document.documentElement.style.setProperty('--hub-primary', content.branding.primaryColor);
    document.documentElement.style.setProperty('--hub-accent', content.branding.accentColor);
  }, [content]);

  const store = useMemo<HubStore>(() => ({
    ...content,
    addProduct: (product) => setContent((current) => ({ ...current, products: [...current.products, product] })),
    updateProduct: (product) => setContent((current) => ({ ...current, products: current.products.map((item) => item.id === product.id ? product : item) })),
    removeProduct: (id) => setContent((current) => ({ ...current, products: current.products.filter((item) => item.id !== id) })),
    updateBranding: (branding) => setContent((current) => ({ ...current, branding })),
    updatePromotion: (promotion) => setContent((current) => ({ ...current, promotion })),
    resetContent: () => setContent({ products: seedProducts, branding: defaultBranding, promotion: defaultPromotion }),
  }), [content]);

  return <HubStoreContext.Provider value={store}>{children}</HubStoreContext.Provider>;
}

export function useHubStore() {
  const store = useContext(HubStoreContext);
  if (!store) throw new Error('useHubStore must be used inside HubProvider');
  return store;
}

export { defaultBranding, defaultPromotion };