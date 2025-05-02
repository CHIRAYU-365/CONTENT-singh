"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface TTSPlayerProps {
  text: string
}

const TTSPlayer = ({ text }: TTSPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayPause = () => {
    if (!audioRef.current) {
      // In a real implementation, this would call your Flask backend to generate TTS
      // For demo purposes, we'll use the browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.volume = volume / 100
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
      setIsPlaying(true)
    } else {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }

    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      <Slider
        className="w-24"
        value={[volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        aria-label="Volume"
      />
    </div>
  )
}

export default TTSPlayer
