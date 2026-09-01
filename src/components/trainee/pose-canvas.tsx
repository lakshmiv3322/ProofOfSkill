import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// PoseCanvas — Animated mock MediaPipe BlazePose wireframe
// ─────────────────────────────────────────────────────────────
// Renders a full 17-landmark rescuer skeleton performing CPR
// compressions at ~110 BPM over a static patient silhouette.
// Uses ResizeObserver for pixel-perfect container awareness.
// ─────────────────────────────────────────────────────────────

interface PoseCanvasProps {
  isRecording: boolean;
  className?: string;
}

// ── Neon palette ──────────────────────────────────────────────
const NEON_GREEN   = '#39ff14';
const NEON_ACTIVE  = 'rgba(57,255,20,1)';
const NEON_IDLE    = 'rgba(57,255,20,0.25)';
const WHITE_JOINT  = 'rgba(255,255,255,0.9)';
const WHITE_IDLE   = 'rgba(255,255,255,0.25)';
const PATIENT_COLOR = 'rgba(255,255,255,0.08)';

// CPR cycle period for 110 BPM → 60 000 / 110 ≈ 545 ms
const CPR_PERIOD_MS = 545;

export function PoseCanvas({ isRecording, className }: PoseCanvasProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── ResizeObserver: handles container resize & pixel density ──
    const setSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w   = parent.clientWidth;
      const h   = parent.clientHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas.parentElement!);

    let startTime: number | null = null;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Canvas logical dimensions (after DPR scaling)
      const W = canvas.width  / (window.devicePixelRatio || 1);
      const H = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, W, H);

      if (isRecording) {
        // Compression sine wave: 0 = fully extended, 1 = fully compressed
        const phase      = (elapsed % CPR_PERIOD_MS) / CPR_PERIOD_MS;
        const compress   = Math.max(0, Math.sin(phase * Math.PI)); // only downstroke half
        // Glow pulse in sync with compression
        const glowRadius = 6 + compress * 12;

        drawPatientSilhouette(ctx, W, H);
        drawRescuerSkeleton(ctx, W, H, compress, glowRadius, true);
      } else {
        // Static idle skeleton without patient (preflight mode)
        drawRescuerSkeleton(ctx, W, H, 0, 6, false);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ro.disconnect();
    };
  }, [isRecording]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className ?? ''}`}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Patient silhouette
// ─────────────────────────────────────────────────────────────
function drawPatientSilhouette(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Patient lies horizontally across the lower-centre of the canvas
  const cx  = W * 0.5;
  const py  = H * 0.72; // chest level
  const pw  = W * 0.5;  // shoulder-to-shoulder width
  const ph  = H * 0.12; // torso height

  ctx.save();
  ctx.fillStyle   = PATIENT_COLOR;
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth   = 1;

  // Torso ellipse
  ctx.beginPath();
  ctx.ellipse(cx, py, pw / 2, ph / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head circle
  ctx.beginPath();
  ctx.arc(cx - pw / 2 - ph * 0.6, py, ph * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// Rescuer skeleton (17 key BlazePose landmarks)
// ─────────────────────────────────────────────────────────────

/**
 * @param compress  0 = arms fully extended, 1 = fully compressed
 * @param glow      Shadow blur radius in px
 * @param active    Whether recording is in progress
 */
function drawRescuerSkeleton(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  compress: number,
  glow: number,
  active: boolean
) {
  // ── Anchor points (normalised to canvas, rescuer kneeling behind patient) ──
  const cx   = W * 0.5;
  const base = H * 0.15; // top of canvas — rescuer head

  // Compression drives shoulders + elbows + hands DOWN toward the patient chest
  const compressY = compress * H * 0.12;

  const pts = {
    // Head
    nose:          { x: cx,          y: base },
    leftEar:       { x: cx - W*0.06, y: base + H*0.025 },
    rightEar:      { x: cx + W*0.06, y: base + H*0.025 },

    // Neck / upper spine proxy
    neck:          { x: cx,          y: base + H*0.07 },

    // Shoulders — drop during compression
    leftShoulder:  { x: cx - W*0.14, y: base + H*0.13 + compressY * 0.55 },
    rightShoulder: { x: cx + W*0.14, y: base + H*0.13 + compressY * 0.55 },

    // Elbows
    leftElbow:     { x: cx - W*0.07, y: base + H*0.25 + compressY * 0.75 },
    rightElbow:    { x: cx + W*0.07, y: base + H*0.25 + compressY * 0.75 },

    // Wrists (interlocked, converge toward hands centre)
    leftWrist:     { x: cx - W*0.02, y: base + H*0.37 + compressY },
    rightWrist:    { x: cx + W*0.02, y: base + H*0.37 + compressY },

    // Interlocked hands — contact point on patient sternum
    hands:         { x: cx,          y: base + H*0.41 + compressY },

    // Hips (kneeling, relatively static)
    leftHip:       { x: cx - W*0.18, y: base + H*0.40 },
    rightHip:      { x: cx + W*0.18, y: base + H*0.40 },

    // Knees
    leftKnee:      { x: cx - W*0.20, y: base + H*0.58 },
    rightKnee:     { x: cx + W*0.20, y: base + H*0.58 },

    // Ankles (on the floor behind the patient)
    leftAnkle:     { x: cx - W*0.19, y: base + H*0.72 },
    rightAnkle:    { x: cx + W*0.19, y: base + H*0.72 },
  };

  // ── Skeleton connections (MediaPipe BlazePose edges) ─────────
  const bones: [keyof typeof pts, keyof typeof pts][] = [
    // Head / neck
    ['nose', 'neck'],
    ['nose', 'leftEar'],
    ['nose', 'rightEar'],
    // Neck to shoulders
    ['neck', 'leftShoulder'],
    ['neck', 'rightShoulder'],
    // Arms
    ['leftShoulder',  'leftElbow'],
    ['leftElbow',     'leftWrist'],
    ['leftWrist',     'hands'],
    ['rightShoulder', 'rightElbow'],
    ['rightElbow',    'rightWrist'],
    ['rightWrist',    'hands'],
    // Torso
    ['leftShoulder',  'leftHip'],
    ['rightShoulder', 'rightHip'],
    ['leftHip',       'rightHip'],
    // Legs
    ['leftHip',   'leftKnee'],
    ['leftKnee',  'leftAnkle'],
    ['rightHip',  'rightKnee'],
    ['rightKnee', 'rightAnkle'],
  ];

  const lineColor = active ? NEON_ACTIVE : NEON_IDLE;
  const lineWidth = active ? 2.5 : 1;
  const jointColor = active ? WHITE_JOINT : WHITE_IDLE;
  const jointRadius = active ? 4.5 : 2.5;

  ctx.save();

  // ── Draw bones ───────────────────────────────────────────────
  ctx.strokeStyle = lineColor;
  ctx.lineWidth   = lineWidth;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  if (active) {
    ctx.shadowColor = NEON_GREEN;
    ctx.shadowBlur  = glow;
  }

  bones.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(pts[a].x, pts[a].y);
    ctx.lineTo(pts[b].x, pts[b].y);
    ctx.stroke();
  });

  // ── Draw joints ──────────────────────────────────────────────
  ctx.fillStyle   = jointColor;
  ctx.shadowBlur  = active ? glow * 1.4 : 0;
  ctx.shadowColor = NEON_GREEN;

  Object.values(pts).forEach((pt) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, jointRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Special: hands contact point — larger, brighter dot to indicate sternum contact
  if (active) {
    ctx.fillStyle  = NEON_ACTIVE;
    ctx.shadowBlur = glow * 2;
    ctx.beginPath();
    ctx.arc(pts.hands.x, pts.hands.y, jointRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
