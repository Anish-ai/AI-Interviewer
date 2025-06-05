import { NextResponse } from 'next/server';
import { MurfService } from '@/lib/murf';
import { GeminiService } from '@/lib/gemini';
import type { Character, InterviewType } from '@/types';

// Initialize services with environment variables
const murfService = new MurfService({
  apiKey: process.env.MURF_API_KEY || '',
});

const geminiService = new GeminiService({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    console.log('📥 Received request to process message');
    const { message, character, interviewType, currentQuestion, isFeedback } = await req.json();
    console.log('📝 Request data:', { message, character, interviewType, currentQuestion, isFeedback });

    // Step 1: Process message with Gemini
    console.log('🤖 Processing message with Gemini...');
    let processedMessage;
    try {
      processedMessage = await geminiService.generateResponse(message);
      console.log('✅ Gemini processing complete:', processedMessage);
    } catch (geminiError) {
      console.error('❌ Gemini error:', geminiError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to process message with Gemini',
          details: geminiError instanceof Error ? geminiError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Only generate audio if it's not a feedback request
    if (!isFeedback) {
      try {
        // Step 2: Generate speech from processed message
        console.log('🔊 Generating speech with Murf...');
        console.log('📝 Text to convert:', processedMessage);
        console.log('👤 Character:', character);
        
        const audioUrl = await murfService.generateSpeech(processedMessage, character?.id);
        console.log('✅ Speech generation complete');

        return NextResponse.json({
          success: true,
          processedMessage,
          audioFile: audioUrl,
          timestamp: Date.now(),
        });
      } catch (audioError) {
        console.error('❌ Error generating audio:', audioError);
        // Return the text response even if audio generation fails
        return NextResponse.json({
          success: true,
          processedMessage,
          error: 'Audio generation failed, but text response is available',
          timestamp: Date.now(),
        });
      }
    }

    // For feedback requests, just return the processed message
    return NextResponse.json({
      success: true,
      processedMessage,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('❌ Error processing message:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
} 