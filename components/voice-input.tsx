"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, StopCircle, Volume2, Loader2, Languages } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translateText, textToSpeech } from "@/lib/api"

// Google API key
const GOOGLE_API_KEY = "AIzaSyB5wcC9wt6qJqM7q_ZsjWKrN14uQLHW22Q"

const languages = [
  { code: "en-IN", name: "English (India)" },
  { code: "hi-IN", name: "Hindi" },
  { code: "ta-IN", name: "Tamil" },
  { code: "te-IN", name: "Telugu" },
  { code: "kn-IN", name: "Kannada" },
  { code: "ml-IN", name: "Malayalam" },
  { code: "mr-IN", name: "Marathi" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "pa-IN", name: "Punjabi" },
  { code: "bn-IN", name: "Bengali" },
]

const VoiceInput = () => {
  const [mode, setMode] = useState<"stt" | "tts">("stt")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [textInput, setTextInput] = useState("")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [sourceLanguage, setSourceLanguage] = useState("en-IN")
  const [targetLanguage, setTargetLanguage] = useState("en-IN")
  const [translatedText, setTranslatedText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setError(`Recognition error: ${event.error}`)
          setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      } else {
        setError("Your browser doesn't support speech recognition. Please try Chrome or Edge.")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Update language for speech recognition
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = sourceLanguage
    }
  }, [sourceLanguage])

  const startRecording = () => {
    setError(null)
    setTranscript("")
    setIsRecording(true)

    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  const handleTranslateAndSpeak = async () => {
    if (!textInput.trim()) return

    setIsProcessing(true)
    setIsTranslating(true)
    setError(null)

    try {
      // First translate the text if source and target languages are different
      let textToSpeak = textInput

      if (sourceLanguage !== targetLanguage) {
        // In a real implementation, this would call the Gemini API for translation
        // For now, we'll use a mock implementation
        const translated = await translateText({
          text: textInput,
          sourceLanguage: sourceLanguage.split("-")[0],
          targetLanguage: targetLanguage.split("-")[0],
        })

        textToSpeak = translated
        setTranslatedText(translated)
      }

      setIsTranslating(false)

      // Now convert the translated text to speech
      await textToSpeech({
        text: textToSpeak,
        language: targetLanguage,
      })

      // For demo purposes, use browser's speech synthesis
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = targetLanguage

      // Create a promise to know when speech is done
      const speechPromise = new Promise((resolve, reject) => {
        utterance.onend = resolve
        utterance.onerror = reject
      })

      // Speak the text
      window.speechSynthesis.speak(utterance)

      // Wait for speech to complete
      await speechPromise

      setIsProcessing(false)
    } catch (error) {
      console.error("Error in translate and speak:", error)
      setError("Failed to translate or speak the text. Please try again.")
      setIsProcessing(false)
      setIsTranslating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Voice Input</h2>

        <Tabs defaultValue="stt" onValueChange={(value) => setMode(value as "stt" | "tts")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stt">Speech to Text</TabsTrigger>
            <TabsTrigger value="tts">Text to Speech</TabsTrigger>
          </TabsList>

          <TabsContent value="stt" className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Language</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg mb-4">
              {isRecording ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 animate-pulse">
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-gray-600 mb-4">Listening...</p>
                  <Button variant="destructive" onClick={stopRecording} className="flex items-center">
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-4 cursor-pointer hover:bg-purple-700"
                    onClick={startRecording}
                  >
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-gray-600 mb-4">Click to start recording</p>
                  <Button variant="default" onClick={startRecording} className="bg-purple-600 hover:bg-purple-700">
                    Start Recording
                  </Button>
                </div>
              )}
            </div>

            {transcript && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Transcript:</h3>
                <div className="p-4 bg-gray-50 rounded-lg min-h-24">{transcript}</div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(transcript)
                      alert("Transcript copied to clipboard!")
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            )}

            {error && <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}
          </TabsContent>

          <TabsContent value="tts" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Language</label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Language</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Enter Text</label>
              <Textarea
                placeholder="Type or paste text to translate and convert to speech..."
                className="min-h-32"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </div>

            <div className="flex justify-center mt-6">
              <Button
                className="bg-purple-600 hover:bg-purple-700 flex items-center"
                onClick={handleTranslateAndSpeak}
                disabled={isProcessing || !textInput.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isTranslating ? "Translating..." : "Converting to Speech..."}
                  </>
                ) : (
                  <>
                    {sourceLanguage !== targetLanguage ? (
                      <Languages className="mr-2 h-4 w-4" />
                    ) : (
                      <Volume2 className="mr-2 h-4 w-4" />
                    )}
                    {sourceLanguage !== targetLanguage ? "Translate & Speak" : "Speak Text"}
                  </>
                )}
              </Button>
            </div>

            {translatedText && sourceLanguage !== targetLanguage && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Translated Text:</h3>
                <div className="p-4 bg-gray-50 rounded-lg">{translatedText}</div>
              </div>
            )}

            {error && <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default VoiceInput
