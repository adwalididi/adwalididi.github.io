"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-deep-teal text-white pt-4 pb-8 sm:pt-6 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="block mb-2">
          <Image
            src="/logo-light.webp"
            alt="Ad Wali Didi Digital Marketing Agency"
            width={320}
            height={88}
            className="h-20 sm:h-[100px] lg:h-[120px] w-auto"
          />
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col">
            <p className="mt-4 text-white-85">
              A complete digital marketing ecosystem for Indian small businesses. 
              From Google & Meta ads to social media, influencers, and outdoor branding — one team, one strategy.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
              <a
                href="mailto:adwalididi@gmail.com"
                className="inline-flex items-center gap-2 text-white-70 hover:text-white transition-colors"
              >
                <Mail size={16} />
                <span>adwalididi@gmail.com</span>
              </a>
              <a
                href="https://wa.me/916261643774?text=Hi!%20I'd%20like%20a%20free%20audit%20of%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold hover:text-bright-gold transition-colors font-medium text-sm"
              >
                Get a Free Audit →
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-start gap-4 mt-6">
              <a
                href="https://www.facebook.com/adwalididi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white-10 text-white/70 hover:bg-white-20 hover:text-white transition-all"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/112985325"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white-10 text-white/70 hover:bg-white-20 hover:text-white transition-all"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/adwalididi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white-10 text-white/70 hover:bg-white-20 hover:text-white transition-all"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
            <p className="text-white/50 text-sm mt-auto pt-10">
              © 2026 Ad Wali Didi. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-white-70 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white-70 hover:text-white transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white-70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white-70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white-70 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg mb-4 text-white">Services</h4>
            <ul className="space-y-3">
              <li className="text-white-70">Google Business Profile</li>
              <li className="text-white-70">Paid Ads (Meta + Google)</li>
              <li className="text-white-70">Ad Creatives</li>
              <li className="text-white-70">Social Media Marketing</li>
              <li className="text-white-70">Influencer Marketing</li>
              <li className="text-white-70">Outdoor Advertising (OOH)</li>
            </ul>
            <p className="text-white/50 text-sm mt-auto pt-10 whitespace-nowrap">
              Made with love for Indian businesses
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
