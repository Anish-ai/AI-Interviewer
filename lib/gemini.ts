import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      console.log('🤖 Sending prompt to Gemini:', prompt);
      
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini response:', text);
      return text;
    } catch (error) {
      console.error('❌ Error generating response from Gemini:', error);
      return "I apologize, but I'm having trouble processing your response right now. Could you please repeat that?";
    }
  }

  async generateResponseWithFile(prompt: string, file: { buffer: Buffer, mimeType: string }): Promise<string> {
    try {
      console.log('🤖 Sending prompt and file to Gemini...');
      const filePart = {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimeType,
        },
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }, filePart] }],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more deterministic extraction
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // Increase tokens for potentially long resumes
        },
      });

      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini file response:', text);
      return text;
    } catch (error) {
      console.error('❌ Error generating response with file from Gemini:', error);
      throw new Error('Gemini failed to process the file.');
    }
  }

  async generateChatResponse(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const chat = this.model.startChat({
        history: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const result = await chat.sendMessage(messages[messages.length - 1].content);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating chat response from Gemini:', error);
      return "I apologize, but I'm having trouble processing your response right now. Could you please repeat that?";
    }
  }
} 