"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function AdminLogo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-32 h-8 bg-muted animate-pulse rounded-lg" />
  }

  return (
    <Image
      src={resolvedTheme === 'dark' ? "/logo-light.webp" : "/logo-dark.webp"}
      alt="Ad Wali Didi Logo"
      width={180}
      height={48}
      className="h-10 sm:h-12 w-auto transition-opacity duration-300"
      priority
    />
  )
}
