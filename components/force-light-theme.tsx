"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

/**
 * Forces light theme on public pages.
 * next-themes applies the class to <html>, so a wrapper div with className="light"
 * isn't enough. This component overrides the stored theme when mounted,
 * and restores it on unmount (when navigating back to admin).
 */
export function ForceLightTheme() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Save current theme so we can restore it when leaving public pages
    const stored = theme
    setTheme('light')

    return () => {
      // Restore previous theme when unmounting (e.g. navigating to admin)
      if (stored && stored !== 'light') {
        setTheme(stored)
      }
    }
    // Only run on mount/unmount — intentionally exclude theme/setTheme
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
