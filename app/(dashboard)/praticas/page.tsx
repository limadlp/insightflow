"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PracticeCard } from "@/components/practices/practice-card"
import { PracticeDialog } from "@/components/practices/practice-dialog"
import { AssignPracticeDialog } from "@/components/assignments/assign-practice-dialog"
import { useAuth } from "@/hooks/use-auth"
import { usePractices } from "@/hooks/use-practices"
import { useAssignments } from "@/hooks/use-assignments"
import { userStorage } from "@/lib/storage-service"
import { Plus, Search, BookOpen, Send } from "lucide-react"
import type { Practice } from "@/lib/types"

export default function PracticesPage() {
  const { user } = useAuth()
  const { practices, createPractice, updatePractice, deletePractice } = usePractices()
  const { createAssignment } = useAssignments()
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null)
  const [assigningPractice, setAssigningPractice] = useState<Practice | null>(null)

  if (!user || user.role !== "teacher") {
    return null
  }

  const students = userStorage.getStudentsByTeacher(user.id)

  const filteredPractices = practices.filter(
    (practice) =>
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSave = (data: Omit<Practice, "id" | "createdAt" | "updatedAt">) => {
    if (editingPractice) {
      updatePractice(editingPractice.id, data)
    } else {
      createPractice(data)
    }
    setEditingPractice(null)
  }

  const handleEdit = (practice: Practice) => {
    setEditingPractice(practice)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta prática?")) {
      deletePractice(id)
    }
  }

  const handleNewPractice = () => {
    setEditingPractice(null)
    setDialogOpen(true)
  }

  const handleAssignClick = (practice: Practice) => {
    if (students.length === 0) {
      alert("Você precisa ter alunos cadastrados para atribuir práticas")
      return
    }
    setAssigningPractice(practice)
    setAssignDialogOpen(true)
  }

  const handleAssign = (studentIds: string[], notes: string) => {
    if (!assigningPractice) return

    studentIds.forEach((studentId) => {
      createAssignment({
        practiceId: assigningPractice.id,
        studentId,
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
            <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Práticas</h1>
            <p className="text-muted-foreground">Gerencie suas práticas e atividades</p>
          </div>
          <Button onClick={handleNewPractice}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Prática
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar práticas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredPractices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma prática encontrada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "Tente buscar com outros termos" : "Comece criando sua primeira prática"}
            </p>
            {!searchQuery && (
              <Button onClick={handleNewPractice}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Prática
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPractices.map((practice) => (
              <div key={practice.id} className="relative group">
                <PracticeCard practice={practice} onEdit={handleEdit} onDelete={handleDelete} />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" onClick={() => handleAssignClick(practice)}>
                    <Send className="h-4 w-4 mr-2" />
                    Atribuir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <PracticeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          practice={editingPractice}
          onSave={handleSave}
          teacherId={user.id}
        />

        <AssignPracticeDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          practice={assigningPractice}
          students={students}
          onAssign={handleAssign}
        />
      </div>
    </DashboardLayout>
  )
}
