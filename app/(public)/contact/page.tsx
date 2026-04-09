import { Metadata } from "next"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactContent } from "@/components/contact/contact-content"
import { FAQ } from "@/components/contact/faq"

export const metadata: Metadata = {
  title: "Contact Ad Wali Didi | WhatsApp Us for a Free Audit",
  description: "Get a free audit of your Google presence and ad activity. WhatsApp Ad Wali Didi directly — we respond same day.",
  alternates: {
    canonical: '/contact/',
  },
  openGraph: {
    title: 'Contact Ad Wali Didi | WhatsApp Us for a Free Audit',
    description: 'Get a free audit of your Google presence and ad activity. WhatsApp Ad Wali Didi directly — we respond same day.',
    url: '/contact/',
    images: [{ url: 'og-contact.webp', width: 1200, height: 630, alt: 'Contact Ad Wali Didi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Ad Wali Didi | WhatsApp Us for a Free Audit',
    description: 'Get a free audit of your Google presence and ad activity.',
    images: ['og-contact.webp'],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "name": "Contact Ad Wali Didi",
      "description": "Get in touch with Ad Wali Didi for digital marketing services and a free audit.",
      "url": "https://adwalididi.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "Ad Wali Didi",
        "telephone": "+91-6261643774",
        "email": "adwalididi@gmail.com"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://adwalididi.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": "https://adwalididi.com/contact"
        }
      ]
    }
  ]
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactHero />
      <ContactContent />
      <FAQ />
    </>
  )
}
