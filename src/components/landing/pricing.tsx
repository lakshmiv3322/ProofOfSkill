import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
}

const tiers = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For trade classrooms establishing biometric kinematics and digital assessment.',
    features: [
      'Up to 50 active trainees',
      'Up to 2 certified trades',
      'Client-side BlazePose estimation',
      'Deterministic DTW rubric engine',
      '1 assessor seat',
      'Public QR verification registry',
    ],
    cta: 'Start 14-Day Pilot',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$399',
    period: '/month',
    description: 'For vocational institutes scaling multi-trade assessments across departments.',
    features: [
      'Up to 500 active trainees',
      'Unlimited trade rubrics',
      'BlazePose + DTW kinematics engine',
      '10 assessor seats',
      'AI coaching narrative layer',
      'Multi-tenant institutional analytics',
      'Automated SHA-256 PDF certificates',
      'Transparent appeals workflow',
      'Priority technical support',
    ],
    cta: 'Launch Growth Tier',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For state systems, accrediting bodies, and multi-campus vocational colleges.',
    features: [
      'Unlimited trainees & cohorts',
      'Custom gold-standard exemplar clips',
      'Dedicated Edge Function runners',
      'Unlimited assessor & admin seats',
      'SSO & SAML integration',
      'LMS & Student Information System API',
      'Custom institutional certificate templates',
      'Dedicated compliance manager',
      '24/7 SLA & on-premise options',
    ],
    cta: 'Contact Enterprise Team',
    highlighted: false,
  },
];

export function Pricing({ onAuthClick }: PricingProps) {
  return (
    <section id="pricing" className="relative bg-slate-950/40 py-24 sm:py-32 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
            Transparent institutional <span className="text-emerald-400">pricing</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Predictable per-institute licensing. All plans include PostgreSQL row-level security and immutable audit logging.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'relative flex flex-col transition-all duration-300 hud-border bg-slate-900/60',
                tier.highlighted
                  ? 'border-2 border-emerald-500 shadow-2xl shadow-emerald-950/40 lg:scale-105 bg-slate-900/90'
                  : 'border border-slate-800 hover:border-slate-700 hover:shadow-lg'
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-emerald-500 text-slate-950 font-bold font-mono text-[10px] shadow-lg">
                    Recommended for Institutes
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white font-display">{tier.name}</CardTitle>
                <CardDescription className="text-xs text-slate-400 min-h-[2.5rem] leading-relaxed">
                  {tier.description}
                </CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-white font-serif">{tier.price}</span>
                  <span className="text-xs font-mono text-slate-400">{tier.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-slate-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  className={cn(
                    'w-full text-xs font-semibold',
                    tier.highlighted
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'
                  )}
                  size="lg"
                  variant={tier.highlighted ? 'default' : 'outline'}
                  onClick={() => onAuthClick('signup')}
                >
                  <Zap className="mr-2 h-3.5 w-3.5" />
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500 font-mono">
          All tiers include zero raw video storage compliance, multi-tenant row-level security, and audit ledger immutability.
        </p>
      </div>
    </section>
  );
}
