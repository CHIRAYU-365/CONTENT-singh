"use client"

import { useState } from "react"
import { Settings, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    contrast: 100,
    textSize: 100,
    textSpacing: 0,
    lineHeight: 1.5,
    highlightLinks: false,
    noImagery: false,
    dyslexiaFriendly: false,
    saturation: 100,
  })

  const updateSetting = (key: string, value: number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Apply settings to the document
    const root = document.documentElement

    if (key === "textSize") {
      root.style.setProperty("--text-size-factor", `${value / 100}`)
    }

    if (key === "contrast") {
      root.style.setProperty("--contrast-factor", `${value / 100}`)
    }

    if (key === "textSpacing") {
      root.style.setProperty("--letter-spacing", `${value}px`)
    }

    if (key === "lineHeight") {
      root.style.setProperty("--line-height", `${value}`)
    }

    if (key === "saturation") {
      root.style.setProperty("--saturation-factor", `${value / 100}`)
    }

    if (key === "dyslexiaFriendly") {
      if (value) {
        document.body.classList.add("dyslexia-friendly")
      } else {
        document.body.classList.remove("dyslexia-friendly")
      }
    }

    if (key === "highlightLinks") {
      if (value) {
        document.body.classList.add("highlight-links")
      } else {
        document.body.classList.remove("highlight-links")
      }
    }

    if (key === "noImagery") {
      if (value) {
        document.body.classList.add("no-imagery")
      } else {
        document.body.classList.remove("no-imagery")
      }
    }
  }

  return (
    <>
      <button
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-l-md"
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility settings"
      >
        <Settings className="h-6 w-6" />
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Accessibility</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close accessibility panel">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-20">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="contrast">Contrast</Label>
                <span>{settings.contrast}%</span>
              </div>
              <Slider
                id="contrast"
                min={50}
                max={200}
                step={5}
                value={[settings.contrast]}
                onValueChange={(value) => updateSetting("contrast", value[0])}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-links">Highlight Links</Label>
                <Switch
                  id="highlight-links"
                  checked={settings.highlightLinks}
                  onCheckedChange={(checked) => updateSetting("highlightLinks", checked)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="text-size">Text Size</Label>
                <span>{settings.textSize}%</span>
              </div>
              <Slider
                id="text-size"
                min={80}
                max={200}
                step={5}
                value={[settings.textSize]}
                onValueChange={(value) => updateSetting("textSize", value[0])}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="text-spacing">Text Spacing</Label>
                <span>{settings.textSpacing}px</span>
              </div>
              <Slider
                id="text-spacing"
                min={0}
                max={10}
                step={0.5}
                value={[settings.textSpacing]}
                onValueChange={(value) => updateSetting("textSpacing", value[0])}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="no-imagery">No Imagery</Label>
                <Switch
                  id="no-imagery"
                  checked={settings.noImagery}
                  onCheckedChange={(checked) => updateSetting("noImagery", checked)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexia-friendly">Dyslexia Friendly</Label>
                <Switch
                  id="dyslexia-friendly"
                  checked={settings.dyslexiaFriendly}
                  onCheckedChange={(checked) => updateSetting("dyslexiaFriendly", checked)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="line-height">Line Height</Label>
                <span>{settings.lineHeight}x</span>
              </div>
              <Slider
                id="line-height"
                min={1}
                max={3}
                step={0.1}
                value={[settings.lineHeight]}
                onValueChange={(value) => updateSetting("lineHeight", value[0])}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="saturation">Saturation</Label>
                <span>{settings.saturation}%</span>
              </div>
              <Slider
                id="saturation"
                min={0}
                max={200}
                step={5}
                value={[settings.saturation]}
                onValueChange={(value) => updateSetting("saturation", value[0])}
              />
            </div>

            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md mt-4"
              onClick={() => {
                // Reset all settings to default
                setSettings({
                  contrast: 100,
                  textSize: 100,
                  textSpacing: 0,
                  lineHeight: 1.5,
                  highlightLinks: false,
                  noImagery: false,
                  dyslexiaFriendly: false,
                  saturation: 100,
                })

                // Reset CSS variables
                const root = document.documentElement
                root.style.removeProperty("--text-size-factor")
                root.style.removeProperty("--contrast-factor")
                root.style.removeProperty("--letter-spacing")
                root.style.removeProperty("--line-height")
                root.style.removeProperty("--saturation-factor")

                // Remove classes
                document.body.classList.remove("dyslexia-friendly", "highlight-links", "no-imagery")
              }}
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccessibilityPanel
