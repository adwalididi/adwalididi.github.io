export interface GeoData {
  country?: string | null
  country_code?: string | null
  city?: string | null
  region?: string | null
  /** IP-based latitude from Cloudflare / ipapi.co */
  latitude?: number | null
  /** IP-based longitude from Cloudflare / ipapi.co */
  longitude?: number | null
  /** Precise GPS latitude — only set when browser permission was already granted */
  precise_latitude?: number | null
  /** Precise GPS longitude — only set when browser permission was already granted */
  precise_longitude?: number | null
  /** 'granted' | 'prompt' | 'denied' | 'unavailable' */
  geo_permission?: string | null
}

/**
 * Silently collects visitor location data — zero popups.
 *  1. Calls /api/geo → Cloudflare headers + ipapi.co enrichment
 *  2. Checks Permissions API; if already granted, reads GPS quietly
 */
export async function getGeoData(): Promise<GeoData> {
  const geoData: GeoData = {}

  // ── 1. IP-based location via our edge route ──
  try {
    const res = await fetch("/api/geo", { signal: AbortSignal.timeout(5000) })
    if (res.ok) {
      const data = (await res.json()) as GeoData
      geoData.country      = data.country      ?? null
      geoData.country_code = data.country_code ?? null
      geoData.city         = data.city         ?? null
      geoData.region       = data.region       ?? null
      geoData.latitude     = data.latitude     ?? null
      geoData.longitude    = data.longitude    ?? null
    }
  } catch { /* silent */ }

  // ── 2. GPS — only if browser permission is already granted (no popup) ──
  try {
    if (
      typeof navigator !== "undefined" &&
      "permissions" in navigator &&
      "geolocation" in navigator
    ) {
      const perm = await navigator.permissions.query({ name: "geolocation" })
      geoData.geo_permission = perm.state

      if (perm.state === "granted") {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout:        5000,
            maximumAge:   300_000, // cache up to 5 min
            enableHighAccuracy: false,
          })
        })
        geoData.precise_latitude  = position.coords.latitude
        geoData.precise_longitude = position.coords.longitude
      }
    } else {
      geoData.geo_permission = "unavailable"
    }
  } catch { /* silent */ }

  return geoData
}

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
