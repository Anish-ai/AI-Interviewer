"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Code, 
  BookOpen, 
  FileText, 
  Layers, 
  GraduationCap, 
  Briefcase, 
  Users,
  Target,
  Zap,
  Brain,
  Rocket
} from "lucide-react";
import type { InterviewCustomization } from "@/types";
import React from "react";

interface InterviewCustomizationProps {
  customization: InterviewCustomization;
  onCustomizationChange: (customization: InterviewCustomization) => void;
}

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', icon: BookOpen, color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'moderate', label: 'Moderate', icon: Target, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'advanced', label: 'Advanced', icon: Zap, color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' }
];

const topicOptions = [
  { value: 'dsa', label: 'DSA', icon: Code, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  { value: 'projects', label: 'Projects', icon: Layers, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  { value: 'cs-fundamentals', label: 'CS Fundamentals', icon: Brain, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' },
  { value: 'resume', label: 'Resume', icon: FileText, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
  { value: 'mixed', label: 'Mixed', icon: Rocket, color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400' }
];

const purposeOptions = [
  { value: 'intern', label: 'Internship', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
  { value: 'placement', label: 'Placement', icon: Briefcase, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400' },
  { value: 'general', label: 'General', icon: Users, color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400' }
];

export function InterviewCustomization({ 
  customization, 
  onCustomizationChange 
}: InterviewCustomizationProps) {
  const [localCustomization, setLocalCustomization] = useState<InterviewCustomization>(customization);

  const handleDifficultyChange = (value: number[]) => {
    const difficultyMap = ['beginner', 'moderate', 'advanced'];
    const newCustomization = { ...localCustomization, difficulty: difficultyMap[value[0]] as 'beginner' | 'moderate' | 'advanced' };
    setLocalCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  const handleTopicChange = (value: number[]) => {
    const topicMap = ['dsa', 'projects', 'cs-fundamentals', 'resume', 'mixed'];
    const newCustomization = { ...localCustomization, topicFocus: topicMap[value[0]] as 'dsa' | 'projects' | 'cs-fundamentals' | 'resume' | 'mixed' };
    setLocalCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  const handlePurposeChange = (value: number[]) => {
    const purposeMap = ['intern', 'placement', 'general'];
    const newCustomization = { ...localCustomization, purpose: purposeMap[value[0]] as 'intern' | 'placement' | 'general' };
    setLocalCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  const getDifficultyValue = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return [0];
      case 'moderate': return [1];
      case 'advanced': return [2];
      default: return [1];
    }
  };

  const getTopicValue = (topic: string) => {
    switch (topic) {
      case 'dsa': return [0];
      case 'projects': return [1];
      case 'cs-fundamentals': return [2];
      case 'resume': return [3];
      case 'mixed': return [4];
      default: return [4];
    }
  };

  const getPurposeValue = (purpose: string) => {
    switch (purpose) {
      case 'intern': return [0];
      case 'placement': return [1];
      case 'general': return [2];
      default: return [2];
    }
  };

  const getCurrentDifficulty = () => difficultyOptions.find(opt => opt.value === localCustomization.difficulty);
  const getCurrentTopic = () => topicOptions.find(opt => opt.value === localCustomization.topicFocus);
  const getCurrentPurpose = () => purposeOptions.find(opt => opt.value === localCustomization.purpose);

  return (
    <Card className="w-full max-w-sm lg:max-w-md">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
          <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" />
          Interview Customization
        </CardTitle>
        <CardDescription className="text-sm">
          Customize your interview experience by adjusting difficulty, focus areas, and purpose
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6">
        {/* Difficulty Level */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Difficulty Level</h3>
            <Badge className={getCurrentDifficulty()?.color}>
              {getCurrentDifficulty()?.icon && React.createElement(getCurrentDifficulty()!.icon, { className: "w-3 h-3 mr-1" })}
              {getCurrentDifficulty()?.label}
            </Badge>
          </div>
          <Slider
            value={getDifficultyValue(localCustomization.difficulty)}
            onValueChange={handleDifficultyChange}
            max={2}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Beginner</span>
            <span>Moderate</span>
            <span>Advanced</span>
          </div>
        </div>

        {/* Topic Focus */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Topic Focus</h3>
            <Badge className={getCurrentTopic()?.color}>
              {getCurrentTopic()?.icon && React.createElement(getCurrentTopic()!.icon, { className: "w-3 h-3 mr-1" })}
              {getCurrentTopic()?.label}
            </Badge>
          </div>
          <Slider
            value={getTopicValue(localCustomization.topicFocus)}
            onValueChange={handleTopicChange}
            max={4}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>DSA</span>
            <span>Projects</span>
            <span>CS Fundamentals</span>
            <span>Resume</span>
            <span>Mixed</span>
          </div>
        </div>

        {/* Interview Purpose */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Interview Purpose</h3>
            <Badge className={getCurrentPurpose()?.color}>
              {getCurrentPurpose()?.icon && React.createElement(getCurrentPurpose()!.icon, { className: "w-3 h-3 mr-1" })}
              {getCurrentPurpose()?.label}
            </Badge>
          </div>
          <Slider
            value={getPurposeValue(localCustomization.purpose)}
            onValueChange={handlePurposeChange}
            max={2}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Internship</span>
            <span>Placement</span>
            <span>General</span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 lg:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Interview Summary</h4>
          <div className="space-y-1 text-xs lg:text-sm text-gray-600 dark:text-gray-300">
            <p>• <strong>Difficulty:</strong> {getCurrentDifficulty()?.label} level questions</p>
            <p>• <strong>Focus:</strong> {getCurrentTopic()?.label} focused content</p>
            <p>• <strong>Purpose:</strong> {getCurrentPurpose()?.label} interview preparation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 