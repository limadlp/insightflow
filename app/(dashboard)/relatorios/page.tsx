"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useReports } from "@/hooks/use-reports"
import { practiceStorage, userStorage } from "@/lib/storage-service"
import { ReportCard } from "@/components/reports/report-card"
import { FileText, Search } from "lucide-react"
import { useState } from "react"

export default function ReportsPage() {
  const { user } = useAuth()
  const { reports } = useReports()
  const [searchQuery, setSearchQuery] = useState("")

  if (!user || user.role !== "teacher") {
    return null
  }

  const filteredReports = reports.filter((report) => {
    const practice = practiceStorage.getById(report.practiceId)
    const student = userStorage.getById(report.studentId)

    return (
      practice?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios dos Alunos</h1>
          <p className="text-muted-foreground">Visualize e acompanhe os relatórios submetidos</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar relatórios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum relatório encontrado</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Tente buscar com outros termos" : "Aguarde seus alunos submeterem relatórios"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredReports.map((report) => {
              const practice = practiceStorage.getById(report.practiceId)
              const student = userStorage.getById(report.studentId)
              if (!practice || !student) return null

              return <ReportCard key={report.id} report={report} practice={practice} student={student} showStudent />
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
