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
import type { AssignedPractice, Practice } from "@/lib/types"

interface SubmitReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: AssignedPractice | null
  practice: Practice | null
  onSubmit: (content: string, learnings: string, challenges: string) => void
}

export function SubmitReportDialog({ open, onOpenChange, assignment, practice, onSubmit }: SubmitReportDialogProps) {
  const [content, setContent] = useState("")
  const [learnings, setLearnings] = useState("")
  const [challenges, setChallenges] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(content, learnings, challenges)
    setContent("")
    setLearnings("")
    setChallenges("")
    onOpenChange(false)
  }

  if (!assignment || !practice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submeter Relatório</DialogTitle>
            <DialogDescription>Compartilhe seu progresso e aprendizados sobre "{practice.title}"</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">O que você fez?</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Descreva o que você trabalhou nesta prática..."
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learnings">O que você aprendeu?</Label>
              <Textarea
                id="learnings"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                placeholder="Compartilhe seus principais aprendizados..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="challenges">Quais foram os desafios?</Label>
              <Textarea
                id="challenges"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Descreva as dificuldades que encontrou..."
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Submeter Relatório</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
