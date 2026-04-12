"use client"

import Image from "next/image"
import { useAdminTheme } from "@/components/admin/admin-theme-provider"

export function AdminLogo() {
  const { theme, mounted } = useAdminTheme()

  if (!mounted) {
    return <div className="w-32 h-8 bg-muted animate-pulse rounded-lg" />
  }

  return (
    <Image
      src={theme === 'dark' ? "/logo-light.webp" : "/logo-dark.webp"}
      alt="Ad Wali Didi Logo"
      width={180}
      height={48}
      className="h-10 sm:h-12 w-auto transition-opacity duration-300"
      style={{ width: 'auto' }}
      priority
    />
  )
}

