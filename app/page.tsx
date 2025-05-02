"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import ContentGenerator from "@/components/content-generator"
import ImageCaptions from "@/components/image-captions"
import VoiceInput from "@/components/voice-input"
import AccessibilityPanel from "@/components/accessibility-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SeoGenerator from "@/components/seo-generator"

export default function Home() {
  const [activeTab, setActiveTab] = useState("text-generation")

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-800">Welcome to Content Singh</h1>
            <p className="text-gray-600 mt-2">
              Your AI content copilot with multilingual support and accessibility features.
            </p>
            <p className="text-gray-600">Generate content, captions for images, and more.</p>
          </div>

          <Tabs defaultValue="text-generation" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="text-generation">Text Generation</TabsTrigger>
              <TabsTrigger value="image-captions">Image Captions</TabsTrigger>
              <TabsTrigger value="voice-input">Voice Input</TabsTrigger>
              <TabsTrigger value="seo-generator">SEO & Keywords</TabsTrigger>
            </TabsList>
            <TabsContent value="text-generation">
              <ContentGenerator />
            </TabsContent>
            <TabsContent value="image-captions">
              <ImageCaptions />
            </TabsContent>
            <TabsContent value="voice-input">
              <VoiceInput />
            </TabsContent>
            <TabsContent value="seo-generator">
              <SeoGenerator />
            </TabsContent>
          </Tabs>

          <div className="text-center mt-12 text-gray-600">
            <p>Content Singh helps you create accessible content in multiple Indian languages.</p>
            <p>This is a demo version created by Team ACE for Tech Sprint</p>
          </div>
        </div>
      </main>
      <AccessibilityPanel />
    </div>
  )
}
