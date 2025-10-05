### README — InsightFlow: Sistema de Acompanhamento de Progresso Estudante-Professor

InsightFlow é um MVP web para acompanhar práticas, relatórios e feedback entre professores e estudantes. Importante: o sistema serve para todos os tipos de professores, por exemplo programação, meditação, música, idiomas, esportes e outros.

Este README segue os critérios do Projeto Integrado e está alinhado ao código do MVP anexado (pastas e rotas do app). Inclui cronograma atualizado, requisitos, arquitetura, modelo de dados, testes e referências.

---

#### Sumário

- Visão Geral
- Status do MVP
- Cronograma (04/08/2025 → 04/10/2025)
- Casos de Uso
- Requisitos Funcionais (RF)
- Requisitos Não-Funcionais (RNF)
- Arquitetura
- Estrutura de Pastas e Rotas
- Modelo de Dados (NoSQL)
- Plano de Testes
- Como Rodar Localmente
- Roadmap
- Critérios de Aceitação (Checklist)
- Licença
- Referências

---

#### Visão Geral

O InsightFlow centraliza:

- Biblioteca de práticas por professor
- Atribuição de práticas a estudantes e turmas (coortes)
- Submissão de relatórios pelos estudantes
- Feedback e revisão de relatórios pelos professores
- Branding por professor (logo e cor)
- Dashboards resumindo progresso e métricas

Benefícios

- Reduz esforço administrativo do professor
- Melhora organização e engajamento do estudante
- Possibilita decisões pedagógicas com base em dados

Citações na Introdução

- McKinsey & Company (2021): 87% dos educadores têm dificuldade em monitorar individualmente alunos em turmas grandes.
- Education Week (2022): Automação pode economizar até 40% do tempo dos professores em tarefas não pedagógicas.

---

#### Status do MVP

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind + shadcn/ui
- Persistência: mock/localStorage (abstraída em storage-service)
- Autenticação: mock (auth-service)
- Navegação por perfil (middleware) e rotas protegidas
- Pronto para evoluir para um backend real (ex. Firebase/REST) sem refatorar UI

Credenciais demo (mock)

- Professor: teacher@demo.com / demo123
- Estudante: student@demo.com / demo123

---

#### Cronograma (04/08/2025 → 04/10/2025)

- 04–10/08: Planejamento, WBS, alinhamento aos CA
- 11–17/08: Casos de uso (15+), RF/RNF macro
- 18–24/08: Diagrama de classes (10+), modelo NoSQL (≥6 entidades)
- 25–31/08: Protótipo navegável (tela inicial + 3 casos principais)
- 01–07/09: Estrutura FE (layout+menus), navegação
- 08–14/09: CRUDs (≥2) e 1 funcionalidade adicional
- 15–21/09: Arquitetura (padrão + C4 contexto), frameworks
- 22–28/09: Plano de testes + execução parcial
- 29/09–02/10: Horas, retrospectiva, vídeo (~5 min)
- 03–04/10: Revisão e entrega final (04/10)

Entrega final: 04 de outubro de 2025

---

#### Casos de Uso

Atores: Professor, Estudante

- Professor (15+ primários)
  - Gerenciar práticas (CRUD), categorizar, duplicar como modelo
  - Atribuir a estudante/turma (coorte), agendar prática
  - Gerenciar estudantes, visualizar/filtrar relatórios
  - Fornecer feedback, marcar relatório como revisado
  - Gerar/revogar convites, configurar branding
  - Exportar relatórios, ver métricas, gerenciar notificações
- Estudante
  - Aceitar convite, visualizar práticas atribuídas
  - Marcar prática concluída, submeter relatório
  - Ver feedback, histórico e dashboard de progresso

---

#### Requisitos Funcionais (RF)

- RF01 Diferenciar perfis Professor e Estudante
- RF02 CRUD de práticas
- RF03 Categorias de práticas
- RF04 Duplicar prática como modelo
- RF05 Atribuir prática a estudante
- RF06 Atribuir prática a turma (coorte)
- RF07 Agendar prática (data/recorrência)
- RF08 Estudante visualiza práticas atribuídas
- RF09 Estudante marca prática como concluída
- RF10 Estudante submete relatório
- RF11 Professor visualiza relatórios
- RF12 Filtros por período/status
- RF13 Feedback textual do professor
- RF14 Marcar relatório como revisado
- RF15 Gerar e revogar convites
- RF16 Estudante aceita convite e vincula-se ao professor
- RF17 Branding (logo/cor primária)
- RF18 Dashboard do professor
- RF19 Dashboard do estudante
- RF20 Exportação de relatórios (CSV/JSON)
- RF21 Notificações configuráveis (professor)
- RF22 Histórico de relatórios
- RF23 Guardas de rota/redirecionamentos por perfil
- RF24 Logout seguro

---

#### Requisitos Não-Funcionais (RNF)

- RNF01 Responsividade (mobile/tablet/desktop)
- RNF02 Segurança de rotas por perfil (middleware)
- RNF03 PT-BR e acessibilidade (WCAG 2.1 – diretrizes essenciais)
- RNF04 TypeScript
- RNF05 Next.js (App Router)
- RNF06 Feedback de carregamento
- RNF07 Abstração de persistência (storage-service)
- RNF08 Padrões de código (ESLint/Prettier)

---

#### Arquitetura

- Padrão: MVVM no frontend
  - View: páginas Next.js (App Router)
  - ViewModel: hooks (use-auth, use-practices, use-reports, use-invites, use-assignments, use-branding)
  - Model: types em TypeScript (lib/types.ts)
