'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const testimonials = [
  {
    quote: 'A sharp, honest conversation that gets past the usual Web3 talking points.',
    name: 'Leon Abboud',
    role: 'Brand Strategist & Content Monetization Operator',
    image: '/images/leon.jpg',
  },
  {
    quote: 'The questions are direct, thoughtful, and willing to go where the real story is.',
    name: 'Juan',
    role: 'Founder & CEO of W3BFlow',
    image: '/images/juan.jpg',
  },
  {
    quote: 'It felt less like an interview and more like a conversation with someone genuinely listening.',
    name: 'Kelano',
    role: 'Web3 Content Creator & Builder',
    image: '/images/kelano.jpg',
  },
  {
    quote: 'A rare space for the hard questions, the useful details, and the truth behind the headlines.',
    name: 'Milad',
    role: 'Founder & COO of Spring',
    image: '/images/milad.jpg',
  },
]

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % testimonials.length)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [paused])

  useEffect(() => {
    const carousel = carouselRef.current
    const card = carousel?.children[activeIndex] as HTMLElement | undefined
    if (card) {
      carousel.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
    }
  }, [activeIndex])

  const handleScroll = () => {
    const carousel = carouselRef.current
    if (!carousel) return
    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth)
    setActiveIndex(Math.min(Math.max(nextIndex, 0), testimonials.length - 1))
  }

  return (
    <section className="relative py-28 lg:py-36 bg-ink-soft overflow-hidden" aria-label="Testimonials">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="section-kicker mb-6">From the Hot Seat</div>
            <div className="gold-rule mb-6" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)]">
              No rehearsals.<br />
              <span className="text-gold">Just real talk.</span>
            </h2>
          </div>
          <p className="font-sans text-cream-dim text-[0.88rem] leading-[1.9] max-w-xs font-light lg:text-right">
            Placeholder reflections from the people who have taken the seat.
          </p>
        </div>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
          }}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-gold-line"
          tabIndex={0}
        >
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="min-w-full snap-center grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] gap-px bg-gold-line">
              <div className="bg-ink p-8 md:p-14 flex flex-col justify-between min-h-[360px]">
                <div>
                  <div className="font-display text-[4rem] leading-none text-gold/40">“</div>
                  <blockquote className="font-display text-[clamp(1.8rem,3.5vw,3.3rem)] leading-[1.15] tracking-wide text-cream max-w-3xl">
                    {testimonial.quote}
                  </blockquote>
                </div>
                <div className="mt-10">
                  <p className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-gold">{testimonial.name}</p>
                  <p className="font-sans text-[0.8rem] text-cream-ghost mt-2">{testimonial.role}</p>
                </div>
              </div>
              <div className="relative min-h-[280px] md:min-h-full bg-ink-mid overflow-hidden">
                <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover object-top grayscale-[15%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
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
                onClick={() => setActiveIndex(index)}
                className={`h-1 transition-all duration-300 ${activeIndex === index ? 'w-10 bg-gold' : 'w-5 bg-gold-line hover:bg-gold/60'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous testimonial" onClick={() => setActiveIndex((activeIndex - 1 + testimonials.length) % testimonials.length)} className="btn-outline px-3 py-2">←</button>
            <button type="button" aria-label="Next testimonial" onClick={() => setActiveIndex((activeIndex + 1) % testimonials.length)} className="btn-outline px-3 py-2">→</button>
          </div>
        </div>
      </div>
    </section>
  )
}
