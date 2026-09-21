"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: "About" },
    { href: "#guests", label: "Guests" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#episodes", label: "Episodes" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/90 backdrop-blur-md border-b border-gold-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-14 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Uncensored Grills"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-display text-[0.95rem] tracking-[0.14em] text-white uppercase hidden sm:block">
            Uncensored Grills
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-cream-dim hover:text-gold transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <a href="#guest-form" className="btn-gold text-[0.6rem] py-2.5 px-5">
            Be a Guest
          </a>
          <a
            href="mailto:uncensoredgrill@gmail.com?subject=Sponsorship%20Inquiry&body=Hi%20Dipo%2C%0A%0AWe're%20interested%20in%20sponsoring%20Uncensored%20Grills.%20Here's%20a%20bit%20about%20us%3A%0A%0ABrand%2FProject%20name%3A%0AWhat%20we%20do%3A%0AWhat%20we're%20looking%20for%20(episode%20mention%2C%20guest%20slot%2C%20etc.)%3A%0ABudget%3A%0A%0ALooking%20forward%20to%20hearing%20back."
            className="btn-outline text-[0.6rem] py-2.5 px-5"
          >
            Sponsor Us
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-ink/97 backdrop-blur-md border-b border-gold-line transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#guest-form"
            onClick={() => setMenuOpen(false)}
            className="btn-gold text-[0.62rem] py-3 px-6 self-start"
          >
            Be a Guest
          </a>
          <a
            href="mailto:uncensoredgrill@gmail.com?subject=Sponsorship%20Inquiry&body=Hi%20Dipo%2C%0A%0AWe're%20interested%20in%20sponsoring%20Uncensored%20Grills.%20Here's%20a%20bit%20about%20us%3A%0A%0ABrand%2FProject%20name%3A%0AWhat%20we%20do%3A%0AWhat%20we're%20looking%20for%20(episode%20mention%2C%20guest%20slot%2C%20etc.)%3A%0ABudget%3A%0A%0ALooking%20forward%20to%20hearing%20back."
            onClick={() => setMenuOpen(false)}
            className="btn-outline text-[0.62rem] py-3 px-6 self-start"
          >
            Sponsor Us
          </a>
        </div>
      </div>
    </header>
  );
}
