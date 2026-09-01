import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Sliders,
  FileCheck2,
  Hash,
  ExternalLink,
} from 'lucide-react';

interface CalibrationCriterion {
  id: string;
  code: string;
  label: string;
  measured: string;
  tolerance: string;
  score: number;
  weight: number;
  status: 'PASS' | 'FLAG';
  feedback: string;
  sliderPosPct: number; // 0–100 marker position inside window
}

const LEDGER_ITEMS: CalibrationCriterion[] = [
  {
    id: 'cpr-rate',
    code: '[01.0] CADENCE_RATE',
    label: 'Compression Rate',
    measured: '108.4 BPM',
    tolerance: '100.0 – 120.0 BPM',
    score: 100,
    weight: 30,
    status: 'PASS',
    feedback: 'Steady cadence maintained across all 30 cycles. Frequency matches standard AHA perfusion curve.',
    sliderPosPct: 42,
  },
  {
    id: 'cpr-depth',
    code: '[02.0] STERNAL_EXCURSION',
    label: 'Compression Depth',
    measured: '5.4 cm',
    tolerance: '5.0 – 6.0 cm',
    score: 95,
    weight: 30,
    status: 'PASS',
    feedback: 'Consistent kinetic displacement. Full sternum excursion with zero shallow downstrokes.',
    sliderPosPct: 40,
  },
  {
    id: 'cpr-recoil',
    code: '[03.0] CHAMBER_RECOIL',
    label: 'Full Recoil Completeness',
    measured: '3.2% Leaning',
    tolerance: '< 5.0% Incomplete',
    score: 90,
    weight: 20,
    status: 'PASS',
    feedback: 'Minimal leaning detected. Full chamber decompression confirmed between cycles.',
    sliderPosPct: 64,
  },
  {
    id: 'cpr-posture',
    code: '[04.0] FORCE_ALIGNMENT',
    label: 'Arm Posture & Vertical Lock',
    measured: '8.4° Dev',
    tolerance: '< 15.0° Deviation',
    score: 85,
    weight: 20,
    status: 'PASS',
    feedback: 'Shoulders positioned perpendicular over sternum contact point. Elbow joints fully locked.',
    sliderPosPct: 56,
  },
];

interface DemoReportProps {
  onVerifyClick?: (code: string) => void;
}

