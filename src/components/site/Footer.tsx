export function Footer() {
  return (
    <footer className="bg-brasil-blue text-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-12 lg:py-16 grid gap-10 lg:grid-cols-4">
        <div>
          <h4 className="font-extrabold tracking-wider mb-4">LOJA</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li><a href="#" className="hover:underline">Busca</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold tracking-wider mb-4">MARCA</h4>
          <ul className="space-y-2 text-sm text-white/90"></ul>
        </div>

        <div>
          <h4 className="font-extrabold tracking-wider mb-4">REDES SOCIAIS</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <a
                href="https://www.instagram.com/usepedireito__/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold tracking-wider mb-4">INSCREVER-SE</h4>
          <form className="flex items-center gap-2 border-b border-white/40 pb-2">
            <input
              type="email"
              placeholder="E-mail"
              className="flex-1 bg-transparent placeholder:text-white/60 text-sm outline-none"
            />
            <button type="submit" className="text-sm font-bold">OK</button>
          </form>
        </div>
      </div>

      <div className="px-6 lg:px-10">
        <div
          className="font-display text-white leading-none select-none"
          style={{
            fontSize: "clamp(4rem, 18vw, 14rem)",
            letterSpacing: "-0.04em",
            fontWeight: 900,
          }}
        >
          PéDireito
        </div>
      </div>

      <div className="border-t border-white/15 mt-6">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 text-center text-sm">
          PÉ DIREITO LTDA: CNPJ 64.531.945/0001-12
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col items-center gap-2 text-sm">
          <span className="text-white/80">Desenvolvido por</span>
          <span className="font-bold">⚙ chesslab</span>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-white/80">
          <p>© 2026 PéDireito, Com tecnologia da Shopify</p>
          <a href="#" className="hover:underline">Termos e políticas</a>
        </div>
      </div>
    </footer>
  );
}
