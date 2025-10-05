### README — InsightFlow: Sistema de Acompanhamento de Progresso Estudante-Professor

InsightFlow é um MVP web para acompanhar práticas, relatórios e feedback entre professores e estudantes. Importante: o sistema serve para todos os tipos de professores, por exemplo programação, meditação, música, idiomas, esportes e outros.

Este README segue os critérios do Projeto Integrado e está alinhado ao código do MVP anexado (pastas e rotas do app). Inclui cronograma atualizado, requisitos, arquitetura, modelo de dados, testes e referências.

---

### Links do Projeto

- **MVP em Produção**: [https://insightflowhub.vercel.app/](https://insightflowhub.vercel.app/)
- **Vídeo de Demonstração**: [Ver vídeo](https://github.com/limadlp/insightflow/blob/master/docs/video.mp4)
- **Protótipo Navegável (MP4)**: [Ver protótipo](https://github.com/limadlp/insightflow/blob/master/docs/prototipo.mp4)
- **Wireframes no Figma**: [Visualizar designs](https://www.figma.com/design/4dRWWwxhxgvH9XWZn643Fl/InsightFlow?node-id=0-1&t=Atsgp8sco3z1opOS-1)
- **Repositório**: [GitHub](https://github.com/limadlp/insightflow/)
- **Documentação de Arquitetura**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

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

Grupo Programação:

Professor: professor.prog@demo.com / demo123
Aluno: aluno.prog1@demo.com / demo123

Grupo Meditação:

Professor: professor.med@demo.com / demo123
Aluno: aluno.med1@demo.com / demo123

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
