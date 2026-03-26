"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle } from "lucide-react"

export function AboutCTA() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-relaxed">
            Aapki growth, humari responsibility.
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
            Baat Karte Hain — WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
