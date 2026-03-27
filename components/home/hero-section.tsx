"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #006B5C 0%, #0D6B82 100%)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-[var(--font-syne)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            <span className="block">Aapka Business.</span>
            <span className="block mt-2" style={{ color: '#F5CB5C' }}>Humari Zimmedari.</span>
          </h1>
        </div>
        
        <p 
          className={`mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ color: 'rgba(255,255,255,0.80)' }}
        >
          We handle your Google profile, run your ads, and make your creatives — 
          <span className="text-white font-medium"> so you get enquiries, not excuses.</span>
        </p>

        <div 
          className={`mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <a
            href="https://wa.me/916261643774?text=Hi!%20I%20want%20to%20get%20more%20enquiries%20for%20my%20business.%20Can%20we%20talk%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-near-black px-8 py-4 rounded-full font-medium text-lg hover:bg-[#c49b2e] transition-all hover:scale-105 shadow-lg"
          >
            <WhatsAppIcon size={20} />
            WhatsApp Us Now
          </a>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg text-white transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.30)' }}
          >
            See Our Work
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
