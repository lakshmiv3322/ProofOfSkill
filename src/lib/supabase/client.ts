// ─────────────────────────────────────────────────────────────
// src/lib/supabase/client.ts
// Typed singleton Supabase client.
//
// Required environment variables (set in .env.local):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
// ─────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';
import type {
  Institute,
  User,
  Trade,
  Rubric,
  ReferenceClip,
  Submission,
  PoseLandmarkSet,
  Score,
  Feedback,
  Certificate,
  Appeal,
  UsageCounter,
  AuditLog,
} from '@/types/database';

// ── Supabase Database type for the JS client generic ──────────

export type SupabaseSchema = {
  public: {
    Tables: {
      institutes: {
        Row: Institute;
        Insert: Omit<Institute, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Institute, 'id' | 'created_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      trades: {
        Row: Trade;
        Insert: Omit<Trade, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Trade, 'id' | 'created_at'>>;
      };
      rubrics: {
        Row: Rubric;
        Insert: Omit<Rubric, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Rubric, 'id' | 'created_at'>>;
      };
      reference_clips: {
        Row: ReferenceClip;
        Insert: Omit<ReferenceClip, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ReferenceClip, 'id' | 'created_at'>>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Submission, 'id' | 'created_at'>>;
      };
      pose_landmark_sets: {
        Row: PoseLandmarkSet;
        Insert: Omit<PoseLandmarkSet, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PoseLandmarkSet, 'id' | 'created_at'>>;
      };
      scores: {
        Row: Score;
        Insert: Omit<Score, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Score, 'id' | 'created_at'>>;
      };
      feedback: {
        Row: Feedback;
        Insert: Omit<Feedback, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Feedback, 'id' | 'created_at'>>;
      };
      certificates: {
        Row: Certificate;
        Insert: Omit<Certificate, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Certificate, 'id' | 'created_at'>>;
      };
      appeals: {
        Row: Appeal;
        Insert: Omit<Appeal, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Appeal, 'id' | 'created_at'>>;
      };
      usage_counters: {
        Row: UsageCounter;
        Insert: Omit<UsageCounter, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UsageCounter, 'id' | 'created_at'>>;
      };
      audit_log: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: never; // audit_log is append-only
      };
    };
    Functions: {
      get_certificate_by_code: {
        Args: { p_code: string };
        Returns: (Certificate & {
          trainee_name: string;
          trade_name: string;
          institute_name: string;
        }) | null;
      };
    };
  };
};

// ── Validate env vars at module load time ─────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[ProofOfSkill] Missing Supabase env vars.\n' +
    'Copy .env.example → .env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// ── Singleton client ──────────────────────────────────────────

export const supabase = createClient<SupabaseSchema>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist sessions in localStorage so page refresh keeps the user logged in
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type SupabaseClient = typeof supabase;
