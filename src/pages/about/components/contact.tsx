import { personalDetails } from '../constants'

export default function Contact() {
  return (
    <div className="col-span-1 w-full lg:col-span-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:flex lg:flex-row lg:gap-4">
        {personalDetails.map((detail) => {
          const Icon = detail.icon
          return (
            <div key={detail.label} className="w-full">
              {detail.href ? (
                <a
                  href={detail.href}
                  target={detail.href.startsWith('http') ? '_blank' : undefined}
                  rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 py-3 lg:gap-4 lg:py-4"
                >
                  <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors">
                    <Icon size={12} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-foreground sr-only text-sm font-medium">{detail.label}</div>
                    <div className="text-muted-foreground text-xs sm:text-sm">{detail.value}</div>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3 rounded-md py-3 transition-colors lg:gap-4 lg:py-4">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <Icon size={12} />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground sr-only text-sm font-medium">{detail.label}</div>
                    <div className="text-muted-foreground text-xs sm:text-sm">{detail.value}</div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
