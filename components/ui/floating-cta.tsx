"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show if the user has scrolled past the hero section (roughly 500px)
    // AND they are NOT currently viewing the #free-audit section or the footer
    const handleScroll = () => {
      const scrollY = window.scrollY
      const auditSection = document.getElementById("free-audit")
      const footerElement = document.querySelector("footer")
      
      let hideBecauseInView = false
      
      if (auditSection) {
        const rect = auditSection.getBoundingClientRect()
        // Hide if the audit section is currently on screen
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          hideBecauseInView = true
        }
      }

      if (footerElement) {
        const rect = footerElement.getBoundingClientRect()
        // Hide if the footer is currently visible
        if (rect.top < window.innerHeight) {
          hideBecauseInView = true
        }
      }

      if (scrollY > 500 && !hideBecauseInView) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    // Initial check
    handleScroll()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <a
            href="#free-audit"
            onClick={(e) => {
              const el = document.getElementById("free-audit")
              if (el) {
                e.preventDefault()
                el.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="flex items-center gap-2 bg-near-black text-white px-6 py-3.5 rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.25)] border border-white/10 font-bold text-[13px] uppercase tracking-wider hover:bg-black hover:scale-105 active:scale-95 transition-all group"
          >
            Get Free Audit
            <ArrowRight size={16} className="text-teal transition-transform group-hover:translate-x-1" />
          </a>
        </m.div>
      )}
    </AnimatePresence>
  )
}
