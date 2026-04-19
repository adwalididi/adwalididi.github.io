export async function getIpHash(): Promise<string | null> {
  try {
    const res = await fetch("https://api.ipify.org?format=json")
    const { ip } = await res.json()
    const data = new TextEncoder().encode(ip + "awd_lead_salt_9x2k")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  } catch { return null }
}

export function fireLeadPixelEvent(businessType: string) {
  try {
    const consent = JSON.parse(localStorage.getItem("cookie_consent") || "{}")
    if (consent.ad_storage === "granted" && typeof window !== "undefined") {
      const fbq = (window as unknown as { fbq: (...args: unknown[]) => void }).fbq
      if (typeof fbq === "function") fbq("track", "Lead", { content_category: businessType })
    }
  } catch {}
}
