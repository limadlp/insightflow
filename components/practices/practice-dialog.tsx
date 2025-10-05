"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Practice } from "@/lib/types"

interface PracticeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  practice?: Practice | null
  onSave: (data: Omit<Practice, "id" | "createdAt" | "updatedAt">) => void
  teacherId: string
}

export function PracticeDialog({ open, onOpenChange, practice, onSave, teacherId }: PracticeDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (practice) {
      setTitle(practice.title)
      setDescription(practice.description)
      setCategory(practice.category)
    } else {
      setTitle("")
      setDescription("")
      setCategory("")
    }
  }, [practice, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      teacherId,
      title,
      description,
      category,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{practice ? "Editar Prática" : "Nova Prática"}</DialogTitle>
            <DialogDescription>
              {practice ? "Atualize as informações da prática" : "Crie uma nova prática para sua biblioteca"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Introdução ao React"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Frontend, Backend, DevOps"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os objetivos e conteúdo da prática..."
                rows={5}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{practice ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
