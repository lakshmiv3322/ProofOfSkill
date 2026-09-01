import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PoseCanvas } from './pose-canvas';
import { evaluateSubmission } from '@/lib/scoring/rubric-engine';
import { generateFullFeedback } from '@/lib/llm/feedback-generator';
import { useApp } from '@/context/app-context';
import { mockClient } from '@/lib/mock/client';
import {
  Camera,
  CheckCircle2,
  Circle,
  Square,
  Upload,
  AlertCircle,
  Loader2,
  Brain,
  Video,
  Zap,
  Sun,
  ScanLine,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RubricResult } from '@/lib/scoring/rubric-engine';
import type { FullFeedback } from '@/lib/llm/feedback-generator';

// ─────────────────────────────────────────────────────────────
// VideoCapture — Learner Capture View
// Supports two capture modes: Record (live) and Upload (file).
// Pre-capture quality checks animate as sliding indicators
// before allowing the session to start.
// ─────────────────────────────────────────────────────────────

interface VideoCaptureProps {
  onBack: () => void;
  onComplete: () => void;
}

type CaptureState = 'preflight' | 'recording' | 'processing' | 'results';
type CaptureMode  = 'record' | 'upload';

// ── Pre-flight check definition ───────────────────────────────

interface QualityCheck {
  id: string;
  label: string;
  passedLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  /** ms after mount before this check resolves */
  delay: number;
}

const QUALITY_CHECKS: QualityCheck[] = [
  {
    id: 'lighting',
    label: 'Checking Lighting…',
    passedLabel: 'Lighting: Optimal',
    icon: Sun,
    delay: 900,
  },
  {
    id: 'framing',
    label: 'Checking Framing…',
    passedLabel: 'Framing: Center Trainee',
    icon: ScanLine,
    delay: 1800,
  },
  {
    id: 'occlusion',
    label: 'Checking Occlusion…',
    passedLabel: 'Occlusion: No joints blocked',
    icon: Eye,
    delay: 2700,
  },
];

// ── Processing pipeline steps ─────────────────────────────────

const PIPELINE_STEPS = [
  { threshold: 20, msg: 'Extracting video frames…' },
  { threshold: 40, msg: 'Running MediaPipe Pose Estimation…' },
  { threshold: 65, msg: 'Applying Dynamic Time Warping vs. reference clip…' },
  { threshold: 85, msg: 'Executing deterministic rubric engine…' },
  { threshold: 100, msg: 'Generating coaching narrative…' },
];

// ── Scoring result shape ──────────────────────────────────────

interface ScoringResults {
  rubricResult: RubricResult;
  feedback: FullFeedback;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function VideoCapture({ onBack, onComplete }: VideoCaptureProps) {
  const { db } = useApp();

  const [state, setState] = useState<CaptureState>('preflight');
  const [mode,  setMode]  = useState<CaptureMode>('record');

  // ── Pre-flight check state ────────────────────────────────
  const [checks, setChecks] = useState<Record<string, boolean>>({
    lighting: false,
    framing:  false,
    occlusion: false,
  });
  // Fill progress: 0→100 per check, used for the animated bar
  const [fillPct, setFillPct] = useState<Record<string, number>>({
    lighting: 0,
    framing:  0,
    occlusion: 0,
  });

  const allChecksPassed = QUALITY_CHECKS.every((c) => checks[c.id]);

  // Animate quality-check bars sequentially
  useEffect(() => {
    if (state !== 'preflight') return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    QUALITY_CHECKS.forEach((check) => {
      // Start filling the bar from 0→100 over ~700 ms
      timers.push(
        setTimeout(() => {
          let pct = 0;
          const iv = setInterval(() => {
            pct = Math.min(100, pct + 8);
            setFillPct((prev) => ({ ...prev, [check.id]: pct }));
            if (pct >= 100) {
              clearInterval(iv);
              setChecks((prev) => ({ ...prev, [check.id]: true }));
            }
          }, 50);
          intervals.push(iv);
        }, check.delay)
      );
    });

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [state]);

  // ── Recording timer ───────────────────────────────────────
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    if (state === 'recording') {
      iv = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    }
    return () => clearInterval(iv);
  }, [state]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Upload handler ────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setState('processing');
    runPipeline();
  };

