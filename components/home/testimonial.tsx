"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    quote: "I had no idea our Google profile was costing us customers. Ad Wali Didi fixed everything and within weeks we were getting calls we never got before. The best part — I didn't have to explain anything twice.",
    client: "Bhagyashri",
    location: "Bhurr Holidays",
  },
  {
    quote: "We had no online presence. They built our entire ad campaign from scratch and within 6 months we had over 550 leads. One team handled everything — no hassle.",
    client: "Mr. Borse",
    location: "Jijau Constructions",
  },
  {
    quote: "The creatives they designed actually made people stop scrolling. We saw more walk-ins within the first week itself. They understood the local audience perfectly.",
    client: "Chetan",
    location: "Cowshala",
  },
]

export function Testimonial() {
  const [isVisible, setIsVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
  }, [])

  useEffect(() => {
    startAutoPlay()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startAutoPlay])

  const goTo = (index: number) => {
    setCurrent(index)
    startAutoPlay()
  }

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    startAutoPlay()
  }

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
    startAutoPlay()
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-teal-tint overflow-hidden relative">
      {/* Decorative background blobs to enhance the glassmorphism effect */}
      <div className="absolute top-1/2 left-0 md:left-1/4 w-72 h-72 bg-teal/40 rounded-full blur-3xl mix-blend-multiply -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 md:right-1/4 w-72 h-72 bg-ocean-blue/30 rounded-full blur-3xl mix-blend-multiply -translate-y-1/2" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center p-8 sm:p-12 md:p-16 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-2xl transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-full mb-8 shadow-sm">
            <Quote className="w-8 h-8 text-teal" aria-hidden="true" />
          </div>
          
          {/* Carousel */}
          <div className="grid">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`col-start-1 row-start-1 transition-all duration-500 ${
                  index === current
                    ? 'opacity-100 translate-x-0 z-10'
                    : index < current
                    ? 'opacity-0 -translate-x-8 z-0 pointer-events-none'
                    : 'opacity-0 translate-x-8 z-0 pointer-events-none'
                }`}
              >
                <blockquote className="font-[var(--font-syne)] text-xl sm:text-2xl lg:text-3xl text-near-black leading-relaxed">
                  {`"${testimonial.quote}"`}
                </blockquote>
                
                <div className="mt-8">
                  <p className="font-semibold text-near-black">{testimonial.client}</p>
                  <p className="text-muted-text">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full flex items-center justify-center text-teal hover:bg-teal/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === current
                      ? 'w-8 h-2.5 bg-teal'
                      : 'w-2.5 h-2.5 bg-teal/30 hover:bg-teal/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full flex items-center justify-center text-teal hover:bg-teal/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
