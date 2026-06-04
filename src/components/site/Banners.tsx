export function MarqueeBanner() {
  const words = ["PASSO FIRME.", "IDENTIDADE.", "LIBERDADE."];
  return (
    <section className="bg-brasil-yellow overflow-hidden py-6 lg:py-10">
      <div className="flex whitespace-nowrap animate-marquee gap-12 w-max">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-brasil-green"
            style={{
              fontSize: "clamp(3rem, 9vw, 8rem)",
              letterSpacing: "-0.01em",
              fontWeight: 800,
            }}
          >
            {words[i % words.length]}
          </span>
        ))}
      </div>
    </section>
  );
}

export function BrasilMarquee() {
  return (
    <section className="bg-brasil-green overflow-hidden py-8 lg:py-14 bg-green-700">
      <div className="flex whitespace-nowrap animate-marquee-fast gap-16 w-max">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="font-display text-[#e1ff00] bg-green-700"
            style={{
              fontSize: "clamp(3rem, 10vw, 9rem)",
              letterSpacing: "-0.02em",
              fontWeight: 800,
            }}
          >
            AQUI É BRASIL
          </span>
        ))}
      </div>
    </section>
  );
}

export function VideoBanner() {
  return (
    <section className="relative bg-brasil-green-dark text-white py-24 lg:py-40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
        <p className="text-xs lg:text-sm tracking-[0.3em] uppercase mb-6 text-brasil-yellow">
          O Manifesto
        </p>
        <h2
          className="font-display max-w-4xl mx-auto leading-[0.95]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", letterSpacing: "-0.01em" }}
        >
          O MELHOR DO BRASIL<br />É O BRASILEIRO.
        </h2>
        <button className="mt-10 inline-flex items-center gap-3 bg-brasil-yellow text-foreground px-7 py-4 font-display tracking-wider text-lg hover:scale-105 transition">
          <span className="w-2.5 h-2.5 bg-brasil-green rounded-full" />
          ASSISTIR O VÍDEO
        </button>
      </div>
    </section>
  );
}

export function DualBanner() {
  return (
    <section className="grid md:grid-cols-2 gap-1 bg-cream">
      <div className="aspect-[4/3] bg-brasil-yellow flex items-end p-8 lg:p-14 relative overflow-hidden">
        <div
          className="absolute -top-10 -right-10 font-display text-brasil-green opacity-20"
          style={{ fontSize: "16rem", letterSpacing: "-0.05em" }}
        >
          PD
        </div>
        <div className="relative">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-bold text-brasil-green">Novidade</p>
          <h3 className="font-display text-5xl lg:text-7xl mb-5 text-brasil-green">VERÃO 2026</h3>
          <a href="#produtos" className="font-display tracking-wider text-foreground underline underline-offset-8 decoration-2">
            EXPLORAR COLEÇÃO →
          </a>
        </div>
      </div>
      <div className="aspect-[4/3] bg-brasil-green text-white flex items-end p-8 lg:p-14 relative overflow-hidden">
        <div
          className="absolute -top-10 -right-10 font-display text-brasil-yellow opacity-20"
          style={{ fontSize: "16rem", letterSpacing: "-0.05em" }}
        >
          BR
        </div>
        <div className="relative">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-bold text-brasil-yellow">Embaixadores</p>
          <h3 className="font-display text-5xl lg:text-7xl mb-5">A GENTE ACREDITA</h3>
          <a href="#" className="font-display tracking-wider text-white underline underline-offset-8 decoration-2">
            CONHECER HISTÓRIA →
          </a>
        </div>
      </div>
    </section>
  );
}
