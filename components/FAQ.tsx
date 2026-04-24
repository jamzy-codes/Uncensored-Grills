'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const faqs = [
  {
    q: 'Where can I watch Unchained Grills?',
    a: 'Unchained Grills is currently on YouTube — full-length video episodes with no cuts, no edits. Click the YouTube link in the nav or visit the Episodes section above. Other streaming platforms will be added in the future.',
  },
  {
    q: 'How often are episodes released?',
    a: 'Episodes don\'t follow a fixed schedule. A new episode drops when the right guest is ready — someone with something real to say. Quality over cadence. Subscribe on YouTube or join the newsletter to get notified the moment a new episode is live.',
  },
  {
    q: 'Can I be a guest on the show?',
    a: 'Yes — if you\'re a Web3 founder, builder, or leader with a real story to tell, apply using the form above. Dipo reviews every application personally. No pre-screened questions. No guaranteed softballs. Come ready to go deep.',
  },
  {
    q: 'What kind of questions does Dipo ask?',
    a: 'The ones most interviewers won\'t. Unchained Grills exists to reveal the human side of Web3 leaders — the decisions, the failures, the real opinions. If you\'re expecting a product pitch session, this isn\'t it.',
  },
  {
    q: 'Do you accept sponsors?',
    a: 'Potentially — but only with projects and brands that align with what the show stands for. No pay-to-play appearances. If you\'re interested in a partnership, reach out via X at @0xDipo with the details.',
  },
  {
    q: 'Can I submit a question to be answered on the show?',
    a: 'Absolutely. Use the Ask a Question form above. The sharpest questions get surfaced to Dipo and potentially brought into a future episode. Your name can be credited if you\'d like.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="faq" className="relative py-28 lg:py-36 bg-ink-soft overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div className="reveal-left" style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-32px)', transition: 'all 0.75s ease' }}>
            <div className="section-kicker mb-6">FAQ</div>
            <div className="gold-rule mb-8" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)] mb-6">
              Questions<br />
              we keep<br />
              <span className="text-gold">getting.</span>
            </h2>
            <p className="text-cream-dim text-[0.88rem] leading-[1.9] font-light max-w-xs">
              Can't find your answer here? Drop your question in the Ask section above — Dipo reads them all.
            </p>
          </div>

          {/* Right — accordion */}
          <div
            ref={ref}
            className={`reveal-right ${inView ? 'visible' : ''}`}
          >
            <div className="divide-y divide-gold-line border-t border-gold-line">
              {faqs.map((faq, i) => (
                <div key={i} className="group">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={`font-sans font-medium text-[0.9rem] leading-[1.45] transition-colors duration-200 ${
                        open === i ? 'text-gold' : 'text-cream group-hover:text-gold'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`font-mono text-gold text-[1rem] flex-shrink-0 mt-0.5 transition-transform duration-300 ${
                        open === i ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-400 ease-in-out"
                    style={{
                      maxHeight: open === i ? '300px' : '0px',
                    }}
                  >
                    <p className="font-sans font-light text-cream-dim text-[0.88rem] leading-[1.9] pb-6 pr-8">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
