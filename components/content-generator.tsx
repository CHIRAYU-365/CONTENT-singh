"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateContent } from "@/lib/api"

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter (X)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "blog", label: "Blog" },
]

const contentTypes = [
  { value: "post", label: "Post" },
  { value: "reel", label: "Reel/Short" },
  { value: "story", label: "Story" },
  { value: "video", label: "Video Script" },
  { value: "carousel", label: "Carousel" },
]

const ContentGenerator = () => {
  const [prompt, setPrompt] = useState("")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState(50)
  const [platform, setPlatform] = useState("instagram")
  const [contentType, setContentType] = useState("post")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [language, setLanguage] = useState("en")

  const handleGenerate = async () => {
    if (!prompt) return

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      // In a real implementation, this would call your Flask backend
      const content = await generateContent({
        prompt,
        tone,
        length,
        language,
        platform,
        contentType,
      })

      setGeneratedContent(content)
      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating content:", error)
      setIsGenerating(false)
      setGeneratedContent("An error occurred while generating content. Please try again.")
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Content Generator</h2>

        <div className="mb-6">
          <p className="mb-2">What would you like to create?</p>
          <Textarea
            placeholder="Enter a prompt for content generation..."
            className="min-h-32"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((ct) => (
                  <SelectItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2">Tone</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Professional", "Casual", "Formal", "Friendly"].map((toneOption) => (
              <Button
                key={toneOption}
                variant={tone === toneOption.toLowerCase() ? "default" : "outline"}
                className={tone === toneOption.toLowerCase() ? "bg-purple-600" : ""}
                onClick={() => setTone(toneOption.toLowerCase())}
              >
                {toneOption}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <p>Length</p>
            <p className="text-gray-500">{length < 33 ? "Short" : length < 66 ? "Medium" : "Long"}</p>
          </div>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
            className="py-4"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
              <SelectItem value="te">Telugu</SelectItem>
              <SelectItem value="kn">Kannada</SelectItem>
              <SelectItem value="ml">Malayalam</SelectItem>
              <SelectItem value="mr">Marathi</SelectItem>
              <SelectItem value="gu">Gujarati</SelectItem>
              <SelectItem value="pa">Punjabi</SelectItem>
              <SelectItem value="bn">Bengali</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </Button>

        {generatedContent && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-bold mb-2">Generated Content:</h3>
            <div className="whitespace-pre-line">{generatedContent}</div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent)
                  alert("Content copied to clipboard!")
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ContentGenerator
