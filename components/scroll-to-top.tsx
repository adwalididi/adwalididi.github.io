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
      className={`fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-teal text-white shadow-lg flex items-center justify-center hover:bg-deep-teal transition-all duration-300 ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}
