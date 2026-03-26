"use client"

import { useEffect, useRef, useState } from "react"
import { Check, MessageCircle } from "lucide-react"

interface ServiceDetailProps {
  service: {
    id: string
    title: string
    headline: string
    description: string
    features: string[]
    bestFor: string
    color: "saffron" | "plum" | "charcoal"
  }
  index: number
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

  const bgColor = index % 2 === 0 ? "bg-cream" : "bg-muted"

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
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${
              service.color === 'saffron' ? 'bg-saffron/10 text-saffron' :
              service.color === 'plum' ? 'bg-plum/10 text-plum' :
              'bg-charcoal/10 text-charcoal'
            }`}>
              {service.title}
            </div>
            
            <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight">
              {service.headline}
            </h2>
            
            <p className="mt-6 text-charcoal/70 text-lg leading-relaxed">
              {service.description}
            </p>

            <a
              href="https://wa.me/916261643774"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 mt-8 ${
                service.color === 'saffron' ? 'bg-saffron text-white hover:bg-saffron/90' :
                service.color === 'plum' ? 'bg-plum text-white hover:bg-plum/90' :
                'bg-charcoal text-white hover:bg-charcoal/90'
              }`}
            >
              <MessageCircle size={20} />
              WhatsApp us about {service.title}
            </a>
          </div>

          {/* Features */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
              <h3 className="font-semibold text-lg text-charcoal mb-6">
                What We Handle
              </h3>
              <ul className="space-y-4">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      service.color === 'saffron' ? 'bg-saffron' :
                      service.color === 'plum' ? 'bg-plum' :
                      'bg-charcoal'
                    }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-charcoal/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm font-medium text-charcoal/50 mb-2">Best For</p>
                <p className="text-charcoal/80">{service.bestFor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
