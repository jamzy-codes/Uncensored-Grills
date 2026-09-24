"use client";

import Image from "next/image";
import { useInView } from "react-intersection-observer";

export default function About() {
  const { ref: leftRef, inView: leftIn } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });
  const { ref: rightRef, inView: rightIn } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const topics = [
    "Narrative Design",
    "Founder Psychology",
    "Belief Systems",
    "Web3 Culture",
    "Brand Strategy",
    "DeFi",
    "DAOs",
    "AI",
    "NFTs",
  ];

  return (
    <section
      id="about"
      className="relative py-12 lg:py-24 bg-ink-soft overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: show text */}
          <div
            ref={leftRef}
            className={`reveal-left ${leftIn ? "visible" : ""}`}
          >
            <div className="section-kicker mb-6">About the Show</div>
            <div className="gold-rule mb-8" />

            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.8rem)] mb-8">
              Not a podcast.
              <br />
              <span className="text-gold">A mirror.</span>
            </h2>

            <div className="space-y-5 text-cream-dim leading-[1.9] text-[0.95rem] font-light">
              <p>
                Uncensored Grills is a human intelligence show for the builders
                shaping what's next, in Web3, AI, and beyond. We sit them down
                and strip away the performance: the pitch decks, the talking
                points, the brand voice. What's left is the human.
              </p>
              <p>
                No teleprompters. No pre-screened questions. Just the
                conversation you'd have if you cornered someone at a conference
                after the cameras turned off, on the decisions, the failures,
                the controversies, and the truth behind the work.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-10">
              {topics.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[0.54rem] tracking-[0.14em] uppercase px-3 py-[6px] border border-gold-line text-gold/70 bg-gold-dim hover:bg-gold hover:text-ink hover:border-gold transition-all duration-200 cursor-default"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Dipo card */}
          <div
            ref={rightRef}
            className={`reveal-right ${rightIn ? "visible" : ""}`}
          >
            {/* Dipo photo: large, editorial */}
            <div className="relative w-full aspect-[3/4] overflow-hidden mb-0 bracket-corners">
              <Image
                src="/images/dipo.jpg"
                alt="Dipo, Host of Uncensored Grills"
                fill
                className="object-cover object-top grayscale-[15%]"
              />
              {/* Gold overlay gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              {/* Caption over image */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="font-display text-[2rem] tracking-wide text-white">
                  Dipo
                </div>
                <div className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-gold mt-1">
                  Founder &amp; Host · Uncensored Grills
                </div>
              </div>
            </div>

            {/* Dipo bio card below image */}
            <div className="mt-0 border border-gold-line border-t-0 px-7 py-6 bg-ink-mid relative">
              <div className="scanline" />
              <p className="text-cream-dim text-[0.88rem] leading-[1.9] font-light">
                Dipo is a Web3 growth strategist, brand architect, and podcast
                host helping founders build brands people remember. He combines
                strategy, storytelling, and content systems to turn ideas into{" "}
                <span className="text-cream">
                  attention, trust, and community.
                </span>
              </p>
              <div className="mt-5 pt-5 border-t border-gold-line flex items-center justify-between">
                <div className="font-mono text-[0.54rem] tracking-[0.18em] uppercase text-gold/60">
                  Web3 Growth Strategist
                </div>
                <a
                  href="https://x.com/0xDipo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.56rem] tracking-[0.14em] text-cream-ghost hover:text-gold transition-colors duration-200"
                >
                  @0xDipo ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
