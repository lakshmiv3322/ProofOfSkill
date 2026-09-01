import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  ChevronRight,
  Clock,
  GraduationCap,
  Inbox,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// ReviewQueue — Assessor view: pending submission cards
// ─────────────────────────────────────────────────────────────

type QueueStatus = 'ai_processed' | 'under_review' | 'submitted';

interface QueueItem {
  id: string;
  trainee: string;
  cohort: string;
  trade: string;
  submittedAt: string;
  status: QueueStatus;
  aiConfidence: number;
  aiScore: number;
  attempts: number;
  urgent: boolean;
}

const QUEUE: QueueItem[] = [
  {
    id: 'sub-010',
    trainee: 'Marcus Webb',
    cohort: '2026-A',
    trade: 'SMAW Horizontal Fillet Weld',
    submittedAt: '2h ago',
    status: 'ai_processed',
    aiConfidence: 91,
    aiScore: 74,
    attempts: 1,
    urgent: false,
  },
  {
    id: 'sub-011',
    trainee: 'Priya Nair',
    cohort: '2026-A',
    trade: 'Carpentry — Wall Framing',
    submittedAt: '4h ago',
    status: 'ai_processed',
    aiConfidence: 68,
    aiScore: 58,
    attempts: 2,
    urgent: true,
  },
  {
    id: 'sub-012',
    trainee: 'Jordan Lee',
    cohort: '2026-B',
    trade: 'SMAW Horizontal Fillet Weld',
    submittedAt: '6h ago',
    status: 'under_review',
    aiConfidence: 85,
    aiScore: 89,
    attempts: 1,
    urgent: false,
  },
  {
    id: 'sub-013',
    trainee: 'Dana Okafor',
    cohort: '2026-B',
    trade: 'CPR / First-Aid',
    submittedAt: '1d ago',
    status: 'ai_processed',
    aiConfidence: 79,
    aiScore: 65,
    attempts: 3,
    urgent: true,
  },
  {
    id: 'sub-014',
    trainee: 'Sam Torres',
    cohort: '2026-A',
    trade: 'Carpentry — Wall Framing',
    submittedAt: '1d ago',
    status: 'submitted',
    aiConfidence: 0,
    aiScore: 0,
    attempts: 1,
    urgent: false,
  },
];

const STATUS_CONFIG: Record<QueueStatus, { label: string; color: string }> = {
  ai_processed: {
    label: 'AI Ready',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  under_review: {
    label: 'In Review',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  submitted: {
    label: 'Processing',
    color: 'bg-muted text-muted-foreground',
  },
};

function confidenceColor(confidence: number) {
  if (confidence >= 85) return 'text-emerald-500';
  if (confidence >= 70) return 'text-amber-500';
  return 'text-red-500';
}

interface ReviewQueueProps {
  onReview: (id: string) => void;
}

export function ReviewQueue({ onReview }: ReviewQueueProps) {
  const pendingCount = QUEUE.filter((q) => q.status !== 'under_review').length;
  const urgentCount = QUEUE.filter((q) => q.urgent).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Review Queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trainee submissions awaiting your evaluation.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5">
            <Inbox className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">{pendingCount}</span>
            <span className="text-xs text-muted-foreground">pending</span>
          </div>
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5">
              <Zap className="h-4 w-4 text-red-500" />
              <span className="text-sm font-semibold text-red-600">{urgentCount}</span>
              <span className="text-xs text-red-600">urgent</span>
            </div>
          )}
        </div>
      </div>

      {/* Urgent notice */}
      {urgentCount > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{urgentCount} submissions</span> involve
            trainees on their 2nd or 3rd attempt — prioritise these reviews.
          </p>
        </div>
      )}

      {/* Queue cards */}
      <div className="space-y-3">
        {QUEUE.map((item) => {
          const statusCfg = STATUS_CONFIG[item.status];
          const canReview = item.status !== 'submitted';
          return (
            <Card
              key={item.id}
              className={cn(
                'transition-all duration-200',
                item.urgent && 'border-red-500/30',
                canReview && 'hover:shadow-md'
              )}
            >
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Left: trainee info */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {item.trainee
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{item.trainee}</span>
                        {item.urgent && (
                          <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-600 bg-red-500/5">
                            {item.attempts}
                            {item.attempts === 2 ? 'nd' : 'rd'} attempt
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          {item.cohort}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{item.trade}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: status + time */}
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge variant="outline" className={cn('text-xs', statusCfg.color)}>
                      {statusCfg.label}
                    </Badge>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.submittedAt}
                    </span>
                  </div>
                </div>

                {/* AI score row */}
                {item.status !== 'submitted' && (
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[140px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Brain className="h-3 w-3" />
                          AI Score
                        </span>
                        <span className="text-xs font-semibold">{item.aiScore}%</span>
                      </div>
                      <Progress
                        value={item.aiScore}
                        className="h-1.5"
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className={cn('font-semibold', confidenceColor(item.aiConfidence))}>
                        {item.aiConfidence}%
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={item.urgent ? 'default' : 'outline'}
                      disabled={!canReview}
                      onClick={() => onReview(item.id)}
                      className="ml-auto"
                    >
                      Review
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {item.status === 'submitted' && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    AI analysis in progress — check back shortly.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
