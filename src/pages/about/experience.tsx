import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { experienceData } from "./data/experience";
export default function ExperiencePage() {
  return (
    <section className="container max-w-4xl py-10" id="experience">
      <div className="relative space-y-12 border-muted-foreground/20 border-l-2 pl-8">
        {experienceData.map((item, index) => (
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            key={`${item.date}-${item.role}-${item.company}`}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="absolute -left-10 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-accent">
              <div className="h-2 w-2 rounded-full bg-accent" />
            </div>

            <Badge className="mb-1">{item.date}</Badge>
            <h2 className="font-bold text-2xl leading-tight">{item.role}</h2>
            <h3 className="mt-1 font-medium text-lg text-muted-foreground">
              {item.company}
            </h3>
            <div className="mt-3 text-base leading-relaxed">{item.points}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
