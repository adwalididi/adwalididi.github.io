import { Metadata } from "next"
import { ServicesHero } from "@/components/services/services-hero"
import { ServiceTabs } from "@/components/services/service-tabs"
import { ServiceDetail } from "@/components/services/service-detail"
import { FullPackage } from "@/components/services/full-package"

export const metadata: Metadata = {
  title: "Our Services | Google Ads, Meta Ads & GBP Management — Ad Wali Didi",
  description: "Google Business Profile management, Meta Ads, Google Ads and Ad Creatives for Indian small businesses. One agency, three services, zero coordination headache.",
  alternates: {
    canonical: '/services/',
  },
  openGraph: {
    title: 'Our Services | Google Ads, Meta Ads & GBP Management — Ad Wali Didi',
    description: 'Google Business Profile management, Meta Ads, Google Ads and Ad Creatives for Indian small businesses. One agency, three services, zero coordination headache.',
    url: '/services/',
    images: [{ url: 'og-services.webp', width: 1200, height: 630, alt: 'Our Services — Ad Wali Didi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Google Ads, Meta Ads & GBP Management — Ad Wali Didi',
    description: 'Google Business Profile management, Meta Ads, Google Ads and Ad Creatives for Indian small businesses.',
    images: ['og-services.webp'],
  },
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
    pricing: "Starting from ₹3,000/month",
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
    pricing: "Starting from ₹5,000/month + ad spend",
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
    pricing: "Starting from ₹2,500 for a creative set",
  },
  {
    id: "social",
    title: "Social Media Marketing",
    headline: "Consistent Presence Without the Daily Hustle",
    description: "Strategic content creation and community management to build brand presence and engagement on Instagram and Facebook. We handle the grid so you can handle the business.",
    features: [
      "Monthly content calendars and strategy planning",
      "High-quality post and reel production",
      "Grid aesthetics and visual identity management",
      "Caption writing and hashtag strategy",
      "Community engagement and direct message handling",
    ],
    bestFor: "Businesses wanting consistent organic presence, brand recall, and audience engagement alongside paid ads.",
    color: "coral" as const,
    pricing: "Starting from ₹4,000/month",
  },
  {
    id: "influencer",
    title: "Influencer Marketing",
    headline: "Reach Hidden Audiences Through Trusted Voices",
    description: "Collaborating with trusted creators to reach targeted audiences and build brand credibility. We identify, brief, and manage creators relevant to your industry and location.",
    features: [
      "Creator identification and vetting",
      "Rate negotiation and contract handling",
      "Detailed campaign briefs and brand messaging alignment",
      "Content review and approval cycles",
      "Post-campaign performance reporting",
    ],
    bestFor: "Consumer brands, food businesses, travel, lifestyle, and any business targeting younger urban audiences.",
    color: "azure" as const,
    pricing: "Starting from ₹8,000/campaign",
  },
  {
    id: "ooh",
    title: "Outdoor Advertising (OOH)",
    headline: "Dominate Your Local Streets and High-Footfall Zones",
    description: "Strategic placement of banners, hoardings, and physical media to maximise local brand visibility. We handle design and coordinate placement.",
    features: [
      "High-visibility location scouting",
      "Vendor negotiation and management",
      "Signage and hoarding design",
      "Print production coordination",
      "Placement verification and monitoring",
    ],
    bestFor: "Local business wanting high-visibility presence in specific areas — events, high-footfall zones, competitor locations.",
    color: "sage" as const,
    pricing: "Starting from ₹5,000",
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "name": "Google Business Profile Management",
      "provider": { "@id": "https://adwalididi.com/#organization" },
      "description": "Complete setup and ongoing optimisation for your Google local listings to increase visibility and calls.",
      "areaServed": { "@type": "Country", "name": "India" }
    },
    {
      "@type": "Service",
      "name": "Paid Ads Management (Meta + Google)",
      "provider": { "@id": "https://adwalididi.com/#organization" },
      "description": "High-performance advertising campaigns on Google and Meta platforms focused on ROI and enquiry generation.",
      "areaServed": { "@type": "Country", "name": "India" }
    },
    {
      "@type": "Service",
      "name": "Ad Creative Design",
      "provider": { "@id": "https://adwalididi.com/#organization" },
      "description": "Custom-designed high-converting creative assets for digital advertising campaigns.",
      "areaServed": { "@type": "Country", "name": "India" }
    },
    {
      "@type": "Service",
      "name": "Social Media Marketing",
      "provider": { "@id": "https://adwalididi.com/#organization" },
      "description": "Monthly content strategy and engagement management to build brand presence on Instagram and Facebook.",
      "areaServed": { "@type": "Country", "name": "India" }
    },
    {
      "@type": "Service",
      "name": "Influencer Marketing",
      "provider": { "@id": "https://adwalididi.com/#organization" },
      "description": "Identifying and managing trusted local creators to reach hidden audiences and build credibility.",
      "areaServed": { "@type": "Country", "name": "India" }
    },
    {
      "@type": "Service",
      "name": "Outdoor Advertising (OOH)",
      "provider": { "@id": "https://adwalididi.com/#organization" },
      "description": "Strategic placement of physical media and hoardings in high-footfall areas for local dominance.",
      "areaServed": { "@type": "Country", "name": "India" }
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
          "name": "Services",
          "item": "https://adwalididi.com/services"
        }
      ]
    }
  ]
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesHero />
      <ServiceTabs />
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
