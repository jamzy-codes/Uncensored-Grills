"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    quote:
      "Man I love it a lot. You asked very good questions that weren't generic.",
    name: "Leon Abboud",
    role: "Founder, Unfungible · Guest, EP.01",
    image: "/images/leon.jpg",
  },
  {
    quote: "Thanks for having me, I enjoyed the conversation.",
    name: "Milad",
    role: "Founder & COO, Spring · Guest, EP.04",
    image: "/images/milad.jpg",
  },
  {
    quote:
      "You gotta respect how articulate this guy is, Juan knows what he's talking about. Great question from you too, Dipo. Time we started asking the right questions!",
    name: "MistaGreat",
    role: "Listener",
    image: "/images/testimonials/mistagreat.jpg",
  },
  {
    quote:
      "You guys did beautifully. Literally made a debut podcast beat 90% of the ones I've seen. Keep up the good work, I love you guys.",
    name: "Kiks",
    role: "Listener",
    image: "/images/testimonials/kiks.jpg",
  },
  {
    quote: "Those questions actually hit hard, NGL, and the responses are 🔥",
    name: "Bitrus",
    role: "Listener",
    image: "/images/testimonials/bitrus.jpg",
  },
  {
    quote:
      "Your pod with Leon was one of the best I've seen in the space. Crazy for a premiere.",
    name: "iknowgoodthings",
    role: "Listener",
    image: "/images/testimonials/iknowgoodthings.jpg",
  },
  {
    quote:
      "Sounds like the kind of value we need to see more of in this space.",
    name: "EDU Chain",
    role: "Listener",
    image: "/images/testimonials/educhain.png",
  },
  {
    quote: "This is so crazy, it felt like I was there. I felt the intensity.",
    name: "RuledOut xD",
    role: "Listener",
    image: "/images/testimonials/ruledout.jpg",
  },
  {
    quote:
      "Thank you for that first episode, it was worth the watch. Thank you for the next episode, I know it's gonna be more than the first.",
    name: "Ameh",
    role: "Listener",
    image: "/images/testimonials/ameh.jpg",
  },
  {
    quote:
      "Glad I found this when I did. Gonna spend the weekend catching up on your channel.",
    name: "Pascal Ossai",
    role: "Listener",
    image: "/images/testimonials/pascal.jpg",
  },
];

export default function Testimonials() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.15 });
  const carouselRef = useRef<HTMLDivElement>(null);
  const programmaticIndex = useRef<number | null>(null);
  const scrollSettleTimer = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;

    const interval = window.setInterval(() => {
      setActiveIndex(
        (currentIndex) => (currentIndex + 1) % testimonials.length,
      );
    }, 6000);

    return () => window.clearInterval(interval);
  }, [inView, paused]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const card = carousel?.children[activeIndex] as HTMLElement | undefined;
    if (!carousel || !card) return;

    programmaticIndex.current = activeIndex;
    carousel.scrollTo({
      left: card.offsetLeft - (carousel.children[0] as HTMLElement).offsetLeft,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const pauseTemporarily = () => {
    setPaused(true);
    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
    }
    resumeTimer.current = window.setTimeout(() => {
      setPaused(false);
      resumeTimer.current = null;
    }, 3000);
  };

  const pauseUntilInteractionEnds = () => {
    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    setPaused(true);
  };

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    if (programmaticIndex.current !== null) {
      if (scrollSettleTimer.current !== null) {
        window.clearTimeout(scrollSettleTimer.current);
      }
      scrollSettleTimer.current = window.setTimeout(() => {
        programmaticIndex.current = null;
        scrollSettleTimer.current = null;
      }, 100);
      return;
    }

    const nextIndex = Array.from(carousel.children).reduce(
      (closestIndex, card, index) => {
        const closestCard = carousel.children[closestIndex] as HTMLElement;
        const currentDistance = Math.abs(
          (card as HTMLElement).offsetLeft - carousel.scrollLeft,
        );
        const closestDistance = Math.abs(
          closestCard.offsetLeft - carousel.scrollLeft,
        );
        return currentDistance < closestDistance ? index : closestIndex;
      },
      0,
    );
    setActiveIndex(nextIndex);
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-12 lg:py-24 bg-ink-soft overflow-hidden"
      aria-label="Testimonials"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="section-kicker mb-6">What they are saying</div>
            <div className="gold-rule mb-6" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)]">
              Real Words.
              <br />
              <span className="text-gold">Real Reactions.</span>
            </h2>
          </div>
          <p className="font-sans text-cream-dim text-[0.88rem] leading-[1.9] max-w-xs font-light lg:text-right">
            From guests who took the seat to listeners who stayed tuned in, here is what they had to say.
          </p>
        </div>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={pauseUntilInteractionEnds}
          onPointerUp={pauseTemporarily}
          onPointerCancel={pauseTemporarily}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setPaused(false);
          }}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-gold-line"
          tabIndex={0}
        >
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="min-w-full snap-center bg-gold-line flex"
            >
              <div className="bg-ink p-4 md:p-10 flex h-full w-full flex-col justify-between md:min-h-[360px]">
                <div>
                  <div className="font-display text-[3rem] md:text-[4rem] leading-none text-gold/40">
                    “
                  </div>
                  <blockquote className="font-display text-base md:text-[clamp(1.8rem,3.5vw,3.3rem)] leading-[1.18] md:leading-[1.15] tracking-wide text-cream max-w-3xl">
                    {testimonial.quote}
                  </blockquote>
                </div>
                <div className="mt-6 md:mt-10 flex items-center gap-3">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt=""
                      fill
                      className="object-cover object-top grayscale-[15%]"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-gold">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-[0.72rem] md:text-[0.8rem] text-cream-ghost mt-1 md:mt-2">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2" aria-label="Choose testimonial">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                aria-label={`Show testimonial from ${testimonial.name}`}
                aria-pressed={activeIndex === index}
                onClick={() => {
                  pauseTemporarily();
                  setActiveIndex(index);
                }}
                className={`h-1 transition-all duration-300 ${activeIndex === index ? "w-10 bg-gold" : "w-5 bg-gold-line hover:bg-gold/60"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => {
                pauseTemporarily();
                setActiveIndex(
                  (currentIndex) =>
                    (currentIndex - 1 + testimonials.length) %
                    testimonials.length,
                );
              }}
              className="btn-outline px-3 py-2"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => {
                pauseTemporarily();
                setActiveIndex(
                  (currentIndex) => (currentIndex + 1) % testimonials.length,
                );
              }}
              className="btn-outline px-3 py-2"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
