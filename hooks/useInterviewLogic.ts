import { useState, useEffect } from "react";
import type { Character, InterviewType, Message, SessionData, ResumeData, InterviewCustomization as CustomizationType } from "@/types";
import type { FaceMetrics } from "@/lib/hooks/useFaceDetection";
import type { InterviewHistoryEntry } from "@/types/history";
import { validateResumeData } from "@/types";

export function useInterviewLogic() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [faceMetricsHistory, setFaceMetricsHistory] = useState<FaceMetrics[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [interviewCustomization, setInterviewCustomization] = useState<CustomizationType>({
    difficulty: 'moderate',
    topicFocus: 'mixed',
    purpose: 'general'
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistoryEntry[]>([]);

  // Helper functions for message handling
  const serializeMessage = (message: Message) => ({
    ...message,
    timestamp: message.timestamp.toISOString()
  });

  const deserializeMessage = (message: any): Message => ({
    ...message,
    timestamp: new Date(message.timestamp)
  });

  const serializeMessages = (messages: Message[]) => messages.map(serializeMessage);
  const deserializeMessages = (messages: any[]) => messages.map(deserializeMessage);

  // Store chat history in localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(serializeMessages(messages)));
      setChatHistory(messages);
    }
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const deserializedHistory = deserializeMessages(parsedHistory);
        setChatHistory(deserializedHistory);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setChatHistory([]);
      }
    }
  }, []);

  // Load interview history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("interviewHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const deserializedHistory = parsedHistory.map((entry: any) => ({
          ...entry,
          messages: deserializeMessages(entry.messages),
          date: new Date(entry.date).toISOString()
        }));
        setInterviewHistory(deserializedHistory);
      } catch (error) {
        console.error('Error loading interview history:', error);
        setInterviewHistory([]);
      }
    }
  }, []);

  const getInterviewerIntroduction = (
    character: Character,
    type: InterviewType
  ) => {
    const difficultyText = interviewCustomization.difficulty === 'beginner' ? 'beginner-friendly' : 
                          interviewCustomization.difficulty === 'advanced' ? 'advanced' : 'moderate';
    const topicText = interviewCustomization.topicFocus === 'mixed' ? 'various topics' : 
                     `${interviewCustomization.topicFocus} topics`;
    const purposeText = interviewCustomization.purpose === 'intern' ? 'internship' : 
                       interviewCustomization.purpose === 'placement' ? 'placement' : 'general';

    if (resumeData && resumeData.name) {
      return `Hi ${resumeData.name}, I'm ${character.name}, ${
        character.role
      } for the AI team. I've reviewed your resume and I'll be conducting a ${difficultyText} ${type.name.toLowerCase()} interview focused on ${topicText} for ${purposeText} preparation. Let's start with a brief introduction - please tell me about yourself and your background.`;
    }
    return `Hi, I'm ${character.name}, ${
      character.role
    } for the AI team. I'll be conducting a ${difficultyText} ${type.name.toLowerCase()} interview focused on ${topicText} for ${purposeText} preparation. Let's start with a brief introduction - please tell me about yourself and your background.`;
  };

  const initializeSession = async (
    character: Character,
    type: InterviewType
  ) => {
    const welcomeMessage = getInterviewerIntroduction(character, type);
    setMessages([
      {
        id: "1",
        type: "interviewer",
        content: welcomeMessage,
        timestamp: new Date(),
        character: character,
        hasAudio: false,
      },
    ]);
    setCurrentQuestion(1);  
  };

  const handleCharacterSelect = async (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleTypeSelect = async (type: InterviewType) => {
    setSelectedType(type);
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!selectedCharacter || !selectedType) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: transcript,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Create a prompt for Gemini based on the character, interview type, and resume data
      let prompt = `You are ${selectedCharacter.name}, a ${
        selectedCharacter.role
      } conducting a ${selectedType.name.toLowerCase()} interview. 
      The candidate just said: "${transcript}"
      
      Based on this response and the interview context:
      - Character: ${selectedCharacter.name} (${selectedCharacter.role})
      - Interview Type: ${selectedType.name}
      - Current Question Number: ${currentQuestion} of 5
      - Target Language: ${selectedLanguage}
      - Difficulty Level: ${interviewCustomization.difficulty}
      - Topic Focus: ${interviewCustomization.topicFocus}
      - Interview Purpose: ${interviewCustomization.purpose}`;

      // Add resume context if available
      if (resumeData && isResumeUploaded) {
        prompt += `
      
      Candidate's Resume Information:
      - Name: ${resumeData.name}
      - Summary: ${resumeData.summary}
      - Experience: ${resumeData.experience.map(exp => `${exp.title} at ${exp.company} (${exp.duration})`).join(', ')}
      - Skills: ${resumeData.skills.join(', ')}
      - Projects: ${resumeData.projects.map(proj => proj.name).join(', ')}
      - Achievements: ${resumeData.achievements.join(', ')}`;
      }

      prompt += `
      
      Generate a relevant follow-up question that:
      1. Is specific to the ${selectedType.name.toLowerCase()} interview type
      2. Shows expertise in ${selectedCharacter.role} role
      3. Builds upon the candidate's previous response
      4. Helps assess their skills and experience
      5. Is in ${selectedLanguage}
      6. Matches the ${interviewCustomization.difficulty} difficulty level
      7. Focuses on ${interviewCustomization.topicFocus} topics
      8. Is appropriate for ${interviewCustomization.purpose} interviews`;

      // Add resume-specific instructions
      if (resumeData && isResumeUploaded) {
        prompt += `
      9. References specific details from their resume (experience, projects, skills, or achievements)
      10. Asks about their actual work experience, projects, or technical skills mentioned in their resume`;
      }

      prompt += `
      
      Also, analyze your mood as the interviewer based on the candidate's response. Consider:
      - The quality and relevance of their answer
      - Their communication skills
      - Their level of engagement
      - Their technical/professional knowledge shown
      
      Format your response as a JSON object with these fields:
      {
        "question": "your follow-up question",
        "mood": {
          "value": number (0-100, where 0 is very negative and 100 is very positive),
          "label": "one word mood label (e.g. Positive, Neutral, Concerned)",
          "emoji": "appropriate emoji for the mood"
        }
      }
      
      Keep the question concise and professional.`;

      const response = await fetch("/api/process-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          character: selectedCharacter,
          interviewType: selectedType,
          currentQuestion,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        try {
          const cleaned = data.processedMessage.replace(/```json|```/g, "").trim();
          const response = JSON.parse(cleaned);
          
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "interviewer",
            content: response.question,
            timestamp: new Date(),
            character: selectedCharacter,
            hasAudio: true,
            audioFile: data.audioFile,
            mood: response.mood
          };

          setMessages((prev) => [...prev, aiMessage]);
          setCurrentQuestion((prev) => prev + 1);
        } catch (error) {
          console.error("Error parsing response:", error);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  const handleFaceMetricsUpdate = (metrics: FaceMetrics) => {
    setFaceMetricsHistory(prev => [...prev, metrics]);
  };

  const calculateFaceMetricsSummary = (metrics: FaceMetrics[]): SessionData['faceMetrics'] => {
    if (metrics.length === 0) return undefined;

    const averageConfidence = metrics.reduce((sum, m) => sum + m.confidence, 0) / metrics.length;
    
    const expressionCounts: Record<string, number> = {};
    metrics.forEach(m => {
      const dominantExpression = Object.entries(m.expressions).reduce(
        (a, b) => (a[1] > b[1] ? a : b)
      )[0];
      expressionCounts[dominantExpression] = (expressionCounts[dominantExpression] || 0) + 1;
    });

    const eyeContactPercentage = metrics.filter(m => m.eyeContact).length / metrics.length;

    return {
      averageConfidence,
      dominantExpressions: expressionCounts,
      eyeContactPercentage,
    };
  };

  const handleAnalysis = async () => {
    if (!selectedCharacter || !selectedType || messages.length === 0) return;
    setAnalysisLoading(true);
    try {
      let analysisPrompt = `As ${selectedCharacter.name}, a ${
        selectedCharacter.role
      }, analyze this interview session and provide detailed feedback in ${selectedLanguage}.\n\nInterview Type: ${
        selectedType.name
      }\nInterview Customization:
- Difficulty Level: ${interviewCustomization.difficulty}
- Topic Focus: ${interviewCustomization.topicFocus}
- Interview Purpose: ${interviewCustomization.purpose}
\nChat History:\n${messages
        .map(
          (msg) =>
            `${msg.type === "user" ? "Candidate" : "Interviewer"}: ${
              msg.content
            }`
        )
        .join(
          "\n"
        )}`;

      // Add resume context if available
      if (resumeData && isResumeUploaded) {
        analysisPrompt += `\n\nCandidate's Resume Information:
- Name: ${resumeData.name}
- Summary: ${resumeData.summary}
- Experience: ${resumeData.experience.map(exp => `${exp.title} at ${exp.company} (${exp.duration})`).join(', ')}
- Skills: ${resumeData.skills.join(', ')}
- Projects: ${resumeData.projects.map(proj => proj.name).join(', ')}
- Achievements: ${resumeData.achievements.join(', ')}`;
      }

      analysisPrompt += `\n\nPlease provide:\n1. Overall rating (out of 5 stars)\n2. Key strengths (3 points)\n3. Areas for improvement (3 points)\n4. Communication skills assessment\n5. Technical/Professional knowledge evaluation
6. Specific recommendations for improvement`;

      // Add resume-specific analysis instructions
      if (resumeData && isResumeUploaded) {
        analysisPrompt += `\n7. How well their responses aligned with their resume experience
8. Whether they effectively communicated their actual skills and achievements
9. Suggestions for better connecting their responses to their documented experience`;
      }
      
      analysisPrompt += `\n\nFormat the response as a JSON object with these fields, ensuring all text is in ${selectedLanguage}:\n{\n  "rating": number,\n  "strengths": string[],\n  "improvements": string[],\n  "communication": string,\n  "knowledge": string,\n  "recommendations": string[]\n}`;

      const response = await fetch("/api/process-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: analysisPrompt,
          character: selectedCharacter,
          interviewType: selectedType,
          isAnalysis: true,
          language: selectedLanguage,
        }),
      });
      const data = await response.json();
      if (data.success) {
        try {
          const cleaned = data.processedMessage
            .replace(/```json|```/g, "")
            .trim();
          const analysis = JSON.parse(cleaned);
          
          // Add face metrics to the analysis
          analysis.faceMetrics = calculateFaceMetricsSummary(faceMetricsHistory);
          
          setSessionData(analysis);
          setSessionComplete(true);
        } catch (error) {
          console.error("Error parsing analysis:", error);
        }
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

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

  // Helper function to clear resume state
  const clearResumeState = () => {
    setResumeData(null);
    setIsResumeUploaded(false);
  };

  // Helper function to reset interview state
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

  const handleSessionModalClose = () => {
    setSessionComplete(false);
  };

  const handleSessionModalRetry = () => {
    setSessionComplete(false);
    resetInterviewState();
    if (selectedCharacter && selectedType) {
      initializeSession(selectedCharacter, selectedType);
    }
  };

  const saveInterviewToHistory = () => {
    if (!selectedCharacter || !selectedType) return;

    const newEntry: InterviewHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      character: selectedCharacter,
      interviewType: selectedType,
      resumeData,
      messages,
      duration: messages.length * 2 * 60, // Rough estimate: 2 minutes per message
      score: sessionData?.score
    };

    const updatedHistory = [newEntry, ...interviewHistory];
    setInterviewHistory(updatedHistory);
    localStorage.setItem("interviewHistory", JSON.stringify(updatedHistory));
  };

  const handleViewHistory = () => {
    setHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryOpen(false);
  };

  const replayInterview = (entry: InterviewHistoryEntry) => {
    setSelectedCharacter(entry.character);
    setSelectedType(entry.interviewType);
    if (entry.resumeData) {
      handleResumeExtracted(entry.resumeData);
    }
    setMessages(entry.messages);
    setHistoryOpen(false);
    setInterviewStarted(true);
  };

  // Save interview to history when session completes
  useEffect(() => {
    if (sessionComplete) {
      saveInterviewToHistory();
    }
  }, [sessionComplete]);

  return {
    // State
    selectedCharacter,
    selectedType,
    messages,
    isRecording,
    sessionComplete,
    sessionData,
    currentQuestion,
    isDarkMode,
    chatHistory,
    analysisLoading,
    interviewStarted,
    selectedLanguage,
    faceMetricsHistory,
    resumeData,
    isResumeUploaded,
    interviewCustomization,
    historyOpen,
    interviewHistory,
    
    // Actions
    setSelectedCharacter,
    setSelectedType,
    setMessages,
    setIsDarkMode,
    setSelectedLanguage,
    setInterviewCustomization,
    setAnalysisLoading,
    setInterviewStarted,
    setIsRecording,
    
    // Functions
    handleCharacterSelect,
    handleTypeSelect,
    handleVoiceInput,
    handleFaceMetricsUpdate,
    handleAnalysis,
    handleResumeExtracted,
    initializeSession,
    resetInterviewState,
    clearResumeState,
    handleSessionModalClose,
    handleSessionModalRetry,
    handleViewHistory,
    handleCloseHistory,
    replayInterview,
  };
}