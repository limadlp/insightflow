"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  FileText,
  Mail,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const teacherNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Práticas",
    href: "/praticas",
    icon: BookOpen,
  },
  {
    title: "Alunos",
    href: "/alunos",
    icon: Users,
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileText,
  },
  {
    title: "Convites",
    href: "/convites",
    icon: Mail,
  },
  {
    title: "Conta",
    href: "/conta",
    icon: Settings,
  },
];

const studentNavItems = [
  {
    title: "Meu Dashboard",
    href: "/meu-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Práticas",
    href: "/minhas-praticas",
    icon: BookOpen,
  },
  {
    title: "Relatórios",
    href: "/meus-relatorios",
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = user?.role === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-sidebar">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
