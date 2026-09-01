import type {
  TableName,
  Row,
  User,
  Institute,
  Trade,
  Rubric,
  ReferenceClip,
  Submission,
  Score,
  Feedback,
  Certificate,
  Appeal,
  UsageCounter,
  AuditLog,
  PoseLandmarkSet,
  UserRole,
} from '@/types/database';
import {
  seedInstitutes,
  seedUsers,
  seedTrades,
  seedRubrics,
  seedReferenceClips,
  seedSubmissions,
  seedScores,
  seedFeedback,
  seedCertificates,
  seedAppeals,
  seedUsageCounters,
  seedAuditLog,
  seedPoseLandmarkSets,
} from './seed-data';

// ─────────────────────────────────────────────────────────────
// Mock Database — in-memory store that mimics a FastAPI + Supabase
// backend. All tenant-facing queries are automatically scoped
// by the active user's `institute_id`, mirroring RLS behavior.
// ─────────────────────────────────────────────────────────────

type Tables = {
  institutes: Institute[];
  users: User[];
  trades: Trade[];
  rubrics: Rubric[];
  reference_clips: ReferenceClip[];
  submissions: Submission[];
  pose_landmark_sets: PoseLandmarkSet[];
  scores: Score[];
  feedback: Feedback[];
  certificates: Certificate[];
  appeals: Appeal[];
  usage_counters: UsageCounter[];
  audit_log: AuditLog[];
};

function freshStore(): Tables {
  return {
    institutes: structuredClone(seedInstitutes),
    users: structuredClone(seedUsers),
    trades: structuredClone(seedTrades),
    rubrics: structuredClone(seedRubrics),
    reference_clips: structuredClone(seedReferenceClips),
    submissions: structuredClone(seedSubmissions),
    pose_landmark_sets: structuredClone(seedPoseLandmarkSets),
    scores: structuredClone(seedScores),
    feedback: structuredClone(seedFeedback),
    certificates: structuredClone(seedCertificates),
    appeals: structuredClone(seedAppeals),
    usage_counters: structuredClone(seedUsageCounters),
    audit_log: structuredClone(seedAuditLog),
  };
}

// Tables that are NOT tenant-scoped (global / cross-tenant).
const GLOBAL_TABLES: ReadonlySet<TableName> = new Set<TableName>([
  'institutes',
  'usage_counters',
]);

// ── Query options ─────────────────────────────────────────────

export interface QueryOptions<T extends TableName> {
  /** Override the tenant filter (e.g. platform_admin viewing all). */
  bypassTenant?: boolean;
  /** Custom filter predicate applied after tenant scoping. */
  filter?: (row: Row<T>) => boolean;
  /** Column to order by. */
  orderBy?: keyof Row<T>;
  /** 'asc' | 'desc' — default 'asc'. */
  order?: 'asc' | 'desc';
  /** Limit number of results. */
  limit?: number;
}

export interface QueryResult<T extends TableName> {
  data: Row<T>[];
  error: string | null;
}

// ── MockClient ────────────────────────────────────────────────

export class MockClient {
  private store: Tables = freshStore();
  private currentUser: User | null = null;

  // ── Auth ────────────────────────────────────────────────────

