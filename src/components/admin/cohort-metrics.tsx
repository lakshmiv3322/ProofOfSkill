import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
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
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// CohortMetrics — Institution Admin analytics overview
// ─────────────────────────────────────────────────────────────

const MONTHLY_SUBMISSIONS = [
  { month: 'Mar', submissions: 22, passed: 15 },
  { month: 'Apr', submissions: 30, passed: 21 },
  { month: 'May', submissions: 28, passed: 18 },
  { month: 'Jun', submissions: 38, passed: 27 },
  { month: 'Jul', submissions: 35, passed: 26 },
  { month: 'Aug', submissions: 47, passed: 38 },
];

interface KPI {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  trend: 'up' | 'down' | 'neutral';
  trendVal: string;
  good: boolean;
}

const KPIS: KPI[] = [
  {
    label: 'Pass Rate',
    value: '80.9%',
    sub: 'Aug 2026 · 38/47',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    trend: 'up',
    trendVal: '+3.4%',
    good: true,
  },
  {
    label: 'Avg. Processing Time',
    value: '1.8 hrs',
    sub: 'Submit to certificate',
    icon: Clock,
    iconColor: 'text-blue-500',
    trend: 'down',
    trendVal: '-0.4 hrs',
    good: true,
  },
  {
    label: 'Assessor Hours Saved',
    value: '94 hrs',
    sub: 'vs. fully manual review',
    icon: Zap,
    iconColor: 'text-amber-500',
    trend: 'up',
    trendVal: '+12 hrs',
    good: true,
  },
  {
    label: 'Active Trainees',
    value: '120',
    sub: 'Northgate Technical College',
    icon: Users,
    iconColor: 'text-purple-500',
    trend: 'up',
    trendVal: '+8 this month',
    good: true,
  },
  {
    label: 'Certificates Issued',
    value: '38',
    sub: 'Aug 2026',
    icon: Award,
    iconColor: 'text-teal-500',
    trend: 'up',
    trendVal: '+12 vs Jul',
    good: true,
  },
  {
    label: 'Avg. Score (Passed)',
    value: '79.2%',
    sub: 'Weighted across all trades',
    icon: TrendingUp,
    iconColor: 'text-primary',
    trend: 'up',
    trendVal: '+1.8%',
    good: true,
  },
];

const TRADE_BREAKDOWN = [
  { trade: 'SMAW Welding', passRate: 78, submissions: 28 },
  { trade: 'Carpentry', passRate: 84, submissions: 13 },
  { trade: 'CPR / First-Aid', passRate: 82, submissions: 6 },
];

export function CohortMetrics() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cohort Metrics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Northgate Technical College · August 2026
          </p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
          Growth Plan
        </Badge>
      </div>

      {/* KPI grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', kpi.iconColor)} />
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-[10px] font-medium',
                      kpi.good ? 'text-emerald-500' : 'text-red-500'
                    )}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {kpi.trendVal}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">{kpi.value}</p>
                <p className="mt-0.5 text-xs font-medium">{kpi.label}</p>
                <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bar chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Monthly Submission Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={MONTHLY_SUBMISSIONS}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
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
              />
              <Bar dataKey="submissions" name="Submitted" radius={[4, 4, 0, 0]} fill="hsl(var(--muted-foreground))" opacity={0.5} />
              <Bar dataKey="passed" name="Passed" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground opacity-50 inline-block" /> Submitted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary inline-block" /> Passed
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Trade breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pass Rate by Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TRADE_BREAKDOWN.map((t) => (
              <div key={t.trade} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t.trade}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{t.submissions} submissions</span>
                    <span
                      className={cn(
                        'font-semibold',
                        t.passRate >= 80
                          ? 'text-emerald-500'
                          : t.passRate >= 70
                          ? 'text-amber-500'
                          : 'text-red-500'
                      )}
                    >
                      {t.passRate}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      t.passRate >= 80 ? 'bg-emerald-500' : t.passRate >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${t.passRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
