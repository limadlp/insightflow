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
import { Badge } from "@/components/ui/badge"

interface AssignToStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: User | null
  practices: Practice[]
  onAssign: (practiceIds: string[], notes: string) => void
}

export function AssignToStudentDialog({
  open,
  onOpenChange,
  student,
  practices,
  onAssign,
}: AssignToStudentDialogProps) {
  const [selectedPractices, setSelectedPractices] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPractices.length === 0) {
      alert("Selecione pelo menos uma prática")
      return
    }
    onAssign(selectedPractices, notes)
    setSelectedPractices([])
    setNotes("")
    onOpenChange(false)
  }

  const togglePractice = (practiceId: string) => {
    setSelectedPractices((prev) =>
      prev.includes(practiceId) ? prev.filter((id) => id !== practiceId) : [...prev, practiceId],
    )
  }

  const selectAll = () => {
    setSelectedPractices(practices.map((p) => p.id))
  }

  const deselectAll = () => {
    setSelectedPractices([])
  }

  if (!student) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Atribuir Práticas</DialogTitle>
            <DialogDescription>Atribuir práticas para {student.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selecionar Práticas</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
                    Todas
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={deselectAll}>
                    Nenhuma
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[200px] rounded-md border border-border p-4">
                <div className="space-y-3">
                  {practices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma prática cadastrada</p>
                  ) : (
                    practices.map((practice) => (
                      <div key={practice.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={practice.id}
                          checked={selectedPractices.includes(practice.id)}
                          onCheckedChange={() => togglePractice(practice.id)}
                        />
                        <label
                          htmlFor={practice.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{practice.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {practice.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-normal">{practice.description}</p>
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
                placeholder="Adicione instruções ou observações para o aluno..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={selectedPractices.length === 0}>
              Atribuir ({selectedPractices.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
