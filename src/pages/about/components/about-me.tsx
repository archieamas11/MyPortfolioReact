import { motion } from 'framer-motion'

export default function AboutMe() {
  return (
    <motion.div
      className="col-span-1 space-y-2 lg:col-span-2 lg:space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        HELLO!👋
      </motion.h1>
      <motion.div
        className="bg-accent mt-3 hidden h-1 w-25 rounded-full lg:block"
        initial={{ width: 0 }}
        whileInView={{ width: 100 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
      />

      <motion.div
        className="text-muted-foreground space-y-4 text-justify text-sm leading-relaxed sm:text-base lg:text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p>
          I'm Archie Albarico from Philippines{' '}
          <span className="fi fi-ph inline-flex items-center justify-center align-middle text-sm" /> — a
          developer obsessed with turning ideas into fast, clean, reliable web apps. I learn by diving in,
          breaking things, fixing them, and pushing until everything feels clean, smooth, solid, and still
          built the "right" way. If it can be faster, more responsive, look better or smarter, I don't stop
          until it is.
        </p>
      </motion.div>
      <motion.div
        className="mt-8 space-y-5 lg:mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h1 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">
          EDUCATION
        </h1>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm leading-relaxed font-bold sm:text-base">
            2022 - 2026: St. Cecilia's College - Cebu, Inc.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Graduated with a Bachelor of Science in Information Technology
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
