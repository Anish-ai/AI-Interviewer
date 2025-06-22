"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Edit } from "lucide-react";
import type { ResumeData } from "@/types";
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
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveResume = () => {
    onResumeExtracted({
      name: '', email: '', phone: '', summary: '', experience: [],
      education: [], skills: [], projects: [], achievements: []
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    onResumeExtracted(manualData);
    setError(null);
    setShowManualForm(false);
  };

  const UploadComponent = () => (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-[#E07A5F] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={handleUploadClick}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF, Word, or Text files up to 5MB</p>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Extracting data...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      <Button onClick={handleUploadClick} disabled={isUploading} className="w-full">
        {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><Upload className="w-4 h-4 mr-2" />Choose File</>}
      </Button>
      <div className="text-center">
        <Button variant="link" className="text-sm" onClick={() => { setShowManualForm(true); setError(null); }}>
          Or enter details manually
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {showManualForm ? <Edit className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          {showManualForm ? 'Manual Entry' : 'Resume Upload'}
        </CardTitle>
        <CardDescription>
          Upload your resume or enter key details to personalize the interview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isUploaded ? (
          showManualForm ? <ManualFormComponent /> : <UploadComponent />
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

            <Button variant="outline" onClick={handleRemoveResume} className="w-full">
              Remove and Start Over
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
} 