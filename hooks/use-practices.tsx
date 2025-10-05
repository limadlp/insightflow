"use client"

import { useState, useEffect } from "react"
import type { Practice } from "@/lib/types"
import { practiceStorage } from "@/lib/storage-service"
import { useAuth } from "./use-auth"

export function usePractices() {
  const { user } = useAuth()
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)

  const loadPractices = () => {
    if (!user) return

    if (user.role === "teacher") {
      const teacherPractices = practiceStorage.getByTeacher(user.id)
      setPractices(teacherPractices)
    } else {
      // For students, we'll load assigned practices later
      setPractices([])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadPractices()
  }, [user])

  const createPractice = (data: Omit<Practice, "id" | "createdAt" | "updatedAt">) => {
    const newPractice: Practice = {
      ...data,
      id: `practice-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    practiceStorage.create(newPractice)
    loadPractices()
    return newPractice
  }

  const updatePractice = (id: string, updates: Partial<Practice>) => {
    practiceStorage.update(id, updates)
    loadPractices()
  }

  const deletePractice = (id: string) => {
    practiceStorage.delete(id)
    loadPractices()
  }

  return {
    practices,
    loading,
    createPractice,
    updatePractice,
    deletePractice,
    refresh: loadPractices,
  }
}
