import { Video, Brain, Eye, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Video,
    step: '01',
    title: 'Record & Submit',
    description:
      'Trainees record a video of their practical skill — welding, carpentry, electrical, any trade — and submit it through the platform.',
  },
  {
    icon: Brain,
    step: '02',
    title: 'AI Analysis',
    description:
      'Pose detection and motion analysis extract performance data. The AI scores each rubric criterion and flags areas for human review.',
  },
  {
    icon: Eye,
    step: '03',
    title: 'Human Review',
    description:
      'Certified assessors review AI scores, add timestamped video feedback, and make the final scoring decision.',
  },
  {
    icon: Award,
    step: '04',
    title: 'Verifiable Certificate',
    description:
      'Passing scores generate a shareable certificate with a unique verification code. Employers can verify authenticity instantly.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From video to{' '}
            <span className="text-primary">verified credential</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four steps. Transparent at every stage. Built for institutional scale.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.step} className="relative">
              <Card className="h-full border-border/60">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-bold text-muted-foreground/30">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              {/* Connector arrow */}
              {idx < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                  <div className="h-px w-6 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
