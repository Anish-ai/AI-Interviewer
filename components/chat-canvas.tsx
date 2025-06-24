"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  MicOff,
  Play,
  Square,
  Settings,
  BarChart2,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Character, InterviewType, Message } from "@/types";
import { VoiceWaveform } from "@/components/voice-waveform";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { VideoCapture } from "@/components/video-capture";
import type { FaceMetrics } from "@/lib/hooks/useFaceDetection";

interface ChatCanvasProps {
  messages: Message[];
  selectedCharacter: Character | null;
  selectedType: InterviewType | null;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  onVoiceInput: (transcript: string) => void;
  currentQuestion: number;
  totalQuestions: number;
  onAnalysis: () => void;
  onFaceMetricsUpdate?: (metrics: FaceMetrics) => void;
}

export function ChatCanvas({
  messages,
  selectedCharacter,
  selectedType,
  isRecording,
  onRecordingChange,
  onVoiceInput,
  currentQuestion,
  totalQuestions,
  onAnalysis,
  onFaceMetricsUpdate,
}: ChatCanvasProps) {
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  // Initialize audio element on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audio.addEventListener("ended", () => {
        setPlayingAudio(null);
      });
      setAudioElement(audio);

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, []);

  // Auto-play new interviewer messages
  useEffect(() => {
    if (!audioElement) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === "interviewer" && lastMessage.audioFile) {
      handlePlayAudio(lastMessage.id);
    }
  }, [messages, audioElement]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsTranscribing(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          onVoiceInput(transcript);
          setTranscript("");
          setIsTranscribing(false);
        }
      };

      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
        onRecordingChange(false);
      };

      recognitionRef.current.onerror = () => {
        setIsTranscribing(false);
        onRecordingChange(false);
      };
    }
  }, [onVoiceInput, onRecordingChange]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (audioElement) {
      audioElement.muted = isMuted;
      audioElement.volume = volume;
    }
  }, [audioElement, isMuted, volume]);

  const handleRecordToggle = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      onRecordingChange(true);
    }
  };

  const handlePlayAudio = async (messageId: string) => {
    if (!audioElement) return;

    if (playingAudio === messageId) {
      audioElement.pause();
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (playingAudio) {
        audioElement.pause();
      }

      // Find the message with the audio
      const message = messages.find((m) => m.id === messageId);
      if (!message?.audioFile) return;

      try {
        // Set the audio source directly to the URL from Murf API
        audioElement.src = message.audioFile;
        await audioElement.play();
        setPlayingAudio(messageId);
      } catch (error) {
        console.error("Error playing audio:", error);
        setPlayingAudio(null);
      }
    }
  };

  const getSessionTitle = () => {
    if (!selectedCharacter || !selectedType) return "MockInterviewAI";
    return `${selectedType.name} Interview: ${selectedCharacter.role}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-white/30 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-900/30 lg:ml-80 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Chat Header - Fixed */}
      <div className="flex-none px-3 lg:px-4 py-2 lg:py-2.5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
              {getSessionTitle()}
            </h2>
            {selectedCharacter && selectedType && (
              <div className="flex items-center gap-2 mt-0.5">
                <div className="px-2 py-0.5 bg-[#56707F]/10 rounded-full">
                  <p className="text-xs text-[#56707F] font-medium">
                    Question {currentQuestion} of {totalQuestions}
                  </p>
                </div>
                <div className="h-1 w-16 lg:w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E07A5F] transition-all duration-500 ease-out"
                    style={{
                      width: `${(currentQuestion / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedCharacter && selectedType && (
              <Button
                onClick={onAnalysis}
                variant="outline"
                size="sm"
                className="gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#E07A5F]/50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <BarChart2 className="w-3 lg:w-3.5 h-3 lg:h-3.5" />
                <span className="text-xs lg:text-sm">Analysis</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Fixed Height */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Messages - Scrollable */}
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 shadow-sm backdrop-blur-sm border transition-all duration-200 ${
                      message.type === "user"
                        ? "bg-[#FFF5F3] border-[#E07A5F]/20 ml-auto hover:shadow-md"
                        : "bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:shadow-md"
                    }`}
                  >
                    {message.type === "interviewer" && message.character && (
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={
                            message.character.avatarAnimated ||
                            message.character.avatar ||
                            "/placeholder.svg"
                          }
                          alt={message.character.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-[#E07A5F] bg-white shadow-sm"
                          style={{ background: "#fff" }}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-[#56707F]">
                            {message.character.name}
                          </span>
                          {message.mood && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-lg">{message.mood.emoji}</span>
                              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full transition-all duration-500 ease-out"
                                  style={{
                                    width: `${message.mood.value}%`,
                                    backgroundColor: message.mood.value >= 70 
                                      ? "#22c55e" 
                                      : message.mood.value >= 40 
                                      ? "#eab308" 
                                      : "#ef4444"
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[50px]">
                                {message.mood.label}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <p
                      className={`text-sm leading-relaxed text-gray-900 dark:text-white ${
                        message.type === "user" ? "text-right" : ""
                      }`}
                    >
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.hasAudio && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlayAudio(message.id)}
                          className="h-6 w-6 p-0 hover:bg-[#56707F]/10 rounded-full transition-all duration-200"
                        >
                          {playingAudio === message.id ? (
                            <Square className="w-3 h-3 text-[#56707F]" />
                          ) : (
                            <Play className="w-3 h-3 text-[#56707F]" />
                          )}
                        </Button>
                      )}
                    </div>
                    {playingAudio === message.id && (
                      <div className="mt-2">
                        <VoiceWaveform isPlaying={true} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Voice Input - Fixed */}
          {transcript && (
            <div className="flex-none px-4 py-2 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="max-w-2xl mx-auto">
                <div className="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 rounded-lg p-2.5 shadow-sm">
                  {transcript}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Capture and Controls - Fixed */}
        <div className="w-full lg:w-80 border-l border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex flex-col">
          {/* Video Capture */}
          <div className="flex-none p-2 lg:p-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <VideoCapture
              onMetricsUpdate={onFaceMetricsUpdate}
              className="w-full rounded-xl overflow-hidden shadow-lg"
            />
          </div>

          {/* Control Bar */}
          <div className="flex-none p-2 lg:p-3 flex flex-col justify-end">
            <div className="flex items-center justify-center gap-2 lg:gap-3">
              <Button
                onClick={handleRecordToggle}
                disabled={!selectedCharacter || !selectedType}
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full transition-all duration-300 ${
                  isRecording
                    ? "bg-[#E07A5F] hover:bg-[#E07A5F]/90 scale-110 shadow-lg shadow-[#E07A5F]/25"
                    : "bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#E07A5F]/50 shadow-md hover:shadow-lg"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                ) : (
                  <Mic
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      isRecording ? "text-white" : "text-[#56707F]"
                    }`}
                  />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen((v) => !v)}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-1 mt-2">
              {!selectedCharacter || !selectedType ? (
                <p className="text-center text-xs text-gray-500">
                  Select a character and interview type to start recording
                </p>
              ) : (
                <>
                  <p className="text-center text-xs text-gray-500">
                    {isRecording ? "Click to stop" : "Click to start recording"}
                  </p>
                  {(isRecording || isTranscribing) && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      {isRecording && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-pulse" />
                          Recording...
                        </div>
                      )}
                      {isTranscribing && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#56707F] animate-pulse" />
                          Transcribing...
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {settingsOpen && (
        <div className="absolute bottom-16 right-6 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-64 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              Audio Settings
            </span>
            <button
              onClick={() => setSettingsOpen(false)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-green-500" />
              )}
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              {isMuted ? "Muted" : "Unmuted"}
            </span>
          </div>
          <div>
            <label
              htmlFor="volume-slider"
              className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1.5"
            >
              Volume
            </label>
            <input
              id="volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-[#E07A5F]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
