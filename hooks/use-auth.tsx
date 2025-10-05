"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { authService } from "@/lib/auth-service"
import { initializeStorage } from "@/lib/storage-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: { email: string; password: string; name: string; inviteToken?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize storage on mount
    initializeStorage()

    // Check for existing session
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const user = await authService.login({ email, password })
    setUser(user)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const register = async (data: { email: string; password: string; name: string; inviteToken?: string }) => {
    const user = await authService.register(data)
    setUser(user)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
