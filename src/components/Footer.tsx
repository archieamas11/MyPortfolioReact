import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedin } from 'react-icons/fa'

export function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear()
  return (
    <footer className={cn('mt-20', className)}>
      <Separator className="opacity-50" />
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 text-sm sm:flex-row">
        <p className="text-center sm:text-left">© {year} Archie Albarico. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-foreground transition-colors"
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            title="GitHub"
          >
            <AiFillGithub size={18} />
          </a>
          <a
            className="hover:text-foreground transition-colors"
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
