"use client"

import { useEffect } from "react"
import { m } from "framer-motion"
import { RefreshCcw } from "lucide-react"
import { logError } from "@/lib/error-logger"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Application error:", error)
    logError(error, { digest: error.digest })
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-xl mx-auto text-center border border-teal-border p-8 sm:p-12 rounded-3xl bg-teal-tint shadow-sm">
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-coral mb-6 shadow-sm">
            <span className="text-2xl font-bold font-[var(--font-syne)]">!</span>
          </div>
          
          <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl font-bold text-near-black mb-4">
            Something went wrong!
          </h2>
          
          <p className="text-muted-text mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-teal text-white px-6 py-3 rounded-full font-medium hover:bg-deep-teal transition-all shadow-sm"
          >
            <RefreshCcw size={16} />
            Try again
          </button>
        </m.div>
      </div>
    </div>
  )
}
