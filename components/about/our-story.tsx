"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { m } from "framer-motion"

export function OurStory() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div 
          className="space-y-6 text-lg text-muted-text leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
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
          
          <m.div 
            className="relative w-full aspect-video md:aspect-[21/9] my-10 rounded-2xl overflow-hidden shadow-lg border border-teal-border"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: isMounted ? 1 : 0, scale: isMounted ? 1 : 0.98 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/images/about_team.png"
              alt="Digital Marketing Team Collaboration"
              fill
              className="object-cover"
            />
          </m.div>
          
          <div className="relative overflow-hidden bg-teal/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 my-8 border border-teal/20 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent mix-blend-overlay pointer-events-none" />
            <p className="relative z-10 text-near-black font-medium text-lg leading-relaxed">
              Our first proper project was a <span className="font-semibold">travel startup with zero online presence</span>. No Google profile. No ads. No creatives. Nothing. We built everything from scratch, and within the first month they had <span className="font-semibold text-teal">over 150 enquiries</span> coming in.
            </p>
          </div>
          
          <p>
            That result told us everything we needed to know. This works. And there are thousands of businesses in India who need exactly this.
          </p>
          
          <p className="font-[var(--font-syne)] text-2xl text-near-black font-bold">
            So here we are.
          </p>

          {/* New Section: The People Behind It */}
          <div className="mt-16 pt-16 border-t border-teal-border">
            <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl font-bold text-near-black mb-10">
              The People Behind It
            </h2>
            
            <div className="space-y-8">
              <m.div 
                className="relative w-full aspect-[1150/686] rounded-2xl overflow-hidden shadow-md border border-teal-border"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: isMounted ? 1 : 0, scale: isMounted ? 1 : 0.98 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <Image 
                  src="/images/About-us.webp" 
                  alt="Shivani and Shubham Nile" 
                  fill 
                  className="object-cover" 
                />
              </m.div>

              <div className="space-y-4">
                <p className="text-lg text-muted-text leading-relaxed">
                  <span className="font-bold text-near-black">Shivani and Shubham Nile</span> — a husband-wife team based in Chalisgaon, Maharashtra. We work with businesses across India remotely. We started Ad Wali Didi because small businesses in smaller cities deserve the same quality of marketing that big-city brands get — and we knew how to deliver it.
                </p>
                <p className="text-lg text-muted-text leading-relaxed">
                  When you work with Ad Wali Didi, you work with us directly — not a junior, not a freelancer we outsourced to.
                </p>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
