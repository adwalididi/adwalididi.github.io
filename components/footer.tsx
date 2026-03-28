"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-deep-teal text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo at top */}
        <Link href="/" className="block mb-6">
          <Image
            src="/logo-light.webp"
            alt="Ad Wali Didi Digital Marketing Agency"
            width={160}
            height={44}
            className="h-14 sm:h-[78px] w-auto"
          />
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="mt-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Digital marketing that actually works for Indian small businesses. 
              Google Ads, Meta Ads, and Google Business Profile — all under one roof.
            </p>
            <a
              href="mailto:adwalididi@gmail.com"
              className="inline-flex items-center gap-2 mt-4 transition-colors"
              style={{ color: 'rgba(255,255,255,0.70)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.70)'}
            >
              <Mail size={16} />
              <span>adwalididi@gmail.com</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="transition-colors" style={{ color: 'rgba(255,255,255,0.70)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.70)'}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="transition-colors" style={{ color: 'rgba(255,255,255,0.70)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.70)'}>
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors" style={{ color: 'rgba(255,255,255,0.70)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.70)'}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors" style={{ color: 'rgba(255,255,255,0.70)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.70)'}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors" style={{ color: 'rgba(255,255,255,0.70)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.70)'}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Services</h4>
            <ul className="space-y-3">
              <li style={{ color: 'rgba(255,255,255,0.70)' }}>Google Business Profile</li>
              <li style={{ color: 'rgba(255,255,255,0.70)' }}>Google Ads</li>
              <li style={{ color: 'rgba(255,255,255,0.70)' }}>Meta Ads</li>
              <li style={{ color: 'rgba(255,255,255,0.70)' }}>Ad Creatives</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid rgba(255,255,255,0.15)' }}>
          <p className="text-center text-white/50 text-sm">
            Made with care for Indian small businesses
          </p>

          {/* Free Audit CTA */}
          <div className="text-center mt-5">
            <a
              href="https://wa.me/916261643774?text=Hi!%20I'd%20like%20a%20free%20audit%20of%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-[#F5CB5C] transition-colors font-medium text-sm"
            >
              Get a Free Audit →
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <a
              href="https://www.facebook.com/adwalididi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
              aria-label="Follow us on Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/112985325"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://www.instagram.com/adwalididi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>

          <p className="text-center text-white/50 text-sm mt-5">
            © 2026 Ad Wali Didi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
