"use client"

import { useState, useEffect } from "react"
import type { Invite } from "@/lib/types"
import { inviteStorage } from "@/lib/storage-service"
import { useAuth } from "./use-auth"

export function useInvites() {
  const { user } = useAuth()
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)

  const loadInvites = () => {
    if (!user || user.role !== "teacher") return

    const teacherInvites = inviteStorage.getByTeacher(user.id)
    setInvites(teacherInvites)
    setLoading(false)
  }

  useEffect(() => {
    loadInvites()
  }, [user])

  const createInvite = (email: string) => {
    if (!user) return

    const token = `invite-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    const newInvite: Invite = {
      id: `invite-${Date.now()}`,
      teacherId: user.id,
      email,
      token,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    inviteStorage.create(newInvite)
    loadInvites()
    return newInvite
  }

  const deleteInvite = (id: string) => {
    inviteStorage.delete(id)
    loadInvites()
  }

  const getInviteLink = (token: string) => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/registrar?token=${token}`
  }

  return {
    invites,
    loading,
    createInvite,
    deleteInvite,
    getInviteLink,
    refresh: loadInvites,
  }
}
