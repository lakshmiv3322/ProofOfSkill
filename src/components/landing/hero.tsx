import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PoseCanvas } from '@/components/trainee/pose-canvas';
import {
  ShieldCheck,
  Video,
  Activity,
  Play,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HeroProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
}

export function Hero({ onAuthClick }: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulatedBpm, setSimulatedBpm] = useState(110);
  const [simulatedDepth, setSimulatedDepth] = useState(5.4);
  const [simulatedConfidence, setSimulatedConfidence] = useState(98.4);

  // Subtle telemetry pulse
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimulatedBpm(108 + Math.floor(Math.random() * 5));
      setSimulatedDepth(+(5.3 + Math.random() * 0.3).toFixed(1));
      setSimulatedConfidence(+(98.2 + Math.random() * 0.6).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* HUD Background grid & glowing telemetry backdrop */}
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_75%)] pointer-events-none" />
      <div className="absolute left-1/2 top-10 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute right-1/4 top-40 -z-10 h-[300px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs text-emerald-400 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deterministic Kinematics · Human Supervised</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Biometric proof of skill.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Mathematical precision.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Extract real body landmarks with client-side BlazePose, compare against gold-standard exemplar clips via server-side Dynamic Time Warping, and issue verifiable credentials.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                size="lg"
                className="h-12 px-7 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                onClick={() => onAuthClick('signup')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Launch Live Assessment
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-6 text-sm border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
                asChild
              >
                <a href="#demo-report">
                  <Play className="mr-2 h-4 w-4 text-emerald-400" />
                  View Certified Report
                </a>
              </Button>
            </div>

            {/* Structured Key Indicators */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80">
              <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 text-left">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono mb-0.5">
                  <Activity className="h-3.5 w-3.5" />
                  33 Joints
                </div>
                <p className="text-[11px] text-slate-400">BlazePose Tracking</p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 text-left">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono mb-0.5">
                  <Zap className="h-3.5 w-3.5" />
                  Fast DTW
                </div>
                <p className="text-[11px] text-slate-400">Mathematical Rubric</p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 text-left">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono mb-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  SHA-256
                </div>
                <p className="text-[11px] text-slate-400">Audit Proof Ledger</p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 text-left">
                <div className="flex items-center gap-1.5 text-slate-300 text-xs font-mono mb-0.5">
                  <Lock className="h-3.5 w-3.5" />
                  Zero Video
                </div>
                <p className="text-[11px] text-slate-400">Privacy Compliant</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hero Skeleton HUD Moment */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl border-2 border-emerald-500/30 bg-slate-950 p-2 shadow-2xl shadow-emerald-950/40 overflow-hidden">
              
              {/* Header HUD Status Bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    BLAZEPOSE KINEMATIC STREAM
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                    Standard: AHA-CPR-2026
                  </Badge>
                </div>
              </div>

              {/* Viewport with real BlazePose Skeleton rendering */}
              <div className="relative aspect-[4/3] rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center">
                
                {/* Background grid scanline */}
                <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
                
                {/* Real PoseCanvas component running */}
                <PoseCanvas isRecording={isPlaying} showHUD={false} />

                {/* Telemetry HUD overlays */}
                <div className="absolute top-3 left-3 p-2.5 rounded-lg border border-slate-800 bg-slate-900/85 backdrop-blur-md text-left z-20 space-y-1">
                  <div className="flex items-center justify-between gap-3 text-[11px] font-mono">
                    <span className="text-slate-400">Rate Target:</span>
                    <span className="text-emerald-400 font-bold">{simulatedBpm} BPM</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[11px] font-mono">
                    <span className="text-slate-400">Depth Target:</span>
                    <span className="text-cyan-400 font-bold">{simulatedDepth} cm</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[11px] font-mono">
                    <span className="text-slate-400">DTW Alignment:</span>
                    <span className="text-emerald-400 font-bold">{simulatedConfidence}%</span>
                  </div>
                </div>

                {/* Right Top Status Box */}
                <div className="absolute top-3 right-3 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/60 backdrop-blur-md text-right z-20">
                  <div className="flex items-center gap-1.5 justify-end text-xs font-mono text-emerald-300 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Optimal Form
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Arms locked (178°)</p>
                </div>

                {/* Bottom Waveform & Interactive Playback Toggle */}
                <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-lg border border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                      title={isPlaying ? 'Pause simulation' : 'Play simulation'}
                    >
                      <Activity className="h-4 w-4" />
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-white font-mono">Dynamic Time Warping (DTW)</p>
                      <p className="text-[10px] text-slate-400 font-mono">Comparing vs Exemplar ref-002</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[35, 60, 90, 45, 100, 75, 40, 85, 95, 65, 80, 50].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-emerald-400 transition-all duration-300"
                        style={{
                          height: `${Math.max(6, (h * (isPlaying ? 1 : 0.4)) * 0.22)}px`,
                          opacity: (i + 1) / 12,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  POS Ledger Hash: 8f4e3c13...9bd9
                </span>
                <span className="text-emerald-400 font-bold">SHA-256 Validated</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
