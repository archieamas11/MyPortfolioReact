import { Separator } from '@/components/ui/separator'

// Global type for Vite injected variable
declare const __LAST_UPDATED__: string

export function Footer() {
  return (
    <footer className="mb-15 py-2 lg:mb-0">
      <Separator className="opacity-50" />
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-center px-6 py-8 text-center text-sm">
        <p className="text-center sm:text-left">Built with ❤️ React JS</p>
        <div className="flex items-center gap-4">
          <i>Last updated in {__LAST_UPDATED__}</i>
        </div>
      </div>
    </footer>
  )
}
