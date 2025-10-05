"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"

interface InviteLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteLink: string
  email: string
}

export function InviteLinkDialog({ open, onOpenChange, inviteLink, email }: InviteLinkDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Convite Criado</DialogTitle>
          <DialogDescription>Compartilhe este link com {email} para que possam se registrar</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="font-mono text-sm" />
            <Button onClick={handleCopy} variant="outline" size="icon">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">O convite expira em 7 dias</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
