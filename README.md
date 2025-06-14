# MockInterviewAI 🤖

A sophisticated AI-powered mock interview platform that provides realistic interview experiences with dynamic feedback, mood analysis, and real-time facial expression tracking.

## Features ✨

### Core Features
- **AI Interviewers**: Choose from different professional characters with unique personalities and expertise
- **Multiple Interview Types**:
  - Technical Interviews
  - Behavioral Interviews
  - Case Study Interviews
- **Real-time Voice Interaction**: Speak naturally with the AI interviewer
- **Mood Analysis**: Get instant feedback through the interviewer's mood meter
- **Facial Expression Tracking**: Real-time analysis of facial expressions and engagement
- **Eye Contact Detection**: Monitor and improve your eye contact during interviews
- **Multilingual Support**: Conduct interviews in multiple languages
- **Audio Feedback**: Listen to the interviewer's responses
- **Session Analysis**: Receive detailed feedback and recommendations
- **Dark Mode Support**: Comfortable viewing in any lighting condition

### UI/UX Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Collapsible Sidebar**: Customizable workspace layout
- **Real-time Animations**: Smooth transitions and visual feedback
- **Interactive Elements**: Engaging user interface with modern design
- **Progress Tracking**: Visual indicators for interview progress
- **Session History**: Access past interview sessions and feedback

## Tech Stack 🛠

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: 
  - Custom components with Tailwind CSS
  - Radix UI for accessible components
  - Lucide Icons for consistent iconography
- **State Management**: React Hooks and Context API
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - CSS Modules for component-specific styles
  - Custom animations and transitions

### AI & Machine Learning
- **Language Model**: Google Gemini AI
- **Voice Synthesis**: Murf AI
- **Face Detection**: face-api.js
  - Real-time facial expression analysis
  - Eye contact detection
  - Engagement metrics tracking

### Backend & APIs
- **API Integration**: 
  - Google Gemini API for natural language processing
  - Murf AI API for voice synthesis
- **Authentication**: Next.js built-in authentication
- **Data Storage**: Local storage for session management

### Development Tools
- **Package Manager**: npm/yarn
- **Version Control**: Git
- **Code Quality**:
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript for type safety
- **Build Tools**: Next.js build system

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key
- Murf AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mock-interview-ai.git
cd mock-interview-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
MURF_API_KEY=your_murf_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide 📖

1. **Select an Interviewer**: Choose from available AI interviewers with different professional backgrounds
2. **Choose Interview Type**: Select the type of interview you want to practice
3. **Start Interview**: Click the "Start Interview" button to begin
4. **Respond to Questions**: Use the microphone button to speak your responses
5. **Monitor Progress**: 
   - Watch the mood meter for instant feedback
   - Track facial expressions and eye contact
   - View real-time engagement metrics
6. **Review Analysis**: Get comprehensive feedback at the end of the session

## Project Structure 📁

```
mock-interview-ai/
├── app/
│   ├── api/
│   │   └── process-message/
│   └── page.tsx
├── components/
│   ├── chat-canvas.tsx
│   ├── header.tsx
│   ├── session-modal.tsx
│   ├── sidebar.tsx
│   ├── video-capture.tsx
│   └── voice-waveform.tsx
├── lib/
│   ├── gemini.ts
│   ├── hooks/
│   │   └── useFaceDetection.ts
│   └── murf.ts
├── types/
│   └── index.ts
└── public/
    └── avatars/
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Google Gemini AI for natural language processing
- Murf AI for voice synthesis
- face-api.js for facial expression analysis
- The open-source community for various tools and libraries

## Support 💬

If you encounter any issues or have questions, please open an issue in the GitHub repository.

---

Made with ❤️ by [Your Name]
