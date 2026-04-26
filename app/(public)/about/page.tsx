import { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { OurStory } from "@/components/about/our-story"
import { WhatMakesUsDifferent } from "@/components/about/what-makes-us-different"
import { AboutCTA } from "@/components/about/about-cta"

export const metadata: Metadata = {
  title: "About Us | Ad Wali Didi — Indian Digital Marketing Agency",
  description: "Ad Wali Didi started to help Indian small businesses become visible online. Our story, our approach, and why we do this.",
  alternates: {
    canonical: '/about/',
  },
  openGraph: {
    title: 'About Us | Ad Wali Didi — Indian Digital Marketing Agency',
    description: 'Ad Wali Didi started to help Indian small businesses become visible online. Our story, our approach, and why we do this.',
    url: '/about/',
    images: [{ url: '/og-about.webp', width: 1200, height: 630, alt: 'About Ad Wali Didi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Ad Wali Didi — Indian Digital Marketing Agency',
    description: 'Ad Wali Didi started to help Indian small businesses become visible online. Our story, our approach, and why we do this.',
    images: ['/og-about.webp'],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "name": "About Ad Wali Didi",
      "description": "Information about Ad Wali Didi, a digital marketing agency for Indian small businesses.",
      "url": "https://adwalididi.com/about",
      "mainEntity": {
        "@id": "https://adwalididi.com/#organization"
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
          "name": "About",
          "item": "https://adwalididi.com/about"
        }
      ]
    }
  ]
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutHero />
      <OurStory />
      <WhatMakesUsDifferent />
      <AboutCTA />
    </>
  )
}
