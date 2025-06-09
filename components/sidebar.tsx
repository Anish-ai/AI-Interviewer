"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, History, Settings, Users, List, Check, Plus } from "lucide-react";
import type { Character, InterviewType } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sun, Moon } from "lucide-react";

interface SidebarProps {
  characters: Character[];
  interviewTypes: InterviewType[];
  selectedCharacter: Character | null;
  selectedType: InterviewType | null;
  onCharacterSelect: (character: Character) => void;
  onTypeSelect: (type: InterviewType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onResetInterview: () => void;
  messages?: any[];
  onNewInterview: () => void;
  onViewHistory: () => void;
}

export function Sidebar({
  characters,
  interviewTypes,
  selectedCharacter,
  selectedType,
  onCharacterSelect,
  onTypeSelect,
  collapsed,
  onToggleCollapse,
  onResetInterview,
  messages = [],
  onNewInterview,
  onViewHistory,
}: SidebarProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const isOpen = !collapsed;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 ${
        isOpen ? "w-80" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {isOpen && (
              <h1 className="text-xl font-bold text-[#56707F]">MockInterviewAI</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleCollapse()}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5 text-[#56707F]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#56707F]" />
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Characters Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#56707F]" />
                {isOpen && (
                  <h2 className="text-sm font-semibold text-[#56707F]">
                    Interviewers
                  </h2>
                )}
              </div>
              <div className="space-y-2">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => onCharacterSelect(character)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                      selectedCharacter?.id === character.id
                        ? "bg-[#E07A5F]/10 text-[#E07A5F]"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={character.avatarAnimated || character.avatar}
                        alt={character.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#E07A5F] bg-white shadow-sm"
                      />
                      {selectedCharacter?.id === character.id && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#E07A5F] rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {isOpen && (
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {character.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {character.role}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Types Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-[#56707F]" />
                {isOpen && (
                  <h2 className="text-sm font-semibold text-[#56707F]">
                    Interview Types
                  </h2>
                )}
              </div>
              <div className="space-y-2">
                {interviewTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onTypeSelect(type)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                      selectedType?.id === type.id
                        ? "bg-[#E07A5F]/10 text-[#E07A5F]"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#56707F]/10 flex items-center justify-center">
                      {type.icon}
                    </div>
                    {isOpen && (
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {type.description}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex-none p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          {isOpen && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={onNewInterview}
                className="w-full bg-[#E07A5F] hover:bg-[#E07A5F]/90 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Interview
              </Button>
              <Button
                onClick={onViewHistory}
                variant="outline"
                className="w-full border-gray-200 dark:border-gray-700 hover:border-[#E07A5F]/50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>AI Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Settings
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                  Theme
                </h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                      theme === "light"
                        ? "border-[#E07A5F] bg-[#E07A5F]/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#E07A5F]/50"
                    }`}
                  >
                    <Sun className="w-5 h-5 mx-auto mb-2 text-gray-700 dark:text-gray-200" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Light
                    </span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                      theme === "dark"
                        ? "border-[#E07A5F] bg-[#E07A5F]/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#E07A5F]/50"
                    }`}
                  >
                    <Moon className="w-5 h-5 mx-auto mb-2 text-gray-700 dark:text-gray-200" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Dark
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                  Language
                </h4>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
