# 3. TECH STACK

### Core Technologies

| Category | Technology | Version | Rationale |
|----------|------------|---------|-----------|
| **Runtime** | Node.js | 20.11.0 LTS | Latest LTS con native fetch, mejor performance |
| **Framework** | Next.js | 15.x | React Server Components, App Router, optimal DX |
| **Language** | TypeScript | 5.3+ | Type safety, mejor DX, AI-friendly |
| **Database** | PostgreSQL | 15+ | Via Supabase, ACID compliance, JSON support |
| **ORM** | Supabase Client | 2.x | Native integration, RLS, real-time |
| **Authentication** | Supabase Auth | Built-in | OAuth, magic links, RLS integration |

### External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Supabase** | Database + Auth + Storage | Primary backend |
| **Vercel** | Hosting + CDN + Functions | Deployment platform |
| **Mercado Pago** | Payment processing | Checkout API v2 |
| **OpenAI** | AI chat + content generation | GPT-4 API |
| **Resend** | Email notifications | Transactional emails |

### Development Tools

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **ESLint** | Code linting | Next.js + TypeScript rules |
| **Prettier** | Code formatting | 2-space, single quotes |
| **Husky** | Git hooks | Pre-commit linting |
| **Jest** | Unit testing | React Testing Library |
| **Playwright** | E2E testing | Multi-browser testing |

---
