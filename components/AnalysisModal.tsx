import React from "react";
import { Loader2 } from "lucide-react";

interface AnalysisModalProps {
  show: boolean;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ show }) => {
  if (!show) return null;
  return (
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
  );
}; 