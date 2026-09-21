"use client";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-screen min-h-dvh flex items-center overflow-hidden bg-ink"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 h-full w-full bg-[image:url('/images/hero-bg-mobile.png')] md:bg-[image:url('/images/hero-bg.png')] bg-cover bg-[position:70%_bottom] md:bg-bottom bg-no-repeat"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink/25 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(201,168,76,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 lg:px-14 pt-16 pb-10">
        <div className="max-w-3xl">
          <div
            className="section-kicker mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            Human Intelligence Inside Web3
          </div>
          <h1
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
          >
            <span className="display-heading block text-[clamp(3.5rem,8vw,7.5rem)]">
              Uncensored
            </span>
            <span
              className="display-heading block text-[clamp(3.5rem,8vw,7.5rem)]"
              style={{ color: "transparent", WebkitTextStroke: "2px #C9A84C" }}
            >
              Grills.
            </span>
          </h1>
          <p
            className="mt-8 text-[1.05rem] leading-relaxed text-cream-dim max-w-xl font-light opacity-0 animate-fade-up"
            style={{ animationDelay: "0.75s", animationFillMode: "forwards" }}
          >
            The place where the people shaping Web3 and internet culture come to
            talk, discover, debate, and connect.
          </p>
          <div
            className="flex flex-wrap gap-4 mt-10 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
          >
            <a
              href="#episodes"
              className="btn-gold inline-flex items-center gap-3"
            >
              <span className="pr-3 border-r border-ink/40 leading-none">
                ▶
              </span>
              <span>Watch Episodes</span>
            </a>
            <a href="#guest-form" className="btn-outline">
              Apply as Guest →
            </a>
          </div>
        </div>

        <div
          className="hidden lg:flex absolute right-14 bottom-14 flex-col gap-6 text-right opacity-0 animate-fade-up"
          style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}
        >
          {[
            { n: "4", l: "Episodes" },
            { n: "4", l: "Guests Grilled" },
            { n: "1", l: "Show. Real Talk." },
          ].map((s) => (
            <div key={s.l}>
              <span className="font-display text-[2.6rem] text-gold leading-none block">
                {s.n}
              </span>
              <span className="font-mono text-[0.52rem] tracking-[0.2em] uppercase text-cream-ghost">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
