"use client"

import { useEffect, useRef, useState } from "react"

const faqs = [
  {
    question: "Do you work with businesses outside your city?",
    answer: "Yes — we work remotely with businesses across India. Location doesn't matter.",
  },
  {
    question: "What does a free audit include?",
    answer: "We review your Google Business Profile, check if you're running any ads and how they're performing, and tell you the top 3 things we'd fix immediately. No obligation after that.",
  },
  {
    question: "How quickly can you start?",
    answer: "Usually within a week of our first conversation, depending on what you need.",
  },
]

export function FAQ() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-muted">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className={`font-[var(--font-syne)] text-2xl sm:text-3xl font-bold text-charcoal text-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Quick Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-sm border border-border transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <h3 className="font-semibold text-charcoal mb-2">
                {faq.question}
              </h3>
              <p className="text-charcoal/70 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
