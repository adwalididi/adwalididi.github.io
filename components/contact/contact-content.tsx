"use client"

import { useEffect, useRef, useState } from "react"
import { Instagram, Facebook, Linkedin, Clock, Mail, Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function ContactContent() {
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
    <section ref={sectionRef} className="py-12 sm:py-16 bg-teal-tint">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-teal-border transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-lg text-muted-text leading-relaxed mb-8">
            We don&apos;t do contact forms. Because nobody wants to fill out a form and wait 48 hours for a reply.
          </p>
          
          <p className="text-lg text-muted-text leading-relaxed mb-8">
            WhatsApp us directly — we&apos;ll respond same day, ask you a few simple questions about your business, and tell you honestly whether we think we can help.
          </p>
          
          <p className="text-xl font-semibold text-near-black mb-8">
            That conversation costs nothing.
          </p>

          {/* Primary CTA */}
          <a
            href="https://wa.me/916261643774?text=Hi!%20I%20have%20some%20questions%20about%20your%20digital%20marketing%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-whatsapp-green text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-whatsapp-green/90 transition-all hover:scale-105 shadow-lg w-full sm:w-auto justify-center group"
          >
            <div className="group-hover:animate-ring-subtle">
              <WhatsAppIcon className="w-6 h-6 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
            </div>
            <span>WhatsApp Karo</span>
          </a>

          {/* Additional Contact Info */}
          <div className="mt-10 pt-8 border-t border-teal-border">
            <p className="text-muted-text text-sm font-medium mb-4">Also find us here:</p>
            
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/adwalididi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-text hover:text-teal transition-colors"
              >
                <Instagram size={22} aria-hidden="true" />
                <span>@adwalididi</span>
              </a>
              
              <a
                href="https://www.facebook.com/adwalididi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-text hover:text-teal transition-colors"
              >
                <Facebook size={22} aria-hidden="true" />
                <span>Ad Wali Didi</span>
              </a>
              
              <a
                href="https://www.linkedin.com/company/112985325"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-text hover:text-teal transition-colors"
              >
                <Linkedin size={22} aria-hidden="true" />
                <span>Ad Wali Didi</span>
              </a>
              
              <a
                href="mailto:hello@adwalididi.com"
                className="flex items-center gap-3 text-muted-text hover:text-teal transition-colors"
              >
                <Mail size={22} aria-hidden="true" />
                <span>hello@adwalididi.com</span>
              </a>

              <a
                href="tel:+916261643774"
                className="flex items-center gap-3 text-muted-text hover:text-teal transition-colors"
              >
                <Phone size={22} aria-hidden="true" />
                <span>+91 62616 43774</span>
              </a>

              <a
                href="tel:+917558617172"
                className="flex items-center gap-3 text-muted-text hover:text-teal transition-colors"
              >
                <Phone size={22} aria-hidden="true" />
                <span>+91 75586 17172</span>
              </a>

              <div className="flex items-center gap-3 text-muted-text">
                <Clock size={22} aria-hidden="true" />
                <span>Response time: Same day, usually faster</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
