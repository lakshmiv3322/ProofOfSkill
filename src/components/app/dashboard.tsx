import { useState, lazy, Suspense } from 'react';
import { AppShell } from '@/components/app/app-shell';
import { RoleSwitcher } from '@/components/app/role-switcher';
import { AppProvider, useApp, DEMO_MODE } from '@/context/app-context';
import { Loader2 } from 'lucide-react';

// Code-split Trainee views
const SkillCatalog = lazy(() =>
  import('@/components/trainee/skill-catalog').then((m) => ({ default: m.SkillCatalog }))
);
const AssessmentInstructions = lazy(() =>
  import('@/components/trainee/assessment-instructions').then((m) => ({ default: m.AssessmentInstructions }))
);
const MyProgress = lazy(() =>
  import('@/components/trainee/my-progress').then((m) => ({ default: m.MyProgress }))
);
const VideoCapture = lazy(() =>
  import('@/components/trainee/video-capture').then((m) => ({ default: m.VideoCapture }))
);

// Code-split Assessor views
const ReviewQueue = lazy(() =>
  import('@/components/assessor/review-queue').then((m) => ({ default: m.ReviewQueue }))
);
const EvaluationPage = lazy(() =>
  import('@/components/assessor/evaluation-page').then((m) => ({ default: m.EvaluationPage }))
);

// Code-split Admin views
const CohortMetrics = lazy(() =>
  import('@/components/admin/cohort-metrics').then((m) => ({ default: m.CohortMetrics }))
);
const BillingCounter = lazy(() =>
  import('@/components/admin/billing-counter').then((m) => ({ default: m.BillingCounter }))
);
const RubricEditor = lazy(() =>
  import('@/components/admin/rubric-editor').then((m) => ({ default: m.RubricEditor }))
);
const AuditLogExplorer = lazy(() =>
  import('@/components/admin/audit-log-explorer').then((m) => ({ default: m.AuditLogExplorer }))
);

const PublicVerifyPage = lazy(() =>
  import('@/components/verify/public-verify-page').then((m) => ({ default: m.PublicVerifyPage }))
);

function ViewLoading() {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center p-8 text-muted-foreground">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-xs font-medium">Loading view...</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Default view per role
// ─────────────────────────────────────────────────────────────

const DEFAULT_VIEW: Record<string, string> = {
  trainee: 'catalog',
  assessor: 'queue',
  institute_admin: 'metrics',
  platform_admin: 'metrics',
};

// ─────────────────────────────────────────────────────────────
// DashboardInner — rendered inside AppProvider so useApp works
// ─────────────────────────────────────────────────────────────

function DashboardInner() {
  const { activeRole } = useApp();
  const [activeView, setActiveView] = useState(DEFAULT_VIEW[activeRole] ?? 'catalog');
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [verifyingCertCode, setVerifyingCertCode] = useState<string | null>(null);

  // When the role switches, reset to the default view for that role
  const handleNavigate = (view: string) => {
    setActiveView(view);
    setEvaluatingId(null);
    setVerifyingCertCode(null);
  };

  // Sync default view when role changes via the role switcher
  const resolvedView =
    DEFAULT_VIEW[activeRole] !== undefined && DEFAULT_VIEW[activeRole] !== activeView
      ? DEFAULT_VIEW[activeRole]
      : activeView;

  const renderView = () => {
    // If viewing a certificate
    if (verifyingCertCode) {
      return (
        <PublicVerifyPage
          initialCode={verifyingCertCode}
          onBack={() => setVerifyingCertCode(null)}
        />
      );
    }

    // ── Trainee ────────────────────────────────────────────
    if (activeRole === 'trainee') {
      if (resolvedView === 'catalog') {
        return (
          <SkillCatalog
            onStartAssessment={() => setActiveView('instructions')}
          />
        );
      }
      if (resolvedView === 'instructions') {
        return (
          <AssessmentInstructions 
            onBack={() => setActiveView('catalog')} 
            onStartCapture={() => setActiveView('capture')} 
          />
        );
      }
      if (resolvedView === 'capture') {
        return (
          <VideoCapture 
            onBack={() => setActiveView('instructions')} 
            onComplete={() => setActiveView('progress')} 
          />
        );
      }
      if (resolvedView === 'progress') {
        return (
          <MyProgress
            onViewCertificate={(code) => setVerifyingCertCode(code)}
          />
        );
      }
    }

    // ── Assessor ───────────────────────────────────────────
    if (activeRole === 'assessor') {
      if (resolvedView === 'queue' && !evaluatingId) {
        return (
          <ReviewQueue
            onReview={(id) => {
              setEvaluatingId(id);
              setActiveView('evaluate');
            }}
          />
        );
      }
      if (resolvedView === 'evaluate' || evaluatingId) {
        return (
          <EvaluationPage
            onBack={() => {
              setEvaluatingId(null);
              setActiveView('queue');
            }}
          />
        );
      }
    }

    // ── Institute Admin ────────────────────────────────────
    if (activeRole === 'institute_admin') {
      if (resolvedView === 'metrics') return <CohortMetrics />;
      if (resolvedView === 'billing') return <BillingCounter />;
      if (resolvedView === 'rubric') return <RubricEditor />;
      if (resolvedView === 'audit') return <AuditLogExplorer />;
    }

    // ── Platform Admin (reuses admin views for demo) ───────
    if (activeRole === 'platform_admin') {
      if (resolvedView === 'metrics') return <CohortMetrics />;
      if (resolvedView === 'audit') return <AuditLogExplorer />;
    }

    // Fallback
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
        <div>
          <p className="text-lg font-medium">View not found</p>
          <p className="text-sm">Navigate using the sidebar.</p>
        </div>
      </div>
    );
  };

  return (
    // pt-8 only needed when the dev RoleSwitcher bar is visible
    <div className={DEMO_MODE ? 'pt-8 h-screen flex flex-col' : 'h-screen flex flex-col'}>
      {DEMO_MODE && <RoleSwitcher />}
      <div className="flex-1 overflow-hidden">
        <AppShell activeView={resolvedView} onNavigate={handleNavigate}>
          <Suspense fallback={<ViewLoading />}>
            {renderView()}
          </Suspense>
        </AppShell>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard — exported entry point (wraps with AppProvider)
// ─────────────────────────────────────────────────────────────

export function Dashboard() {
  return (
    <AppProvider>
      <DashboardInner />
    </AppProvider>
  );
}
