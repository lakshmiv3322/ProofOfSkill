import type {
  Institute,
  User,
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
} from '@/types/database';

// ─────────────────────────────────────────────────────────────
// Seed Data — two institutes with full data for demo purposes
// ─────────────────────────────────────────────────────────────

const now = '2026-09-01T10:00:00.000Z';

// ── Institutes ────────────────────────────────────────────────

export const seedInstitutes: Institute[] = [
  {
    id: 'inst-001',
    name: 'Northgate Technical College',
    slug: 'northgate',
    plan_tier: 'growth',
    max_seats: 500,
    contact_email: 'admin@northgate.edu',
    contact_phone: '+1-555-0100',
    logo_url: null,
    is_active: true,
    settings: {
      allow_appeals: true,
      appeal_window_days: 14,
      require_human_review: true,
      certificate_template: 'standard',
      branding_color: '#0f766e',
    },
    created_at: '2025-01-15T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'inst-002',
    name: 'Summit Vocational Institute',
    slug: 'summit',
    plan_tier: 'enterprise',
    max_seats: 5000,
    contact_email: 'it@summit.edu',
    contact_phone: '+1-555-0200',
    logo_url: null,
    is_active: true,
    settings: {
      allow_appeals: true,
      appeal_window_days: 21,
      require_human_review: true,
      certificate_template: 'premium',
      branding_color: '#1e40af',
    },
    created_at: '2024-09-01T08:00:00.000Z',
    updated_at: now,
  },
];

// ── Users ────────────────────────────────────────────────────

export const seedUsers: User[] = [
  {
    id: 'user-001',
    institute_id: 'inst-001',
    auth_id: null,
    email: 'sarah.trainee@northgate.edu',
    full_name: 'Sarah Chen',
    role: 'trainee',
    avatar_url: null,
    is_active: true,
    last_login_at: now,
    metadata: { cohort: '2026-A' },
    created_at: '2025-08-01T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'user-002',
    institute_id: 'inst-001',
    auth_id: null,
    email: 'mike.assessor@northgate.edu',
    full_name: 'Mike Rodriguez',
    role: 'assessor',
    avatar_url: null,
    is_active: true,
    last_login_at: now,
    metadata: { specializations: ['welding', 'carpentry'] },
    created_at: '2025-02-01T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'user-003',
    institute_id: 'inst-001',
    auth_id: null,
    email: 'admin@northgate.edu',
    full_name: 'Jennifer Park',
    role: 'institute_admin',
    avatar_url: null,
    is_active: true,
    last_login_at: now,
    metadata: {},
    created_at: '2025-01-15T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'user-004',
    institute_id: 'inst-002',
    auth_id: null,
    email: 'alex.trainee@summit.edu',
    full_name: 'Alex Morgan',
    role: 'trainee',
    avatar_url: null,
    is_active: true,
    last_login_at: now,
    metadata: { cohort: '2026-B' },
    created_at: '2025-06-01T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'user-005',
    institute_id: null as unknown as string,
    auth_id: null,
    email: 'platform@proofofskill.com',
    full_name: 'Platform Admin',
    role: 'platform_admin',
    avatar_url: null,
    is_active: true,
    last_login_at: now,
    metadata: {},
    created_at: '2024-01-01T08:00:00.000Z',
    updated_at: now,
  },
];

// ── Trades ───────────────────────────────────────────────────

