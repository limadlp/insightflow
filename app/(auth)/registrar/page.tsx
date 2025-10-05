import { Suspense } from "react"
import { RegisterForm } from "@/components/auth/register-form"

function RegisterContent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">InsightFlow</h1>
          <p className="mt-2 text-muted-foreground">Sistema de Acompanhamento Estudante-Professor</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
