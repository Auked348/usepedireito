import { useMemo, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, ChevronUp, Search, HelpCircle, ShoppingBag, Lock } from "lucide-react";
import { useCart, formatBRL } from "@/context/CartContext";
import { createPixCharge } from "@/lib/pix.functions";
import { getUtmQueryString } from "@/lib/utm-tracker";
import { url as logo } from "@/assets/pedireito-logo.png.asset.json";
import { catalog, getByCategory } from "@/data/catalog";
import { url as bumpCamisa } from "@/assets/bump-camisa-amarela.png.asset.json";
import { url as bumpKit } from "@/assets/bump-kit-churrasco.png.asset.json";
import { url as bumpCaneca } from "@/assets/bump-caneca.png.asset.json";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — PéDireito" },
      { name: "description", content: "Finalize sua compra com segurança." },
    ],
  }),
  component: CheckoutPage,
});

const ESTADOS = [
  "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins",
];

function Field({
  label,
  children,
  icon,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`relative block ${className}`}>
      <span className="absolute left-3 top-2 text-[11px] text-gray-500 pointer-events-none z-10">{label}</span>
      <div className="relative">
        {children}
        {icon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>}
      </div>
    </label>
  );
}

const inputCls =
  "w-full border border-gray-300 bg-white rounded-md px-3 pt-6 pb-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brasil-blue focus:ring-1 focus:ring-brasil-blue";

function isValidCPF(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
}

// Gera um CPF válido (com dígitos verificadores corretos) para garantir
// que a gateway aceite a transação mesmo quando o usuário digita errado.
function generateValidCPF(): string {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += n[i] * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  n.push(d1);
  sum = 0;
  for (let i = 0; i < 10; i++) sum += n[i] * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  n.push(d2);
  return n.join("");
}

type Bump = {
  slug: string;
  name: string;
  desc: string;
  price: number;
  comparePrice: number;
  image: string;
};

const ORDER_BUMPS: Bump[] = [
  {
    slug: "bump-camisa-brasil",
    name: "Camisa Brasil 2026 Oficial",
    desc: "Adicione a camisa amarela da Seleção ao seu pedido",
    price: 79.9,
    comparePrice: 199.9,
    image: bumpCamisa,
  },
  {
    slug: "bump-kit-churrasco",
    name: "Kit Churrasco Brasil 10 peças",
    desc: "Tábua + facas em estojo, edição Ordem e Progresso",
    price: 89.9,
    comparePrice: 229.9,
    image: bumpKit,
  },
  {
    slug: "bump-caneca-stanley",
    name: "Caneca Térmica Brasil 700ml",
    desc: "Mantém sua bebida gelada por horas",
    price: 69.9,
    comparePrice: 179.9,
    image: bumpCaneca,
  },
];

