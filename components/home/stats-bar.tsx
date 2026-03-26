"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  {
    number: "150+",
    text: "Enquiries generated for a travel startup in their very first month",
  },
  {
    number: "3",
    text: "Services. 1 Agency. Zero coordination headache.",
  },
  {
    number: "Zero",
    text: "to fully visible — that's our specialty",
  },
]

export function StatsBar() {
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
    <section ref={sectionRef} className="bg-charcoal py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center md:text-left transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="font-[var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-saffron">
                {stat.number}
              </div>
              <p className="mt-3 text-white/80 text-base sm:text-lg">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
