import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Institute } from '@/types/database';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'signin' | 'signup';
}

const DEFAULT_INSTITUTES: Institute[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Apex Vocational Institute',
    slug: 'apex-vocational',
    plan_tier: 'growth',
    max_seats: 100,
    contact_email: 'admin@apex.edu',
    contact_phone: null,
    logo_url: null,
    is_active: true,
    settings: {
      allow_appeals: true,
      appeal_window_days: 14,
      require_human_review: true,
      certificate_template: 'standard',
      branding_color: '#00f0ff',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Northgate Technical College',
    slug: 'northgate-tech',
    plan_tier: 'enterprise',
    max_seats: 500,
    contact_email: 'admin@northgate.edu',
    contact_phone: null,
    logo_url: null,
    is_active: true,
    settings: {
      allow_appeals: true,
      appeal_window_days: 30,
      require_human_review: true,
      certificate_template: 'enterprise',
      branding_color: '#c89b3c',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function AuthModal({ open, onOpenChange, defaultTab = 'signin' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [institutes, setInstitutes] = useState<Institute[]>(DEFAULT_INSTITUTES);
  const [selectedInstituteId, setSelectedInstituteId] = useState<string>(DEFAULT_INSTITUTES[0].id);

  // Load active institutes for the sign-up dropdown with graceful offline fallback
  useEffect(() => {
    if (!open) return;
    async function loadInstitutes() {
      try {
        const { data, error } = await supabase
          .from('institutes')
          .select('*')
          .eq('is_active', true)
          .order('name');
        if (!error && data && data.length > 0) {
          const insts = data as Institute[];
          setInstitutes(insts);
          setSelectedInstituteId((prev) => prev || insts[0].id);
        } else {
          setInstitutes(DEFAULT_INSTITUTES);
          setSelectedInstituteId((prev) => prev || DEFAULT_INSTITUTES[0].id);
        }
      } catch {
        setInstitutes(DEFAULT_INSTITUTES);
        setSelectedInstituteId((prev) => prev || DEFAULT_INSTITUTES[0].id);
      }
    }
    loadInstitutes();
  }, [open]);

  // Reset error when switching tabs or opening
  useEffect(() => {
    setError(null);
    setIsSubmitting(false);
  }, [tab, open]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const { error } = await signIn(email, password);
    setIsSubmitting(false);
    if (error) {
      setError(error);
    } else {
      onOpenChange(false);
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const instituteId = selectedInstituteId || (formData.get('institute') as string);
    if (!instituteId) {
      setError('Please select your institute.');
      setIsSubmitting(false);
      return;
    }
    const { error } = await signUp(email, password, fullName, instituteId);
    setIsSubmitting(false);
    if (error) {
      setError(error);
    } else {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
          <DialogDescription>
            {tab === 'signin'
              ? 'Sign in to access your assessment dashboard.'
              : 'Join your institute and start building verifiable skill evidence.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="you@institute.edu"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  name="fullName"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@institute.edu"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-institute">Institute</Label>
                <Select name="institute" value={selectedInstituteId} onValueChange={setSelectedInstituteId}>
                  <SelectTrigger id="signup-institute">
                    <SelectValue
                      placeholder={
                        institutes.length === 0
                          ? 'Loading institutes…'
                          : 'Select your institute'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
