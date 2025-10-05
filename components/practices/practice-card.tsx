"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import type { Practice } from "@/lib/types"

interface PracticeCardProps {
  practice: Practice
  onEdit?: (practice: Practice) => void
  onDelete?: (id: string) => void
}

export function PracticeCard({ practice, onEdit, onDelete }: PracticeCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{practice.title}</CardTitle>
            <Badge variant="secondary">{practice.category}</Badge>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(practice)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(practice.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{practice.description}</CardDescription>
        <div className="mt-4 text-xs text-muted-foreground">
          Criada em {new Date(practice.createdAt).toLocaleDateString("pt-BR")}
        </div>
      </CardContent>
    </Card>
  )
}
