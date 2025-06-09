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
  sidebarCollapsed: boolean;
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
  sidebarCollapsed,
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
    <div className="flex-1 flex flex-col bg-gradient-to-br from-white/30 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-900/30 ml-16 md:ml-80">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getSessionTitle()}
            </h2>
            {selectedCharacter && selectedType && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestion} of {totalQuestions}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedCharacter && selectedType && (
              <>
                <div className="w-8 h-8 bg-[#56707F] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {currentQuestion}
                  </span>
                </div>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E07A5F] transition-all duration-300"
                    style={{
                      width: `${(currentQuestion / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAnalysis}
                  className="ml-4 gap-2"
                >
                  <BarChart2 className="w-4 h-4" />
                  Analysis
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-sm backdrop-blur-sm border ${
                      message.type === "user"
                        ? "bg-[#FFF5F3] border-[#E07A5F]/20 ml-auto"
                        : "bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50"
                    }`}
                  >
                    {message.type === "interviewer" && message.character && (
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={
                            message.character.avatarAnimated ||
                            message.character.avatar ||
                            "/placeholder.svg"
                          }
                          alt={message.character.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-[#E07A5F] bg-white"
                          style={{ background: "#fff" }}
                        />
                        <span className="font-medium text-[#56707F]">
                          {message.character.name}
                        </span>
                        {message.mood && (
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-lg">{message.mood.emoji}</span>
                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-300"
                                style={{
                                  width: `${message.mood.value}%`,
                                  backgroundColor: message.mood.value >= 70 
                                    ? "#22c55e" // green
                                    : message.mood.value >= 40 
                                    ? "#eab308" // yellow
                                    : "#ef4444" // red
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {message.mood.label}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <p
                      className={`leading-relaxed ${
                        message.type === "user"
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.hasAudio && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlayAudio(message.id)}
                          className="h-6 w-6 p-0 hover:bg-[#56707F]/10"
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

          {/* Video Capture */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <VideoCapture
              onMetricsUpdate={onFaceMetricsUpdate}
              className="max-w-md mx-auto"
            />
          </div>

          {/* Voice Input */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            {(isTranscribing || transcript) && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isTranscribing ? "Transcribing..." : "Preview:"}
              </div>
            )}
            <div className="text-gray-900 dark:text-white">
              {transcript || "Listening..."}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 shadow-lg">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleRecordToggle}
            disabled={!selectedCharacter || !selectedType}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${
              isRecording
                ? "bg-[#E07A5F] hover:bg-[#E07A5F]/90 scale-110 shadow-lg shadow-[#E07A5F]/25"
                : "bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#E07A5F]/50 shadow-md hover:shadow-lg"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic
                className={`w-6 h-6 ${
                  isRecording ? "text-white" : "text-[#56707F]"
                }`}
              />
            )}
          </Button>

          {/* Analysis Button */}
          {selectedCharacter && selectedType && (
            <Button
              onClick={onAnalysis}
              variant="outline"
              className="w-16 h-16 rounded-full flex flex-col items-center justify-center gap-1 border-2 border-gray-200 dark:border-gray-700 hover:border-[#E07A5F]/50 shadow-md hover:shadow-lg"
            >
              <BarChart2 className="w-6 h-6 text-[#56707F]" />
              <span className="text-xs text-[#56707F]">Analysis</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10"
            onClick={() => setSettingsOpen((v) => !v)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {!selectedCharacter || !selectedType ? (
          <p className="text-center text-sm text-gray-500 mt-2">
            Select a character and interview type to start recording
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500 mt-2">
            {isRecording
              ? "Recording... Click to stop"
              : "Click to start recording"}
          </p>
        )}
      </div>

      {settingsOpen && (
        <div className="absolute bottom-20 right-8 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-64 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-900 dark:text-white">
              Audio Settings
            </span>
            <button
              onClick={() => setSettingsOpen(false)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-green-500" />
              )}
            </button>
            <span className="text-gray-700 dark:text-gray-200">
              {isMuted ? "Muted" : "Unmuted"}
            </span>
          </div>
          <div>
            <label
              htmlFor="volume-slider"
              className="block text-sm text-gray-700 dark:text-gray-200 mb-1"
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
