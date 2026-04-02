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
    <section className="py-16 sm:py-20 lg:py-28 bg-deep-teal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-relaxed">
            Aapki growth, humari responsibility.
          </p>
          
          <m.a
            href="https://wa.me/916261643774?text=Hi%20Ad%20Wali%20Didi!%20I%20read%20about%20your%20story%20and%20I'd%20love%20to%20work%20together."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-near-black px-8 py-4 rounded-full font-medium text-lg hover:bg-darker-gold transition-all hover:scale-105 shadow-lg mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <WhatsAppIcon size={20} />
            Baat Karte Hain — WhatsApp Us
            </m.a>
        </m.div>
      </div>
    </section>
  )
}
