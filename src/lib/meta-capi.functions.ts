import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

const PIXEL_ID = "2239303623540622";
const API_VERSION = "v21.0";

type CapiInput = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
};

async function sha256(value: string) {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Meta Conversions API (integração direta).
 * Envia eventos server-side com o mesmo event_id do Pixel para deduplicação.
 */
export const sendMetaEvent = createServerFn({ method: "POST" })
  .inputValidator((data: CapiInput) => {
    if (!data || typeof data.eventName !== "string" || typeof data.eventId !== "string") {
      throw new Error("Invalid event payload");
    }
    return {
      eventName: data.eventName.slice(0, 100),
      eventId: data.eventId.slice(0, 200),
      eventSourceUrl: data.eventSourceUrl?.slice(0, 2000),
    };
  })
  .handler(async ({ data }) => {
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!accessToken) {
      return { ok: false, error: "missing_token" };
    }

    let ip: string | undefined;
    try {
      ip = getRequestIP({ xForwardedFor: true });
    } catch {
      ip = undefined;
    }
    const userAgent = getRequestHeader("user-agent") ?? undefined;

    const userData: Record<string, unknown> = {};
    if (ip) userData.client_ip_address = ip;
    if (userAgent) userData.client_user_agent = userAgent;

    const payload = {
      data: [
        {
          event_name: data.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.eventId,
          action_source: "website",
          event_source_url: data.eventSourceUrl,
          user_data: userData,
        },
      ],
    };

    try {
      const res = await fetch(
        `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Meta CAPI error:", res.status, text);
        return { ok: false, error: `status_${res.status}` };
      }
      return { ok: true };
    } catch (error) {
      console.error("Meta CAPI request failed:", error);
      return { ok: false, error: "request_failed" };
    }
  });