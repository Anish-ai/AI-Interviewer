import { useEffect, useRef, useState } from 'react';
import { useFaceDetection, type FaceMetrics } from '@/lib/hooks/useFaceDetection';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Camera } from 'lucide-react';

interface VideoCaptureProps {
  onMetricsUpdate?: (metrics: FaceMetrics) => void;
  isEnabled?: boolean;
  className?: string;
}

export function VideoCapture({
  onMetricsUpdate,
  isEnabled = true,
  className = '',
}: VideoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isModelLoaded, detectFace, error: modelError, loadingProgress } = useFaceDetection();

  // Start video stream
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera');
      console.error('Error accessing camera:', err);
    }
  };

  // Stop video stream
  const stopVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  // Handle video toggle
  const toggleVideo = () => {
    if (isStreaming) {
      stopVideo();
    } else {
      startVideo();
    }
  };

  // Process video frames
  useEffect(() => {
    let animationFrameId: number;

    const processFrame = async () => {
      if (!isStreaming || !videoRef.current || !canvasRef.current || !isModelLoaded) {
        return;
      }

      try {
        const metrics = await detectFace(videoRef.current);
        if (metrics && onMetricsUpdate) {
          onMetricsUpdate(metrics);
        }

        // Draw face landmarks and expressions on canvas
        if (metrics) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw expression emoji
            const dominantExpression = Object.entries(metrics.expressions).reduce(
              (a, b) => (a[1] > b[1] ? a : b)
            )[0];
            const emoji = getExpressionEmoji(dominantExpression);
            
            // Draw larger emoji with animation
            ctx.font = '48px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(emoji, 20, 60);
            
            // Add a pulsing circle behind the emoji
            const time = Date.now() / 1000;
            const pulseSize = Math.sin(time * 2) * 5 + 30;
            ctx.beginPath();
            ctx.arc(40, 40, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(224, 122, 95, 0.2)';
            ctx.fill();

            // Draw eye contact indicator with animation
            if (metrics.eyeContact) {
              const eyeSize = Math.sin(time * 3) * 2 + 12;
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.arc(30, 80, eyeSize, 0, Math.PI * 2);
              ctx.fill();
              
              // Add sparkle effect
              ctx.beginPath();
              ctx.arc(30 + Math.cos(time * 4) * 5, 80 + Math.sin(time * 4) * 5, 2, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fill();
            }

            // Print progress to terminal
            console.log(`🎭 Expression: ${dominantExpression} (${emoji})`);
            console.log(`👁️ Eye Contact: ${metrics.eyeContact ? '✅' : '❌'}`);
            console.log(`🎯 Confidence: ${Math.round(metrics.confidence * 100)}%`);
            console.log('----------------------------------------');
          }
        }
      } catch (err) {
        console.error('Error processing frame:', err);
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (isStreaming && isModelLoaded) {
      processFrame();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isStreaming, isModelLoaded, detectFace, onMetricsUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={640}
          height={480}
        />
        {!isModelLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
            <div className="text-lg font-semibold mb-2">Loading Face Detection Models</div>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E07A5F] transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-sm mt-2">{loadingProgress}%</div>
          </div>
        )}
        {(error || modelError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 text-red-500 p-4 text-center">
            {error || modelError}
          </div>
        )}
      </div>
      <div className="absolute bottom-4 right-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleVideo}
          className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          disabled={!isModelLoaded}
        >
          {isStreaming ? (
            <VideoOff className="w-5 h-5" />
          ) : (
            <Video className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

// Helper function to get emoji for expression
function getExpressionEmoji(expression: string): string {
  const emojis: Record<string, string> = {
    neutral: '😐',
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😲',
  };
  return emojis[expression] || '😐';
} 