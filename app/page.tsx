"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ChatCanvas } from "@/components/chat-canvas";
import { SessionModal } from "@/components/session-modal";
import { ResumeUpload } from "@/components/resume-upload";
import type { Character, InterviewType, Message, SessionData, ResumeData } from "@/types";
import { Loader2 } from "lucide-react";
import type { FaceMetrics } from "@/lib/hooks/useFaceDetection";

const characters: Character[] = [
  {
    id: "jane",
    name: "Jane Doe",
    role: "Tech Lead",
    company: "TechVision Corp",
    years: 10,
    focus: "frontend architecture and scalable web applications",
    avatar: "/placeholder.svg?height=48&width=48",
    avatarAnimated: "/avatars/female_laptop.jpg",
    description:
      "Experienced frontend architect with 8+ years at top tech companies",
  },
  {
    id: "mike",
    name: "Mike Chen",
    role: "HR Manager",
    company: "InnovateTech Solutions",
    years: 8,
    focus:
      "building high-performing teams in AI-driven applications and product development",
    avatar: "/placeholder.svg?height=48&width=48",
    avatarAnimated: "/avatars/male_talking.jpg",
    description: "People-focused leader specializing in behavioral interviews",
  },
  {
    id: "sarah",
    name: "Sarah Wilson",
    role: "Product Manager",
    company: "NextGen Products",
    years: 6,
    focus: "strategic product launches and cross-functional team leadership",
    avatar: "/placeholder.svg?height=48&width=48",
    avatarAnimated: "/avatars/female_mic.jpg",
    description: "Strategic thinker with expertise in case study interviews",
  },
];

const interviewTypes: InterviewType[] = [
  {
    id: "technical",
    name: "Technical",
    icon: "💻",
    description: "Coding challenges and system design",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    icon: "🤝",
    description: "Situational and experience-based questions",
  },
  {
    id: "case-study",
    name: "Case Study",
    icon: "📊",
    description: "Problem-solving and analytical thinking",
  },
];

