import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Command,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { type Product } from '@/data/products';
import { type HubBranding } from '@/data/hub-store';

export function ProductMark({ product, size = 'md' }: { product: Product; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-9 w-9 text-sm', md: 'h-12 w-12 text-lg', lg: 'h-16 w-16 text-2xl' };
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[1.1rem] font-display font-bold text-white shadow-sm ${sizes[size]}`}
      style={{ backgroundColor: product.accentColor }}
      data-testid={`mark-product-${product.id}`}
      aria-hidden="true"
    >
      {product.logo}
    </span>
  );
}

export function Header({ onExplore, branding }: { onExplore?: () => void; branding?: HubBranding }) {
  const [location, setLocation] = useLocation();
  const [dark, setDark] = useState(() => typeof window !== 'undefined' && localStorage.getItem('saas-hub-theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('saas-hub-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const goExplore = () => {
    setMenuOpen(false);
    if (onExplore) onExplore();
    else setLocation('/apps');
  };

  return (
    <header className="relative z-30 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" data-testid="link-logo">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-accent" />
            <span className="relative font-display text-lg font-bold">S</span>
          </span>
          <span className="font-display text-[17px] font-bold tracking-[-.04em]">{branding?.brandName ?? 'saas hub'}<span className="text-accent">.</span></span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <Link href="/" className={`text-sm font-semibold transition-colors hover:text-primary ${location === '/' ? 'text-foreground' : 'text-muted-foreground'}`} data-testid="link-home">Home</Link>
          <Link href="/apps" className={`text-sm font-semibold transition-colors hover:text-primary ${location === '/apps' ? 'text-foreground' : 'text-muted-foreground'}`} data-testid="link-apps">Apps</Link>
          <a href="#about" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" data-testid="link-about">About</a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setDark((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition hover:border-primary/35 hover:text-primary"
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            data-testid="button-toggle-theme"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button type="button" onClick={goExplore} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90" data-testid="button-explore-header">
            Explore apps <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={() => setDark((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground" aria-label="Toggle theme" data-testid="button-toggle-theme-mobile">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10" aria-label="Toggle navigation" data-testid="button-toggle-menu">
            {menuOpen ? <X size={18} /> : <Command size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[76px] border-b border-foreground/10 bg-background px-5 py-5 shadow-xl md:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted" data-testid="link-home-mobile">Home</Link>
            <Link href="/apps" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted" data-testid="link-apps-mobile">Apps</Link>
            <a href="#about" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted" data-testid="link-about-mobile">About</a>
            <button type="button" onClick={goExplore} className="mt-2 flex items-center justify-between rounded-xl bg-primary px-3 py-3 text-sm font-bold text-primary-foreground" data-testid="button-explore-mobile">Explore the hub <ArrowUpRight size={16} /></button>
          </div>
        </div>
      )}
    </header>
  );
}

export function ProductCard({ product, onOpen, featured = false }: { product: Product; onOpen: (product: Product) => void; featured?: boolean }) {
  return (
    <article
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/.45)] ${featured ? 'min-h-[300px]' : 'min-h-[270px]'}`}
      onClick={() => onOpen(product)}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpen(product); }}
      role="button"
      tabIndex={0}
      data-testid={`card-product-${product.id}`}
    >
      <div className="flex items-start justify-between p-6 pb-2">
        <ProductMark product={product} size={featured ? 'lg' : 'md'} />
        <div className="flex items-center gap-2">
          {product.isNew && <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono-ui text-[10px] font-medium uppercase tracking-[.12em] text-accent">New</span>}
          <span className={`rounded-full px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[.12em] ${product.status === 'Coming soon' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>{product.status}</span>
        </div>
      </div>
      <div className="mt-auto p-6 pt-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-display text-2xl font-bold tracking-[-.05em] text-card-foreground">{product.name}</h3>
          <ArrowUpRight size={16} className="text-primary opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
        <p className="max-w-[34ch] text-sm leading-6 text-muted-foreground">{product.description}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-foreground/10 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{tag}</span>)}
        </div>
      </div>
      <span className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition duration-300 group-hover:scale-x-100" style={{ backgroundColor: product.accentColor }} />
    </article>
  );
}

export function ProductOverlay({ product, onClose, onNext }: { product: Product | null; onClose: () => void; onNext?: (product: Product) => void }) {
  useEffect(() => {
    if (!product) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [product, onClose]);

  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${product.name} details`} data-testid="overlay-product-details">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close product details" data-testid="button-overlay-backdrop" />
      <div className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border border-foreground/10 bg-background shadow-2xl sm:rounded-[2rem]">
        <div className="absolute right-5 top-5 z-10 flex gap-2">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-background/80 backdrop-blur transition hover:border-primary/30 hover:text-primary" aria-label="Close details" data-testid="button-close-overlay"><X size={18} /></button>
        </div>
        <div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_1.15fr]">
          <div>
            <div className="mb-10 flex items-center justify-between">
              <ProductMark product={product} size="lg" />
              <span className="font-mono-ui text-[11px] uppercase tracking-[.15em] text-muted-foreground">{product.category}</span>
            </div>
            <p className="mb-3 font-mono-ui text-xs uppercase tracking-[.16em] text-primary">Product {String(product.displayOrder).padStart(2, '0')}</p>
            <h2 className="font-display text-5xl font-bold tracking-[-.07em]">{product.name}<span className="text-accent">.</span></h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{product.longDescription}</p>
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid={`link-launch-${product.id}`}>
              {product.status === 'Coming soon' ? 'Get launch updates' : 'Open product'} <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="md:pt-16">
            <div className="rounded-2xl border border-foreground/10 bg-muted/55 p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono-ui text-[10px] uppercase tracking-[.17em] text-muted-foreground">Inside {product.name}</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> {product.status}</span>
              </div>
              <div className="space-y-3">
                {product.features.map((feature) => <div key={feature} className="flex items-center gap-3 border-t border-foreground/10 pt-3 text-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-primary"><Check size={14} /></span>{feature}</div>)}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {product.screenshots.map((screen, index) => <div key={screen} className="relative flex h-24 items-end overflow-hidden rounded-xl border border-foreground/10 p-3" style={{ background: `linear-gradient(135deg, ${product.accentColor}22, hsl(var(--muted)))` }}><span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">{String(index + 1).padStart(2, '0')} / {screen}</span></div>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground">#{tag.toLowerCase()}</span>)}</div>
          </div>
        </div>
        {onNext && <button type="button" onClick={() => onNext(product)} className="absolute bottom-7 right-7 hidden items-center gap-1 text-xs font-bold text-muted-foreground transition hover:text-primary sm:flex" data-testid="button-next-product">Next app <ChevronRight size={15} /></button>}
      </div>
    </div>
  );
}

