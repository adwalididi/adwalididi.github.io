"use client"

import { useEffect, useState } from "react"

export function PortfolioHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-[var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
            Our Work
          </h1>
        </div>
        <p 
          className={`mt-6 text-lg sm:text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          We&apos;re just getting started — but the results are already talking.
        </p>
      </div>
    </section>
  )
}
