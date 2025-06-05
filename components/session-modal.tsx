"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  BookOpen,
  Lightbulb,
  BarChart2,
} from "lucide-react";
import type { SessionData } from "@/types";

interface SessionModalProps {
  sessionData: SessionData | null;
  onClose: () => void;
  onRetry: () => void;
}

export function SessionModal({
  sessionData,
  onClose,
  onRetry,
}: SessionModalProps) {
  if (!sessionData) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto w-full bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-[#E07A5F]" /> Interview Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[80vh] overflow-y-auto pr-2">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {sessionData.rating}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < sessionData.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Overall Rating
            </span>
          </div>

          {/* Strengths */}
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Key Strengths
              </h3>
            </div>
            <ul className="space-y-2">
              {sessionData.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-green-800 dark:text-green-100"
                >
                  <span className="text-green-500">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                Areas for Improvement
              </h3>
            </div>
            <ul className="space-y-2">
              {sessionData.improvements.map((improvement, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-orange-800 dark:text-orange-100"
                >
                  <span className="text-orange-500">•</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>

          {/* Communication Assessment */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Communication Skills
              </h3>
            </div>
            <p className="text-blue-800 dark:text-blue-100">
              {sessionData.communication}
            </p>
          </div>

          {/* Knowledge Evaluation */}
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                Technical/Professional Knowledge
              </h3>
            </div>
            <p className="text-purple-800 dark:text-purple-100">
              {sessionData.knowledge}
            </p>
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                Recommendations
              </h3>
            </div>
            <ul className="space-y-2">
              {sessionData?.recommendations?.map((recommendation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-yellow-800 dark:text-yellow-100"
                >
                  <span className="text-yellow-500">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onRetry}>Start New Session</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
