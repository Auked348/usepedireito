import { ProductCard, type Product } from "./ProductCard";
import { catalog } from "@/data/catalog";

const allProducts: Product[] = catalog.map((p) => ({
  name: p.name,
  price: p.price,
  comparePrice: p.comparePrice,
  badge: p.badge,
  color: p.color,
  image: p.image,
  slug: p.slug,
}));

export function ProductSections() {
  return (
    <section id="produtos" className="py-12 lg:py-20 bg-cream">
      <div id="colecao" className="max-w-[1500px] mx-auto px-4 lg:px-10">
        <h2 className="font-display font-bold uppercase text-3xl lg:text-5xl text-brasil-blue mb-8">
          Coleção Brasil
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {allProducts.map((p) => <ProductCard key={p.name} product={p} />)}
        </div>
      </div>
    </section>
  );
}
