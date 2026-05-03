import dynamic from "next/dynamic"
import { HeroSection } from "@/components/home/hero-section"
import { StatsBar } from "@/components/home/stats-bar"
import { ServicesOverview } from "@/components/home/services-overview"
import { OurProcess } from "@/components/home/our-process"

const WhyUs = dynamic(() => import("@/components/home/why-us").then(mod => mod.WhyUs))
const PortfolioPreview = dynamic(() => import("@/components/home/portfolio-preview").then(mod => mod.PortfolioPreview))
const GoogleReviews = dynamic(() => import("@/components/home/google-reviews").then(mod => mod.GoogleReviews))
// Client wrapper handles ssr:false — required for Next.js 16 Server Components
import { LeadFormWrapper } from "@/components/home/lead-form-wrapper"
const FaqSection = dynamic(() => import("@/components/home/faq-section").then(mod => mod.FaqSection))
const Testimonial = dynamic(() => import("@/components/home/testimonial").then(mod => mod.Testimonial))
const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection))


// FAQPage schema — enables rich snippets in Google Search results
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much do Meta Ads cost for a small business in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can start Meta Ads with as little as ₹200–₹500 per day. For most small businesses, we recommend ₹10,000/month in ad spend alongside our management fee (starting ₹10,000/month). We've generated 550+ leads for a construction company over 6 months with optimised spend."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take for a Google Business Profile to rank?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "With proper optimisation — complete profile, regular posts, active reviews, and correct keyword placement — most businesses see improvement in local search visibility within 4–8 weeks. Competitive categories may take 2–3 months."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need Google Ads or Meta Ads for my business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Google Ads works best when people actively search for your service (e.g. 'dentist near me', 'travel agency Pune'). Meta Ads work better for reaching people before they know they want something. We always start with what moves fastest for your specific business."
      }
    },
    {
      "@type": "Question",
      "name": "What is a Google Business Profile and why does my business need it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Google Business Profile is your free listing in Google Search and Maps. If it's incomplete or has bad reviews, you lose customers to competitors. We handle complete setup, regular posts, review management, and monthly reporting."
      }
    },
    {
      "@type": "Question",
      "name": "How many enquiries can I realistically expect from digital marketing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We generated 150+ enquiries in Month 1 for a travel startup and 550+ leads over 6 months for a construction company. Results vary by business type and budget. Our free audit gives you a realistic picture."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work with businesses outside Maharashtra?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We're based in Maharashtra but work with businesses across India. Since our core services are digital, location is no barrier."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum budget needed to start digital marketing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Google Business Profile management starts at ₹3,000/month. Paid ads management starts at ₹10,000/month plus ad spend (minimum ₹5,000/month recommended). We advise the right budget during your free audit."
      }
    },
    {
      "@type": "Question",
      "name": "Can you handle ads, Google profile, and creatives all together?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — one team handles everything: ads, creatives, and profile management. No multiple vendors, no coordination headache for you."
      }
    }
  ]
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <StatsBar />
      <ServicesOverview />
      <OurProcess />
      <WhyUs />
      <PortfolioPreview />
      <GoogleReviews />
      <LeadFormWrapper />
      <FaqSection />
      <Testimonial />
      <CTASection />

    </>
  )
}
