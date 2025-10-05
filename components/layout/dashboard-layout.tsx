import type React from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 pt-6">{children}</main>
      </div>
    </div>
  )
}
