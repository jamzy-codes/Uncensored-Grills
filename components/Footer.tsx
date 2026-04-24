import Image from 'next/image'

const X_URL = 'https://x.com/the_grillers'
const YT_URL = 'https://youtube.com/@uncensoredgrill'

export default function Footer() {
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#guests', label: 'Guests' },
    { href: '#episodes', label: 'Episodes' },
    { href: '#guest-form', label: 'Be a Guest' },
    { href: '#ask', label: 'Ask a Question' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <footer className="relative bg-ink border-t border-gold-line">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 py-16 border-b border-gold-line/30">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 overflow-hidden flex-shrink-0">
                <Image src="/images/logo.jpg" alt="Unchained Grills" fill className="object-cover" />
              </div>
              <span className="font-display text-[1rem] tracking-[0.14em] text-white uppercase">
                Unchained Grills
              </span>
            </div>
            <p className="font-sans font-light text-cream-dim text-[0.85rem] leading-[1.85] max-w-[300px] mb-8">
              A human intelligence show inside Web3. We put founders and leaders on the hot seat
              and let the truth come out — no filters, no safety nets, no scripts.
            </p>

            {/* Social icons — real links */}
            <div className="flex gap-3">
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Unchained Grills on X"
                className="w-10 h-10 border border-gold-line flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold transition-all duration-200 font-mono text-[0.8rem]"
              >
                𝕏
              </a>
              <a
                href={YT_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch Unchained Grills on YouTube"
                className="w-10 h-10 border border-gold-line flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold transition-all duration-200 text-[0.75rem]"
              >
                ▶
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-[0.56rem] tracking-[0.24em] uppercase text-gold/70 mb-6">Navigate</h4>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-sans font-light text-[0.84rem] text-cream-dim hover:text-gold transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Watch */}
          <div>
            <h4 className="font-mono text-[0.56rem] tracking-[0.24em] uppercase text-gold/70 mb-6">Watch On</h4>
            <ul className="space-y-3">
              <li>
                <a href={YT_URL} target="_blank" rel="noopener noreferrer" className="font-sans font-light text-[0.84rem] text-cream-dim hover:text-gold transition-colors duration-200">
                  YouTube
                </a>
              </li>
              <li>
                <span className="font-sans font-light text-[0.84rem] text-cream-ghost/40 italic">
                  More platforms coming soon
                </span>
              </li>
            </ul>

            <div className="mt-10">
              <h4 className="font-mono text-[0.56rem] tracking-[0.24em] uppercase text-gold/70 mb-6">Host</h4>
              <a
                href="https://x.com/0xDipo"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-light text-[0.84rem] text-cream-dim hover:text-gold transition-colors duration-200"
              >
                @0xDipo on X ↗
              </a>
            </div>
          </div>

        </div>

        <div className="py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.52rem] tracking-[0.14em] uppercase text-cream-ghost/40">
            © 2025 Unchained Grills · All rights reserved
          </p>
          <p className="font-mono text-[0.52rem] tracking-[0.14em] uppercase text-gold/30">
            Human Intelligence Inside Web3
          </p>
        </div>
      </div>
    </footer>
  )
}
