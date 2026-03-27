"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Layers, Heart } from "lucide-react"

const differentiators = [
  {
    icon: Users,
    title: "Direct Access, Always",
    description: "We're not a 50-person agency with a client servicing team you'll never meet. You work with us directly. We know your business, we think about your business, and we care whether it's working.",
  },
  {
    icon: Layers,
    title: "One System, Not Three",
    description: "We handle Google Business Profile, paid ads, and creatives — together, not separately. Because the three things need to work as one system, not three different briefs sent to three different people.",
  },
  {
    icon: Heart,
    title: "Honest, Always",
    description: "If something isn't working, we'll tell you. If we don't think ads are the right move for you right now, we'll say that too. We'd rather lose a client than take money we haven't earned.",
  },
]

export function WhatMakesUsDifferent() {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            What Makes Us Different
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 150 + 200}ms`,
                border: '0.5px solid #C8E8E3',
              }}
            >
              <div className="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-teal" />
              </div>
              <h3 className="font-[var(--font-syne)] text-xl font-bold text-near-black mb-3">
                {item.title}
              </h3>
              <p className="text-muted-text leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
