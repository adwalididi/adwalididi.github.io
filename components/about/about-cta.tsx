"use client"

import { useEffect, useState } from "react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { m } from "framer-motion"

export function AboutCTA() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-teal-tint">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-near-black leading-relaxed">
            Aapki growth, humari responsibility.
          </p>
          
          <m.a
            href="https://wa.me/916261643774?text=Hi%20Ad%20Wali%20Didi!%20I%20read%20about%20your%20story%20and%20I'd%20love%20to%20work%20together."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-deep-teal transition-all hover:scale-105 shadow-lg mt-8 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="group-hover:animate-ring-subtle">
              <WhatsAppIcon className="w-6 h-6 sm:w-5 sm:h-5 shrink-0" />
            </div>
            <span>Baat Karte Hain — WhatsApp Us</span>
          </m.a>
        </m.div>
      </div>
    </section>
  )
}
