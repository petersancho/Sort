'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'
type Font = 'system' | 'times'

type ThemeState = {
  theme: Theme
  setTheme: (t: Theme) => void
  font: Font
  setFont: (f: Font) => void
}

const ThemeContext = createContext<ThemeState | undefined>(undefined)
const THEME_KEY = 'sort.theme'
const FONT_KEY = 'sort.font'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [font, setFontState] = useState<Font>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = (localStorage.getItem(THEME_KEY) as Theme) || 'light'
    const f = (localStorage.getItem(FONT_KEY) as Font) || 'system'
    setThemeState(t)
    setFontState(f)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const val = font === 'times' 
      ? "'Times New Roman', Times, serif" 
      : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
    root.style.setProperty('--font-body', val)
    localStorage.setItem(FONT_KEY, font)
  }, [font, mounted])

  const value = useMemo(() => ({
    theme, 
    setTheme: setThemeState,
    font, 
    setFont: setFontState
  }), [theme, font])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

