import { Metadata } from "next"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactContent } from "@/components/contact/contact-content"
import { FAQ } from "@/components/contact/faq"

export const metadata: Metadata = {
  title: "Contact Us | Ad Wali Didi",
  description: "Baat karte hain — no jargon, no pressure. WhatsApp us directly for a straightforward conversation about your business.",
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactContent />
      <FAQ />
    </>
  )
}
