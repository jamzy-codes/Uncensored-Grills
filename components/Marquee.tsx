export default function Marquee() {
  const items = [
    { text: "Unchained Grills", lit: true },
    { text: "No Filters", lit: false },
    { text: "Intelligence Under Pressure", lit: false },
    { text: "Human Side of Web3", lit: true },
    { text: "With Dipo", lit: false },
    { text: "Real Talk", lit: false },
    { text: "No Safety Nets", lit: true },
    { text: "Only on YouTube", lit: false },
  ];

  const renderItems = (keyPrefix = "") =>
    items.map((item, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        className="inline-flex items-center gap-5 px-6 flex-shrink-0"
      >
        <span
          className={`font-display text-[0.75rem] tracking-[0.12em] uppercase ${
            item.lit ? "text-gold" : "text-transparent"
          }`}
          style={
            !item.lit
              ? { WebkitTextStroke: "1px rgba(201,168,76,0.35)" }
              : undefined
          }
        >
          {item.text}
        </span>

        <span className="w-1 h-1 rounded-full bg-gold opacity-40 flex-shrink-0" />
      </span>
    ));

  return (
    <div className="w-full overflow-hidden border-y border-gold-line py-3.5 bg-ink/60 backdrop-blur-sm">
      <div className="flex marquee-wrapper">
        {/* Strip 1 */}
        <div className="flex whitespace-nowrap marquee-track">
          {renderItems("a")}
        </div>

        {/* Strip 2 (duplicate for seamless loop) */}
        <div className="flex whitespace-nowrap marquee-track">
          {renderItems("b")}
        </div>
      </div>
    </div>
  );
}
