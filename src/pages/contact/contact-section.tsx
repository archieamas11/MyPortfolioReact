import { defaultPatterns, WebHaptics } from "web-haptics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassEdgeReflect } from "@/components/ui/glass-edge-reflect/glass-edge-reflect";
import { personalDetails } from "../about/data/personal-details";
import ContactForm from "./forms";

export function ContactSection() {
  const haptics = new WebHaptics();

  return (
    <section className="section-wrapper overflow-hidden" id="contact">
      <div className="grid w-full grid-cols-1 justify-between gap-20 lg:grid-cols-2 lg:gap-0">
        {/* Left content*/}
        <div className="p-0">
          <h2 className="mb-4 font-bold text-3xl uppercase sm:text-4xl md:text-5xl lg:text-6xl">
            Get In Touch
          </h2>
          <p className="max-w-md text-justify font-normal text-lg text-muted-foreground md:text-xl">
            I'm always interested in new opportunities. Whether you want to
            collaborate, discuss a project, or just say hello, I'd love to hear
            from you!
          </p>
          <div className="mt-10 flex flex-col gap-2">
            {personalDetails
              .filter((detail) => ["Phone", "Email"].includes(detail.label))
              .map((detail) => (
                <a
                  className="group flex items-center gap-3 text-sm transition-colors hover:text-primary"
                  href={detail.href}
                  key={detail.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="glass-effect flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary hover:bg-white/10 hover:shadow-md">
                    <detail.icon aria-hidden size={15} />
                  </div>
                  <div>
                    <p className="font-medium">{detail.label}</p>
                    <p className="text-muted-foreground text-sm">
                      {detail.value}
                    </p>
                  </div>
                </a>
              ))}
          </div>

          <div className="mt-5 space-y-4">
            <div className="font-bold text-foreground text-xl tracking-tight">
              Follow Me
            </div>
            <div className="flex gap-2">
              {personalDetails
                .filter((detail) =>
                  [
                    "Facebook",
                    "Telegram",
                    "Discord",
                    "Github",
                    "Instagram",
                  ].includes(detail.label)
                )
                .map((detail) => (
                  <a
                    aria-label={`Follow me on ${detail.label}`}
                    className="group flex items-center gap-3 text-sm transition-colors hover:text-primary"
                    href={detail.href}
                    key={detail.label}
                    onClick={() => {
                      haptics.trigger(defaultPatterns.selection);
                    }}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="glass-effect flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary hover:bg-white/10 hover:shadow-md">
                      <detail.icon aria-hidden size={15} />
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Right content */}
        <GlassEdgeReflect asChild className="h-full">
          <Card className="glass-effect bg-linear-to-t from-accent/3 to-transparent">
            <CardHeader>
              <CardTitle className="text-primary text-xl md:text-2xl">
                Drop Me a Line
              </CardTitle>
              <CardTitle className="font-normal text-muted-foreground text-sm">
                I'd love to hear from you
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-5 w-full">
              <ContactForm />
            </CardContent>
          </Card>
        </GlassEdgeReflect>
      </div>
    </section>
  );
}
