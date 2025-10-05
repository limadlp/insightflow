"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useInvites } from "@/hooks/use-invites"
import { Mail, Plus, Trash2, Copy, Check } from "lucide-react"
import { InviteDialog } from "@/components/invites/invite-dialog"
import { InviteLinkDialog } from "@/components/invites/invite-link-dialog"

export default function InvitesPage() {
  const { user } = useAuth()
  const { invites, createInvite, deleteInvite, getInviteLink } = useInvites()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [currentInviteLink, setCurrentInviteLink] = useState("")
  const [currentInviteEmail, setCurrentInviteEmail] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!user || user.role !== "teacher") {
    return null
  }

  const handleInvite = (email: string) => {
    const invite = createInvite(email)
    if (invite) {
      const link = getInviteLink(invite.token)
      setCurrentInviteLink(link)
      setCurrentInviteEmail(email)
      setLinkDialogOpen(true)
    }
  }

  const handleCopyLink = (token: string, inviteId: string) => {
    const link = getInviteLink(token)
    navigator.clipboard.writeText(link)
    setCopiedId(inviteId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pendente</Badge>
      case "accepted":
        return <Badge variant="default">Aceito</Badge>
      case "expired":
        return <Badge variant="destructive">Expirado</Badge>
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Convites</h1>
            <p className="text-muted-foreground">Gerencie convites para novos alunos</p>
          </div>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Convite
          </Button>
        </div>

        {invites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum convite enviado</h3>
            <p className="text-sm text-muted-foreground mb-4">Comece convidando alunos para sua turma</p>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Convite
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {invites.map((invite) => {
              const isExpired = new Date(invite.expiresAt) < new Date()
              const actualStatus = isExpired && invite.status === "pending" ? "expired" : invite.status

              return (
                <Card key={invite.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{invite.email}</CardTitle>
                        <CardDescription>
                          Criado em {new Date(invite.createdAt).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(actualStatus)}
                        {invite.status === "pending" && !isExpired && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyLink(invite.token, invite.id)}>
                              {copiedId === invite.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteInvite(invite.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {invite.status === "accepted" && invite.acceptedAt ? (
                        <span>Aceito em {new Date(invite.acceptedAt).toLocaleDateString("pt-BR")}</span>
                      ) : isExpired ? (
                        <span>Expirou em {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}</span>
                      ) : (
                        <span>Expira em {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <InviteDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} onInvite={handleInvite} />

        <InviteLinkDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          inviteLink={currentInviteLink}
          email={currentInviteEmail}
        />
      </div>
    </DashboardLayout>
  )
}
