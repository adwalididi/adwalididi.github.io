"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Zap, Briefcase, FileText, MessageCircle } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services/", label: "Services", icon: Zap },
  { href: "/portfolio/", label: "Work", icon: Briefcase },
  { href: "/blog/", label: "Blog", icon: FileText },
  { href: "/contact/", label: "Contact", icon: MessageCircle },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === ""
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile bottom navigation"
    >
      <div className="bg-white/92 backdrop-blur-xl border-t border-teal-border shadow-[0_-4px_24px_rgba(0,133,115,0.10)]">
        <div className="flex items-stretch h-16">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                className={`relative flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  active ? "text-teal" : "text-muted-text"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/4 right-1/4 h-[2px] rounded-full bg-teal"
                    aria-hidden="true"
                  />
                )}
                <item.icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  aria-hidden="true"
                />
                <span
                  className={`text-[10px] font-medium tracking-wide ${
                    active ? "text-teal" : "text-muted-text"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
