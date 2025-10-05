"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useAssignments } from "@/hooks/use-assignments"
import { useReports } from "@/hooks/use-reports"
import { practiceStorage } from "@/lib/storage-service"
import { BookOpen, FileText, CheckCircle2, Clock } from "lucide-react"

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const { assignments } = useAssignments()
  const { reports } = useReports()

  if (!user || user.role !== "student") {
    return null
  }

  const completedCount = assignments.filter((a) => a.completed).length
  const pendingCount = assignments.length - completedCount

  const stats = [
    {
      title: "Práticas Atribuídas",
      value: assignments.length,
      icon: BookOpen,
      description: "Total de práticas",
    },
    {
      title: "Concluídas",
      value: completedCount,
      icon: CheckCircle2,
      description: "Práticas finalizadas",
    },
    {
      title: "Pendentes",
      value: pendingCount,
      icon: Clock,
      description: "Aguardando conclusão",
    },
    {
      title: "Relatórios Enviados",
      value: reports.length,
      icon: FileText,
      description: "Total de relatórios",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, {user.name}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Práticas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment) => {
                  const practice = practiceStorage.getById(assignment.practiceId)
                  if (!practice) return null

                  return (
                    <div key={assignment.id} className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <p className="text-sm font-medium">{practice.title}</p>
                        <p className="text-xs text-muted-foreground">{practice.category}</p>
                      </div>
                      <div className="text-xs">
                        {assignment.completed ? (
                          <span className="text-green-600">Concluída</span>
                        ) : (
                          <span className="text-yellow-600">Pendente</span>
                        )}
                      </div>
                    </div>
                  )
                })}
                {assignments.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma prática atribuída ainda</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => {
                  const practice = practiceStorage.getById(report.practiceId)
                  if (!practice) return null

                  return (
                    <div key={report.id} className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <p className="text-sm font-medium">{practice.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.submittedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )
                })}
                {reports.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum relatório enviado ainda</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
