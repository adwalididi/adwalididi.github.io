"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Zap, Target } from "lucide-react"
import { CaseStudyGallery } from "./case-study-gallery"

const metrics = [
  { label: "Month 1 Enquiries", value: "150+", icon: TrendingUp },
  { label: "Starting Point", value: "Zero", icon: Zap },
  { label: "Services Used", value: "All 6", icon: Target },
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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`bg-deep-teal rounded-3xl overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="p-6 sm:p-10 lg:p-12">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="bg-gold text-near-black px-4 py-1.5 rounded-full text-sm font-semibold">
                Case Study 01
              </span>
              <span className="text-white/60 text-sm">
                Travel & Tourism
              </span>
            </div>

            {/* Client Name */}
            <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              Bhurr Technologies LLP (Bhurr Holidays)
            </h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {metrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <metric.icon className="w-8 h-8 mb-3" style={{ color: '#F5CB5C' }} />
                  <p className="text-white/60 text-sm mb-1">{metric.label}</p>
                  <p className="font-[var(--font-syne)] text-3xl font-bold" style={{ color: '#F5CB5C' }}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
              </div>

              {/* Gallery Section */}
              <div className="mb-8">
                <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">Visuals</h3>
                <CaseStudyGallery 
                  images={[
                    { src: "/images/bhurr-reel.webp" },
                    { src: "/images/bhurr-app-1.webp" },
                    { src: "/images/bhurr-app-2.webp" },
                    { src: "/images/bhurr-website.webp", spanAll: true },
                  ]} 
                />
              </div>

              <div>
                <h3 className="text-white/60 text-sm font-medium mb-3">The Result</h3>
                <p className="text-white/90 leading-relaxed max-w-4xl">
                  Instagram: 1.7M+ views, 500+ leads. YouTube: 321K short video views, 100K+ long video views, 200+ additional leads. Full-scope engagement across brand identity, social media, influencer marketing, ORM, digital ads, print, and event marketing — all under one agency.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-white/10">
              {["Brand Identity", "Social Media", "Influencer Marketing", "ORM", "Meta Ads", "Google Ads", "GBP", "Ad Creatives", "Print", "Event Marketing"].map((tag, index) => (
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
