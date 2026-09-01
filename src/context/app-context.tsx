// ─────────────────────────────────────────────────────────────
// src/context/app-context.tsx
// Application-level context backed by real Supabase queries.
//
// In production (VITE_DEMO_MODE != "true"):
//   • activeRole and activeUser come from the signed-in user's
//     real profile in public.users — no persona switching.
//
// In demo mode (VITE_DEMO_MODE=true in .env.local):
//   • switchRole() lets developers impersonate any persona so
//     the full role-based UI can be previewed without separate
//     accounts. The role switcher toolbar is shown.
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, UserRole } from '@/types/database';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-context';

// ── Demo mode flag ────────────────────────────────────────────

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// ── Context shape ─────────────────────────────────────────────

interface AppContextValue {
  /** The role currently being viewed. */
  activeRole: UserRole;
  /** The user object for the active role. */
  activeUser: User;
  /**
   * Switch the active persona. Only callable when DEMO_MODE=true.
   * In production this is a no-op so UI can stay consistent.
   */
  switchRole: (role: UserRole) => Promise<void>;
  /** The typed Supabase client — ready-to-use with RLS applying automatically. */
  db: typeof supabase;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ── AppProvider ───────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();

  // authUser is guaranteed non-null here because AppProvider is only
  // rendered inside the authenticated branch of App.tsx.
  const [activeRole, setActiveRole] = useState<UserRole>(
    authUser?.role ?? 'trainee'
  );
  const [activeUser, setActiveUser] = useState<User>(authUser as User);

  // ── Role switching (demo only) ────────────────────────────────

  const switchRole = useCallback(async (role: UserRole) => {
    if (!DEMO_MODE) return;

    // In demo mode, look up a user with that role in the same institute.
    const instituteId = authUser?.institute_id;
    if (!instituteId) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('institute_id', instituteId)
      .eq('role', role)
      .eq('is_active', true)
      .limit(1)
      .single();

    if (error || !data) {
      // Fall back to authUser if no user with that role found
      console.warn(`[demo] No ${role} found in institute ${instituteId}:`, error?.message);
      setActiveRole(role);
      return;
    }
    setActiveRole(role);
    setActiveUser(data as User);
  }, [authUser]);

  return (
    <AppContext.Provider
      value={{
        activeRole,
        activeUser,
        switchRole,
        db: supabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
