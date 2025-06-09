import { useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export interface FaceExpression {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

export interface FaceMetrics {
  expressions: FaceExpression;
  eyeContact: boolean;
  headPosition: {
    x: number;
    y: number;
  };
  confidence: number;
}

export function useFaceDetection() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceMetrics, setFaceMetrics] = useState<FaceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingProgress(0);
        
        // Load models one by one to track progress
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        setLoadingProgress(33);
        
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        setLoadingProgress(66);
        
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        setLoadingProgress(100);
        
        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        setError('Failed to load face detection models. Please make sure you have run "npm run download-models"');
        console.error('Error loading models:', err);
      }
    };

    loadModels();
  }, []);

  // Process video frame
  const detectFace = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!isModelLoaded) {
      console.warn('Face detection models not loaded yet');
      return null;
    }

    try {
      const detections = await faceapi
        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length === 0) return null;

      const face = detections[0];
      const expressions = face.expressions as FaceExpression;
      
      // Calculate eye contact (simplified)
      const landmarks = face.landmarks;
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();
      const eyeContact = calculateEyeContact(leftEye, rightEye);

      // Calculate head position
      const headPosition = calculateHeadPosition(landmarks);

      // Calculate confidence based on detection score and expression confidence
      const confidence = calculateConfidence(face.detection.score, expressions);

      const metrics = {
        expressions,
        eyeContact,
        headPosition,
        confidence,
      };

      setFaceMetrics(metrics);
      return metrics;
    } catch (err) {
      console.error('Error detecting face:', err);
      return null;
    }
  }, [isModelLoaded]);

  return {
    isModelLoaded,
    faceMetrics,
    error,
    loadingProgress,
    detectFace,
  };
}

// Helper functions
function calculateEyeContact(leftEye: any, rightEye: any): boolean {
  // Calculate the angle between eyes and camera
  const leftEyeCenter = {
    x: leftEye.reduce((sum: number, point: any) => sum + point.x, 0) / leftEye.length,
    y: leftEye.reduce((sum: number, point: any) => sum + point.y, 0) / leftEye.length,
  };
  
  const rightEyeCenter = {
    x: rightEye.reduce((sum: number, point: any) => sum + point.x, 0) / rightEye.length,
    y: rightEye.reduce((sum: number, point: any) => sum + point.y, 0) / rightEye.length,
  };

  // Calculate the angle between eyes
  const angle = Math.atan2(
    rightEyeCenter.y - leftEyeCenter.y,
    rightEyeCenter.x - leftEyeCenter.x
  ) * 180 / Math.PI;

  // Consider eye contact if the angle is close to horizontal (within ±20 degrees)
  return Math.abs(angle) < 20;
}

function calculateHeadPosition(landmarks: any): { x: number; y: number } {
  // Get the center point of the face
  const center = {
    x: landmarks.positions.reduce((sum: number, point: any) => sum + point.x, 0) / landmarks.positions.length,
    y: landmarks.positions.reduce((sum: number, point: any) => sum + point.y, 0) / landmarks.positions.length,
  };

  // Normalize the position to -1 to 1 range
  return {
    x: (center.x / 640) * 2 - 1, // Assuming 640px width
    y: (center.y / 480) * 2 - 1, // Assuming 480px height
  };
}

function calculateConfidence(detectionScore: number, expressions: FaceExpression): number {
  // Calculate overall confidence based on detection score and expression confidence
  const maxExpressionConfidence = Math.max(...Object.values(expressions));
  return (detectionScore + maxExpressionConfidence) / 2;
} 