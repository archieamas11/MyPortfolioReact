import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <motion.div
      className="col-span-1 space-y-2 lg:col-span-2 lg:space-y-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <motion.h2
        className="font-bold font-oswald text-3xl tracking-widest sm:text-4xl md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, x: -20 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        HELLO!
        <span
          aria-label="waving hand"
          className="wave-emoji inline-block origin-[70%_70%]"
          role="img"
        >
          👋
        </span>
      </motion.h2>
      <motion.div
        className="mt-3 hidden h-1 w-25 rounded-full bg-accent lg:block"
        initial={{ width: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        whileInView={{ width: 100 }}
      />

      <motion.div
        className="space-y-4 text-justify text-muted-foreground text-sm leading-relaxed sm:text-base lg:text-lg"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1 }}
      >
        <p>
          I'm Archie Albarico from Philippines{" "}
          <span className="fi fi-ph inline-flex items-center justify-center align-middle text-sm" />{" "}
          — a developer obsessed with turning ideas into fast, clean, reliable
          web apps. I learn by diving in, breaking things, fixing them, and
          pushing until everything feels clean, smooth, solid, and still built
          the "right" way. If it can be faster, more responsive, look better or
          smarter, I don't stop until it is.
        </p>
      </motion.div>
      <motion.div
        className="mt-8 space-y-5 lg:mt-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-bold font-oswald text-3xl tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">
          EDUCATION
        </h2>
        <div className="space-y-1">
          <p className="font-bold text-muted-foreground text-sm leading-relaxed sm:text-base">
            2022 - Present: St. Cecilia's College - Cebu, Inc.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Bachelor of Science in Information Technology (In Progress)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
