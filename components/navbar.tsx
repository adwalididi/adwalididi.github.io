"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Our Work" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow duration-300 pt-[env(safe-area-inset-top)] ${scrolled ? 'shadow-sm' : ''
        }`}
      style={{ borderBottom: '0.5px solid #C8E8E3' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="block">
            <Image
              src="/logo-dark.png"
              alt="Ad Wali Didi Logo"
              width={160}
              height={44}
              className="h-12 sm:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-medium transition-colors py-1 ${isActive(link.href)
                  ? 'text-teal'
                  : 'text-muted-text hover:text-teal'
                  }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal" />
                )}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`px-5 py-2.5 rounded-full font-medium transition-colors ${isActive("/contact")
                ? 'bg-[#c49b2e] text-near-black'
                : 'bg-gold text-near-black hover:bg-[#c49b2e]'
                }`}
            >
              {"Let's Talk"}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-near-black"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}
          style={{ borderTop: isOpen ? '0.5px solid #C8E8E3' : 'none' }}
        >
          <div className="py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium py-2.5 px-3 rounded-lg transition-colors ${isActive(link.href)
                  ? 'text-teal bg-teal-tint'
                  : 'text-muted-text hover:text-teal hover:bg-teal-tint/50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-gold text-near-black px-5 py-3 rounded-full font-medium hover:bg-[#c49b2e] transition-colors text-center mt-3"
            >
              {"Let's Talk"}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
