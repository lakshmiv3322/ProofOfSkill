-- ─────────────────────────────────────────────────────────────
-- ProofOfSkill — RLS Hardening & Policy Refinement Migration
-- File: supabase/migrations/20260901000001_rls_hardening.sql
-- ─────────────────────────────────────────────────────────────

-- 1. Ensure RLS is explicitly enabled on all 13 tables
ALTER TABLE institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pose_landmark_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$;

-- Helper function to get current user's institute_id
CREATE OR REPLACE FUNCTION public.current_user_institute_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT institute_id FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$;

-- Helper function to get current user's internal user id (public.users.id)
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$;

-- ─────────────────────────────────────────────────────────────
-- CLEANUP PREVIOUS POLICIES FOR RE-CREATION WITH STRICT RULES
-- ─────────────────────────────────────────────────────────────

-- Submissions policies
DROP POLICY IF EXISTS "submissions: trainee own" ON submissions;
DROP POLICY IF EXISTS "submissions: assessor/admin tenant read" ON submissions;
DROP POLICY IF EXISTS "submissions: trainee insert" ON submissions;
DROP POLICY IF EXISTS "submissions: trainee update own draft" ON submissions;
DROP POLICY IF EXISTS "submissions: assessor/admin update" ON submissions;

-- Scores policies
DROP POLICY IF EXISTS "scores: tenant read" ON scores;
DROP POLICY IF EXISTS "scores: assessor/admin write" ON scores;

-- Feedback policies
DROP POLICY IF EXISTS "feedback: tenant read" ON feedback;
DROP POLICY IF EXISTS "feedback: tenant insert" ON feedback;

-- Certificates policies
DROP POLICY IF EXISTS "certificates: trainee own" ON certificates;
DROP POLICY IF EXISTS "certificates: staff tenant read" ON certificates;
DROP POLICY IF EXISTS "certificates: admin write" ON certificates;

-- Audit log policies
DROP POLICY IF EXISTS "audit_log: admin read own institute" ON audit_log;
DROP POLICY IF EXISTS "audit_log: service role insert" ON audit_log;
DROP POLICY IF EXISTS "audit_log: no delete" ON audit_log;

-- ─────────────────────────────────────────────────────────────
-- REFINED STRICT RLS POLICIES
-- ─────────────────────────────────────────────────────────────

-- SUBMISSIONS TABLE
-- Trainees can read their own submissions
CREATE POLICY "submissions_select_trainee" ON submissions
  FOR SELECT TO authenticated
  USING (
    trainee_id = public.current_user_id()
  );

-- Assessors and Admins can read submissions in their own institute
CREATE POLICY "submissions_select_staff" ON submissions
  FOR SELECT TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('assessor', 'institute_admin', 'platform_admin')
  );

-- Trainees can insert their own submissions in their own institute
CREATE POLICY "submissions_insert_trainee" ON submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    trainee_id = public.current_user_id()
    AND institute_id = public.current_user_institute_id()
  );

-- Trainees can update their own draft/submitted submissions
CREATE POLICY "submissions_update_trainee" ON submissions
  FOR UPDATE TO authenticated
  USING (
    trainee_id = public.current_user_id()
    AND status IN ('draft', 'submitted')
  )
  WITH CHECK (
    trainee_id = public.current_user_id()
  );

-- Assessors and Admins can update submissions in their institute
CREATE POLICY "submissions_update_staff" ON submissions
  FOR UPDATE TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('assessor', 'institute_admin', 'platform_admin')
  );

-- Trainees can delete their own draft submissions
CREATE POLICY "submissions_delete_trainee" ON submissions
  FOR DELETE TO authenticated
  USING (
    trainee_id = public.current_user_id()
    AND status = 'draft'
  );


-- SCORES TABLE
-- Trainees can read scores for their own submissions
CREATE POLICY "scores_select_trainee" ON scores
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = scores.submission_id
        AND s.trainee_id = public.current_user_id()
    )
  );

-- Assessors and Admins can read scores in their institute
CREATE POLICY "scores_select_staff" ON scores
  FOR SELECT TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('assessor', 'institute_admin', 'platform_admin')
  );

-- Trainees can insert scores generated for their own submissions (e.g. AI pipeline evaluation)
CREATE POLICY "scores_insert_trainee" ON scores
  FOR INSERT TO authenticated
  WITH CHECK (
    institute_id = public.current_user_institute_id()
    AND EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = scores.submission_id
        AND s.trainee_id = public.current_user_id()
    )
  );

-- Assessors and Admins can write (insert/update/delete) scores in their institute
CREATE POLICY "scores_write_staff" ON scores
  FOR ALL TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('assessor', 'institute_admin', 'platform_admin')
  );


-- FEEDBACK TABLE
-- Trainees can read feedback on their own submissions
CREATE POLICY "feedback_select_trainee" ON feedback
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = feedback.submission_id
        AND s.trainee_id = public.current_user_id()
    )
  );

-- Assessors and Admins can read feedback in their institute
CREATE POLICY "feedback_select_staff" ON feedback
  FOR SELECT TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('assessor', 'institute_admin', 'platform_admin')
  );

-- Trainees can insert AI feedback on their own submissions
CREATE POLICY "feedback_insert_trainee" ON feedback
  FOR INSERT TO authenticated
  WITH CHECK (
    institute_id = public.current_user_institute_id()
    AND EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = feedback.submission_id
        AND s.trainee_id = public.current_user_id()
    )
  );

-- Assessors and Admins can insert feedback in their institute
CREATE POLICY "feedback_insert_staff" ON feedback
  FOR INSERT TO authenticated
  WITH CHECK (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('assessor', 'institute_admin', 'platform_admin')
  );


-- CERTIFICATES TABLE
-- Trainees can read their own certificates
CREATE POLICY "certificates_select_trainee" ON certificates
  FOR SELECT TO authenticated
  USING (
    trainee_id = public.current_user_id()
  );

-- Staff (Assessors and Admins) can read certificates in their institute
CREATE POLICY "certificates_select_staff" ON certificates
  FOR SELECT TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('assessor', 'institute_admin', 'platform_admin')
  );

-- Admins can write (insert/update/delete) certificates in their institute
CREATE POLICY "certificates_write_admin" ON certificates
  FOR ALL TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('institute_admin', 'platform_admin')
  );

-- PUBLIC ACCESS DENIED FOR DIRECT CERTIFICATE SELECT:
-- No policy is created for `anon` role on `certificates`.
-- Public verification MUST go through `get_certificate_by_code` RPC function.


-- AUDIT_LOG TABLE
-- Append-only log. Authenticated users can insert logs for their institute.
CREATE POLICY "audit_log_insert_authenticated" ON audit_log
  FOR INSERT TO authenticated
  WITH CHECK (
    institute_id = public.current_user_institute_id()
  );

-- Institute/Platform Admins can read audit logs in their institute
CREATE POLICY "audit_log_select_admin" ON audit_log
  FOR SELECT TO authenticated
  USING (
    institute_id = public.current_user_institute_id()
    AND public.current_user_role() IN ('institute_admin', 'platform_admin')
  );

-- No UPDATE or DELETE policies exist for audit_log, enforcing append-only behavior.
