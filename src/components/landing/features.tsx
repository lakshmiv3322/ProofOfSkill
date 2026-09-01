import {
  Video,
  Brain,
  FileCheck,
  ShieldCheck,
  BarChart3,
  Users,
  Eye,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: Video,
    title: 'Video-Based Submissions',
    description:
      'Trainees record practical skill demonstrations. Any device, any trade, any environment.',
  },
  {
    icon: Brain,
    title: 'AI-Assisted Rubric Scoring',
    description:
      'Pose detection and motion analysis map performance against configurable rubric criteria automatically.',
  },
  {
    icon: Eye,
    title: 'Human Review Workflow',
    description:
      'Assessors review AI scores, add timestamped feedback, and make the final call. AI assists — humans decide.',
  },
  {
    icon: FileCheck,
    title: 'Verifiable Certificates',
    description:
      'Every passing score generates a tamper-proof certificate with a unique verification code. Shareable, auditable.',
  },
  {
    icon: BarChart3,
    title: 'Institutional Analytics',
    description:
      'Track cohort performance, assessor calibration, and program outcomes across your entire institute.',
  },
  {
    icon: Users,
    title: 'Multi-Tenant by Design',
    description:
      'Row-level security ensures every institute sees only its own data. Roles for trainees, assessors, and admins.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit Trail',
    description:
      'Every action — submissions, scores, appeals, certificate issuance — is logged immutably for compliance.',
  },
  {
    icon: Award,
    title: 'Appeals Process',
    description:
      'Built-in appeals workflow lets trainees contest scores transparently, with full review history.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to{' '}
            <span className="text-primary">assess with confidence</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete platform for practical skill assessment — from video submission to
            verifiable certification.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/60 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
