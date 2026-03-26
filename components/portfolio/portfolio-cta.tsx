"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Search } from "lucide-react"

export function PortfolioCTA() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-plum">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-saffron/20 rounded-full mb-6">
            <Search className="w-8 h-8 text-saffron" />
          </div>
          
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Want Results Like These?
          </h2>
          
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            We offer a free audit — we&apos;ll look at your current Google presence and ad activity and tell you exactly where you&apos;re losing enquiries.
          </p>
          
          <a
            href="https://wa.me/916261643774"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-saffron text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-saffron/90 transition-all hover:scale-105 shadow-lg shadow-saffron/25 mt-8 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <MessageCircle size={22} />
            WhatsApp for a Free Audit
          </a>
        </div>
      </div>
    </section>
  )
}