  /** Sign in with email. Looks up the user in the mock store. */
  signIn(email: string): { user: User | null; error: string | null } {
    const user = this.store.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.is_active
    );
    if (!user) return { user: null, error: 'Invalid credentials' };
    this.currentUser = user;
    return { user, error: null };
  }

  /** Sign up — creates a trainee in a given institute. */
  signUp(
    email: string,
    full_name: string,
    institute_id: string,
    role: UserRole = 'trainee'
  ): { user: User | null; error: string | null } {
    if (this.store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { user: null, error: 'Email already registered' };
    }
    const institute = this.store.institutes.find((i) => i.id === institute_id);
    if (!institute) return { user: null, error: 'Institute not found' };

    const user: User = {
      id: `user-${Date.now()}`,
      institute_id,
      auth_id: null,
      email,
      full_name,
      role,
      avatar_url: null,
      is_active: true,
      last_login_at: new Date().toISOString(),
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.store.users.push(user);
    this.currentUser = user;
    return { user, error: null };
  }

  signOut(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // ── Tenant scoping ──────────────────────────────────────────

  private getTenantId(): string | null {
    return this.currentUser?.institute_id ?? null;
  }

  private isPlatformAdmin(): boolean {
    return this.currentUser?.role === 'platform_admin';
  }

  // ── Generic CRUD ────────────────────────────────────────────

  from<T extends TableName>(table: T) {
    return {
      select: (options?: QueryOptions<T>): QueryResult<T> => {
        try {
          let rows = this.getRows(table);

          // Tenant scoping (RLS emulation)
          if (!options?.bypassTenant && !GLOBAL_TABLES.has(table)) {
            const tenantId = this.getTenantId();
            if (!this.isPlatformAdmin()) {
              if (!tenantId) {
                return { data: [], error: 'Not authenticated' };
              }
              rows = rows.filter(
                (r) => (r as unknown as { institute_id: string }).institute_id === tenantId
              );
            }
          }

          // Custom filter
          if (options?.filter) {
            rows = rows.filter(options.filter);
          }

          // Ordering
          if (options?.orderBy) {
            const key = options.orderBy as string;
            const dir = options.order === 'desc' ? -1 : 1;
            rows = [...rows].sort((a, b) => {
              const av = (a as unknown as Record<string, unknown>)[key] as string | number;
              const bv = (b as unknown as Record<string, unknown>)[key] as string | number;
              if (av === bv) return 0;
              return av > bv ? dir : -dir;
            });
          }

          // Limit
          if (options?.limit) {
            rows = rows.slice(0, options.limit);
          }

          return { data: rows as Row<T>[], error: null };
        } catch (e) {
          return { data: [], error: e instanceof Error ? e.message : 'Unknown error' };
        }
      },

      insert: (record: Partial<Row<T>>): QueryResult<T> => {
        try {
          const tenantId = this.getTenantId();
          if (!tenantId && !GLOBAL_TABLES.has(table)) {
            return { data: [], error: 'Not authenticated' };
          }

          const newRecord = {
            ...record,
            id: record.id ?? `${table}-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...(GLOBAL_TABLES.has(table)
              ? {}
              : { institute_id: (record as { institute_id?: string })?.institute_id ?? tenantId }),
          } as Row<T>;

          this.getRows(table).push(newRecord);
          return { data: [newRecord], error: null };
        } catch (e) {
          return { data: [], error: e instanceof Error ? e.message : 'Unknown error' };
        }
      },

      update: (
        id: string,
        patch: Partial<Row<T>>
      ): QueryResult<T> => {
        try {
          const rows = this.getRows(table);
          const idx = rows.findIndex((r) => (r as { id: string }).id === id);
          if (idx === -1) return { data: [], error: 'Record not found' };

          // Tenant scoping on update
          if (!GLOBAL_TABLES.has(table) && !this.isPlatformAdmin()) {
            const tenantId = this.getTenantId();
            if (
              (rows[idx] as { institute_id?: string }).institute_id !== tenantId
            ) {
              return { data: [], error: 'Not authorized' };
            }
          }

          const updated = {
            ...rows[idx],
            ...patch,
            updated_at: new Date().toISOString(),
          } as Row<T>;
          rows[idx] = updated;
          return { data: [updated], error: null };
        } catch (e) {
          return { data: [], error: e instanceof Error ? e.message : 'Unknown error' };
        }
      },

      delete: (id: string): { error: string | null } => {
        try {
          const rows = this.getRows(table);
          const idx = rows.findIndex((r) => (r as { id: string }).id === id);
          if (idx === -1) return { error: 'Record not found' };

          if (!GLOBAL_TABLES.has(table) && !this.isPlatformAdmin()) {
            const tenantId = this.getTenantId();
            if (
              (rows[idx] as { institute_id?: string }).institute_id !== tenantId
            ) {
              return { error: 'Not authorized' };
            }
          }

          rows.splice(idx, 1);
          return { error: null };
        } catch (e) {
          return { error: e instanceof Error ? e.message : 'Unknown error' };
        }
      },
    };
  }

  private getRows<T extends TableName>(table: T): Row<T>[] {
    return this.store[table] as unknown as Row<T>[];
  }

  // ── Convenience: get institutes for signup ──────────────────

  getInstitutes(): Institute[] {
    return this.store.institutes.filter((i) => i.is_active);
  }

  // ── Audit logging ───────────────────────────────────────────

  logAudit(entry: Omit<AuditLog, 'id' | 'created_at'>): void {
    this.store.audit_log.push({
      ...entry,
      id: `audit-${Date.now()}`,
      created_at: new Date().toISOString(),
    });
  }

  // ── Reset (for testing) ─────────────────────────────────────

  reset(): void {
    this.store = freshStore();
    this.currentUser = null;
  }
}

// ── Singleton ─────────────────────────────────────────────────

export const mockClient = new MockClient();
