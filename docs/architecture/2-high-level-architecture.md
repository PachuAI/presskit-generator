# 2. HIGH LEVEL ARCHITECTURE

### Architectural Style
**Serverless Microservices** con JAMstack approach:
- **Frontend**: Next.js 15 con RSC (React Server Components)
- **Backend**: Next.js API Routes como serverless functions
- **Database**: Supabase (PostgreSQL managed)
- **Storage**: Supabase Storage para media files
- **Authentication**: Supabase Auth
- **Payments**: Mercado Pago Checkout API v2

### System Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                    ÍTERA PressKit Generator                     │
└─────────────────────────────────────────────────────────────────┘

User Devices (Mobile 70%, Desktop 30%)
    │
    │ HTTPS/WSS
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Next.js App   │  │  Static Assets  │  │  Edge Functions │ │
│  │   (RSC + SSR)   │  │   (Images/CSS)  │  │  (Middleware)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
    │                      │                      │
    │                      │                      │
    ▼                      ▼                      ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Supabase DB    │  │ Supabase Storage│  │ External APIs   │
│  (PostgreSQL)   │  │  (Media Files)  │  │                 │
│                 │  │                 │  │ • Mercado Pago  │
│ • User data     │  │ • Profile pics  │  │ • OpenAI        │
│ • Presskits     │  │ • Press photos  │  │ • Resend Email  │
│ • Templates     │  │ • Audio files   │  │ • Analytics     │
│ • Analytics     │  │ • Generated PDFs│  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Data Flow Patterns

**Pattern 1: User Registration & Onboarding**
```
User → Supabase Auth → User Profile Creation → Email Verification → Dashboard
```

**Pattern 2: Conversational PressKit Creation**
```
User → Chat Interface → OpenAI API → Structured Data → Template Application → Preview
```

**Pattern 3: Payment Processing**
```
User → Subscription Selection → Mercado Pago → Webhook → DB Update → Feature Access
```

**Pattern 4: Content Export**
```
PressKit Data → Template Engine → PDF Generation → Storage → Download Link
```

---
