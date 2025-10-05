import type { User, Practice, AssignedPractice, Report, Branding } from "./types"

export const MOCK_USERS: User[] = [
  // Programming Group
  {
    id: "teacher-1",
    email: "professor.prog@demo.com",
    name: "Prof. Carlos Silva",
    role: "teacher",
    createdAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "student-1",
    email: "aluno.prog1@demo.com",
    name: "João Santos",
    role: "student",
    teacherId: "teacher-1",
    createdAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: "student-2",
    email: "aluno.prog2@demo.com",
    name: "Maria Oliveira",
    role: "student",
    teacherId: "teacher-1",
    createdAt: new Date("2024-01-20").toISOString(),
  },
  // Meditation Group
  {
    id: "teacher-2",
    email: "professor.med@demo.com",
    name: "Prof. Ana Luz",
    role: "teacher",
    createdAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "student-3",
    email: "aluno.med1@demo.com",
    name: "Pedro Costa",
    role: "student",
    teacherId: "teacher-2",
    createdAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: "student-4",
    email: "aluno.med2@demo.com",
    name: "Laura Mendes",
    role: "student",
    teacherId: "teacher-2",
    createdAt: new Date("2024-01-20").toISOString(),
  },
]

export const MOCK_PASSWORDS: Record<string, string> = {
  // Programming Group
  "professor.prog@demo.com": "demo123",
  "aluno.prog1@demo.com": "demo123",
  "aluno.prog2@demo.com": "demo123",
  // Meditation Group
  "professor.med@demo.com": "demo123",
  "aluno.med1@demo.com": "demo123",
  "aluno.med2@demo.com": "demo123",
}

export const INITIAL_PRACTICES: Practice[] = [
  // Programming Practices
  {
    id: "practice-1",
    teacherId: "teacher-1",
    title: "Fundamentos de JavaScript",
    description:
      "Estude os conceitos básicos de JavaScript: variáveis, tipos de dados, operadores e estruturas de controle. Complete os exercícios do módulo 1.",
    category: "JavaScript",
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "practice-2",
    teacherId: "teacher-1",
    title: "Criando Componentes React",
    description:
      "Aprenda a criar componentes React funcionais e com hooks. Implemente um componente de lista de tarefas.",
    category: "React",
    createdAt: new Date("2024-01-12").toISOString(),
    updatedAt: new Date("2024-01-12").toISOString(),
  },
  {
    id: "practice-3",
    teacherId: "teacher-1",
    title: "API REST com Node.js",
    description: "Desenvolva uma API REST simples usando Node.js e Express. Implemente rotas CRUD para um recurso.",
    category: "Backend",
    createdAt: new Date("2024-01-14").toISOString(),
    updatedAt: new Date("2024-01-14").toISOString(),
  },
  // Meditation Practices
  {
    id: "practice-4",
    teacherId: "teacher-2",
    title: "Meditação da Respiração Consciente",
    description:
      "Pratique 10 minutos de meditação focando na respiração. Observe a entrada e saída do ar sem julgamentos.",
    category: "Mindfulness",
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "practice-5",
    teacherId: "teacher-2",
    title: "Body Scan - Varredura Corporal",
    description: "Realize uma varredura corporal completa, levando atenção a cada parte do corpo por 15 minutos.",
    category: "Relaxamento",
    createdAt: new Date("2024-01-12").toISOString(),
    updatedAt: new Date("2024-01-12").toISOString(),
  },
  {
    id: "practice-6",
    teacherId: "teacher-2",
    title: "Meditação Caminhando",
    description: "Pratique meditação em movimento, caminhando lentamente e prestando atenção em cada passo.",
    category: "Movimento Consciente",
    createdAt: new Date("2024-01-14").toISOString(),
    updatedAt: new Date("2024-01-14").toISOString(),
  },
]

export const INITIAL_ASSIGNED_PRACTICES: AssignedPractice[] = [
  // Programming assignments
  {
    id: "assigned-1",
    practiceId: "practice-1",
    studentId: "student-1",
    teacherId: "teacher-1",
    assignedAt: new Date("2024-01-15").toISOString(),
    completed: false,
  },
  {
    id: "assigned-2",
    practiceId: "practice-2",
    studentId: "student-1",
    teacherId: "teacher-1",
    assignedAt: new Date("2024-01-16").toISOString(),
    completed: true,
  },
  // Meditation assignments
  {
    id: "assigned-3",
    practiceId: "practice-4",
    studentId: "student-3",
    teacherId: "teacher-2",
    assignedAt: new Date("2024-01-15").toISOString(),
    completed: false,
  },
  {
    id: "assigned-4",
    practiceId: "practice-5",
    studentId: "student-3",
    teacherId: "teacher-2",
    assignedAt: new Date("2024-01-16").toISOString(),
    completed: true,
  },
]

export const INITIAL_REPORTS: Report[] = [
  // Programming report
  {
    id: "report-1",
    studentId: "student-1",
    practiceId: "practice-2",
    assignedPracticeId: "assigned-2",
    content:
      "Completei a prática de componentes React. Aprendi sobre useState e useEffect. Tive dificuldade inicial com o conceito de props, mas depois de alguns exemplos ficou mais claro.",
    feedback: "Ótimo trabalho! Continue praticando com hooks, eles são fundamentais no React moderno.",
    submittedAt: new Date("2024-01-18").toISOString(),
    feedbackAt: new Date("2024-01-19").toISOString(),
  },
  // Meditation report
  {
    id: "report-2",
    studentId: "student-3",
    practiceId: "practice-5",
    assignedPracticeId: "assigned-4",
    content:
      "Completei a prática de body scan. Foi desafiador manter o foco no início, mas consegui relaxar profundamente ao final. Notei tensões que não percebia antes.",
    feedback: "Excelente observação! Continue praticando e a consciência corporal vai aumentar.",
    submittedAt: new Date("2024-01-18").toISOString(),
    feedbackAt: new Date("2024-01-19").toISOString(),
  },
]

export const INITIAL_BRANDING: Branding[] = [
  {
    teacherId: "teacher-1",
    brandName: "CodeMaster Academy",
    primaryColor: "#3b82f6", // Blue for programming
    updatedAt: new Date().toISOString(),
  },
  {
    teacherId: "teacher-2",
    brandName: "Zen Flow Meditation",
    primaryColor: "#8b5cf6", // Purple for meditation
    updatedAt: new Date().toISOString(),
  },
]
