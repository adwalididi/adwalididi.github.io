"use client"

import { useEffect, useState } from "react"
import { Users, Building2, Star } from "lucide-react"
import { m } from "framer-motion"

const metrics = [
  { icon: Users, value: "2,000+", label: "Total Leads & Views Generated", color: "var(--teal)" },
  { icon: Building2, value: "5+", label: "Industries Served", color: "var(--ocean-blue)" },
  { icon: Star, value: "100%", label: "Client Retention", color: "var(--gold)" },
]

export function PortfolioStats() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {metrics.map((metric, index) => (
            <m.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-3">
                <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
              </div>
              <p
                className="font-[var(--font-syne)] text-2xl sm:text-4xl font-bold"
                style={{ color: metric.color }}
              >
                {metric.value}
              </p>
              <p className="text-muted-text text-xs sm:text-sm mt-1">
                {metric.label}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
