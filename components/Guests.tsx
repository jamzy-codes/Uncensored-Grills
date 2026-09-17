'use client'

import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

const guests = [
  {
    name: 'Leon Abboud',
    role: 'Founder of Unfungible',
    detail: 'Brand Strategist & Content Monetization Operator',
    image: '/images/leon.jpg',
    xHandle: '@leonabboud',
    xUrl: 'https://x.com/leonabboud',
    episode: 'EP. 01',
    ytUrl: 'https://youtu.be/cGG9cEScE_0?si=2lpWQ7AkdvpmODTy',
    epTitle: 'Leon Drops Bombs: Power, Culture, Web3',
  },
  {
    name: 'Juan',
    role: 'Founder & CEO of W3BFlow',
    detail: 'Web3 Content Strategist & Marketer',
    image: '/images/juan.jpg',
    xHandle: '@0xfJuan',
    xUrl: 'https://x.com/0xfJuan',
    episode: 'EP. 02',
    ytUrl: 'https://youtu.be/Y7fCVUOfmGI?si=sttd8tQz9HNXez4d',
    epTitle: 'Web3Flow Founder Juan on Crypto, Startups & Culture',
  },
  {
    name: 'Kelano',
    role: 'Web3 Content Creator & Builder',
    detail: 'NFT Expert & Ecosystem Voice',
    // TODO: Replace Kelano's image when the new asset and filename are provided.
    image: '/images/kelano.jpg',
    xHandle: '@kelanoo',
    xUrl: 'https://x.com/kelanoo',
    episode: 'EP. 03',
    ytUrl: 'https://youtu.be/Rgb7858_FI0?si=PB7ZsgFLpHrsRCGC',
    epTitle: 'Kelano EXPOSES the Truth About NFTs, Branding & Hiring',
  },
  {
    name: 'Milad',
    role: 'Founder & COO of Spring',
    detail: 'Web3 Operator & Deal Flow Insider: token launches & ecosystem infra',
    image: '/images/milad.jpg',
    xHandle: '@web3natural',
    xUrl: 'https://x.com/web3natural',
    episode: 'EP. 04',
    ytUrl: 'https://youtu.be/zHoQD2dSbKc?si=H2Wv4ObuQkuiIJ4K',
    epTitle: 'The Crypto Market Is Rigged | Low Float, High FDV',
  },
]

export default function Guests() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="guests" className="relative py-28 lg:py-36 bg-ink overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_0%_50%,rgba(201,168,76,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="section-kicker mb-6">Past Guests</div>
            <div className="gold-rule mb-6" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)]">
              Who's been<br />
              <span className="text-gold">on the grill.</span>
            </h2>
          </div>
          <p className="font-sans text-cream-dim text-[0.88rem] leading-[1.9] max-w-xs font-light lg:text-right">
            Founders, builders, operators, and thinkers. The only entry requirement is
            you have to be building something real.
          </p>
        </div>

        {/* Guest grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gold-line"
        >
          {guests.map((g, i) => (
            <GuestCard key={g.name} guest={g} inView={inView} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GuestCard({
  guest,
  inView,
  delay,
}: {
  guest: (typeof guests)[0]
  inView: boolean
  delay: number
}) {
  return (
    <div
      className={`group bg-ink hover:bg-ink-mid transition-all duration-300 reveal-up ${inView ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={guest.image}
          alt={guest.name}
          fill
          className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
        />
        {/* Gold top bar on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        {/* Episode badge */}
        <div className="absolute top-4 left-4">
          <span className="font-mono text-[0.52rem] tracking-[0.16em] uppercase bg-ink/80 text-gold px-2.5 py-1 backdrop-blur-sm">
            {guest.episode}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 border-t border-gold-line">
        <h3 className="font-display text-[1.4rem] tracking-wide text-white mb-1">
          {guest.name}
        </h3>
        <p className="font-mono text-[0.56rem] tracking-[0.14em] uppercase text-gold/70 mb-2">
          {guest.role}
        </p>
        <p className="font-sans text-cream-ghost text-[0.8rem] leading-[1.7] font-light mb-5">
          {guest.detail}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <a
            href={guest.ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.56rem] tracking-[0.12em] uppercase text-gold border border-gold-line px-3 py-2 hover:bg-gold hover:text-ink transition-all duration-200 flex items-center gap-2"
          >
            ▶ Watch
          </a>
          <a
            href={guest.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.56rem] tracking-[0.12em] uppercase text-cream-ghost hover:text-gold transition-colors duration-200"
          >
            {guest.xHandle} ↗
          </a>
        </div>
      </div>
    </div>
  )
}
