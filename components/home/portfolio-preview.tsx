"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, TrendingUp } from "lucide-react"

const caseStudies = [
  {
    client: "Mrs. Bhagyashri, Bhurr Holidays",
    challenge: "Zero online presence. No ads, no Google profile, no creatives.",
    solution: "Full-scope engagement — GBP, Ads, Social Media, Influencers, and more",
    result: "150+ enquiries in Month 1",
    tags: ["GBP", "Paid Ads", "Social Media", "Influencers", "Creatives"],
    featured: true,
  },
  {
    client: "Mr. Borse, Jijau Constructions",
    challenge: "No structured digital ad presence.",
    solution: "Built and managed full Meta Ads campaign with in-house creatives over 6 months",
    result: "550+ leads over 6 month campaign",
    tags: ["Meta Ads", "Ad Creatives"],
    featured: true,
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            Results That Speak
          </h2>
          <p className="mt-4 text-muted-text text-lg max-w-2xl mx-auto">
            We let the numbers do the talking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {caseStudies.map((study, index) => {
            const isHighlighted = index === 0
            return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl transition-all duration-700 card-hover-lift ${
                isHighlighted ? 'bg-deep-teal text-white' : 'bg-white'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: `${index * 200 + 200}ms`,
              }}
            >
              <div className="p-6 sm:p-8 lg:p-10 border-teal-border" style={{ border: isHighlighted ? 'none' : '0.5px solid var(--teal-border)' }}>
                {study.featured && (
                  <div className={`flex items-center gap-2 mb-4 ${isHighlighted ? 'text-gold' : 'text-teal'}`}>
                    <TrendingUp size={20} />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      Featured Result
                    </span>
                  </div>
                )}
                
                <h3 className={`font-[var(--font-space-grotesk)] text-xl sm:text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-near-black'}`}>
                  {study.client}
                </h3>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className={`text-sm font-medium ${isHighlighted ? 'text-white/60' : 'text-muted-text'}`}>
                      Challenge
                    </p>
                    <p className={isHighlighted ? 'text-white-85' : 'text-muted-text'}>
                      {study.challenge}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isHighlighted ? 'text-white/60' : 'text-muted-text'}`}>
                      What We Did
                    </p>
                    <p className={isHighlighted ? 'text-white-85' : 'text-muted-text'}>
                      {study.solution}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isHighlighted ? 'text-white/60' : 'text-muted-text'}`}>
                      Result
                    </p>
                    <p className={`font-[var(--font-syne)] text-2xl sm:text-3xl font-bold ${isHighlighted ? 'text-gold' : 'text-teal'}`}>
                      {study.result}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {study.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isHighlighted ? 'bg-white-10 text-white-80' : 'bg-teal-tint text-deep-teal'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            )
          })}
        </div>

        <div 
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/portfolio/"
            className="inline-flex items-center gap-2 text-teal font-semibold hover:text-deep-teal hover:gap-4 transition-all"
          >
            View All Case Studies
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
