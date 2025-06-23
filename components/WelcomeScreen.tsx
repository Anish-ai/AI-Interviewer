"use client";

import { ResumeUpload } from "@/components/resume-upload";
import { InterviewCustomization } from "@/components/interview-customization";
import type { Character, InterviewType, ResumeData, InterviewCustomization as CustomizationType } from "@/types";
import { getTranslation, type TranslationKey } from "@/data/translations";

interface WelcomeScreenProps {
  selectedCharacter: Character | null;
  selectedType: InterviewType | null;
  selectedLanguage: string;
  isResumeUploaded: boolean;
  resumeData: ResumeData | null;
  interviewCustomization: CustomizationType;
  onResumeExtracted: (data: ResumeData) => void;
  onCustomizationChange: (customization: CustomizationType) => void;
  onStartInterview: () => void;
}

export function WelcomeScreen({
  selectedCharacter,
  selectedType,
  selectedLanguage,
  isResumeUploaded,
  resumeData,
  interviewCustomization,
  onResumeExtracted,
  onCustomizationChange,
  onStartInterview,
}: WelcomeScreenProps) {
  const t = (key: TranslationKey) => {
    return getTranslation(selectedLanguage, key);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 ml-80">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-12">
            {t("welcomeTitle")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center mb-8">
            {t("welcomeSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Resume Upload Section */}
          <div className="flex flex-col items-center">
            <ResumeUpload
              onResumeExtracted={onResumeExtracted}
              isUploaded={isResumeUploaded}
              resumeData={resumeData}
            />
          </div>

          {/* Interview Customization Section */}
          <div className="flex flex-col items-center">
            <InterviewCustomization
              customization={interviewCustomization}
              onCustomizationChange={onCustomizationChange}
            />
          </div>

          {/* Interview Setup Section */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Interview Setup
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
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
              onClick={onStartInterview}
            >
              {t("startButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 