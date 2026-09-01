import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// PoseCanvas — Animated mock MediaPipe wireframe overlay
// ─────────────────────────────────────────────────────────────

interface PoseCanvasProps {
  isRecording: boolean;
  className?: string;
}

export function PoseCanvas({ isRecording, className }: PoseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let startTime: number | null = null;

    const drawWireframe = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isRecording) {
        // Draw static faint skeleton when not recording
        drawSkeleton(ctx, canvas.width, canvas.height, 0, false);
      } else {
        // Animate a compression motion (down and up) based on sine wave
        // Target CPR rate ~ 110 BPM -> 1.83 beats per second -> cycle ~ 545ms
        const progress = (elapsed % 545) / 545;
        // Compression goes down for first half, up for second half
        const compressionDepth = Math.sin(progress * Math.PI) * 40; 
        
        drawSkeleton(ctx, canvas.width, canvas.height, compressionDepth, true);
      }

      animationRef.current = requestAnimationFrame(drawWireframe);
    };

    animationRef.current = requestAnimationFrame(drawWireframe);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isRecording]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none z-10 ${className || ''}`} 
    />
  );
}

function drawSkeleton(ctx: CanvasRenderingContext2D, width: number, height: number, depthOffset: number, active: boolean) {
  const centerX = width / 2;
  const baseY = height * 0.4;
  
  // Skeleton base coordinates
  const points = {
    head: { x: centerX, y: baseY - 120 + (depthOffset * 0.3) },
    leftShoulder: { x: centerX - 80, y: baseY + (depthOffset * 0.5) },
    rightShoulder: { x: centerX + 80, y: baseY + (depthOffset * 0.5) },
    leftElbow: { x: centerX - 40, y: baseY + 80 + (depthOffset * 0.8) },
    rightElbow: { x: centerX + 40, y: baseY + 80 + (depthOffset * 0.8) },
    hands: { x: centerX, y: baseY + 160 + depthOffset }, // Interlocked hands
  };

  // Styling
  ctx.strokeStyle = active ? '#39ff14' : 'rgba(57, 255, 20, 0.3)'; // Neon green
  ctx.lineWidth = active ? 3 : 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw connections (bones)
  ctx.beginPath();
  // Shoulders to head
  ctx.moveTo(points.leftShoulder.x, points.leftShoulder.y);
  ctx.lineTo(points.head.x, points.head.y);
  ctx.lineTo(points.rightShoulder.x, points.rightShoulder.y);
  // Shoulders to elbows
  ctx.moveTo(points.leftShoulder.x, points.leftShoulder.y);
  ctx.lineTo(points.leftElbow.x, points.leftElbow.y);
  ctx.moveTo(points.rightShoulder.x, points.rightShoulder.y);
  ctx.lineTo(points.rightElbow.x, points.rightElbow.y);
  // Elbows to hands
  ctx.lineTo(points.hands.x, points.hands.y);
  ctx.moveTo(points.leftElbow.x, points.leftElbow.y);
  ctx.lineTo(points.hands.x, points.hands.y);
  ctx.stroke();

  // Draw joints
  ctx.fillStyle = active ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
  Object.values(points).forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, active ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect if active
    if (active) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#39ff14';
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset
    }
  });
}
