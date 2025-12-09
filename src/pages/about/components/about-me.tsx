export default function AboutMe() {
  return (
    <div className="col-span-1 space-y-2 lg:col-span-2 lg:space-y-4">
      <h1 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">HELLO!</h1>
      <div className="bg-accent mt-3 hidden h-1 w-16 rounded-full lg:block" />

      <div className="text-muted-foreground space-y-4 text-justify text-sm leading-relaxed sm:text-base lg:text-lg">
        <p>
          I’m Archie Albarico — a developer obsessed with turning ideas into fast, clean, reliable web apps. I learn by diving in, breaking things,
          fixing them, and pushing until everything feels clean, smooth, solid, and still built the “right” way. If it can be faster, more responsive,
          look better or smarter, I don’t stop until it is.
        </p>
      </div>
      <div className="mt-8 space-y-5 lg:mt-12">
        <h1 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">EDUCATION</h1>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm leading-relaxed font-bold sm:text-base">2022 - 2026: St. Cecilia's College - Cebu, Inc.</p>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">Graduated with a Bachelor of Science in Information Technology</p>
        </div>
      </div>
    </div>
  )
}
