"use client"

import { useState, useEffect } from "react"
import type { AssignedPractice } from "@/lib/types"
import { assignedPracticeStorage } from "@/lib/storage-service"
import { useAuth } from "./use-auth"

export function useAssignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<AssignedPractice[]>([])
  const [loading, setLoading] = useState(true)

  const loadAssignments = () => {
    if (!user) return

    if (user.role === "teacher") {
      const teacherAssignments = assignedPracticeStorage.getByTeacher(user.id)
      setAssignments(teacherAssignments)
    } else {
      const studentAssignments = assignedPracticeStorage.getByStudent(user.id)
      setAssignments(studentAssignments)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAssignments()
  }, [user])

  const createAssignment = (data: Omit<AssignedPractice, "id" | "assignedAt" | "completed" | "completedAt">) => {
    const newAssignment: AssignedPractice = {
      ...data,
      id: `assignment-${Date.now()}`,
      assignedAt: new Date().toISOString(),
      completed: false,
      completedAt: null,
    }

    assignedPracticeStorage.create(newAssignment)
    loadAssignments()
    return newAssignment
  }

  const updateAssignment = (id: string, updates: Partial<AssignedPractice>) => {
    assignedPracticeStorage.update(id, updates)
    loadAssignments()
  }

  const deleteAssignment = (id: string) => {
    assignedPracticeStorage.delete(id)
    loadAssignments()
  }

  const completeAssignment = (id: string) => {
    assignedPracticeStorage.update(id, {
      completed: true,
      completedAt: new Date().toISOString(),
    })
    loadAssignments()
  }

  return {
    assignments,
    loading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    completeAssignment,
    refresh: loadAssignments,
  }
}