  // ── Processing pipeline ───────────────────────────────────
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMsg, setProcessingMsg]  = useState(PIPELINE_STEPS[0].msg);

  const [results, setResults] = useState<ScoringResults | null>(null);

  const runPipeline = () => {
    let progress = 0;

    const iv = setInterval(() => {
      progress = Math.min(100, progress + (Math.random() * 12 + 3));
      setProcessingProgress(progress);

      // Update step message
      const step = [...PIPELINE_STEPS].reverse().find((s) => progress >= s.threshold);
      if (step) setProcessingMsg(step.msg);

      if (progress >= 100) {
        clearInterval(iv);
        executeScoringEngine();
      }
    }, 450);
  };

  const handleStopRecording = () => {
    setState('processing');
    runPipeline();
  };

  const executeScoringEngine = async () => {
    // 1. Fetch the CPR rubric — always query by explicit ID to guarantee correctness
    const rubricResult = db.from('rubrics').select({
      filter: (r) => r.id === 'rubric-002',
    });
    const rubricConfig = rubricResult.data[0]?.config;

    if (!rubricConfig) {
      setProcessingMsg('Error: CPR rubric config not found. Contact your administrator.');
      return;
    }

    // 2. DETERMINISTIC SCORING — Math only. LLM never sets this score.
    const evalResult = evaluateSubmission('live-submission', rubricConfig);

    // 3. LLM Narrative Generation — sweeps all criteria with per-criterion 2 s failsafe
    const feedback = await generateFullFeedback(evalResult.deltas);

    setResults({ rubricResult: evalResult, feedback });
    setState('results');
  };

  // ── Reset ─────────────────────────────────────────────────
  const handleRetake = () => {
    setState('preflight');
    setMode('record');
    setChecks({ lighting: false, framing: false, occlusion: false });
    setFillPct({ lighting: 0, framing: 0, occlusion: 0 });
    setRecordingTime(0);
    setProcessingProgress(0);
    setProcessingMsg(PIPELINE_STEPS[0].msg);
    setResults(null);
  };

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={onBack}
          disabled={state === 'recording' || state === 'processing'}
        >
          ← Cancel
        </Button>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          CPR Chest Compression
        </Badge>
      </div>

      {/* ── Capture Mode Tabs (only visible in preflight) ─── */}
      {state === 'preflight' && (
        <div className="mb-4 flex gap-2 p-1 bg-muted rounded-lg w-fit">
          <button
            onClick={() => setMode('record')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              mode === 'record'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Camera className="h-3.5 w-3.5" />
            Record
          </button>
          <button
            onClick={() => setMode('upload')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              mode === 'upload'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>
      )}

      {/* ── Main Video / Canvas Area ─────────────────────── */}
      <Card className="relative overflow-hidden bg-black/5 border-2 border-border/50 aspect-[4/3] sm:aspect-video mb-6 flex flex-col items-center justify-center">

        {/* Dark background */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-700">
          <Video className="w-24 h-24 opacity-10" />
        </div>

        {/* MediaPipe Skeleton Overlay */}
        {(state === 'preflight' || state === 'recording') && (
          <PoseCanvas isRecording={state === 'recording'} />
        )}

        {/* Pre-flight Quality Check Overlay */}
        {state === 'preflight' && (
          <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-20">
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-3">
              Pre-Capture Quality Checks
            </p>
            <div className="space-y-2 max-w-xs">
              {QUALITY_CHECKS.map((check) => {
                const Icon = check.icon;
                const passed = checks[check.id];
                const pct    = fillPct[check.id];
                return (
                  <div key={check.id} className="flex items-center gap-2">
                    <div className={cn(
                      'flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-colors duration-500',
                      passed ? 'bg-emerald-500/90' : 'bg-white/10'
                    )}>
                      {passed
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        : <Icon className="h-3 w-3 text-white/50" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-[11px] font-medium truncate transition-colors duration-500',
                        passed ? 'text-emerald-400' : 'text-white/60'
                      )}>
                        {passed ? check.passedLabel : check.label}
                      </p>
                      {/* Animated fill bar */}
                      <div className="mt-0.5 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-75',
                            passed ? 'bg-emerald-500' : 'bg-amber-400'
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {state === 'recording' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full text-white z-20">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Processing Overlay */}
        {state === 'processing' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-8 text-center text-white backdrop-blur-sm z-20">
            <div className="relative mb-5">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <Zap className="absolute inset-0 m-auto h-5 w-5 text-primary/80" />
            </div>
            <p className="text-lg font-semibold mb-1">Analyzing Submission</p>
            <p className="text-sm text-slate-300 mb-6 min-h-[1.25rem]">{processingMsg}</p>
            <Progress value={processingProgress} className="w-full max-w-md h-2 mb-2" />
            <p className="text-xs text-slate-500">{Math.round(processingProgress)}% complete</p>
          </div>
        )}
      </Card>

      {/* ── Controls Area ─────────────────────────────────── */}
      <div className="flex flex-col items-center">

        {/* Preflight controls */}
        {state === 'preflight' && mode === 'record' && (
          <div className="text-center space-y-3">
            <Button
              size="lg"
              className="rounded-full w-20 h-20 p-0 hover:scale-105 transition-transform border-4 border-primary/20"
              disabled={!allChecksPassed}
              onClick={() => setState('recording')}
            >
              <Circle className="h-10 w-10 text-destructive fill-destructive" />
            </Button>
            <p className="text-sm text-muted-foreground">
              {!allChecksPassed ? 'Running quality checks…' : 'All checks passed — tap to record'}
            </p>
          </div>
        )}

        {state === 'preflight' && mode === 'upload' && (
          <div className="text-center space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              size="lg"
              className="gap-2 px-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Select Video File
            </Button>
            <p className="text-xs text-muted-foreground">
              MP4 or MOV · max 500 MB · min 60 seconds
            </p>
          </div>
        )}

        {state === 'recording' && (
          <div className="text-center space-y-3">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-20 h-20 p-0 hover:scale-105 transition-transform border-4 border-destructive/30 bg-destructive/10 hover:bg-destructive/20"
              onClick={handleStopRecording}
            >
              <Square className="h-8 w-8 text-destructive fill-destructive" />
            </Button>
            <p className="text-sm text-muted-foreground animate-pulse">
              Recording in progress… perform 30 compressions
            </p>
          </div>
        )}

        {/* ── Results View ───────────────────────────────── */}
        {state === 'results' && results && (
          <ResultsPanel
            results={results}
            onComplete={onComplete}
            onRetake={handleRetake}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ResultsPanel
// ─────────────────────────────────────────────────────────────

function ResultsPanel({
  results,
  onComplete,
  onRetake,
}: {
  results: ScoringResults;
  onComplete: () => void;
  onRetake: () => void;
}) {
  const { rubricResult, feedback } = results;
  const { overallScore, deltas, metrics } = rubricResult;

  const passed = overallScore >= 70;

  return (
    <div className="w-full space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500">

      {/* Header row */}
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">AI Analysis Complete</h2>
        {feedback.anyFallback && (
          <Badge variant="outline" className="ml-auto text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
            ⚡ Partial Fallback Active
          </Badge>
        )}
      </div>

      {/* Score + Key Metrics */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className={cn(
          'border-2',
          passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-destructive/30 bg-destructive/5'
        )}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rubric Score</p>
              <p className="text-4xl font-extrabold mt-1 tracking-tight">{overallScore}<span className="text-lg font-medium text-muted-foreground">%</span></p>
              <p className={cn('text-xs font-semibold mt-0.5', passed ? 'text-emerald-600' : 'text-destructive')}>
                {passed ? '✓ Passes threshold (70%)' : '✗ Below threshold (70%)'}
              </p>
            </div>
            <div className={cn(
              'h-14 w-14 rounded-full border-4 flex items-center justify-center text-2xl',
              passed ? 'border-emerald-500 bg-emerald-500/10' : 'border-destructive bg-destructive/10'
            )}>
              {passed ? <CheckCircle2 className="h-7 w-7 text-emerald-500" /> : <AlertCircle className="h-7 w-7 text-destructive" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">DTW Pipeline Metrics</p>
            <ul className="text-sm space-y-1.5">
              <MetricRow label="Rate" value={`${metrics.actualBpm} BPM`} target="100–120 BPM" ok={metrics.actualBpm >= 100 && metrics.actualBpm <= 120} />
              <MetricRow label="Depth" value={`${metrics.actualDepthCm.toFixed(1)} cm`} target="5–6 cm" ok={metrics.actualDepthCm >= 5.0 && metrics.actualDepthCm <= 6.0} />
              <MetricRow label="Recoil Error" value={`${metrics.recoilVariancePct}%`} target="< 5%" ok={metrics.recoilVariancePct <= 5} />
              <MetricRow label="Posture Score" value={`${metrics.postureVarianceScore}`} target="< 15" ok={metrics.postureVarianceScore < 15} />
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Per-Criterion Breakdown */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold mb-3">Criterion Breakdown</p>
          <div className="space-y-3">
            {deltas.map((d) => (
              <div key={d.criterionId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">×{d.weight}%</span>
                    <span className={cn('text-xs font-bold', d.score >= 80 ? 'text-emerald-600' : d.score >= 60 ? 'text-amber-600' : 'text-destructive')}>
                      {d.score}/100
                    </span>
                  </div>
                </div>
                <Progress value={d.score} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{d.delta}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coaching Narrative — one card per criterion */}
      <div className="space-y-3">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Coaching Feedback
        </p>
        {feedback.sections.map((section) => (
          <Card key={section.criterionId} className="border-primary/15 bg-primary/3">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-primary">{section.label}</p>
                {section.isFallback && (
                  <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                    Fallback Template
                  </Badge>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <Button
          className="flex-1"
          size="lg"
          onClick={() => {
            mockClient.logAudit({
              institute_id: 'inst-001',
              actor_id: 'user-001',
              actor_role: 'trainee',
              action: 'submission.submitted',
              entity_type: 'submission',
              entity_id: `sub-cpr-${Date.now()}`,
              metadata: {
                trade: 'CPR / First-Aid Chest Compression',
                overall_score: overallScore,
                dtw_metrics: metrics,
                state_before: {
                  status: 'draft',
                  score: null,
                  reviewed_at: null,
                },
                state_after: {
                  status: 'under_review',
                  overall_score: overallScore,
                  criteria_scores: rubricResult.criteriaScores,
                  submitted_at: new Date().toISOString(),
                },
              },
              ip_address: '192.168.1.45',
            });
            onComplete();
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Submit for Human Review
        </Button>
        <Button variant="outline" size="lg" onClick={onRetake}>
          Retake Video
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function MetricRow({
  label, value, target, ok,
}: {
  label: string; value: string; target: string; ok: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 ml-auto">
        <span className={cn('text-[10px]', ok ? 'text-emerald-600' : 'text-amber-600')}>
          {ok ? '✓' : '⚠'} {target}
        </span>
        <strong className="text-foreground">{value}</strong>
      </div>
    </li>
  );
}
