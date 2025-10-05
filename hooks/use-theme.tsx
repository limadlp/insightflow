"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./use-auth"
import { brandingStorage } from "@/lib/storage-service"
import type { Branding } from "@/lib/types"

export function useTheme() {
  const { user } = useAuth()
  const [theme, setTheme] = useState<Branding | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    // Get the teacher ID (either the user if teacher, or their teacher if student)
    const teacherId = user.role === "teacher" ? user.id : user.teacherId

    if (!teacherId) {
      setLoading(false)
      return
    }

    // Load the teacher's branding
    const branding = brandingStorage.getByTeacher(teacherId)

    if (branding) {
      setTheme(branding)
      applyTheme(branding.primaryColor)
    }

    setLoading(false)
  }, [user])

  const applyTheme = (color: string) => {
    if (typeof window === "undefined") return

    // Apply the primary color to CSS variables
    document.documentElement.style.setProperty("--primary", color)

    // Convert hex to HSL for better color variations
    const hsl = hexToHSL(color)
    document.documentElement.style.setProperty("--primary-hsl", hsl)
  }

  return { theme, loading }
}

// Helper function to convert hex to HSL
function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace("#", "")

  // Convert hex to RGB
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}
