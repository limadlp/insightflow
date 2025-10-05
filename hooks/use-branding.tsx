"use client"

import { useState, useEffect } from "react"
import type { Branding } from "@/lib/types"
import { brandingStorage } from "@/lib/storage-service"
import { useAuth } from "./use-auth"

export function useBranding() {
  const { user } = useAuth()
  const [branding, setBranding] = useState<Branding | null>(null)
  const [loading, setLoading] = useState(true)

  const loadBranding = () => {
    if (!user || user.role !== "teacher") {
      setLoading(false)
      return
    }

    const config = brandingStorage.getByTeacher(user.id)
    setBranding(config)
    setLoading(false)
  }

  useEffect(() => {
    loadBranding()
  }, [user])

  const saveBranding = (config: Omit<Branding, "teacherId" | "updatedAt">) => {
    if (!user) return

    const fullConfig: Branding = {
      ...config,
      teacherId: user.id,
      updatedAt: new Date().toISOString(),
    }

    brandingStorage.save(fullConfig)
    loadBranding()

    // Apply theme immediately
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--primary", config.primaryColor)
    }
  }

  return {
    branding,
    loading,
    saveBranding,
    refresh: loadBranding,
  }
}
