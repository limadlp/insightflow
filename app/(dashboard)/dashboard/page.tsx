"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { usePractices } from "@/hooks/use-practices"
import { userStorage, assignedPracticeStorage, reportStorage } from "@/lib/storage-service"
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { practices } = usePractices()

  if (!user || user.role !== "teacher") {
    return null
  }

  // Calculate metrics
  const students = userStorage.getStudentsByTeacher(user.id)
  const assignments = assignedPracticeStorage.getByTeacher(user.id)
  const allReports = reportStorage.getAll()
  const teacherReports = allReports.filter((r) => {
    const assignment = assignedPracticeStorage.getById(r.assignedPracticeId)
    return assignment?.teacherId === user.id
  })

  const stats = [
    {
      title: "Total de Alunos",
      value: students.length,
      icon: Users,
      description: "Estudantes cadastrados",
    },
    {
      title: "Práticas Criadas",
      value: practices.length,
      icon: BookOpen,
      description: "Na sua biblioteca",
    },
    {
      title: "Práticas Atribuídas",
      value: assignments.length,
      icon: TrendingUp,
      description: "Aos seus alunos",
    },
    {
      title: "Relatórios Recebidos",
      value: teacherReports.length,
      icon: FileText,
      description: "Submetidos pelos alunos",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherReports.slice(0, 5).map((report) => {
                  const student = userStorage.getById(report.studentId)
                  const practice = practices.find((p) => p.id === report.practiceId)
                  return (
                    <div key={report.id} className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <p className="text-sm font-medium">{student?.name}</p>
                        <p className="text-xs text-muted-foreground">{practice?.title}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(report.submittedAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  )
                })}
                {teacherReports.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum relatório recebido ainda</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alunos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.slice(0, 5).map((student) => {
                  const studentAssignments = assignedPracticeStorage.getByStudent(student.id)
                  const completed = studentAssignments.filter((a) => a.completed).length

                  return (
                    <div key={student.id} className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {completed}/{studentAssignments.length} práticas
                      </div>
                    </div>
                  )
                })}
                {students.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado ainda</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
