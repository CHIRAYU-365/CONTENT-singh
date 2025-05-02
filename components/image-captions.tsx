"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"

const ImageCaptions = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      // Reset captions when new image is selected
      setGeneratedCaptions([])
    }
  }

  const handleGenerateCaptions = async () => {
    if (!selectedImage) return

    setIsGenerating(true)

    try {
      // In a real implementation, this would upload the image to your Flask backend
      // and call the appropriate AI service
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        const demoResponses = {
          instagram: [
            "Embracing the journey one step at a time ✨ #LifeGoals",
            "Finding beauty in everyday moments 🌿 #MindfulLiving",
            "When the colors align just right ❤️ #PerfectDay",
            "This view never gets old 😍 #NatureLovers",
          ],
          twitter: [
            "Some views are worth sharing. What do you think?",
            "Nature's palette never disappoints!",
            "Taking a moment to appreciate this scene.",
            "The best things in life are the people we love, the places we've been, and the memories we've made along the way.",
          ],
          facebook: [
            "Had an amazing time experiencing this beautiful view today! So grateful for these moments.",
            "Sometimes you just need to stop and take in the view. Feeling blessed!",
            "Nature has a way of making everything better. Sharing this special moment with you all.",
            "Weekend vibes! Nothing beats a day spent in nature's embrace.",
          ],
        }

        setGeneratedCaptions(demoResponses[selectedPlatform as keyof typeof demoResponses])
        setIsGenerating(false)
      }, 2000)
    } catch (error) {
      console.error("Error generating captions:", error)
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Image Captions</h2>

        <div className="mb-6">
          <p className="mb-2">Upload an image to generate captions</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-64 max-w-full mb-4 rounded-lg"
                />
              ) : (
                <div className="mb-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}

              {imagePreview && <p className="text-sm text-purple-600">Click to change image</p>}
            </label>
          </div>
        </div>

        {imagePreview && (
          <>
            <div className="mb-6">
              <p className="mb-2">Select platform</p>
              <div className="grid grid-cols-3 gap-2">
                {["Instagram", "Twitter", "Facebook"].map((platform) => (
                  <Button
                    key={platform}
                    variant={selectedPlatform === platform.toLowerCase() ? "default" : "outline"}
                    className={selectedPlatform === platform.toLowerCase() ? "bg-purple-600" : ""}
                    onClick={() => setSelectedPlatform(platform.toLowerCase())}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
              onClick={handleGenerateCaptions}
              disabled={isGenerating || !selectedImage}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Captions"
              )}
            </Button>
          </>
        )}

        {generatedCaptions.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Generated Captions:</h3>
            <div className="space-y-2">
              {generatedCaptions.map((caption, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(caption)
                    alert("Caption copied to clipboard!")
                  }}
                >
                  {caption}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ImageCaptions
