"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Practice, User } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AssignPracticeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  practice: Practice | null
  students: User[]
  onAssign: (studentIds: string[], notes: string) => void
}

export function AssignPracticeDialog({ open, onOpenChange, practice, students, onAssign }: AssignPracticeDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStudents.length === 0) {
      alert("Selecione pelo menos um aluno")
      return
    }
    onAssign(selectedStudents, notes)
    setSelectedStudents([])
    setNotes("")
    onOpenChange(false)
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const selectAll = () => {
    setSelectedStudents(students.map((s) => s.id))
  }

  const deselectAll = () => {
    setSelectedStudents([])
  }

  if (!practice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Atribuir Prática</DialogTitle>
            <DialogDescription>Atribuir "{practice.title}" aos alunos selecionados</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selecionar Alunos</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
                    Todos
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={deselectAll}>
                    Nenhum
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[200px] rounded-md border border-border p-4">
                <div className="space-y-3">
                  {students.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado</p>
                  ) : (
                    students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={student.id}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <label
                          htmlFor={student.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {student.name} ({student.email})
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione instruções ou observações para os alunos..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={selectedStudents.length === 0}>
              Atribuir ({selectedStudents.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
