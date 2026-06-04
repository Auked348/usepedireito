import { url as sizeGuide } from "@/assets/size-guide.jpg.asset.json";
import { url as sizeTable } from "@/assets/size-table.jpg.asset.json";
import { url as insta1 } from "@/assets/insta-1.jpg.asset.json";
import { url as insta2 } from "@/assets/insta-2.jpg.asset.json";
import { url as insta3 } from "@/assets/insta-3.jpg.asset.json";
import { url as insta4 } from "@/assets/insta-4.jpg.asset.json";

export function FeatureTiles() {
  return (
    <section className="bg-cream">
      <div className="w-full bg-brasil-green flex items-center justify-center overflow-hidden">
        <video
          src="/brasil-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto max-h-[70vh] object-cover"
        />
      </div>

      <img
        src={sizeGuide}
        alt="Guia de tamanhos"
        width={949}
        height={938}
        className="w-full h-auto block"
        loading="lazy"
        decoding="async"
      />

      <img
        src={sizeTable}
        alt="Tabela de tamanhos"
        width={917}
        height={938}
        className="w-full h-auto block"
        loading="lazy"
        decoding="async"
      />

      <div className="px-4 pt-8 pb-4 text-center">
        <h2 className="text-brasil-blue font-extrabold uppercase tracking-tight text-2xl md:text-4xl leading-tight">
          USE PÉDIREITO<br />OFICIAL
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-1 px-1">
        {[insta1, insta2, insta3, insta4].map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Pédireito ${i + 1}`}
            width={788}
            height={788}
            className="w-full aspect-square object-cover block"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      <p className="text-sm py-3 underline text-left px-4">@usepedireito__</p>
    </section>
  );
}
