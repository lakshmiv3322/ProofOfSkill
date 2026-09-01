import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Menu, X, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

interface NavbarProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
  onVerifyClick?: () => void;
}

const navLinks = [
  { label: 'Kinematics', href: '#features' },
  { label: 'Protocol', href: '#how-it-works' },
  { label: 'Calibration Ledger', href: '#demo-report' },
  { label: 'Licensing', href: '#pricing' },
];

export function Navbar({ onAuthClick, onVerifyClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-hairline bg-basalt/90 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-steel border border-hairline text-brass shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-headline font-bold text-porcelain tracking-tight block leading-tight">ProofOfSkill</span>
            <span className="text-[9px] font-mono text-slateText block -mt-0.5 tracking-wider uppercase">Kinematic Verification</span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex font-mono text-xs">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slateText transition-colors hover:text-porcelain"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {onVerifyClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onVerifyClick}
              className="h-8 gap-1.5 border-brass/40 text-brass hover:bg-brass/10 font-mono text-xs"
            >
              <Lock className="h-3 w-3" />
              Public Verifier
            </Button>
          )}
          {isAuthenticated ? (
            <>
              <Badge variant="secondary" className="gap-1.5 font-mono text-xs bg-steel border-hairline text-slate-200">
                <span className="h-2 w-2 rounded-full bg-laser" />
                {user?.full_name}
              </Badge>
              <Button variant="outline" size="sm" onClick={signOut} className="h-8 font-mono text-xs border-hairline text-slate-300 hover:text-white">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => onAuthClick('signin')} className="h-8 font-mono text-xs text-slate-300 hover:text-white">
                Sign In
              </Button>
              <Button size="sm" onClick={() => onAuthClick('signup')} className="h-8 font-mono text-xs font-semibold bg-laser text-basalt hover:bg-cyan-300">
                Start Pilot
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-hairline bg-basalt px-4 py-4 md:hidden font-mono text-xs">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-slateText transition-colors hover:text-porcelain py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-hairline">
              {onVerifyClick && (
                <Button
                  variant="outline"
                  className="w-full justify-center gap-1.5 border-brass/40 text-brass text-xs font-mono"
                  onClick={() => {
                    setMobileOpen(false);
                    onVerifyClick();
                  }}
                >
                  <Lock className="h-3.5 w-3.5" />
                  Public Registry Verifier
                </Button>
              )}
              {isAuthenticated ? (
                <Button variant="outline" className="flex-1 font-mono text-xs" onClick={signOut}>
                  Sign Out
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 font-mono text-xs border-hairline text-slate-300"
                    onClick={() => {
                      setMobileOpen(false);
                      onAuthClick('signin');
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="flex-1 font-mono text-xs font-semibold bg-laser text-basalt hover:bg-cyan-300"
                    onClick={() => {
                      setMobileOpen(false);
                      onAuthClick('signup');
                    }}
                  >
                    Start Pilot
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
