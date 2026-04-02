"use client"

import { m } from "framer-motion"

const stats = [
  {
    number: "150+",
    text: "Enquiries generated for a travel startup in their very first month",
    bg: "var(--teal-tint)",
    border: "var(--teal-border)",
    numberColor: "var(--teal)",
  },
  {
    number: "700+",
    text: "Leads generated across client campaigns",
    bg: "var(--blue-tint)",
    border: "var(--blue-border)",
    numberColor: "var(--ocean-blue)",
  },
  {
    number: "1.7M+",
    text: "Organic views generated through strategic influencer campaigns",
    bg: "var(--gold-tint)",
    border: "var(--gold-border)",
    numberColor: "var(--dark-gold)",
  },
]

export function StatsBar() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center md:text-left rounded-2xl p-6 sm:p-8"
              style={{ 
                backgroundColor: stat.bg,
                border: `0.5px solid ${stat.border}`,
              }}
            >
              <m.div 
                className="font-[var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold"
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                style={{ color: stat.numberColor }}
              >
                {stat.number}
              </m.div>
              <p className="mt-3 text-muted-text text-base sm:text-lg">
                {stat.text}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
