"use client"

import { useEffect, useState } from "react"
import { m } from "framer-motion"

export function PortfolioHero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-teal-tint">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-[var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-near-black leading-tight">
            Our Work
          </h1>
        </m.div>
        <m.p 
          className="mt-6 text-lg sm:text-xl text-muted-text max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We&apos;re just getting started — but the results are already talking.
        </m.p>
      </div>
    </section>
  )
}
