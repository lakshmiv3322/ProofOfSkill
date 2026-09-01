import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Hash,
} from 'lucide-react';

const rubricCriteria = [
  {
    id: 'cpr-rate',
    label: 'Compression Rate (100–120 BPM)',
    score: 100,
    weight: 30,
    source: 'dtw',
    note: 'Optimal rate achieved: 108.4 BPM. Peak-to-peak frequency aligns with standard AHA guidelines.',
  },
  {
    id: 'cpr-depth',
    label: 'Compression Depth (5.0–6.0 cm)',
    score: 95,
    weight: 30,
    source: 'dtw',
    note: 'Sternum displacement excursion: 5.4 cm. Excellent kinetic force transfer.',
  },
  {
    id: 'cpr-recoil',
    label: 'Full Chest Recoil',
    score: 90,
    weight: 20,
    source: 'dtw',
    note: 'Incomplete recoil: 3.2%. Minimal leaning detected across 30 compression strokes.',
  },
  {
    id: 'cpr-posture',
    label: 'Arm Posture & Vertical Lock',
    score: 85,
    weight: 20,
    source: 'dtw',
    note: 'Shoulder-over-wrist angle deviation: 8.4°. Force applied perpendicular to sternum.',
  },
] as const;

const feedbackItems = [
  {
    timestamp: '0:14',
    criterion: 'Compression Rate',
    body: 'Your rhythm was exceptionally steady throughout the 30 compressions, maintaining optimal cerebral perfusion pressure.',
  },
  {
    timestamp: '0:28',
    criterion: 'Recoil Completeness',
    body: 'Ensure you allow the chest to return completely to resting baseline between cycles 18 and 22 to maximize cardiac filling.',
  },
  {
    timestamp: null,
    criterion: null,
    body: 'Outstanding demonstration overall. You met the clinical competency threshold with a weighted score of 94.5%. Deterministic DTW signals confirm excellent arm lock and cadence.',
  },
];

function scoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-cyan-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
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
      <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Interactive Audit Report
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
            Verifiable assessment <span className="text-emerald-400">telemetry</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Inspect deterministic rubric scores, timestamped kinematics, and cryptographic credentials from an accredited assessment.
          </p>
        </div>

        {/* Report Card */}
        <div className="mx-auto mt-16 max-w-5xl">
          <Card className="overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl hud-border">
            {/* Report header */}
            <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-5 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-white font-display">CPR / First-Aid Chest Compression</h3>
                    <Badge variant="secondary" className="font-mono text-xs bg-slate-800 text-slate-300">
                      Standard: AHA-2026-CPR
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Apex Institute</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Candidate: Alex Mercer</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Submitted: Aug 28, 2026</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-emerald-400 font-serif">{weightedScore.toFixed(1)}%</div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Certified Score</div>
                  </div>
                  {passed && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Left: Video preview + meta */}
                <div className="lg:col-span-2 border-r border-slate-800 p-6 sm:p-8 bg-slate-950/40">
                  <div className="group relative aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                    <img
                      src="https://images.pexels.com/photos/5845964/pexels-photo-5845964.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                      alt="Kinematic motion capture"
                      className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/20">
                      <PlayCircle className="h-14 w-14 text-emerald-400/90 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-mono text-white">
                      0:30 (30 Cycles)
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Status</span>
                      <Badge className="gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        Certified Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Reviewed
                      </span>
                      <span className="text-slate-200">Aug 30, 2026</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5" /> Code
                      </span>
                      <span className="font-bold text-amber-400">
                        POS-CPR-2026-042AH
                      </span>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">BlazePose Confidence</span>
                      <span className="text-emerald-400 font-bold">98.4%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Certifying Assessor</span>
                      <span className="text-slate-200">Lead Assessor ID: 01</span>
                    </div>
                  </div>
                </div>

                {/* Right: Rubric scores + feedback */}
                <div className="lg:col-span-3 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Deterministic Rubric Breakdown
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">Tap criterion to view telemetry</span>
                  </div>

                  <div className="space-y-4">
                    {rubricCriteria.map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          setActiveCriterion(activeCriterion === c.id ? null : c.id)
                        }
                        className="w-full text-left p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200">{c.label}</span>
                            <Badge
                              variant="outline"
                              className="text-[9px] font-mono px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            >
                              DTW Math
                            </Badge>
                          </div>
                          <span className={`text-xs font-bold font-mono ${scoreColor(c.score)}`}>
                            {c.score}/100
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={c.score}
                            className="h-1.5 flex-1 bg-slate-800"
                          />
                          <span className="text-[10px] font-mono text-slate-400 w-12 text-right">
                            {c.weight}% wt
                          </span>
                        </div>
                        {activeCriterion === c.id && (
                          <div className="mt-2.5 animate-fade-up rounded-lg bg-slate-950 p-3 text-xs text-slate-300 border border-slate-800 font-mono">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-400" />
                              <span>{c.note}</span>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <Separator className="my-6 bg-slate-800" />

                  {/* Assessor feedback */}
                  <h4 className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Assessor Coaching Narrative
                  </h4>
                  <div className="space-y-3">
                    {feedbackItems.map((fb, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 rounded-lg border border-slate-800/80 bg-slate-900/30 p-3 text-xs"
                      >
                        {fb.timestamp ? (
                          <Badge variant="secondary" className="shrink-0 font-mono text-[10px] bg-slate-800 text-slate-300 h-6">
                            {fb.timestamp}
                          </Badge>
                        ) : (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center text-emerald-400">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          {fb.criterion && (
                            <span className="text-xs font-semibold text-white block mb-0.5">
                              {fb.criterion}
                            </span>
                          )}
                          <p className="text-xs leading-relaxed text-slate-400">
                            {fb.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certificate verification banner */}
                  <div
                    onClick={() => {
                      if (onVerifyClick) {
                        onVerifyClick('POS-CPR-2026-042AH');
                      } else {
                        window.open('/verify/POS-CPR-2026-042AH', '_blank');
                      }
                    }}
                    className="mt-6 flex items-center gap-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 cursor-pointer hover:bg-emerald-950/50 transition-colors shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 shrink-0">
                      <Award className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Cryptographic Certificate Issued</span>
                        <Badge className="bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold">
                          Active
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 font-mono">
                        Code: <span className="font-bold text-amber-300">POS-CPR-2026-042AH</span>
                      </p>
                      <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Click to view public verifiable credential & QR code
                      </p>
                    </div>
                    <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <AlertCircle className="h-4 w-4 text-emerald-400" />
            <span>Third-party verifiers can inspect any certificate instantly via the public verification registry.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
