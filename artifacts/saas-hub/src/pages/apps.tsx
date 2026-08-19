import { useEffect, useState } from 'react';
import { ArrowUpRight, Filter, SlidersHorizontal } from 'lucide-react';
import { products, categories, statuses, type Product } from '@/data/products';
import { Footer, Header, ProductCard, ProductOverlay, SearchAndFilters, SectionEyebrow, useProductSearch } from '@/components/saas-hub';

export default function Apps() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { query, setQuery, category, setCategory, status, setStatus, filtered } = useProductSearch(products);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('[data-testid="input-search-apps"]')?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setStatus('All');
  };
  const nextProduct = (product: Product) => {
    const index = filtered.findIndex((item) => item.id === product.id);
    setSelectedProduct(filtered[(index + 1) % filtered.length] ?? null);
  };

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-foreground/10">
          <div className="hero-grid absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 lg:px-8 lg:pb-20 lg:pt-28">
            <div className="max-w-3xl animate-rise">
              <SectionEyebrow>The collection</SectionEyebrow>
              <h1 className="font-display text-[clamp(3.4rem,8vw,6.7rem)] font-bold leading-[.88] tracking-[-.09em]">All the useful<br /><span className="text-primary">things.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">A considered collection of independent tools for the work behind the work. Search the family, find your fit.</p>
            </div>
            <div className="mt-14 animate-rise delay-2"><SearchAndFilters query={query} setQuery={setQuery} category={category} setCategory={setCategory} status={status} setStatus={setStatus} categories={categories} statuses={statuses} /></div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[190px_1fr] lg:px-8 lg:py-20">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="mb-5 flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground"><Filter size={13} /> Refine by</div>
              <div className="space-y-1">
                {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${category === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} data-testid={`button-category-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}<span className={`font-mono-ui text-[10px] ${category === item ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{item === 'All' ? products.length : products.filter((product) => product.category === item).length}</span></button>)}
              </div>
              <div className="my-7 border-t border-foreground/10" />
              <div className="mb-4 flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground"><SlidersHorizontal size={13} /> Status</div>
              <div className="space-y-1">{statuses.slice(1).map((item) => <button type="button" key={item} onClick={() => setStatus(status === item ? 'All' : item)} className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${status === item ? 'bg-muted font-bold text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} data-testid={`button-status-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div>
            </div>
          </aside>
          <div>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono-ui text-xs uppercase tracking-[.15em] text-muted-foreground"><span className="text-foreground">{filtered.length}</span> {filtered.length === 1 ? 'app' : 'apps'} found</p>
              {(query || category !== 'All' || status !== 'All') && <button type="button" onClick={clearFilters} className="text-xs font-bold text-primary underline underline-offset-4" data-testid="button-clear-filters">Clear all filters</button>}
            </div>
            {filtered.length > 0 ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product, index) => <div key={product.id} className={`animate-rise delay-${Math.min(index + 1, 4)}`}><ProductCard product={product} onOpen={setSelectedProduct} /></div>)}</div> : <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-foreground/20 bg-muted/30 p-8 text-center"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><SlidersHorizontal size={24} /></div><h2 className="font-display text-2xl font-bold tracking-tight">Nothing here yet.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Try a broader search or clear your filters. The right tool may be one thought away.</p><button type="button" onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2.5 text-sm font-bold hover:border-primary/30 hover:text-primary" data-testid="button-empty-clear">Reset the view <ArrowUpRight size={15} /></button></div>}
          </div>
        </section>
        <section className="border-y border-foreground/10 bg-secondary/35"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-12 sm:flex-row sm:items-center lg:px-8"><div><p className="font-display text-2xl font-bold tracking-[-.05em]">Building something useful?</p><p className="mt-1 text-sm text-muted-foreground">We’re always looking for the next thoughtful addition.</p></div><a href="mailto:hello@saashub.example?subject=Submit%20a%20tool" className="inline-flex items-center gap-2 self-start rounded-full bg-foreground px-4 py-2.5 text-sm font-bold text-background transition hover:-translate-y-0.5 sm:self-auto" data-testid="link-submit-tool">Tell us about it <ArrowUpRight size={15} /></a></div></section>
      </main>
      <Footer />
      <ProductOverlay product={selectedProduct} onClose={() => setSelectedProduct(null)} onNext={nextProduct} />
    </div>
  );
}