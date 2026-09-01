import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Award,
  CheckCircle2,
  Clock,
  FileVideo,
  TrendingUp,
  XCircle,
  Hourglass,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// MyProgress — Trainee personal timeline + analytics
// ─────────────────────────────────────────────────────────────

type SubmissionStatus = 'passed' | 'failed' | 'in_review' | 'pending';

interface SubmissionRecord {
  id: string;
  trade: string;
  submittedAt: string;
  reviewedAt: string | null;
  status: SubmissionStatus;
  score: number | null;
  certCode: string | null;
}

const SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'sub-001',
    trade: 'SMAW Horizontal Fillet Weld',
    submittedAt: '2026-08-28',
    reviewedAt: '2026-08-30',
    status: 'passed',
    score: 83.5,
    certCode: 'POS-SMAW-2026-001SC',
  },
  {
    id: 'sub-002',
    trade: 'SMAW Horizontal Fillet Weld',
    submittedAt: '2026-07-14',
    reviewedAt: '2026-07-16',
    status: 'failed',
    score: 61.0,
    certCode: null,
  },
  {
    id: 'sub-003',
    trade: 'CPR / First-Aid Chest Compression',
    submittedAt: '2026-09-01',
    reviewedAt: null,
    status: 'in_review',
    score: null,
    certCode: null,
  },
  {
    id: 'sub-004',
    trade: 'Carpentry — Wall Framing',
    submittedAt: '2026-06-10',
    reviewedAt: '2026-06-12',
    status: 'passed',
    score: 77.0,
    certCode: 'POS-CARP-2026-004SC',
  },
  {
    id: 'sub-005',
    trade: 'Carpentry — Wall Framing',
    submittedAt: '2026-05-20',
    reviewedAt: '2026-05-22',
    status: 'failed',
    score: 54.0,
    certCode: null,
  },
];

const SCORE_TREND = [
  { month: 'May', score: 54 },
  { month: 'Jun', score: 77 },
  { month: 'Jul', score: 61 },
  { month: 'Aug', score: 83.5 },
];

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; badge: string }
> = {
  passed: {
    label: 'Passed',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    color: 'text-red-500',
    badge: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
  in_review: {
    label: 'In Review',
    icon: Hourglass,
    color: 'text-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
};

export function MyProgress() {
  const stats = useMemo(() => {
    const scored = SUBMISSIONS.filter((s) => s.score !== null);
    const passed = SUBMISSIONS.filter((s) => s.status === 'passed').length;
    const avgScore = scored.length
      ? scored.reduce((acc, s) => acc + (s.score ?? 0), 0) / scored.length
      : 0;
    return { total: SUBMISSIONS.length, passed, avgScore };
  }, []);

  const certs = SUBMISSIONS.filter((s) => s.certCode);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your personal submission history, score trends, and earned certificates.
        </p>
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Submissions', value: stats.total, icon: FileVideo, color: 'text-primary' },
          { label: 'Passed', value: stats.passed, icon: CheckCircle2, color: 'text-emerald-500' },
          {
            label: 'Avg. Score',
            value: `${stats.avgScore.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-blue-500',
          },
          { label: 'Certificates', value: certs.length, icon: Award, color: 'text-amber-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex flex-col gap-1">
            <CardHeader className="pb-1 pt-4 px-4">
              <div className={cn('flex items-center gap-1.5 text-xs font-medium', color)}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <p className="text-2xl font-extrabold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score trend chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={SCORE_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(v: number) => [`${v}%`, 'Score']}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#scoreGrad)"
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          {/* Pass threshold line label */}
          <p className="mt-1 text-center text-[10px] text-muted-foreground">
            Pass threshold: 70% — your last score: <span className="font-semibold text-emerald-500">83.5%</span>
          </p>
        </CardContent>
      </Card>

      {/* Submission timeline */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Submission History
      </h2>
      <div className="mb-8 space-y-0">
        {SUBMISSIONS.map((sub, idx) => {
          const cfg = STATUS_CONFIG[sub.status];
          const Icon = cfg.icon;
          return (
            <div key={sub.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background',
                    sub.status === 'passed' && 'border-emerald-500',
                    sub.status === 'failed' && 'border-red-500',
                    sub.status === 'in_review' && 'border-amber-500',
                    sub.status === 'pending' && 'border-border'
                  )}
                >
                  <Icon className={cn('h-4 w-4', cfg.color)} />
                </div>
                {idx < SUBMISSIONS.length - 1 && (
                  <div className="w-px flex-1 bg-border" style={{ minHeight: '24px' }} />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{sub.trade}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {sub.submittedAt}
                      {sub.reviewedAt ? ` · Reviewed ${sub.reviewedAt}` : ' · Awaiting review'}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn('text-xs', cfg.badge)}>
                    {cfg.label}
                    {sub.score !== null ? ` · ${sub.score}%` : ''}
                  </Badge>
                </div>
                {sub.score !== null && (
                  <div className="mt-2">
                    <Progress
                      value={sub.score}
                      className="h-1.5"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="mb-6" />

      {/* Certificates shelf */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Earned Certificates
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {certs.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
          >
            <ShieldCheck className="h-8 w-8 shrink-0 text-amber-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{sub.trade}</p>
              <p className="text-xs text-muted-foreground">Score: {sub.score}%</p>
              <p className="mt-0.5 font-mono text-[10px] text-amber-600">{sub.certCode}</p>
            </div>
            <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        ))}
        {certs.length === 0 && (
          <p className="col-span-2 text-sm text-muted-foreground">
            No certificates earned yet. Pass an assessment to receive your first certificate.
          </p>
        )}
      </div>
    </div>
  );
}
