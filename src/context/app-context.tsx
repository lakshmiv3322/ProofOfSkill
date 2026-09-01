import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, UserRole } from '@/types/database';
import { mockClient } from '@/lib/mock/client';
import { useAuth } from '@/context/auth-context';

// ─────────────────────────────────────────────────────────────
// AppContext — inner-application state
// Provides:
//   • activeRole   — the currently previewed persona role
//   • activeUser   — the mock user for that role
//   • switchRole   — dev role-switcher
//   • db           — singleton mockClient for data access
// ─────────────────────────────────────────────────────────────

// Canonical demo users for each role (from seed data)
const ROLE_USER_EMAILS: Record<UserRole, string> = {
  trainee: 'sarah.trainee@northgate.edu',
  assessor: 'mike.assessor@northgate.edu',
  institute_admin: 'admin@northgate.edu',
  platform_admin: 'platform@proofofskill.com',
};

interface AppContextValue {
  /** The role currently being viewed (may differ from the signed-in user's real role). */
  activeRole: UserRole;
  /** The mock user object corresponding to `activeRole`. */
  activeUser: User;
  /** Instantly switch the active persona (dev role-switcher). */
  switchRole: (role: UserRole) => void;
  /** The mock database client — pre-authenticated to `activeUser`. */
  db: typeof mockClient;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();

  // Determine the initial role from the authenticated user, or fall back to trainee
  const initialRole: UserRole = authUser?.role ?? 'trainee';

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);

  // Resolve the demo user for the current role
  const resolveUser = useCallback((role: UserRole): User => {
    const email = ROLE_USER_EMAILS[role];
    // Bypass tenant to find users across all institutes
    const result = mockClient.from('users').select({
      bypassTenant: true,
      filter: (u) => u.email === email,
    });
    return result.data[0] as User;
  }, []);

  const [activeUser, setActiveUser] = useState<User>(() => resolveUser(initialRole));

  const switchRole = useCallback(
    (role: UserRole) => {
      const user = resolveUser(role);
      if (!user) return;
      // Sign in as that user so the mock client scopes queries correctly
      mockClient.signIn(user.email);
      setActiveRole(role);
      setActiveUser(user);
    },
    [resolveUser]
  );

  return (
    <AppContext.Provider value={{ activeRole, activeUser, switchRole, db: mockClient }}>
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
