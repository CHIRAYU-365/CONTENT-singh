"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Sidebar = () => {
  const [apiKeyExpanded, setApiKeyExpanded] = useState(false)

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold">
            CS
          </div>
          <span className="text-xl font-bold">
            <span className="text-purple-800">Content</span> <span className="text-red-500">Singh</span>
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <p className="text-sm font-medium mb-2">Language</p>
        <Select defaultValue="english">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">Hindi</SelectItem>
            <SelectItem value="punjabi">Punjabi</SelectItem>
            <SelectItem value="tamil">Tamil</SelectItem>
            <SelectItem value="telugu">Telugu</SelectItem>
            <SelectItem value="bengali">Bengali</SelectItem>
            <SelectItem value="marathi">Marathi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 border-b border-gray-200">
        <p className="text-sm font-medium mb-2">TOOLS</p>
        <nav className="space-y-1">
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Text Generation
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Image Captions
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Content Editor
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Summarizer
          </a>
        </nav>
      </div>

      <div className="p-4 border-b border-gray-200">
        <p className="text-sm font-medium mb-2">TEMPLATES</p>
        <nav className="space-y-1">
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Blog Post
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Social Media
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Email
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-purple-700">
            Product Description
          </a>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <button
          className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-purple-700"
          onClick={() => setApiKeyExpanded(!apiKeyExpanded)}
        >
          <span>API Key</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${apiKeyExpanded ? "transform rotate-180" : ""}`} />
        </button>
        {apiKeyExpanded && (
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <input type="password" placeholder="Enter API Key" className="w-full p-2 text-sm border rounded" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
