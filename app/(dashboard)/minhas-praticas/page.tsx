"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useAssignments } from "@/hooks/use-assignments"
import { useReports } from "@/hooks/use-reports"
import { practiceStorage } from "@/lib/storage-service"
import { BookOpen, CheckCircle2, Clock, FileText } from "lucide-react"
import { SubmitReportDialog } from "@/components/reports/submit-report-dialog"
import type { AssignedPractice, Practice } from "@/lib/types"

export default function MyPracticesPage() {
  const { user } = useAuth()
  const { assignments, completeAssignment } = useAssignments()
  const { reports, createReport } = useReports()
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<AssignedPractice | null>(null)
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null)

  if (!user || user.role !== "student") {
    return null
  }

  const handleSubmitReport = (assignment: AssignedPractice, practice: Practice) => {
    setSelectedAssignment(assignment)
    setSelectedPractice(practice)
    setReportDialogOpen(true)
  }

  const handleReportSubmit = (content: string, learnings: string, challenges: string) => {
    if (!selectedAssignment || !selectedPractice) return

    createReport({
      assignedPracticeId: selectedAssignment.id,
      practiceId: selectedPractice.id,
      studentId: user.id,
      content,
      learnings,
      challenges,
    })

    completeAssignment(selectedAssignment.id)
  }

  const pendingAssignments = assignments.filter((a) => !a.completed)
  const completedAssignments = assignments.filter((a) => a.completed)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Práticas</h1>
          <p className="text-muted-foreground">Acompanhe suas práticas atribuídas</p>
        </div>

        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma prática atribuída</h3>
            <p className="text-sm text-muted-foreground">Aguarde seu professor atribuir práticas para você</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingAssignments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pendentes ({pendingAssignments.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {pendingAssignments.map((assignment) => {
                    const practice = practiceStorage.getById(assignment.practiceId)
                    if (!practice) return null

                    const hasReport = reports.some((r) => r.assignedPracticeId === assignment.id)

                    return (
                      <Card key={assignment.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{practice.title}</CardTitle>
                              <Badge variant="secondary">{practice.category}</Badge>
                            </div>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Pendente
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription>{practice.description}</CardDescription>
                          {assignment.notes && (
                            <div className="rounded-md bg-muted p-3">
                              <p className="text-sm font-medium mb-1">Notas do Professor</p>
                              <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Atribuída em {new Date(assignment.assignedAt).toLocaleDateString("pt-BR")}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReport(assignment, practice)}
                              disabled={hasReport}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {hasReport ? "Relatório Enviado" : "Submeter Relatório"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {completedAssignments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Concluídas ({completedAssignments.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {completedAssignments.map((assignment) => {
                    const practice = practiceStorage.getById(assignment.practiceId)
                    if (!practice) return null

                    return (
                      <Card key={assignment.id} className="opacity-75">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{practice.title}</CardTitle>
                              <Badge variant="secondary">{practice.category}</Badge>
                            </div>
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Concluída
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground">
                            Concluída em{" "}
                            {assignment.completedAt && new Date(assignment.completedAt).toLocaleDateString("pt-BR")}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <SubmitReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          assignment={selectedAssignment}
          practice={selectedPractice}
          onSubmit={handleReportSubmit}
        />
      </div>
    </DashboardLayout>
  )
}
