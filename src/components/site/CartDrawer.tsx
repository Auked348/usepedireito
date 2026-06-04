import { useEffect } from "react";
import { useState } from "react";
import { X, Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useCart, formatBRL } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const { items, isOpen, close, setQty, removeItem, subtotal } = useCart();
  const [discountOpen, setDiscountOpen] = useState(false);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!isOpen}
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrinho"
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-cream flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brasil-blue/10">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-brasil-blue">Carrinho</h2>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-brasil-blue/10 text-brasil-blue text-xs font-bold">
              {count}
            </span>
          </div>
          <button onClick={close} aria-label="Fechar carrinho" className="p-1 text-brasil-blue">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-brasil-blue/70">
              <p className="text-sm">Sua sacola está vazia.</p>
            </div>
          ) : (
            <ul className="divide-y divide-brasil-blue/10">
              {items.map((it) => (
                <li key={it.id} className="py-4 flex gap-3">
                  <div className="w-16 h-16 shrink-0 overflow-hidden" style={{ background: it.bg ?? "var(--cream)" }}>
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-brasil-green inline-flex items-center gap-1">
                        ◆ Pronta entrega
                      </p>
                      <p className="text-sm font-semibold text-brasil-blue whitespace-nowrap">{formatBRL(it.price * it.qty)}</p>
                    </div>
                    <p className="mt-1 text-sm text-brasil-blue leading-snug">{it.name} - {it.size}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs text-brasil-blue/60 line-through">{formatBRL(it.price)}</span>
                      {it.comparePrice && it.comparePrice > it.price && (
                        <span className="text-xs text-brasil-blue/40 line-through">{formatBRL(it.comparePrice)}</span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-brasil-blue/20 bg-white">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          aria-label="Diminuir"
                          className="w-9 h-9 flex items-center justify-center text-brasil-blue hover:bg-brasil-blue/5"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-brasil-blue">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          aria-label="Aumentar"
                          className="w-9 h-9 flex items-center justify-center text-brasil-blue hover:bg-brasil-blue/5"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(it.id)}
                        aria-label="Remover"
                        className="p-2 text-brasil-blue hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-brasil-blue/10 px-5 py-4 space-y-4 bg-cream">
          {/* Discount */}
          <div>
            <button
              type="button"
              onClick={() => setDiscountOpen((v) => !v)}
              className="w-full flex items-center justify-between py-2 text-brasil-blue"
            >
              <span className="text-sm">Desconto</span>
              {discountOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            {discountOpen && (
              <div className="flex gap-2 mt-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Código do cupom"
                  className="flex-1 border border-brasil-blue/20 bg-white px-3 py-2 text-sm text-brasil-blue placeholder:text-brasil-blue/40"
                />
                <button className="px-4 py-2 text-sm font-bold uppercase bg-brasil-blue text-white">
                  Aplicar
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brasil-blue/10">
            <span className="text-sm text-brasil-blue">Total estimado</span>
            <span className="text-lg font-bold text-brasil-blue">{formatBRL(subtotal)}</span>
          </div>

          <div className="flex items-start gap-2 p-3 border border-brasil-green/30 bg-brasil-green/5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-brasil-green mt-0.5" />
            <p className="text-xs text-brasil-blue leading-snug">
              Seu pedido é de <strong>pronta entrega</strong> e será despachado em até <strong>5 dias úteis</strong>
            </p>
          </div>

          <Link
            to="/checkout"
            onClick={close}
            aria-disabled={items.length === 0}
            className={`block text-center w-full py-4 text-sm font-bold uppercase tracking-wider bg-brasil-blue text-white ${items.length === 0 ? "pointer-events-none opacity-50" : ""}`}
          >
            Finalizar a compra
          </Link>
        </div>
      </aside>
    </>
  );
}
