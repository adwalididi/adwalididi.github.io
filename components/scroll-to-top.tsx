"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 left-6 md:bottom-6 z-50 w-11 h-11 rounded-full bg-teal/80 backdrop-blur-md border border-white/20 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:bg-teal hover:scale-110 transition-all duration-300 ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}
