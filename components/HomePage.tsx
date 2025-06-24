import React from "react";
import { ResumeUpload } from "@/components/resume-upload";
import { InterviewCustomization } from "@/components/interview-customization";
import type { ResumeData, InterviewCustomization as CustomizationType } from "@/types";
import type { TranslationKey } from "@/data/translations";

interface HomePageProps {
  t: (key: TranslationKey) => string;
  isResumeUploaded: boolean;
  resumeData: ResumeData | null;
  onResumeExtracted: (data: ResumeData) => void;
  interviewCustomization: CustomizationType;
  onCustomizationChange: (customization: CustomizationType) => void;
  selectedCharacter: any;
  selectedType: any;
  onStartInterview: () => void;
}

export function HomePage({
  t,
  isResumeUploaded,
  resumeData,
  onResumeExtracted,
  interviewCustomization,
  onCustomizationChange,
  selectedCharacter,
  selectedType,
  onStartInterview,
}: HomePageProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 lg:ml-80">
      <div className="max-w-6xl w-full space-y-6 lg:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 mt-8 lg:mt-12">
            {t("welcomeTitle")}
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center mb-6 lg:mb-8">
            {t("welcomeSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Resume Upload Section */}
          <div className="flex flex-col items-center">
            <ResumeUpload
              onResumeExtracted={onResumeExtracted}
              isUploaded={isResumeUploaded}
              resumeData={resumeData}
            />
          </div>

          {/* Interview Customization Section */}
          <div className="flex flex-col items-center lg:col-span-1 xl:col-span-1">
            <InterviewCustomization
              customization={interviewCustomization}
              onCustomizationChange={onCustomizationChange}
            />
          </div>

          {/* Interview Setup Section */}
          <div className="flex flex-col justify-center space-y-4 lg:space-y-6 lg:col-span-1 xl:col-span-1">
            <div className="text-center">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
                Interview Setup
              </h2>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-6 lg:mb-8 max-w-md mx-auto">
                {isResumeUploaded 
                  ? "Great! Your resume has been uploaded. The interviewer will ask personalized questions based on your experience."
                  : "Upload your resume for personalized questions, or proceed without it for general questions."
                }
              </p>
            </div>

            <div className="space-y-3 lg:space-y-4">
              {!selectedCharacter && (
                <div className="p-3 lg:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs lg:text-sm text-yellow-800 dark:text-yellow-200">
                    Please select an interviewer from the sidebar
                  </p>
                </div>
              )}
              
              {!selectedType && (
                <div className="p-3 lg:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs lg:text-sm text-yellow-800 dark:text-yellow-200">
                    Please select an interview type from the sidebar
                  </p>
                </div>
              )}
            </div>

            <button
              className="px-6 lg:px-8 py-3 lg:py-4 bg-[#E07A5F] text-white text-base lg:text-lg font-semibold rounded-xl shadow-lg hover:bg-[#E07A5F]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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