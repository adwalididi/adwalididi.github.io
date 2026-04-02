"use client"

import { useEffect, useState } from "react"
import { Users, Layers, Heart } from "lucide-react"
import { m } from "framer-motion"

const differentiators = [
  {
    icon: Users,
    title: "Direct Access, Always",
    description: "We're not a 50-person agency with a client servicing team you'll never meet. You work with us directly. We know your business, we think about your business, and we care whether it's working.",
  },
  {
    icon: Layers,
    title: "One Unified System",
    description: "From paid ads and Google profiles to social media and influencer campaigns — we handle everything as a single, connected strategy. One brief, one team, zero coordination headache.",
  },
  {
    icon: Heart,
    title: "Honest, Always",
    description: "If something isn't working, we'll tell you. If we don't think ads are the right move for you right now, we'll say that too. We'd rather lose a client than take money we haven't earned.",
  },
]

export function WhatMakesUsDifferent() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-teal-tint">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            What Makes Us Different
          </h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {differentiators.map((item, index) => (
            <m.div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-teal-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="w-14 h-14 bg-teal-tint rounded-xl flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-teal" aria-hidden="true" />
              </div>
              <h3 className="font-[var(--font-syne)] text-xl font-bold text-near-black mb-3">
                {item.title}
              </h3>
              <p className="text-muted-text leading-relaxed">
                {item.description}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
