import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, UserRole } from '@/types/database';
import { mockClient } from '@/lib/mock/client';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string) => { error: string | null };
  signUp: (
    email: string,
    full_name: string,
    instituteId: string,
    role?: UserRole
  ) => { error: string | null };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockClient.getCurrentUser());

  const signIn = useCallback((email: string) => {
    const { user: u, error } = mockClient.signIn(email);
    if (u) setUser(u);
    return { error };
  }, []);

  const signUp = useCallback(
    (
      email: string,
      full_name: string,
      instituteId: string,
      role: UserRole = 'trainee'
    ) => {
      const { user: u, error } = mockClient.signUp(email, full_name, instituteId, role);
      if (u) setUser(u);
      return { error };
    },
    []
  );

  const signOut = useCallback(() => {
    mockClient.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, signIn, signUp, signOut }}
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
