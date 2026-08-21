import { useEffect, type ReactNode } from 'react';
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
  if (!isLoaded) return <div className="flex min-h-[100dvh] items-center justify-center bg-background text-sm text-muted-foreground">Checking access…</div>;
  if (!isSignedIn) return <RedirectToSignIn />;
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
