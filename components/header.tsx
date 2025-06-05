"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, MessageCircle, Mic, Globe } from "lucide-react";
import type { InterviewType } from "@/types";

interface HeaderProps {
  selectedType: InterviewType | null;
  onTypeSelect: (type: InterviewType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  selectedLanguage: string;
  onLanguageSelect: (lang: string) => void;
}

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

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "hi", name: "हिन्दी" },
];

export function Header({
  selectedType,
  onTypeSelect,
  isDarkMode,
  onToggleDarkMode,
  selectedLanguage,
  onLanguageSelect,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-[#E07A5F] rounded-lg">
            <MessageCircle className="w-4 h-4 text-white" />
            <Mic className="w-3 h-3 text-white -ml-1" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            MockInterviewAI
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedType ? (
                  <>
                    <span>{selectedType.icon}</span>
                    {selectedType.name}
                  </>
                ) : (
                  "Select Interview Type"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {interviewTypes.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  onClick={() => onTypeSelect(type)}
                  className="flex items-center gap-3 p-3"
                >
                  <span className="text-lg">{type.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {type.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {type.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 px-4 py-2">
                <Globe className="w-5 h-5" />
                {languages.find((lang) => lang.code === selectedLanguage)
                  ?.name || "Language"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => onLanguageSelect(lang.code)}
                  className={`flex items-center gap-2 ${
                    selectedLanguage === lang.code
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="w-10 h-10"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
