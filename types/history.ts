import { Character, InterviewType, ResumeData } from './index';

export interface InterviewHistoryEntry {
  id: string;
  date: string;
  character: Character;
  interviewType: InterviewType;
  resumeData: ResumeData | null;
  messages: any[];
  duration: number;
  score?: number;
}

export interface InterviewHistory {
  entries: InterviewHistoryEntry[];
}
