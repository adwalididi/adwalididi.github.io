"use client"

import { useEffect, useRef, useState } from "react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function CTASection() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-teal-tint overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            Zyada enquiries chahiye?
          </h2>
          <p className="mt-4 text-muted-text text-lg max-w-2xl mx-auto">
            No lengthy proposals. No confusing jargon. Just a conversation about your business and what we can do.
          </p>
          
          <a
            href="https://wa.me/916261643774?text=Hi!%20I'm%20interested%20in%20your%20digital%20marketing%20services.%20Let's%20talk!"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-teal text-white px-8 py-4 rounded-xl font-medium text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg mt-8 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <WhatsAppIcon className="w-6 h-6 sm:w-5 sm:h-5 shrink-0" />
            {"WhatsApp Karo — Get a Free Audit"}
          </a>
        </div>
      </div>
    </section>
  )
}
