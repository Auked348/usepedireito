import { url as flipflopBranco } from "@/assets/flipflop-branco.png.asset.json";
import { url as flipflopAmarelo } from "@/assets/flipflop-amarelo.png.asset.json";
import { url as flipflopVerde } from "@/assets/flipflop-verde.png.asset.json";
import { url as flipflopAzul } from "@/assets/flipflop-azul.png.asset.json";
import { url as camisetaBranca } from "@/assets/camiseta-branca.png.asset.json";
import { url as camisetaVerde } from "@/assets/camiseta-verde.png.asset.json";
import { url as boneBrasil } from "@/assets/bone-brasil.png.asset.json";

// Gallery (secondary) images per product
import { url as amarelo2 } from "@/assets/gallery/classico-amarelo/2.jpg.asset.json";
import { url as amarelo3 } from "@/assets/gallery/classico-amarelo/3.jpg.asset.json";
import { url as amarelo4 } from "@/assets/gallery/classico-amarelo/4.jpg.asset.json";
import { url as branco2 } from "@/assets/gallery/classico-branco/2.jpg.asset.json";
import { url as branco3 } from "@/assets/gallery/classico-branco/3.jpg.asset.json";
import { url as branco4 } from "@/assets/gallery/classico-branco/4.jpg.asset.json";
import { url as verde2 } from "@/assets/gallery/classico-verde/2.jpg.asset.json";
import { url as verde3 } from "@/assets/gallery/classico-verde/3.jpg.asset.json";
import { url as verde4 } from "@/assets/gallery/classico-verde/4.jpg.asset.json";
import { url as azul2 } from "@/assets/gallery/classico-azul/2.jpg.asset.json";
import { url as azul3 } from "@/assets/gallery/classico-azul/3.jpg.asset.json";
import { url as azul4 } from "@/assets/gallery/classico-azul/4.jpg.asset.json";
import { url as camBranca2 } from "@/assets/gallery/camiseta-brasil-branca/2.png.asset.json";
import { url as camBranca3 } from "@/assets/gallery/camiseta-brasil-branca/3.png.asset.json";
import { url as camBranca4 } from "@/assets/gallery/camiseta-brasil-branca/4.png.asset.json";
import { url as camVerde2 } from "@/assets/gallery/camiseta-brasil-verde/2.png.asset.json";
import { url as camVerde3 } from "@/assets/gallery/camiseta-brasil-verde/3.png.asset.json";
import { url as camVerde4 } from "@/assets/gallery/camiseta-brasil-verde/4.png.asset.json";
import { url as bone2 } from "@/assets/gallery/bone-brasil/2.png.asset.json";

export type CatalogProduct = {
  slug: string;
  name: string;
  price: string;
  comparePrice?: string;
  badge?: "Promoção" | "Esgotado" | "Novo" | "Leve 2, Pague 1";
  color: string;
  image: string;
  gallery?: string[];
  swatchBg: string;
  bg: string;
  category: "chinelos" | "camisetas" | "bones";
  group: string;
  sizes: string[];
};

export const catalog: CatalogProduct[] = [
  // Chinelos
  { slug: "classico-amarelo", name: "Clássico Amarelo", price: "R$ 59,90", comparePrice: "R$ 69,90", badge: "Leve 2, Pague 1", color: "amarelo", image: flipflopAmarelo, gallery: [amarelo2, amarelo3, amarelo4], swatchBg: "oklch(0.38 0.16 148)", bg: "oklch(0.78 0.18 75)", category: "chinelos", group: "chinelos-classicos", sizes: ["33/34", "35/36", "37/38", "39/40", "41/42", "43/44"] },
  { slug: "classico-branco", name: "Clássico Branco", price: "R$ 59,90", comparePrice: "R$ 69,90", badge: "Leve 2, Pague 1", color: "branco", image: flipflopBranco, gallery: [branco2, branco3, branco4], swatchBg: "oklch(0.55 0.22 145)", bg: "oklch(0.78 0.16 140)", category: "chinelos", group: "chinelos-classicos", sizes: ["33/34", "35/36", "37/38", "39/40", "41/42", "43/44"] },
  { slug: "classico-verde", name: "Clássico Verde", price: "R$ 59,90", comparePrice: "R$ 69,90", badge: "Leve 2, Pague 1", color: "verde", image: flipflopVerde, gallery: [verde2, verde3, verde4], swatchBg: "oklch(0.78 0.16 85)", bg: "oklch(0.35 0.12 150)", category: "chinelos", group: "chinelos-classicos", sizes: ["33/34", "35/36", "37/38", "39/40", "41/42", "43/44"] },
  { slug: "classico-azul", name: "Clássico Azul", price: "R$ 59,90", comparePrice: "R$ 69,90", badge: "Leve 2, Pague 1", color: "azul", image: flipflopAzul, gallery: [azul2, azul3, azul4], swatchBg: "oklch(0.7 0.18 245)", bg: "oklch(0.6 0.22 245)", category: "chinelos", group: "chinelos-classicos", sizes: ["33/34", "35/36", "37/38", "39/40", "41/42", "43/44"] },

  // Camisetas
  { slug: "camiseta-brasil-branca", name: "Camiseta Brasil!", price: "R$ 129,90", color: "branco", image: camisetaBranca, gallery: [camBranca2, camBranca3, camBranca4], swatchBg: "oklch(0.95 0.01 95)", bg: "oklch(0.92 0.02 95)", category: "camisetas", group: "camisetas-brasil", sizes: ["P", "M", "G", "GG"] },
  { slug: "camiseta-brasil-verde", name: "Camiseta - Aqui é o Brasil", price: "R$ 129,90", color: "verde", image: camisetaVerde, gallery: [camVerde2, camVerde3, camVerde4], swatchBg: "oklch(0.35 0.12 150)", bg: "oklch(0.92 0.02 95)", category: "camisetas", group: "camisetas-brasil", sizes: ["P", "M", "G", "GG"] },
  

  // Bonés
  { slug: "bone-brasil", name: "Boné Brasil", price: "R$ 119,90", color: "verde", image: boneBrasil, gallery: [bone2], swatchBg: "oklch(0.35 0.12 150)", bg: "oklch(0.78 0.16 140)", category: "bones", group: "bones-brasil", sizes: ["Único"] },
];

export const getProduct = (slug: string) => catalog.find((p) => p.slug === slug);
export const getVariants = (group: string) => catalog.filter((p) => p.group === group);
export const getByCategory = (category: CatalogProduct["category"]) => catalog.filter((p) => p.category === category);
export const getCrossSell = (slug: string, limit = 4) => catalog.filter((p) => p.slug !== slug).slice(0, limit);
