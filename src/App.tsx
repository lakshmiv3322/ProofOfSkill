import { useState } from 'react';
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

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  const openAuth = (tab: 'signin' | 'signup') => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={openAuth} />
      <main>
        <Hero onAuthClick={openAuth} />
        <Features />
        <HowItWorks />
        <DemoReport />
        <Pricing onAuthClick={openAuth} />
        <CTA onAuthClick={openAuth} />
      </main>
      <Footer />
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
