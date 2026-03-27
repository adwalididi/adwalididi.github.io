"use client"

import { useEffect, useRef, useState } from "react"

export function OurStory() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`space-y-6 text-lg text-muted-text leading-relaxed transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p>
            Most marketing agencies talk a big game. Fancy decks, complicated dashboards, words like &quot;synergy&quot; and &quot;omnichannel&quot; — and then you ask them if the ads are working and they send you a PDF full of graphs that don&apos;t answer the question.
          </p>
          
          <p className="font-semibold text-near-black text-xl">
            We got tired of that.
          </p>
          
          <p>
            Ad Wali Didi started because small Indian businesses deserve better. Not because they can&apos;t afford big agencies — but because big agencies don&apos;t care enough about businesses their size. Your dental clinic, your travel agency, your salon — these are real businesses built by real people who work incredibly hard. You deserve marketing that actually brings in customers.
          </p>
          
          <div className="bg-teal-tint rounded-2xl p-6 sm:p-8 my-8" style={{ border: '0.5px solid #C8E8E3' }}>
            <p className="text-near-black">
              Our first proper project was a <span className="font-semibold">travel startup with zero online presence</span>. No Google profile. No ads. No creatives. Nothing. We built everything from scratch, and within the first month they had <span className="font-semibold text-teal">over 150 enquiries</span> coming in.
            </p>
          </div>
          
          <p>
            That result told us everything we needed to know. This works. And there are thousands of businesses in India who need exactly this.
          </p>
          
          <p className="font-[var(--font-syne)] text-2xl text-near-black font-bold">
            So here we are.
          </p>
        </div>
      </div>
    </section>
  )
}
