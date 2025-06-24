import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ResumeUpload } from "@/components/resume-upload";

import type { Character, InterviewType, ResumeData, Message } from "@/types";

interface WelcomeSectionProps {
  t: (key: "welcomeTitle" | "welcomeSubtitle" | "startButton") => string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  selectedLanguage: string;
  onLanguageSelect: (lang: string) => void;
  selectedType: InterviewType | null;
  onTypeSelect: (type: InterviewType) => void;
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
  interviewTypes: InterviewType[];
  characters: Character[];
  sidebarCollapsed: boolean;
  onToggleCollapse: () => void;
  onResetInterview: () => void;
  onNewInterview: () => void;
  onViewHistory: () => void;
  messages: Message[];
  currentQuestion: number;
  setInterviewStarted: (started: boolean) => void;
  initializeSession: (character: Character, type: InterviewType) => Promise<void>;
  resumeData: ResumeData | null;
  isResumeUploaded: boolean;
  handleResumeExtracted: (data: ResumeData) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  t,
  isDarkMode,
  onToggleDarkMode,
  selectedLanguage,
  onLanguageSelect,
  selectedType,
  onTypeSelect,
  selectedCharacter,
  onCharacterSelect,
  interviewTypes,
  characters,
  sidebarCollapsed,
  onToggleCollapse,
  onResetInterview,
  onNewInterview,
  onViewHistory,
  messages,
  currentQuestion,
  setInterviewStarted,
  initializeSession,
  resumeData,
  isResumeUploaded,
  handleResumeExtracted,
}) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
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
          isOpen={!sidebarCollapsed}
          onToggle={onToggleCollapse}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {t("welcomeTitle")}
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {t("welcomeSubtitle")}
              </p>
            </div>
            {/* Step 1: Selection */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Choose Your Interview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${selectedCharacter ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700'} border`}>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {selectedCharacter ? `Interviewer: ${selectedCharacter.name}` : "Select an Interviewer"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Use the sidebar to pick an interviewer.</p>
                </div>
                <div className={`p-4 rounded-lg ${selectedType ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700'} border`}>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {selectedType ? `Type: ${selectedType.name}` : "Select an Interview Type"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Use the sidebar to pick a type.</p>
                </div>
              </div>
            </div>
            {/* Step 2: Resume Upload */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Personalize Your Session (Optional)
              </h2>
              <ResumeUpload
                onResumeExtracted={handleResumeExtracted}
                isUploaded={isResumeUploaded}
                resumeData={resumeData}
              />
            </div>
            {/* Step 3: Start Interview */}
            <div className="text-center">
              <button
                className="w-full max-w-xs px-8 py-4 bg-[#E07A5F] text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-[#E07A5F]/90 transition-transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
              {(!selectedCharacter || !selectedType) && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Please select an interviewer and type to start.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 