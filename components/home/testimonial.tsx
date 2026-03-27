"use client"

import { useEffect, useRef, useState } from "react"
import { Quote } from "lucide-react"

export function Testimonial() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-teal-tint">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-full mb-8">
            <Quote className="w-8 h-8 text-teal" />
          </div>
          
          <blockquote className="font-[var(--font-syne)] text-xl sm:text-2xl lg:text-3xl text-near-black leading-relaxed">
            {"\"I had no idea our Google profile was costing us customers. Ad Wali Didi fixed everything and within weeks we were getting calls we never got before. The best part — I didn't have to explain anything twice.\""}
          </blockquote>
          
          <div className="mt-8">
            <p className="font-semibold text-near-black">Travel Agency Client</p>
            <p className="text-muted-text">India</p>
          </div>
        </div>
      </div>
    </section>
  )
}
