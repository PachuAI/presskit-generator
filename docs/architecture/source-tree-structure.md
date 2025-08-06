# 10. SOURCE TREE STRUCTURE

### Next.js Enterprise Project Structure

```
presskit-generator/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local.example
├── .env.local                    # Git ignored
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── docs/
│   ├── architecture.md           # Este documento unificado
│   ├── implementation-guide.md
│   ├── prd.md
│   ├── ux-architecture.md
│   └── ux-summary.md
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── images/
│   └── icons/
├── src/                          # Source code root
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles
│   │   ├── loading.tsx           # Global loading UI
│   │   ├── error.tsx             # Global error UI
│   │   ├── not-found.tsx         # 404 page
│   │   │
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── layout.tsx        # Auth layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/          # Protected routes
│   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── presskits/
│   │   │   │   ├── page.tsx      # List presskits
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # View presskit
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── subscription/
│   │   │       ├── page.tsx
│   │   │       └── success/
│   │   │           └── page.tsx
│   │   │
│   │   ├── pre-generator/        # Chat interface
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── p/                    # Public presskits
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                  # API routes
│   │       ├── auth/
│   │       │   ├── signup/
│   │       │   │   └── route.ts
│   │       │   ├── signin/
│   │       │   │   └── route.ts
│   │       │   └── signout/
│   │       │       └── route.ts
│   │       ├── users/
│   │       │   └── profile/
│   │       │       └── route.ts
│   │       ├── presskits/
│   │       │   ├── route.ts      # GET, POST
│   │       │   └── [id]/
│   │       │       ├── route.ts  # GET, PUT, DELETE
│   │       │       ├── publish/
│   │       │       │   └── route.ts
│   │       │       └── media/
│   │       │           └── route.ts
│   │       ├── templates/
│   │       │   └── route.ts
│   │       ├── export/
│   │       │   ├── pdf/
│   │       │   │   └── route.ts
│   │       │   ├── [id]/
│   │       │   │   ├── status/
│   │       │   │   │   └── route.ts
│   │       │   │   └── download/
│   │       │   │       └── route.ts
│   │       │   └── route.ts
│   │       ├── subscription/
│   │       │   ├── create/
│   │       │   │   └── route.ts
│   │       │   ├── cancel/
│   │       │   │   └── route.ts
│   │       │   └── status/
│   │       │       └── route.ts
│   │       ├── chat/
│   │       │   ├── session/
│   │       │   │   └── route.ts
│   │       │   ├── message/
│   │       │   │   └── route.ts
│   │       │   └── generate/
│   │       │       └── route.ts
│   │       └── webhooks/
│   │           └── mercadopago/
│   │               └── route.ts
│   │
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── index.ts          # Barrel exports
│   │   ├── layout/               # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   ├── auth/                 # Authentication components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── auth-provider.tsx
│   │   │   └── protected-route.tsx
│   │   ├── presskit/             # PressKit components
│   │   │   ├── presskit-card.tsx
│   │   │   ├── presskit-editor.tsx
│   │   │   ├── presskit-preview.tsx
│   │   │   ├── template-selector.tsx
│   │   │   ├── media-uploader.tsx
│   │   │   └── export-controls.tsx
│   │   ├── chat/                 # Chat interface components
│   │   │   ├── chat-interface.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── input-suggestions.tsx
│   │   │   └── progress-indicator.tsx
│   │   ├── subscription/         # Subscription components
│   │   │   ├── plan-selector.tsx
│   │   │   ├── feature-comparison.tsx
│   │   │   ├── billing-history.tsx
│   │   │   └── upgrade-prompt.tsx
│   │   └── common/               # Common components
│   │       ├── error-boundary.tsx
│   │       ├── seo-head.tsx
│   │       ├── analytics-tracker.tsx
│   │       └── country-selector.tsx
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── supabase/             # Supabase configuration
│   │   │   ├── client.ts         # Client-side Supabase
│   │   │   ├── server.ts         # Server-side Supabase
│   │   │   └── middleware.ts     # Middleware helpers
│   │   ├── auth/                 # Authentication utilities
│   │   │   ├── auth-service.ts
│   │   │   ├── auth-helpers.ts
│   │   │   └── session-manager.ts
│   │   ├── services/             # Business logic services
│   │   │   ├── user-service.ts
│   │   │   ├── presskit-service.ts
│   │   │   ├── template-service.ts
│   │   │   ├── export-service.ts
│   │   │   ├── payment-service.ts
│   │   │   ├── chat-service.ts
│   │   │   └── analytics-service.ts
│   │   ├── payments/             # Payment integrations
│   │   │   ├── mercadopago-config.ts
│   │   │   ├── mercadopago-service.ts
│   │   │   └── webhook-handlers.ts
│   │   ├── ai/                   # AI integrations
│   │   │   ├── openai-config.ts
│   │   │   ├── chat-service.ts
│   │   │   └── content-generator.ts
│   │   ├── email/                # Email services
│   │   │   ├── resend-config.ts
│   │   │   ├── email-service.ts
│   │   │   └── templates/
│   │   │       ├── welcome.tsx
│   │   │       └── presskit-published.tsx
│   │   ├── storage/              # File storage
│   │   │   ├── storage-service.ts
│   │   │   ├── file-validator.ts
│   │   │   └── image-processor.ts
│   │   ├── pdf/                  # PDF generation
│   │   │   ├── pdf-generator.ts
│   │   │   ├── template-renderer.ts
│   │   │   └── styles/
│   │   ├── validation/           # Data validation
│   │   │   ├── schemas.ts        # Zod schemas
│   │   │   ├── validators.ts
│   │   │   └── sanitizers.ts
│   │   ├── errors/               # Error handling
│   │   │   ├── types.ts          # Custom error classes
│   │   │   ├── handlers.ts       # Error handlers
│   │   │   └── api-error.ts      # API error wrapper
│   │   ├── logging/              # Logging system
│   │   │   ├── logger.ts
│   │   │   ├── formatters.ts
│   │   │   └── transports.ts
│   │   ├── analytics/            # Analytics utilities
│   │   │   ├── tracker.ts
│   │   │   ├── events.ts
│   │   │   └── gdpr-compliance.ts
│   │   └── utils/                # General utilities
│   │       ├── constants.ts
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       ├── country-utils.ts
│   │       ├── date-utils.ts
│   │       └── string-utils.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-supabase.ts
│   │   ├── use-presskit.ts
│   │   ├── use-subscription.ts
│   │   ├── use-chat.ts
│   │   ├── use-media-upload.ts
│   │   ├── use-debounce.ts
│   │   └── use-local-storage.ts
│   │
│   ├── types/                    # TypeScript definitions
│   │   ├── database.ts           # Database types (generated)
│   │   ├── api.ts               # API response types
│   │   ├── auth.ts              # Authentication types
│   │   ├── presskit.ts          # PressKit types
│   │   ├── subscription.ts      # Subscription types
│   │   ├── template.ts          # Template types
│   │   ├── chat.ts              # Chat types
│   │   └── global.ts            # Global type declarations
│   │
│   ├── styles/                   # Styling
│   │   ├── globals.css          # Global styles
│   │   ├── components.css       # Component-specific styles
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   └── middleware.ts             # Next.js middleware
│
├── tests/                        # Test files
│   ├── __mocks__/               # Jest mocks
│   ├── setup/                   # Test setup
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   └── helpers.ts
│   ├── unit/                    # Unit tests
│   │   ├── services/
│   │   ├── components/
│   │   └── utils/
│   ├── integration/             # Integration tests
│   │   ├── api/
│   │   └── workflows/
│   ├── e2e/                     # End-to-end tests
│   │   ├── auth.spec.ts
│   │   ├── presskit-creation.spec.ts
│   │   └── subscription.spec.ts
│   ├── fixtures/                # Test data
│   │   ├── users.json
│   │   ├── presskits.json
│   │   └── templates.json
│   └── factories/               # Test data factories
│       ├── user.factory.ts
│       ├── presskit.factory.ts
│       └── subscription.factory.ts
│
├── scripts/                      # Build and deployment scripts
│   ├── generate-types.ts        # Generate types from Supabase
│   ├── seed-database.ts         # Database seeding
│   ├── migration-helper.ts      # Database migrations
│   └── deploy.sh               # Deployment script
│
└── .github/                     # GitHub Actions
    └── workflows/
        ├── ci.yml              # Continuous Integration
        ├── deploy.yml          # Deployment
        └── security-scan.yml   # Security scanning
```

### Key Configuration Files

#### package.json
```json
{
  "name": "presskit-generator",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "generate-types": "supabase gen types typescript --local > src/types/database.ts"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/ssr": "^0.1.0",
    "mercadopago": "^1.5.17",
    "openai": "^4.24.1",
    "resend": "^2.1.0",
    "zod": "^3.22.4",
    "puppeteer": "^21.6.1",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "tailwindcss": "^3.3.6",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.3.3",
    "eslint": "^8.55.0",
    "eslint-config-next": "^15.0.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "prettier": "^3.1.1",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@playwright/test": "^1.40.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  }
}
```

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost', 'supabase.co', 'supabase.in'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/presskit/:id',
        destination: '/presskits/:id',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

---
