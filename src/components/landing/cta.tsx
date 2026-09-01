import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, Video } from 'lucide-react';

interface CTAProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
}

export function CTA({ onAuthClick }: CTAProps) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-emerald-500/30 px-6 py-16 sm:px-16 sm:py-24 shadow-2xl shadow-emerald-950/30 hud-border">
          {/* Background glow */}
          <div className="absolute left-1/2 top-0 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <ShieldCheck className="h-7 w-7" />
              </div>
            </div>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl font-display">
              Ready to modernize your institute with{' '}
              <span className="text-emerald-400">biometric verification?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-sm sm:text-base text-slate-300">
              Join leading trade schools and vocational departments moving from subjective paper scoring to deterministic, verifiable skill assessment.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-8 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                onClick={() => onAuthClick('signup')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Start 14-Day Pilot
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 border-slate-700 bg-slate-950/60 hover:bg-slate-800 text-slate-200 px-8 text-sm"
                onClick={() => onAuthClick('signin')}
              >
                <Video className="mr-2 h-4 w-4 text-emerald-400" />
                Sign In to Portal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
