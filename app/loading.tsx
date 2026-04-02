"use client"

import { m } from "framer-motion"

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center pt-20 bg-white">
      <div className="flex flex-col items-center justify-center">
        <m.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-teal-tint border-t-teal rounded-full"
        />
        <p className="mt-4 text-muted-text font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}
