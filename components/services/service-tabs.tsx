"use client"

import { useEffect, useState } from "react"

const tabs = [
  { id: "gbp", label: "Google Profile", color: "#008573" },
  { id: "ads", label: "Paid Ads", color: "#107D98" },
  { id: "creatives", label: "Creatives", color: "#dbad3e" },
  { id: "social", label: "Social Media", color: "#e86a58" },
  { id: "influencer", label: "Influencer Marketing", color: "#2c7abb" },
  { id: "ooh", label: "Outdoor (OOH)", color: "#5c8c6b" },
]

export function ServiceTabs() {
  const [activeId, setActiveId] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show tabs after scrolling past hero
      setIsVisible(window.scrollY > 300)

      // Detect which section is in view
      for (const tab of tabs) {
        const el = document.getElementById(tab.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveId(tab.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 100
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <div
      className={`sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      style={{ borderBottom: '0.5px solid #C8E8E3' }}
    >
      <div className="w-full">
        <div className="flex items-center justify-start xl:justify-center gap-3 sm:gap-6 py-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 snap-x max-w-7xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 snap-center ${
                activeId === tab.id
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
