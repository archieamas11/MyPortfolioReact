import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="mb-15 py-2 lg:mb-0">
      <Separator className="opacity-50" />
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-center gap-4 px-6 py-8 text-center text-sm">
        <p className="text-center sm:text-left">Built with ❤️ using HTML, CSS & JavaScript</p>
        <div className="flex items-center gap-4">
          <i>Last updated in September 2025</i>
        </div>
      </div>
    </footer>
  )
}

export default Footer
