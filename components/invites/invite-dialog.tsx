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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (email: string) => void
}

export function InviteDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onInvite(email)
    setEmail("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Convidar Aluno</DialogTitle>
            <DialogDescription>Envie um convite para um novo aluno se juntar à sua turma</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do Aluno</Label>
              <Input
                id="email"
                type="email"
                placeholder="aluno@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Enviar Convite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
