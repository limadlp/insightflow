"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { AuthError } from "@/lib/auth-service"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)

      // Set cookie for middleware
      const user = JSON.parse(localStorage.getItem("insightflow_current_user") || "{}")
      document.cookie = `insightflow_current_user=${JSON.stringify(user)}; path=/; max-age=86400`

      // Redirect based on role
      if (user.role === "teacher") {
        router.push("/dashboard")
      } else {
        router.push("/meu-dashboard")
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError("Erro ao fazer login. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Credenciais de demonstração:</p>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Grupo Programação:</p>
              <p>Professor: professor.prog@demo.com / demo123</p>
              <p>Aluno: aluno.prog1@demo.com / demo123</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Grupo Meditação:</p>
              <p>Professor: professor.med@demo.com / demo123</p>
              <p>Aluno: aluno.med1@demo.com / demo123</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
