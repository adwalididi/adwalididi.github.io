"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, TrendingUp } from "lucide-react"

const caseStudies = [
  {
    client: "Travel Startup, India",
    challenge: "Zero online presence. No ads, no Google profile, no creatives.",
    solution: "Built everything from scratch — GBP, Meta ads, full creative suite",
    result: "150+ enquiries in Month 1",
    tags: ["Google Ads", "Meta Ads", "GBP", "Creatives"],
    featured: true,
  },
  {
    client: "Your Business Here",
    challenge: "Good product. Nobody finding it online.",
    solution: "That's what we're here for.",
    result: "Let's find out together",
    tags: ["Coming Soon"],
    featured: false,
  },
]

export function PortfolioPreview() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
            Results That Speak
          </h2>
          <p className="mt-4 text-charcoal/70 text-lg max-w-2xl mx-auto">
            We let the numbers do the talking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl transition-all duration-700 ${
                study.featured 
                  ? 'bg-charcoal text-white' 
                  : 'bg-white border-2 border-dashed border-charcoal/20'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 200 + 200}ms` }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                {study.featured && (
                  <div className="flex items-center gap-2 text-saffron mb-4">
                    <TrendingUp size={20} />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      Featured Result
                    </span>
                  </div>
                )}
                
                <h3 className={`font-[var(--font-syne)] text-xl sm:text-2xl font-bold ${
                  study.featured ? 'text-white' : 'text-charcoal'
                }`}>
                  {study.client}
                </h3>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className={`text-sm font-medium ${study.featured ? 'text-white/60' : 'text-charcoal/50'}`}>
                      Challenge
                    </p>
                    <p className={study.featured ? 'text-white/90' : 'text-charcoal/80'}>
                      {study.challenge}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${study.featured ? 'text-white/60' : 'text-charcoal/50'}`}>
                      What We Did
                    </p>
                    <p className={study.featured ? 'text-white/90' : 'text-charcoal/80'}>
                      {study.solution}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${study.featured ? 'text-white/60' : 'text-charcoal/50'}`}>
                      Result
                    </p>
                    <p className={`font-[var(--font-syne)] text-2xl sm:text-3xl font-bold ${
                      study.featured ? 'text-saffron' : 'text-saffron'
                    }`}>
                      {study.result}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {study.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-sm ${
                        study.featured 
                          ? 'bg-white/10 text-white/80' 
                          : 'bg-charcoal/5 text-charcoal/70'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div 
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-saffron font-semibold hover:gap-4 transition-all"
          >
            View All Case Studies
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
