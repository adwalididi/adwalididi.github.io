import { Metadata } from "next"
import { PortfolioHero } from "@/components/portfolio/portfolio-hero"
import { PortfolioStats } from "@/components/portfolio/portfolio-stats"
import { FeaturedCaseStudy } from "@/components/portfolio/featured-case-study"
import { CaseStudies } from "@/components/portfolio/case-studies"
import { PortfolioCTA } from "@/components/portfolio/portfolio-cta"

export const metadata: Metadata = {
  title: "Our Work & Results | Ad Wali Didi",
  description: "Real results for real businesses. 150+ enquiries for a travel startup, 550 leads for a construction business. See our case studies.",
  alternates: {
    canonical: '/portfolio/',
  },
  openGraph: {
    title: 'Our Work & Results | Ad Wali Didi',
    description: 'Real results for real businesses. 150+ enquiries for a travel startup, 550 leads for a construction business. See our case studies.',
    url: '/portfolio/',
    images: [{ url: 'og-portfolio.webp', width: 1200, height: 630, alt: 'Our Work — Ad Wali Didi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Work & Results | Ad Wali Didi',
    description: 'Real results for real businesses. 150+ enquiries for a travel startup, 550 leads for a construction business.',
    images: ['og-portfolio.webp'],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "name": "Our Work & Results",
      "description": "A collection of case studies and results achieved by Ad Wali Didi for various Indian businesses.",
      "url": "https://adwalididi.com/portfolio",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Travel Startup Case Study"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Construction Business Case Study"
          }
        ]
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
          "name": "Our Work",
          "item": "https://adwalididi.com/portfolio"
        }
      ]
    }
  ]
}

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioHero />
      <PortfolioStats />
      <FeaturedCaseStudy />
      <CaseStudies />
      <PortfolioCTA />
    </>
  )
}
