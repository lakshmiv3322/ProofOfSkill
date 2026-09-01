import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { DemoReport } from '@/components/landing/demo-report';
import { Pricing } from '@/components/landing/pricing';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import { AuthModal } from '@/components/landing/auth-modal';
import { Dashboard } from '@/components/app/dashboard';
import { PublicVerifyPage } from '@/components/verify/public-verify-page';

function parseVerifyRoute(): string | null {
  if (typeof window === 'undefined') return null;

  const path = window.location.pathname;
  if (path.startsWith('/verify/')) {
    const code = path.replace('/verify/', '').trim();
    if (code) return decodeURIComponent(code);
  } else if (path === '/verify') {
    return 'POS-CPR-2026-042AH';
  }

  // Support hash routing or query params e.g. #/verify/POS-... or ?verify=POS-...
  const searchParams = new URLSearchParams(window.location.search);
  const verifyParam = searchParams.get('verify') || searchParams.get('code');
  if (verifyParam) return verifyParam;

  const hash = window.location.hash;
  if (hash.startsWith('#/verify/')) {
    const code = hash.replace('#/verify/', '').trim();
    if (code) return decodeURIComponent(code);
  } else if (hash === '#/verify') {
    return 'POS-CPR-2026-042AH';
  }

  return null;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [verifyCode, setVerifyCode] = useState<string | null>(() => parseVerifyRoute());

  // Listen to popstate (browser back/forward button)
  useEffect(() => {
    const handleLocationChange = () => {
      setVerifyCode(parseVerifyRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const openAuth = (tab: 'signin' | 'signup') => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const openVerify = (code: string = 'POS-CPR-2026-042AH') => {
    setVerifyCode(code);
    window.history.pushState({}, '', `/verify/${code}`);
  };

  const closeVerify = () => {
    setVerifyCode(null);
    window.history.pushState({}, '', '/');
  };

  // If a public verification route is active, render the unauthenticated PublicVerifyPage
  if (verifyCode) {
    return (
      <PublicVerifyPage
        initialCode={verifyCode}
        onBack={closeVerify}
      />
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onAuthClick={openAuth}
        onVerifyClick={() => openVerify('POS-CPR-2026-042AH')}
      />
      <main>
        <Hero onAuthClick={openAuth} />
        <Features />
        <HowItWorks />
        <DemoReport onVerifyClick={(code) => openVerify(code)} />
        <Pricing onAuthClick={openAuth} />
        <CTA onAuthClick={openAuth} />
      </main>
      <Footer onVerifyClick={() => openVerify('POS-CPR-2026-042AH')} />
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
