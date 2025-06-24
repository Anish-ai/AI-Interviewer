const fs = require('fs');
const path = require('path');

// Test the resume upload API
async function testResumeUpload() {
  console.log('🧪 Testing Resume Upload API...\n');

  const sampleResumePath = path.join(__dirname, '../public/sample-resume.txt');
  
  if (!fs.existsSync(sampleResumePath)) {
    console.log('❌ Sample resume file not found. Creating one...');
    
    const sampleContent = `John Doe
Software Engineer
john.doe@email.com
(555) 123-4567

SUMMARY
Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.

EXPERIENCE
Senior Software Engineer | TechCorp | 2020-2023
- Led development of microservices architecture
- Improved application performance by 40%
- Mentored junior developers

Software Developer | StartupXYZ | 2018-2020
- Built RESTful APIs using Node.js and Express
- Implemented CI/CD pipelines
- Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2018

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Git, MongoDB, PostgreSQL

PROJECTS
E-commerce Platform | React, Node.js, MongoDB | Built full-stack e-commerce solution
Task Management App | React, Firebase | Real-time collaborative task management

ACHIEVEMENTS
- Employee of the Year 2022
- Led team of 5 developers
- Reduced deployment time by 60%`;

    fs.writeFileSync(sampleResumePath, sampleContent);
    console.log('✅ Sample resume file created.');
  }

  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(sampleResumePath);
    const file = new Blob([fileBuffer], { type: 'text/plain' });
    formData.append('resume', file, 'sample-resume.txt');

    console.log('📤 Uploading sample resume...');
    
    const response = await fetch('http://localhost:3000/api/extract-resume', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Resume upload successful!');
      console.log('📄 Extracted data:');
      console.log('- Name:', data.resumeData.name);
      console.log('- Email:', data.resumeData.email);
      console.log('- Skills:', data.resumeData.skills.length, 'skills found');
      console.log('- Experience:', data.resumeData.experience.length, 'positions');
      console.log('- Projects:', data.resumeData.projects.length, 'projects');
      
      if (data.warnings) {
        console.log('⚠️ Warnings:', data.warnings);
      }
    } else {
      console.log('❌ Resume upload failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Error testing resume upload:', error.message);
  }
}

// Resume validation functions (JavaScript versions)
function createEmptyResumeData() {
  return {
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: []
  };
}

function validateResumeData(data) {
  const errors = [];
  const warnings = [];

  if (!data.name.trim()) {
    errors.push('Name is required');
  }

  if (!data.summary.trim() && data.experience.length === 0 && data.skills.length === 0) {
    errors.push('At least one of summary, experience, or skills is required');
  }

  if (data.experience.length === 0) {
    warnings.push('No work experience found');
  }

  if (data.skills.length === 0) {
    warnings.push('No skills listed');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Test the resume validation functionality
function testResumeValidation() {
  console.log('🧪 Testing Resume Validation...\n');

  // Test 1: Empty resume data
  console.log('Test 1: Empty resume data');
  const emptyResume = createEmptyResumeData();
  const emptyValidation = validateResumeData(emptyResume);
  console.log('Is valid:', emptyValidation.isValid);
  console.log('Errors:', emptyValidation.errors);
  console.log('Warnings:', emptyValidation.warnings);
  console.log('');

  // Test 2: Valid resume data
  console.log('Test 2: Valid resume data');
  const validResume = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    summary: 'Experienced software engineer',
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        duration: '2020-2023',
        description: 'Led development team',
        achievements: ['Improved performance by 50%']
      }
    ],
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'University',
        year: '2020'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Full-stack application',
        technologies: ['React', 'Node.js', 'MongoDB']
      }
    ],
    achievements: ['Employee of the Year 2022']
  };
  
  const validValidation = validateResumeData(validResume);
  console.log('Is valid:', validValidation.isValid);
  console.log('Errors:', validValidation.errors);
  console.log('Warnings:', validValidation.warnings);
  console.log('');

  // Test 3: Resume with warnings
  console.log('Test 3: Resume with warnings');
  const warningResume = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    summary: 'Junior developer',
    experience: [], // No experience
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'University',
        year: '2023'
      }
    ],
    skills: [], // No skills
    projects: [],
    achievements: []
  };
  
  const warningValidation = validateResumeData(warningResume);
  console.log('Is valid:', warningValidation.isValid);
  console.log('Errors:', warningValidation.errors);
  console.log('Warnings:', warningValidation.warnings);
  console.log('');

  console.log('✅ Resume validation tests completed!');
}

// Run the tests
testResumeValidation(); 