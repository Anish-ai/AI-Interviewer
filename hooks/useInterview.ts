import { useState, useEffect } from "react";
import type { Character, InterviewType, Message, SessionData, ResumeData, InterviewCustomization } from "@/types";
import type { FaceMetrics } from "@/lib/hooks/useFaceDetection";
import { createEmptyResumeData, validateResumeData } from "@/types";

export function useInterview() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [faceMetricsHistory, setFaceMetricsHistory] = useState<FaceMetrics[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [interviewCustomization, setInterviewCustomization] = useState<InterviewCustomization>({
    difficulty: 'moderate',
    topicFocus: 'mixed',
    purpose: 'general'
  });

  // Store chat history in localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
      setChatHistory(messages);
    }
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setChatHistory(parsedHistory);
    }
  }, []);

  const handleResumeExtracted = (data: ResumeData) => {
    setResumeData(data);
    const validation = validateResumeData(data);
    setIsResumeUploaded(validation.isValid);
    
    if (!validation.isValid) {
      console.warn('Resume validation errors:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn('Resume validation warnings:', validation.warnings);
    }
  };

  const clearResumeState = () => {
    setResumeData(null);
    setIsResumeUploaded(false);
  };

  const resetInterviewState = () => {
    setMessages([]);
    setCurrentQuestion(1);
    setInterviewStarted(false);
    setFaceMetricsHistory([]);
    clearResumeState();
    setInterviewCustomization({
      difficulty: 'moderate',
      topicFocus: 'mixed',
      purpose: 'general'
    });
  };

  const handleFaceMetricsUpdate = (metrics: FaceMetrics) => {
    setFaceMetricsHistory(prev => [...prev, metrics]);
  };

  return {
    // State
    selectedCharacter,
    selectedType,
    messages,
    isRecording,
    sessionComplete,
    sessionData,
    currentQuestion,
    chatHistory,
    analysisLoading,
    interviewStarted,
    faceMetricsHistory,
    resumeData,
    isResumeUploaded,
    interviewCustomization,
    
    // Setters
    setSelectedCharacter,
    setSelectedType,
    setMessages,
    setIsRecording,
    setSessionComplete,
    setSessionData,
    setCurrentQuestion,
    setAnalysisLoading,
    setInterviewStarted,
    setInterviewCustomization,
    
    // Actions
    handleResumeExtracted,
    resetInterviewState,
    handleFaceMetricsUpdate,
  };
} 