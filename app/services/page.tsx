import { Metadata } from "next"
import { ServicesHero } from "@/components/services/services-hero"
import { ServiceDetail } from "@/components/services/service-detail"
import { FullPackage } from "@/components/services/full-package"

export const metadata: Metadata = {
  title: "Services | Ad Wali Didi",
  description: "Google Business Profile management, Meta & Google Ads, and Ad Creatives. Three services that work together to grow your business.",
}

const services = [
  {
    id: "gbp",
    title: "Google Business Profile",
    headline: "Your Google Profile Is Either Working For You Or Against You",
    description: "When someone searches for your type of business in your city, your Google profile is the first thing they see. If it's incomplete, has few reviews, bad photos, or wrong information — they'll call your competitor instead.",
    features: [
      "Setup and complete optimisation of your GBP listing",
      "Regular posts to keep your profile active and visible",
      "Review management strategy",
      "Photo updates and business description",
      "Keyword placement so you rank higher in local searches",
      "Q&A management",
      "Monthly reporting on views, calls, and direction requests",
    ],
    bestFor: "Local service businesses — clinics, salons, gyms, restaurants, travel agencies, coaching institutes, contractors",
    color: "saffron" as const,
  },
  {
    id: "ads",
    title: "Paid Ads (Meta + Google)",
    headline: "Ads That Bring Enquiries, Not Just Impressions",
    description: "A lot of businesses run ads. Most of them don't know if they're working. We fix that. We run Meta Ads and Google Ads — not both at once unless it makes sense for your business. We start with what will work fastest, prove it, then scale.",
    features: [
      "Ad strategy and platform selection",
      "Audience research and targeting",
      "Campaign setup and launch",
      "Ongoing optimisation",
      "Creative briefs (we handle this too — see below)",
      "Weekly performance check-ins",
      "Monthly reporting in plain language, not dashboard screenshots",
    ],
    bestFor: "Businesses with a product or service people search for or can be targeted by interest — travel agencies, e-commerce, clinics, gyms, real estate, courses",
    color: "plum" as const,
  },
  {
    id: "creatives",
    title: "Ad Creatives",
    headline: "Your Ad Is Only As Good As What People See",
    description: "Most agencies outsource design. Most design studios don't understand performance. We do both — which means your creatives are built to convert, not just to look nice in a portfolio.",
    features: [
      "Static ad designs for Meta and Google Display",
      "Carousel and story formats",
      "Reels and video ad concepts",
      "Copy and headline writing",
      "A/B creative variations for testing",
      "On-brand consistency across all formats",
    ],
    bestFor: "Any business running or planning to run paid ads — works as a standalone service or paired with our ads management",
    color: "charcoal" as const,
  },
]

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <div className="divide-y divide-border">
        {services.map((service, index) => (
          <ServiceDetail
            key={service.id}
            service={service}
            index={index}
          />
        ))}
      </div>
      <FullPackage />
    </>
  )
}
