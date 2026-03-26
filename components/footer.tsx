import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo at top */}
        <Link href="/" className="block mb-6">
          <Image
            src="/logo-light.png"
            alt="Ad Wali Didi"
            width={160}
            height={40}
            className="h-14 w-auto"
          />
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="mt-4 text-white/70 max-w-md">
              Digital marketing that actually works for Indian small businesses. 
              Google Ads, Meta Ads, and Google Business Profile — all under one roof.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.instagram.com/adwalididi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-saffron transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://www.facebook.com/adwalididi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-saffron transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={22} />
              </a>
              <a
                href="https://www.linkedin.com/company/112985325"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-saffron transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-white/70 hover:text-saffron transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white/70 hover:text-saffron transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-saffron transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-saffron transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li className="text-white/70">Google Business Profile</li>
              <li className="text-white/70">Google Ads</li>
              <li className="text-white/70">Meta Ads</li>
              <li className="text-white/70">Ad Creatives</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2026 Ad Wali Didi. All rights reserved.
            </p>
            <p className="text-white/50 text-sm">
              Made with care for Indian small businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
