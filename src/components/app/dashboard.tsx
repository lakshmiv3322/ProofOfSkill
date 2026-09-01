import { useState } from 'react';
import { AppShell } from '@/components/app/app-shell';
import { RoleSwitcher } from '@/components/app/role-switcher';
import { AppProvider, useApp } from '@/context/app-context';

// Trainee views
import { SkillCatalog } from '@/components/trainee/skill-catalog';
import { AssessmentInstructions } from '@/components/trainee/assessment-instructions';
import { MyProgress } from '@/components/trainee/my-progress';
import { VideoCapture } from '@/components/trainee/video-capture';

// Assessor views
import { ReviewQueue } from '@/components/assessor/review-queue';
import { EvaluationPage } from '@/components/assessor/evaluation-page';

// Admin views
import { CohortMetrics } from '@/components/admin/cohort-metrics';
import { BillingCounter } from '@/components/admin/billing-counter';
import { RubricEditor } from '@/components/admin/rubric-editor';

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

  // When the role switches, reset to the default view for that role
  const handleNavigate = (view: string) => {
    setActiveView(view);
    setEvaluatingId(null);
  };

  // Sync default view when role changes via the role switcher
  const resolvedView =
    DEFAULT_VIEW[activeRole] !== undefined && DEFAULT_VIEW[activeRole] !== activeView
      ? DEFAULT_VIEW[activeRole]
      : activeView;

  const renderView = () => {
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
        return <MyProgress />;
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
    }

    // ── Platform Admin (reuses admin views for demo) ───────
    if (activeRole === 'platform_admin') {
      if (resolvedView === 'metrics') return <CohortMetrics />;
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
    // pt-8 pushes content below the 32px-tall RoleSwitcher bar
    <div className="pt-8 h-screen flex flex-col">
      <RoleSwitcher />
      <div className="flex-1 overflow-hidden">
        <AppShell activeView={resolvedView} onNavigate={handleNavigate}>
          {renderView()}
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
