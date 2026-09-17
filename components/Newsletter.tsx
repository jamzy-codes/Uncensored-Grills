"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Newsletter() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      // Calls our internal Next.js API route. The API key stays server-side.
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="newsletter"
      className="relative py-24 lg:py-32 bg-ink overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(201,168,76,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-[680px] mx-auto px-6 text-center">
        <div ref={ref} className={`reveal-up ${inView ? "visible" : ""}`}>
          <div className="section-kicker justify-center mb-6">
            Stay in the Loop
          </div>
          <div className="gold-rule mx-auto mb-8" />
          <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-5">
            The Unchained
            <br />
            <span className="text-gold">Dispatch</span>
          </h2>
          <p className="font-sans font-light text-cream-dim text-[0.92rem] leading-[1.9] mb-10 max-w-md mx-auto">
            When a new episode drops, you'll know first. Guest announcements,
            show notes, and sharp takes from inside the Web3 builder space.
            straight to your inbox.
          </p>

          {status === "success" ? (
            <div className="py-8">
              <div className="font-display text-[2.5rem] text-gold mb-2">
                You're in.
              </div>
              <p className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim">
                Check your Inbox / Spam to confirm your subscription.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-input flex-1 border-r-0"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-gold flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "..." : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="font-mono text-[0.54rem] tracking-[0.12em] text-red-400 mt-3">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="font-mono text-[0.52rem] tracking-[0.12em] text-cream-ghost mt-5">
            No spam · Unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
