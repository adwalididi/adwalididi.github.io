"use client"

import Link from "next/link"
import { m } from "framer-motion"
import { FileQuestion, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-teal-tint px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-2xl mx-auto text-center">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
            <FileQuestion className="w-12 h-12 text-teal" />
          </div>
        </m.div>

        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-[var(--font-syne)] text-4xl sm:text-5xl md:text-6xl font-bold text-near-black mb-4"
        >
          Page Not Found
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-muted-text mb-10 max-w-lg mx-auto"
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-teal text-white px-8 py-4 rounded-full font-semibold hover:bg-deep-teal transition-all hover:scale-105 shadow-md"
          >
            Back to Home
            <ArrowRight size={20} />
          </Link>
        </m.div>
      </div>
    </div>
  )
}
