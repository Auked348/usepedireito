import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { url as logo } from "@/assets/pedireito-logo.png.asset.json";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { open, count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent text-white">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button aria-label="Menu" onClick={() => setMenuOpen(true)}><Menu className="w-6 h-6" /></button>
          <button aria-label="Pesquisar"><Search className="w-5 h-5" /></button>
        </div>
        <Link to="/" aria-label="PéDireito — início" className="absolute left-1/2 -translate-x-1/2">
          <img src={logo} alt="PéDireito" width={781} height={158} fetchPriority="high" decoding="async" className="h-7 w-auto" />
        </Link>
        <div className="flex items-center gap-5">
          <button aria-label="Conta"><User className="w-5 h-5" /></button>
          <button onClick={open} aria-label="Sacola" className="relative">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brasil-yellow text-brasil-green text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-[61] w-[280px] bg-brasil-blue text-white px-6 py-5 shadow-2xl">
            <button
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
              className="mb-12"
            >
              <X className="w-7 h-7" />
            </button>
            <nav className="flex flex-col gap-8">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-extrabold tracking-tight"
              >
                INÍCIO
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