- Serviços:
  - auth-service (mock)
  - storage-service (abstração de persistência/localStorage)
  - mock-data (dados de exemplo)
  - middleware (guardas de rota por perfil)
- Observação: pronto para plugar backend real (ex.: Firebase Auth + Firestore)

C4 — Diagrama de Contexto (texto)

- Usuários (Professor, Estudante) → Aplicação Web (Next.js)
- Serviços (auth, storage) → Persistência (mock/local no MVP)
- Middleware protege rotas e redireciona por perfil

---

#### Estrutura de Pastas e Rotas

- app/(auth)/login, app/(auth)/registrar
- app/(dashboard)/dashboard, praticas, alunos, relatorios, convites, configuracoes
- app/(dashboard)/meu-dashboard, minhas-praticas, meus-relatorios
- components/_ (UI e features), hooks/_, lib/_, middleware.ts, styles/_

---

#### Modelo de Dados (NoSQL)

Coleções alvo (NoSQL) para backend real:

- practices {id, teacherId, title, description, categoryId, createdAt, updatedAt}
- practice_categories {id, teacherId, name}
- assignments {id, practiceId, studentId, cohortId?, assignedAt, dueDate?, completed}
- reports {id, assignmentId, studentId, content, status, submittedAt, reviewedAt?}
- feedback_threads {id, reportId, authorId, content, createdAt}
- invites {id, teacherId, token, used, usedBy?, createdAt, expiresAt}
- branding {teacherId, logoUrl?, primaryColor, updatedAt}
- cohorts {id, teacherId, name, createdAt}
- audit_logs {id, actorId, action, entity, entityId, timestamp}

Índices principais

- practices: teacherId, categoryId+createdAt
- assignments: studentId, teacherId, practiceId, cohortId
- reports: assignmentId+submittedAt, studentId
- feedback_threads: reportId+createdAt
- invites: token (único), teacherId+used
- cohorts: teacherId+name

Atende CA-11 e CA-12 (≥6 entidades além de usuários/autenticação).

---

#### Plano de Testes

Exemplos de casos:

- Login professor/estudante → redireciona rotas corretas
- CRUD Práticas → prática aparece em /praticas
- Atribuição a estudante → aparece em /minhas-praticas
- Relatório → visível em /relatorios
- Feedback → visível ao estudante
- Marcar como revisado → status atualizado
- Convite/Aceite → vínculo criado
- Branding → tema aplicado
- Exportação → arquivo gerado
- Guardas de rota → acesso negado/redirecionado

---

#### Como Rodar Localmente

1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd insightflow-mvp
```

2. Instalar dependências

```bash
npm install
# ou
pnpm install
```

3. Iniciar dev server

```bash
npm run dev
# ou
pnpm dev
```

4. Acessar

- http://localhost:3000
Credenciais de demonstração:

  Grupo Programação:
  
  Professor: professor.prog@demo.com / demo123
  Aluno: aluno.prog1@demo.com / demo123
  
  Grupo Meditação:
  
  Professor: professor.med@demo.com / demo123
  Aluno: aluno.med1@demo.com / demo123

---

#### Roadmap

- Backend real (Firebase Auth + Firestore ou API REST)
- Uploads de mídia em relatórios
- Notificações por e-mail/push
- Relatórios avançados e exportações
- Perfis ampliados (ex.: co-instrutor)
- I18n (EN/ES)

---

#### Critérios de Aceitação (Checklist)

- CA-1 Cronograma: ok
- CA-2 Casos de uso (15+ primários, excl. login/cadastro): ok
- CA-3 RF (20–25): ok
- CA-4 RNF (6–8): ok
- CA-5 Interface navegável (tela inicial + 3 casos): ok
- CA-6 Classes (10+): ok
- CA-7 Padrão arquitetural: ok (MVVM)
- CA-8 C4 (Contexto): ok (texto)
- CA-9 Frameworks/Tecnologias: ok
- CA-10 Estrutura FE (layout e menus): ok
- CA-11 Modelo NoSQL: ok
- CA-12 SGBD NoSQL (≥6 entidades além de auth): ok
- CA-13 Autenticação e registro: mock pronto; controle por perfil
- CA-14 Menu do sistema: ok
- CA-15 CRUDs (≥2) com lookup: ok (práticas, categorias)
- CA-16 Funcionalidade adicional: coortes, agendamento, exportação
- CA-17 3 funcionalidades completas: CRUD práticas, atribuição, relatórios/feedback
- CA-18 Plano/Relatório de testes: ok (exemplos)
- CA-19 Apropriação de horas: conforme cronograma
- CA-20 Avaliação retrospectiva: ok
- CA-21 Vídeo final (~5 min): previsto

---

#### Licença

- MIT License — ver LICENSE

---

#### Referências

- MCKINSEY & COMPANY. The State of Education Technology in 2021. McKinsey Insights, 2021.
- EDUCATION WEEK. How Technology Can Free Up Teachers’ Time. Education Week Research Center, 2022.
- VERCEL. Next.js Documentation. https://nextjs.org/docs
- FIREBASE. Firebase Documentation. https://firebase.google.com/docs
- REACT. React Documentation. https://react.dev
- TAILWIND CSS. https://tailwindcss.com/docs
- TYPESCRIPT. https://www.typescriptlang.org/docs
- SHADCN/UI. https://ui.shadcn.com
- C4 MODEL. https://c4model.com
- WCAG 2.1. https://www.w3.org/WAI/WCAG21/quickref/

---

By: Dangeles Lima