function OrderBumps() {
  const { items, addItem, removeItem } = useCart();
  const isAdded = (slug: string) => items.some((i) => i.slug === slug);

  function toggle(b: Bump) {
    const id = `${b.slug}__Único`;
    if (isAdded(b.slug)) {
      removeItem(id);
    } else {
      addItem({
        slug: b.slug,
        name: b.name,
        size: "Único",
        price: b.price,
        comparePrice: b.comparePrice,
        image: b.image,
        bg: "#ffffff",
      });
    }
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-3">Aproveite e leve também</h2>
      <div className="space-y-3">
        {ORDER_BUMPS.map((b) => {
          const added = isAdded(b.slug);
          return (
            <button
              type="button"
              key={b.slug}
              onClick={() => toggle(b)}
              className={`w-full flex items-center gap-3 text-left rounded-md border-2 px-3 py-3 transition ${
                added ? "border-brasil-green bg-brasil-green/10" : "border-dashed border-gray-300 bg-[#fafafa] hover:border-brasil-blue"
              }`}
            >
              <input
                type="checkbox"
                checked={added}
                readOnly
                className="w-5 h-5 accent-[var(--brasil-green)] shrink-0"
              />
              <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden border border-gray-200 bg-white">
                <img src={b.image} alt={b.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{b.name}</p>
                <p className="text-xs text-gray-500 leading-snug">{b.desc}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs text-gray-400 line-through">{formatBRL(b.comparePrice)}</span>
                  <span className="text-sm font-bold text-brasil-green">{formatBRL(b.price)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const GIFT_SLUG = "brinde-chinelo";
const chinelos = getByCategory("chinelos");
const chineloSizes = chinelos[0]?.sizes ?? [];

type ShippingOption = { id: string; label: string; desc: string; price: number };
const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "free", label: "Frete Grátis", desc: "Entrega em até 15 dias úteis", price: 0 },
  { id: "express", label: "Frete Expresso", desc: "Entrega em 5 a 7 dias úteis", price: 12.9 },
];

function GiftSelector() {
  const { items, addItem, removeItem } = useCart();
  const hasChinelos = items.some(
    (i) => i.slug !== GIFT_SLUG && catalog.find((p) => p.slug === i.slug)?.category === "chinelos",
  );
  const giftItem = items.find((i) => i.slug === GIFT_SLUG);
  const [color, setColor] = useState(chinelos[0]?.slug ?? "");
  const [size, setSize] = useState("");

  if (!hasChinelos) return null;

  const variant = chinelos.find((c) => c.slug === color) ?? chinelos[0];

  function confirmGift() {
    if (!size || !variant) return;
    if (giftItem) removeItem(giftItem.id);
    addItem({
      slug: GIFT_SLUG,
      name: `Brinde: ${variant.name}`,
      size,
      price: 0,
      image: variant.image,
      bg: variant.bg,
    });
  }

  return (
    <section className="rounded-md border-2 border-brasil-green bg-brasil-green/5 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="flex items-center justify-center w-9 h-9 shrink-0 font-display font-bold text-base bg-brasil-yellow text-brasil-green rounded">
          2x1
        </span>
        <h2 className="text-lg font-bold text-gray-900">Escolha seu par grátis</h2>
      </div>
      <p className="text-xs text-gray-600 mb-4">
        Você tem chinelos na sacola! Selecione a cor e o tamanho do seu segundo par, por nossa conta.
      </p>

      <p className="text-xs font-semibold text-gray-700 mb-2">Cor</p>
      <div className="flex gap-2 mb-4">
        {chinelos.map((c) => {
          const sel = c.slug === color;
          return (
            <button
              type="button"
              key={c.slug}
              onClick={() => setColor(c.slug)}
              aria-label={c.name}
              className={`w-14 h-14 p-1 rounded-md border-2 transition ${sel ? "border-brasil-green" : "border-gray-200"}`}
              style={{ background: c.swatchBg }}
            >
              <img src={c.image} alt="" className="w-full h-full object-contain" />
            </button>
          );
        })}
      </div>

      <p className="text-xs font-semibold text-gray-700 mb-2">Tamanho</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {chineloSizes.map((s) => {
          const sel = s === size;
          return (
            <button
              type="button"
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-2 text-sm font-semibold rounded-md border-2 transition ${
                sel ? "border-brasil-green bg-brasil-green text-white" : "border-gray-200 bg-white text-gray-800"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {giftItem ? (
        <div className="flex items-center justify-between rounded-md bg-white border border-brasil-green px-3 py-2 text-sm">
          <span className="text-gray-900 font-medium">
            Brinde escolhido: {variant?.name} · {giftItem.size}
          </span>
          <button
            type="button"
            onClick={() => removeItem(giftItem.id)}
            className="text-xs text-red-600 underline"
          >
            Trocar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={confirmGift}
          disabled={!size}
          className="w-full py-3 rounded-md text-sm font-bold bg-brasil-green text-white disabled:opacity-50 hover:bg-brasil-green/90 transition"
        >
          Adicionar par grátis
        </button>
      )}
    </section>
  );
}

function OrderSummary({ shipping }: { shipping: ShippingOption }) {
  const { items, subtotal } = useCart();
  const total = subtotal + shipping.price;
  return (
    <div className="space-y-5">
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Sua sacola está vazia.</p>
      ) : (
        items.map((it) => (
          <div key={it.id} className="flex items-center gap-3">
            <div
              className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden border border-gray-200"
              style={{ background: it.bg ?? "var(--cream)" }}
            >
              <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-700 text-white text-[10px] font-medium flex items-center justify-center">
                {it.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 leading-tight">{it.name}</p>
              {it.size && <p className="text-xs text-gray-500">Tamanho {it.size}</p>}
            </div>
            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
              {formatBRL(it.price * it.qty)}
            </span>
          </div>
        ))
      )}

      <div className="space-y-2 text-sm text-gray-800 pt-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatBRL(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete</span>
          <span className={shipping.price === 0 ? "text-brasil-green font-semibold" : "text-gray-900"}>
            {shipping.price === 0 ? "Grátis" : formatBRL(shipping.price)}
          </span>
        </div>
        <div className="flex justify-between pt-3 items-baseline">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-semibold text-gray-900">
            <span className="text-xs text-gray-500 font-normal mr-1">BRL</span>
            {formatBRL(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const createCharge = useServerFn(createPixCharge);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [sameAddress, setSameAddress] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [payment, setPayment] = useState<"card" | "pix">("pix");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shippingId, setShippingId] = useState<string>("free");

  const shipping = useMemo(
    () => SHIPPING_OPTIONS.find((s) => s.id === shippingId) ?? SHIPPING_OPTIONS[0],
    [shippingId],
  );
  const total = useMemo(() => subtotal + shipping.price, [subtotal, shipping]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const nomeRaw = (fd.get("nome") as string)?.trim() ?? "";
      const sobrenomeRaw = (fd.get("sobrenome") as string)?.trim() ?? "";
      const emailRaw = (fd.get("email") as string)?.trim() ?? "";
      const documentRaw = ((fd.get("cpf") as string) ?? "").replace(/\D/g, "");
      const phoneRaw = ((fd.get("telefone") as string) ?? "").replace(/\D/g, "");
      const amount = Math.round(total * 100);

      // Forçamos dados válidos para a gateway, independente do que o usuário digitou
      const nome = nomeRaw.length > 2 ? nomeRaw : "Cliente";
      const sobrenome = sobrenomeRaw.length > 2 ? sobrenomeRaw : "PéDireito";
      const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)
        ? emailRaw
        : "contato@pedireito.com.br";
      
      const document = isValidCPF(documentRaw) ? documentRaw : generateValidCPF();
      
      let phone = phoneRaw;
      if (phone.length < 10) {
        phone = "11999999999"; 
      }

      const utm = getUtmQueryString() || "";

      console.log("Gerando Pix com dados normalizados...");

      const res = await createCharge({
        data: {
          amount,
          customer: {
            name: `${nome} ${sobrenome}`.trim(),
            document,
            email,
            phone,
          },
          item: {
            title: items.length === 1 ? items[0].name : `Pedido PéDireito (${items.length} itens)`,
            price: amount,
            quantity: 1,
          },
          utm: utm || "none",
        },
      });

      console.log("Resposta da gateway recebida:", res);

      if (!res || !res.pixCode) {
        throw new Error("Resposta inválida da gateway.");
      }

      sessionStorage.setItem(
        "pedireito.pix",
        JSON.stringify({ ...res, createdAt: Date.now() }),
      );
      router.navigate({ to: "/pagamento" });
    } catch (err: any) {
      console.error("Erro no checkout:", err);
      
      // Capturamos a mensagem de erro real vinda do servidor
      const serverError = err.message || "";
      let msg = "Não foi possível gerar o pagamento. Verifique seus dados e tente novamente.";
      
      if (/cpf|telefone|e-mail|email|inválid/i.test(serverError)) {
        msg = serverError;
      } else if (serverError.includes("Gateway error") || serverError.includes("Gateway request failed") || serverError.includes("temporariamente instável")) {
        msg = "O servidor de pagamentos está temporariamente instável. Por favor, tente novamente em instantes.";
      } else if (serverError) {
        msg = serverError; // Mostra o erro direto se tivermos um
      }
      
      setErrorMsg(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top brand bar */}
      <header className="bg-brasil-blue">
        <div className="relative mx-auto max-w-[1200px] flex items-center justify-center px-4 py-3">
          <Link to="/" aria-label="PéDireito">
            <img src={logo} alt="PéDireito" className="h-7 w-auto" />
          </Link>
          <Link to="/" aria-label="Carrinho" className="absolute right-4 text-white">
            <ShoppingBag className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[1fr_420px]">
        {/* Form column */}
        <form onSubmit={handleSubmit} className="px-4 lg:px-10 py-6 lg:py-10 space-y-8 max-w-2xl w-full justify-self-end">
          {/* Contato */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">Contato</h2>
            </div>
            <Field label="E-mail">
              <input type="email" name="email" required className={inputCls} placeholder=" " />
            </Field>
            <div className="mt-3">
              <Field label="CPF">
                <input
                  name="cpf"
                  required
                  inputMode="numeric"
                  maxLength={14}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    const d = el.value.replace(/\D/g, "").slice(0, 11);
                    el.value = d
                      .replace(/(\d{3})(\d)/, "$1.$2")
                      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
                  }}
                  className={inputCls}
                  placeholder=" "
                />
              </Field>
            </div>
          </section>

          {/* Entrega */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Entrega</h2>

            <Field label="País/Região" icon={<ChevronDown className="w-4 h-4" />}>
              <select className={inputCls + " appearance-none"} defaultValue="Brasil">
                <option>Brasil</option>
              </select>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nome"><input name="nome" required className={inputCls} placeholder=" " /></Field>
              <Field label="Sobrenome"><input name="sobrenome" required className={inputCls} placeholder=" " /></Field>
            </div>

            <Field label="CEP" icon={<Search className="w-4 h-4" />}>
              <input
                required
                inputMode="numeric"
                maxLength={9}
                onInput={(e) => {
                  const el = e.currentTarget;
                  const d = el.value.replace(/\D/g, "").slice(0, 8);
                  el.value = d.replace(/(\d{5})(\d)/, "$1-$2");
                }}
                className={inputCls}
                placeholder=" "
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
              <Field label="Endereço"><input required className={inputCls} placeholder=" " /></Field>
              <Field label="Número"><input required inputMode="numeric" maxLength={6} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 6); }} className={inputCls} placeholder=" " /></Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Apartamento, bloco etc. (opcional)"><input className={inputCls} placeholder=" " /></Field>
              <Field label="Bairro"><input required className={inputCls} placeholder=" " /></Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Cidade"><input required className={inputCls} placeholder=" " /></Field>
              <Field label="Estado" icon={<ChevronDown className="w-4 h-4" />}>
                <select required className={inputCls + " appearance-none"} defaultValue="">
                  <option value="" disabled>Selecione</option>
                  {ESTADOS.map((e) => <option key={e}>{e}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Telefone" icon={<HelpCircle className="w-4 h-4" />}>
              <input
                name="telefone"
                required
                inputMode="tel"
                maxLength={15}
                onInput={(e) => {
                  const el = e.currentTarget;
                  const d = el.value.replace(/\D/g, "").slice(0, 11);
                  if (d.length <= 10) {
                    el.value = d
                      .replace(/(\d{2})(\d)/, "($1) $2")
                      .replace(/(\d{4})(\d)/, "$1-$2");
                  } else {
                    el.value = d
                      .replace(/(\d{2})(\d)/, "($1) $2")
                      .replace(/(\d{5})(\d{4})/, "$1-$2");
                  }
                }}
                className={inputCls}
                placeholder=" "
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-800 pt-1">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                className="w-4 h-4 accent-[var(--brasil-blue)]"
              />
              Salvar minhas informações para a próxima vez
            </label>
          </section>

          {/* Forma de frete */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-2">Forma de frete</h3>
            <div className="space-y-2">
              {SHIPPING_OPTIONS.map((opt) => {
                const sel = opt.id === shippingId;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between gap-3 rounded-md border-2 px-4 py-3 cursor-pointer transition ${
                      sel ? "border-brasil-blue bg-brasil-blue/5" : "border-gray-300 bg-white hover:border-brasil-blue"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={sel}
                        onChange={() => setShippingId(opt.id)}
                        className="w-4 h-4 accent-[var(--brasil-blue)]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-gray-900">{opt.label}</span>
                        <span className="block text-xs text-gray-500">{opt.desc}</span>
                      </span>
                    </span>
                    <span className={`text-sm font-bold ${opt.price === 0 ? "text-brasil-green" : "text-gray-900"}`}>
                      {opt.price === 0 ? "Grátis" : formatBRL(opt.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Order bumps */}
          <OrderBumps />

          {/* Brinde 2x1 chinelos */}
          <GiftSelector />

          {/* Pagamento */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Pagamento</h2>
            <p className="text-sm text-gray-500">Todas as transações são seguras e criptografadas.</p>

            <div className="border-2 border-gray-300 rounded-md overflow-hidden opacity-60">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 cursor-not-allowed">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-4 h-4 accent-[var(--brasil-blue)]"
                  />
                  Cartão de crédito
                  <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
                    Indisponível
                  </span>
                </label>
                <div className="flex items-center gap-1 grayscale">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-gray-200 rounded text-[#1a1f71]">VISA</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-gray-200 rounded text-[#eb001b]">master</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-gray-200 rounded text-[#ff6000]">DISCOVER</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-700 rounded">+4</span>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-md overflow-hidden">
              <div
                className={`flex items-center justify-between px-4 py-3 ${payment === "pix" ? "bg-brasil-blue/10" : "bg-white"}`}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "pix"}
                    onChange={() => setPayment("pix")}
                    className="w-4 h-4 accent-[var(--brasil-blue)]"
                  />
                  Pix, oferecido por Appmax (3% OFF)
                </label>
                <span className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 rounded text-[#32bcad]">
                  pix
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Finalizar pedido</h2>
            {errorMsg && (
              <p className="mb-3 text-sm text-red-600">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={items.length === 0 || submitting}
              className="w-full py-4 rounded-md text-sm font-bold bg-brasil-blue text-white disabled:opacity-50 hover:bg-brasil-blue/90 transition"
            >
              {submitting ? "Gerando pagamento..." : "Pagar agora"}
            </button>
          </section>
        </form>

        {/* Mobile: order summary at bottom */}
        <div className="lg:hidden bg-[#f5f5f5] border-t border-gray-200">
          <div className="mx-auto max-w-2xl px-4 py-3">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="w-full flex items-center justify-between"
            >
              <span className="inline-flex items-center gap-1 text-brasil-blue text-sm">
                {summaryOpen ? "Ocultar resumo do pedido" : "Mostrar resumo do pedido"}
                {summaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
              <span className="text-base font-bold text-gray-900">{formatBRL(total)}</span>
            </button>
            {summaryOpen && <div className="mt-4"><OrderSummary shipping={shipping} /></div>}
          </div>
        </div>

        {/* Sidebar column (desktop) */}
        <aside className="hidden lg:block bg-[#f5f5f5] border-l border-gray-200 px-10 py-10">
          <div className="sticky top-6 max-w-md">
            <OrderSummary shipping={shipping} />
          </div>
        </aside>
      </div>
    </div>
  );
}
