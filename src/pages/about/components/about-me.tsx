export default function AboutMe() {
  return (
    <div className="col-span-1 space-y-2 lg:col-span-2 lg:space-y-4">
      <h1 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">HELLO!</h1>
      <div className="mt-3 hidden h-1 w-16 rounded-full bg-[#4e67b0] lg:block" />

      <div className="text-muted-foreground space-y-4 text-justify text-sm leading-relaxed sm:text-base lg:text-lg">
        <p>
          I’m Archie Albarico — a developer who loves that moment when an idea stops being theory and becomes a working web app. I learn by diving in,
          breaking things, fixing them, and pushing until everything feels clean, smooth, and solid. I stay focused on one project at a time, chasing
          that sweet spot where simple design meets reliable function. If something can be made clearer, faster, or smarter, I’m the type who won’t
          stop until it is.
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
