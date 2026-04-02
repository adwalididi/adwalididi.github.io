"use client"

import { useEffect, useState } from "react"
import { m } from "framer-motion"

export function AboutHero() {
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
            The Story Behind
            <span className="block text-teal">Ad Wali Didi</span>
          </h1>
        </m.div>
      </div>
    </section>
  )
}
