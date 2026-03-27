import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { WebHaptics, defaultPatterns } from 'web-haptics'

const PRESET_COLORS = [
  { name: 'Default Rose', value: '#f43f5e' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
]

export function AccentColorSelector() {
  const [accentColor, setAccentColor] = useState('#f43f5e')
  const haptics = useMemo(() => new WebHaptics(), [])

  const updateAccentColor = useCallback((color: string) => {
    const root = document.documentElement
    root.style.setProperty('--accent', color)
    localStorage.setItem('accent-color', color)
    setAccentColor(color)
  }, [])

  useEffect(() => {
    const savedColor = localStorage.getItem('accent-color')
    if (!savedColor) return

    document.documentElement.style.setProperty('--accent', savedColor)
    setAccentColor(savedColor)
  }, [])

  return (
    <div className="bg-secondary/50 glass-effect border-muted-foreground/20 flex items-center gap-2 rounded-full border p-2 backdrop-blur-sm hover:bg-white/10 hover:shadow-md">
      {PRESET_COLORS.map((color) => (
        <button
          key={color.value}
          className={cn(
            'ring-offset-background/50 focus:ring-ring h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110 focus:ring-2 focus:outline-none',
            accentColor === color.value && 'ring-ring ring-2 ring-offset-2',
          )}
          style={{ backgroundColor: color.value }}
          onClick={() => {
            haptics.trigger(defaultPatterns.light)
            updateAccentColor(color.value)
          }}
          title={color.name}
        />
      ))}
    </div>
  )
}
