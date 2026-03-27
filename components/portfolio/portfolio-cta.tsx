"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-deep-teal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(219,173,62,0.25)' }}>
            <Search className="w-8 h-8" style={{ color: '#F5CB5C' }} />
          </div>
          
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Want Results Like These?
          </h2>
          
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            We offer a free audit — we&apos;ll look at your current Google presence and ad activity and tell you exactly where you&apos;re losing enquiries.
          </p>
          
          <a
            href="https://wa.me/916261643774?text=Hi!%20I%20saw%20your%20portfolio%20and%20I'm%20interested%20in%20getting%20a%20Free%20Audit%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-gold text-near-black px-8 py-4 rounded-full font-medium text-lg hover:bg-[#c49b2e] transition-all hover:scale-105 shadow-lg mt-8 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <WhatsAppIcon size={20} />
            WhatsApp for a Free Audit
          </a>
        </div>
      </div>
    </section>
  )
}
