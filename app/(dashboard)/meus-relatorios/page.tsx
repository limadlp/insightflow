"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { useReports } from "@/hooks/use-reports"
import { practiceStorage } from "@/lib/storage-service"
import { ReportCard } from "@/components/reports/report-card"
import { FileText } from "lucide-react"

export default function MyReportsPage() {
  const { user } = useAuth()
  const { reports } = useReports()

  if (!user || user.role !== "student") {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Relatórios</h1>
          <p className="text-muted-foreground">Visualize todos os relatórios que você submeteu</p>
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum relatório enviado</h3>
            <p className="text-sm text-muted-foreground">Complete práticas e submeta relatórios para vê-los aqui</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => {
              const practice = practiceStorage.getById(report.practiceId)
              if (!practice) return null

              return <ReportCard key={report.id} report={report} practice={practice} />
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
