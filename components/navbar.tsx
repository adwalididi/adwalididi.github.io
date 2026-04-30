"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
]

export function Navbar() {
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

  return (
    <header
      className={`navbar-glass fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 pt-[env(safe-area-inset-top)] border-b border-teal-border ${scrolled ? 'shadow-sm' : ''
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="block">
            <Image
              src="/logo-dark.webp"
              alt="Ad Wali Didi Logo"
              width={160}
              height={44}
              className="h-12 sm:h-16 w-auto"
              style={{ width: 'auto' }}
              priority={true}
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
              className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${isActive("/contact")
                ? 'bg-teal/90 text-white'
                : 'bg-teal text-white hover:opacity-90'
                }`}
            >
              {"Let's Talk"}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
