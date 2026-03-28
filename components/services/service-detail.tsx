"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

interface ServiceDetailProps {
  service: {
    id: string
    title: string
    headline: string
    description: string
    features: string[]
    bestFor: string
    pricing: string
    color: "saffron" | "plum" | "charcoal"
  }
  index: number
}

const colorMap = {
  saffron: { accent: '#008573', bg: '#00857315', text: '#005C4E' },
  plum: { accent: '#107D98', bg: '#107D9815', text: '#0A5F74' },
  charcoal: { accent: '#dbad3e', bg: '#dbad3e15', text: '#9A7A1A' },
}

export function ServiceDetail({ service, index }: ServiceDetailProps) {
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

  const bgColor = index % 2 === 0 ? "bg-white" : "bg-teal-tint"
  const colors = colorMap[service.color]

  return (
    <section ref={sectionRef} className={`py-16 sm:py-20 lg:py-28 ${bgColor}`} id={service.id}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Content */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: colors.bg, color: colors.accent }}
            >
              {service.title}
            </div>
            
            <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-near-black leading-tight">
              {service.headline}
            </h2>
            
            <p className="mt-6 text-muted-text text-lg leading-relaxed">
              {service.description}
            </p>

            <a
              href={`https://wa.me/916261643774?text=${encodeURIComponent(`Hi! I'm interested in your ${service.title} service.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 mt-8 bg-gold text-near-black hover:bg-[#c49b2e]"
            >
              <WhatsAppIcon size={20} />
              WhatsApp us about {service.title}
            </a>
          </div>

          {/* Features */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm" style={{ border: '0.5px solid #C8E8E3' }}>
              <h3 className="font-semibold text-lg text-near-black mb-6">
                What We Handle
              </h3>
              <ul className="space-y-4">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-muted-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ borderTop: '0.5px solid #C8E8E3' }}>
                <div>
                  <p className="text-sm font-medium text-muted-text mb-1">Pricing</p>
                  <p className="text-near-black font-semibold">{service.pricing}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-text mb-1">Best For</p>
                  <p className="text-muted-text text-sm leading-tight">{service.bestFor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
