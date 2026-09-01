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
    title: 'Kinematic Video Submissions',
    badge: 'BlazePose 33-pt',
    description:
      'Trainees record practical skill demonstrations. Client-side BlazePose extracts 33 joints frame-by-frame with zero raw video retention.',
  },
  {
    icon: Brain,
    title: 'Deterministic DTW Scoring',
    badge: 'Server-side Edge',
    description:
      'Fast Dynamic Time Warping aligns performance curves mathematically against certified gold-standard reference clips.',
  },
  {
    icon: Eye,
    title: 'Supervised Assessor Review',
    badge: 'Double Signature',
    description:
      'Certified assessors review deterministic scores, override or calibrate criteria, and add timestamped feedback before issuance.',
  },
  {
    icon: FileCheck,
    title: 'Cryptographic Certificates',
    badge: 'SHA-256 Verified',
    description:
      'Passing submissions generate official PDF certificates with immutable cryptographic verification hashes and public QR links.',
  },
  {
    icon: BarChart3,
    title: 'Institutional Telemetry',
    badge: 'Cohort Analytics',
    description:
      'Track cohort performance, assessor calibration distributions, and program completion outcomes across your entire institute.',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Isolation',
    badge: 'Row-Level Security',
    description:
      'PostgreSQL Row-Level Security ensures complete data boundaries for institutes, trainees, assessors, and administrators.',
  },
  {
    icon: ShieldCheck,
    title: 'Immutable Audit Ledger',
    badge: 'Append-Only',
    description:
      'Every submission, scoring event, human override, and certificate mint is permanently timestamped for regulatory compliance.',
  },
  {
    icon: Award,
    title: 'Transparent Appeals Workflow',
    badge: 'Due Process',
    description:
      'Built-in appeals mechanism enables trainees to contest evaluations transparently with comprehensive historic telemetry.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
            Engineered for <span className="text-emerald-400">objective certification</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            A complete platform for practical vocational assessment, deterministic kinematics, and verifiable credentialing.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20 hud-border"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-slate-950">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                    {feature.badge}
                  </span>
                </div>
                <CardTitle className="text-base font-semibold text-white font-display">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm leading-relaxed text-slate-400">
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
