"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { MapPin, Target, Palette, ArrowRight } from "lucide-react"

const services = [
  {
    icon: MapPin,
    title: "Google Business Profile",
    tagline: "Show Up Where It Matters",
    description: "Most local businesses have incomplete, ignored Google profiles — and wonder why enquiries aren't coming. We set it up, optimise it, manage it, and make sure you show up when customers are searching.",
    accentColor: "#008573",
    titleColor: "#005C4E",
    borderColor: "#C8E8E3",
  },
  {
    icon: Target,
    title: "Paid Ads (Meta + Google)",
    tagline: "Ads That Actually Work",
    description: "Running ads is easy. Running ads that bring real enquiries is not. We plan, launch, and manage your Meta and Google campaigns — with strategy, not guesswork.",
    accentColor: "#107D98",
    titleColor: "#0A5F74",
    borderColor: "#B8D8E8",
  },
  {
    icon: Palette,
    title: "Ad Creatives",
    tagline: "Scroll-Stopping Visuals",
    description: "Bad creatives waste good budgets. We design ads that look sharp, communicate clearly, and make people stop and take action. No generic templates. No stock photo vibes.",
    accentColor: "#dbad3e",
    titleColor: "#9A7A1A",
    borderColor: "#EDD98A",
  },
]

export function ServicesOverview() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-teal-tint">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            What We Do Best
          </h2>
          <p className="mt-4 text-muted-text text-lg max-w-2xl mx-auto">
            Three services that work together to get your business found, trusted, and chosen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 150 + 200}ms`,
                border: `0.5px solid ${service.borderColor}`,
                borderTop: `3px solid ${service.accentColor}`,
              }}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors"
                style={{ backgroundColor: `${service.accentColor}15` }}
              >
                <service.icon className="w-7 h-7" style={{ color: service.accentColor }} />
              </div>
              <h3 
                className="font-[var(--font-syne)] text-xl sm:text-2xl font-bold"
                style={{ color: service.titleColor }}
              >
                {service.tagline}
              </h3>
              <p className="font-medium text-sm mt-1 mb-4" style={{ color: service.accentColor }}>
                {service.title}
              </p>
              <p className="text-muted-text leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div 
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-teal font-semibold hover:text-deep-teal hover:gap-4 transition-all"
          >
            Explore All Services
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
