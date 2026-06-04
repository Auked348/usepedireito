import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Eye, CheckCircle2, X } from "lucide-react";
import { getProduct, getVariants, getCrossSell, type CatalogProduct } from "@/data/catalog";
import { useCart } from "@/context/CartContext";

const parsePriceNum = (p: string) => Number(p.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name} — Pé Direito` },
      { name: "description", content: `${loaderData?.product.name} — coleção Brasil.` },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p>Produto não encontrado.</p>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p>Erro ao carregar o produto.</p>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const variants = getVariants(product.group);
  const crossSell = getCrossSell(product.slug);
  const [size, setSize] = useState(product.sizes[0]);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      size,
      price: parsePriceNum(product.price),
      comparePrice: product.comparePrice ? parsePriceNum(product.comparePrice) : undefined,
      image: product.image,
      bg: product.bg,
    });
  };

  const images = [product.image, ...(product.gallery ?? [])];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  // sempre volta para a primeira imagem ao trocar de produto
  useEffect(() => {
    setActiveIdx(0);
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
  }, [product.slug]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  // Drag-to-scroll para mouse (desktop). No mobile o swipe nativo já funciona.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    dragState.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    el.scrollLeft = s.startScroll - dx;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) return;
    s.active = false;
    const el = scrollerRef.current;
    if (el) {
      try { el.releasePointerCapture(e.pointerId); } catch {}
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
    }
  };

  const handleImageClick = (i: number) => {
    if (dragState.current.moved) { dragState.current.moved = false; return; }
    setActiveIdx(i);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        {/* Image carousel area — no thumbnails until image clicked */}
        <section className="relative pt-16" style={{ background: product.bg }}>
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide w-full max-w-full"
            style={{ touchAction: "pan-y pan-x" }}
          >
            {images.map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-full aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={src}
                  alt={`${product.name} — imagem ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  onClick={() => handleImageClick(i)}
                  className="block w-full h-full object-cover cursor-zoom-in select-none"
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 py-3">
              {images.map((_, i) => (
                <span
                  key={i}
                  className="block w-1.5 h-1.5 rounded-full transition-opacity"
                  style={{ background: "var(--brasil-yellow)", opacity: i === activeIdx ? 1 : 0.4 }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Details */}
        <section className="px-5 py-8" style={{ background: "var(--brasil-green)", color: "white" }}>
          <h1 className="font-display text-4xl lg:text-5xl uppercase font-bold" style={{ color: "var(--brasil-yellow)" }}>
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-2xl font-semibold" style={{ color: "var(--brasil-yellow)" }}>{product.price}</span>
            {product.comparePrice && (
              <span className="text-lg line-through opacity-70" style={{ color: "var(--brasil-yellow)" }}>{product.comparePrice}</span>
            )}
          </div>

          {product.category === "chinelos" && (
            <div className="mt-5 flex items-center gap-3 p-4 border-2" style={{ borderColor: "var(--brasil-yellow)", background: "rgba(0,0,0,0.15)" }}>
              <span className="flex items-center justify-center w-12 h-12 shrink-0 font-display font-bold text-2xl" style={{ background: "var(--brasil-yellow)", color: "var(--brasil-green)" }}>
                2x1
              </span>
              <div>
                <p className="font-display text-lg uppercase font-bold leading-tight" style={{ color: "var(--brasil-yellow)" }}>
                  Compre 1, Leve 2
                </p>
                <p className="text-xs opacity-90">
                  Na compra de qualquer chinelo, o segundo é por nossa conta.
                </p>
              </div>
            </div>
          )}

          {/* Colors */}
          {variants.length > 1 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--brasil-yellow)" }}>Escolha a cor</h2>
            <div className="flex gap-3">
              {variants.map((v) => {
                const selected = v.slug === product.slug;
                return (
                  <Link
                    key={v.slug}
                    to="/produto/$slug"
                    params={{ slug: v.slug }}
                    aria-label={v.name}
                    className="block w-16 h-16 p-1"
                    style={{
                      border: `2px solid ${selected ? "var(--brasil-yellow)" : "transparent"}`,
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center" style={{ background: v.swatchBg }}>
                      <img src={v.image} alt="" className="w-full h-full object-contain" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          )}

          {/* Sizes */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--brasil-yellow)" }}>Escolha o tamanho</h2>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s: string) => {
                const selected = s === size;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="px-4 py-2 text-sm font-semibold transition-colors"
                    style={{
                      background: selected ? "var(--brasil-yellow)" : "var(--cream)",
                      color: selected ? "var(--brasil-green)" : "var(--brasil-blue)",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-10 w-full py-4 text-base font-bold uppercase tracking-wider"
            style={{ background: "oklch(0.78 0.2 145)", color: "#000" }}
          >
            Adicionar à sacola
          </button>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-cream text-brasil-blue">
              <Eye className="w-4 h-4" />
              Pronta entrega
            </span>
            <span className="inline-flex items-center px-3 py-2 text-xs font-bold uppercase tracking-wider" style={{ background: "oklch(0.92 0.06 60)", color: "oklch(0.55 0.18 35)" }}>
              Últimas unidades
            </span>
          </div>

          {/* Info card */}
          <div className="mt-5 flex items-start gap-3 bg-white p-4">
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--brasil-green)" }} />
            <p className="text-sm text-foreground">
              Pronta entrega — Seu pedido será despachado em até <strong>12horas</strong>
            </p>
          </div>

          {/* Compre junto carousel */}
          <CompreJunto items={crossSell} />
        </section>
      </main>
      <WhatsAppFab />

      {lightboxOpen && (
        <Lightbox
          images={images}
          activeIdx={activeIdx}
          onChange={setActiveIdx}
          onClose={() => setLightboxOpen(false)}
          productName={product.name}
          bg={product.bg}
        />
      )}
    </div>
  );
}

function Lightbox({
  images, activeIdx, onChange, onClose, productName, bg,
}: {
  images: string[]; activeIdx: number; onChange: (i: number) => void; onClose: () => void; productName: string; bg: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    // scroll to active
    const el = ref.current;
    if (el) {
      const child = el.children[activeIdx] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior: "instant" as ScrollBehavior, inline: "start", block: "nearest" });
    }
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => {
    onChange(i);
    const el = ref.current;
    const child = el?.children[i] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIdx) onChange(idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: bg }}>
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center text-white"
      >
        <X className="w-7 h-7" />
      </button>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {images.map((src, i) => (
          <div key={i} className="snap-center shrink-0 w-full h-full flex items-center justify-center">
            <img src={src} alt={`${productName} — imagem ${i + 1}`} className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide" style={{ background: bg }}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ver imagem ${i + 1}`}
            className="shrink-0 w-16 h-16 overflow-hidden"
            style={{
              border: `2px solid ${i === activeIdx ? "var(--brasil-yellow)" : "transparent"}`,
              background: "rgba(255,255,255,0.08)",
              opacity: i === activeIdx ? 1 : 0.7,
            }}
          >
            <img src={src} alt="" className="block w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function CompreJunto({ items }: { items: CatalogProduct[] }) {
  const [selected, setSelected] = useState<Record<string, { picked: boolean; size: string }>>({});
  const { addItem } = useCart();

  const handleAddSelected = () => {
    items.forEach((p) => {
      const s = selected[p.slug];
      if (s?.picked) {
        addItem({
          slug: p.slug,
          name: p.name,
          size: s.size,
          price: parsePriceNum(p.price),
          comparePrice: p.comparePrice ? parsePriceNum(p.comparePrice) : undefined,
          image: p.image,
          bg: p.bg,
        });
      }
    });
    setSelected({});
  };

  const toggle = (slug: string, defaultSize: string) => {
    setSelected((prev) => ({
      ...prev,
      [slug]: { picked: !prev[slug]?.picked, size: prev[slug]?.size ?? defaultSize },
    }));
  };

  const setSize = (slug: string, size: string) => {
    setSelected((prev) => ({
      ...prev,
      [slug]: { picked: prev[slug]?.picked ?? false, size },
    }));
  };

  const parsePrice = (p: string) => Number(p.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  const formatPrice = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const total = items.reduce(
    (sum, p) => (selected[p.slug]?.picked ? sum + parsePrice(p.price) : sum),
    0,
  );
  const hasAny = Object.values(selected).some((s) => s.picked);

  return (
    <div className="mt-10 -mx-5">
      <h2 className="px-5 font-display text-2xl uppercase font-bold mb-4" style={{ color: "var(--brasil-yellow)" }}>
        compre junto
      </h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 pb-2 scrollbar-hide">
        {items.map((p) => {
          const state = selected[p.slug];
          const picked = !!state?.picked;
          return (
            <div key={p.slug} className="snap-start shrink-0 w-[75%] bg-white overflow-hidden block relative">
              <button
                type="button"
                onClick={() => toggle(p.slug, p.sizes[0])}
                aria-label={picked ? "Remover da seleção" : "Adicionar à seleção"}
                className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-white border-2"
                style={{
                  borderColor: picked ? "var(--brasil-green)" : "rgba(0,0,0,0.2)",
                  background: picked ? "var(--brasil-green)" : "white",
                }}
              >
                {picked && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
              <Link
                to="/produto/$slug"
                params={{ slug: p.slug }}
                className="block"
              >
                <div className="aspect-square" style={{ background: p.bg }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4 pb-2">
                  <h3 className="font-sans text-base text-foreground">{p.name}</h3>
                  <p className="font-semibold text-brasil-blue mt-1">{p.price}</p>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <select
                  className="w-full border border-muted-foreground/30 bg-white px-3 py-2 text-sm text-foreground"
                  value={state?.size ?? ""}
                  onChange={(e) => setSize(p.slug, e.target.value)}
                >
                  <option value="" disabled>selecionar tamanho</option>
                  {p.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 mt-6 flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: "var(--brasil-yellow)" }}>Total:</span>
        <span className="text-xl font-bold" style={{ color: "var(--brasil-yellow)" }}>{formatPrice(total)}</span>
      </div>
      <button
        disabled={!hasAny}
        onClick={handleAddSelected}
        className="mx-5 mt-3 w-[calc(100%-2.5rem)] py-4 text-base font-bold uppercase tracking-wider disabled:opacity-50"
        style={{ background: "oklch(0.78 0.2 145)", color: "#000" }}
      >
        Adicionar selecionados
      </button>
    </div>
  );
}
