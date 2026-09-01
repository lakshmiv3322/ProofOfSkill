import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  PlayCircle,
  MessageSquare,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const rubricCriteria = [
  {
    id: 'arc-length',
    label: 'Arc Length Control',
    score: 85,
    weight: 25,
    source: 'ai',
    note: 'Consistent arc length. Minor deviation at start.',
  },
  {
    id: 'travel-speed',
    label: 'Travel Speed',
    score: 78,
    weight: 25,
    source: 'ai',
    note: 'Slightly fast at the end. Bead narrows.',
  },
  {
    id: 'bead-placement',
    label: 'Bead Placement',
    score: 90,
    weight: 20,
    source: 'human',
    note: 'Excellent bead placement, well-centered.',
  },
  {
    id: 'slag-removal',
    label: 'Slag Removal & Cleanup',
    score: 72,
    weight: 15,
    source: 'human',
    note: 'Some residual slag at the stop point.',
  },
  {
    id: 'safety',
    label: 'Safety & PPE Compliance',
    score: 100,
    weight: 15,
    source: 'human',
    note: 'Full PPE compliance throughout.',
  },
] as const;

const feedbackItems = [
  {
    timestamp: '0:12',
    criterion: 'Arc Length Control',
    body: 'Good arc length control overall. Focus on maintaining the gap at the start — you tend to drift slightly long in the first 5 seconds.',
  },
  {
    timestamp: '1:35',
    criterion: 'Travel Speed',
    body: 'Travel speed is consistent until the final third. The bead narrows noticeably — practice maintaining hand speed through the entire pass.',
  },
  {
    timestamp: null,
    criterion: null,
    body: 'Strong submission overall. You passed with a weighted score of 83.5%. Focus areas: travel speed consistency and slag cleanup at stop points. Your bead placement and safety compliance are excellent.',
  },
];

function scoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-primary';
  if (score >= 50) return 'text-chart-3';
  return 'text-destructive';
}

function scoreBg(score: number): string {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-primary';
  if (score >= 50) return 'bg-chart-3';
  return 'bg-destructive';
}

interface DemoReportProps {
  onVerifyClick?: (code: string) => void;
}

export function DemoReport({ onVerifyClick }: DemoReportProps) {
  const [activeCriterion, setActiveCriterion] = useState<string | null>(null);

  const weightedScore = rubricCriteria.reduce(
    (acc, c) => acc + (c.score * c.weight) / 100,
    0
  );
  const passed = weightedScore >= 70;

  return (
    <section id="demo-report" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Interactive Example
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            A Verifiable Interactive{' '}
            <span className="text-primary">Skill Report</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See exactly what trainees, assessors, and employers see — rubric scores, timestamped
            feedback, and a verifiable certificate. This is a real assessment from our demo institute.
          </p>
        </div>

        {/* Report Card */}
        <div className="mx-auto mt-16 max-w-5xl">
          <Card className="overflow-hidden border-border/60 shadow-xl">
            {/* Report header */}
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">SMAW Shielded Metal Arc Welding</h3>
                    <Badge variant="secondary" className="font-normal">Horizontal Fillet Weld</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Northgate Technical College &middot; Trainee: Sarah Chen &middot; Submitted Aug 28, 2026
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-primary">{weightedScore.toFixed(1)}%</div>
                    <div className="text-xs font-medium text-muted-foreground">Weighted Score</div>
                  </div>
                  {passed && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle2 className="h-7 w-7 text-green-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Left: Video placeholder + meta */}
                <div className="lg:col-span-2 border-r border-border p-6 sm:p-8">
                  <div className="group relative aspect-video overflow-hidden rounded-lg bg-foreground/5">
                    <img
                      src="https://images.pexels.com/photos/5845964/pexels-photo-5845964.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                      alt="Welding submission"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/20">
                      <PlayCircle className="h-14 w-14 text-white/90 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                      2:45
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className="gap-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/10">
                        <CheckCircle2 className="h-3 w-3" />
                        Scored
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Reviewed
                      </span>
                      <span className="font-medium">Aug 30, 2026</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5" /> Certificate
                      </span>
                      <span className="font-mono text-xs font-medium text-primary">
                        POS-SMAW-2026-001SC
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Confidence</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Assessor</span>
                      <span className="font-medium">Mike Rodriguez</span>
                    </div>
                  </div>
                </div>

                {/* Right: Rubric scores + feedback */}
                <div className="lg:col-span-3 p-6 sm:p-8">
                  <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Rubric Breakdown
                  </h4>
                  <p className="mb-5 text-xs text-muted-foreground">
                    Click a criterion to see detailed feedback
                  </p>

                  <div className="space-y-4">
                    {rubricCriteria.map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          setActiveCriterion(activeCriterion === c.id ? null : c.id)
                        }
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{c.label}</span>
                            <Badge
                              variant="outline"
                              className="text-[10px] font-normal px-1.5 py-0"
                            >
                              {c.source === 'ai' ? 'AI' : 'Human'}
                            </Badge>
                          </div>
                          <span className={`text-sm font-bold ${scoreColor(c.score)}`}>
                            {c.score}
                            <span className="text-muted-foreground font-normal">/100</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={c.score}
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {c.weight}% wt
                          </span>
                        </div>
                        {activeCriterion === c.id && (
                          <div className="mt-2 animate-fade-up rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                              <span>{c.note}</span>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Assessor feedback */}
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Assessor Feedback
                  </h4>
                  <div className="space-y-3">
                    {feedbackItems.map((fb, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:border-primary/30"
                      >
                        {fb.timestamp ? (
                          <Badge variant="secondary" className="shrink-0 font-mono text-xs">
                            {fb.timestamp}
                          </Badge>
                        ) : (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div>
                          {fb.criterion && (
                            <span className="text-xs font-semibold text-foreground">
                              {fb.criterion}
                            </span>
                          )}
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {fb.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certificate banner */}
                  <div
                    onClick={() => {
                      if (onVerifyClick) {
                        onVerifyClick('POS-SMAW-2026-001SC');
                      } else {
                        window.open('/verify/POS-SMAW-2026-001SC', '_blank');
                      }
                    }}
                    className="mt-6 flex items-center gap-4 rounded-xl border border-green-500/30 bg-green-500/5 p-4 cursor-pointer hover:bg-green-500/10 transition-colors shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 shrink-0">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">Certificate Issued</span>
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
                          Active
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Verification code: <span className="font-mono font-semibold text-foreground">POS-SMAW-2026-001SC</span> &middot; Valid until Aug 30, 2028
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        Click to view public verifiable credential & QR code →
                      </p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Employers can verify any certificate instantly using the verification code — no login required.
          </div>
        </div>
      </div>
    </section>
  );
}
