"use client"

import { useState, useEffect } from "react"
import type { Report } from "@/lib/types"
import { reportStorage } from "@/lib/storage-service"
import { useAuth } from "./use-auth"

export function useReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const loadReports = () => {
    if (!user) return

    if (user.role === "student") {
      const studentReports = reportStorage.getByStudent(user.id)
      setReports(studentReports)
    } else {
      // For teachers, load all reports for their students
      const allReports = reportStorage.getAll()
      setReports(allReports)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadReports()
  }, [user])

  const createReport = (data: Omit<Report, "id" | "submittedAt">) => {
    const newReport: Report = {
      ...data,
      id: `report-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    }

    reportStorage.create(newReport)
    loadReports()
    return newReport
  }

  const updateReport = (id: string, updates: Partial<Report>) => {
    reportStorage.update(id, updates)
    loadReports()
  }

  const deleteReport = (id: string) => {
    reportStorage.delete(id)
    loadReports()
  }

  return {
    reports,
    loading,
    createReport,
    updateReport,
    deleteReport,
    refresh: loadReports,
  }
}
