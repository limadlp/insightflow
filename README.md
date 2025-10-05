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

#### Licença

- MIT License — ver LICENSE

---

By: Dangeles Lima
