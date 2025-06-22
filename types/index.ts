export interface Character {
  id: string
  name: string
  role: string
  avatar: string
  avatarAnimated: string
  description: string
  company: string
  years: number
  focus: string
}

export interface InterviewType {
  id: string
  name: string
  icon: string
  description: string
}

export interface Message {
  id: string
  type: "user" | "interviewer"
  content: string
  timestamp: Date
  character?: Character
  hasAudio?: boolean
  audioFile?: string  // URL to the audio file from Murf API
  mood?: {
    value: number  // 0-100 scale
    label: string  // e.g. "Positive", "Neutral", "Concerned"
    emoji: string  // e.g. "😊", "😐", "😕"
  }
}

export interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    gpa?: string
  }>
  skills: string[]
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
  achievements: string[]
}

export interface SessionData {
  rating: number
  strengths: string[]
  improvements: string[]
  communication: string
  knowledge: string
  recommendations: string[]
  faceMetrics?: {
    averageConfidence: number
    dominantExpressions: Record<string, number>
    eyeContactPercentage: number
  }
}