export const seedTrades: Trade[] = [
  {
    id: 'trade-001',
    institute_id: 'inst-001',
    name: 'SMAW Shielded Metal Arc Welding',
    description: 'Stick welding fundamentals including bead placement, arc length, and travel speed.',
    category: 'Welding',
    is_active: true,
    created_at: '2025-03-01T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'trade-002',
    institute_id: 'inst-001',
    name: 'Carpentry — Wall Framing',
    description: 'Residential wall framing techniques including plating, stud layout, and squaring.',
    category: 'Carpentry',
    is_active: true,
    created_at: '2025-03-15T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'trade-003',
    institute_id: 'inst-002',
    name: 'Electrical — Conduit Bending',
    description: 'EMT conduit bending techniques including offsets, saddles, and 90-degree bends.',
    category: 'Electrical',
    is_active: true,
    created_at: '2025-04-01T08:00:00.000Z',
    updated_at: now,
  },
  // ── CPR — MVP Skill ───────────────────────────────────────
  {
    id: 'trade-cpr',
    institute_id: 'inst-001',
    name: 'CPR / First-Aid Chest Compression',
    description:
      'Demonstrate proper CPR chest compression technique: hand placement, compression depth (5–6 cm), rate (100–120 BPM), full recoil, and rescuer posture.',
    category: 'Emergency Medicine',
    is_active: true,
    created_at: '2026-01-10T08:00:00.000Z',
    updated_at: now,
  },
];

// ── Rubrics ──────────────────────────────────────────────────

export const seedRubrics: Rubric[] = [
  {
    id: 'rubric-001',
    institute_id: 'inst-001',
    trade_id: 'trade-001',
    name: 'SMAW Horizontal Fillet Weld v2',
    version: 2,
    is_published: true,
    pass_threshold: 70,
    config: {
      criteria: [
        {
          id: 'arc-length',
          label: 'Arc Length Control',
          description: 'Maintains consistent arc length throughout the weld.',
          weight: 25,
          indicators: ['Arc gap stays within 1/8" to 1/4"', 'No stubbing or sticking'],
        },
        {
          id: 'travel-speed',
          label: 'Travel Speed',
          description: 'Maintains appropriate and consistent travel speed.',
          weight: 25,
          indicators: ['Uniform bead width', 'Consistent ripple pattern'],
        },
        {
          id: 'bead-placement',
          label: 'Bead Placement',
          description: 'Correct positioning of the weld bead on the joint.',
          weight: 20,
          indicators: ['Bead centered on joint', 'Adequate toe fusion'],
        },
        {
          id: 'slag-removal',
          label: 'Slag Removal & Cleanup',
          description: 'Proper slag removal between passes and final cleanup.',
          weight: 15,
          indicators: ['All slag removed', 'No inclusions visible'],
        },
        {
          id: 'safety',
          label: 'Safety & PPE Compliance',
          description: 'Proper use of personal protective equipment throughout.',
          weight: 15,
          indicators: ['Helmet down during welding', 'Gloves and jacket worn'],
        },
      ],
      scoring_scale: { min: 0, max: 100, bands: [] },
      total_weight: 100,
    },
    created_at: '2025-04-01T08:00:00.000Z',
    updated_at: now,
  },

  // ── CPR Rubric (MVP) ──────────────────────────────────────
  {
    id: 'rubric-002',
    institute_id: 'inst-001',
    trade_id: 'trade-cpr',
    name: 'CPR Chest Compressions v1',
    version: 1,
    is_published: true,
    pass_threshold: 70,
    config: {
      criteria: [
        {
          id: 'cpr-rate',
          label: 'Compression Rate',
          description: 'Target 100–120 compressions per minute (BPM). Optimal cadence is 110 BPM.',
          weight: 40,
          indicators: [
            'Rate sustained at 100–120 BPM for entire cycle',
            'No significant acceleration or deceleration across compressions',
          ],
        },
        {
          id: 'cpr-depth',
          label: 'Compression Depth',
          description: 'Each compression must depress the sternum 5–6 cm (2–2.4 inches).',
          weight: 30,
          indicators: [
            'Mean depth ≥ 5.0 cm across all compressions',
            'No compression shallower than 4.0 cm',
          ],
        },
        {
          id: 'cpr-recoil',
          label: 'Full Chest Recoil',
          description: 'Hands must fully release pressure between compressions to allow cardiac refill.',
          weight: 20,
          indicators: [
            'Chest returns to resting position after each compression',
            'Rescuer does not lean on chest between compressions',
          ],
        },
        {
          id: 'cpr-posture',
          label: 'Rescuer Posture',
          description: 'Arms straight, shoulders directly over hands, core engaged.',
          weight: 10,
          indicators: [
            'Elbows locked throughout compression cycle',
            'Shoulders aligned vertically above sternum contact point',
          ],
        },
      ],
      scoring_scale: {
        min: 0,
        max: 100,
        bands: [
          { label: 'Excellent', min: 90, max: 100, color: '#10b981' },
          { label: 'Satisfactory', min: 70, max: 89, color: '#3b82f6' },
          { label: 'Needs Improvement', min: 50, max: 69, color: '#f59e0b' },
          { label: 'Unsatisfactory', min: 0, max: 49, color: '#ef4444' },
        ],
      },
      total_weight: 100,
    },
    created_at: '2026-01-15T08:00:00.000Z',
    updated_at: now,
  },
];

