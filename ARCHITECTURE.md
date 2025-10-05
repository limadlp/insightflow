# InsightFlow - Documentação de Arquitetura

## Visão Geral

InsightFlow é um sistema de acompanhamento de progresso estudante-professor desenvolvido como MVP (Minimum Viable Product) utilizando Next.js 14 com App Router, TypeScript e localStorage para persistência de dados.

## Arquitetura

### Padrão Arquitetural

O sistema utiliza uma arquitetura em camadas baseada no padrão **MVVM (Model-View-ViewModel)** combinado com **Backend for Frontend (BFF)**:

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  (React Server Components + Client Components)          │
│  - app/*/page.tsx (páginas)                             │
│  - components/* (componentes reutilizáveis)             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   VIEWMODEL LAYER                        │
│  (Custom Hooks + Context)                               │
│  - hooks/use-auth.ts                                    │
│  - hooks/use-practices.ts                               │
│  - hooks/use-reports.ts                                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    SERVICE LAYER                         │
│  (Business Logic)                                       │
│  - lib/auth-service.ts                                  │
│  - lib/storage-service.ts                               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                     DATA LAYER                           │
│  (Storage Abstraction)                                  │
│  - localStorage (MVP)                                   │
│  - Fácil migração para: Supabase, Neon, PostgreSQL     │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Estrutura de Pastas

\`\`\`
insightflow-mvp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── login/
│   │   └── registrar/
│   ├── (dashboard)/              # Grupo de rotas protegidas
│   │   ├── dashboard/            # Dashboard do professor
│   │   ├── meu-dashboard/        # Dashboard do estudante
│   │   ├── praticas/             # Biblioteca de práticas
│   │   ├── alunos/               # Gerenciamento de alunos
│   │   ├── relatorios/           # Visualização de relatórios
│   │   ├── convites/             # Sistema de convites
│   │   └── configuracoes/        # Branding e configurações
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página inicial (redirect)
│   └── globals.css               # Estilos globais
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── auth/                     # Componentes de autenticação
│   ├── dashboard/                # Componentes de dashboard
│   ├── practices/                # Componentes de práticas
│   └── layout/                   # Componentes de layout
├── lib/                          # Lógica de negócio
│   ├── types.ts                  # Definições de tipos TypeScript
│   ├── mock-data.ts              # Dados mockados (usuários hardcoded)
│   ├── storage-service.ts        # Abstração de armazenamento
│   ├── auth-service.ts           # Serviço de autenticação
│   └── utils.ts                  # Utilitários
├── hooks/                        # Custom React Hooks
│   ├── use-auth.ts               # Hook de autenticação
│   ├── use-practices.ts          # Hook de práticas
│   └── use-reports.ts            # Hook de relatórios
└── middleware.ts                 # Middleware de autenticação
\`\`\`

## Camada de Dados

### Abstração de Storage

A camada de dados foi projetada para facilitar a migração futura para um banco de dados real:

\`\`\`typescript
// storage-service.ts - Interface abstrata
export const practiceStorage = {
  getAll: (): Practice[] => { /* implementação localStorage */ },
  getById: (id: string): Practice | undefined => { /* ... */ },
  create: (practice: Practice): Practice => { /* ... */ },
  update: (id: string, updates: Partial<Practice>): Practice | undefined => { /* ... */ },
  delete: (id: string): boolean => { /* ... */ },
}
\`\`\`

### Migração para Banco de Dados Real

Para migrar para um banco de dados real (ex: Supabase, Neon, PostgreSQL):

1. **Manter a interface dos serviços** - Não alterar as assinaturas dos métodos
2. **Substituir implementação** - Trocar localStorage por chamadas ao banco
3. **Adicionar async/await** - Tornar operações assíncronas
4. **Atualizar hooks** - Adicionar loading states e error handling

Exemplo de migração:

\`\`\`typescript
// ANTES (localStorage)
export const practiceStorage = {
  getAll: (): Practice[] => {
    return getItems<Practice>(STORAGE_KEYS.PRACTICES)
  },
}

// DEPOIS (Supabase)
export const practiceStorage = {
  getAll: async (): Promise<Practice[]> => {
    const { data, error } = await supabase
      .from('practices')
      .select('*')
    
    if (error) throw error
    return data
  },
}
\`\`\`

## Modelo de Dados

### Entidades Principais

\`\`\`
User (Usuário)
├── id: string
├── email: string
├── name: string
├── role: 'teacher' | 'student'
├── teacherId?: string (apenas para students)
└── createdAt: string

Practice (Prática)
├── id: string
├── teacherId: string
├── title: string
├── description: string
├── category: string
├── createdAt: string
└── updatedAt: string

AssignedPractice (Prática Atribuída)
├── id: string
├── practiceId: string
├── studentId: string
├── teacherId: string
├── assignedAt: string
└── completed: boolean

Report (Relatório)
├── id: string
├── studentId: string
├── practiceId: string
├── assignedPracticeId: string
├── content: string
├── feedback?: string
├── submittedAt: string
└── feedbackAt?: string

Invite (Convite)
├── id: string
├── teacherId: string
├── token: string
├── used: boolean
├── usedBy?: string
├── createdAt: string
└── expiresAt: string

Branding (Personalização)
├── teacherId: string
├── logoUrl?: string
├── primaryColor: string
├── subdomain?: string
└── updatedAt: string
\`\`\`

### Relacionamentos

\`\`\`
User (Teacher) 1 ──── * Practice
User (Teacher) 1 ──── * User (Student)
User (Teacher) 1 ──── * Invite
User (Teacher) 1 ──── 1 Branding

Practice 1 ──── * AssignedPractice
User (Student) 1 ──── * AssignedPractice
AssignedPractice 1 ──── * Report
\`\`\`

## Autenticação e Autorização

### Fluxo de Autenticação

1. Usuário envia credenciais (email/senha)
2. `authService.login()` valida contra `MOCK_PASSWORDS`
3. Usuário encontrado é armazenado em `sessionStorage`
4. Middleware verifica autenticação em rotas protegidas
5. Redirecionamento baseado em role (teacher → /dashboard, student → /meu-dashboard)

### Controle de Acesso (RBAC)

\`\`\`typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const user = sessionStorage.getCurrentUser()
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Professores não podem acessar rotas de estudantes
  if (user.role === 'teacher' && request.nextUrl.pathname.startsWith('/meu-dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Estudantes não podem acessar rotas de professores
  if (user.role === 'student' && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/meu-dashboard', request.url))
  }
}
\`\`\`

## Usuários Mockados

### Credenciais de Acesso

**Professor:**
- Email: `professor@demo.com`
- Senha: `demo123`
- ID: `teacher-1`

**Estudantes:**
- Email: `aluno@demo.com` / Senha: `demo123` (ID: `student-1`)
- Email: `aluna@demo.com` / Senha: `demo123` (ID: `student-2`)

Todos os usuários estão hardcoded em `lib/mock-data.ts`.

## Tecnologias Utilizadas

### Frontend
- **Next.js 14+** - Framework React com App Router
- **React 18+** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI

### Persistência
- **localStorage** - Armazenamento local do navegador (MVP)
- Preparado para migração para: Supabase, Neon, PostgreSQL, MongoDB

### Ferramentas
- **ESLint** - Linting
- **Prettier** - Formatação de código

## Funcionalidades Implementadas

### Para Professores
- ✅ Login e autenticação
- ✅ Dashboard com métricas (total de alunos, práticas, relatórios)
- ✅ CRUD de práticas (criar, editar, excluir)
- ✅ Atribuir práticas a estudantes
- ✅ Visualizar relatórios de estudantes
- ✅ Fornecer feedback em relatórios
- ✅ Gerar convites para novos estudantes
- ✅ Personalizar branding (logo, cor primária)

### Para Estudantes
- ✅ Login e autenticação
- ✅ Registro via convite
- ✅ Dashboard com progresso
- ✅ Visualizar práticas atribuídas
- ✅ Submeter relatórios
- ✅ Visualizar feedback do professor
- ✅ Marcar práticas como concluídas

## Segurança

### Considerações de Segurança (MVP)

⚠️ **IMPORTANTE**: Este é um MVP com dados mockados. Em produção:

1. **Senhas**: Devem ser hasheadas com bcrypt/argon2
2. **Tokens**: Usar JWT com expiração e refresh tokens
3. **Validação**: Validar todas as entradas no backend
4. **HTTPS**: Sempre usar HTTPS em produção
5. **CORS**: Configurar CORS adequadamente
6. **Rate Limiting**: Implementar rate limiting em APIs
7. **SQL Injection**: Usar prepared statements/ORMs
8. **XSS**: Sanitizar inputs do usuário

## Performance

### Otimizações Implementadas

- ✅ React Server Components para reduzir bundle size
- ✅ Lazy loading de componentes
- ✅ Memoização de cálculos pesados
- ✅ Debounce em inputs de busca
- ✅ Otimização de re-renders com React.memo

## Testes

### Estratégia de Testes (Futuro)

\`\`\`
├── Unit Tests
│   ├── lib/storage-service.test.ts
│   ├── lib/auth-service.test.ts
│   └── hooks/*.test.ts
├── Integration Tests
│   ├── app/login/page.test.tsx
│   └── app/dashboard/page.test.tsx
└── E2E Tests
    ├── auth.spec.ts
    ├── practices.spec.ts
    └── reports.spec.ts
\`\`\`

## Roadmap

### Próximas Funcionalidades

- [ ] Migração para banco de dados real (Supabase/Neon)
- [ ] Upload de arquivos em relatórios
- [ ] Notificações em tempo real
- [ ] Filtros e busca avançada
- [ ] Exportação de relatórios (PDF)
- [ ] Gráficos de progresso
- [ ] Testes automatizados
- [ ] Deploy em produção (Vercel)

## Conclusão

Esta arquitetura foi projetada para ser simples, elegante e fácil de migrar para um ambiente de produção. A separação clara de responsabilidades e a abstração da camada de dados permitem que o sistema evolua sem grandes refatorações.
