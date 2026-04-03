"use client"

import { useEffect, useState } from "react"

const tabs = [
  { id: "gbp", label: "Google Profile", color: "var(--teal)" },
  { id: "ads", label: "Paid Ads", color: "var(--ocean-blue)" },
  { id: "creatives", label: "Creatives", color: "var(--gold)" },
  { id: "social", label: "Social Media", color: "var(--coral)" },
  { id: "influencer", label: "Influencer Marketing", color: "var(--azure)" },
  { id: "ooh", label: "Outdoor (OOH)", color: "var(--sage)" },
]

export function ServiceTabs() {
  const [activeId, setActiveId] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScrollVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScrollVisibility, { passive: true })
    handleScrollVisibility()

    // Use IntersectionObserver for more accurate section detection
    const options = {
      rootMargin: '-160px 0px -40% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, options)

    tabs.forEach(tab => {
      const el = document.getElementById(tab.id)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener("scroll", handleScrollVisibility)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (activeId && mounted) {
      const activeBtn = document.getElementById(`tab-${activeId}`)
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }
  }, [activeId, mounted])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 160
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  if (!mounted) return null

  return (
    <div
      className={`service-tabs-sticky-container sticky z-40 bg-white/95 backdrop-blur-sm transition-all duration-300 border-b border-teal-border ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      style={{
        top: '64px'
      }}
    >
      <style jsx>{`
        .service-tabs-sticky-container {
          top: calc(4rem + env(safe-area-inset-top)) !important;
        }
        @media (min-width: 640px) {
          .service-tabs-sticky-container {
            top: calc(5rem + env(safe-area-inset-top)) !important;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      <div className="w-full">
        <div className="flex items-center justify-start xl:justify-center gap-3 sm:gap-6 py-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 snap-x max-w-7xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => scrollTo(tab.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 snap-center ${activeId === tab.id
                  ? 'text-white'
                  : 'text-muted-text hover:text-near-black'
                }`}
              style={
                activeId === tab.id
                  ? { backgroundColor: tab.color }
                  : undefined
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