// ── Reference Clips ──────────────────────────────────────────

export const seedReferenceClips: ReferenceClip[] = [
  {
    id: 'ref-001',
    institute_id: 'inst-001',
    trade_id: 'trade-001',
    rubric_id: 'rubric-001',
    title: 'Expert SMAW Horizontal Fillet — Full Pass',
    description: 'A master welder demonstrates a textbook horizontal fillet weld with commentary on technique.',
    video_url: 'https://example.com/clips/expert-smaw.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/268976/pexels-photo-268976.jpeg',
    duration_seconds: 180,
    tags: ['expert', 'horizontal', 'fillet'],
    created_at: '2025-04-10T08:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'ref-002',
    institute_id: 'inst-001',
    trade_id: 'trade-cpr',
    rubric_id: 'rubric-002',
    title: 'Expert CPR Chest Compressions — AHA Standard',
    description:
      'AHA-certified instructor demonstrates 30 compressions at 110 BPM, 5.5 cm depth, with full recoil and locked-arm posture. This clip is the DTW reference for all CPR submissions.',
    video_url: 'https://example.com/clips/expert-cpr.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
    duration_seconds: 62,
    tags: ['expert', 'cpr', 'aha-standard', 'reference'],
    created_at: '2026-01-20T08:00:00.000Z',
    updated_at: now,
  },
];

// ── Submissions ──────────────────────────────────────────────

export const seedSubmissions: Submission[] = [
  {
    id: 'sub-001',
    institute_id: 'inst-001',
    trainee_id: 'user-001',
    trade_id: 'trade-001',
    rubric_id: 'rubric-001',
    reference_clip_id: 'ref-001',
    status: 'scored',
    video_url: 'https://example.com/submissions/sub-001.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/268976/pexels-photo-268976.jpeg',
    duration_seconds: 165,
    submitted_at: '2026-08-28T14:00:00.000Z',
    reviewed_at: '2026-08-30T10:00:00.000Z',
    notes: 'Horizontal fillet weld, 3/16" 7018 rod.',
    created_at: '2026-08-28T14:00:00.000Z',
    updated_at: now,
  },
];

// ── Pose Landmark Sets ───────────────────────────────────────

export const seedPoseLandmarkSets: PoseLandmarkSet[] = [
  {
    id: 'pls-001',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    frame_count: 165,
    confidence_score: 0.92,
    source: 'ai',
    landmarks: [],
    created_at: '2026-08-28T14:05:00.000Z',
    updated_at: now,
  },
];

// ── Scores ───────────────────────────────────────────────────

