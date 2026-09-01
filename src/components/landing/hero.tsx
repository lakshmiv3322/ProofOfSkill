import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Activity,
  Play,
  Zap,
  Sliders,
} from 'lucide-react';

interface HeroProps {
  onAuthClick: (tab: 'signin' | 'signup') => void;
}

export function Hero({ onAuthClick }: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [traineeBpm, setTraineeBpm] = useState(108.4);
  const [traineeDepth, setTraineeDepth] = useState(5.4);
  const [armAngle, setArmAngle] = useState(178.2);
  const [dtwAlignment, setDtwAlignment] = useState(98.4);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Optical comparator dual-skeleton animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime: number | null = null;
    const CPR_PERIOD_MS = 545; // ~110 BPM

    const render = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, w, h);

      // Split viewport: Left = Trainee (Laser Cyan), Right = Reference (Gilt Brass)
      const halfW = w / 2;

      // Divider line
      ctx.strokeStyle = '#202c42';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(halfW, 0);
      ctx.lineTo(halfW, h);
      ctx.stroke();

      const phase = isPlaying ? (elapsed % CPR_PERIOD_MS) / CPR_PERIOD_MS : 0.2;
      const compress = Math.max(0, Math.sin(phase * Math.PI));

      // Draw Trainee Skeleton (Left, Laser Cyan #00f0ff)
      drawComparatorSkeleton(
        ctx,
        halfW * 0.5,
        h * 0.18,
        halfW * 0.7,
        h * 0.65,
        compress * 0.95,
        '#00f0ff',
        'rgba(0, 240, 255, 0.9)',
        'rgba(0, 240, 255, 0.25)',
        'TRAINEE: LIVE OPTICAL STREAM'
      );

      // Draw Reference Exemplar Skeleton (Right, Gilt Brass #c89b3c)
      drawComparatorSkeleton(
        ctx,
        halfW + halfW * 0.5,
        h * 0.18,
        halfW * 0.7,
        h * 0.65,
        compress,
        '#c89b3c',
        'rgba(200, 155, 60, 0.9)',
        'rgba(200, 155, 60, 0.25)',
        'CERTIFIED EXEMPLAR: ref-002'
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Telemetry fluctuation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTraineeBpm(+(107.5 + Math.random() * 2.5).toFixed(1));
      setTraineeDepth(+(5.3 + Math.random() * 0.25).toFixed(1));
      setArmAngle(+(177.5 + Math.random() * 1.5).toFixed(1));
      setDtwAlignment(+(98.1 + Math.random() * 0.6).toFixed(1));
    }, 1400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
      {/* Precision grid background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs mb-5">
            <span className="h-2 w-2 rounded-full bg-laser animate-ping" />
            <span>Standard: AHA-CPR-2026-v2</span>
            <span className="text-slate-600">|</span>
            <span className="text-brass">Registry Protocol: POS-v2</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-porcelain tracking-tight leading-[1.08]">
            Biometric proof of practical skill. Validated against reference standards.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slateText leading-relaxed font-sans max-w-2xl">
            ProofOfSkill watches physical human motion with client-side BlazePose, runs deterministic Dynamic Time Warping against certified exemplar clips, and issues verifiable credentials.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="h-11 px-6 text-xs font-mono font-semibold bg-laser text-basalt hover:bg-cyan-300 border border-laser/40 shadow-sm"
              onClick={() => onAuthClick('signup')}
            >
              <Zap className="mr-2 h-4 w-4" />
              Launch Live Assessment
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-5 text-xs font-mono border-hairline bg-steel hover:bg-slate-800 text-slate-200"
              asChild
            >
              <a href="#demo-report">
                <Sliders className="mr-2 h-4 w-4 text-brass" />
                Inspect Calibration Ledger
              </a>
            </Button>
          </div>
        </div>

        {/* ── THE SIGNATURE HERO MOMENT: Dual-Skeleton Optical Comparator ── */}
        <div className="rounded-md border border-hairline bg-steel overflow-hidden shadow-2xl">
          
          {/* Terminal Instrument Header */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-hairline text-xs font-mono text-slateText">
            <div className="flex items-center gap-3">
              <span className="text-porcelain font-semibold flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-laser" />
                OPTICAL DUAL-COMPARATOR TERMINAL
              </span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-slate-400 hidden sm:inline">FPS: 30.0 · 33 Keypoints</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-laser font-bold">DTW Alignment: {dtwAlignment}%</span>
              <span className="text-slate-600">|</span>
              <span className="text-brass font-bold">Tolerance: ±5%</span>
            </div>
          </div>

          {/* Optical Canvas Viewport */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-basalt flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Left Telemetry Box (Trainee Laser Cyan) */}
            <div className="absolute bottom-4 left-4 p-3 rounded bg-slate-950/85 border border-hairline text-left font-mono text-[11px] space-y-1 backdrop-blur-sm z-10">
              <div className="text-laser font-bold mb-1">TRAINEE MEASUREMENT</div>
              <div className="text-slateText">Rate: <span className="text-porcelain font-semibold">{traineeBpm} BPM</span></div>
              <div className="text-slateText">Depth: <span className="text-porcelain font-semibold">{traineeDepth} cm</span></div>
              <div className="text-slateText">Lock Angle: <span className="text-porcelain font-semibold">{armAngle}°</span></div>
            </div>

            {/* Right Telemetry Box (Reference Gilt Brass) */}
            <div className="absolute bottom-4 right-4 p-3 rounded bg-slate-950/85 border border-hairline text-right font-mono text-[11px] space-y-1 backdrop-blur-sm z-10">
              <div className="text-brass font-bold mb-1">CERTIFIED STANDARD</div>
              <div className="text-slateText">Target Rate: <span className="text-porcelain font-semibold">100–120 BPM</span></div>
              <div className="text-slateText">Target Depth: <span className="text-porcelain font-semibold">5.0–6.0 cm</span></div>
              <div className="text-slateText">Target Lock: <span className="text-porcelain font-semibold">180° Vertical</span></div>
            </div>

            {/* Center Play/Pause Toggle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause Kinematics Animation' : 'Resume Kinematics Animation'}
                className="px-3 py-1 rounded bg-slate-900/90 border border-hairline text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 backdrop-blur-sm focus-visible:ring-laser"
              >
                <Play className="h-3 w-3 text-laser" />
                <span>{isPlaying ? 'Pause Kinematics' : 'Resume Kinematics'}</span>
              </button>
            </div>
          </div>

          {/* Terminal Waveform & Verification Footer */}
          <div className="px-4 py-3 bg-slate-950 border-t border-hairline grid sm:grid-cols-3 gap-4 items-center text-xs font-mono">
            <div className="text-slateText flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brass shrink-0" />
              <span>Double-Signature Audit Protocol Active</span>
            </div>

            <div className="flex items-center justify-center gap-1" aria-label="Live Telemetry Waveform Signal">
              <span className="text-[10px] text-slate-500 mr-1">WAVE:</span>
              {[20, 55, 90, 45, 100, 70, 30, 85, 95, 60, 75, 40, 80, 60, 95].map((h, i) => {
                const bpmMod = (traineeBpm % 10) * 2;
                const depthMod = (traineeDepth * 4);
                const dynamicH = Math.min(100, Math.max(10, h + ((i % 3 === 0) ? bpmMod : -depthMod)));
                return (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-laser transition-all duration-300"
                    style={{
                      height: `${Math.max(4, (dynamicH * (isPlaying ? 1 : 0.3)) * 0.18)}px`,
                      opacity: 0.3 + (i / 15) * 0.7,
                    }}
                  />
                );
              })}
            </div>

            <div className="text-right text-slateText truncate">
              SHA-256: <span className="text-slate-400">8f4e3c13a0219bd948f2...</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/**
 * Draws a clean skeletal wireframe with joint coordinates for the dual optical comparator.
 */
function drawComparatorSkeleton(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  width: number,
  height: number,
  compress: number,
  boneColor: string,
  jointColor: string,
  glowColor: string,
  headerLabel: string
) {
  const compressY = compress * height * 0.14;

  const pts = {
    nose:          { x: cx,                 y: baseY },
    leftEar:       { x: cx - width * 0.12,  y: baseY + height * 0.04 },
    rightEar:      { x: cx + width * 0.12,  y: baseY + height * 0.04 },
    neck:          { x: cx,                 y: baseY + height * 0.10 },
    leftShoulder:  { x: cx - width * 0.28,  y: baseY + height * 0.18 + compressY * 0.6 },
    rightShoulder: { x: cx + width * 0.28,  y: baseY + height * 0.18 + compressY * 0.6 },
    leftElbow:     { x: cx - width * 0.16,  y: baseY + height * 0.38 + compressY * 0.8 },
    rightElbow:    { x: cx + width * 0.16,  y: baseY + height * 0.38 + compressY * 0.8 },
    leftWrist:     { x: cx - width * 0.05,  y: baseY + height * 0.58 + compressY },
    rightWrist:    { x: cx + width * 0.05,  y: baseY + height * 0.58 + compressY },
    hands:         { x: cx,                 y: baseY + height * 0.64 + compressY },
    leftHip:       { x: cx - width * 0.30,  y: baseY + height * 0.60 },
    rightHip:      { x: cx + width * 0.30,  y: baseY + height * 0.60 },
    leftKnee:      { x: cx - width * 0.32,  y: baseY + height * 0.82 },
    rightKnee:     { x: cx + width * 0.32,  y: baseY + height * 0.82 },
  };

  const bones: [keyof typeof pts, keyof typeof pts][] = [
    ['nose', 'neck'],
    ['nose', 'leftEar'],
    ['nose', 'rightEar'],
    ['neck', 'leftShoulder'],
    ['neck', 'rightShoulder'],
    ['leftShoulder', 'leftElbow'],
    ['leftElbow', 'leftWrist'],
    ['leftWrist', 'hands'],
    ['rightShoulder', 'rightElbow'],
    ['rightElbow', 'rightWrist'],
    ['rightWrist', 'hands'],
    ['leftShoulder', 'leftHip'],
    ['rightShoulder', 'rightHip'],
    ['leftHip', 'rightHip'],
    ['leftHip', 'leftKnee'],
    ['rightHip', 'rightKnee'],
  ];

  ctx.save();

  // Header label on canvas
  ctx.fillStyle = boneColor;
  ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(headerLabel, cx, baseY - 12);

  // Bones
  ctx.strokeStyle = boneColor;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;

  bones.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(pts[a].x, pts[a].y);
    ctx.lineTo(pts[b].x, pts[b].y);
    ctx.stroke();
  });

  // Joints
  ctx.fillStyle = jointColor;
  ctx.shadowBlur = 6;
  Object.values(pts).forEach((pt) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Active contact hand point
  ctx.fillStyle = boneColor;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(pts.hands.x, pts.hands.y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
