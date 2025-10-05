"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { LogOut, User } from "lucide-react"

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    document.cookie = "insightflow_current_user=; path=/; max-age=0"
    router.push("/login")
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a
            href={user.role === "teacher" ? "/dashboard" : "/meu-dashboard"}
            className="mr-6 flex items-center space-x-2"
          >
            <span className="font-bold text-xl">InsightFlow</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user.name}</span>
            <span className="text-xs">({user.role === "teacher" ? "Professor" : "Estudante"})</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