export default function MockInterviewAI() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  // Simple translation object (you can expand this)
  const translations = {
    en: {
      welcomeTitle: "Welcome to MockInterviewAI",
      welcomeSubtitle:
        "Select your interviewer and interview type from the sidebar, then click Start Interview to begin your mock session.",
      startButton: "Start Interview",
    },
    es: {
      welcomeTitle: "Bienvenido a MockInterviewAI",
      welcomeSubtitle:
        "Selecciona tu entrevistador y tipo de entrevista en la barra lateral, luego haz clic en Iniciar entrevista para comenzar tu sesión de simulación.",
      startButton: "Iniciar Entrevista",
    },
    fr: {
      welcomeTitle: "Bienvenue sur MockInterviewAI",
      welcomeSubtitle:
        "Sélectionnez votre intervieweur et type d'entretien dans la barre latérale, puis cliquez sur Démarrer l'entretien pour commencer votre session simulée.",
      startButton: "Démarrer l'Entretien",
    },
    hi: {
      welcomeTitle: "Welcome to MockInterviewAI (Hindi)",
      welcomeSubtitle:
        "Select your interviewer and interview type from the sidebar, then click Start Interview to begin your mock session. (Hindi)",
      startButton: "Start Interview (Hindi)",
    },
  };

  // Function to get translated text
  const t = (key: keyof typeof translations.en) => {
    return (
      translations[selectedLanguage as keyof typeof translations][key] ||
      translations.en[key]
    );
  };

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

  const getInterviewerIntroduction = (
    character: Character,
    type: InterviewType
  ) => {
    if (resumeData && resumeData.name) {
      return `Hi ${resumeData.name}, I'm ${character.name}, ${
        character.role
      } for the AI team. I've reviewed your resume and I'll be conducting the ${type.name.toLowerCase()} interview today. Let's start with a brief introduction - please tell me about yourself and your background.`;
    }
    return `Hi, I'm ${character.name}, ${
      character.role
    } for the AI team. I'll be conducting the ${type.name.toLowerCase()} interview today. Let's start with a brief introduction - please tell me about yourself and your background.`;
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

    // try {
    //   // Include language in API call
    //   const response = await fetch("/api/process-message", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       message: welcomeMessage,
    //       character: character,
    //       interviewType: type,
    //       currentQuestion: 1,
    //       language: selectedLanguage,
    //     }),
    //   });

    //   const data = await response.json();

    //   if (data.success) {
    //     const aiMessage: Message = {
    //       id: (Date.now() + 1).toString(),
    //       type: "interviewer",
    //       content: data.processedMessage,
    //       timestamp: new Date(),
    //       character: character,
    //       hasAudio: true,
    //       audioFile: data.audioFile,
    //     };

    //     setMessages((prev) => [...prev, aiMessage]);
    //     setCurrentQuestion((prev) => prev + 1);

    //     if (currentQuestion >= 5) {
    //       // Generate final feedback using Gemini
    //       const feedbackPrompt = `As ${character.name}, a ${character.role}, provide a comprehensive interview feedback based on the candidate's responses.
    //       Include:
    //       1. Overall score (out of 10)
    //       2. Key strengths (3 points)
    //       3. Areas for improvement (3 points)
    //       4. Interview duration
    //       5. Number of questions answered
          
    //       Format the response as a JSON object with these fields:
    //       {
    //         "score": number,
    //         "strengths": string[],
    //         "improvements": string[],
    //         "duration": string,
    //         "questionsAnswered": number
    //       }`;

    //       const feedbackResponse = await fetch("/api/process-message", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           message: feedbackPrompt,
    //           character: character,
    //           interviewType: type,
    //           isFeedback: true,
    //           language: selectedLanguage,
    //         }),
    //       });

    //       const feedbackData = await feedbackResponse.json();

    //       if (feedbackData.success) {
    //         try {
    //           const cleaned = feedbackData.processedMessage
    //             .replace(/```json|```/g, "")
    //             .trim();
    //           const feedback = JSON.parse(cleaned);
    //           setSessionData(feedback);
    //           setSessionComplete(true);
    //         } catch (error) {
    //           console.error("Error parsing feedback:", error);
    //         }
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error processing message:", error);
    // }
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
      - Target Language: ${selectedLanguage}`;

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
      5. Is in ${selectedLanguage}`;

      // Add resume-specific instructions
      if (resumeData && isResumeUploaded) {
        prompt += `
      6. References specific details from their resume (experience, projects, skills, or achievements)
      7. Asks about their actual work experience, projects, or technical skills mentioned in their resume`;
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

          // if (currentQuestion >= 5) {
          //   // Generate final feedback using Gemini
          //   const feedbackPrompt = `As ${selectedCharacter.name}, a ${selectedCharacter.role}, provide a comprehensive interview feedback based on the candidate's responses.
          //   Include:
          //   1. Overall score (out of 10)
          //   2. Key strengths (3 points)
          //   3. Areas for improvement (3 points)
          //   4. Interview duration
          //   5. Number of questions answered
            
          //   Format the response as a JSON object with these fields:
          //   {
          //     "score": number,
          //     "strengths": string[],
          //     "improvements": string[],
          //     "duration": string,
          //     "questionsAnswered": number
          //   }`;

          //   const feedbackResponse = await fetch("/api/process-message", {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       message: feedbackPrompt,
          //       character: selectedCharacter,
          //       interviewType: selectedType,
          //       isFeedback: true,
          //       language: selectedLanguage,
          //     }),
          //   });

          //   const feedbackData = await feedbackResponse.json();

          //   if (feedbackData.success) {
          //     try {
          //       const cleaned = feedbackData.processedMessage
          //         .replace(/```json|```/g, "")
          //         .trim();
          //       const feedback = JSON.parse(cleaned);
          //       setSessionData(feedback);
          //       setSessionComplete(true);
          //     } catch (error) {
          //       console.error("Error parsing feedback:", error);
          //     }
          //   }
          // }
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
      }\nChat History:\n${messages
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
    setIsResumeUploaded(data.name !== '' && data.experience.length > 0);
  };

  // Show Start Interview button if not started
  if (!interviewStarted) {
    return (
      <div
        className={`min-h-screen pt-16 transition-colors duration-300 ${  // Added pt-16 here
          isDarkMode ? "dark bg-gray-900" : "bg-[#F7F7F9]"
        }`}
      >
        <Header
          selectedType={selectedType}
          onTypeSelect={handleTypeSelect}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
        />
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar
            characters={characters}
            interviewTypes={interviewTypes}
            selectedCharacter={selectedCharacter}
            selectedType={selectedType}
            onCharacterSelect={handleCharacterSelect}
            onTypeSelect={handleTypeSelect}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onResetInterview={() => {
              setMessages([]);
              setCurrentQuestion(1);
              setInterviewStarted(false);
              setResumeData(null);
              setIsResumeUploaded(false);
            }}
            onNewInterview={() => {
              setMessages([]);
              setCurrentQuestion(1);
              setInterviewStarted(false);
              setResumeData(null);
              setIsResumeUploaded(false);
            }}
            onViewHistory={() => {
              // You can implement a modal or navigation to view chatHistory if needed
              // For now, just log it
              console.log(chatHistory);
            }}
            messages={messages}
          />
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-4xl w-full space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-12">
                  {t("welcomeTitle")}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-center mb-8">
                  {t("welcomeSubtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resume Upload Section */}
                <div className="flex justify-center">
                  <ResumeUpload
                    onResumeExtracted={handleResumeExtracted}
                    isUploaded={isResumeUploaded}
                    resumeData={resumeData}
                  />
                </div>

                {/* Interview Setup Section */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Interview Setup
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {isResumeUploaded 
                        ? "Great! Your resume has been uploaded. The interviewer will ask personalized questions based on your experience."
                        : "Upload your resume for personalized questions, or proceed without it for general questions."
                      }
                    </p>
                  </div>

                  <div className="space-y-4">
                    {!selectedCharacter && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Please select an interviewer from the sidebar
                        </p>
                      </div>
                    )}
                    
                    {!selectedType && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Please select an interview type from the sidebar
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    className="px-8 py-4 bg-[#E07A5F] text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-[#E07A5F]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedCharacter || !selectedType}
                    onClick={async () => {
                      setInterviewStarted(true);
                      if (selectedCharacter && selectedType) {
                        await initializeSession(selectedCharacter, selectedType);
                      }
                    }}
                  >
                    {t("startButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-16 transition-colors duration-300 ${  // Added pt-16 here
        isDarkMode ? "dark bg-gray-900" : "bg-[#F7F7F9]"
      }`}
    >
      <Header
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={setSelectedLanguage}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          characters={characters}
          interviewTypes={interviewTypes}
          selectedCharacter={selectedCharacter}
          selectedType={selectedType}
          onCharacterSelect={handleCharacterSelect}
          onTypeSelect={handleTypeSelect}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onResetInterview={() => {
            setMessages([]);
            setCurrentQuestion(1);
            setInterviewStarted(false);
            setResumeData(null);
            setIsResumeUploaded(false);
          }}
          onNewInterview={() => {
            setMessages([]);
            setCurrentQuestion(1);
            setInterviewStarted(false);
            setResumeData(null);
            setIsResumeUploaded(false);
          }}
          onViewHistory={() => {
            // You can implement a modal or navigation to view chatHistory if needed
            // For now, just log it
            console.log(chatHistory);
          }}
          messages={messages}
        />

        <ChatCanvas
          messages={messages}
          selectedCharacter={selectedCharacter}
          selectedType={selectedType}
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
          onVoiceInput={handleVoiceInput}
          currentQuestion={currentQuestion}
          totalQuestions={5}
          sidebarCollapsed={sidebarCollapsed}
          onAnalysis={handleAnalysis}
          onFaceMetricsUpdate={handleFaceMetricsUpdate}
        />
      </div>

      {analysisLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
          <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <Loader2 className="w-10 h-10 animate-spin text-[#E07A5F]" />
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Generating Analysis...
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              Please wait while we review your interview session.
            </div>
          </div>
        </div>
      )}
      {sessionComplete && sessionData && !analysisLoading && (
        <SessionModal
          sessionData={sessionData}
          onClose={() => setSessionComplete(false)}
          onRetry={() => {
            setSessionComplete(false);
            setMessages([]);
            setCurrentQuestion(1);
            setResumeData(null);
            setIsResumeUploaded(false);
            if (selectedCharacter && selectedType) {
              initializeSession(selectedCharacter, selectedType);
            }
          }}
        />
      )}
    </div>
  );
}
