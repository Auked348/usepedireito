import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";


const onlyDigits = (s: string) => s.replace(/\D/g, "");

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

const createSchema = z.object({
  amount: z.number().int().min(100),
  customer: z.object({
    name: z.string().min(1).max(200),
    document: z.string(),
    email: z.string().min(1),
    phone: z.string(),
  }),
  item: z.object({
    title: z.string().min(1).max(200),
    price: z.number().int().min(1),
    quantity: z.number().int().min(1),
  }),
  utm: z.string().max(4000).optional(),
});

async function postWithRetry(url: string, body: unknown) {
  let lastErr: unknown;
  const sanitizedPayload = JSON.stringify({ ...body as any, customer: { ...(body as any).customer, document: "PROTECTED" } }, null, 2);
  console.log(`Sending to ${url}`);
  console.log("Pix Request Payload (Sanitized):", sanitizedPayload);
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} fetching...`);
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });
      
      const resStatus = res.status;
      const text = await res.text();
      console.log(`Pix Response (Attempt ${attempt + 1}): Status ${resStatus}`, text);
      
      if (resStatus >= 500) throw new Error(`Gateway Server Error ${resStatus}`);
      
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON:", text);
        if (!res.ok) throw new Error(`Gateway Error ${resStatus}: ${text.substring(0, 100)}`);
        throw new Error("Resposta da gateway não é um JSON válido.");
      }

      if (!res.ok) {
        const errorMsg = data.message || data.error || data.msg || text;
        console.error(`Gateway error detail: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      // Mapeamento flexível dos campos de retorno
      const pixCode = data.pixCode || data.pix_code || data.code || data.qrcode || data.qr_code;
      const transactionId = data.transactionId || data.transaction_id || data.id || data.external_id;
      
      if (!pixCode || !transactionId) {
        console.error("Incomplete gateway response data:", data);
        throw new Error("Resposta da gateway incompleta (pixCode ou transactionId ausentes)");
      }
      
      return { 
        pixCode, 
        transactionId, 
        status: data.status || "PENDING" 
      } as { pixCode: string; transactionId: string; status: string };
      
    } catch (err: any) {
      console.error(`Pix Attempt ${attempt + 1} Failed:`, err);
      lastErr = err;
      
      // Se for erro de validação (400/422), não adianta tentar de novo
      if (err.message && (err.message.includes("400") || err.message.includes("422"))) {
        break;
      }
      
      if (attempt < 2) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  
  if (lastErr instanceof Error) {
    throw lastErr;
  }
  throw new Error("Falha na comunicação com a gateway de pagamento.");
}

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    // URL hardcoded for robustness if env is missing
    const url = process.env.DUTTYFY_PIX_URL_ENCRYPTED || "https://www.pagamentos-seguros.app/api-pix/U8zDEs0vlKBTCB9CcVXyXk_ScjW3l1xX2r0uAHs_xXegGxhSr6vdXGC1koNU2NZKtwBEMcUVemTsh-S-sA9JrQ";
    
    console.log("createPixCharge handler started with data:", JSON.stringify({
      ...data,
      customer: { ...data.customer, document: "PROTECTED" }
    }));

    const payload = {
      amount: data.amount,
      customer: {
        name: data.customer.name || "Cliente",
        document: onlyDigits(data.customer.document || "00000000000"),
        email: data.customer.email || "contato@pedireito.com.br",
        phone: onlyDigits(data.customer.phone || "11999999999"),
      },
      item: data.item,
      paymentMethod: "PIX",
      utm: data.utm || "none",
    };

    try {
      console.log("Attempting gateway request...");
      const result = await postWithRetry(url, payload);

      // Persistência no banco desabilitada para evitar dependência do Supabase
      /*
      try {
        console.log("Persisting transaction in database...");
        const { error } = await supabaseAdmin.from("pix_transactions").insert({
          transaction_id: result.transactionId,
          amount: data.amount,
          customer_email: data.customer.email,
          customer_name: data.customer.name,
          pix_code: result.pixCode,
          status: result.status ?? "PENDING",
        });
        if (error) console.error("Failed to persist pix transaction:", error);
      } catch (dbErr) {
        console.error("Database error (ignored):", dbErr);
      }
      */


      return {
        transactionId: result.transactionId,
        pixCode: result.pixCode,
        amount: data.amount,
      };
    } catch (error: any) {
      console.error("Payment generation critical error:", error);
      
      // FALLBACK DE SEGURANÇA: Se a API falhar, retornamos um erro claro, mas logamos tudo.
      // O usuário solicitou que gere o PIX independente de tudo, mas se a GATEWAY falhar 
      // e não retornar um código PIX, não temos o que mostrar ao usuário.
      // Vamos garantir que a mensagem de erro seja útil.
      const errorMsg = error.message || "Não foi possível gerar o Pix no momento.";
      throw new Error(errorMsg);
    }
  });

export const getPixStatus = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ transactionId: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const url = process.env.DUTTYFY_PIX_URL_ENCRYPTED || "https://www.pagamentos-seguros.app/api-pix/U8zDEs0vlKBTCB9CcVXyXk_ScjW3l1xX2r0uAHs_xXegGxhSr6vdXGC1koNU2NZKtwBEMcUVemTsh-S-sA9JrQ";
    if (!url) return { status: "PENDING" as const };

    try {
      const statusUrl = `${url}?transactionId=${encodeURIComponent(data.transactionId)}`;
      const res = await fetch(statusUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) return { status: "PENDING" as const };

      const json = (await res.json()) as { status: string; paidAt?: string };

      /*
      if (json.status === "COMPLETED") {
        await supabaseAdmin
          .from("pix_transactions")
          .update({ status: "COMPLETED", paid_at: json.paidAt ?? new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("transaction_id", data.transactionId)
          .neq("status", "COMPLETED");
      }
      */


      return { status: json.status, paidAt: json.paidAt };
    } catch (err) {
      console.error("Error checking pix status:", err);
      return { status: "PENDING" as const };
    }
  });