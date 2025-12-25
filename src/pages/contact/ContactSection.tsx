import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContactForm from './Forms'
import { personalDetails } from '../about/constants'
import { motion } from 'framer-motion'

export function ContactSection() {
  return (
    <section id="contact" className="section-wrapper overflow-hidden">
      <div className="grid w-full grid-cols-1 justify-between gap-20 lg:grid-cols-2 lg:gap-0">
        {/* Left content*/}
        <motion.div
          className="p-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">Get In Touch</h2>
          <p className="text-muted-foreground font-base max-w-md text-justify text-lg md:text-xl">
            I'm always interested in new opportunities. Whether you want to collaborate, discuss a project, or
            just say hello, I'd love to hear from you!
          </p>
          <div className="mt-10 flex flex-col gap-2">
            {personalDetails
              .filter((detail) => ['Phone', 'Email'].includes(detail.label))
              .map((detail, index) => (
                <motion.a
                  key={detail.label}
                  href={detail.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-2 space-y-2 text-sm transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-center transition-colors">
                    <detail.icon size={15} />
                  </div>
                  <div>
                    <p className="font-medium">{detail.label}</p>
                    <p className="text-muted-foreground text-sm">{detail.value}</p>
                  </div>
                </motion.a>
              ))}
          </div>

          <motion.div
            className="mt-5 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-foreground text-xl font-bold tracking-tight">Follow Me</div>
            <div className="flex gap-2">
              {personalDetails
                .filter((detail) =>
                  ['Facebook', 'Telegram', 'Discord', 'Github', 'Instagram'].includes(detail.label),
                )
                .map((detail, index) => (
                  <motion.a
                    key={detail.label}
                    href={detail.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow me on ${detail.label}`}
                    className="group flex gap-2 space-y-2 text-sm transition-colors"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-center transition-colors">
                      <detail.icon size={15} />
                    </div>
                  </motion.a>
                ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-effect from-accent/3 bg-gradient-to-t to-transparent">
            <CardHeader>
              <CardTitle className="text-primary text-xl md:text-2xl">Drop Me a Line</CardTitle>
              <CardTitle className="text-muted-foreground font-base text-sm">
                I'd love to hear from you
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-5 w-full">
              <ContactForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
