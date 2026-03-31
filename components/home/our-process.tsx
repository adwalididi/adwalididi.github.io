"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Rocket, TrendingUp } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "We Audit",
    description: "We look at your complete digital presence — from Google & ads to social media and content — then tell you what's missing.",
    accentColor: "#008573",
  },
  {
    number: "02",
    icon: Rocket,
    title: "We Build",
    description: "We set up your entire marketing ecosystem — profiles, ads, content, and strategy — all in one shot, no coordination needed.",
    accentColor: "#107D98",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "You Grow",
    description: "Enquiries start coming in. We optimise, report, and keep improving — you focus on running your business.",
    accentColor: "#dbad3e",
  },
]

export function OurProcess() {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            How It Works
          </h2>
          <p className="mt-4 text-muted-text text-lg max-w-2xl mx-auto">
            Three simple steps. Zero confusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-[2px] bg-teal-border z-0" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative z-10 text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200 + 200}ms` }}
            >
              {/* Number circle */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center bg-white border-2"
                  style={{ borderColor: step.accentColor }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.accentColor }} />
                </div>
              </div>

              {/* Step number */}
              <p 
                className="text-sm font-bold tracking-widest uppercase mb-2"
                style={{ color: step.accentColor }}
              >
                Step {step.number}
              </p>

              {/* Title */}
              <h3 className="font-[var(--font-syne)] text-xl sm:text-2xl font-bold text-near-black mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-text leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
