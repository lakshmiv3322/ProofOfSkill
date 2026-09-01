import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PoseCanvas } from './pose-canvas';
import { evaluateSubmission } from '@/lib/scoring/rubric-engine';
import { generateFeedback } from '@/lib/llm/feedback-generator';
import { useApp } from '@/context/app-context';
import {
  Camera,
  CheckCircle2,
  Circle,
  Square,
  Upload,
  AlertCircle,
  Loader2,
  Brain,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// VideoCapture — Learner Capture View with pre-flight checks
// ─────────────────────────────────────────────────────────────

interface VideoCaptureProps {
  onBack: () => void;
  onComplete: () => void;
}

type CaptureState = 'preflight' | 'recording' | 'processing' | 'results';

export function VideoCapture({ onBack, onComplete }: VideoCaptureProps) {
  const { db } = useApp();
  const [state, setState] = useState<CaptureState>('preflight');
  
  // Pre-flight checks (simulated sensors)
  const [checks, setChecks] = useState({
    lighting: false,
    framing: false,
    occlusion: false,
  });

  const allChecksPassed = checks.lighting && checks.framing && checks.occlusion;

  // Simulate sensors turning green after a short delay
  useEffect(() => {
    if (state !== 'preflight') return;
    
    const timers = [
      setTimeout(() => setChecks(c => ({ ...c, lighting: true })), 800),
      setTimeout(() => setChecks(c => ({ ...c, framing: true })), 1500),
      setTimeout(() => setChecks(c => ({ ...c, occlusion: true })), 2200),
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [state]);

  // Recording state
  const [recordingTime, setRecordingTime] = useState(0);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state === 'recording') {
      interval = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Processing state
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMsg, setProcessingMsg] = useState('Extracting frames...');
  
  const [results, setResults] = useState<{
    score: number;
    metrics: Record<string, number>;
    feedback: { text: string; isFallback: boolean };
  } | null>(null);

  const handleStopRecording = () => {
    setState('processing');
    
    // Simulate ML Pipeline progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      setProcessingProgress(progress);
      
      if (progress > 30) setProcessingMsg('Running MediaPipe Pose Estimation...');
      if (progress > 60) setProcessingMsg('Applying DTW to Reference Clip...');
      if (progress > 85) setProcessingMsg('Executing deterministic rubric engine...');
      
      if (progress === 100) {
        clearInterval(interval);
        executeScoringEngine();
      }
    }, 500);
  };

  const executeScoringEngine = async () => {
    setProcessingMsg('Generating coaching narrative...');
    
    // 1. Get rubric config
    // In a real app, we'd query by trade_id. For demo, we know it's rubric-001 (or we can query for the first rubric).
    const rubricsResult = db.from('rubrics').select({ limit: 1 });
    const rubricConfig = rubricsResult.data[0]?.config;
    
    if (!rubricConfig) {
      setProcessingMsg('Error: Rubric config not found.');
      return;
    }

    // 2. Deterministic Scoring
    const evalResult = evaluateSubmission('mock-sub-id', rubricConfig);
    
    // 3. LLM Narrative Generation (Fail-safe)
    // For demo, we focus feedback on the rate criterion
    const feedback = await generateFeedback('cpr-rate', evalResult.criteriaScores['cpr-rate'] || 0, evalResult.metrics);
    
    setResults({
      score: evalResult.overallScore,
      metrics: evalResult.metrics,
      feedback
    });
    
    setState('results');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={onBack} disabled={state === 'recording' || state === 'processing'}>
          ← Cancel
        </Button>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          CPR Chest Compression
        </Badge>
      </div>

      {/* Main Video Area */}
      <Card className="relative overflow-hidden bg-black/5 border-2 border-border/50 aspect-[4/3] sm:aspect-video mb-6 flex flex-col items-center justify-center">
        
        {/* Placeholder for actual video feed */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-700">
           <Video className="w-24 h-24 opacity-20" />
        </div>

        {/* Pose Skeleton Overlay */}
        {(state === 'preflight' || state === 'recording') && (
          <PoseCanvas isRecording={state === 'recording'} />
        )}

        {/* Pre-flight Checks Overlay */}
        {state === 'preflight' && (
          <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <h3 className="text-white font-semibold text-sm mb-3">Pre-capture Quality Checks</h3>
            <div className="flex flex-wrap gap-4">
              <CheckBadge label="Lighting: Optimal" passed={checks.lighting} />
              <CheckBadge label="Framing: Center Trainee" passed={checks.framing} />
              <CheckBadge label="Occlusion: Hands Visible" passed={checks.occlusion} />
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {state === 'recording' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full text-white">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Processing Overlay */}
        {state === 'processing' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center text-white backdrop-blur-sm z-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold mb-2">Analyzing Video</p>
            <p className="text-sm text-slate-300 mb-6">{processingMsg}</p>
            <Progress value={processingProgress} className="w-full max-w-md h-2" />
          </div>
        )}
      </Card>

      {/* Controls Area */}
      <div className="flex flex-col items-center">
        {state === 'preflight' && (
          <div className="text-center space-y-4">
            <Button 
              size="lg" 
              className="rounded-full w-20 h-20 p-0 hover:scale-105 transition-transform border-4 border-primary/20"
              disabled={!allChecksPassed}
              onClick={() => setState('recording')}
            >
              <Circle className="h-10 w-10 text-destructive fill-destructive" />
            </Button>
            <p className="text-sm text-muted-foreground">
              {!allChecksPassed ? "Waiting for sensors..." : "Tap to start recording"}
            </p>
          </div>
        )}

        {state === 'recording' && (
          <div className="text-center space-y-4">
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full w-20 h-20 p-0 hover:scale-105 transition-transform border-4 border-destructive/20 bg-destructive/10 hover:bg-destructive/20"
              onClick={handleStopRecording}
            >
              <Square className="h-8 w-8 text-destructive fill-destructive" />
            </Button>
            <p className="text-sm text-muted-foreground animate-pulse">
              Recording in progress...
            </p>
          </div>
        )}

        {/* Results View */}
        {state === 'results' && results && (
          <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">AI Analysis Complete</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
               <Card>
                 <CardContent className="p-4 flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground">Estimated Score</p>
                     <p className="text-3xl font-bold mt-1">{results.score}%</p>
                   </div>
                   <div className="h-12 w-12 rounded-full border-4 border-primary flex items-center justify-center bg-primary/10 text-primary">
                     <CheckCircle2 className="h-6 w-6" />
                   </div>
                 </CardContent>
               </Card>
               <Card>
                 <CardContent className="p-4">
                   <p className="text-sm font-medium text-muted-foreground mb-2">Key Metrics (DTW)</p>
                   <ul className="text-sm space-y-1">
                     <li className="flex justify-between"><span>Rate:</span> <strong>{results.metrics.actualBpm} BPM</strong></li>
                     <li className="flex justify-between"><span>Depth:</span> <strong>{results.metrics.actualDepthCm.toFixed(1)} cm</strong></li>
                     <li className="flex justify-between"><span>Recoil Error:</span> <strong>{results.metrics.recoilVariancePct}%</strong></li>
                   </ul>
                 </CardContent>
               </Card>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold flex items-center gap-2">
                    Coaching Feedback 
                  </p>
                  {results.feedback.isFallback && (
                    <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                      Fallback Template Used
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {results.feedback.text}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={onComplete}>
                <Upload className="mr-2 h-4 w-4" /> Submit for Human Review
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                setState('preflight');
                setChecks({ lighting: false, framing: false, occlusion: false });
                setRecordingTime(0);
              }}>
                Retake Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckBadge({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-500",
      passed ? "bg-emerald-500/80 text-white" : "bg-black/50 text-slate-300"
    )}>
      {passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
      {label}
    </div>
  );
}
