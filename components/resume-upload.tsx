"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Edit } from "lucide-react";
import type { ResumeData } from "@/types";
import { createEmptyResumeData, validateResumeData } from "@/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ResumeUploadProps {
  onResumeExtracted: (resumeData: ResumeData) => void;
  isUploaded: boolean;
  resumeData: ResumeData | null;
}

export function ResumeUpload({ onResumeExtracted, isUploaded, resumeData }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualSummary, setManualSummary] = useState('');
  const [manualSkills, setManualSkills] = useState('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setWarnings([]);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 120));
      }, 200);

      const response = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract resume data');
      }

      const data = await response.json();
      
      if (data.success) {
        onResumeExtracted(data.resumeData);
        if (data.warnings && Array.isArray(data.warnings)) {
          setWarnings(data.warnings);
        }
      } else {
        throw new Error(data.error || 'Failed to extract resume data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again or enter details manually.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleManualSubmit = () => {
    if (!manualSummary && !manualSkills) {
      setError("Please provide at least a role or some skills.");
      return;
    }
    
    const manualData: ResumeData = {
        name: 'Candidate',
        email: '',
        phone: '',
        summary: manualSummary,
        experience: manualSummary ? [{ title: manualSummary, company: '', duration: '', description: '', achievements: [] }] : [],
        education: [],
        skills: manualSkills.split(',').map(s => s.trim()).filter(Boolean),
        projects: [],
        achievements: [],
    };

    // Validate the manual data
    const validation = validateResumeData(manualData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    if (validation.warnings.length > 0) {
      console.warn('Resume warnings:', validation.warnings);
    }

    onResumeExtracted(manualData);
    setError(null);
    setShowManualForm(false);
  };

  const UploadComponent = () => (
    <div className="space-y-3 lg:space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 lg:p-6 text-center hover:border-[#E07A5F] dark:hover:border-[#E07A5F] transition-colors">
        <Upload className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-2 lg:mb-3 text-gray-400" />
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-2">
          Drop your resume here or click to browse
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports PDF, DOC, DOCX (max 5MB)
        </p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="mt-2 lg:mt-3"
        >
          Choose File
        </Button>
      </div>
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {uploadProgress < 100 ? 'Extracting resume data...' : 'Almost done...'}
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowManualForm(true)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Manual Entry
        </Button>
      </div>
    </div>
  );

  const ManualFormComponent = () => (
    <div className="space-y-4 pt-4 mt-4 border-t">
      <h4 className="font-medium text-sm text-center">Manual Resume Entry</h4>
      <div className="space-y-2">
        <Label htmlFor="manual-summary">Your Current Role or a Brief Summary</Label>
        <Input id="manual-summary" placeholder="e.g., Senior Software Engineer" value={manualSummary} onChange={(e) => setManualSummary(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="manual-skills">Key Skills (comma-separated)</Label>
        <Textarea id="manual-skills" placeholder="e.g., React, Node.js, AWS" value={manualSkills} onChange={(e) => setManualSkills(e.target.value)} />
      </div>
      <Button onClick={handleManualSubmit} className="w-full">Use This Information</Button>
      <div className="text-center">
        <Button variant="link" className="text-sm" onClick={() => { setShowManualForm(false); setError(null); }}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-sm lg:max-w-md">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
          {showManualForm ? <Edit className="w-4 h-4 lg:w-5 lg:h-5" /> : <FileText className="w-4 h-4 lg:w-5 lg:h-5" />}
          {showManualForm ? 'Manual Entry' : 'Resume Upload'}
        </CardTitle>
        <CardDescription className="text-sm">
          Upload your resume or enter key details to personalize the interview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 lg:space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {warnings.length > 0 && (
          <Alert variant="default" className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <div className="space-y-1">
                <p className="font-medium">Resume extracted with some issues:</p>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!isUploaded ? (
          !showManualForm ? <UploadComponent /> : <ManualFormComponent />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  {resumeData?.name === 'Candidate' ? 'Information Submitted' : 'Resume Uploaded Successfully'}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {resumeData?.summary && `${resumeData.summary.substring(0, 30)}...`}
                  {resumeData?.summary && resumeData.skills && resumeData?.skills.length > 0 && ' • '}
                  {resumeData?.skills && resumeData?.skills.length > 0 && `${resumeData.skills.length} skills`}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Submitted Information:</h4>
              <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                {resumeData?.summary && <p><strong>Summary:</strong> {resumeData.summary}</p>}
                {resumeData?.skills && resumeData.skills.length > 0 && <p><strong>Skills:</strong> {resumeData.skills.join(', ')}</p>}
              </div>
            </div>

            <Button variant="outline" onClick={() => { onResumeExtracted(createEmptyResumeData()); setWarnings([]); }} className="w-full">
              Remove and Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 