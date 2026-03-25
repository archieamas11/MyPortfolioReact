import { Separator } from '@/components/ui/separator'
declare const __LAST_UPDATED__: string

export function Footer() {
  return (
    <footer className="mb-15 py-2 lg:mb-0" aria-label="Site footer">
      <Separator className="opacity-50" />
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-center px-6 py-8 text-center text-sm">
        <div className="flex items-center gap-4">
          <small className="text-xs">Updated on {__LAST_UPDATED__}</small>
        </div>
      </div>
    </footer>
  )
}
