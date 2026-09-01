// ─────────────────────────────────────────────────────────────
// src/lib/supabase/audit.ts
// Server-side audit log helper.
// Because the RLS policy only allows service_role inserts to
// audit_log, real writes must go through Edge Functions in
// production.  In this transitional Phase 1 state we write
// directly from the client with the authenticated session (the
// insert policy will be switched to allow authenticated users
// from their own institute once the Edge Function layer is in
// place in Phase 3).
// ─────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase/client';
import type { AuditLog } from '@/types/database';

type AuditEntry = Omit<AuditLog, 'id' | 'created_at'>;

/**
 * Write an audit log entry.
 * Silently swallows errors so audit failures never block user flows.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('audit_log').insert(entry as any);
    if (error) {
      console.warn('[audit] Failed to write audit entry:', error.message, entry);
    }
  } catch (e) {
    console.warn('[audit] Unexpected error:', e);
  }
}
