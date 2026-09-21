"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";

const FORMSPREE_URL = "https://formspree.io/f/mppwpbor";

const ERROR_MESSAGES = {
  validation: "Please check the form and try again.",
  rateLimit: "Too many attempts. Please wait a moment and try again.",
  server: "The form service is temporarily unavailable. Please try again soon.",
  network: "Network error. Please check your connection and try again.",
  default: "Something went wrong. Please try again.",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type GuestFieldErrors = Partial<Record<"name" | "email" | "why", boolean>>;

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

export default function GuestForm() {
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
  const [fieldErrors, setFieldErrors] = useState<GuestFieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    xHandle: "",
    email: "",
    role: "",
    why: "",
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
      why: !form.why.trim(),
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
          "x-handle": form.xHandle,
          email: form.email,
          role: form.role,
          message: form.why,
          _subject: `Guest Application: ${form.name}`,
          _gotcha: form._gotcha,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFieldErrors({});
        setForm({
          name: "",
          xHandle: "",
          email: "",
          role: "",
          why: "",
          _gotcha: "",
        });
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
      id="guest-form"
      className="relative py-12 lg:py-36 bg-ink overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(201,168,76,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-line to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">
          <div
            ref={leftRef}
            className={`reveal-left ${leftIn ? "visible" : ""}`}
          >
            <div className="section-kicker mb-6">Be a Guest</div>
            <div className="gold-rule mb-8" />
            <h2 className="display-heading text-[clamp(2.8rem,5vw,4.5rem)] mb-6">
              Think you can
              <br />
              <span className="text-gold">handle it?</span>
            </h2>
            <p className="text-cream-dim text-[0.95rem] leading-[1.9] font-light max-w-sm">
              We're looking for Web3 founders, builders, and leaders who have
              something real to say. No PR polish needed. Just bring the truth.
              We'll handle the rest.
            </p>
            <div className="mt-10 space-y-5">
              {[
                {
                  n: "01",
                  text: "A real conversation, not an interview. We go where the truth lives.",
                },
                {
                  n: "02",
                  text: "No questions sent in advance. Come ready for anything.",
                },
                {
                  n: "03",
                  text: "Your episode shared across Uncensored Grills' YouTube and X channels.",
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-4 items-start">
                  <span className="font-mono text-[0.56rem] text-gold/50 mt-1 flex-shrink-0">
                    {item.n}.
                  </span>
                  <p className="font-sans font-light text-[0.86rem] text-cream-dim leading-[1.8]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightRef}
            className={`reveal-right ${rightIn ? "visible" : ""}`}
          >
            <div className="form-card">
              <div className="font-mono text-[0.58rem] tracking-[0.26em] uppercase text-gold mb-8">
                // Guest Application
              </div>
              {status === "success" ? (
                <div className="py-16 text-center" role="status" aria-live="polite">
                  <div className="font-display text-[2.5rem] text-gold mb-3">
                    Done.
                  </div>
                  <p className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-cream-dim">
                    Application received. Dipo will be in touch.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        id="name"
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
                    <div>
                      <label htmlFor="xHandle" className="form-label">
                        X Handle
                      </label>
                      <input
                        id="xHandle"
                        name="xHandle"
                        type="text"
                        maxLength={100}
                        placeholder="@yourhandle"
                        value={form.xHandle}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="guestEmail" className="form-label">
                      Email Address *
                    </label>
                    <input
                      id="guestEmail"
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
                  <div className="mb-4">
                    <label htmlFor="role" className="form-label">
                      Your Role & What You're Building
                    </label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      maxLength={150}
                      placeholder="e.g. Co-founder @ Protocol XYZ"
                      value={form.role}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="why" className="form-label">
                      Why Should Dipo Grill You? *
                    </label>
                    <textarea
                      id="why"
                      name="why"
                      required
                      rows={5}
                      maxLength={2000}
                      aria-invalid={fieldErrors.why || undefined}
                      placeholder="Tell us what you're building, the real story behind it, and why this conversation needs to happen..."
                      value={form.why}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="absolute left-[-10000px] h-px w-px overflow-hidden">
                    <label htmlFor="guestGotcha">Leave this field blank</label>
                    <input
                      id="guestGotcha"
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
                    {status === "sending" ? "Sending..." : "Submit Application"}
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

