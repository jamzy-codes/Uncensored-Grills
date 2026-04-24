'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const FORMSPREE_URL = 'https://formspree.io/f/xdaywdpy'

export default function AskQuestion() {
  const { ref: leftRef, inView: leftIn } = useInView({ threshold: 0.1, triggerOnce: true })
  const { ref: rightRef, inView: rightIn } = useInView({ threshold: 0.05, triggerOnce: true })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', question: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          question: form.question,
          _subject: `Listener Question — from ${form.name}`,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', question: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="ask" className="relative py-28 lg:py-36 bg-ink-soft overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_50%,rgba(201,168,76,0.04),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          <div ref={leftRef} className={`reveal-left ${leftIn ? 'visible' : ''}`}>
            <div className="section-kicker mb-6">Ask a Question</div>
            <div className="gold-rule mb-8" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)] mb-6">
              Got something<br />
              that needs<br />
              <span className="text-gold">answering?</span>
            </h2>
            <p className="text-cream-dim text-[0.95rem] leading-[1.9] font-light max-w-sm">
              Drop your question here. The best ones get brought into the show —
              and Dipo has been known to book entire guests just to answer one well-asked question.
            </p>
            <div className="mt-10 border-l-2 border-gold pl-6 py-1">
              <div className="font-mono text-[0.52rem] tracking-[0.2em] uppercase text-gold/50 mb-3">
                Featured — Answered on Air
              </div>
              <p className="font-sans font-light text-cream text-[0.95rem] leading-[1.7] italic">
                "Is decentralization still the goal, or has the industry quietly made peace with centralization?"
              </p>
              <div className="font-mono text-[0.5rem] tracking-[0.14em] uppercase text-cream-ghost mt-3">
                — Brought up in EP. 04
              </div>
            </div>
          </div>

          <div ref={rightRef} className={`reveal-right ${rightIn ? 'visible' : ''}`}>
            <div className="form-card">
              <div className="font-mono text-[0.58rem] tracking-[0.26em] uppercase text-gold mb-8">
                // Drop Your Question
              </div>
              {status === 'success' ? (
                <div className="py-16 text-center">
                  <div className="font-display text-[2.5rem] text-gold mb-3">Sent.</div>
                  <p className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-cream-dim">
                    Question received. Might end up on air.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="qName" className="form-label">Your Name *</label>
                    <input id="qName" name="name" type="text" required placeholder="Your name" value={form.name} onChange={handleChange} className="form-input" />
                  </div>
                  {/* Email is required — not optional */}
                  <div className="mb-4">
                    <label htmlFor="qEmail" className="form-label">Email Address *</label>
                    <input id="qEmail" name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="question" className="form-label">Your Question *</label>
                    <textarea id="question" name="question" required rows={6} placeholder="Ask the question that needs asking. The one nobody else is asking. Be specific — the sharper the question, the more likely it gets on air..." value={form.question} onChange={handleChange} className="form-input" />
                  </div>
                  {status === 'error' && (
                    <p className="font-mono text-[0.56rem] tracking-[0.12em] text-red-400 mb-4">Something went wrong. Try again.</p>
                  )}
                  <button type="submit" disabled={status === 'sending'} className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {status === 'sending' ? 'Sending...' : 'Send Your Question'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
