"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ChatCanvas } from "@/components/chat-canvas";
import { SessionModal } from "@/components/session-modal";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Loader2 } from "lucide-react";
import { characters } from "@/data/characters";
import { interviewTypes } from "@/data/interviewTypes";
import { useInterviewLogic } from "@/hooks/useInterviewLogic";
import { useSidebarState } from "@/hooks/useSidebarState";

export default function MockInterviewAI() {
  const {
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
    
    // Actions
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
    handleSessionModalClose,
    handleSessionModalRetry,
  } = useInterviewLogic();

  const { isSidebarOpen, toggleSidebar } = useSidebarState();

  const handleStartInterview = async () => {
    setInterviewStarted(true);
    if (selectedCharacter && selectedType) {
      await initializeSession(selectedCharacter, selectedType);
    }
  };

  const handleViewHistory = () => {
    console.log(chatHistory);
  };

  // Show Start Interview button if not started
  if (!interviewStarted) {
    return (
      <div
        className={`min-h-screen pt-16 transition-colors duration-300 ${
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
            onResetInterview={resetInterviewState}
            onNewInterview={resetInterviewState}
            onViewHistory={handleViewHistory}
            messages={messages}
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
          />
          <WelcomeScreen
            selectedCharacter={selectedCharacter}
            selectedType={selectedType}
            selectedLanguage={selectedLanguage}
            isResumeUploaded={isResumeUploaded}
            resumeData={resumeData}
            interviewCustomization={interviewCustomization}
            onResumeExtracted={handleResumeExtracted}
            onCustomizationChange={setInterviewCustomization}
            onStartInterview={handleStartInterview}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-16 transition-colors duration-300 ${
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
          onResetInterview={resetInterviewState}
          onNewInterview={resetInterviewState}
          onViewHistory={handleViewHistory}
          messages={messages}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
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
          onClose={handleSessionModalClose}
          onRetry={handleSessionModalRetry}
        />
      )}
    </div>
  );
}
