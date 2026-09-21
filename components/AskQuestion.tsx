"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";

const FORMSPREE_URL = "https://formspree.io/f/xzezewwy";

const ERROR_MESSAGES = {
  validation: "Please check the form and try again.",
  rateLimit: "Too many attempts. Please wait a moment and try again.",
  server: "The form service is temporarily unavailable. Please try again soon.",
  network: "Network error. Please check your connection and try again.",
  default: "Something went wrong. Try again.",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type QuestionFieldErrors = Partial<Record<"name" | "email" | "question", boolean>>;

async function parseFormspreeError(res: Response) {
  try {
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

function getFormspreeErrorMessage(res: Response, data: unknown) {
  if (res.status === 429) return ERROR_MESSAGES.rateLimit;
  if (res.status >= 500) return ERROR_MESSAGES.server;

  if (
    data &&
    typeof data === "object" &&
    "errors" in data &&
    Array.isArray((data as { errors: unknown }).errors)
  ) {
    return ERROR_MESSAGES.validation;
  }

  if (res.status >= 400 && res.status < 500) {
    return ERROR_MESSAGES.validation;
  }

  return ERROR_MESSAGES.default;
}

export default function AskQuestion() {
  const { ref: leftRef, inView: leftIn } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: rightRef, inView: rightIn } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState(ERROR_MESSAGES.default);
  const [fieldErrors, setFieldErrors] = useState<QuestionFieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    question: "",
    _gotcha: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const nextFieldErrors = {
      name: !form.name.trim(),
      email: !EMAIL_PATTERN.test(form.email.trim()),
      question: !form.question.trim(),
    };

    if (Object.values(nextFieldErrors).some(Boolean)) {
      setFieldErrors(nextFieldErrors);
      setErrorMessage(ERROR_MESSAGES.validation);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage(ERROR_MESSAGES.default);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          question: form.question,
          _subject: `Listener Question: from ${form.name}`,
          _gotcha: form._gotcha,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFieldErrors({});
        setForm({ name: "", email: "", question: "", _gotcha: "" });
      } else {
        const data = await parseFormspreeError(res);
        setErrorMessage(getFormspreeErrorMessage(res, data));
        setStatus("error");
      }
    } catch {
      setErrorMessage(ERROR_MESSAGES.network);
      setStatus("error");
    }
  };

  return (
    <section
      id="ask"
      className="relative py-12 lg:py-36 bg-ink-soft overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_50%,rgba(201,168,76,0.04),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div
            ref={leftRef}
            className={`reveal-left ${leftIn ? "visible" : ""}`}
          >
            <div className="section-kicker mb-6">Ask a Question</div>
            <div className="gold-rule mb-8" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)] mb-6">
              Got something
              <br />
              that needs
              <br />
              <span className="text-gold">answering?</span>
            </h2>
            <p className="text-cream-dim text-[0.95rem] leading-[1.9] font-light max-w-sm">
              Drop your question here. The best ones get brought into the show.
              and Dipo has been known to book entire guests just to answer one
              well-asked question.
            </p>
            <div className="mt-10 border-l-2 border-gold pl-6 py-1">
              <div className="font-mono text-[0.52rem] tracking-[0.2em] uppercase text-gold/50 mb-3">
                Featured: Answered on Air
              </div>
              <p className="font-sans font-light text-cream text-[0.95rem] leading-[1.7] italic">
                "Is decentralization still the goal, or has the industry quietly
                made peace with centralization?"
              </p>
              <div className="font-mono text-[0.5rem] tracking-[0.14em] uppercase text-cream-ghost mt-3">
                Brought up in EP. 04
              </div>
            </div>
          </div>

          <div
            ref={rightRef}
            className={`reveal-right ${rightIn ? "visible" : ""}`}
          >
            <div className="form-card">
              <div className="font-mono text-[0.58rem] tracking-[0.26em] uppercase text-gold mb-8">
                // Drop Your Question
              </div>
              {status === "success" ? (
                <div className="py-16 text-center" role="status" aria-live="polite">
                  <div className="font-display text-[2.5rem] text-gold mb-3">
                    Sent.
                  </div>
                  <p className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-cream-dim">
                    Question received. Might end up on air.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="qName" className="form-label">
                      Your Name *
                    </label>
                    <input
                      id="qName"
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      aria-invalid={fieldErrors.name || undefined}
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  {/* Email is required, not optional */}
                  <div className="mb-4">
                    <label htmlFor="qEmail" className="form-label">
                      Email Address *
                    </label>
                    <input
                      id="qEmail"
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      aria-invalid={fieldErrors.email || undefined}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="question" className="form-label">
                      Your Question *
                    </label>
                    <textarea
                      id="question"
                      name="question"
                      required
                      rows={6}
                      maxLength={2000}
                      aria-invalid={fieldErrors.question || undefined}
                      placeholder="Ask the question that needs asking. The one nobody else is asking. Be specific. The sharper the question, the more likely it gets on air..."
                      value={form.question}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="absolute left-[-10000px] h-px w-px overflow-hidden">
                    <label htmlFor="questionGotcha">Leave this field blank</label>
                    <input
                      id="questionGotcha"
                      name="_gotcha"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form._gotcha}
                      onChange={handleChange}
                    />
                  </div>
                  {status === "error" && (
                    <p
                      className="font-mono text-[0.56rem] tracking-[0.12em] text-red-400 mb-4"
                      role="alert"
                    >
                      {errorMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Sending..." : "Send Your Question"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

