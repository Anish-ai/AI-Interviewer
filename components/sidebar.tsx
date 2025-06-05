"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, History, Settings } from "lucide-react";
import type { Character, InterviewType } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
}: SidebarProps) {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div
      className={`relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${
        collapsed ? "w-16" : "w-80"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 z-10 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      <ScrollArea className="h-full p-4">
        {!collapsed ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Select Interviewer
              </h3>
              <div className="space-y-2">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => onCharacterSelect(character)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedCharacter?.id === character.id
                        ? "border-[#56707F] bg-[#56707F]/5 scale-105"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#56707F]/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          character.avatarAnimated ||
                          character.avatar ||
                          "/placeholder.svg"
                        }
                        alt={character.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E07A5F] bg-white"
                        style={{ background: "#fff" }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {character.name}
                        </div>
                        <div className="text-sm text-[#56707F]">
                          {character.role}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Interview Types
              </h3>
              <div className="space-y-2">
                {interviewTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onTypeSelect(type)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedType?.id === type.id
                        ? "border-[#E07A5F] bg-[#E07A5F]/5 scale-105"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#E07A5F]/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={() => setHistoryOpen(true)}
              >
                <History className="w-4 h-4" />
                Session History
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 mt-1"
                onClick={onResetInterview}
              >
                <span className="w-4 h-4">🔄</span>
                Reset Interview
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {characters.map((character) => (
              <button
                key={character.id}
                onClick={() => onCharacterSelect(character)}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  selectedCharacter?.id === character.id
                    ? "border-[#56707F] scale-110"
                    : "border-gray-200 dark:border-gray-700 hover:border-[#56707F]/50"
                }`}
              >
                <img
                  src={
                    character.avatarAnimated ||
                    character.avatar ||
                    "/placeholder.svg"
                  }
                  alt={character.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </button>
            ))}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />
            <Button variant="ghost" size="icon">
              <History className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </ScrollArea>

      {historyOpen && (
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className="max-w-xl w-full bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Session Chat History
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto space-y-4 mt-2">
              {messages.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-300 text-center">
                  No chat history yet.
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-900/40"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {msg.type === "user"
                        ? "You"
                        : msg.character?.name || "Interviewer"}
                    </div>
                    <div className="text-gray-900 dark:text-white whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
