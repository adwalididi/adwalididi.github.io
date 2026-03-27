"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

const differentiators = [
  "Hum reports nahi, enquiries dete hain",
  "One team handles everything — no briefing three vendors",
  "We've built from zero before. We know what works for small businesses.",
  "You'll always know what's happening and why",
]

export function WhyUs() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-deep-teal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Bold Statement */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {"We don't just run your ads."}
              <span className="block mt-2" style={{ color: '#F5CB5C' }}>
                We think about your business.
              </span>
            </h2>
          </div>

          {/* Right - Differentiators */}
          <div 
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <ul className="space-y-5">
              {differentiators.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-near-black" />
                  </div>
                  <span className="text-white/90 text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
