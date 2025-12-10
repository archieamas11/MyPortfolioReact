import { Badge } from '@/components/ui/badge'
import { EducationData } from './constants'
import { motion } from 'framer-motion'

export default function EducationPage() {
  return (
    <section id="education" className="w-full px-4 py-16">
      <div className="relative mx-auto">
        {/* Desktop Horizontal Line */}
        <div className="bg-border absolute top-2 left-0 hidden h-0.5 w-full -translate-y-1/2 md:block" />

        {/* Mobile Vertical Line */}
        <div className="bg-border absolute top-0 left-2 h-full w-0.5 -translate-x-1/2 md:hidden" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-10">
          {EducationData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col gap-4 pl-8 md:pl-0"
            >
              {/* Dot Marker */}
              <div className="bg-background ring-accent absolute top-0 left-0 z-10 flex h-4 w-4 items-center justify-center rounded-full ring-2 md:top-0 md:left-0">
                <div className="bg-accent h-2 w-2 rounded-full" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 pt-1 md:pt-8">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-fit gap-2 px-3 py-1 text-sm font-medium">
                    <span className="text-muted-foreground">0{index + 1}</span>
                    <span>{item.level}</span>
                  </Badge>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                      <img src={item.logo} alt={item.level} className="h-full w-full object-cover" />
                    </div>
                    <div className="text-muted-foreground min-w-0 flex-1 space-y-1 text-sm">
                      <div className="text-foreground leading-tight font-medium">{item.school}</div>
                      <div className="text-muted-foreground text-xs leading-relaxed">{item.degree}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
