import { useState, useEffect, useCallback, useRef } from 'react'
import { Paintbrush } from 'lucide-react'

const PRESET_COLORS = [
  { name: 'Default Blue', value: '#4e67b0' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Cyan', value: '#06b6d4' },
]

export function AccentColorSelector() {
  const [accentColor, setAccentColor] = useState('#4e67b0')
  const [inputColor, setInputColor] = useState('#4e67b0')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load from local storage
    const savedColor = localStorage.getItem('accent-color')
    if (savedColor) {
      setAccentColor(savedColor)
      setInputColor(savedColor)
      updateAccentColor(savedColor)
    }
  }, [])

  const updateAccentColor = (color: string) => {
    const root = document.documentElement
    root.style.setProperty('--accent', color)
    localStorage.setItem('accent-color', color)
    setAccentColor(color)
  }

  const debouncedUpdate = useCallback((color: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      updateAccentColor(color)
    }, 150)
  }, [])

  return (
    <div className="bg-background/50 border-muted-foreground/20 flex items-center gap-2 rounded-full border p-2 backdrop-blur-sm">
      {PRESET_COLORS.map((color) => (
        <button
          key={color.value}
          className="border-border ring-offset-background focus:ring-ring h-6 w-6 rounded-full border transition-transform hover:scale-110 focus:ring-2 focus:outline-none"
          style={{ backgroundColor: color.value }}
          onClick={() => {
            updateAccentColor(color.value)
            setInputColor(color.value)
          }}
          title={color.name}
        />
      ))}
      <div className="bg-border mx-1 h-6 w-px" />
      <label className="relative flex h-6 w-6 cursor-pointer items-center justify-center transition-transform hover:scale-110">
        <Paintbrush className="h-4 w-4" style={{ color: accentColor }} />
        <input
          type="color"
          value={inputColor}
          onInput={(e) => {
            setInputColor(e.currentTarget.value)
            debouncedUpdate(e.currentTarget.value)
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          title="Custom Color"
        />
      </label>
    </div>
  )
}
