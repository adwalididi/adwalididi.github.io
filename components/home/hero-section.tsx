"use client"

import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
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
      className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-cream relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-saffron/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-plum/5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-[var(--font-syne)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal leading-tight">
            <span className="block">Aapka Business.</span>
            <span className="block text-saffron mt-2">Humari Zimmedari.</span>
          </h1>
        </div>
        
        <p 
          className={`mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-charcoal/70 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          We handle your Google profile, run your ads, and make your creatives — 
          <span className="text-charcoal font-medium"> so you get enquiries, not excuses.</span>
        </p>

        <div 
          className={`mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <a
            href="https://wa.me/916261643774"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-saffron text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-saffron/90 transition-all hover:scale-105 shadow-lg shadow-saffron/25"
          >
            <MessageCircle size={22} />
            WhatsApp Us Now
          </a>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-charcoal/90 transition-all hover:scale-105"
          >
            See Our Work
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
