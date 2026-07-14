import { STATS, aboutImg } from "@/lib/content";
import { CountUp } from "../CountUp";

export function About() {
  return (
    <section id="about" className="bg-surface py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aboutImg.src}
            alt="Young Sparks band members with their instruments"
            loading="lazy"
            decoding="async"
            width={aboutImg.width}
            height={aboutImg.height}
            className="w-full rounded-lg object-cover"
            style={{ aspectRatio: "7/8" }}
          />
          <div
            className="pointer-events-none absolute -bottom-5 -right-5 -z-10 rounded-lg border border-border-strong"
            style={{ width: "70%", height: "70%" }}
          />
        </div>

        <div>
          <p className="eyebrow mb-4 text-primary">About the band</p>
          <h2 className="mb-8 text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[0.9] text-foreground">
            Old roots,
            <br />
            <span className="text-primary">new fire.</span>
          </h2>

          <div className="prose-body space-y-5 text-muted-foreground">
            <p>
              Young Sparks is a young bluegrass band formed in 2024, and since then
              we&rsquo;ve built a prominent place for ourselves on the Czech bluegrass
              scene, performing at a number of great events across the country and
              abroad.
            </p>
            <p>
              Our music is rooted in traditional bluegrass, but brings to it an energy,
              dynamics and modern drive inspired by the contemporary American scene.
              That&rsquo;s exactly the approach we want to champion here &mdash; with
              respect for tradition, but with a desire to push it forward and show that
              bluegrass can reach a brand new generation of listeners.
            </p>
          </div>

          <dl className="mt-10 flex gap-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-5xl font-bold leading-none text-primary">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="eyebrow mt-2 text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
