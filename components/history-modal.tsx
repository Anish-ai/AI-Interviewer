"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Award } from "lucide-react";
import { InterviewHistoryEntry } from "@/types/history";
import { Button } from "./ui/button";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: InterviewHistoryEntry[];
  onReplayInterview: (entry: InterviewHistoryEntry) => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  entries,
  onReplayInterview,
}: HistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Interview History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No interview history yet. Complete your first interview to see it here!
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 space-y-3 hover:border-[#E07A5F] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={entry.character.avatar}
                        alt={entry.character.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{entry.character.name}</h3>
                        <p className="text-sm text-gray-500">{entry.interviewType.name}</p>
                      </div>
                    </div>
                    {entry.score !== undefined && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">{entry.score}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.round(entry.duration / 60)} mins</span>
                    </div>
                  </div>

                  {entry.resumeData && (
                    <div className="text-sm text-gray-600">
                      <strong>Role:</strong> {entry.resumeData.summary}
                    </div>
                  )}

                  <Button
                    onClick={() => onReplayInterview(entry)}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    View Interview
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
