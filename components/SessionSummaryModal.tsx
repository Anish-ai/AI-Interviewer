import React from "react";
import { SessionModal } from "@/components/session-modal";
import type { SessionData } from "@/types";

interface SessionSummaryModalProps {
  sessionData: SessionData | null;
  sessionComplete: boolean;
  analysisLoading: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  sessionData,
  sessionComplete,
  analysisLoading,
  onClose,
  onRetry,
}) => {
  if (!sessionComplete || !sessionData || analysisLoading) return null;
  return (
    <SessionModal sessionData={sessionData} onClose={onClose} onRetry={onRetry} />
  );
}; 