export const seedScores: Score[] = [
  {
    id: 'score-001',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    rubric_criterion_id: 'arc-length',
    score: 85,
    max_score: 100,
    weight: 25,
    source: 'ai',
    assessor_id: 'user-002',
    notes: 'Consistent arc length. Minor deviation at start.',
    created_at: '2026-08-28T14:10:00.000Z',
    updated_at: now,
  },
  {
    id: 'score-002',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    rubric_criterion_id: 'travel-speed',
    score: 78,
    max_score: 100,
    weight: 25,
    source: 'ai',
    assessor_id: 'user-002',
    notes: 'Slightly fast at the end. Bead narrows.',
    created_at: '2026-08-28T14:10:00.000Z',
    updated_at: now,
  },
  {
    id: 'score-003',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    rubric_criterion_id: 'bead-placement',
    score: 90,
    max_score: 100,
    weight: 20,
    source: 'human',
    assessor_id: 'user-002',
    notes: 'Excellent bead placement, well-centered.',
    created_at: '2026-08-30T10:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'score-004',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    rubric_criterion_id: 'slag-removal',
    score: 72,
    max_score: 100,
    weight: 15,
    source: 'human',
    assessor_id: 'user-002',
    notes: 'Some residual slag at the stop point.',
    created_at: '2026-08-30T10:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'score-005',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    rubric_criterion_id: 'safety',
    score: 100,
    max_score: 100,
    weight: 15,
    source: 'human',
    assessor_id: 'user-002',
    notes: 'Full PPE compliance throughout.',
    created_at: '2026-08-30T10:00:00.000Z',
    updated_at: now,
  },
];

// ── Feedback ─────────────────────────────────────────────────

export const seedFeedback: Feedback[] = [
  {
    id: 'fb-001',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    score_id: 'score-001',
    rubric_criterion_id: 'arc-length',
    author_id: 'user-002',
    author_role: 'assessor',
    body: 'Good arc length control overall. Focus on maintaining the gap at the start of the pass — you tend to drift slightly long in the first 5 seconds.',
    timestamp_seconds: 12,
    is_ai_generated: false,
    created_at: '2026-08-30T10:05:00.000Z',
    updated_at: now,
  },
  {
    id: 'fb-002',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    score_id: 'score-002',
    rubric_criterion_id: 'travel-speed',
    author_id: 'user-002',
    author_role: 'assessor',
    body: 'Travel speed is consistent until the final third. The bead narrows noticeably — practice maintaining hand speed through the entire pass.',
    timestamp_seconds: 95,
    is_ai_generated: false,
    created_at: '2026-08-30T10:06:00.000Z',
    updated_at: now,
  },
  {
    id: 'fb-003',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    score_id: null,
    rubric_criterion_id: null,
    author_id: 'user-002',
    author_role: 'assessor',
    body: 'Strong submission overall. You passed with a weighted score of 83.5%. Focus areas: travel speed consistency and slag cleanup at stop points. Your bead placement and safety compliance are excellent.',
    timestamp_seconds: null,
    is_ai_generated: false,
    created_at: '2026-08-30T10:08:00.000Z',
    updated_at: now,
  },
];

// ── Certificates ─────────────────────────────────────────────

export const seedCertificates: Certificate[] = [
  {
    id: 'cert-001',
    institute_id: 'inst-001',
    submission_id: 'sub-001',
    trainee_id: 'user-001',
    trade_id: 'trade-001',
    verification_code: 'POS-SMAW-2026-001SC',
    status: 'active',
    issued_at: '2026-08-30T10:10:00.000Z',
    expires_at: '2028-08-30T10:10:00.000Z',
    issued_by: 'user-002',
    overall_score: 83.5,
    pdf_url: null,
    created_at: '2026-08-30T10:10:00.000Z',
    updated_at: now,
  },
  {
    id: 'cert-002',
    institute_id: 'inst-001',
    submission_id: 'sub-003',
    trainee_id: 'user-001',
    trade_id: 'trade-cpr',
    verification_code: 'POS-CPR-2026-042AH',
    status: 'active',
    issued_at: '2026-09-01T09:00:00.000Z',
    expires_at: '2028-09-01T09:00:00.000Z',
    issued_by: 'user-002',
    overall_score: 91.0,
    pdf_url: null,
    created_at: '2026-09-01T09:00:00.000Z',
    updated_at: now,
  },
];

// ── Appeals ──────────────────────────────────────────────────

export const seedAppeals: Appeal[] = [];

// ── Usage Counters ────────────────────────────────────────────

export const seedUsageCounters: UsageCounter[] = [
  {
    id: 'usage-001',
    institute_id: 'inst-001',
    period_year: 2026,
    period_month: 8,
    submissions_count: 47,
    ai_assessments_count: 47,
    certificates_issued: 38,
    active_users: 120,
    created_at: '2026-08-01T00:00:00.000Z',
    updated_at: now,
  },
];

