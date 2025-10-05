"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, CheckCircle2, Clock } from "lucide-react"
import type { AssignedPractice, Practice, User } from "@/lib/types"

interface AssignmentCardProps {
  assignment: AssignedPractice
  practice: Practice
  student: User
  onDelete?: (id: string) => void
  showStudent?: boolean
}

export function AssignmentCard({ assignment, practice, student, onDelete, showStudent = true }: AssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{practice.title}</CardTitle>
            {showStudent && <CardDescription>{student.name}</CardDescription>}
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{practice.category}</Badge>
              {assignment.completed ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Concluída
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Pendente
                </Badge>
              )}
            </div>
          </div>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(assignment.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {assignment.notes && (
          <div className="mb-3 rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">{assignment.notes}</p>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Atribuída em {new Date(assignment.assignedAt).toLocaleDateString("pt-BR")}</span>
          {assignment.completedAt && (
            <span>Concluída em {new Date(assignment.completedAt).toLocaleDateString("pt-BR")}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