export function DemoReport({ onVerifyClick }: DemoReportProps) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const weightedScore = LEDGER_ITEMS.reduce(
    (acc, c) => acc + (c.score * c.weight) / 100,
    0
  );

  return (
    <section id="demo-report" className="relative py-24 sm:py-32 bg-basalt">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-steel border border-hairline text-xs font-mono text-slateText mb-3">
            <Sliders className="h-3.5 w-3.5 text-laser" />
            <span>Inspection Artifact · Live Telemetry Ledger</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-porcelain">
            The Precision Calibration Ledger
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slateText">
            Every movement is mapped to an exact tolerance window. Scores roll up deterministically into a certified immutable record.
          </p>
        </div>

        {/* ── SIGNATURE STRUCTURAL DEVICE: The Calibration Ledger Table ── */}
        <div className="rounded-md border border-hairline bg-steel overflow-hidden shadow-2xl">
          
          {/* Header Bar */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-hairline flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-porcelain font-bold">ASSESSMENT ARTIFACT: CPR-2026-042</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Candidate: Alex Mercer</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-400">Standard: <strong className="text-porcelain">AHA-CPR-2026</strong></span>
              <span className="text-slate-600">|</span>
              <span className="text-laser font-bold">BlazePose Confidence: 98.4%</span>
            </div>
          </div>

          {/* Ledger Grid Headers (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-2.5 bg-slate-900/60 border-b border-hairline font-mono text-[11px] text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Criterion & Code</div>
            <div className="col-span-4">Tolerance Window vs Measurement</div>
            <div className="col-span-2 text-right">Measured Value</div>
            <div className="col-span-2 text-right">Rubric Verdict</div>
          </div>

          {/* Ledger Rows */}
          <div className="divide-y divide-hairline">
            {LEDGER_ITEMS.map((item) => {
              const isSelected = selectedRow === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedRow(isSelected ? null : item.id)}
                  className="p-5 hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center font-mono">
                    
                    {/* Column 1: Label & Code */}
                    <div className="lg:col-span-4">
                      <span className="text-[10px] text-slate-500 block mb-0.5">{item.code}</span>
                      <span className="text-sm font-semibold text-porcelain font-sans block">{item.label}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Weight: {item.weight}%</span>
                    </div>

                    {/* Column 2: Tolerance Band Gauge */}
                    <div className="lg:col-span-4 space-y-1.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Window: {item.tolerance}</span>
                        <span className="text-laser font-semibold">{item.measured}</span>
                      </div>
                      
                      {/* Dual-marker tolerance gauge */}
                      <div className="h-2 w-full bg-slate-950 rounded-sm border border-hairline relative overflow-hidden">
                        {/* Golden acceptable window in the middle */}
                        <div className="absolute inset-y-0 left-1/4 right-1/4 bg-brass/20 border-x border-brass/40" />
                        {/* Trainee measured point in Laser Cyan */}
                        <div
                          className="absolute top-0 bottom-0 w-1.5 bg-laser shadow-[0_0_8px_#00f0ff]"
                          style={{ left: `${item.sliderPosPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Column 3: Measured */}
                    <div className="lg:col-span-2 text-left lg:text-right">
                      <span className="text-xs text-laser font-bold block">{item.measured}</span>
                      <span className="text-[10px] text-slate-500 block">DTW Aligned</span>
                    </div>

                    {/* Column 4: Verdict & Score */}
                    <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-3">
                      <span className="text-xs text-slate-200 font-bold">{item.score}/100</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-laser/10 border border-laser/30 text-laser text-[11px] font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Telemetry Drawer */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-hairline/60 grid sm:grid-cols-2 gap-4 text-xs font-mono text-slateText">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-1">Assessor Telemetry Note:</span>
                        <p className="text-slate-300 leading-relaxed font-sans">{item.feedback}</p>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-hairline text-[11px] space-y-1">
                        <div className="text-slate-400">Raw DTW Distance Matrix: <span className="text-laser font-bold">0.142</span></div>
                        <div className="text-slate-400">Peak Detection Samples: <span className="text-porcelain">30 / 30 verified</span></div>
                        <div className="text-slate-400">Confidence Interval: <span className="text-emerald-400">99.1% statistical lock</span></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Signature Rollup Seal: Official Credential Verdict ── */}
          <div className="p-6 bg-slate-950 border-t-2 border-brass/50 grid sm:grid-cols-12 gap-6 items-center">
            
            {/* Seal Badge Left */}
            <div className="sm:col-span-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full border-2 border-brass bg-brass/10 flex items-center justify-center text-brass shrink-0 shadow-lg shadow-brass/10">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-brass font-bold uppercase tracking-wider block">Official Verdict Seal</span>
                <span className="text-2xl font-headline font-bold text-porcelain">Certified Competent</span>
                <span className="text-xs font-mono text-slate-400 block mt-0.5">Threshold: 70.0% · Passed: 94.5%</span>
              </div>
            </div>

            {/* Middle Verification Hash Details */}
            <div className="sm:col-span-5 text-xs font-mono space-y-1 text-slate-400 border-l border-hairline pl-4">
              <div>Verification Code: <strong className="text-brass">POS-CPR-2026-042AH</strong></div>
              <div>SHA-256 Ledger Hash: <span className="text-slate-500">8f4e3c13a0219bd948f2c9e782d1a3</span></div>
              <div>Issued By: <span className="text-slate-300">Lead Assessor ID: 01 (Apex Institute)</span></div>
            </div>

            {/* Right Action Button */}
            <div className="sm:col-span-3 text-right">
              <button
                onClick={() => {
                  if (onVerifyClick) {
                    onVerifyClick('POS-CPR-2026-042AH');
                  } else {
                    window.open('/verify/POS-CPR-2026-042AH', '_blank');
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-brass text-slate-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-md"
              >
                <FileCheck2 className="h-4 w-4" />
                <span>Verify Credential Online</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