export function SearchAndFilters({ query, setQuery, category, setCategory, status, setStatus, categories, statuses }: {
  query: string; setQuery: (value: string) => void; category: string; setCategory: (value: string) => void; status: string; setStatus: (value: string) => void; categories: string[]; statuses: string[];
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <div className="rounded-[1.5rem] border border-foreground/10 bg-card p-3 shadow-[0_15px_50px_-38px_hsl(var(--foreground)/.5)]">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-muted/65 px-4">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <span className="sr-only">Search apps</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, use case, or keyword" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" data-testid="input-search-apps" />
          <kbd className="hidden rounded-md border border-foreground/10 px-1.5 py-1 font-mono-ui text-[10px] text-muted-foreground lg:block">⌘ K</kbd>
        </label>
        <button type="button" onClick={() => setFiltersOpen((value) => !value)} className="flex min-h-12 items-center justify-between gap-8 rounded-xl border border-foreground/10 px-4 text-sm font-semibold md:hidden" data-testid="button-toggle-filters">Filters <ChevronDown size={16} className={filtersOpen ? 'rotate-180 transition' : 'transition'} /></button>
        <div className={`${filtersOpen ? 'flex' : 'hidden'} flex-col gap-3 md:flex md:flex-row`}>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-xl border border-foreground/10 bg-background px-4 text-sm font-semibold outline-none md:min-w-40" aria-label="Filter by category" data-testid="select-category-filter">
            {categories.map((item) => <option key={item} value={item}>{item === 'All' ? 'All categories' : item}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-12 rounded-xl border border-foreground/10 bg-background px-4 text-sm font-semibold outline-none md:min-w-36" aria-label="Filter by status" data-testid="select-status-filter">
            {statuses.map((item) => <option key={item} value={item}>{item === 'All' ? 'All statuses' : item}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-4 flex items-center gap-2 font-mono-ui text-[11px] font-medium uppercase tracking-[.2em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{children}</p>;
}

export function Footer({ branding }: { branding?: HubBranding }) {
  return (
    <footer id="about" className="border-t border-foreground/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div><Link href="/" className="font-display text-xl font-bold tracking-[-.05em]" data-testid="link-footer-logo">{branding?.brandName ?? 'saas hub'}<span className="text-accent">.</span></Link><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{branding?.description ?? 'Independent software for people building the next useful thing.'}</p></div>
        <div><p className="mb-4 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Explore</p><div className="flex flex-col gap-3 text-sm font-semibold"><Link href="/apps" data-testid="link-footer-apps">All apps</Link><a href="/apps?status=Coming%20soon" data-testid="link-footer-coming">Coming soon</a></div></div>
        <div><p className="mb-4 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">SaaS Hub</p><div className="flex flex-col gap-3 text-sm font-semibold"><a href="#about" data-testid="link-footer-about">About the hub</a><a href={`mailto:${branding?.contactEmail ?? 'hello@saashub.example'}`} data-testid="link-footer-contact">Say hello</a><Link href="/admin" data-testid="link-footer-admin">Admin dashboard</Link></div></div>
        <div><p className="mb-4 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Signal</p><p className="text-sm leading-6 text-muted-foreground">New tools, thoughtful launches, no noise.</p><div className="mt-4 flex gap-2"><span className="h-2 w-2 rounded-full bg-primary" /><span className="h-2 w-2 rounded-full bg-accent" /><span className="h-2 w-2 rounded-full bg-foreground/20" /></div></div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-foreground/10 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2024 SaaS Hub. Built for momentum.</span><span className="font-mono-ui">A growing family of useful software.</span></div>
    </footer>
  );
}

export function useProductSearch(allProducts: Product[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allProducts.filter((product) => {
      const searchable = [product.name, product.description, product.longDescription, product.category, ...product.tags].join(' ').toLowerCase();
      return (!normalized || searchable.includes(normalized)) && (category === 'All' || product.category === category) && (status === 'All' || product.status === status);
    });
  }, [allProducts, category, query, status]);
  return { query, setQuery, category, setCategory, status, setStatus, filtered };
}