import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultPatterns, WebHaptics } from "web-haptics";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { name: "Default Rose", value: "#f43f5e" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Cyan", value: "#06b6d4" },
];

export function AccentColorSelector() {
  const [accentColor, setAccentColor] = useState("#f43f5e");
  const haptics = useMemo(() => new WebHaptics(), []);

  const updateAccentColor = useCallback((color: string) => {
    const root = document.documentElement;
    root.style.setProperty("--accent", color);
    localStorage.setItem("accent-color", color);
    setAccentColor(color);
    window.dispatchEvent(
      new CustomEvent("accentColorChange", { detail: { color } })
    );
  }, []);

  useEffect(() => {
    const savedColor = localStorage.getItem("accent-color");
    if (!savedColor) {
      return;
    }

    document.documentElement.style.setProperty("--accent", savedColor);
    setAccentColor(savedColor);
  }, []);

  return (
    <div className="glass-effect flex items-center gap-2 rounded-full border border-muted-foreground/20 bg-secondary/50 p-2 backdrop-blur-sm hover:bg-white/10 hover:shadow-md">
      {PRESET_COLORS.map((color) => (
        <button
          className={cn(
            "h-6 w-6 cursor-pointer rounded-full ring-offset-background/50 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
            accentColor === color.value && "ring-2 ring-ring ring-offset-2"
          )}
          key={color.value}
          onClick={() => {
            haptics.trigger(defaultPatterns.light);
            updateAccentColor(color.value);
          }}
          style={{ backgroundColor: color.value }}
          title={color.name}
          type="button"
        />
      ))}
    </div>
  );
}
