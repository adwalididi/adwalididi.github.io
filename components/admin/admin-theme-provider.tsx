"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

/**
 * Admin-only theme system — completely isolated from next-themes.
 * Uses its own localStorage key ('admin_theme') so it never
 * affects public pages or fights with next-themes across tabs.
 */

type Theme = 'light' | 'dark'

interface AdminThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  mounted: false,
})

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin_theme') as Theme | null
    if (saved === 'dark' || saved === 'light') setTheme(saved)
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    // Add transitioning class to document body temporarily
    document.documentElement.classList.add('theme-switching')

    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('admin_theme', next)
      return next
    })

    setTimeout(() => {
      document.documentElement.classList.remove('theme-switching')
    }, 400) // Slightly longer than 300ms to ensure it ends after CSS transition completes
  }, [])

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      <div className={theme} data-theme={theme}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}
