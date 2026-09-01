import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Video,
  Brain,
  FileCheck,
  ArrowRight,
  Play,
  Sparkles,
} from 'lucide-react';

interface HeroProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
}

export function Hero({ onAuthClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background */}
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Assisted Assessment, Human Reviewed
          </Badge>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Turn skill videos into{' '}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              verifiable evidence
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            ProofOfSkill transforms practical skill videos into transparent, rubric-based
            feedback and shareable, verifiable certificates — built for trade schools,
            vocational programs, and enterprise training.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" onClick={() => onAuthClick('signup')}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#demo-report">
                <Play className="mr-2 h-4 w-4" />
                View Demo Report
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              Video-based assessment
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI rubric scoring
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              Verifiable certificates
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Multi-tenant secure
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
