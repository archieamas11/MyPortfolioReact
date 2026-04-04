import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { EducationData } from "./data/education";

export default function EducationPage() {
  return (
    <section className="w-full px-4 py-16" id="education">
      <div className="relative mx-auto">
        {/* Desktop Horizontal Line */}
        <div className="absolute top-2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-border md:block" />

        {/* Mobile Vertical Line */}
        <div className="absolute top-0 left-2 h-full w-0.5 -translate-x-1/2 bg-border md:hidden" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-10">
          {EducationData.map((item, index) => (
            <motion.div
              className="relative flex flex-col gap-4 pl-8 md:pl-0"
              initial={{ opacity: 0, y: 20 }}
              key={`${item.level}-${item.school}`}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {/* Dot Marker */}
              <div className="absolute top-0 left-0 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-accent md:top-0 md:left-0">
                <div className="h-2 w-2 rounded-full bg-accent" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 pt-1 md:pt-8">
                <div className="flex items-center gap-2">
                  <Badge
                    className="w-fit gap-2 px-3 py-1 font-medium text-sm"
                    variant="outline"
                  >
                    <span className="text-muted-foreground">
                      0{EducationData.length - index}
                    </span>
                    <span>{item.level}</span>
                  </Badge>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                      <img
                        alt={item.level}
                        className="h-full w-full object-cover"
                        decoding="async"
                        height={40}
                        loading="lazy"
                        src={item.logo}
                        width={40}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-muted-foreground text-sm">
                      <div className="font-medium text-foreground leading-tight">
                        {item.school}
                      </div>
                      <div className="text-muted-foreground text-xs leading-relaxed">
                        {item.degree}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
