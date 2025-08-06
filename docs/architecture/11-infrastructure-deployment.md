# 11. INFRASTRUCTURE & DEPLOYMENT

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Production Stack                         │
└─────────────────────────────────────────────────────────────────┘

GitHub Repository
    │
    │ git push
    ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Vercel Platform │────▶│ Build Pipeline  │────▶│  Edge Network   │
│                 │     │                 │     │                 │
│ • Git Integration│     │ • Next.js Build │     │ • Global CDN    │
│ • Auto Deploy   │     │ • Type Check    │     │ • Edge Functions│
│ • Preview URLs  │     │ • Tests         │     │ • Static Cache  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         │ API Calls
                                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Platform                           │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PostgreSQL    │  │ Authentication  │  │  File Storage   │ │
│  │   Database      │  │                 │  │                 │ │
│  │                 │  │ • JWT tokens    │  │ • Media files   │ │
│  │ • User data     │  │ • Social login  │  │ • Generated PDFs│ │
│  │ • Press kits    │  │ • Password auth │  │ • Profile pics  │ │
│  │ • Analytics     │  │ • Email verify  │  │ • Press photos  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

External Services
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Mercado Pago   │  │     OpenAI      │  │     Resend      │
│                 │  │                 │  │                 │
│ • Subscriptions │  │ • Chat AI       │  │ • Transactional │
│ • One-time pays │  │ • Content gen   │  │   emails        │
│ • Webhooks      │  │ • GPT-4 API     │  │ • Deliverability│
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Environment Configuration

#### Development Environment
```bash