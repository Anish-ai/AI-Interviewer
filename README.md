# MockInterviewAI 🤖

A sophisticated AI-powered mock interview platform that provides realistic interview experiences with dynamic feedback and mood analysis.

## Features ✨

- **AI Interviewers**: Choose from different professional characters with unique personalities and expertise
- **Multiple Interview Types**:
  - Technical Interviews
  - Behavioral Interviews
  - Case Study Interviews
- **Real-time Voice Interaction**: Speak naturally with the AI interviewer
- **Mood Analysis**: Get instant feedback through the interviewer's mood meter
- **Multilingual Support**: Conduct interviews in multiple languages
- **Audio Feedback**: Listen to the interviewer's responses
- **Session Analysis**: Receive detailed feedback and recommendations
- **Dark Mode Support**: Comfortable viewing in any lighting condition

## Tech Stack 🛠

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Custom components with Tailwind CSS
- **AI Integration**: Google Gemini AI
- **Voice Synthesis**: Murf AI
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom animations

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
5. **Monitor Progress**: Watch the mood meter for instant feedback
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
│   └── voice-waveform.tsx
├── lib/
│   ├── gemini.ts
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
- The open-source community for various tools and libraries

## Support 💬

If you encounter any issues or have questions, please open an issue in the GitHub repository.

---

Made with ❤️ by [Your Name]
