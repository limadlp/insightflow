import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Report, Practice, User } from "@/lib/types"
import { FileText } from "lucide-react"

interface ReportCardProps {
  report: Report
  practice: Practice
  student?: User
  showStudent?: boolean
}

export function ReportCard({ report, practice, student, showStudent = false }: ReportCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{practice.title}</CardTitle>
            {showStudent && student && <CardDescription>{student.name}</CardDescription>}
            <Badge variant="secondary">{practice.category}</Badge>
          </div>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">O que foi feito</h4>
          <p className="text-sm text-muted-foreground">{report.content}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-1">Aprendizados</h4>
          <p className="text-sm text-muted-foreground">{report.learnings}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-1">Desafios</h4>
          <p className="text-sm text-muted-foreground">{report.challenges}</p>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          Submetido em {new Date(report.submittedAt).toLocaleDateString("pt-BR")} às{" "}
          {new Date(report.submittedAt).toLocaleTimeString("pt-BR")}
        </div>
      </CardContent>
    </Card>
  )
}
