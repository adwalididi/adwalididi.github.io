"use client"

import { useEffect, useState } from "react"
import { Package } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { m } from "framer-motion"

export function FullPackage() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-gold-25">
            <Package className="w-8 h-8 text-bright-gold" />
          </div>
          
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            The Full Package
          </h2>
          <p className="mt-2 text-xl font-medium text-bright-gold">
            Everything Under One Roof
          </p>
          
          <p className="mt-6 text-white-80 text-lg max-w-2xl mx-auto leading-relaxed">
            All six services working as one system — one brief, one team, zero coordination headache.
          </p>
          
          <m.a
            href="https://wa.me/916261643774?text=Hi!%20I'm%20interested%20in%20the%20Full%20Package%20for%20my%20business.%20I'd%20like%20to%20discuss%20pricing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-near-black px-8 py-4 rounded-full font-medium text-lg hover:bg-darker-gold transition-all hover:scale-105 shadow-lg mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <WhatsAppIcon size={20} />
            WhatsApp to Discuss Pricing
          </m.a>
        </m.div>
      </div>
    </section>
  )
}
