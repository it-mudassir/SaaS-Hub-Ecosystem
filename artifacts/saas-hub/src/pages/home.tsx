import { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowDownRight, ArrowUpRight, CircleArrowUp, Compass, Sparkles } from 'lucide-react';
import { type Product } from '@/data/products';
import { useHubStore } from '@/data/hub-store';
import { Footer, Header, ProductCard, ProductOverlay, ProductMark, SectionEyebrow } from '@/components/saas-hub';

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, branding, promotion } = useHubStore();
  const featured = products.filter((product) => product.featured);
  const latest = useMemo(() => products.filter((product) => product.isNew), [products]);
  const comingSoon = products.filter((product) => product.status === 'Coming soon');

  const openProduct = (product: Product) => setSelectedProduct(product);
  const nextProduct = (product: Product) => {
    const index = products.findIndex((item) => item.id === product.id);
    setSelectedProduct(products[(index + 1) % products.length]);
  };

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden">
      <Header onExplore={() => setLocation('/apps')} branding={branding} />
      <main>
        <section className="relative overflow-hidden border-b border-foreground/10">
          <div className="hero-grid absolute inset-0 opacity-70" />
          <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-44 top-72 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto grid min-h-[660px] max-w-7xl items-center gap-16 px-5 pb-20 pt-20 lg:grid-cols-[1.12fr_.88fr] lg:px-8 lg:pb-28 lg:pt-28">
            <div className="animate-rise">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 font-mono-ui text-[10px] font-medium uppercase tracking-[.16em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> The useful side of software</div>
              <h1 className="max-w-3xl font-display text-[clamp(3.9rem,9vw,7.4rem)] font-bold leading-[.87] tracking-[-.09em]">Find your next<br /><span className="text-primary">unfair advantage.</span></h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">SaaS Hub is a growing family of focused tools for founders, operators, creators, and teams who would rather make progress than manage software.</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/apps" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition hover:-translate-y-1 hover:bg-primary/90" data-testid="link-hero-explore">Explore the apps <ArrowUpRight size={17} /></Link>
                <a href="#featured" className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-3.5 text-sm font-bold transition hover:border-primary/35 hover:text-primary" data-testid="link-hero-featured">See what’s new <ArrowDownRight size={16} /></a>
              </div>
              <div className="mt-12 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex -space-x-2">{products.slice(0, 4).map((product) => <ProductMark key={product.id} product={product} size="sm" />)}</span><span>7 tools, one focused place<span className="text-accent">.</span></span></div>
            </div>
            <div className="relative hidden min-h-[430px] lg:block animate-rise delay-2">
              <div className="absolute inset-x-12 top-10 h-80 rounded-[2.5rem] border border-primary/20 bg-primary/8" />
              <div className="absolute right-0 top-0 w-64 rotate-6 rounded-[1.5rem] border border-foreground/10 bg-card p-5 shadow-2xl transition hover:rotate-3">
                <div className="mb-12 flex items-center justify-between"><ProductMark product={products[1] ?? products[0]} size="md" /><span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">02 / {String(products.length).padStart(2, '0')}</span></div>
                <p className="font-display text-2xl font-bold tracking-tight">Make ideas<br />travel further.</p>
                <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
              </div>
              <div className="absolute bottom-10 left-2 w-64 -rotate-6 rounded-[1.5rem] border border-foreground/10 bg-card p-5 shadow-2xl transition hover:-rotate-3">
                <div className="mb-10 flex items-center justify-between"><ProductMark product={products[0]} size="md" /><span className="flex items-center gap-1 font-mono-ui text-[10px] uppercase tracking-widest text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live</span></div>
                <p className="font-display text-2xl font-bold tracking-tight">A clearer<br />way to work.</p>
                <div className="mt-6 flex gap-1"><span className="h-1.5 w-8 rounded-full bg-primary" /><span className="h-1.5 w-3 rounded-full bg-accent" /><span className="h-1.5 w-5 rounded-full bg-foreground/15" /></div>
              </div>
              <div className="absolute bottom-0 right-5 flex h-20 w-20 items-center justify-center rounded-full border border-accent/40 bg-accent text-accent-foreground shadow-xl"><CircleArrowUp size={28} strokeWidth={1.5} /></div>
            </div>
          </div>
        </section>

        <section id="featured" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><SectionEyebrow>Start here</SectionEyebrow><h2 className="font-display text-4xl font-bold tracking-[-.07em] sm:text-5xl">The ones to know<span className="text-accent">.</span></h2><p className="mt-3 text-muted-foreground">A few good places to put your attention.</p></div>
            <Link href="/apps" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" data-testid="link-see-all-featured">See all apps <ArrowUpRight size={16} /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">{featured.map((product, index) => <div key={product.id} className={`animate-rise delay-${index + 1}`}><ProductCard product={product} onOpen={openProduct} featured /></div>)}</div>
        </section>

        <section className="border-y border-foreground/10 bg-secondary/35">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.78fr_1.22fr] lg:px-8">
            <div><SectionEyebrow>Why this exists</SectionEyebrow><h2 className="max-w-md font-display text-4xl font-bold leading-[.98] tracking-[-.07em] sm:text-5xl">Less hunting.<br /><span className="text-primary">More building.</span></h2><p className="mt-6 max-w-md leading-7 text-muted-foreground">The best independent software is often one thoughtful launch away from being useful to you. We make those launches easier to find.</p><a href="#about" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-accent decoration-2 underline-offset-4" data-testid="link-learn-about">Our point of view <ArrowDownRight size={15} /></a></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-foreground/10 bg-card p-6 sm:translate-y-8"><Compass className="mb-12 text-primary" size={25} strokeWidth={1.5} /><h3 className="font-display text-xl font-bold tracking-tight">Curated, not crowded.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Every product has a point of view, a real use case, and a reason to exist.</p></div>
              <div className="rounded-[1.5rem] border border-foreground/10 bg-card p-6"><Sparkles className="mb-12 text-accent" size={25} strokeWidth={1.5} /><h3 className="font-display text-xl font-bold tracking-tight">Momentum included.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">New tools are arriving regularly, so there is always a next tab worth opening.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div><SectionEyebrow>Fresh signal</SectionEyebrow><h2 className="font-display text-4xl font-bold tracking-[-.07em] sm:text-5xl">Just landed<span className="text-accent">.</span></h2></div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">The newest additions to the family. Small launches with serious intent.</p>
          </div>
          <div className="mt-10 divide-y divide-foreground/10 border-y border-foreground/10">{latest.map((product) => <button type="button" key={product.id} onClick={() => openProduct(product)} className="group flex w-full items-center gap-4 py-5 text-left transition hover:px-3" data-testid={`button-latest-${product.id}`}><ProductMark product={product} size="sm" /><span className="flex-1"><span className="flex items-center gap-2 font-display text-lg font-bold">{product.name}<span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono-ui text-[9px] uppercase tracking-widest text-accent">New</span></span><span className="mt-1 block text-sm text-muted-foreground">{product.description}</span></span><span className="hidden text-xs text-muted-foreground sm:block">{product.category}</span><ArrowUpRight size={18} className="text-primary opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" /></button>)}</div>
        </section>

        <section className="overflow-hidden border-y border-foreground/10 bg-primary py-5 text-primary-foreground">
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap font-mono-ui text-[11px] uppercase tracking-[.2em]"><span>All the useful things</span><span className="text-accent">·</span><span>{products.map((product) => product.name).join('  /  ')}</span><span className="text-accent">·</span><span>All the useful things</span><span className="text-accent">·</span><span>{products.map((product) => product.name).join('  /  ')}</span></div>
        </section>

        {promotion.enabled && (
          <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-accent/35 bg-accent/12 p-7 sm:p-10">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-accent/30" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl"><SectionEyebrow>{promotion.eyebrow}</SectionEyebrow><h2 className="font-display text-3xl font-bold tracking-[-.06em] sm:text-4xl">{promotion.title}</h2><p className="mt-3 max-w-xl leading-7 text-muted-foreground">{promotion.description}</p></div>
                <a href={promotion.buttonUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition hover:-translate-y-1" data-testid="link-promotion">{promotion.buttonLabel} <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="relative overflow-hidden rounded-[2rem] bg-foreground px-7 py-14 text-background sm:px-12 lg:px-20"><div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-background/15" /><div className="absolute -right-2 -top-14 h-52 w-52 rounded-full border border-background/15" /><div className="relative max-w-2xl"><SectionEyebrow>For the curious</SectionEyebrow><h2 className="font-display text-4xl font-bold leading-[.98] tracking-[-.07em] sm:text-6xl">Your next great<br />tool is closer than you think<span className="text-accent">.</span></h2><p className="mt-6 max-w-lg leading-7 text-background/65">Browse the full collection by category, status, or just follow your curiosity.</p><Link href="/apps" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition hover:-translate-y-1" data-testid="link-bottom-explore">Browse the collection <ArrowUpRight size={16} /></Link></div></div></section>
      </main>
      <Footer branding={branding} />
      <ProductOverlay product={selectedProduct} onClose={() => setSelectedProduct(null)} onNext={nextProduct} />
    </div>
  );
}