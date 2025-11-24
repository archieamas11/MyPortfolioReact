import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContactForm from './Forms'
import { personalDetails } from '../about/constants'

export function ContactSection() {
  return (
    <section id="contact" className="section-wrapper">
      <div className="grid w-full grid-cols-1 justify-between gap-20 lg:grid-cols-2 lg:gap-0">
        {/* Left content*/}
        <div className="p-0 lg:p-25">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">Get In Touch</h2>
          <p className="text-muted-foreground font-base max-w-md text-justify text-lg md:text-xl">
            I'm always interested in new opportunities. Whether you want to collaborate, discuss a project, or just say hello, I'd love to hear from
            you!
          </p>
          <div className="mt-10 flex flex-col gap-2">
            {personalDetails
              .filter((detail) => ['Facebook', 'Phone', 'Email'].includes(detail.label))
              .map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-2 space-y-2 text-sm transition-colors"
                >
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-center transition-colors">
                    <detail.icon size={15} />
                  </div>
                  <div>
                    <p className="font-medium">{detail.label}</p>
                    <p className="text-muted-foreground text-sm">{detail.value}</p>
                  </div>
                </a>
              ))}
          </div>

          <div className="mt-5 space-y-4">
            <div className="text-foreground text-xl font-bold tracking-tight">Follow Me</div>
            <div className="flex gap-2">
              {personalDetails
                .filter((detail) => ['Telegram', 'Discord', 'Github', 'Instagram'].includes(detail.label))
                .map((detail) => (
                  <a
                    key={detail.label}
                    href={detail.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-2 space-y-2 text-sm transition-colors"
                  >
                    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-center transition-colors">
                      <detail.icon size={15} />
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Right content */}
        <div>
          <Card className="glass-effect bg-black/[0.025]">
            <CardHeader>
              <CardTitle className="text-primary text-xl md:text-2xl">Drop Me a Line</CardTitle>
              <CardTitle className="text-muted-foreground font-base text-sm">I'd love to hear from you</CardTitle>
            </CardHeader>
            <CardContent className="mt-5 w-full">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
