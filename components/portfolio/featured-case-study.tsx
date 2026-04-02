"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Zap, Target } from "lucide-react"
import { CaseStudyGallery } from "./case-study-gallery"
import { m } from "framer-motion"

const metrics = [
  { label: "Month 1 Enquiries", value: "150+", icon: TrendingUp },
  { label: "Starting Point", value: "Zero", icon: Zap },
  { label: "Services Used", value: "All 6", icon: Target },
]

export function FeaturedCaseStudy() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div 
          className="bg-deep-teal rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
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
                <m.div 
                  key={index} 
                  className="bg-white-10 rounded-xl p-6 border border-white-10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <metric.icon className="w-8 h-8 mb-3 text-bright-gold" aria-hidden="true" />
                  <p className="text-white-85 text-sm mb-1">{metric.label}</p>
                  <p className="font-[var(--font-syne)] text-3xl font-bold text-bright-gold">
                    {metric.value}
                  </p>
                </m.div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="pt-8 border-t border-white-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">The Challenge</h3>
                  <p className="text-white-90 leading-relaxed">
                    A travel startup came to us with zero online presence. No website visibility, no Google profile, no ads, no creatives. They had great packages but nobody was finding them.
                  </p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">What We Did</h3>
                  <p className="text-white-90 leading-relaxed">
                    Set up and fully optimised their Google Business Profile from scratch. Built their Meta and Google ad campaigns. Designed all creatives in-house so the ads were consistent, sharp, and on-brand.
                  </p>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="mb-8">
                <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Visuals</h3>
                <CaseStudyGallery 
                  images={[
                    { src: "/images/bhurr-reel.webp", label: "Example Reel Performance" },
                    { src: "/images/bhurr-app-1.webp", label: "App UI Preview 1" },
                    { src: "/images/bhurr-app-2.webp", label: "App UI Preview 2" },
                    { src: "/images/bhurr-website.webp", label: "Bhurr Official Website Landing Page", spanAll: true },
                  ]} 
                />
              </div>

              <div>
                <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">The Result</h3>
                <p className="text-white-90 leading-relaxed max-w-4xl">
                  Instagram: 1.7M+ views, 500+ leads. YouTube: 321K short video views, 100K+ long video views, 200+ additional leads. Full-scope engagement across brand identity, social media, influencer marketing, ORM, digital ads, print, and event marketing — all under one agency.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-white-10">
              {["Brand Identity", "Social Media", "Influencer Marketing", "ORM", "Meta Ads", "Google Ads", "GBP", "Ad Creatives", "Print", "Event Marketing"].map((tag, index) => (
                <span 
                  key={index}
                  className="bg-white-10 text-white-80 px-4 py-2 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
