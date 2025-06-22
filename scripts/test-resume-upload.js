const fs = require('fs');
const path = require('path');

// Test the resume upload API
async function testResumeUpload() {
  try {
    console.log('🧪 Testing Resume Upload API...\n');
    
    // Read the sample resume file
    const sampleResumePath = path.join(__dirname, '../public/sample-resume.txt');
    const resumeContent = fs.readFileSync(sampleResumePath, 'utf-8');
    
    console.log('📄 Sample Resume Content:');
    console.log('='.repeat(50));
    console.log(resumeContent.substring(0, 500) + '...');
    console.log('='.repeat(50));
    
    // Create a mock file object
    const file = new Blob([resumeContent], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('resume', file, 'sample-resume.txt');
    
    console.log('\n📤 Uploading resume to API...');
    
    // Make the API request
    const response = await fetch('http://localhost:3000/api/extract-resume', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Resume extraction successful!');
      console.log('\n📋 Extracted Information:');
      console.log('='.repeat(50));
      console.log(`Name: ${result.resumeData.name}`);
      console.log(`Email: ${result.resumeData.email}`);
      console.log(`Phone: ${result.resumeData.phone}`);
      console.log(`Summary: ${result.resumeData.summary.substring(0, 100)}...`);
      console.log(`Experience: ${result.resumeData.experience.length} positions`);
      console.log(`Skills: ${result.resumeData.skills.slice(0, 5).join(', ')}...`);
      console.log(`Projects: ${result.resumeData.projects.length} projects`);
      console.log(`Achievements: ${result.resumeData.achievements.length} achievements`);
      console.log('='.repeat(50));
      
      console.log('\n🎯 How this enhances the interview:');
      console.log('• Interviewer will reference specific projects and skills');
      console.log('• Questions will be based on actual work experience');
      console.log('• Feedback will consider real achievements and background');
      console.log('• More personalized and relevant interview experience');
      
    } else {
      console.log('❌ Resume extraction failed:');
      console.log(result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running: npm run dev');
  }
}

// Run the test
testResumeUpload(); 