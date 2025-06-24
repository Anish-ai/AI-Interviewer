import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ChatCanvas } from "@/components/chat-canvas";
import type { Character, InterviewType, Message, ResumeData, SessionData } from "@/types";
import type { FaceMetrics } from "@/lib/hooks/useFaceDetection";

interface InterviewLayoutProps {
  selectedType: InterviewType | null;
  onTypeSelect: (type: InterviewType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  selectedLanguage: string;
  onLanguageSelect: (lang: string) => void;
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
  interviewTypes: InterviewType[];
  characters: Character[];
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onResetInterview: () => void;
  onNewInterview: () => void;
  onViewHistory: () => void;
  messages: Message[];
  isRecording: boolean;
  setIsRecording: (val: boolean) => void;
  onVoiceInput: (transcript: string) => void;
  currentQuestion: number;
  totalQuestions: number;
  onAnalysis: () => void;
  onFaceMetricsUpdate: (metrics: FaceMetrics) => void;
  resumeData: ResumeData | null;
  isResumeUploaded: boolean;
  children?: React.ReactNode; // For modals
}

export const InterviewLayout: React.FC<InterviewLayoutProps> = ({
  selectedType,
  onTypeSelect,
  isDarkMode,
  onToggleDarkMode,
  selectedLanguage,
  onLanguageSelect,
  selectedCharacter,
  onCharacterSelect,
  interviewTypes,
  characters,
  isSidebarOpen,
  onToggleSidebar,
  onResetInterview,
  onNewInterview,
  onViewHistory,
  messages,
  isRecording,
  setIsRecording,
  onVoiceInput,
  currentQuestion,
  totalQuestions,
  onAnalysis,
  onFaceMetricsUpdate,
  children,
}) => {
  return (
    <div
      className={`min-h-screen pt-16 transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-[#F7F7F9]"
      }`}
    >
      <Header
        selectedType={selectedType}
        onTypeSelect={onTypeSelect}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={onLanguageSelect}
      />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          characters={characters}
          interviewTypes={interviewTypes}
          selectedCharacter={selectedCharacter}
          selectedType={selectedType}
          onCharacterSelect={onCharacterSelect}
          onTypeSelect={onTypeSelect}
          onResetInterview={onResetInterview}
          onNewInterview={onNewInterview}
          onViewHistory={onViewHistory}
          messages={messages}
          isOpen={isSidebarOpen}
          onToggle={onToggleSidebar}
        />
        <ChatCanvas
          messages={messages}
          selectedCharacter={selectedCharacter}
          selectedType={selectedType}
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
          onVoiceInput={onVoiceInput}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          onAnalysis={onAnalysis}
          onFaceMetricsUpdate={onFaceMetricsUpdate}
        />
      </div>
      {children}
    </div>
  );
}; 