"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { m } from "framer-motion"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section
      className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-near-black"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full">
          <Image 
            src="/images/hero_meeting.webp" 
            alt="Ad Wali Didi Team Meeting" 
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dark overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isMounted ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <m.h1 
            className="font-[var(--font-syne)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMounted ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="block">Aapka Business.</span>
            <span className="block mt-2 text-bright-gold">Humari Zimmedari.</span>
          </m.h1>
          
          <m.p
            className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMounted ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            We handle your Google profile, run your ads, and make your creatives —
            <span className="text-white font-medium"> so you get enquiries, not excuses.</span>
          </m.p>

          <m.div
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMounted ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="https://wa.me/916261643774?text=Hi!%20I%20want%20to%20get%20more%20enquiries%20for%20my%20business.%20Can%20we%20talk%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal text-white px-8 py-4 rounded-xl font-medium text-lg hover:opacity-90 transition-all hover:scale-105 shadow-xl"
            >
              <WhatsAppIcon className="w-6 h-6 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
              WhatsApp Us Now
            </a>
            <Link
              href="/portfolio/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:scale-105 bg-white-10 hover:bg-white-20 backdrop-blur-sm shadow-xl border border-white-30"
            >
              See Our Work
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
