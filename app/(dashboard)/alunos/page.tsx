"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useAssignments } from "@/hooks/use-assignments"
import { usePractices } from "@/hooks/use-practices"
import { userStorage, reportStorage } from "@/lib/storage-service"
import { Search, Users, BookOpen, FileText } from "lucide-react"
import { AssignToStudentDialog } from "@/components/assignments/assign-to-student-dialog"
import type { User } from "@/lib/types"

export default function StudentsPage() {
  const { user } = useAuth()
  const { assignments, createAssignment } = useAssignments()
  const { practices } = usePractices()
  const [searchQuery, setSearchQuery] = useState("")
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null)

  if (!user || user.role !== "teacher") {
    return null
  }

  const students = userStorage.getStudentsByTeacher(user.id)

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAssignToStudent = (student: User) => {
    if (practices.length === 0) {
      alert("Crie práticas primeiro")
      return
    }
    setSelectedStudent(student)
    setAssignDialogOpen(true)
  }

  const handleAssign = (practiceIds: string[], notes: string) => {
    if (!selectedStudent) return

    practiceIds.forEach((practiceId) => {
      createAssignment({
        practiceId,
        studentId: selectedStudent.id,
        teacherId: user.id,
        notes,
      })
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
            <p className="text-muted-foreground">Gerencie seus alunos e acompanhe o progresso</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar alunos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum aluno encontrado</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Tente buscar com outros termos" : "Convide alunos para começar"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredStudents.map((student) => {
              const studentAssignments = assignments.filter((a) => a.studentId === student.id)
              const completedCount = studentAssignments.filter((a) => a.completed).length
              const studentReports = reportStorage.getByStudent(student.id)

              return (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{student.name}</CardTitle>
                        <CardDescription>{student.email}</CardDescription>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {completedCount}/{studentAssignments.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{studentReports.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Práticas Atribuídas</h4>
                        <div className="flex flex-wrap gap-2">
                          {studentAssignments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhuma prática atribuída</p>
                          ) : (
                            studentAssignments.slice(0, 5).map((assignment) => {
                              const practice = practices.find((p) => p.id === assignment.practiceId)
                              return (
                                <Badge key={assignment.id} variant={assignment.completed ? "default" : "outline"}>
                                  {practice?.title}
                                </Badge>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleAssignToStudent(student)}>
                          Atribuir Prática
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <AssignToStudentDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          student={selectedStudent}
          practices={practices}
          onAssign={handleAssign}
        />
      </div>
    </DashboardLayout>
  )
}
