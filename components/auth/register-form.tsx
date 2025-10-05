"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { AuthError } from "@/lib/auth-service"

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()

  const inviteToken = searchParams.get("token") || ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      await register({ name, email, password, inviteToken })

      // Set cookie for middleware
      const user = JSON.parse(localStorage.getItem("insightflow_current_user") || "{}")
      document.cookie = `insightflow_current_user=${JSON.stringify(user)}; path=/; max-age=86400`

      router.push("/meu-dashboard")
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError("Erro ao criar conta. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          {inviteToken ? "Complete seu cadastro para começar" : "Registre-se como estudante"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Button type="button" variant="link" className="p-0 h-auto" onClick={() => router.push("/login")}>
              Fazer login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
