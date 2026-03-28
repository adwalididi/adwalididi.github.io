"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Building2, Star } from "lucide-react"

const metrics = [
  { icon: Users, value: "2,000+", label: "Total Leads & Views Generated", color: "#008573" },
  { icon: Building2, value: "5+", label: "Industries Served", color: "#107D98" },
  { icon: Star, value: "100%", label: "Client Retention", color: "#dbad3e" },
]

export function PortfolioStats() {
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
    <section ref={sectionRef} className="py-10 sm:py-14 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-center mb-3">
                <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
              </div>
              <p
                className="font-[var(--font-syne)] text-2xl sm:text-4xl font-bold"
                style={{ color: metric.color }}
              >
                {metric.value}
              </p>
              <p className="text-muted-text text-xs sm:text-sm mt-1">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
