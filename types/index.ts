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

export interface InterviewCustomization {
  difficulty: 'beginner' | 'moderate' | 'advanced'
  topicFocus: 'dsa' | 'projects' | 'cs-fundamentals' | 'resume' | 'mixed'
  purpose: 'intern' | 'placement' | 'general'
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

// Utility types for resume processing
export interface ResumeExtractionResult {
  success: boolean
  resumeData?: ResumeData
  error?: string
  message?: string
}

export interface ResumeValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Helper function to create empty resume data
export const createEmptyResumeData = (): ResumeData => ({
  name: '',
  email: '',
  phone: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  achievements: []
})

// Helper function to validate resume data
export const validateResumeData = (data: ResumeData): ResumeValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data.name.trim()) {
    errors.push('Name is required')
  }

  if (!data.summary.trim() && data.experience.length === 0 && data.skills.length === 0) {
    errors.push('At least one of summary, experience, or skills is required')
  }

  if (data.experience.length === 0) {
    warnings.push('No work experience found')
  }

  if (data.skills.length === 0) {
    warnings.push('No skills listed')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
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
