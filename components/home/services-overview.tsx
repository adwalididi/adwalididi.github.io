"use client"

import Link from "next/link"
import { m } from "framer-motion"
import { MapPin, Target, Palette, ArrowRight } from "lucide-react"

const services = [
  {
    icon: MapPin,
    title: "Google Business Profile",
    tagline: "Show Up Where It Matters",
    description: "Most local businesses have incomplete, ignored Google profiles — and wonder why enquiries aren't coming. We set it up, optimise it, manage it, and make sure you show up when customers are searching.",
    accentColor: "var(--teal)",
    titleColor: "var(--deep-teal)",
    borderColor: "var(--teal-border)",
  },
  {
    icon: Target,
    title: "Paid Ads (Meta + Google)",
    tagline: "Ads That Actually Work",
    description: "Running ads is easy. Running ads that bring real enquiries is not. We plan, launch, and manage your Meta and Google campaigns — with strategy, not guesswork.",
    accentColor: "var(--ocean-blue)",
    titleColor: "var(--color-ocean-blue)",
    borderColor: "var(--blue-border)",
  },
  {
    icon: Palette,
    title: "Ad Creatives",
    tagline: "Scroll-Stopping Visuals",
    description: "Bad creatives waste good budgets. We design ads that look sharp, communicate clearly, and make people stop and take action. No generic templates. No stock photo vibes.",
    accentColor: "var(--gold)",
    titleColor: "var(--dark-gold)",
    borderColor: "var(--gold-border)",
  },
]

export function ServicesOverview() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-teal-tint overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            What We Do Best
          </h2>
          <p className="mt-4 text-muted-text text-lg max-w-2xl mx-auto">
            Six services that work together to get your business found, trusted, and chosen.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-500 group"
              style={{ 
                border: `0.5px solid ${service.borderColor}`,
                borderTop: `3px solid ${service.accentColor}`,
              }}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors"
                style={{ backgroundColor: `color-mix(in srgb, ${service.accentColor}, transparent 85%)` }}
              >
                <service.icon className="w-7 h-7" style={{ color: service.accentColor }} aria-hidden="true" />
              </div>
              <h3 
                className="font-[var(--font-space-grotesk)] text-xl sm:text-2xl font-bold"
                style={{ color: service.titleColor }}
              >
                {service.tagline}
              </h3>
              <p className="font-medium text-sm mt-1 mb-4" style={{ color: service.accentColor }}>
                {service.title}
              </p>
              <p className="text-muted-text leading-relaxed">
                {service.description}
              </p>
            </m.div>
          ))}
        </div>

        <m.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-text text-lg mb-6 max-w-2xl mx-auto">
            Plus: Social Media Marketing, Influencer Marketing & Outdoor Advertising (OOH)
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-teal font-semibold hover:text-deep-teal hover:gap-4 transition-all"
          >
            Explore All Services
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </m.div>
      </div>
    </section>
  )
}
