import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ProductSections } from "@/components/site/ProductSections";
import { MarqueeBanner, BrasilMarquee } from "@/components/site/Banners";

import { FeatureTiles } from "@/components/site/FeatureTiles";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pé Direito — Aqui é Brasil" },
      { name: "description", content: "Chinelos, camisetas e bonés com identidade brasileira. Coleção Brasil oficial." },
      { property: "og:title", content: "Pé Direito — Aqui é Brasil" },
      { property: "og:description", content: "Chinelos, camisetas e bonés com identidade brasileira." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Hero />
        <MarqueeBanner />
        <ProductSections />
        <FeatureTiles />
        
        <BrasilMarquee />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
