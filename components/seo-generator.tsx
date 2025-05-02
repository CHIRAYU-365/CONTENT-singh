"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Hash, Search, Key } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateSeoContent } from "@/lib/api"

const SeoGenerator = () => {
  const [content, setContent] = useState("")
  const [platform, setPlatform] = useState("instagram")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSeo, setGeneratedSeo] = useState<{
    title?: string
    description?: string
    keywords?: string[]
    hashtags?: string[]
  }>({})
  const [activeTab, setActiveTab] = useState("seo")
  const [targetKeywords, setTargetKeywords] = useState("")
  const [industry, setIndustry] = useState("")

  const handleGenerate = async () => {
    if (!content) return

    setIsGenerating(true)
    setGeneratedSeo({})

    try {
      // In a real implementation, this would call your Flask backend
      const result = await generateSeoContent({
        content,
        platform,
        targetKeywords: targetKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        industry,
        type: activeTab,
      })

      setGeneratedSeo(result)
      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating SEO content:", error)
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">SEO & Keywords Generator</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="seo">SEO Content</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          </TabsList>

          <TabsContent value="seo" className="mt-4">
            <p className="text-sm text-gray-600 mb-4">Generate SEO-optimized title and description for your content</p>
          </TabsContent>

          <TabsContent value="keywords" className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Generate relevant keywords to improve your content's searchability
            </p>
          </TabsContent>

          <TabsContent value="hashtags" className="mt-4">
            <p className="text-sm text-gray-600 mb-4">Generate trending hashtags for your social media posts</p>
          </TabsContent>
        </Tabs>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Content</label>
          <Textarea
            placeholder="Enter your content or topic..."
            className="min-h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {activeTab === "hashtags" && (
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter (X)</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Industry/Niche</label>
            <Input
              placeholder="e.g., Technology, Fashion, Food"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          {activeTab !== "hashtags" && (
            <div>
              <label className="block text-sm font-medium mb-2">Target Keywords (comma separated)</label>
              <Input
                placeholder="e.g., digital marketing, SEO, content strategy"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
              />
            </div>
          )}
        </div>

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
          onClick={handleGenerate}
          disabled={isGenerating || !content}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {activeTab === "seo" && <Search className="mr-2 h-4 w-4" />}
              {activeTab === "keywords" && <Key className="mr-2 h-4 w-4" />}
              {activeTab === "hashtags" && <Hash className="mr-2 h-4 w-4" />}
              Generate {activeTab === "seo" ? "SEO Content" : activeTab === "keywords" ? "Keywords" : "Hashtags"}
            </>
          )}
        </Button>

        {generatedSeo && Object.keys(generatedSeo).length > 0 && (
          <div className="mt-6">
            {activeTab === "seo" && generatedSeo.title && generatedSeo.description && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-1">SEO Title:</h3>
                  <div className="p-3 bg-gray-50 rounded-md">{generatedSeo.title}</div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Meta Description:</h3>
                  <div className="p-3 bg-gray-50 rounded-md">{generatedSeo.description}</div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const seoText = `Title: ${generatedSeo.title}\nDescription: ${generatedSeo.description}`
                      navigator.clipboard.writeText(seoText)
                      alert("SEO content copied to clipboard!")
                    }}
                  >
                    Copy All
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "keywords" && generatedSeo.keywords && generatedSeo.keywords.length > 0 && (
              <div>
                <h3 className="font-bold mb-2">Generated Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedSeo.keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        navigator.clipboard.writeText(keyword)
                        alert(`Keyword "${keyword}" copied to clipboard!`)
                      }}
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSeo.keywords?.join(", ") || "")
                      alert("All keywords copied to clipboard!")
                    }}
                  >
                    Copy All
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "hashtags" && generatedSeo.hashtags && generatedSeo.hashtags.length > 0 && (
              <div>
                <h3 className="font-bold mb-2">Generated Hashtags:</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedSeo.hashtags.map((hashtag, index) => (
                    <div
                      key={index}
                      className="bg-purple-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-purple-200"
                      onClick={() => {
                        navigator.clipboard.writeText(hashtag)
                        alert(`Hashtag "${hashtag}" copied to clipboard!`)
                      }}
                    >
                      #{hashtag}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSeo.hashtags?.map((h) => `#${h}`).join(" ") || "")
                      alert("All hashtags copied to clipboard!")
                    }}
                  >
                    Copy All
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SeoGenerator
