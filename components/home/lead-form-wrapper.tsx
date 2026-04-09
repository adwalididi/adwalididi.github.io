"use client"

/**
 * Client-side wrapper for LeadForm.
 * Required because `ssr: false` is only allowed in Client Components in Next.js 16+.
 * The LeadForm itself uses window.location for UTM params, making SSR unsafe.
 */
import dynamic from "next/dynamic"

const LeadForm = dynamic(
  () => import("@/components/home/lead-form").then((mod) => mod.LeadForm),
  { ssr: false }
)

export function LeadFormWrapper() {
  return <LeadForm />
}
