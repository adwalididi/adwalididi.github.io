"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Zap, Target } from "lucide-react"

const metrics = [
  { label: "Month 1 Enquiries", value: "150+", icon: TrendingUp },
  { label: "Starting Point", value: "Zero", icon: Zap },
  { label: "Services Used", value: "All 3", icon: Target },
]

export function FeaturedCaseStudy() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`bg-charcoal rounded-3xl overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="p-6 sm:p-10 lg:p-12">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="bg-saffron text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                Case Study 01
              </span>
              <span className="text-white/60 text-sm">
                Travel & Tourism
              </span>
            </div>

            {/* Client Name */}
            <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              Travel Startup — India
            </h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {metrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <metric.icon className="w-8 h-8 text-saffron mb-3" />
                  <p className="text-white/60 text-sm mb-1">{metric.label}</p>
                  <p className="font-[var(--font-syne)] text-3xl font-bold text-saffron">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <h3 className="text-white/60 text-sm font-medium mb-3">The Challenge</h3>
                <p className="text-white/90 leading-relaxed">
                  A travel startup came to us with zero online presence. No website visibility, no Google profile, no ads, no creatives. They had great packages but nobody was finding them.
                </p>
              </div>
              <div>
                <h3 className="text-white/60 text-sm font-medium mb-3">What We Did</h3>
                <p className="text-white/90 leading-relaxed">
                  Set up and fully optimised their Google Business Profile from scratch. Built their Meta and Google ad campaigns. Designed all creatives in-house so the ads were consistent, sharp, and on-brand.
                </p>
              </div>
              <div>
                <h3 className="text-white/60 text-sm font-medium mb-3">The Result</h3>
                <p className="text-white/90 leading-relaxed">
                  150+ enquiries in their very first month. Managed everything end to end — they didn&apos;t have to brief anyone or manage multiple vendors.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-white/10">
              {["Google Business Profile", "Meta Ads", "Google Ads", "Ad Creatives"].map((tag, index) => (
                <span 
                  key={index}
                  className="bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
