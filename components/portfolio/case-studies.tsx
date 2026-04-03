"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Calendar, TrendingUp, Target } from "lucide-react"
import { CaseStudyGallery } from "./case-study-gallery"

const caseStudies = [
  {
    label: "Case Study 02",
    client: "Jijau Construction",
    industry: "Construction & Real Estate",
    services: "Meta Ads + Ad Creatives",
    challenge: "A construction business needed consistent quality leads but had no structured digital ad presence. Their previous efforts were scattered and unmeasured.",
    solution: "Built and managed a full Meta Ads campaign from strategy to execution. Created all ad creatives in-house — designed specifically for the construction audience. Ran and optimised the campaign consistently over 6 months.",
    result: "550 leads over a 6 month campaign period.",
    metrics: [
      { label: "Total Leads Generated", value: "550+", icon: Users },
      { label: "Campaign Duration", value: "6 Months", icon: Calendar },
    ],
    accentColor: "var(--teal)",
    images: [
      { src: "/images/jijau-creative-1.png", label: "Ad Creative" },
      { src: "/images/jijau-creative-2.png", label: "Ad Creative" },
      { src: "/images/jijau-dashboard.webp", label: "Lead Generation Dashboard", spanAll: true },
    ],
  },
  {
    label: "Case Study 03",
    client: "Cowshala",
    industry: "Food & Retail",
    services: "Ad Creatives",
    challenge: "A local dairy business wanted more customers walking into their shop but had no compelling visual presence to attract attention or communicate their offering.",
    solution: "Designed a complete set of ad creatives for the dairy business — visually appealing, locally relevant, and built to drive physical footfall rather than just online engagement.",
    result: "18% month-on-month sales increase. 15% increase in brand awareness. Achieved through Out of Home advertising creatives designed and executed in-house.",
    metrics: [
      { label: "MoM Sales Growth", value: "18%", icon: TrendingUp },
      { label: "Brand Awareness Increase", value: "15%", icon: Target },
    ],
    accentColor: "var(--ocean-blue)",
    images: [
      { src: "/images/cowshala-creative-1.webp", label: "Milk Bottle Ad Creative" },
      { src: "/images/cowshala-creative-2.webp", label: "Product Display Ad" },
      { src: "/images/cowshala-creative-3.webp", label: "Store Promotion Visual" },
      { src: "/images/cowshala-creative-4.png", label: "Ad Creative" },
    ],
  },
  {
    label: "Case Study 04",
    client: "Sponsor Representation (Events)",
    industry: "Events & Sponsorship",
    services: "Event Marketing, Print Advertising, OOH",
    challenge: "A brand sponsoring major public events needed to maximize their visibility and engage attendees effectively on-ground.",
    solution: "Represented a key sponsor at two Pune events — Sakal Tourism Expo and Lokmat Maha Marathon. Managed their entire on-ground presence, stall branding, and marketing collateral.",
    result: "Successfully managed high-visibility sponsor presence and on-ground engagement at events with 20,000+ total attendees.",
    metrics: [
      { label: "Total Attendees", value: "20,000+", icon: Users },
      { label: "Sponsorships Managed", value: "2 Major", icon: Calendar },
    ],
    accentColor: "var(--gold)",
    images: [
      { src: "/images/Newspaper-1.webp", label: "Newspaper Coverage" },
      { src: "/images/Newspaper-2.webp", label: "Newspaper Coverage" },
      { src: "/images/Event-1.webp", label: "Event Stalls Branding" },
      { src: "/images/Event-2.webp", label: "On-ground Engagement Activity" },
      { src: "/images/Event-3.webp", label: "Main Event Branding Area", spanAll: true },
      { src: "/images/Event-4.webp", label: "Event Presence" },
      { src: "/images/Event-5.webp", label: "Event Presence" },
      { src: "/images/Event-6.webp", label: "Event Presence" },
      { src: "/images/Event-7.webp", label: "Event Presence" },
      { src: "/images/Event-8.webp", label: "Event Presence" },
    ],
  },
]

export function CaseStudies() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {caseStudies.map((caseStudy, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm transition-all duration-700 border border-teal-border ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span 
                    className="px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: `color-mix(in srgb, ${caseStudy.accentColor}, transparent 85%)`, color: caseStudy.accentColor }}
                  >
                    {caseStudy.label}
                  </span>
                  <span className="text-muted-text text-sm">
                    {caseStudy.industry}
                  </span>
                </div>

                {/* Client & Service */}
                <h3 className="font-[var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-near-black mb-2">
                  {caseStudy.client}
                </h3>
                <p className="font-medium mb-6" style={{ color: caseStudy.accentColor }}>
                  {caseStudy.services}
                </p>

                {/* Content Sections */}
                <div className="space-y-8">
                  {/* Row 1: Challenge & Solution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Challenge */}
                    <div>
                      <h4 className="font-semibold text-near-black mb-2">The Challenge</h4>
                      <p className="text-muted-text leading-relaxed">{caseStudy.challenge}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <h4 className="font-semibold text-near-black mb-2">What We Did</h4>
                      <p className="text-muted-text leading-relaxed">{caseStudy.solution}</p>
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div>
                    <h4 className="font-semibold text-near-black mb-4">Case Study Visuals</h4>
                    <CaseStudyGallery images={caseStudy.images} />
                  </div>

                  {/* Row 3: Result */}
                  <div>
                    <h4 className="font-semibold text-near-black mb-2">The Result</h4>
                    <p className="text-muted-text leading-relaxed max-w-4xl">{caseStudy.result}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className={`mt-8 pt-6 grid grid-cols-2 gap-4 border-t border-teal-border ${
                  caseStudy.metrics.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 max-w-md'
                }`}>
                  {caseStudy.metrics.map((metric, metricIndex) => {
                    const IconComponent = metric.icon
                    return (
                      <div key={metricIndex} className="flex items-center gap-3">
                        <div 
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `color-mix(in srgb, ${caseStudy.accentColor}, transparent 85%)` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: caseStudy.accentColor }} aria-hidden="true" />
                        </div>
                        <div>
                          <p 
                            className="font-[var(--font-syne)] font-bold text-lg"
                            style={{ color: caseStudy.accentColor }}
                          >
                            {metric.value}
                          </p>
                          <p className="text-muted-text text-xs">{metric.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
