// ─────────────────────────────────────────────────────────────
// src/context/auth-context.tsx
// Real Supabase Auth — replaces in-memory mockClient auth.
//
// Provides:
//   • user            — the app-level User row (from public.users)
//   • session         — raw Supabase Session (for access tokens etc.)
//   • isAuthenticated — true when a valid session exists
//   • isLoading       — true while the initial session is being resolved
//   • signIn          — email + password sign-in
//   • signUp          — email + password sign-up with metadata
//   • signOut         — signs out and clears session
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import type { User, UserRole } from '@/types/database';
import { supabase } from '@/lib/supabase/client';

// ── Context shape ─────────────────────────────────────────────

interface AuthContextValue {
  /** The app-level user row from public.users. Null when signed out. */
  user: User | null;
  /** Raw Supabase session. Null when signed out. */
  session: Session | null;
  /** True once the initial session has been resolved from storage. */
  isLoading: boolean;
  /** Convenience: true when user !== null. */
  isAuthenticated: boolean;
  /** Sign in with email + password. Returns error string on failure. */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Create a new account. institute_id must be a valid UUID. */
  signUp: (
    email: string,
    password: string,
    full_name: string,
    institute_id: string,
    role?: UserRole
  ) => Promise<{ error: string | null }>;
  /** Sign the current user out. */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── AuthProvider ──────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Fetch the app-level user row for the auth user ──────────

  const fetchUser = useCallback(async (authUserId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUserId)
      .single();

    if (error || !data) {
      console.error('[auth] Failed to fetch user profile:', error?.message);
      return null;
    }
    return data as User;
  }, []);

  // ── Resolve session on mount + subscribe to auth changes ────

  useEffect(() => {
    let mounted = true;

    // 1. Restore any existing session from localStorage
    // Wrapped in try/catch so a missing Supabase config (no .env.local) doesn't crash the app.
    supabase.auth.getSession()
      .then(async ({ data: { session: existingSession } }) => {
        if (!mounted) return;
        setSession(existingSession);
        if (existingSession?.user) {
          const appUser = await fetchUser(existingSession.user.id);
          if (mounted) setUser(appUser);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('[auth] getSession failed (offline/demo mode):', err?.message);
        if (mounted) setIsLoading(false);
      });

    // 2. Subscribe to future auth state changes (sign-in, sign-out, token refresh)
    let subscription: { unsubscribe: () => void } = { unsubscribe: () => {} };
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!mounted) return;
          setSession(newSession);
          if (newSession?.user) {
            const appUser = await fetchUser(newSession.user.id);
            if (mounted) setUser(appUser);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      );
      subscription = data.subscription;
    } catch (err) {
      console.warn('[auth] onAuthStateChange setup failed (offline/demo mode):', err);
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  // ── Auth actions ──────────────────────────────────────────────

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      // onAuthStateChange fires and updates user state automatically
      return { error: null };
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      full_name: string,
      institute_id: string,
      role: UserRole = 'trainee'
    ): Promise<{ error: string | null }> => {
      // Pass institute_id and full_name as user metadata so the
      // handle_new_auth_user() database trigger can create the public.users row.
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            institute_id,
            role,
          },
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: user !== null,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
