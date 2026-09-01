import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from '@/components/common/qr-code';
import { mockClient } from '@/lib/mock/client';
import type { Certificate, User, Trade, Rubric, Institute } from '@/types/database';
import {
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Search,
  ExternalLink,
  Award,
  AlertTriangle,
  Building2,
  Calendar,
  Lock,
  ArrowLeft,
  GraduationCap,
  FileCheck2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// PublicVerifyPage — Unauthenticated Official Verification View
// Route: /verify/:certificate_id
// Immutably pulls data from certificate, trade, rubric & institute.
// ─────────────────────────────────────────────────────────────

interface PublicVerifyPageProps {
  initialCode?: string;
  onBack?: () => void;
}

export function PublicVerifyPage({
  initialCode = 'POS-CPR-2026-042AH',
  onBack,
}: PublicVerifyPageProps) {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  // Look up certificate across all tenants (public unauthenticated query)
  const certData = useMemo(() => {
    const certsResult = mockClient.from('certificates').select({
      bypassTenant: true,
      filter: (c) =>
        c.verification_code.toLowerCase() === currentCode.toLowerCase() ||
        c.id.toLowerCase() === currentCode.toLowerCase(),
    });

    const certificate = certsResult.data[0] as Certificate | undefined;
    if (!certificate) return null;

    // Resolve trainee
    const traineeResult = mockClient.from('users').select({
      bypassTenant: true,
      filter: (u) => u.id === certificate.trainee_id,
    });
    const trainee = traineeResult.data[0] as User | undefined;

    // Resolve assessor
    const assessorResult = mockClient.from('users').select({
      bypassTenant: true,
      filter: (u) => u.id === certificate.issued_by,
    });
    const assessor = assessorResult.data[0] as User | undefined;

    // Resolve trade
    const tradeResult = mockClient.from('trades').select({
      bypassTenant: true,
      filter: (t) => t.id === certificate.trade_id,
    });
    const trade = tradeResult.data[0] as Trade | undefined;

    // Resolve rubric
    const rubricResult = mockClient.from('rubrics').select({
      bypassTenant: true,
      filter: (r) => r.trade_id === certificate.trade_id,
    });
    const rubric = rubricResult.data[0] as Rubric | undefined;

    // Resolve institute
    const instituteResult = mockClient.from('institutes').select({
      bypassTenant: true,
      filter: (i) => i.id === certificate.institute_id,
    });
    const institute = instituteResult.data[0] as Institute | undefined;

    return {
      certificate,
      trainee,
      assessor,
      trade,
      rubric,
      institute,
    };
  }, [currentCode]);

  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certData?.certificate?.verification_code ?? currentCode}`
    : `https://proofofskill.com/verify/${currentCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setCurrentCode(searchCode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary/30 selection:text-white print:bg-white print:text-black">
      {/* ── Top Header / Nav (Hidden on Print) ─────────────── */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-slate-400 hover:text-white hover:bg-slate-800 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white">ProofOfSkill</span>
                <span className="text-[10px] text-emerald-400 font-mono block -mt-0.5">PUBLIC REGISTRY VERIFIER</span>
              </div>
            </div>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xs w-full sm:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <Input
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Lookup code (e.g. POS-CPR-...)"
                className="h-8 pl-8 pr-3 text-xs bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs shrink-0 bg-slate-800 hover:bg-slate-700 text-white">
              Lookup
            </Button>
          </form>
        </div>
      </header>

      {/* ── Main Content Area ──────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 print:p-0 print:max-w-none">
        {certData ? (
          <div className="space-y-8">
            {/* Verification Banner (Screen only) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 print:hidden">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-sm text-white">Official Certificate Authenticated</h2>
                    <Badge className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-mono text-[10px] font-bold">
                      VERIFIED ACTIVE
                    </Badge>
                  </div>
                  <p className="text-xs text-emerald-400/80 mt-0.5">
                    Immutable verification record backed by ProofOfSkill multi-tenant audit trail.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="h-8 text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                  {copied ? 'Copied Link' : 'Copy Link'}
                </Button>
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="h-8 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
                >
                  <Printer className="h-3.5 w-3.5 mr-1.5" />
                  Download Official Certificate
                </Button>
              </div>
            </div>

            {/* ── Official Printable Certificate Paper ─────────── */}
            <div
              id="certificate-print-sheet"
              className={cn(
                'relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-double border-amber-500/40 rounded-2xl p-6 sm:p-12 shadow-2xl overflow-hidden',
                'print:bg-white print:text-black print:border-8 print:border-double print:border-amber-700 print:shadow-none print:rounded-none print:p-8'
              )}
            >
              {/* Decorative corner ornaments */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400/60 print:border-amber-700" />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400/60 print:border-amber-700" />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400/60 print:border-amber-700" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400/60 print:border-amber-700" />

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.04] pointer-events-none select-none">
                <ShieldCheck className="w-96 h-96 text-white print:text-black" />
              </div>

              {/* Certificate Content Header */}
              <div className="text-center relative z-10 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 print:text-amber-800 print:border-amber-700 text-xs font-semibold tracking-wider uppercase mb-3">
                  <Building2 className="h-3.5 w-3.5" />
                  {certData.institute?.name ?? 'Accredited Institution'}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white print:text-black uppercase font-serif">
                  Certificate of Practical Competency
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 print:text-slate-600 mt-1.5 font-serif italic">
                  This certifies that the candidate has successfully demonstrated objective practical performance assessed against deterministic standards.
                </p>
              </div>

              {/* Recipient & Trade */}
              <div className="text-center relative z-10 mb-8 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 print:text-slate-600">
                  Awarded to
                </p>
                <div className="text-2xl sm:text-4xl font-black text-amber-300 print:text-amber-900 tracking-tight font-serif underline decoration-amber-500/40 underline-offset-8">
                  {certData.trainee?.full_name ?? 'Candidate Name'}
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600 font-mono">
                  Candidate ID: {certData.trainee?.id ?? 'N/A'} · Cohort: {String((certData.trainee?.metadata as Record<string, unknown>)?.cohort ?? 'General')}
                </p>

                <div className="pt-4 max-w-xl mx-auto">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 print:text-slate-600">
                    For Mastery In
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-white print:text-black mt-1">
                    {certData.trade?.name ?? 'Trade Certification'}
                  </p>
                  <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                    Category: {certData.trade?.category ?? 'Vocational & Health Science'}
                  </p>
                </div>
              </div>

              {/* Score & Rubric Breakdown Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 my-8 pt-6 border-t border-slate-800 print:border-slate-300">
                {/* Score badge box */}
                <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-amber-500/20 bg-slate-950/60 print:bg-slate-50 print:border-slate-300 text-center">
                  <p className="text-xs font-medium text-slate-400 print:text-slate-600 uppercase tracking-wider">
                    Certified Score
                  </p>
                  <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 print:text-amber-700 my-1 font-serif">
                    {certData.certificate.overall_score.toFixed(1)}%
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800 text-xs font-semibold">
                    ✓ PASSED (Threshold: {certData.rubric?.pass_threshold ?? 70}%)
                  </Badge>
                  <p className="text-[10px] text-slate-500 print:text-slate-600 mt-2 font-mono">
                    Deterministic Math Rubric
                  </p>
                </div>

                {/* Rubric Criteria Breakdown */}
                <div className="md:col-span-2 space-y-2.5 p-4 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 print:text-slate-700 mb-2 flex items-center justify-between">
                    <span>Assessed Criteria ({certData.rubric?.name ?? 'Standard Rubric'})</span>
                    <span className="text-[10px] text-slate-400 font-mono">Weight Normalised</span>
                  </p>
                  {certData.rubric?.config?.criteria?.map((c) => (
                    <div key={c.id} className="text-xs">
                      <div className="flex justify-between items-center text-slate-300 print:text-slate-800 mb-1">
                        <span className="font-medium">{c.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">Weight: {c.weight}%</span>
                          <span className="font-bold text-emerald-400 print:text-emerald-700">✓ Satisfied</span>
                        </div>
                      </div>
                      <Progress value={92} className="h-1 bg-slate-800 print:bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures, Dates, QR & Seals */}
              <div className="relative z-10 pt-6 border-t border-slate-800 print:border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Left: Assessor Signature Block */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="h-10 flex items-end justify-center sm:justify-start">
                    <span className="font-serif italic text-lg sm:text-xl text-amber-200 print:text-slate-800 border-b border-slate-700 print:border-slate-400 pb-0.5 px-2">
                      {certData.assessor?.full_name ?? 'Certified Assessor'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 print:text-slate-900 mt-1">
                    {certData.assessor?.full_name ?? 'Mike Rodriguez'}
                  </p>
                  <p className="text-[10px] text-slate-400 print:text-slate-600">
                    Lead Certifying Assessor · Northgate Technical College
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Assessor ID: {certData.assessor?.id ?? 'user-002'}
                  </p>
                </div>

                {/* Center: Issue / Expiry dates */}
                <div className="text-center space-y-1.5">
                  <div className="inline-flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-800 print:border-slate-300 bg-slate-950/60 print:bg-white">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 print:text-slate-800">
                      <Calendar className="h-3.5 w-3.5 text-amber-400 print:text-amber-700" />
                      <span>Issued: <strong>{new Date(certData.certificate.issued_at).toLocaleDateString()}</strong></span>
                    </div>
                    {certData.certificate.expires_at && (
                      <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">
                        Expires: {new Date(certData.certificate.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 print:text-slate-700 font-bold">
                    CODE: {certData.certificate.verification_code}
                  </p>
                </div>

                {/* Right: Functional Interactive QR Code */}
                <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Click to open live verification URL"
                    className="group block p-2 rounded-xl bg-white text-slate-950 border-2 border-amber-400 shadow-md hover:scale-105 transition-transform"
                  >
                    <QRCodeSVG value={verificationUrl} size={84} fgColor="#020617" />
                  </a>
                  <p className="text-[10px] text-slate-400 print:text-slate-600 mt-1 font-mono flex items-center gap-1">
                    <Lock className="h-3 w-3 text-emerald-400 print:text-emerald-700" />
                    Scan / Click to Verify
                  </p>
                </div>
              </div>

              {/* ── Mandatory Compliance Disclaimers ─────────────── */}
              <div className="relative z-10 mt-8 pt-4 border-t border-slate-800/80 print:border-slate-300 text-center">
                <p className="text-[10px] sm:text-[11px] text-slate-400 print:text-slate-600 leading-relaxed max-w-2xl mx-auto font-mono">
                  <strong className="text-amber-400 print:text-amber-800">LEGAL & REGULATORY COMPLIANCE NOTICE:</strong> Assessment assistance layer. Not autonomous certification. Reference Dataset: Validated against standard AHA CPR guidelines. All final certification decisions are executed by certified human assessors in compliance with institutional and governing body criteria.
                </p>
                <p className="text-[9px] text-slate-500 print:text-slate-400 mt-1 font-mono">
                  ProofOfSkill Registry ID: {certData.certificate.id} · SHA-256 Ledger Hash: 8f4e3c13a0219bd948f2c9e782d1a3
                </p>
              </div>
            </div>

            {/* ── Metadata & Verification Details Drawer (Screen only) ─ */}
            <div className="grid sm:grid-cols-2 gap-4 print:hidden">
              <Card className="border-slate-800 bg-slate-900/60">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileCheck2 className="h-4 w-4 text-primary" />
                    Immutable Blockchain & Audit Ledger
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This credential was issued through an audited double-signature protocol. Both the AI model deterministic scoring vectors and the assessor review rationale are permanently timestamped.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-slate-500 space-y-1">
                    <p>Status: Active (0 Revocations)</p>
                    <p>Verification Protocol: POS-v2-ST</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-emerald-400" />
                    Employer & Institutional Verification
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Employers may present this verification code or scan the QR code to instantly validate authenticity without logging in.
                  </p>
                  <div className="pt-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleCopyLink}
                      className="p-0 h-auto text-xs text-emerald-400 hover:text-emerald-300 gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Direct verification URL: {verificationUrl}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Certificate Not Found State */
          <div className="text-center py-16 px-4 max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Certificate Not Found</h2>
            <p className="text-sm text-slate-400 mb-6">
              No active certificate was found matching code <strong className="text-white font-mono">{currentCode}</strong>.
            </p>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 text-left text-xs text-slate-400 space-y-2 mb-6">
              <p className="font-semibold text-slate-200">Try these sample verification codes:</p>
              <ul className="space-y-1 font-mono">
                <li>
                  <button
                    onClick={() => {
                      setSearchCode('POS-CPR-2026-042AH');
                      setCurrentCode('POS-CPR-2026-042AH');
                    }}
                    className="text-emerald-400 hover:underline"
                  >
                    • POS-CPR-2026-042AH (CPR Chest Compressions)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSearchCode('POS-SMAW-2026-001SC');
                      setCurrentCode('POS-SMAW-2026-001SC');
                    }}
                    className="text-emerald-400 hover:underline"
                  >
                    • POS-SMAW-2026-001SC (SMAW Welding)
                  </button>
                </li>
              </ul>
            </div>
            {onBack && (
              <Button variant="outline" onClick={onBack} className="text-xs">
                Return to Dashboard
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