// ── Audit Log ────────────────────────────────────────────────

export const seedAuditLog: AuditLog[] = [
  {
    id: 'audit-001',
    institute_id: 'inst-001',
    actor_id: 'user-001',
    actor_role: 'trainee',
    action: 'submission.submitted',
    entity_type: 'submission',
    entity_id: 'sub-001',
    metadata: {
      trade: 'SMAW Shielded Metal Arc Welding',
      state_before: { status: 'in_progress', video_file: 'pending_upload.mp4' },
      state_after: { status: 'submitted', video_url: 'https://example.com/submissions/sub-001.mp4', duration: 165 },
    },
    ip_address: '192.168.1.45',
    created_at: '2026-08-28T14:00:00.000Z',
  },
  {
    id: 'audit-002',
    institute_id: 'inst-001',
    actor_id: 'user-002',
    actor_role: 'assessor',
    action: 'submission.scored',
    entity_type: 'submission',
    entity_id: 'sub-001',
    metadata: {
      overall_score: 83.5,
      state_before: { status: 'under_review', score: null },
      state_after: { status: 'scored', overall_score: 83.5, confidence: 0.92 },
    },
    ip_address: '10.0.4.12',
    created_at: '2026-08-30T10:08:00.000Z',
  },
  {
    id: 'audit-003',
    institute_id: 'inst-001',
    actor_id: 'user-002',
    actor_role: 'assessor',
    action: 'score.override',
    entity_type: 'score',
    entity_id: 'score-bead-placement',
    metadata: {
      criterion_id: 'bead-placement',
      rationale: 'Student demonstrated exceptional toe fusion on the stop-restart section that the camera angle initially occluded. Overriding AI score from 75 to 90.',
      state_before: { criterion: 'Bead Placement', score: 75, source: 'ai' },
      state_after: { criterion: 'Bead Placement', score: 90, source: 'human', override_by: 'Mike Rodriguez' },
    },
    ip_address: '10.0.4.12',
    created_at: '2026-08-30T10:09:00.000Z',
  },
  {
    id: 'audit-004',
    institute_id: 'inst-001',
    actor_id: 'user-002',
    actor_role: 'assessor',
    action: 'certificate.issued',
    entity_type: 'certificate',
    entity_id: 'cert-001',
    metadata: {
      verification_code: 'POS-SMAW-2026-001SC',
      overall_score: 83.5,
      state_before: { status: 'scored', certificate_id: null },
      state_after: { status: 'certified', certificate_id: 'cert-001', verification_code: 'POS-SMAW-2026-001SC' },
    },
    ip_address: '10.0.4.12',
    created_at: '2026-08-30T10:10:00.000Z',
  },
  {
    id: 'audit-005',
    institute_id: 'inst-001',
    actor_id: 'user-003',
    actor_role: 'institute_admin',
    action: 'rubric.config_updated',
    entity_type: 'rubric',
    entity_id: 'rubric-002',
    metadata: {
      rubric_name: 'CPR Chest Compressions v1',
      state_before: { version: 1, pass_threshold: 65, rate_weight: 35 },
      state_after: { version: 1, pass_threshold: 70, rate_weight: 40, updated_by: 'Jennifer Park' },
    },
    ip_address: '172.16.0.8',
    created_at: '2026-09-01T08:30:00.000Z',
  },
  {
    id: 'audit-006',
    institute_id: 'inst-001',
    actor_id: 'user-002',
    actor_role: 'assessor',
    action: 'certificate.issued',
    entity_type: 'certificate',
    entity_id: 'cert-002',
    metadata: {
      verification_code: 'POS-CPR-2026-042AH',
      overall_score: 91.0,
      state_before: { status: 'under_review', certificate_id: null },
      state_after: { status: 'certified', certificate_id: 'cert-002', verification_code: 'POS-CPR-2026-042AH' },
    },
    ip_address: '10.0.4.12',
    created_at: '2026-09-01T09:00:00.000Z',
  },
];
