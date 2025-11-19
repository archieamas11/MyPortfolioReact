import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContactForm from './Forms'

export function ContactSection() {
  return (
    <section id="contact" className="section-wrapper">
      <div className="grid w-full grid-cols-1 justify-between gap-20 lg:grid-cols-2 lg:gap-0">
        {/* Left content*/}
        <div>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">Get In Touch</h2>
          <p className="text-muted-foreground font-base max-w-md text-lg md:text-xl">
            I'm always interested in new opportunities. Whether you want to collaborate, discuss a project, or just say hello, I'd love to hear from
            you!
          </p>
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
