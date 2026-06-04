import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { getPixStatus } from "@/lib/pix.functions";
import { formatBRL, useCart } from "@/context/CartContext";

export const Route = createFileRoute("/pagamento")({
  head: () => ({
    meta: [
      { title: "Pagamento Pix — PéDireito" },
      { name: "description", content: "Finalize sua compra pagando com Pix." },
    ],
  }),
  component: PaymentPage,
});

type PixData = {
  transactionId: string;
  pixCode: string;
  amount: number;
  createdAt: number;
};

const EXPIRES_IN = 30 * 60 * 1000; // 30 minutes

function PaymentPage() {
  const router = useRouter();
  const { clear } = useCart();
  const checkStatus = useServerFn(getPixStatus);
  const [data, setData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pedireito.pix");
      if (raw) setData(JSON.parse(raw));
      else router.navigate({ to: "/" });
    } catch {
      router.navigate({ to: "/" });
    }
  }, [router]);

  // countdown ticker
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // poll status
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(async () => {
      try {
        const res = await checkStatus({ data: { transactionId: data.transactionId } });
        if (res.status === "COMPLETED") {
          clearInterval(interval);
          setPaid(true);
          clear();
          sessionStorage.removeItem("pedireito.pix");
        }
      } catch {
        /* next cycle retries */
      }
    }, 5000);
    const stop = setTimeout(() => clearInterval(interval), 15 * 60 * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [data, checkStatus, clear]);

  const remaining = useMemo(() => {
    if (!data) return 0;
    return Math.max(0, data.createdAt + EXPIRES_IN - now);
  }, [data, now]);

  const countdown = useMemo(() => {
    const totalSec = Math.floor(remaining / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${String(m).padStart(2, "0")}m${String(s).padStart(2, "0")}s`;
  }, [remaining]);

  async function copyCode() {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eaeaea]">
        <p className="text-gray-500 text-sm">Carregando pagamento...</p>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eaeaea] px-4">
        <div className="bg-white rounded-2xl shadow-sm max-w-md w-full px-8 py-12 text-center">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-9 h-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Pagamento aprovado!</h1>
          <p className="text-sm text-gray-600 mb-8">
            Recebemos seu pagamento. Em breve você receberá a confirmação por e-mail.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-md text-sm font-bold bg-brasil-blue text-white hover:bg-brasil-blue/90 transition"
          >
            Voltar para loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-[#eaeaea] px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm max-w-md w-full px-8 py-12 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Estamos quase lá!</h1>

        <p className="text-sm font-bold text-gray-800 mb-4">
          Para finalizar sua compra, siga os passos abaixo:
        </p>

        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
          <span className="font-bold text-[#8b5cf6]">Escaneie QR Code</span> ou{" "}
          <span className="font-bold text-[#8b5cf6]">copie o código Pix</span>
          <br />e cole o código no aplicativo do seu banco para efetuar o pagamento.
        </p>

        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white">
            <QRCodeSVG value={data.pixCode} size={200} level="M" />
          </div>
        </div>

        <button
          onClick={copyCode}
          className="inline-flex items-center gap-2 text-[#8b5cf6] font-semibold text-base mb-6 hover:opacity-80 transition"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? "Código copiado!" : "Copiar Código"}
        </button>

        <p className="text-sm text-gray-700 mb-4">
          Valor do Pix: <span className="font-bold text-[#8b5cf6]">{formatBRL(data.amount / 100)}</span>
        </p>

        <p className="text-sm font-bold text-gray-800 mb-6">
          O código expira em:
          <br />
          {countdown}
        </p>

        <p className="text-sm font-semibold text-[#009ee3] mb-6">
          Pagamento processado com Mercado Pago
        </p>

        <Link to="/" className="text-sm text-gray-600 underline hover:text-gray-900">
          Voltar para loja
        </Link>
      </div>
    </div>
  );
}