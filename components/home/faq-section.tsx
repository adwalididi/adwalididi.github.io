"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { m, AnimatePresence } from "framer-motion"

const faqs = [
  {
    q: "How much do Meta Ads cost for a small business in India?",
    a: "You can start Meta Ads with as little as ₹200–₹500 per day. For most small businesses, we recommend ₹5,000–₹10,000/month in ad spend alongside our management fee (starting ₹4,000/month). What matters more than the budget is how it's spent — targeting, creative quality, and campaign structure.",
  },
  {
    q: "How long does it take for a Google Business Profile to rank?",
    a: "With proper optimisation — complete profile, regular posts, active reviews, and correct keyword placement — most businesses start seeing improvement in local search visibility within 4–8 weeks. Competitive categories like dentists or lawyers in metro cities may take 2–3 months.",
  },
  {
    q: "Do I need Google Ads or Meta Ads for my business?",
    a: "It depends on how people find your service. Google Ads works best when people actively search for what you offer — 'dentist near me', 'travel agency'. Meta Ads work better when you need to reach people before they know they want something — local events, lifestyle products, special offers.",
  },
  {
    q: "What is a Google Business Profile and why does my business need it?",
    a: "A Google Business Profile (previously Google My Business) is your free listing that appears in Google Search and Google Maps. When someone searches 'salon near me', your profile is what they see first. If it's incomplete or has bad reviews, you're losing customers to competitors.",
  },
  {
    q: "How many enquiries can I realistically expect from digital marketing?",
    a: "We generated 150+ enquiries in the very first month for a travel startup and 550+ leads over 6 months for a construction company. Results vary by business type, budget, and market competition — and we'll always give you an honest expectation.",
  },
  {
    q: "Do you work with businesses outside Maharashtra?",
    a: "Yes. We're based in Maharashtra and know these markets well, but we work with businesses across India. Since our core services are digital — Google profile management, paid ads, ad creatives — location is no barrier. We handle everything over WhatsApp and video calls.",
  },
  {
    q: "What is the minimum budget needed to start digital marketing?",
    a: "Google Business Profile management starts at ₹1,500/month — the most affordable entry point. For paid ads, management starts at ₹4,000/month plus your ad spend (we recommend at least ₹5,000/month to start).",
  },
  {
    q: "Can you handle ads, Google profile, and creatives all together?",
    a: "Yes — that's our core advantage. Most businesses end up briefing 2–3 separate vendors for ads, design, and profile management, which means slow execution and inconsistent messaging. We handle everything under one roof: one brief, one point of contact, one cohesive strategy.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <section 
      className="py-16 sm:py-20 lg:py-28 bg-white" 
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="faq-title" className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black">
            Questions We Get Asked
          </h2>
          <p className="mt-4 text-muted-text text-lg">
            Straight answers. No jargon.
          </p>
        </m.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div 
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen ? "border-teal-border bg-teal-tint" : "border-[#e8e8e8]"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`font-semibold text-base sm:text-lg ${isOpen ? "text-deep-teal" : "text-near-black"}`}>
                    {faq.q}
                  </span>
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-teal text-white" : "bg-teal-tint text-teal"}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-muted-text leading-relaxed">
                        {faq.a}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
