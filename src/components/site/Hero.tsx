export function Hero() {
  return (
    <section className="relative bg-brasil-blue text-white overflow-hidden pt-24 lg:pt-28 pb-16 lg:pb-24">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-10">
        <p className="text-sm lg:text-base leading-relaxed">
          Ditado Popular.<br />
          Identidade Brasileira.<br />
          Liberdade de Escolha.
        </p>
      </div>

      <div className="relative w-full pt-10 lg:pt-24 px-2">
        <h1
          className="font-display text-white leading-[0.85] text-center w-full"
          style={{
            fontSize: "clamp(3rem, 20vw, 22rem)",
            letterSpacing: "-0.04em",
            fontWeight: 900,
          }}
        >
          PéDireito
        </h1>
      </div>
    </section>
  );
}
