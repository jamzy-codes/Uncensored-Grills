'use client'

import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

const YT_CHANNEL = 'https://youtube.com/@uncensoredgrill'

const episodes = [
  {
    ep: '01',
    guest: 'Leon Abboud',
    title: 'Leon Drops Bombs: Power, Culture, Web3',
    description: "He markets like Hormozi. He thinks like Naval. Now he's on the hot seat. Leon Abboud goes deep on power dynamics, content monetization, and what most Web3 brands get dangerously wrong.",
    date: 'Nov 19, 2025',
    duration: '57:41',
    ytUrl: 'https://youtu.be/cGG9cEScE_0',
    thumbnail: 'https://img.youtube.com/vi/cGG9cEScE_0/maxresdefault.jpg',
  },
  {
    ep: '02',
    guest: 'Juan',
    title: 'Web3Flow Founder Juan on Crypto, Startups & Culture',
    description: 'No scripts, no filters. Just real conversations about what it takes to build in Web3. Juan breaks down startup lessons, crypto culture, and why most content strategies are built on nothing.',
    date: 'Dec 15, 2025',
    duration: '1:08:41',
    ytUrl: 'https://youtu.be/Y7fCVUOfmGI',
    thumbnail: 'https://img.youtube.com/vi/Y7fCVUOfmGI/maxresdefault.jpg',
  },
  {
    ep: '03',
    guest: 'Kelano',
    title: 'Kelano EXPOSES the Truth About NFTs, Branding & Hiring in Web3',
    description: 'Creators, founders, marketers. This one delivers. Kelano dissects how creators build strong brands, what companies should actually look for when hiring in Web3, and where NFTs still make sense today.',
    date: 'Jan 15, 2026',
    duration: '1:11:46',
    ytUrl: 'https://youtu.be/Rgb7858_FI0',
    thumbnail: 'https://img.youtube.com/vi/Rgb7858_FI0/maxresdefault.jpg',
  },
  {
    ep: '04',
    guest: 'Milad',
    title: 'The Crypto Market Is Rigged | Low Float, High FDV & How Retail Gets Wrecked',
    description: "Most people think they're bad at crypto. Milad argues the system was designed for you to lose. Hard data from 5,600 crypto deals. An autopsy of the market, not hype or price prediction. Truth.",
    date: 'Feb 6, 2026',
    duration: '1:08:41',
    ytUrl: 'https://youtu.be/zHoQD2dSbKc',
    thumbnail: 'https://img.youtube.com/vi/zHoQD2dSbKc/maxresdefault.jpg',
  },
]

export default function Episodes() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="episodes" className="relative py-28 lg:py-36 bg-ink-soft overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_50%,rgba(201,168,76,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="section-kicker mb-6">Episodes</div>
            <div className="gold-rule mb-6" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)]">
              Watch the<br />
              <span className="text-gold">conversations.</span>
            </h2>
          </div>
          {/* All Episodes on YouTube → real channel link */}
          <a
            href={YT_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline self-start lg:self-end"
          >
            All Episodes on YouTube ↗
          </a>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gold-line">
          {episodes.map((ep, i) => (
            <EpisodeCard key={ep.ep} ep={ep} inView={inView} delay={i * 120} />
          ))}
        </div>

        <p className="mt-10 font-mono text-[0.56rem] tracking-[0.16em] uppercase text-cream-ghost text-center">
          Currently streaming on YouTube · Other platforms coming soon
        </p>
      </div>
    </section>
  )
}

function EpisodeCard({ ep, inView, delay }: { ep: typeof episodes[0]; inView: boolean; delay: number }) {
  return (
    <a
      href={ep.ytUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-ink hover:bg-ink-mid transition-all duration-300 reveal-up ${inView ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={ep.thumbnail}
          alt={ep.title}
          fill
          className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 border-2 border-white/40 rounded-full flex items-center justify-center group-hover:border-gold group-hover:scale-110 transition-all duration-300">
            <span className="text-white/60 group-hover:text-gold text-[0.9rem] ml-1 transition-colors duration-300">▶</span>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        <div className="absolute bottom-4 right-4">
          <span className="font-mono text-[0.52rem] tracking-[0.12em] bg-ink/80 text-cream-dim px-2 py-1 backdrop-blur-sm">
            {ep.duration}
          </span>
        </div>
      </div>

      <div className="p-7 border-t border-gold-line">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[0.52rem] tracking-[0.18em] uppercase text-gold/60">
            EP. {ep.ep} · {ep.guest}
          </span>
          <span className="font-mono text-[0.5rem] tracking-[0.1em] text-cream-ghost">{ep.date}</span>
        </div>
        <h3 className="font-sans font-medium text-[0.95rem] text-cream leading-[1.4] mb-3 group-hover:text-gold transition-colors duration-200">
          {ep.title}
        </h3>
        <p className="font-sans font-light text-[0.82rem] text-cream-ghost leading-[1.8] line-clamp-2">
          {ep.description}
        </p>
        <div className="mt-5 flex items-center gap-2 font-mono text-[0.56rem] tracking-[0.14em] uppercase text-gold/60 group-hover:text-gold transition-colors duration-200">
          <span>Watch on YouTube</span>
          <span>↗</span>
        </div>
      </div>
    </a>
  )
}
