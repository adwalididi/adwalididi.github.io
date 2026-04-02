"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { m } from "framer-motion"

interface ServiceDetailProps {
  service: {
    id: string
    title: string
    headline: string
    description: string
    features: string[]
    bestFor: string
    pricing: string
    color: "saffron" | "plum" | "charcoal" | "coral" | "azure" | "sage"
  }
  index: number
}

const colorMap = {
  saffron: { accent: 'var(--teal)', bg: 'color-mix(in srgb, var(--teal), transparent 85%)', text: 'var(--deep-teal)' },
  plum: { accent: 'var(--ocean-blue)', bg: 'color-mix(in srgb, var(--ocean-blue), transparent 85%)', text: 'var(--color-ocean-blue)' },
  charcoal: { accent: 'var(--gold)', bg: 'color-mix(in srgb, var(--gold), transparent 85%)', text: 'var(--dark-gold)' },
  coral: { accent: 'var(--coral)', bg: 'color-mix(in srgb, var(--coral), transparent 85%)', text: 'var(--coral-text)' },
  azure: { accent: 'var(--azure)', bg: 'color-mix(in srgb, var(--azure), transparent 85%)', text: 'var(--azure-text)' },
  sage: { accent: 'var(--sage)', bg: 'color-mix(in srgb, var(--sage), transparent 85%)', text: 'var(--sage-text)' },
}

export function ServiceDetail({ service, index }: ServiceDetailProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const bgColor = index % 2 === 0 ? "bg-white" : "bg-teal-tint"
  const colors = colorMap[service.color]

  return (
    <section className={`py-16 sm:py-20 lg:py-28 ${bgColor}`} id={service.id}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Content */}
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 mt-8 bg-gold text-near-black hover:bg-darker-gold"
            >
              <WhatsAppIcon size={20} />
              WhatsApp us about {service.title}
            </a>
          </m.div>

          {/* Features */}
          <m.div 
            className="lg:sticky lg:top-40 self-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-teal-border">
              <h3 className="font-semibold text-lg text-near-black mb-6">
                What We Handle
              </h3>
              <ul className="space-y-4">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: colors.accent }}
                      aria-hidden="true"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-muted-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-teal-border">
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
          </m.div>
        </div>
      </div>
    </section>
  )
}
