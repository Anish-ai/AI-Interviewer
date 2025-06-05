"use client"

import { useEffect, useState } from "react"

interface VoiceWaveformProps {
  isPlaying: boolean
}

export function VoiceWaveform({ isPlaying }: VoiceWaveformProps) {
  const [bars, setBars] = useState<number[]>(Array(8).fill(0))

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(8).fill(0))
      return
    }

    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => Math.random() * 100))
    }, 150)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="flex items-center gap-1 h-6">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-[#E07A5F] rounded-full transition-all duration-150 ease-out"
          style={{
            height: isPlaying ? `${Math.max(height, 20)}%` : "20%",
            opacity: isPlaying ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
