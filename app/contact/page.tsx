import { Metadata } from "next"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactContent } from "@/components/contact/contact-content"
import { FAQ } from "@/components/contact/faq"

export const metadata: Metadata = {
  title: "Contact Ad Wali Didi | WhatsApp Us for a Free Audit",
  description: "Get a free audit of your Google presence and ad activity. WhatsApp Ad Wali Didi directly — we respond same day.",
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
