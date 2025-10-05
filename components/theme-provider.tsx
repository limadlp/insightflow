"use client"

import type React from "react"

import { useTheme } from "@/hooks/use-theme"
import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, loading } = useTheme()

  useEffect(() => {
    console.log("[v0] Theme loaded:", theme)
  }, [theme])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  return <>{children}</>
}
