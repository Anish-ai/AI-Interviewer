import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';
import type { ResumeData, ResumeExtractionResult } from '@/types';
import { validateResumeData } from '@/types';

const geminiService = new GeminiService({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Unsupported file type' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const extractionPrompt = `Analyze the attached resume file and extract its content in a structured JSON format. The JSON object should include the following fields: "name", "email", "phone", "summary", "experience", "education", "skills", "projects", and "achievements".

If a field is not found, use an empty string or an empty array. Ensure the data is accurate and reflects the content of the resume.`;

    const extractedData = await geminiService.generateResponseWithFile(extractionPrompt, {
      buffer,
      mimeType: file.type,
    });
    
    let resumeData: ResumeData;
    try {
+      let parsedData;
+      try {
+        // Try parsing the entire response as JSON
+        parsedData = JSON.parse(extractedData);
+      } catch (e) {
+        // Fallback: try to find the first JSON object in the string
+        const firstBrace = extractedData.indexOf('{');
+        const lastBrace = extractedData.lastIndexOf('}');
+        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
+          const possibleJson = extractedData.substring(firstBrace, lastBrace + 1);
+          parsedData = JSON.parse(possibleJson);
+        } else {
+          throw new Error('No valid JSON object found in Gemini response.');
+        }
+      }

        // Sanitize data to ensure arrays are in the correct format
        const ensureStringArray = (field: any): string[] => {
          if (Array.isArray(field)) return field.map(String);
          if (typeof field === 'string') return field.split(',').map(s => s.trim()).filter(Boolean);
          return [];
        };

        resumeData = {
          ...parsedData,
          skills: ensureStringArray(parsedData.skills),
          achievements: ensureStringArray(parsedData.achievements),
          experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
          education: Array.isArray(parsedData.education) ? parsedData.education : [],
          projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
        };

        // Validate the extracted resume data
        const validation = validateResumeData(resumeData);
        if (!validation.isValid) {
          console.warn('Resume validation errors:', validation.errors);
          console.warn('Resume validation warnings:', validation.warnings);
          
          // Return partial success if we have some data but with warnings
          if (validation.warnings.length > 0 && validation.errors.length === 0) {
            return NextResponse.json({
              success: true,
              resumeData,
              message: 'Resume data extracted successfully with some warnings',
              warnings: validation.warnings
            });
          }
        }

      } else {
        throw new Error('No JSON found in Gemini response');
      }

      if (!resumeData.name && !resumeData.experience.length && !resumeData.skills.length) {
        throw new Error('Insufficient data extracted from resume');
      }

    } catch (parseError) {
      console.error('Error parsing extracted data:', parseError);
      console.error('Raw response from Gemini:', extractedData);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to parse resume data. Please ensure your resume is well-formatted.',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resumeData,
      message: 'Resume data extracted successfully'
    });

  } catch (error) {
    console.error('Error extracting resume data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to extract resume data from the document.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 