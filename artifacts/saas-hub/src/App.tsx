import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Apps from '@/pages/apps';
import Admin from '@/pages/admin';
import { HubProvider } from '@/data/hub-store';
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, useAuth } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { useToast } from '@/hooks/use-toast';

const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#147d7b',
    colorForeground: '#20243a',
    colorMutedForeground: '#697083',
    colorDanger: '#b43a35',
    colorBackground: '#fbfaf7',
    colorInput: '#f1eee7',
    colorInputForeground: '#20243a',
    colorNeutral: '#dedbd4',
    fontFamily: 'Manrope, sans-serif',
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fbfaf7] rounded-2xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#20243a] font-bold',
    headerSubtitle: 'text-[#697083]',
    socialButtonsBlockButtonText: 'text-[#20243a]',
    formFieldLabel: 'text-[#20243a]',
    footerActionLink: 'text-[#147d7b] font-bold',
    footerActionText: 'text-[#697083]',
    dividerText: 'text-[#697083]',
    logoBox: 'h-12',
    logoImage: 'max-h-12',
    socialButtonsBlockButton: 'border-[#dedbd4] bg-[#f1eee7]',
    formButtonPrimary: 'bg-[#147d7b] text-[#fbfaf7]',
    formFieldInput: 'border-[#dedbd4] bg-[#f1eee7] text-[#20243a]',
    footerAction: 'text-[#697083]',
    dividerLine: 'bg-[#dedbd4]',
    alert: 'border-[#b43a35]',
    alertText: 'text-[#b43a35]',
    otpCodeFieldInput: 'border-[#dedbd4] bg-[#f1eee7] text-[#20243a]',
    formFieldRow: 'text-[#20243a]',
    main: 'bg-transparent',
  },
};

function ThemeHydrator() {
  useEffect(() => {
    const saved = window.localStorage.getItem('saas-hub-theme');
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);
  return null;
}

function AdminRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch('/api/admin/access', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : { authorized: false })
      .then((data: { authorized?: boolean }) => setAuthorized(Boolean(data.authorized)))
      .catch(() => setAuthorized(false))
      .finally(() => setChecking(false));
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <div className="flex min-h-[100dvh] items-center justify-center bg-background text-sm text-muted-foreground">Checking access…</div>;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (checking) return <div className="flex min-h-[100dvh] items-center justify-center bg-background text-sm text-muted-foreground">Checking admin access…</div>;
  if (!authorized) {
    const submit = async (event: React.FormEvent) => {
      event.preventDefault();
      setSubmitting(true);
      try {
        const response = await fetch('/api/admin/access', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        if (!response.ok) throw new Error('invalid');
        setAuthorized(true);
        setPassword('');
        toast({ title: 'Admin access granted', description: 'Welcome to the SaaS Hub control room.' });
      } catch {
        toast({ title: 'Incorrect admin password', description: 'Please try again.', variant: 'destructive' });
      } finally {
        setSubmitting(false);
      }
    };
    return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4"><form onSubmit={submit} className="w-full max-w-md rounded-[1.5rem] border border-foreground/10 bg-card p-7 shadow-xl sm:p-9"><div className="mb-7"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Private control room</p><h1 className="mt-3 font-display text-3xl font-bold tracking-[-.07em]">Enter admin password.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Your account is signed in. Enter the separate admin password to continue.</p></div><label className="block text-sm font-semibold text-foreground">Admin password<input autoFocus type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-foreground/10 bg-background px-4 outline-none transition focus:border-primary" /></label><button disabled={submitting || !password} className="mt-6 w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Checking…' : 'Unlock dashboard'}</button></form></div>;
  }
  return <Admin />;
}
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/apps" component={Apps} />
        <Route path="/admin" component={AdminRoute} />
        <Route path="/sign-in/*?" component={() => <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>} />
        <Route path="/sign-up/*?" component={() => <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HubProvider>
            <ThemeHydrator />
            <WouterRouter base={basePath}>
              <Router />
            </WouterRouter>
            <Toaster />
          </HubProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
