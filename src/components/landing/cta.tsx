import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface CTAProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
}

export function CTA({ onAuthClick }: CTAProps) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-16 sm:px-16 sm:py-24">
          {/* Background glow */}
          <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute inset-0 bg-grid opacity-[0.03]" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                <ShieldCheck className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-4xl md:text-5xl">
              Ready to transform how your institute{' '}
              <span className="text-primary">assesses skill?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-background/70">
              Join the institutions moving from paper checklists to transparent, AI-assisted,
              verifiable skill assessment.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-8 text-base"
                onClick={() => onAuthClick('signup')}
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background px-8 text-base"
                onClick={() => onAuthClick('signup')}
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
