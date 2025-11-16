export default function AboutMe() {
  return (
    <div className="col-span-1 space-y-2 lg:col-span-2 lg:space-y-4">
      <h1 className="font-oswald text-3xl font-bold tracking-widest sm:text-4xl md:text-5xl lg:text-6xl">HELLO!</h1>
      <div className="mt-3 hidden h-1 w-16 rounded-full bg-[#4e67b0] lg:block" />

      <div className="text-muted-foreground space-y-4 text-justify text-sm leading-relaxed sm:text-base lg:text-lg">
        <p>
          Hi, I’m Archie Albarico ever-curious builder who fell in love with the moment an idea becomes a living, breathing web app. Right now I’m
          tack toolkit one project <i>(and countless Google searches)</i> at a time, always chasing that sweet spot where design delight meets
          rock-solid functionality.
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
