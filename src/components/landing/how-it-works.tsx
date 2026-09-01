import { Video, Brain, Eye, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Video,
    step: '01',
    title: 'Capture Kinematics',
    tag: 'BlazePose Stream',
    description:
      'Trainees record live video or upload demonstration clips. Client-side pose estimation tracks 33 skeletal joints without uploading raw video.',
  },
  {
    icon: Brain,
    step: '02',
    title: 'Server DTW Alignment',
    tag: 'Deterministic Math',
    description:
      'An isolated Edge Function executes Dynamic Time Warping against certified gold-standard exemplars, calculating exact rate, depth, and posture deltas.',
  },
  {
    icon: Eye,
    step: '03',
    title: 'Supervised Evaluation',
    tag: 'Assessor Review',
    description:
      'Certified domain assessors review deterministic rubric scores alongside LLM coaching insights, performing human calibration before approval.',
  },
  {
    icon: Award,
    step: '04',
    title: 'Mint Cryptographic Proof',
    tag: 'SHA-256 Ledger',
    description:
      'Approved scores generate an official PDF certificate with embedded QR codes linking to public unauthenticated registry verification.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-slate-950/60 py-24 sm:py-32 border-y border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
            From motion capture to{' '}
            <span className="text-emerald-400">cryptographic credential</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Four deterministic steps. Transparent at every layer. Built for institutional rigor.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.step} className="relative">
              <Card className="h-full border-slate-800 bg-slate-900/60 hover:border-emerald-500/30 transition-all hud-border">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-slate-700">
                      {step.step}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white font-display">{step.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              {idx < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block z-20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
