const captions = [
  "Tem coisas que vão além do futebol.",
  "Calor, praia e o Pé Direito no pé.",
  "A gente acredita que o melhor do Brasil é o brasileiro.",
  "Nunca foi só futebol.",
  'Comente "Eu quero" para garantir o seu Pé Direito.',
  "Somos maioria, nunca duvide disso!",
  "Acorde todos os dias com seu Pé Direito.",
  "Chegamos a 1 MILHÃO de seguidores!",
];

export function Instagram() {
  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-10">
        <div className="text-center mb-10">
          <h2
            className="font-display text-brasil-blue tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Use PéDireito Oficial
          </h2>
          <a
            href="https://www.instagram.com/usepedireito__/"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 text-sm tracking-wider text-foreground/80 hover:text-brasil-blue"
          >
            @usepedireito__
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {captions.map((c, i) => {
            const palette = [
              "from-brasil-green to-brasil-green-dark",
              "from-brasil-blue to-[oklch(0.32_0.18_265)]",
              "from-brasil-yellow to-[oklch(0.72_0.2_70)]",
              "from-brasil-green-light to-brasil-green",
            ][i % 4];
            return (
              <a
                key={i}
                href="https://www.instagram.com/usepedireito__/"
                target="_blank"
                rel="noreferrer"
                className={`group relative aspect-square overflow-hidden bg-gradient-to-br ${palette}`}
              >
                <div className="absolute inset-0 p-3 flex items-end bg-foreground/0 group-hover:bg-foreground/40 transition">
                  <p className="text-white text-xs line-clamp-3 opacity-0 group-hover:opacity-100 transition">{c}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
