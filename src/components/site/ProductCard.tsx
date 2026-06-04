import { url as flipflop } from "@/assets/flipflop.png.asset.json";
import { Link } from "@tanstack/react-router";

type Product = {
  name: string;
  price: string;
  comparePrice?: string;
  badge?: "Promoção" | "Esgotado" | "Novo" | "Leve 2, Pague 1";
  color?: string;
  image?: string;
  slug?: string;
};

const colorMap: Record<string, string> = {
  amarelo: "oklch(0.78 0.18 75)",
  branco: "oklch(0.78 0.16 140)",
  verde: "oklch(0.35 0.12 150)",
  azul: "oklch(0.6 0.22 245)",
  laranja: "oklch(0.7 0.2 50)",
  rosa: "oklch(0.7 0.2 10)",
};

const filterMap: Record<string, string> = {
  amarelo: "none",
  branco: "hue-rotate(0deg) saturate(0)",
  verde: "hue-rotate(70deg) saturate(1.4)",
  azul: "hue-rotate(180deg) saturate(1.5)",
  laranja: "hue-rotate(-30deg) saturate(1.2)",
  rosa: "hue-rotate(-80deg) saturate(1.3)",
};

export function ProductCard({ product }: { product: Product }) {
  const bg = product.color ? colorMap[product.color] : "oklch(0.9 0.02 95)";
  const filter = product.image ? "none" : (product.color ? filterMap[product.color] : "none");
  const src = product.image ?? flipflop;
  return (
    <Link
      to={product.slug ? "/produto/$slug" : "/"}
      params={product.slug ? { slug: product.slug } : undefined as never}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden mb-4" style={{ background: bg }}>
        <img
          src={src}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={1024}
          height={1024}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter }}
        />
        {product.badge && (
          <span className={`absolute top-3 right-3 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase ${
            product.badge === "Esgotado" ? "bg-foreground text-background" :
            product.badge === "Leve 2, Pague 1" ? "bg-brasil-green text-brasil-yellow" :
            product.badge === "Promoção" ? "bg-foreground text-white" :
            "bg-brasil-yellow text-foreground"
          }`}>
            {product.badge}
          </span>
        )}
      </div>
      <h3 className="font-display text-2xl tracking-wide">{product.name}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        {product.comparePrice && (
          <span className="text-sm text-muted-foreground line-through">{product.comparePrice}</span>
        )}
        <span className="font-semibold text-brasil-blue">{product.price}</span>
      </div>
    </Link>
  );
}

export type { Product };
