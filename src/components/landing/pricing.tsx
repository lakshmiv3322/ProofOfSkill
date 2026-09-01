import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
}

const tiers = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For small programs getting started with digital assessment.',
    features: [
      'Up to 50 trainees',
      'Up to 2 trades',
      'AI-assisted scoring',
      '1 assessor seat',
      'Basic rubric builder',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$399',
    period: '/month',
    description: 'For growing institutes with multiple trades and cohorts.',
    features: [
      'Up to 500 trainees',
      'Unlimited trades',
      'AI-assisted scoring',
      '10 assessor seats',
      'Advanced rubric builder',
      'Institutional analytics dashboard',
      'Certificate verification portal',
      'Appeals workflow',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large institutions and multi-campus deployments.',
    features: [
      'Unlimited trainees',
      'Unlimited trades',
      'Custom AI model training',
      'Unlimited assessor seats',
      'SSO & SAML integration',
      'Custom branding & certificates',
      'API access & LMS integration',
      'Dedicated success manager',
      'SLA & 24/7 support',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function Pricing({ onAuthClick }: PricingProps) {
  return (
    <section id="pricing" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Pricing that scales with{' '}
            <span className="text-primary">your program</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'relative flex flex-col transition-all duration-300',
                tier.highlighted
                  ? 'border-primary shadow-xl lg:scale-105'
                  : 'border-border/60 hover:border-border hover:shadow-md'
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-primary text-primary-foreground shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription className="text-sm">{tier.description}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  <span className="text-sm font-medium text-muted-foreground">{tier.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={tier.highlighted ? 'default' : 'outline'}
                  onClick={() => onAuthClick('signup')}
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          All plans include multi-tenant security, audit logging, and verifiable certificates.
        </p>
      </div>
    </section>
  );
}
