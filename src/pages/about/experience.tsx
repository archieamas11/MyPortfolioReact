import { Badge } from '@/components/ui/badge'
import { experienceData } from './constants'
import { motion } from 'framer-motion'
export default function ExperiencePage() {
  return (
    <section id="experience" className="container max-w-4xl py-10">
      <div className="border-muted relative space-y-12 border-l-2 pl-8">
        {experienceData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className="bg-background ring-accent absolute top-1.5 -left-[42px] z-10 flex h-4 w-4 items-center justify-center rounded-full ring-2">
              <div className="bg-accent h-2 w-2 rounded-full" />
            </div>

            {/* Date Badge */}
            <Badge variant="secondary" className="mb-1">
              {item.date}
            </Badge>
            <h2 className="text-2xl leading-tight font-bold">{item.role}</h2>
            <h3 className="text-muted-foreground mt-1 text-lg font-medium">{item.company}</h3>
            <div className="mt-3 text-base leading-relaxed">{item.points}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
